"""
User balances in UZS (whole so'm), kept in PostgreSQL (db.py).

Every change is a row in `ledger`; the balance is cached in `balances` and updated in the
same transaction, so a charge can never take the balance below zero even with parallel requests
(the user's balance row is locked with FOR UPDATE until the transaction ends).
Top-ups are idempotent on the payment's ref: a repeated callback does not credit twice.
"""
from app.core import db


async def balance(user_id: int) -> int:
    return await db.pool().fetchval("SELECT amount FROM balances WHERE user_id = $1", user_id) or 0


async def apply_in(con, user_id: int, delta: int, kind: str, ref: str | None, allow_negative: bool) -> int | None:
    """Add `delta` inside an open transaction. Returns the new balance, or None if refused (low balance / duplicate ref)."""
    await con.execute("INSERT INTO users (id) VALUES ($1) ON CONFLICT (id) DO NOTHING", user_id)  # balances / ledger point at users
    await con.execute("INSERT INTO balances (user_id, amount) VALUES ($1, 0) ON CONFLICT (user_id) DO NOTHING", user_id)
    old = await con.fetchval("SELECT amount FROM balances WHERE user_id = $1 FOR UPDATE", user_id)
    if ref and await con.fetchval("SELECT 1 FROM ledger WHERE ref = $1", ref):
        return None
    new = old + delta
    if new < 0 and not allow_negative:
        return None
    await con.execute("UPDATE balances SET amount = $2 WHERE user_id = $1", user_id, new)
    await con.execute("INSERT INTO ledger (user_id, delta, kind, ref) VALUES ($1, $2, $3, $4)", user_id, delta, kind, ref)
    return new


async def _apply(user_id: int, delta: int, kind: str, ref: str | None, allow_negative: bool) -> int | None:
    async with db.transaction() as con:
        return await apply_in(con, user_id, delta, kind, ref, allow_negative)


async def charge(user_id: int, amount: int, kind: str) -> int | None:
    """Take `amount` so'm for a job. None = not enough money."""
    return await _apply(user_id, -amount, kind, None, allow_negative=False)


async def refund(user_id: int, amount: int, kind: str) -> int | None:
    """Give the money back when a paid job failed."""
    return await _apply(user_id, amount, f"refund:{kind}", None, allow_negative=True)


async def top_up(user_id: int, amount: int, ref: str, kind: str = "topup") -> int | None:
    """Credit a payment (or an admin's correction, which may be negative). None = this ref was already
    counted, or a negative correction is larger than the balance."""
    return await _apply(user_id, amount, kind, ref, allow_negative=False)


async def reconcile() -> list[dict]:
    """Users whose cached balance is not the sum of their ledger. Must always be empty: the worker checks it
    every hour and reports any difference to the log channel."""
    rows = await db.pool().fetch(
        """SELECT coalesce(b.user_id, l.user_id) AS user_id, coalesce(b.amount, 0) AS balance, coalesce(l.total, 0) AS ledger
           FROM balances b FULL JOIN (SELECT user_id, sum(delta) AS total FROM ledger GROUP BY user_id) l ON l.user_id = b.user_id
           WHERE coalesce(b.amount, 0) <> coalesce(l.total, 0)""")
    return [dict(r) for r in rows]

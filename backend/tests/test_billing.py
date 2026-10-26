"""Money: a balance never goes below zero, a payment is credited once, failed jobs are refunded."""
import asyncio

from conftest import add_user

from app.services import billing


async def test_parallel_charges_never_overdraw():
    await add_user(1, balance=30000)
    results = await asyncio.gather(*(billing.charge(1, 5000, "generate") for _ in range(20)))
    assert sum(r is not None for r in results) == 6
    assert await billing.balance(1) == 0


async def test_same_payment_is_credited_once_even_in_parallel():
    await add_user(1)
    results = await asyncio.gather(*(billing.top_up(1, 7000, ref="card:42") for _ in range(10)))
    assert sum(r is not None for r in results) == 1
    assert await billing.balance(1) == 7000


async def test_refund_and_ledger():
    await add_user(1, balance=10000)
    assert await billing.charge(1, 5000, "generate") == 5000
    assert await billing.refund(1, 5000, "generate") == 10000
    from app.core.db import pool
    kinds = [r["kind"] for r in await pool().fetch("SELECT kind FROM ledger WHERE user_id = 1 ORDER BY id")]
    assert kinds == ["topup", "generate", "refund:generate"]


async def test_unknown_user_has_zero_and_cannot_be_charged():
    assert await billing.balance(999) == 0
    assert await billing.charge(999, 1, "generate") is None


async def test_database_itself_refuses_a_negative_balance_and_unknown_states():
    import asyncpg
    import pytest

    from app.core import db
    await add_user(1, balance=1000)
    with pytest.raises(asyncpg.CheckViolationError):
        await db.pool().execute("UPDATE balances SET amount = -1 WHERE user_id = 1")
    with pytest.raises(asyncpg.CheckViolationError):
        await db.pool().execute("INSERT INTO orders (user_id, amount, provider, state) VALUES (1, 100, 'card', 'lost')")
    with pytest.raises(asyncpg.ForeignKeyViolationError):
        await db.pool().execute("INSERT INTO decks (id, user_id, request, content) VALUES ('1', 424242, '{}', '{}')")


async def test_admin_correction_cannot_take_more_than_there_is():
    await add_user(1, balance=1000)
    assert await billing.top_up(1, -5000, ref="admin:x:1", kind="admin") is None
    assert await billing.top_up(1, -400, ref="admin:x:2", kind="admin") == 600


async def test_refused_charge_of_an_unknown_user_leaves_no_rows():
    from app.core import db
    assert await billing.charge(777, 100, "generate") is None
    assert await db.pool().fetchval("SELECT amount FROM balances WHERE user_id = 777") == 0  # user + empty balance, no ledger
    assert await db.pool().fetchval("SELECT count(*) FROM ledger WHERE user_id = 777") == 0


async def test_reconcile_finds_a_balance_that_does_not_match_its_ledger():
    from app.core import db
    await add_user(1, balance=1000)
    assert await billing.reconcile() == []
    await db.pool().execute("UPDATE balances SET amount = 900 WHERE user_id = 1")  # a change that bypassed the ledger
    assert await billing.reconcile() == [{"user_id": 1, "balance": 900, "ledger": 1000}]

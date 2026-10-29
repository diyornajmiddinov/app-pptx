"""
Website growth features: promo codes, invite links and daily visit statistics.

Promo code   the admin panel creates it (amount, uses, expiry); a user redeems it once on the site ->
             ledger kind "promo", ref promo:<id>:<user> (the ref makes a second credit impossible).
Invite link  slidechi.uz/?ref=<code>. A user whose account is new when they first sign in on the site becomes the
             inviter's referral; after the referral's first top-up the inviter gets referral_bonus (app_settings),
             once (ledger ref referral:<referred>). settle() runs hourly in the worker and when the inviter looks.
Statistics   web_stats: counters per Tashkent day; web_visitors: unique visitors as salted hashes, kept 90 days.
"""
import hashlib
import hmac
import re
import secrets

from app.core import db
from app.core.config import settings
from app.services import app_settings, billing

TODAY = "(now() AT TIME ZONE 'Asia/Tashkent')::date"
NEW_ACCOUNT_DAYS = 7  # an account may be referred only while it is this young and has never paid or spent


class PromoError(Exception):
    """str(e): promoNotFound, promoUsed, promoOver."""


def clean_code(code: str) -> str:
    return re.sub(r"\s+", "", code or "").upper()


# ---------------------------------------------------------------- promo codes

async def redeem(user_id: int, code: str) -> tuple[int, int]:
    """Returns (amount added, new balance)."""
    async with db.transaction() as con:
        p = await con.fetchrow("SELECT id, amount, max_uses, uses, active, expires IS NOT NULL AND expires < now() AS expired "
                               "FROM promo_codes WHERE code = $1 FOR UPDATE", clean_code(code))
        if not p or not p["active"] or p["expired"]:
            raise PromoError("promoNotFound")
        if await con.fetchval("SELECT 1 FROM promo_uses WHERE promo_id = $1 AND user_id = $2", p["id"], user_id):
            raise PromoError("promoUsed")
        if p["max_uses"] is not None and p["uses"] >= p["max_uses"]:
            raise PromoError("promoOver")
        new = await billing.apply_in(con, user_id, p["amount"], "promo", f"promo:{p['id']}:{user_id}", True)
        if new is None:  # the ledger ref exists: used before (the row above would have caught it)
            raise PromoError("promoUsed")
        await con.execute("INSERT INTO promo_uses (promo_id, user_id) VALUES ($1, $2)", p["id"], user_id)
        await con.execute("UPDATE promo_codes SET uses = uses + 1 WHERE id = $1", p["id"])
    return p["amount"], new


# ---------------------------------------------------------------- invite links

async def ref_code(user_id: int) -> str:
    """The user's invite code, made on first use."""
    code = await db.pool().fetchval("SELECT code FROM ref_codes WHERE user_id = $1", user_id)
    while not code:
        candidate = secrets.token_urlsafe(6).replace("-", "x").replace("_", "y")
        code = await db.pool().fetchval("INSERT INTO ref_codes (user_id, code) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING code",
                                        user_id, candidate) or await db.pool().fetchval("SELECT code FROM ref_codes WHERE user_id = $1", user_id)
    return code


async def attach(user_id: int, code: str | None) -> bool:
    """At sign-in with ?ref=: only a new account (young, no money moved yet) can be referred, and only once."""
    if not code:
        return False
    referrer = await db.pool().fetchval("SELECT user_id FROM ref_codes WHERE code = $1", code.strip()[:20])
    if not referrer or referrer == user_id:
        return False
    fresh = await db.pool().fetchval(
        "SELECT created > now() - make_interval(days => $2) AND NOT EXISTS (SELECT 1 FROM ledger WHERE user_id = $1) "
        "FROM users WHERE id = $1", user_id, NEW_ACCOUNT_DAYS)
    if not fresh:
        return False
    return await db.pool().fetchval("INSERT INTO referrals (referred_id, referrer_id) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING true",
                                    user_id, referrer) or False


async def settle(referrer_id: int | None = None) -> int:
    """Pay the inviter for every referral that has topped up and was not paid for yet. Returns how many were paid."""
    bonus = (await app_settings.get())["referral_bonus"]
    if bonus <= 0:
        return 0
    q = ("SELECT r.referred_id, r.referrer_id FROM referrals r WHERE r.rewarded IS NULL "
         "AND EXISTS (SELECT 1 FROM ledger l WHERE l.user_id = r.referred_id AND l.kind LIKE 'topup%' AND l.delta > 0)")
    due = await (db.pool().fetch(q + " AND r.referrer_id = $1", referrer_id) if referrer_id else db.pool().fetch(q))
    paid = 0
    for r in due:
        async with db.transaction() as con:
            if not await con.fetchval("UPDATE referrals SET rewarded = now() WHERE referred_id = $1 AND rewarded IS NULL RETURNING 1",
                                      r["referred_id"]):
                continue  # paid by a parallel settle()
            if await billing.apply_in(con, r["referrer_id"], bonus, "referral", f"referral:{r['referred_id']}", True) is not None:
                paid += 1
    return paid


async def referral_info(user_id: int) -> dict:
    row = await db.pool().fetchrow("SELECT count(*) AS invited, count(rewarded) AS paid FROM referrals WHERE referrer_id = $1", user_id)
    return {"code": await ref_code(user_id), "invited": row["invited"], "paid": row["paid"],
            "bonus": (await app_settings.get())["referral_bonus"]}


# ---------------------------------------------------------------- statistics

async def count(metric: str, n: int = 1):
    await db.pool().execute(f"INSERT INTO web_stats (day, metric, value) VALUES ({TODAY}, $1, $2) "
                            "ON CONFLICT (day, metric) DO UPDATE SET value = web_stats.value + excluded.value", metric, n)


def _visitor(ip: str | None, user_agent: str | None) -> str:
    key = hmac.new(b"SlideAI-visitors", settings.bot_token.encode(), hashlib.sha256).digest()
    return hmac.new(key, f"{ip}|{user_agent}".encode(), hashlib.sha256).hexdigest()[:32]


async def visit(ip: str | None, user_agent: str | None):
    """A page view; the first one of a visitor today also counts as a unique visitor."""
    await count("views")
    new = await db.pool().fetchval(f"INSERT INTO web_visitors (day, visitor) VALUES ({TODAY}, $1) ON CONFLICT DO NOTHING RETURNING 1",
                                   _visitor(ip, user_agent))
    if new:
        await count("visitors")


async def purge():
    await db.pool().execute("DELETE FROM web_visitors WHERE day < (now() AT TIME ZONE 'Asia/Tashkent')::date - 90")


METRICS = ("views", "visitors", "signins", "generates")


async def series(days: int) -> list[dict]:
    """One row per day for the last `days` days (0 where nothing happened), for the admin panel's charts."""
    rows = await db.pool().fetch(
        f"""WITH d AS (SELECT generate_series({TODAY} - $1::int + 1, {TODAY}, interval '1 day')::date AS day)
            SELECT d.day, s.metric, coalesce(s.value, 0) AS value FROM d LEFT JOIN web_stats s ON s.day = d.day ORDER BY d.day""", days)
    out: dict[str, dict] = {}
    for r in rows:
        day = out.setdefault(r["day"].isoformat(), {"day": r["day"].isoformat(), **dict.fromkeys(METRICS, 0)})
        if r["metric"] in METRICS:
            day[r["metric"]] = r["value"]
    return list(out.values())

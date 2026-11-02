"""
Top-up bonus campaign (admin panel → Sozlamalar): for the next N hours every top-up — Payme, Click or card — gets
+P% on top. The bonus is a ledger entry of its own (kind "bonus:topup", ref "bonus:<the top-up's ref>"), credited in
the same transaction as the money itself, so it comes exactly once and never without the payment.

    app_settings "topup_bonus" = {"percent": P, "started": epoch, "until": epoch}   ({} — never run; stopped: until = then)

A card payment counts by when the order was made (the user paid then; the admin may approve the screenshot later).
"""
import math
import time
from datetime import datetime

from app.services import app_settings, billing

PERCENT_MAX, HOURS_MAX = 100, 24 * 30


async def current() -> dict | None:
    """The running campaign {percent, started, until}, or None."""
    c = (await app_settings.get()).get("topup_bonus") or {}
    return c if c.get("percent") and not c.get("stopped") and c.get("until", 0) > time.time() else None


def _covers(c: dict, at: float) -> bool:
    return c.get("started", 0) <= at <= c.get("until", 0)


async def credit_in(con, user_id: int, amount: int, ref: str, ordered: datetime | None = None) -> tuple[int, int | None]:
    """Inside the top-up's transaction, after the money was credited: add the campaign's bonus.
    Returns (bonus, new balance) — (0, None) when no campaign covers this payment."""
    c = (await app_settings.get()).get("topup_bonus") or {}
    running = not c.get("stopped") and _covers(c, time.time())
    if not c.get("percent") or not (running or (ordered and _covers(c, ordered.timestamp()))):
        return 0, None
    bonus = amount * int(c["percent"]) // 100
    if bonus <= 0:
        return 0, None
    new = await billing.apply_in(con, user_id, bonus, "bonus:topup", f"bonus:{ref}", True)
    return (bonus, new) if new is not None else (0, None)


async def start(percent: int, hours: int, admin_id: int) -> dict:
    now = int(time.time())
    c = {"percent": percent, "started": now, "until": now + hours * 3600}
    await app_settings.set_many({"topup_bonus": c}, admin_id)
    return c


async def stop(admin_id: int):
    """End it now. The window is kept: a card order made while it ran still gets its bonus when approved later."""
    c = (await app_settings.get()).get("topup_bonus") or {}
    if c.get("until", 0) > time.time():
        await app_settings.set_many({"topup_bonus": {**c, "until": math.ceil(time.time()), "stopped": True}}, admin_id)

"""
Settings the admin panel can change while the bot runs (prices, top-up amounts), in the `app_settings` table.
A key that was never changed falls back to its .env value (config.py). Kept for TTL seconds per process (most
requests need the prices, often twice); a change from the admin panel reaches every process within that time.
"""
import copy
import time

from app.core import db
from app.core.config import settings
from app.services.ai import models


def defaults() -> dict:
    return {"price_generate": settings.price_generate, "price_restyle": settings.price_restyle, "price_paper": settings.price_paper,
            "topup_amounts": list(settings.topup_amounts), "referral_bonus": settings.referral_bonus,
            "first_generate_price": settings.first_generate_price, "ai_model": models.default_choice()}


TTL = 5.0  # s
_cache: tuple[float, dict] | None = None


async def get() -> dict:
    global _cache
    if _cache and time.monotonic() - _cache[0] < TTL:
        return copy.deepcopy(_cache[1])
    rows = await db.pool().fetch("SELECT key, value FROM app_settings")
    values = {**defaults(), **{r["key"]: r["value"] for r in rows if r["key"] in defaults()}}
    _cache = (time.monotonic(), values)
    return copy.deepcopy(values)


def forget():
    """Read the table again on the next get() (after a change; tests)."""
    global _cache
    _cache = None


async def set_many(values: dict, admin_id: int):
    forget()
    async with db.transaction() as con:
        for k, v in values.items():
            if v is None:  # "not set": back to the .env value (a JSONB null cannot be stored)
                await con.execute("DELETE FROM app_settings WHERE key = $1", k)
                continue
            await con.execute("INSERT INTO app_settings (key, value, updated_by) VALUES ($1, $2, $3) "
                              "ON CONFLICT (key) DO UPDATE SET value = excluded.value, updated_by = excluded.updated_by, updated = now()",
                              k, v, admin_id)
    forget()

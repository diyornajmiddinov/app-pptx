"""
Settings the admin panel can change while the bot runs (prices, top-up amounts), in the `app_settings` table.
A key that was never changed falls back to its .env value (config.py). Read on every use, so the bot process
and the API process always agree without a restart.
"""
from app.core import db
from app.core.config import settings


def defaults() -> dict:
    return {"price_generate": settings.price_generate, "price_restyle": settings.price_restyle,
            "topup_amounts": list(settings.topup_amounts), "referral_bonus": settings.referral_bonus,
            "first_generate_price": settings.first_generate_price}


async def get() -> dict:
    rows = await db.pool().fetch("SELECT key, value FROM app_settings")
    return {**defaults(), **{r["key"]: r["value"] for r in rows if r["key"] in defaults()}}


async def set_many(values: dict, admin_id: int):
    async with db.transaction() as con:
        for k, v in values.items():
            if v is None:  # "not set": back to the .env value (a JSONB null cannot be stored)
                await con.execute("DELETE FROM app_settings WHERE key = $1", k)
                continue
            await con.execute("INSERT INTO app_settings (key, value, updated_by) VALUES ($1, $2, $3) "
                              "ON CONFLICT (key) DO UPDATE SET value = excluded.value, updated_by = excluded.updated_by, updated = now()",
                              k, v, admin_id)

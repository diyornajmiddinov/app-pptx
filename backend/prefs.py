"""Users (who opened the bot / Mini App, and when) and their interface language, in the `users` table."""
import db
from texts import LANGS


async def touch(user: dict):
    """Remember a Telegram user (an update's `from`, or the Mini App's initData user) and the time we saw them."""
    if not user.get("id"):
        return
    await db.pool().execute(
        """INSERT INTO users (id, first_name, last_name, username, language_code) VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT (id) DO UPDATE SET first_name = coalesce(excluded.first_name, users.first_name),
               last_name = coalesce(excluded.last_name, users.last_name), username = coalesce(excluded.username, users.username),
               language_code = coalesce(excluded.language_code, users.language_code), last_seen = now()""",
        user["id"], user.get("first_name"), user.get("last_name"), user.get("username"), user.get("language_code"))


async def get_lang(user_id: int, telegram_lang: str | None = None) -> str | None:
    """Saved choice, else the Telegram app language if supported, else None (not chosen yet)."""
    lang = await db.pool().fetchval("SELECT lang FROM users WHERE id = $1", user_id)
    if lang:
        return lang
    code = (telegram_lang or "")[:2]
    return code if code in LANGS else None


async def lang_of(user_id: int, telegram_lang: str | None = None) -> str:
    return await get_lang(user_id, telegram_lang) or "uz"


async def set_lang(user_id: int, lang: str):
    if lang not in LANGS:
        raise ValueError(lang)
    await db.pool().execute("INSERT INTO users (id, lang) VALUES ($1, $2) ON CONFLICT (id) DO UPDATE SET lang = excluded.lang",
                            user_id, lang)


async def has_choice(user_id: int) -> bool:
    return bool(await db.pool().fetchval("SELECT lang FROM users WHERE id = $1", user_id))

"""Users (who opened the bot / Mini App, and when) and their interface language, in the `users` table."""
import os
import time

from app.core import db, telegram
from app.core.config import DATA_DIR
from app.texts import LANGS


async def touch(user: dict):
    """Remember a Telegram user (an update's `from`, or the Mini App's initData user) and the time we saw them.
    The row is written only when something changed or last_seen is 5 minutes old: most requests write nothing."""
    if not user.get("id"):
        return
    await db.pool().execute(
        """INSERT INTO users (id, first_name, last_name, username, language_code) VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT (id) DO UPDATE SET first_name = coalesce(excluded.first_name, users.first_name),
               last_name = coalesce(excluded.last_name, users.last_name), username = coalesce(excluded.username, users.username),
               language_code = coalesce(excluded.language_code, users.language_code), last_seen = now()
           WHERE users.last_seen < now() - interval '5 minutes'
              OR (users.first_name, users.last_name, users.username, users.language_code)
                 IS DISTINCT FROM (coalesce(excluded.first_name, users.first_name), coalesce(excluded.last_name, users.last_name),
                                   coalesce(excluded.username, users.username), coalesce(excluded.language_code, users.language_code))""",
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


AVATARS = DATA_DIR / "avatars"
AVATAR_TTL = 24 * 3600  # s: a changed profile photo shows up within a day
AVATAR_MIN = 160        # px: the smallest size that still looks sharp in the 48 px circle on a phone


def _fresh(path) -> bool:
    try:
        return time.time() - path.stat().st_mtime < AVATAR_TTL
    except OSError:
        return False


async def avatar(user_id: int) -> bytes | None:
    """The user's Telegram profile photo (what the bot may see), for the Mini App when Telegram gives it no photo_url
    (opened from the bottom keyboard). Kept on disk for a day; "no photo" is remembered too, so Telegram is asked
    at most once a day per user. The bot token never leaves the server: the image itself is served."""
    AVATARS.mkdir(parents=True, exist_ok=True)
    img, none = AVATARS / f"{int(user_id)}.jpg", AVATARS / f"{int(user_id)}.none"
    if _fresh(img):
        return img.read_bytes()
    if _fresh(none):
        return None
    photos = (await telegram.call("getUserProfilePhotos", json={"user_id": user_id, "limit": 1}))["result"]["photos"]
    if not photos:
        none.touch(); img.unlink(missing_ok=True)
        return None
    sizes = sorted(photos[0], key=lambda s: s.get("width", 0))
    best = next((s for s in sizes if s.get("width", 0) >= AVATAR_MIN), sizes[-1])
    data = await telegram.download_file(best["file_id"], limit=2 * 1024 * 1024)
    tmp = img.with_suffix(f".{os.getpid()}.tmp")
    tmp.write_bytes(data); tmp.replace(img)
    none.unlink(missing_ok=True)
    return data

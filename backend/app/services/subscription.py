"""
Mandatory channel subscription: with app_settings required_channel set (the admin panel), the bot and the Mini App
serve only members of that channel. The bot must be an administrator of the channel (Telegram tells a channel's
members only to its admins).

    is_member(user_id)   True for members, admins, and whenever the check itself fails (never lock everyone out
                         because the bot lost its rights: the error goes to the log channel instead)
    ask(chat_id, lang)   the "join the channel" message with its two buttons

A confirmed member is not asked Telegram again for MEMBER_TTL seconds (per process: a cache, not a record).
"""
import logging
import re
import time

import httpx

from app.core import telegram
from app.core.config import settings
from app.services import app_settings
from app.texts import t

log = logging.getLogger("subscription")
MEMBER_TTL = 600  # s
MEMBER_STATUSES = {"creator", "administrator", "member"}
_members: dict[int, float] = {}


async def channel() -> tuple[str, str] | None:
    """(chat id or @username, link to join) or None when the subscription is off."""
    cfg = await app_settings.get()
    chat = (cfg.get("required_channel") or "").strip()
    if not chat:
        return None
    link = (cfg.get("required_channel_link") or "").strip() or (f"https://t.me/{chat.lstrip('@')}" if chat.startswith("@") else "")
    return chat, link


def normalize(chat: str) -> str:
    """'https://t.me/name', 't.me/name', 'name', '@name' -> '@name'; a numeric id stays as it is."""
    chat = chat.strip()
    if re.fullmatch(r"-?\d+", chat):
        return chat
    chat = re.sub(r"^(https?://)?(t\.me|telegram\.me)/", "", chat).strip("/")
    return chat if chat.startswith("@") else f"@{chat}"


async def is_member(user_id: int) -> bool:
    ch = await channel()
    if not ch or user_id in settings.admin_ids:
        return True
    if time.time() - _members.get(user_id, 0) < MEMBER_TTL:
        return True
    try:
        m = (await telegram.call("getChatMember", json={"chat_id": ch[0], "user_id": user_id}))["result"]
    except httpx.HTTPStatusError as e:
        log.error("Majburiy obuna tekshirilmadi: %s kanalida bot admin emasmi? Telegram: %s", ch[0], e.response.text[:200])
        return True
    except httpx.HTTPError:  # Telegram unreachable: do not stop the user over it
        return True
    ok = m.get("status") in MEMBER_STATUSES or (m.get("status") == "restricted" and m.get("is_member"))
    if ok:
        _members[user_id] = time.time()
    return bool(ok)


def forget(user_id: int | None = None):
    """Ask Telegram again next time (one user, or everyone after the channel changed)."""
    if user_id is None:
        _members.clear()
    else:
        _members.pop(user_id, None)


def keyboard(lang: str, link: str) -> dict:
    rows = [[{"text": t(lang, "sub_join"), "url": link, "style": "primary"}]] if link else []
    rows.append([{"text": t(lang, "sub_check"), "callback_data": "sub_check", "style": "success"}])
    return {"inline_keyboard": rows}


async def ask(chat_id: int, lang: str):
    ch = await channel()
    await telegram.send_message(chat_id, t(lang, "sub_required"), keyboard(lang, ch[1] if ch else ""))

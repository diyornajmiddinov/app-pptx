"""
The archive channel (app_settings archive_channel, set in the admin panel): a copy of every file the service makes —
presentations, template changes, referat / mustaqil ish (Word and PDF), images -> PDF (bot and site), files sent
from the editor — with who made it and what it is.

    post(kind, user_id, sent=..., path=..., **details)

A file already sent to the user goes by its Telegram file_id (`sent`: the sendDocument answer), so it is not uploaded
again; a file made on the website goes from `path`. The archive never gets in the way: no channel set -> nothing,
any error -> a warning in the log, the user's file is already on its way.
"""
import logging

from app.core import db, telegram
from app.services import app_settings
from app.texts import esc, som

log = logging.getLogger("archive")

KINDS = {
    "generate": "📊 <b>Taqdimot</b>", "restyle": "🎨 <b>Shablon almashtirildi</b>", "referat": "📝 <b>Referat</b>",
    "mustaqil": "📘 <b>Mustaqil ish</b>", "pdf": "🖼 <b>Rasmdan PDF</b>", "editor": "✏️ <b>Muharrirda o'zgartirildi</b>",
}


async def target() -> str | None:
    return ((await app_settings.get()).get("archive_channel") or "").strip() or None


async def _who(user_id: int) -> str:
    u = await db.pool().fetchrow("SELECT first_name, last_name, username FROM users WHERE id = $1", user_id)
    name = " ".join(x for x in ((u or {}).get("first_name"), (u or {}).get("last_name")) if x) or "—"
    at = f" (@{esc(u['username'])})" if u and u["username"] else ""
    return f"👤 {esc(name)}{at} · <code>{user_id}</code>"


def _details(topic: str | None, facts: list[str], price: int | None, via: str | None) -> str:
    lines = []
    if topic:
        lines.append(f"📝 «{esc(topic)}»")
    if facts:
        lines.append(" · ".join(esc(f) for f in facts if f))
    tail = " · ".join(x for x in (som(price) if price is not None else "", {"web": "sayt", "bot": "bot"}.get(via or "", via or "")) if x)
    if tail:
        lines.append(f"💰 {tail}" if price is not None else tail)
    return "\n".join(lines)


def caption(kind: str, who: str, topic: str | None = None, facts: list[str] | None = None,
            price: int | None = None, via: str | None = None) -> str:
    return "\n".join(x for x in (KINDS.get(kind, esc(kind)), who, _details(topic, facts or [], price, via)) if x)


async def post(kind: str, user_id: int, sent: dict | None = None, path: str | None = None, topic: str | None = None,
               facts: list[str] | None = None, price: int | None = None, via: str | None = None):
    try:
        chat = await target()
        if not chat:
            return
        text = caption(kind, await _who(user_id), topic, facts, price, via)
        file_id = (((sent or {}).get("result") or {}).get("document") or {}).get("file_id")
        if file_id:
            await telegram.send_file_id(chat, file_id, "document", text)
        elif path:
            await telegram.send_document(chat, path, text)
    except Exception as e:  # the archive is a copy: it never stops or slows the user's file
        log.warning("archive: %s of user %s not posted: %s", kind, user_id, e)

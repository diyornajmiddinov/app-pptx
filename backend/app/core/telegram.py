"""Minimal Telegram Bot API calls used by the backend and the bot (async, one shared httpx client per process).

When many users act at once Telegram answers 429 "retry after N s": every call waits and tries again (up to 3 times).
A request that never reached Telegram (no connection) is tried again too; anything else is not, so nothing is sent twice.
"""
import asyncio
import copy
import logging
import re

import httpx

from app.core.config import settings

API = "https://api.telegram.org/bot{token}/{method}"
_client: httpx.AsyncClient | None = None


def client() -> httpx.AsyncClient:
    global _client
    if _client is None:
        _client = httpx.AsyncClient(timeout=httpx.Timeout(70, connect=15))  # > getUpdates' 50 s long poll
    return _client


async def close():
    global _client
    if _client is not None:
        await _client.aclose()
        _client = None


log = logging.getLogger("telegram")


# ---------------------------------------------------------------- Telegram's custom (animated) emoji
# An admin sends /emoji with premium emoji (bot/handlers.cmd_emoji): app_settings custom_emoji = {"📊": "<id>", ...}.
# Then every 📊 in an HTML message becomes <tg-emoji>, and a button starting with 📊 gets it as its icon. Telegram
# shows them only if the bot's owner has Telegram Premium (or the bot bought a username on Fragment); a message it
# refuses because of them is sent again with plain emoji.

async def _emoji_map() -> dict[str, str]:
    try:
        from app.services import app_settings  # the database layer, imported late: it imports this module's package
        return (await app_settings.get()).get("custom_emoji") or {}
    except Exception:  # no database (scripts, tests without it): plain emoji
        return {}


def _pattern(emap: dict[str, str]) -> re.Pattern:
    return re.compile("|".join(re.escape(e) for e in sorted(emap, key=len, reverse=True)))


def emoji_text(text: str, emap: dict[str, str]) -> str:
    if not emap or not text:
        return text
    return _pattern(emap).sub(lambda m: f'<tg-emoji emoji-id="{emap[m.group(0)]}">{m.group(0)}</tg-emoji>', text)


def emoji_buttons(markup: dict | None, emap: dict[str, str]) -> dict | None:
    """A button whose text starts with a known emoji: the animated one as its icon, the text without it."""
    if not emap or not markup:
        return markup
    out = copy.deepcopy(markup)
    for rows in (out.get("keyboard") or [], out.get("inline_keyboard") or []):
        for row in rows:
            for b in row:
                if not isinstance(b, dict) or "icon_custom_emoji_id" in b:
                    continue
                first = next((e for e in sorted(emap, key=len, reverse=True) if b.get("text", "").startswith(e)), None)
                if first:
                    b["icon_custom_emoji_id"], b["text"] = emap[first], b["text"][len(first):].lstrip()
    return out


async def _send_dressed(method: str, payload: dict, text_key: str, **kw):
    """Send with custom emoji when they are set up; if Telegram refuses the message (400), once more without them."""
    emap = await _emoji_map() if payload.get("parse_mode") == "HTML" else {}
    if not emap:
        return await call(method, json=payload, **kw)
    dressed = {**payload, text_key: emoji_text(payload.get(text_key, ""), emap)}
    if "reply_markup" in payload:
        dressed["reply_markup"] = emoji_buttons(payload["reply_markup"], emap)
    try:
        return await call(method, json=dressed, **kw)
    except httpx.HTTPStatusError as e:
        if e.response.status_code != 400:
            raise
        log.warning("custom emoji refused by Telegram (%s): sent with plain emoji", e.response.text[:120])
        return await call(method, json=payload, **kw)


RETRIES = 3
MAX_WAIT = 30  # s: a longer retry_after is not waited for


def _retry_after(r: httpx.Response) -> float | None:
    try:
        return float(((r.json() or {}).get("parameters") or {}).get("retry_after") or 1)
    except ValueError:
        return 1


async def call(method: str, **kw):
    for attempt in range(RETRIES + 1):
        for f in (kw.get("files") or {}).values():  # a file being sent again is read from the start
            f[1].seek(0)
        try:
            r = await client().post(API.format(token=settings.bot_token, method=method), **kw)
        except (httpx.ConnectError, httpx.ConnectTimeout, httpx.PoolTimeout):  # not sent at all
            if attempt == RETRIES:
                raise
            await asyncio.sleep(1 + attempt)
            continue
        if r.status_code == 429 and attempt < RETRIES and (wait := _retry_after(r)) is not None and wait <= MAX_WAIT:
            await asyncio.sleep(wait)
            continue
        r.raise_for_status()
        return r.json()
    raise AssertionError("unreachable")


async def send_message(chat_id: int, text: str, reply_markup: dict | None = None, parse_mode: str | None = "HTML"):
    """HTML by default (texts.py); parse_mode=None for text typed by someone (an admin's message) sent as it is."""
    payload = {"chat_id": chat_id, "text": text}
    if reply_markup:
        payload["reply_markup"] = reply_markup
    if parse_mode:
        payload["parse_mode"] = parse_mode
    return await _send_dressed("sendMessage", payload, "text")


async def send_file_id(chat_id: int, file_id: str, kind: str, caption: str = "", reply_markup: dict | None = None):
    """Re-send a photo / document the bot has received (by its file_id), e.g. a payment screenshot to the admins."""
    method, field = ("sendPhoto", "photo") if kind == "photo" else ("sendDocument", "document")
    payload = {"chat_id": chat_id, field: file_id, "caption": caption[:1024], "parse_mode": "HTML"}
    if reply_markup:
        payload["reply_markup"] = reply_markup
    return await _send_dressed(method, payload, "caption")


async def download_file(file_id: str, limit: int = 20 * 1024 * 1024) -> bytes:
    """A file the user sent to the bot (Bot API allows up to 20 MB)."""
    path = (await call("getFile", json={"file_id": file_id}))["result"]["file_path"]
    data = bytearray()
    async with client().stream("GET", f"https://api.telegram.org/file/bot{settings.bot_token}/{path}", timeout=120) as r:
        r.raise_for_status()
        async for chunk in r.aiter_bytes(1 << 16):
            data += chunk
            if len(data) > limit:
                raise ValueError("file too large")
    return bytes(data)


async def edit_caption(chat_id: int, message_id: int, caption: str):
    """Replace a media message's caption and drop its buttons (an admin has decided)."""
    return await call("editMessageCaption", json={"chat_id": chat_id, "message_id": message_id, "caption": caption[:1024], "parse_mode": "HTML",
                                                 "reply_markup": {"inline_keyboard": []}})


async def send_document(chat_id: int, path: str, caption: str = ""):
    """The caption is HTML (texts.py)."""
    with open(path, "rb") as f:
        return await call("sendDocument", data={"chat_id": chat_id, "caption": caption[:1024], "parse_mode": "HTML"},
                          files={"document": (path.split("/")[-1], f)}, timeout=180)


async def answer_callback(callback_id: str, text: str = ""):
    return await call("answerCallbackQuery", json={"callback_query_id": callback_id, "text": text})


async def set_commands_menu(chat_id: int | None = None):
    """The button by the input field opens the command list (Telegram's "Menu"); without chat_id: the default for all."""
    return await call("setChatMenuButton", json={**({"chat_id": chat_id} if chat_id else {}), "menu_button": {"type": "commands"}})

"""Minimal Telegram Bot API calls used by the backend and the bot (async, one shared httpx client per process).

When many users act at once Telegram answers 429 "retry after N s": every call waits and tries again (up to 3 times).
A request that never reached Telegram (no connection) is tried again too; anything else is not, so nothing is sent twice.
"""
import asyncio

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


async def send_message(chat_id: int, text: str, reply_markup: dict | None = None, parse_mode: str | None = None):
    payload = {"chat_id": chat_id, "text": text}
    if reply_markup:
        payload["reply_markup"] = reply_markup
    if parse_mode:
        payload["parse_mode"] = parse_mode
    return await call("sendMessage", json=payload)


async def send_file_id(chat_id: int, file_id: str, kind: str, caption: str = "", reply_markup: dict | None = None):
    """Re-send a photo / document the bot has received (by its file_id), e.g. a payment screenshot to the admins."""
    method, field = ("sendPhoto", "photo") if kind == "photo" else ("sendDocument", "document")
    payload = {"chat_id": chat_id, field: file_id, "caption": caption[:1024]}
    if reply_markup:
        payload["reply_markup"] = reply_markup
    return await call(method, json=payload)


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
    return await call("editMessageCaption", json={"chat_id": chat_id, "message_id": message_id, "caption": caption[:1024],
                                                 "reply_markup": {"inline_keyboard": []}})


async def send_document(chat_id: int, path: str, caption: str = ""):
    with open(path, "rb") as f:
        return await call("sendDocument", data={"chat_id": chat_id, "caption": caption[:1024]},
                          files={"document": (path.split("/")[-1], f)}, timeout=180)


async def answer_callback(callback_id: str, text: str = ""):
    return await call("answerCallbackQuery", json={"callback_query_id": callback_id, "text": text})


async def set_menu_button(chat_id: int, text: str, url: str):
    return await call("setChatMenuButton", json={"chat_id": chat_id, "menu_button": {"type": "web_app", "text": text, "web_app": {"url": url}}})

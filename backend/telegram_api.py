"""Minimal Telegram Bot API calls used by the backend and the bot (async, one shared httpx client per process)."""
import httpx

from config import settings

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


async def call(method: str, **kw):
    r = await client().post(API.format(token=settings.bot_token, method=method), **kw)
    r.raise_for_status()
    return r.json()


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

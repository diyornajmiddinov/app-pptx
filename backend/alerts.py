"""
The log channel: one Telegram channel for daily database backups (ops/backup.py), errors and service restarts.

Which channel: LOG_CHANNEL_ID in .env, else data/log_channel, which the bot writes when an admin adds it to a
channel as an administrator (bot.handle -> my_chat_member). Everything here is synchronous and never raises:
an alert that cannot be sent must not break the code that logged the error.

    alerts.install("backend")          ERROR log records -> the channel (same error at most once per 10 min)
    alerts.post("text")                one message (HTML)
    alerts.post_file(path, caption)    one document (the backup)
"""
import html
import logging
import os
import queue
import threading
import time
import traceback
from pathlib import Path

import httpx

DATA = Path(__file__).resolve().parent / "data"
CHANNEL_FILE = DATA / "log_channel"
API = "https://api.telegram.org/bot{token}/{method}"
REPEAT_AFTER = 600   # s: the same error is reported again only after this
HOURLY_LIMIT = 30    # messages an hour at most, so an error loop cannot flood the channel


def channel_id() -> str | None:
    cid = os.getenv("LOG_CHANNEL_ID", "").strip()
    if cid:
        return cid
    try:
        return CHANNEL_FILE.read_text().strip() or None
    except OSError:
        return None


def set_channel(chat_id: int):
    DATA.mkdir(exist_ok=True)
    CHANNEL_FILE.write_text(str(chat_id))


def _token() -> str:
    return os.getenv("BOT_TOKEN", "")


def _clean(text: str) -> str:
    tok = _token()
    return text.replace(tok, "***") if tok else text


def post(text: str, chat_id: str | None = None) -> bool:
    cid = chat_id or channel_id()
    if not cid or not _token():
        return False
    try:
        r = httpx.post(API.format(token=_token(), method="sendMessage"), timeout=20,
                       json={"chat_id": cid, "text": _clean(text)[:4096], "parse_mode": "HTML", "disable_web_page_preview": True})
        return r.status_code == 200
    except httpx.HTTPError:
        return False


def post_file(path: Path, caption: str = "") -> bool:
    cid = channel_id()
    if not cid or not _token():
        return False
    try:
        with open(path, "rb") as f:
            r = httpx.post(API.format(token=_token(), method="sendDocument"), timeout=300,
                           data={"chat_id": cid, "caption": _clean(caption)[:1024], "parse_mode": "HTML"},
                           files={"document": (path.name, f)})
        return r.status_code == 200
    except (httpx.HTTPError, OSError):
        return False


class ChannelHandler(logging.Handler):
    """ERROR and above -> the channel, from a background thread (logging must never wait for Telegram)."""

    def __init__(self, service: str):
        super().__init__(logging.ERROR)
        self.service, self.q, self.seen, self.sent = service, queue.Queue(maxsize=200), {}, []
        threading.Thread(target=self._worker, daemon=True, name="alerts").start()

    def emit(self, record: logging.LogRecord):
        try:
            exc = record.exc_info[1] if record.exc_info else None
            key = (record.name, record.getMessage()[:200], type(exc).__name__ if exc else "")
            now = time.time()
            if now - self.seen.get(key, 0) < REPEAT_AFTER:
                return
            self.seen[key] = now
            tb = "".join(traceback.format_exception(*record.exc_info))[-2500:] if record.exc_info else ""
            text = (f"🔴 <b>{self.service}</b> · {html.escape(record.levelname)} · {html.escape(record.name)}\n"
                    f"{html.escape(record.getMessage()[:800])}" + (f"\n<pre>{html.escape(tb)}</pre>" if tb else ""))
            self.q.put_nowait(text)
        except Exception:  # never let alerting break logging
            pass

    def _worker(self):
        while True:
            text = self.q.get()
            now = time.time()
            self.sent = [t for t in self.sent if now - t < 3600]
            if len(self.sent) >= HOURLY_LIMIT:
                continue
            self.sent.append(now)
            post(text)


def install(service: str, loggers: tuple[str, ...] = ("", "uvicorn")):
    """Send this process's errors to the channel; `service` names it in the message."""
    h = ChannelHandler(service)
    for name in loggers:
        logging.getLogger(name).addHandler(h)
    return h


def started(service: str):
    """A service came up (after a deploy, a crash or a server reboot): say so, in the background."""
    host = os.uname().nodename
    threading.Thread(target=post, args=(f"🟢 <b>{service}</b> ishga tushdi · {html.escape(host)}",), daemon=True).start()

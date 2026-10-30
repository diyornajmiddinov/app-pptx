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
import re
import threading
import time
import traceback
from pathlib import Path
from typing import Any

import httpx

from app.core.config import DATA_DIR, PROJECT_DIR

DATA = DATA_DIR
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
    url = API.format(token=_token(), method="sendMessage")
    try:
        r = httpx.post(url, timeout=20, json={"chat_id": cid, "text": _clean(text)[:4096], "parse_mode": "HTML", "disable_web_page_preview": True})
        if r.status_code == 400:  # the HTML did not parse (cut tag, odd character): send it as plain text instead
            plain = html.unescape(re.sub(r"<[^>]+>", "", _clean(text)))[:4096]
            r = httpx.post(url, timeout=20, json={"chat_id": cid, "text": plain, "disable_web_page_preview": True})
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


# ---------------------------------------------------------------- error reports: where, what, why

ROOT = PROJECT_DIR  # frames outside the project (libraries) are not "where"
TASHKENT = 5 * 3600


def _chain(exc: BaseException) -> list[BaseException]:
    """The exception and the ones it came from (raise ... from / during handling), outermost first."""
    out: list[BaseException] = []
    seen: set[int] = set()
    cur: BaseException | None = exc
    while cur is not None and id(cur) not in seen:
        seen.add(id(cur)); out.append(cur)
        cur = cur.__cause__ or (None if cur.__suppress_context__ else cur.__context__)
    return out


def _ours(fs: traceback.FrameSummary) -> bool:
    return fs.filename.startswith(str(ROOT)) and "/.venv/" not in fs.filename and "/node_modules/" not in fs.filename


def _where(exc: BaseException) -> tuple[traceback.FrameSummary | None, list[traceback.FrameSummary]]:
    """The deepest line of OUR code in the root cause's traceback, and our call path to it."""
    for e in reversed(_chain(exc)):  # the root cause first: that is where it really went wrong
        frames = [f for f in traceback.extract_tb(e.__traceback__) if _ours(f)]
        if frames:
            return frames[-1], frames
    return None, []


def _http_status(e: BaseException) -> int | None:
    for attr in ("code", "status", "status_code"):
        v = getattr(e, attr, None)
        if isinstance(v, int) and 100 <= v < 600:
            return v
    resp = getattr(e, "response", None)
    v = getattr(resp, "status_code", None)
    return v if isinstance(v, int) else None


def why(exc: BaseException) -> tuple[str, str]:
    """(kind, explanation in Uzbek) for the whole chain: external service / server / our code."""
    chain = _chain(exc)
    text = " | ".join(f"{type(e).__name__}: {e}" for e in chain).lower()
    names = {type(e).__name__ for e in chain}
    status = next((s for s in map(_http_status, chain) if s), None)
    if status is None and (m := re.search(r"\b(gemini|openai|telegram|http)\D{0,12}(40[13]|429|50[0234])\b", text)):
        status = int(m.group(2))  # e.g. "Gemini javob bermadi: Gemini 503 (gemini-3.5-flash)"
    gemini = "gemini" in text or "generativelanguage" in text
    openai = "openai" in text or "api.openai.com" in text
    ai_name = "OpenAI" if openai else "Google Gemini" if gemini else None
    tg = "telegram" in text or "api.telegram.org" in text or "bot was blocked" in text or "chat not found" in text

    if "bot was blocked by the user" in text:
        return "👤 Foydalanuvchi", "Foydalanuvchi botni bloklagan, unga xabar yetkazib bo'lmaydi. Bizda tuzatadigan narsa yo'q."
    if "chat not found" in text or "user is deactivated" in text:
        return "👤 Foydalanuvchi", "Bunday chat yo'q yoki Telegram akkaunti o'chirilgan. Bizda tuzatadigan narsa yo'q."
    if status == 503 or "unavailable" in text or "high demand" in text or "overloaded" in text:
        return "🌐 Tashqi xizmat", ((ai_name or "Tashqi server") + " band (503) — bizning xatomiz emas. "
                                   "Odatda bir necha daqiqada o'tadi. Taqdimot yaratishda bo'lsa, pul foydalanuvchiga avtomatik qaytarildi.")
    if status == 429 or "too many requests" in text or "resource_exhausted" in text or "quota" in text:
        return "🌐 Tashqi xizmat", ("So'rovlar chegarasi (429) — " + ("OpenAI limiti oshgan yoki hisobda pul tugagan: platform.openai.com da Usage va Billing'ni tekshiring."
                                   if openai else "Gemini kvotasi tugagan yoki daqiqalik limit oshgan: AI Studio'da kvota va to'lovni tekshiring."
                                   if gemini else "Telegram juda tez yuborishni to'xtatdi, biroz kutib qayta urinish kerak." if tg else "tashqi xizmat limiti oshgan."))
    if status in (401, 403) and openai:
        return "🔑 Sozlama", "OpenAI API kaliti noto'g'ri, o'chirilgan yoki bloklangan. .env dagi OPENAI_API_KEY ni tekshiring."
    if status in (401, 403) and gemini:
        return "🔑 Sozlama", "Gemini API kaliti noto'g'ri, o'chirilgan yoki bloklangan. .env dagi GEMINI_API_KEY ni tekshiring."
    if status == 401 and tg:
        return "🔑 Sozlama", "Bot tokeni noto'g'ri yoki bekor qilingan (BotFather /revoke). .env dagi BOT_TOKEN ni yangilang."
    if status == 400 and tg:
        return "🌐 Telegram", "Telegram so'rovni rad etdi (400): xabar matni, tugma yoki fayl noto'g'ri formatda. Batafsil — xato matnida."
    if status and status >= 500:
        return "🌐 Tashqi xizmat", f"Tashqi server ichki xato qaytardi ({status}). Odatda vaqtinchalik."
    if "ai kontenti tekshiruvdan o'tmadi" in text:
        return "🤖 AI", "AI 3 urinishda ham matnni slayd chegaralariga sig'dirmadi (juda uzun yoki tuzilmasi noto'g'ri). Pul qaytarildi; tez-tez takrorlansa, prompt yoki chegaralarni ko'rib chiqish kerak."
    if "jsondecodeerror" in text or "to'g'ri json emas" in text:
        return "🤖 AI / tashqi xizmat", "Javob JSON emas yoki chala keldi (masalan, AI javobi uzilib qolgan)."
    if names & {"TimeoutError", "ReadTimeout", "ConnectTimeout", "TimeoutExpired", "PoolTimeout", "WriteTimeout"} or "timed out" in text:
        return "⏱ Vaqt tugadi", ("Tashqi dastur (node / LibreOffice) belgilangan vaqtda tugamadi — server yuklangan bo'lishi mumkin." if "TimeoutExpired" in names
                               else "Tashqi xizmat belgilangan vaqtda javob bermadi (internet sekin yoki xizmat band).")
    if names & {"ConnectError", "ConnectionError", "ConnectionRefusedError", "ConnectionResetError", "RemoteProtocolError", "URLError", "gaierror"}:
        return "🌐 Tarmoq", "Tashqi xizmatga ulanib bo'lmadi: internet, DNS yoki xizmatning o'zi ishlamayapti."
    if any("postgres" in n.lower() or n.startswith("Interface") for n in names) or "asyncpg" in text:
        if "connection" in text or "cannot connect" in text or "connectionrefused" in text:
            return "🗄 Baza", "PostgreSQL bilan aloqa yo'q: baza to'xtagan bo'lishi mumkin (systemctl status postgresql)."
        if "UniqueViolationError" in names:
            return "🗄 Baza", "Bir xil yozuv ikki marta qo'shilmoqchi bo'ldi (UNIQUE). Odatda bir vaqtda kelgan ikki so'rov — ma'lumot buzilmaydi."
        return "🐞 Kod xatosi", "Baza so'rovi xato bilan tugadi (SQL yoki ma'lumot turi noto'g'ri). Ko'rsatilgan qatordagi so'rovni tuzatish kerak."
    if "CalledProcessError" in names:
        cpe: Any = next(e for e in chain if type(e).__name__ == "CalledProcessError")
        lines = [ln.strip() for ln in str(getattr(cpe, "stderr", "") or getattr(cpe, "output", "") or "").splitlines() if ln.strip()]
        prog = Path(str(cpe.cmd[1] if isinstance(cpe.cmd, (list, tuple)) and len(cpe.cmd) > 1 and cpe.cmd[0] == "node" else
                        cpe.cmd[0] if isinstance(cpe.cmd, (list, tuple)) else cpe.cmd)).name
        msg = next((ln for ln in lines if re.match(r"^\w*(Error|Exception)\b", ln)), lines[0] if lines else "")
        at = next((m.group(1) for ln in lines if (m := re.search(r"\((/[^)]*?/(?:engine|backend)/[^)]+)\)", ln))), "")
        where = f" Joyi: {_short(at)}." if at else ""
        return "⚙️ Tashqi dastur", (f"{prog} xato bilan tugadi (kod {cpe.returncode})." + (f" Uning xatosi: {msg[:300]}." if msg else "") + where
                                   + (" Odatda taqdimot ma'lumotida shablon kutmagan narsa bor (bo'sh maydon, noto'g'ri slayd turi)." if prog == "fill.js" else ""))
    if "MemoryError" in names:
        return "⚙️ Server", "Serverda RAM yetmadi. Bir vaqtda juda ko'p ish bajarilgan bo'lishi mumkin."
    if names & {"PermissionError"}:
        return "⚙️ Server", "Faylga yozish yoki o'qishga ruxsat yo'q."
    if names & {"FileNotFoundError"}:
        return "⚙️ Server", "Kerakli fayl topilmadi (o'chirilgan yoki yo'li noto'g'ri)."
    if names & {"OSError"} and ("no space" in text or "disk quota" in text):
        return "⚙️ Server", "Diskda joy qolmadi."
    code = {
        "KeyError": "Ma'lumotda kutilgan maydon yo'q — kod shu kalit bor deb o'ylagan, lekin u kelmagan (tashqi javob o'zgargan yoki kod xatosi).",
        "IndexError": "Ro'yxatdan mavjud bo'lmagan element olinmoqchi bo'ldi (ro'yxat kutilganidan qisqa).",
        "TypeError": "Funksiyaga noto'g'ri turdagi qiymat berildi (masalan, son o'rniga matn yoki None).",
        "AttributeError": "Obyektda bunday xususiyat yo'q — ko'pincha qiymat None bo'lib qolgan.",
        "NameError": "Kodda e'lon qilinmagan nom ishlatilgan.",
        "ZeroDivisionError": "Nolga bo'lish.",
        "ValueError": "Qiymat noto'g'ri formatda yoki ruxsat etilgan oraliqdan tashqarida.",
        "UnboundLocalError": "O'zgaruvchiga qiymat berilmasdan oldin ishlatilgan.",
        "RecursionError": "Funksiya o'zini cheksiz chaqirib qolgan.",
        "AssertionError": "Kodda tekshiruv (assert) bajarilmadi — kutilmagan holat.",
    }
    for e in reversed(chain):
        if type(e).__name__ in code:
            return "🐞 Kod xatosi", code[type(e).__name__] + " Ko'rsatilgan qatorni tuzatish kerak."
    return "❔ Noma'lum", "Bu turdagi xato uchun tayyor izoh yo'q — pastdagi to'liq izga qarang."


def _esc(v) -> str:
    return html.escape(str(v), quote=False)


def _short(path: str) -> str:
    try:
        return str(Path(path).relative_to(ROOT))
    except ValueError:
        return path


def describe(service: str, record: logging.LogRecord) -> str:
    """The channel message for one error: what we were doing, where, what exactly, why, and the full trace."""
    when = time.strftime("%d.%m.%Y %H:%M:%S", time.gmtime(record.created + TASHKENT))
    head = f"🔴 <b>{_esc(service)}</b> · xato · {when}\n<b>Amal:</b> {_esc(record.getMessage()[:500])}"
    if not record.exc_info or not record.exc_info[1]:
        loc = f"{_short(record.pathname)}:{record.lineno}, {record.funcName}()"
        return head + f"\n📍 <b>Qayerda:</b> <code>{_esc(loc)}</code>"
    exc = record.exc_info[1]
    chain = _chain(exc)
    root = chain[-1]
    frame, path = _where(exc)
    kind, reason = why(exc)
    parts = [head]
    if frame:
        parts.append(f"📍 <b>Qayerda:</b> <code>{_esc(_short(frame.filename))}:{frame.lineno}</code>, <code>{_esc(frame.name)}()</code>")
        if frame.line:
            parts.append(f"<pre>{_esc(frame.line.strip()[:300])}</pre>")
    parts.append(f"❓ <b>Nima:</b> <code>{_esc(type(root).__name__)}</code>: {_esc(str(root)[:600]) or '—'}")
    if len(chain) > 1:
        parts.append("↪️ <b>Natijada:</b> " + " → ".join(f"<code>{_esc(type(e).__name__)}</code>" for e in reversed(chain[:-1])))
    parts.append(f"💡 <b>Nega ({_esc(kind)}):</b> {_esc(reason)}")
    if len(path) > 1:
        steps = " → ".join(f"{Path(f.filename).name}:{f.lineno} {f.name}" for f in path[-6:])
        parts.append(f"🧭 <b>Chaqiruvlar:</b> <code>{_esc(steps)}</code>")
    tb = "".join(traceback.format_exception(*record.exc_info))
    budget = 4000 - sum(len(p) for p in parts) - 80
    esc = _esc(tb[-budget:]) if budget > 200 else ""
    while len(esc) > budget > 200:  # escaping makes it longer: trim until it fits Telegram's 4096
        budget -= 200; esc = _esc(tb[-budget:])
    if esc:
        parts.append(f"<blockquote expandable><pre>{esc}</pre></blockquote>")
    return "\n".join(parts)


class ChannelHandler(logging.Handler):
    """ERROR and above -> the channel, from a background thread (logging must never wait for Telegram)."""

    def __init__(self, service: str):
        super().__init__(logging.ERROR)
        self.service = service
        self.q: queue.Queue[str] = queue.Queue(maxsize=200)
        self.seen: dict[tuple, float] = {}
        self.sent: list[float] = []
        threading.Thread(target=self._worker, daemon=True, name="alerts").start()

    def emit(self, record: logging.LogRecord):
        try:
            exc = record.exc_info[1] if record.exc_info else None
            key = (record.name, record.getMessage()[:200], type(exc).__name__ if exc else "")
            now = time.time()
            if now - self.seen.get(key, 0) < REPEAT_AFTER:
                return
            self.seen[key] = now
            self.q.put_nowait(describe(self.service, record))
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
    threading.Thread(target=post, args=(f"🟢 <b>{service}</b> ishga tushdi · {_esc(host)}",), daemon=True).start()

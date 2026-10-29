"""
Website API (slidechi.uz, the web/ project). Sign-in is a code from the bot (services/web_auth.py), so the site
works on the bot account: the same balance, decks and top-up orders. The session is an httpOnly cookie (page
scripts cannot read it, so an XSS cannot steal it); SameSite=Strict plus the Origin check on every POST stop CSRF.

POST /api/web/login, /api/web/verify      code to the Telegram chat -> session cookie
POST /api/web/logout                      this browser, or {"everywhere": true}
GET  /api/web/config                      prices, top-up amounts, card payment on/off (no sign-in needed)
GET  /api/web/me                          user, balance, prices
GET  /api/web/decks, /api/web/jobs        presentations; paid work still in the queue or just finished
GET  /api/web/decks/{id}/download         the .pptx, drawn from the saved content
POST /api/web/generate, /api/web/restyle  charged now, drawn by the worker (the bot also sends the file to the chat)
GET  /api/web/editor                      signed link to the editor (editor.html)
GET/POST /api/web/topup, POST /api/web/topup/{order}/receipt   card transfer: order -> receipt image -> admins
GET  /api/web/history                     the balance's ledger
POST /api/web/pdf                         images -> one PDF, returned at once (PDFS_PER_DAY per user)
"""
import asyncio
import io
import logging
import shutil
import tempfile
from pathlib import Path
from typing import Literal

from fastapi import APIRouter, Cookie, Depends, File, Form, Header, HTTPException, Request, Response, UploadFile
from fastapi.responses import FileResponse
from PIL import Image
from pydantic import BaseModel, Field
from starlette.background import BackgroundTask
from starlette.concurrency import run_in_threadpool

from app.bot.money import card_display, receive_screenshot
from app.core import db, telegram
from app.core.auth import make_editor_token
from app.core.config import settings
from app.core.telegram import send_message
from app.services import app_settings, billing, decks, jobs, payments, web_auth
from app.services import images_pdf as pdfs
from app.services.ai.render import render_sync
from app.services.users import lang_of

log = logging.getLogger("web")
COOKIE = "__Host-sid"  # __Host-: only over HTTPS, only for this exact host, path /


def same_site(request: Request, origin: str | None = Header(None)):
    """A POST must come from the site's own pages (browsers always send Origin with one)."""
    if request.method != "GET" and settings.site_url and origin != settings.site_url.rstrip("/"):
        raise HTTPException(403, "badOrigin")


router = APIRouter(prefix="/api/web", dependencies=[Depends(same_site)])
PPTX = "application/vnd.openxmlformats-officedocument.presentationml.presentation"
MAX_RECEIPT = 10 * 1024 * 1024
MAX_PDF_IMAGE = 20 * 1024 * 1024
PDFS_PER_DAY = 20
_drawing = asyncio.Semaphore(1)  # downloads are drawn by node one at a time: the server has 2 CPUs and 2 GB

# what the bot writes to the user's chat on behalf of the site
TEXTS = {
    "uz": {"code": "🔐 slidechi.uz saytiga kirish kodi: <code>{code}</code>\n\nKod 5 daqiqa amal qiladi. Uni hech kimga bermang. "
                   "Kirishni siz so'ramagan bo'lsangiz, bu xabarga e'tibor bermang.",
           "signed_in": "✅ slidechi.uz saytiga kirildi.\n{device}\n\nBu siz bo'lmasangiz, saytda «Barcha qurilmalardan chiqish» tugmasini bosing.",
           "receipt": "Saytdan yuborilgan chek · {code}"},
    "ru": {"code": "🔐 Код для входа на slidechi.uz: <code>{code}</code>\n\nКод действует 5 минут. Никому его не сообщайте. "
                   "Если вы не запрашивали вход, просто проигнорируйте это сообщение.",
           "signed_in": "✅ Выполнен вход на slidechi.uz.\n{device}\n\nЕсли это были не вы, нажмите на сайте «Выйти на всех устройствах».",
           "receipt": "Чек, отправленный с сайта · {code}"},
    "en": {"code": "🔐 Your slidechi.uz sign-in code: <code>{code}</code>\n\nThe code is valid for 5 minutes. Do not share it. "
                   "If you did not ask to sign in, ignore this message.",
           "signed_in": "✅ Signed in to slidechi.uz.\n{device}\n\nIf this was not you, press “Sign out everywhere” on the site.",
           "receipt": "Receipt sent from the website · {code}"},
}
AUTH_STATUS = {"notFound": 404, "tooMany": 429, "wait": 429, "expired": 410, "badCode": 401}


def _ip(request: Request) -> str | None:
    return request.client.host if request.client else None  # uvicorn --proxy-headers: the visitor's address behind nginx


async def web_user(sid: str | None = Cookie(None, alias=COOKIE)) -> int:
    uid = await web_auth.session(sid or "")
    if uid is None:
        raise HTTPException(401, "signedOut")
    return uid


def _device(user_agent: str | None) -> str:
    ua = user_agent or ""
    os_ = next((n for k, n in (("Android", "Android"), ("iPhone", "iPhone"), ("iPad", "iPad"), ("Windows", "Windows"),
                                ("Mac OS", "macOS"), ("Linux", "Linux")) if k in ua), "")
    br = next((n for k, n in (("Edg/", "Edge"), ("OPR/", "Opera"), ("YaBrowser", "Yandex"), ("Firefox/", "Firefox"),
                               ("Chrome/", "Chrome"), ("Safari/", "Safari")) if k in ua), "")
    return " · ".join(x for x in (br, os_) if x) or "—"


# ---------------------------------------------------------------- sign-in

class LoginRequest(BaseModel):
    login: str = Field(min_length=1, max_length=64)


class VerifyRequest(BaseModel):
    login_id: str = Field(min_length=10, max_length=40)
    code: str = Field(min_length=6, max_length=8)


class LogoutRequest(BaseModel):
    everywhere: bool = False


@router.post("/login")
async def login(req: LoginRequest, request: Request):
    try:
        login_id, uid, code = await web_auth.start(req.login, _ip(request))
    except web_auth.AuthError as e:
        raise HTTPException(AUTH_STATUS[str(e)], str(e)) from e
    try:
        await send_message(uid, TEXTS[await lang_of(uid)]["code"].format(code=code), parse_mode="HTML")
    except Exception as e:  # the user has blocked the bot: the code cannot reach them
        log.warning("could not send the sign-in code to %s", uid)
        raise HTTPException(409, "botBlocked") from e
    return {"login_id": login_id, "ttl": web_auth.CODE_TTL}


@router.post("/verify")
async def verify(req: VerifyRequest, request: Request, response: Response, user_agent: str | None = Header(None)):
    try:
        token, uid = await web_auth.verify(req.login_id, req.code, _ip(request), user_agent)
    except web_auth.AuthError as e:
        raise HTTPException(AUTH_STATUS[str(e)], str(e)) from e
    try:
        await send_message(uid, TEXTS[await lang_of(uid)]["signed_in"].format(device=_device(user_agent)))
    except Exception:
        pass  # signing in must not fail because of the notice
    response.set_cookie(COOKIE, token, max_age=web_auth.SESSION_DAYS * 86400, path="/", secure=True, httponly=True, samesite="strict")
    return {"ok": True}


@router.post("/logout")
async def logout(req: LogoutRequest, response: Response, sid: str | None = Cookie(None, alias=COOKIE)):
    await web_auth.logout(sid or "", req.everywhere)
    response.delete_cookie(COOKIE, path="/", secure=True, httponly=True, samesite="strict")
    return {"ok": True}


# ---------------------------------------------------------------- account

async def _prices() -> dict:
    cfg = await app_settings.get()
    return {"prices": {"generate": cfg["price_generate"], "restyle": cfg["price_restyle"]},
            "topup_amounts": cfg["topup_amounts"], "card": "card" in payments.providers()}


@router.get("/config")
async def config():
    return await _prices()


@router.get("/me")
async def me(uid: int = Depends(web_user)):
    u = await db.pool().fetchrow("SELECT first_name, last_name, username, lang FROM users WHERE id = $1", uid)
    return {"user": {"id": uid, **dict(u)}, "lang": u["lang"] or "uz", "balance": await billing.balance(uid), **await _prices()}


@router.get("/history")
async def history(uid: int = Depends(web_user)):
    rows = await db.pool().fetch("SELECT delta, kind, extract(epoch FROM created)::bigint AS created FROM ledger "
                                 "WHERE user_id = $1 ORDER BY id DESC LIMIT 100", uid)
    return {"items": [dict(r) for r in rows]}


# ---------------------------------------------------------------- presentations

class GenerateRequest(BaseModel):
    template_id: int = Field(ge=1, le=40)
    slide_count: int = Field(ge=6, le=30)
    language: Literal["uz", "ru", "en"] = "uz"
    topic: str = Field(min_length=3, max_length=200)
    author: str = Field("", max_length=80)
    org: str = Field("", max_length=120)
    loc: str = Field("", max_length=60)
    year: str = Field("", max_length=10)


class RestyleRequest(BaseModel):
    template_id: int = Field(ge=1, le=40)
    deck_id: str = Field(pattern=r"^\d{1,20}$")


async def _charge(uid: int, price: int, kind: str):
    if await billing.charge(uid, price, kind) is None:
        raise HTTPException(402, "lowBalance")


@router.post("/generate", status_code=202)
async def generate(req: GenerateRequest, uid: int = Depends(web_user)):
    price = (await app_settings.get())["price_generate"]  # fixed at payment: a later price change does not alter the refund
    await _charge(uid, price, "generate")
    job_id, ahead = await jobs.enqueue("generate", uid, {"user_id": uid, **req.model_dump()}, price)
    return {"job": job_id, "ahead": ahead}


@router.post("/restyle", status_code=202)
async def restyle(req: RestyleRequest, uid: int = Depends(web_user)):
    deck = await decks.load(uid, req.deck_id)
    if not deck:
        raise HTTPException(404, "notFound")
    if deck["request"]["template_id"] == req.template_id:
        raise HTTPException(422, "sameTemplate")
    price = (await app_settings.get())["price_restyle"]
    await _charge(uid, price, "restyle")
    job_id, ahead = await jobs.enqueue("restyle", uid, {"deck_id": req.deck_id, "template_id": req.template_id}, price)
    return {"job": job_id, "ahead": ahead}


@router.get("/decks")
async def list_decks(uid: int = Depends(web_user)):
    return {"decks": await decks.list_all(uid)}


@router.get("/jobs")
async def list_jobs(uid: int = Depends(web_user)):
    """Work from the last day: what is still queued / drawing, and what just finished or failed (refunded)."""
    rows = await db.pool().fetch(
        """SELECT j.id, j.kind, j.state, coalesce(j.payload->>'topic', d.content->'meta'->>'topic') AS topic,
                  (j.payload->>'template_id')::int AS template_id, extract(epoch FROM j.created)::bigint AS created,
                  (SELECT count(*) FROM jobs a WHERE a.state IN ('queued', 'running') AND a.id < j.id) AS ahead
           FROM jobs j LEFT JOIN decks d ON d.id = j.payload->>'deck_id' AND d.user_id = j.user_id
           WHERE j.user_id = $1 AND j.created > now() - interval '1 day' ORDER BY j.id DESC LIMIT 20""", uid)
    return {"jobs": [dict(r) for r in rows]}


def _safe_name(text: str) -> str:
    return pdfs.clean_name(text) or "taqdimot"


@router.get("/decks/{deck_id}/download")
async def download(deck_id: str, uid: int = Depends(web_user)):
    deck = await decks.load(uid, deck_id) if deck_id.isdigit() else None
    if not deck:
        raise HTTPException(404, "notFound")
    tmp = Path(tempfile.mkdtemp(prefix="slideai-web-"))
    try:
        async with _drawing:
            path = await run_in_threadpool(render_sync, deck["content"], deck["request"]["template_id"], tmp / "deck.pptx")
    except Exception:
        shutil.rmtree(tmp, ignore_errors=True)
        raise
    return FileResponse(path, filename=f"{_safe_name(deck['content']['meta']['topic'])}.pptx", media_type=PPTX,
                        background=BackgroundTask(shutil.rmtree, tmp, ignore_errors=True))


@router.get("/editor")
async def editor_link(uid: int = Depends(web_user)):
    return {"url": f"/editor.html#t={make_editor_token(uid)}&lang={await lang_of(uid)}"}


# ---------------------------------------------------------------- top-up by card transfer

class TopupRequest(BaseModel):
    amount: int = Field(gt=0)


def _order_out(o) -> dict:
    return {"id": o["id"], "code": payments.payment_code(o["id"]), "amount": o["amount"], "state": o["state"],
            "created": o["created"]}


@router.get("/topup")
async def topup_orders(uid: int = Depends(web_user)):
    rows = await db.pool().fetch("SELECT id, amount, state, extract(epoch FROM created)::bigint AS created FROM orders "
                                 "WHERE user_id = $1 AND provider = 'card' ORDER BY id DESC LIMIT 20", uid)
    return {"orders": [_order_out(r) for r in rows],
            "card": {"number": card_display(settings.card_number), "holder": settings.card_holder} if settings.card_number else None}


@router.post("/topup")
async def topup(req: TopupRequest, uid: int = Depends(web_user)):
    if "card" not in payments.providers():
        raise HTTPException(503, "noCard")
    if req.amount not in (await app_settings.get())["topup_amounts"]:
        raise HTTPException(422, "badAmount")
    order_id = await payments.create_order(uid, req.amount, "card")
    return {"id": order_id, "code": payments.payment_code(order_id), "amount": req.amount, "state": "new",
            "card": {"number": card_display(settings.card_number), "holder": settings.card_holder}}


@router.post("/topup/{order_id}/receipt")
async def receipt(order_id: int, request: Request, uid: int = Depends(web_user)):
    """The receipt image goes to the user's chat with the bot (that gives it a Telegram file_id), and from there to
    the admins with the same confirm / reject buttons as a screenshot sent in the bot."""
    state = await db.pool().fetchval("SELECT state FROM orders WHERE id = $1 AND user_id = $2 AND provider = 'card'", order_id, uid)
    if state not in ("new", "review"):
        raise HTTPException(404 if state is None else 409, "notFound" if state is None else "decided")
    data = bytearray()
    async for chunk in request.stream():
        data += chunk
        if len(data) > MAX_RECEIPT:
            raise HTTPException(413, "tooBig")
    try:
        Image.open(io.BytesIO(data)).verify()
    except Exception as e:
        raise HTTPException(422, "notImage") from e
    lang = await lang_of(uid)
    code = payments.payment_code(order_id)
    try:
        sent = await telegram.call("sendPhoto", data={"chat_id": uid, "caption": TEXTS[lang]["receipt"].format(code=code)},
                                   files={"photo": ("receipt.jpg", bytes(data))}, timeout=120)
        file_id = sent["result"]["photo"][-1]["file_id"]
    except Exception as e:
        log.warning("could not pass the receipt of order %s through the bot", order_id)
        raise HTTPException(409, "botBlocked") from e
    u = await db.pool().fetchrow("SELECT id, first_name, last_name, username FROM users WHERE id = $1", uid)
    await receive_screenshot(uid, dict(u), file_id, "photo", code, lang)
    return {"id": order_id, "code": code, "state": "review"}


# ---------------------------------------------------------------- images -> PDF

def _build_pdf(paths: list[Path], out: Path) -> tuple[int, int]:
    """One A4 page per image (the bot's writer); returns (pages, skipped)."""
    skipped = 0
    with open(out, "wb") as f:
        pdf = pdfs.PdfWriter(f)
        for p in paths:  # one image in memory at a time
            try:
                pdf.page(*pdfs.prepare(p.read_bytes()))
            except Exception:
                skipped += 1
        if pdf.pages:
            pdf.close()
    return len(pdf.pages), skipped


def _save(upload: UploadFile, path: Path):
    with path.open("wb") as out:
        shutil.copyfileobj(upload.file, out)


@router.post("/pdf")
async def make_pdf(files: list[UploadFile] = File(...), name: str = Form(""), uid: int = Depends(web_user)):
    if not 1 <= len(files) <= pdfs.MAX_IMAGES:
        raise HTTPException(422, "pdfCount")
    if await web_auth.count("pdf", user_id=uid, seconds=86400) >= PDFS_PER_DAY:
        raise HTTPException(429, "pdfLimit")
    tmp = Path(tempfile.mkdtemp(prefix="slideai-web-"))
    try:
        paths = []
        for i, f in enumerate(files):
            if (f.size or 0) > MAX_PDF_IMAGE:
                raise HTTPException(413, "tooBig")
            p = tmp / f"{i:03d}"
            await run_in_threadpool(_save, f, p)
            paths.append(p)
        out = tmp / "out.pdf"
        pages, skipped = await run_in_threadpool(_build_pdf, paths, out)
        if not pages:
            raise HTTPException(422, "notImage")
    except BaseException:
        shutil.rmtree(tmp, ignore_errors=True)
        raise
    await web_auth.note("pdf", uid, None)
    return FileResponse(out, filename=f"{pdfs.clean_name(name) or 'rasmlar'}.pdf", media_type="application/pdf",
                        headers={"X-Skipped": str(skipped)}, background=BackgroundTask(shutil.rmtree, tmp, ignore_errors=True))


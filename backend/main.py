"""
SlideAI backend (FastAPI).

POST /api/generate   — called by the Telegram Mini App (MainButton). Verifies Telegram
                       initData, queues generation, the bot later sends the .pptx to the chat.
POST /api/restyle    — any of the user's presentations (deck_id) in another template:
                       one short AI call adapts tone/length to the new template's style passport.
GET  /api/decks      — all presentations of the user, newest first (Mini App: "Mening taqdimotlarim").
GET/POST /api/me     — the user's language (chosen in the bot or in the Mini App); GET also returns
                       the UZS balance and prices. Money is added only in the bot (/balance: Payme, Click, card).
POST /telegram/webhook — bot updates (language choice, /start, /help).
POST /api/pay/payme  — Payme Merchant API (JSON-RPC), POST /api/pay/click/{prepare,complete} — Click SHOP API:
                       the providers confirm top-ups paid through the links the bot sends (payments.py).
/api/editor/...      — desktop presentation editor for ANY .pptx (editor.py). It runs in a normal browser
                       (editor.html) with a signed link from the bot / Mini App instead of initData.
GET  /api/templates  — the 40 templates (id, name, category, style).
GET  /health
/api/admin/...       — admin panel (admin.py; admin.html opened from the bot's /admin link).
Users, languages, balances, payments and decks are in PostgreSQL (db.py, async); photos and editor files in data/.
"""
import asyncio
import json
import logging
import re
import shutil
import tempfile
import time
from contextlib import asynccontextmanager
from urllib.parse import parse_qsl
from pathlib import Path
from typing import Literal

from fastapi import BackgroundTasks, Depends, FastAPI, Header, HTTPException, Request
from fastapi.responses import FileResponse, JSONResponse
from starlette.concurrency import run_in_threadpool
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

import admin
import alerts
import appconfig
import billing
import bot
import content_ai
import db
import decks
import editor
import payments
import telegram_api
from prefs import lang_of, set_lang, touch
from texts import som, t
from config import settings
from telegram_api import send_document, send_message
from telegram_auth import editor_user, telegram_user

log = logging.getLogger("slideai")
logging.getLogger("httpx").setLevel(logging.WARNING)  # its request lines contain the bot token


TMP = Path(tempfile.gettempdir())


def _drop_tmp(path: Path):
    """Remove a job's own temp folder (/tmp/slideai-*) once its file has been sent."""
    if path.parent == TMP and path.name.startswith("slideai-"):
        shutil.rmtree(path, ignore_errors=True)


def housekeeping():
    """Hourly: temp folders of jobs that died half-way (older than 3 h), and editor background layers
    nobody has looked at for 14 days (they are drawn again on request)."""
    now = time.time()
    for p in TMP.glob("slideai-*"):
        try:
            if now - p.stat().st_mtime > 3 * 3600:
                shutil.rmtree(p, ignore_errors=True)
        except OSError:
            pass
    for png in DATA.glob("*/edits/*/layers/*.png"):
        try:
            if now - png.stat().st_atime > 14 * 86400 and now - png.stat().st_mtime > 14 * 86400:
                png.unlink()
        except OSError:
            pass


async def _housekeeping_loop():
    while True:
        try:
            await run_in_threadpool(housekeeping)
        except Exception:
            log.exception("housekeeping failed")
        await asyncio.sleep(3600)


@asynccontextmanager
async def lifespan(_: FastAPI):
    alerts.install("backend")
    await db.connect(max_size=10)
    await admin.mark_interrupted()
    alerts.started("backend")
    hk = asyncio.create_task(_housekeeping_loop())
    yield
    hk.cancel()
    await telegram_api.close()
    await db.close()


app = FastAPI(title="SlideAI", docs_url=None if not settings.demo else "/docs", lifespan=lifespan)  # no public /docs in production
app.include_router(admin.router)
app.add_middleware(CORSMiddleware, allow_origins=settings.allowed_origins, allow_methods=["GET", "POST", "PUT"],
                   allow_headers=["Content-Type", "X-Telegram-Init-Data", "X-Admin-Token"])


DATA = Path(__file__).resolve().parent / "data"
DATA.mkdir(exist_ok=True)
TEMPLATES = json.loads((content_ai.PRO_DIR / "templates.json").read_text(encoding="utf-8"))


class GenerateRequest(BaseModel):
    user_id: int
    template_id: int = Field(ge=1, le=40)
    slide_count: int = Field(ge=6, le=30)
    language: Literal["uz", "ru", "en"] = "uz"
    topic: str = Field(min_length=3, max_length=200)
    author: str = Field("", max_length=80)
    org: str = Field("", max_length=120)
    loc: str = Field("", max_length=60)
    year: str = Field("", max_length=10)


async def charge_or_402(user_id: int, price: int, kind: str, lang: str):
    """Take the price from the user's UZS balance; if it is too low, the bot sends top-up buttons and the API answers 402."""
    if await billing.charge(user_id, price, kind) is None:
        await bot.send_low_balance(user_id, lang, price)
        raise HTTPException(402, "Balans yetarli emas")


async def deliver(chat_id: int, path, topic: str, note: str):  # note is already localized
    name = re.sub(r"[^\w\-]+", "_", topic)[:60] + ".pptx"
    final = Path(path).with_name(name); Path(path).rename(final)
    try:
        await send_document(chat_id, str(final), caption=f"{topic}\n{note}")
    finally:
        _drop_tmp(final.parent)


def demo_content(topic: str, meta: dict) -> dict:
    content = json.loads((content_ai.PRO_DIR / "content" / "soliq.json").read_text(encoding="utf-8"))
    content["meta"] = {"topic": topic, **meta}
    for s in content["slides"]:
        if isinstance(s.get("image"), str) and not s["image"].startswith("/"):
            s["image"] = str(content_ai.PRO_DIR / s["image"])
    return content


async def refund(chat_id: int, price: int, kind: str):
    """A paid job failed: give the money back and say so."""
    await billing.refund(chat_id, price, kind)
    lang = await lang_of(chat_id)
    await send_message(chat_id, t(lang, "refunded", amount=som(price, lang)))


def _build(req: GenerateRequest, deck_id: str, chat_id: int):
    """The slow part (AI, photos, drawing), in a worker thread."""
    meta = {"author": req.author, "org": req.org, "loc": req.loc, "year": req.year}
    if settings.demo:  # offline demo: ready content instead of AI + Pexels
        content = demo_content(req.topic, meta)
        path = content_ai.render(content, req.template_id, Path(tempfile.mkdtemp(prefix="slideai-")) / "demo.pptx")
    else:
        path, content = content_ai.build_presentation(req.topic, req.template_id, req.slide_count, req.language, meta=meta)
    decks.keep_images(chat_id, deck_id, content)
    return path, content


async def job(req: GenerateRequest, chat_id: int, price: int):
    try:
        deck_id = decks.new_id()
        path, content = await run_in_threadpool(_build, req, deck_id, chat_id)
        await decks.save(chat_id, content, req.model_dump(), deck_id)
        await deliver(chat_id, path, req.topic, t(await lang_of(chat_id), "slides", n=len(content["slides"])))
    except Exception:  # never leave the user waiting silently
        log.exception("generation failed")
        await send_message(chat_id, t(await lang_of(chat_id), "err_gen"))
        await refund(chat_id, price, "generate")


def _redraw(content: dict, template_id: int):
    if settings.demo:
        return content_ai.render(content, template_id, Path(tempfile.mkdtemp(prefix="slideai-")) / "demo.pptx"), content
    return content_ai.switch_template(content, template_id)


async def restyle_job(deck_id: str, template_id: int, chat_id: int, price: int):
    try:
        deck = await decks.load(chat_id, deck_id)
        path, content = await run_in_threadpool(_redraw, deck["content"], template_id)
        await decks.save(chat_id, content, {**deck["request"], "template_id": template_id}, deck_id)  # the deck now uses the new template
        await deliver(chat_id, path, content["meta"]["topic"], t(await lang_of(chat_id), "new_template"))
    except Exception:
        log.exception("restyle failed")
        await send_message(chat_id, t(await lang_of(chat_id), "err_restyle"))
        await refund(chat_id, price, "restyle")


@app.post("/api/generate", status_code=202)
async def generate(req: GenerateRequest, background: BackgroundTasks, tg_user: dict = Depends(telegram_user)):
    if req.user_id != tg_user["id"]:
        raise HTTPException(403, "User mismatch")
    lang = await lang_of(tg_user["id"], tg_user.get("language_code"))
    price = (await appconfig.get())["price_generate"]  # fixed at the moment of payment: a later price change does not alter the refund
    await charge_or_402(tg_user["id"], price, "generate", lang)
    background.add_task(send_message, tg_user["id"], t(lang, "queued", topic=req.topic))
    background.add_task(job, req, tg_user["id"], price)
    return {"status": "queued"}


class RestyleRequest(BaseModel):
    user_id: int
    template_id: int = Field(ge=1, le=40)
    deck_id: str = Field(pattern=r"^\d{1,20}$")


@app.post("/api/restyle", status_code=202)
async def restyle(req: RestyleRequest, background: BackgroundTasks, tg_user: dict = Depends(telegram_user)):
    if req.user_id != tg_user["id"]:
        raise HTTPException(403, "User mismatch")
    deck = await decks.load(tg_user["id"], req.deck_id)  # only this user's own decks
    if not deck:
        raise HTTPException(404, "Taqdimot topilmadi")
    if deck["request"]["template_id"] == req.template_id:
        raise HTTPException(422, "Bu taqdimot allaqachon shu shablonda")
    lang = await lang_of(tg_user["id"], tg_user.get("language_code"))
    price = (await appconfig.get())["price_restyle"]  # cheaper than a new deck (PRICE_RESTYLE)
    await charge_or_402(tg_user["id"], price, "restyle", lang)
    background.add_task(send_message, tg_user["id"], t(lang, "restyle_queued", topic=deck["content"]["meta"]["topic"]))
    background.add_task(restyle_job, req.deck_id, req.template_id, tg_user["id"], price)
    return {"status": "queued"}


@app.get("/api/decks")
async def list_decks(tg_user: dict = Depends(telegram_user)):
    return {"decks": await decks.list_all(tg_user["id"])}


class LangRequest(BaseModel):
    lang: Literal["uz", "ru", "en"]


@app.get("/api/me")
async def me(tg_user: dict = Depends(telegram_user)):
    await touch(tg_user)  # the Mini App asks this first: it counts as a visit
    cfg = await appconfig.get()
    return {"lang": await lang_of(tg_user["id"], tg_user.get("language_code")), "balance": await billing.balance(tg_user["id"]),
            "prices": {"generate": cfg["price_generate"], "restyle": cfg["price_restyle"]}}


@app.post("/api/me")
async def save_me(req: LangRequest, tg_user: dict = Depends(telegram_user)):
    await set_lang(tg_user["id"], req.lang)  # chosen in the Mini App: the bot answers in it from now on
    return {"lang": req.lang}


@app.post("/telegram/webhook")
async def telegram_webhook(request: Request, background: BackgroundTasks,
                           x_telegram_bot_api_secret_token: str | None = Header(None)):
    if settings.webhook_secret and x_telegram_bot_api_secret_token != settings.webhook_secret:
        raise HTTPException(403, "Bad secret")
    background.add_task(bot.handle, await request.json())  # answer Telegram at once, work in the background
    return {"ok": True}


async def _notify_paid(paid: dict | None):
    if paid:
        try:
            await bot.notify_paid(paid)
        except Exception:  # the provider must still get its answer
            log.exception("payment notification failed")


@app.post("/api/pay/payme")
async def pay_payme(request: Request, background: BackgroundTasks, authorization: str | None = Header(None)):
    try:
        body = await request.json()
    except ValueError:
        return {"jsonrpc": "2.0", "id": None, "error": {"code": -32700, "message": {"uz": "JSON xato", "ru": "Ошибка JSON", "en": "Parse error"}}}
    reply, paid = await payments.payme_rpc(body, authorization)
    background.add_task(_notify_paid, paid)
    return reply


async def _click_form(request: Request) -> dict:
    return dict(parse_qsl((await request.body()).decode("utf-8", "replace"), keep_blank_values=True))


@app.post("/api/pay/click/prepare")
async def pay_click_prepare(request: Request):
    return await payments.click_prepare(await _click_form(request))


@app.post("/api/pay/click/complete")
async def pay_click_complete(request: Request, background: BackgroundTasks):
    reply, paid = await payments.click_complete(await _click_form(request))
    background.add_task(_notify_paid, paid)
    return reply


# ---------------------------------------------------------------- editor

@app.exception_handler(editor.EditorError)
async def editor_error(_: Request, e: editor.EditorError):
    status = {"notFound": 404, "stale": 409, "tooBig": 413}.get(str(e), 422)
    return JSONResponse({"detail": str(e)}, status_code=status)


async def _body(request: Request, limit: int) -> bytes:
    data = bytearray()
    async for chunk in request.stream():
        data += chunk
        if len(data) > limit:
            raise HTTPException(413, "tooBig")
    return bytes(data)


@app.get("/api/editor/link")
async def editor_link(tg_user: dict = Depends(telegram_user)):
    return {"url": bot.editor_url(tg_user["id"], await lang_of(tg_user["id"], tg_user.get("language_code")))}


@app.get("/api/editor/docs")
async def editor_docs(uid: int = Depends(editor_user)):
    return {"docs": await run_in_threadpool(editor.list_docs, uid), "decks": await decks.list_all(uid)}


@app.post("/api/editor/import")
async def editor_import(request: Request, uid: int = Depends(editor_user), x_filename: str = Header("taqdimot.pptx")):
    from urllib.parse import unquote
    data = await _body(request, editor.MAX_FILE)
    doc = await run_in_threadpool(editor.import_file, uid, data, unquote(x_filename), "upload")
    return {"id": doc}


class DeckImport(BaseModel):
    deck_id: str = Field(pattern=r"^\d{1,20}$")


def _import_deck(uid: int, deck: dict) -> str:
    with tempfile.TemporaryDirectory(prefix="slideai-") as tmp:
        path = content_ai.render(deck["content"], deck["request"]["template_id"], Path(tmp) / "deck.pptx")
        return editor.import_file(uid, path.read_bytes(), deck["content"]["meta"]["topic"] + ".pptx", "deck")


@app.post("/api/editor/import-deck")
async def editor_import_deck(req: DeckImport, uid: int = Depends(editor_user)):
    deck = await decks.load(uid, req.deck_id)
    if not deck:
        raise editor.EditorError("notFound")
    return {"id": await run_in_threadpool(_import_deck, uid, deck)}


@app.get("/api/editor/docs/{doc_id}")
def editor_doc(doc_id: str, uid: int = Depends(editor_user)):
    return editor.describe(uid, doc_id)


class EditOps(BaseModel):
    version: int
    ops: list[dict] = Field(max_length=200)
    full: bool = False  # True for changes the page cannot draw by itself (new slides, images): send the model back


@app.post("/api/editor/docs/{doc_id}/ops")
def editor_ops(doc_id: str, req: EditOps, uid: int = Depends(editor_user)):
    return editor.apply(uid, doc_id, req.ops, req.version, full=req.full)


@app.post("/api/editor/docs/{doc_id}/undo")
def editor_undo(doc_id: str, full: bool = False, uid: int = Depends(editor_user)):
    return editor.step(uid, doc_id, -1, full=full)


@app.post("/api/editor/docs/{doc_id}/redo")
def editor_redo(doc_id: str, full: bool = False, uid: int = Depends(editor_user)):
    return editor.step(uid, doc_id, 1, full=full)


class RenameReq(BaseModel):
    name: str = Field(min_length=1, max_length=80)


@app.post("/api/editor/docs/{doc_id}/rename")
def editor_rename(doc_id: str, req: RenameReq, uid: int = Depends(editor_user)):
    return editor.rename(uid, doc_id, req.name)


@app.post("/api/editor/docs/{doc_id}/delete")
def editor_delete(doc_id: str, uid: int = Depends(editor_user)):
    editor.delete_doc(uid, doc_id)
    return {"ok": True}


@app.post("/api/editor/docs/{doc_id}/upload")
async def editor_upload(doc_id: str, request: Request, uid: int = Depends(editor_user)):
    data = await _body(request, editor.MAX_IMAGE)
    return {"upload": await run_in_threadpool(editor.save_upload, uid, doc_id, data)}


IMMUTABLE = {"Cache-Control": "private, max-age=31536000, immutable"}  # names are content hashes


@app.get("/api/editor/docs/{doc_id}/layer/{key}.png")
def editor_layer(doc_id: str, key: str, uid: int = Depends(editor_user)):
    return FileResponse(editor.layer_file(uid, doc_id, key), media_type="image/png", headers=IMMUTABLE)


@app.get("/api/editor/docs/{doc_id}/media/{name}")
def editor_media(doc_id: str, name: str, uid: int = Depends(editor_user)):
    return FileResponse(editor.media_file(uid, doc_id, name), headers=IMMUTABLE)


@app.get("/api/editor/docs/{doc_id}/download")
def editor_download(doc_id: str, uid: int = Depends(editor_user)):
    path, name = editor.current_file(uid, doc_id)
    return FileResponse(path, filename=f"{name}.pptx",
                        media_type="application/vnd.openxmlformats-officedocument.presentationml.presentation")


@app.post("/api/editor/docs/{doc_id}/send")
async def editor_send(doc_id: str, uid: int = Depends(editor_user)):
    """The edited file goes to the user's chat with the bot."""
    path, name = await run_in_threadpool(editor.current_file, uid, doc_id)
    with tempfile.TemporaryDirectory() as tmp:
        named = Path(tmp) / f"{re.sub(r'[^\w\-]+', '_', name)[:60]}.pptx"
        shutil.copy(path, named)
        await send_document(uid, str(named), caption=t(await lang_of(uid), "editor_sent", name=name))
    return {"ok": True}


@app.get("/api/templates")
def templates():
    return TEMPLATES


@app.get("/health")
def health():
    return {"ok": True, "templates": len(TEMPLATES)}

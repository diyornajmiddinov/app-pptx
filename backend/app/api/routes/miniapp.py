"""
Telegram Mini App API. Every call is signed: Telegram initData (X-Telegram-Init-Data), or the bottom-keyboard
token (X-App-Token) — see core/auth.telegram_user.

POST /api/generate   new presentation: charged now, drawn by the worker (jobs queue), sent to the chat by the bot
POST /api/restyle    one of the user's decks in another template (cheaper; one short AI call adapts the tone)
GET  /api/decks      the user's presentations, newest first
GET/POST /api/me     language; GET also returns the balance and prices (money is added only in the bot)
GET  /api/templates  the 40 templates
"""
import json
import logging
from typing import Literal

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

from app.bot.money import send_low_balance
from app.core import db
from app.core.auth import telegram_user
from app.core.config import ENGINE_DIR, settings
from app.core.telegram import send_message
from app.services import app_settings, billing, decks, jobs
from app.services.users import lang_of, set_lang, touch
from app.texts import t

log = logging.getLogger("api")
router = APIRouter()
TEMPLATES = json.loads((ENGINE_DIR / "templates.json").read_text(encoding="utf-8"))


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


class RestyleRequest(BaseModel):
    user_id: int
    template_id: int = Field(ge=1, le=40)
    deck_id: str = Field(pattern=r"^\d{1,20}$")


class LangRequest(BaseModel):
    lang: Literal["uz", "ru", "en"]


async def _charge_or_402(user_id: int, price: int, kind: str, lang: str):
    """Take the price from the UZS balance; if it is too low, the bot sends top-up buttons and the API answers 402."""
    if await billing.charge(user_id, price, kind) is None:
        await send_low_balance(user_id, lang, price)
        raise HTTPException(402, "Balans yetarli emas")


async def _queued(user_id: int, lang: str, text: str, ahead: int):
    """Tell the user the job is accepted (and that it will wait, if the worker is busy). Never fails the request."""
    if ahead >= settings.worker_concurrency:
        text += "\n" + t(lang, "queue_ahead", n=ahead)
    try:
        await send_message(user_id, text)
    except Exception:
        log.warning("could not send the 'queued' message to %s", user_id)


@router.post("/api/generate", status_code=202)
async def generate(req: GenerateRequest, tg_user: dict = Depends(telegram_user)):
    if req.user_id != tg_user["id"]:
        raise HTTPException(403, "User mismatch")
    lang = await lang_of(tg_user["id"], tg_user.get("language_code"))
    ordered = await jobs.order_generate(tg_user["id"], req.model_dump())  # the first deck may be free (admin panel)
    if ordered is None:
        await send_low_balance(tg_user["id"], lang, await jobs.generate_price(tg_user["id"]))
        raise HTTPException(402, "Balans yetarli emas")
    job_id, ahead, _ = ordered
    await _queued(tg_user["id"], lang, t(lang, "queued", topic=req.topic), ahead)
    return {"status": "queued", "job": job_id, "ahead": ahead}


@router.post("/api/restyle", status_code=202)
async def restyle(req: RestyleRequest, tg_user: dict = Depends(telegram_user)):
    if req.user_id != tg_user["id"]:
        raise HTTPException(403, "User mismatch")
    deck = await decks.load(tg_user["id"], req.deck_id)  # only this user's own decks
    if not deck:
        raise HTTPException(404, "Taqdimot topilmadi")
    if deck["request"]["template_id"] == req.template_id:
        raise HTTPException(422, "Bu taqdimot allaqachon shu shablonda")
    lang = await lang_of(tg_user["id"], tg_user.get("language_code"))
    price = (await app_settings.get())["price_restyle"]
    await _charge_or_402(tg_user["id"], price, "restyle", lang)
    job_id, ahead = await jobs.enqueue("restyle", tg_user["id"], {"deck_id": req.deck_id, "template_id": req.template_id}, price)
    await _queued(tg_user["id"], lang, t(lang, "restyle_queued", topic=deck["content"]["meta"]["topic"]), ahead)
    return {"status": "queued", "job": job_id, "ahead": ahead}


@router.get("/api/decks")
async def list_decks(tg_user: dict = Depends(telegram_user)):
    return {"decks": await decks.list_all(tg_user["id"])}


@router.get("/api/me")
async def me(tg_user: dict = Depends(telegram_user)):
    await touch(tg_user)  # the Mini App asks this first: it counts as a visit
    cfg = await app_settings.get()
    u = await db.pool().fetchrow("SELECT first_name, last_name FROM users WHERE id = $1", tg_user["id"])
    return {"user": {"id": tg_user["id"], **(dict(u) if u else {})},  # the keyboard-opened app knows only the id
            "lang": await lang_of(tg_user["id"], tg_user.get("language_code")), "balance": await billing.balance(tg_user["id"]),
            "prices": {"generate": cfg["price_generate"], "restyle": cfg["price_restyle"],
                       "now": await jobs.generate_price(tg_user["id"])}}  # a new deck for this user now (the first may be free)


@router.post("/api/me")
async def save_me(req: LangRequest, tg_user: dict = Depends(telegram_user)):
    await set_lang(tg_user["id"], req.lang)  # chosen in the Mini App: the bot answers in it from now on
    return {"lang": req.lang}


@router.get("/api/templates")
def templates():
    return TEMPLATES


@router.get("/health")
def health():
    return {"ok": True, "templates": len(TEMPLATES)}

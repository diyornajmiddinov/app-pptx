"""
Callbacks from outside: payment providers and the Telegram webhook.

POST /api/pay/payme                       Payme Merchant API (JSON-RPC; Payme always gets HTTP 200)
POST /api/pay/click/{prepare,complete}    Click SHOP API
POST /telegram/webhook                    bot updates when the webhook is used instead of app.bot.polling
A credited payment is announced to the user after the provider has its answer.
"""
import hmac
import logging
from urllib.parse import parse_qsl

from fastapi import APIRouter, BackgroundTasks, Header, HTTPException, Request

from app.bot import handlers as bot
from app.bot import polling
from app.core.config import settings
from app.services import payments

log = logging.getLogger("api")
router = APIRouter()


async def _notify_paid(paid: dict | None):
    if paid:
        try:
            await bot.notify_paid(paid)
        except Exception:  # the provider must still get its answer
            log.exception("To'lov haqida xabar yuborilmadi · foydalanuvchi %s · %s so'm", paid.get("user_id"), paid.get("amount"))


@router.post("/api/pay/payme")
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


@router.post("/api/pay/click/prepare")
async def pay_click_prepare(request: Request):
    return await payments.click_prepare(await _click_form(request))


@router.post("/api/pay/click/complete")
async def pay_click_complete(request: Request, background: BackgroundTasks):
    reply, paid = await payments.click_complete(await _click_form(request))
    background.add_task(_notify_paid, paid)
    return reply


@router.post("/telegram/webhook")
async def telegram_webhook(request: Request, background: BackgroundTasks,
                           x_telegram_bot_api_secret_token: str | None = Header(None)):
    # no secret configured -> closed: otherwise anyone could post fake updates (fake users, fake receipts)
    if not settings.webhook_secret or not hmac.compare_digest((x_telegram_bot_api_secret_token or "").encode(), settings.webhook_secret.encode()):
        raise HTTPException(403, "Bad secret")
    background.add_task(polling.handle, await request.json())  # answer Telegram at once, work in the background; errors are logged
    return {"ok": True}

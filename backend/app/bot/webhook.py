"""
The bot in webhook mode (production, systemd slideai-bot): Telegram posts updates to PUBLIC_URL/telegram/webhook,
the backend checks WEBHOOK_SECRET and handles them (routes/payments.py). This process only sets things up and watches:
    - setWebhook (keeps updates that arrived meanwhile), the command list, menu buttons after an address change
    - every few minutes getWebhookInfo: a new delivery error or a growing queue goes to the log channel
Back to polling: run app.bot.polling (it removes the webhook).
"""
import asyncio
import logging

from app.bot import polling
from app.core import alerts, db, systemd, telegram
from app.core.config import settings

log = logging.getLogger("webhook")
CHECK_EVERY = 300   # s
QUEUE_ALERT = 50    # updates Telegram could not deliver yet


def url() -> str:
    return settings.public_url.rstrip("/") + "/telegram/webhook"


async def install():
    if not settings.public_url.startswith("https://") or not settings.webhook_secret:
        raise SystemExit("webhook needs PUBLIC_URL (https://...) and WEBHOOK_SECRET in .env")
    await telegram.call("setWebhook", json={"url": url(), "secret_token": settings.webhook_secret,
                                            "allowed_updates": polling.UPDATES, "drop_pending_updates": False})


async def check(last_error: int) -> int:
    """One look at getWebhookInfo; returns the newest error time seen, so each error is reported once."""
    info = (await telegram.call("getWebhookInfo"))["result"]
    if info.get("url") != url():  # someone ran polling or another setWebhook
        log.error("Webhook manzili o'zgargan: %r, qayta o'rnatildi", info.get("url"))
        await install()
    when = info.get("last_error_date") or 0
    if when > last_error:
        log.error("Telegram webhook'ga yetkaza olmadi: %s", info.get("last_error_message", ""))
    if info.get("pending_update_count", 0) >= QUEUE_ALERT:
        log.error("Webhook navbati: %d ta xabar kutyapti", info["pending_update_count"])
    return max(when, last_error)


async def main():
    alerts.install("bot")
    await db.connect(max_size=2)
    await install()
    await polling.set_commands()
    me = (await telegram.call("getMe"))["result"]
    log.info("bot @%s started (webhook %s)", me["username"], url())
    alerts.started("bot")
    tasks = {asyncio.create_task(polling.refresh_menu_buttons()), asyncio.create_task(systemd.watchdog())}
    last_error = (await telegram.call("getWebhookInfo"))["result"].get("last_error_date") or 0  # errors from before this start are old news
    try:
        while True:
            await asyncio.sleep(CHECK_EVERY)
            try:
                last_error = await check(last_error)
            except Exception as e:  # network hiccup: try again next time
                log.warning("getWebhookInfo failed: %s", str(e).replace(settings.bot_token, "***"))
    finally:
        for t in tasks:
            t.cancel()
        await telegram.close()
        await db.close()


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
    logging.getLogger("httpx").setLevel(logging.WARNING)  # its request lines contain the bot token
    asyncio.run(main())

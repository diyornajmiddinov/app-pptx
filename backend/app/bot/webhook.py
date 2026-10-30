"""
The bot in webhook mode (production): Telegram posts updates to PUBLIC_URL/telegram/webhook, the backend checks
WEBHOOK_SECRET and handles them (routes/payments.py). The backend also runs serve() for the life of its process (one API process, if there are several):
    - setWebhook (keeps updates that arrived meanwhile), the command list, menu buttons after an address change
    - every few minutes getWebhookInfo: a new delivery error or a growing queue goes to the log channel
So there is no separate bot service. Back to polling: run app.bot.polling (it removes the webhook);
`python -m app.bot.webhook` only installs the webhook and the commands, then exits.
"""
import asyncio
import logging

from app.bot import polling
from app.core import db, telegram
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


def enabled() -> bool:
    return settings.public_url.startswith("https://") and bool(settings.webhook_secret)


LEADER = 0x5EB400C  # pg advisory lock: with several API processes only one sets the bot up and watches


async def serve():
    """A task of the backend: become the one process that looks after the bot (a session advisory lock on a
    connection of its own; if that process dies, PostgreSQL frees the lock and another one takes over), set the bot
    up, then watch the webhook. Never raises: the API must keep running."""
    while True:
        try:
            con = await db.pool().acquire()
        except Exception:
            log.exception("Bot webhook'i uchun bazaga ulanib bo'lmadi")
            await asyncio.sleep(CHECK_EVERY)
            continue
        try:
            if await con.fetchval("SELECT pg_try_advisory_lock($1)", LEADER):
                await _look_after()  # runs until the process stops (the lock goes with the connection)
        except Exception:
            log.exception("Bot webhook'ini kuzatish to'xtadi")
        finally:
            await db.pool().release(con)  # asyncpg resets the session: the advisory lock is let go
        await asyncio.sleep(CHECK_EVERY)  # another process has it: try again later


async def _look_after():
    try:
        await install()
        await polling.set_commands()
        me = (await telegram.call("getMe"))["result"]
        log.info("bot @%s: webhook %s", me["username"], url())
        await polling.refresh_menu_buttons()
        last_error = (await telegram.call("getWebhookInfo"))["result"].get("last_error_date") or 0  # older errors are old news
    except Exception:
        log.exception("Bot webhook'ini o'rnatib bo'lmadi")
        last_error = 0
    while True:
        await asyncio.sleep(CHECK_EVERY)
        try:
            last_error = await check(last_error)
        except Exception as e:  # network hiccup: try again next time
            log.warning("getWebhookInfo failed: %s", str(e).replace(settings.bot_token, "***"))


async def main():
    await db.connect(max_size=2)
    try:
        await install()
        await polling.set_commands()
        print("webhook:", url())
    finally:
        await telegram.close()
        await db.close()


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
    logging.getLogger("httpx").setLevel(logging.WARNING)  # its request lines contain the bot token
    asyncio.run(main())

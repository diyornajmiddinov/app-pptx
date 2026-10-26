"""
Run the bot with long polling instead of the webhook: no HTTPS domain needed (local testing).
    set -a; . ./.env; set +a; python polling.py
Telegram does not deliver getUpdates while a webhook is set, so it is removed at start;
run bot_setup.py again when you move back to the webhook.
Each update is handled in its own task, so a slow one (a file import) does not hold up the others.
"""
import asyncio
import logging

import bot
import db
import telegram_api
from config import settings
from telegram_api import call
from texts import T

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
logging.getLogger("httpx").setLevel(logging.WARNING)  # its request lines contain the bot token
log = logging.getLogger("polling")


async def handle(u: dict):
    try:
        await bot.handle(u)
    except Exception:
        log.exception("update %s failed", u["update_id"])


async def main():
    await db.connect()
    await call("deleteWebhook", json={"drop_pending_updates": False})
    for lang in ("uz", "ru", "en"):  # same command list as bot_setup.py
        cmds = [{"command": c, "description": T[lang][f"cmd_{c}"]} for c in ("start", "balance", "pdf", "editor", "language", "help")]
        await call("setMyCommands", json={"commands": cmds, **({} if lang == "uz" else {"language_code": lang})})
    me = (await call("getMe"))["result"]
    log.info("bot @%s started (polling)", me["username"])
    offset, running = None, set()
    try:
        while True:
            try:
                updates = (await call("getUpdates", json={"offset": offset, "timeout": 50}))["result"]
            except Exception as e:  # network hiccup: wait and retry
                log.warning("getUpdates failed: %s", str(e).replace(settings.bot_token, "***"))  # keep the token out of logs
                await asyncio.sleep(3)
                continue
            for u in updates:
                offset = u["update_id"] + 1
                task = asyncio.create_task(handle(u))
                running.add(task); task.add_done_callback(running.discard)
    finally:
        await telegram_api.close()
        await db.close()


if __name__ == "__main__":
    asyncio.run(main())

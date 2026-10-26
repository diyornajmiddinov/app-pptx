"""
Run the bot with long polling instead of the webhook: no HTTPS domain needed (local testing).
    set -a; . ./.env; set +a; python polling.py
Telegram does not deliver getUpdates while a webhook is set, so it is removed at start;
run bot_setup.py again when you move back to the webhook.
Each update is handled in its own task, so a slow one (a file import) does not hold up the others.
"""
import asyncio
import logging

import alerts
import bot
import db
import telegram_api
from config import settings
from telegram_api import call
from texts import T

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
logging.getLogger("httpx").setLevel(logging.WARNING)  # its request lines contain the bot token
log = logging.getLogger("polling")
UPDATES = ["message", "callback_query", "my_chat_member"]  # my_chat_member: the bot added to the log channel


def what(u: dict) -> str:
    """Which user did what, for the error report."""
    if q := u.get("callback_query"):
        return f"tugma «{q.get('data', '')}» · foydalanuvchi {q['from']['id']}"
    if m := u.get("message"):
        kind = "rasm" if m.get("photo") else f"fayl {m['document'].get('file_name', '')}" if m.get("document") else f"«{(m.get('text') or '')[:60]}»"
        return f"xabar {kind} · foydalanuvchi {m.get('from', {}).get('id')}"
    return ", ".join(k for k in u if k != "update_id")


async def handle(u: dict):
    try:
        await bot.handle(u)
    except Exception:
        log.exception("Bot xabarni qayta ishlay olmadi · %s", what(u))


async def refresh_menu_buttons():
    """The Mini App address changed (temporary tunnel): every user's menu button still opens the old one."""
    mark = alerts.DATA / "last_webapp_url"
    try:
        old = mark.read_text().strip()
    except OSError:
        old = ""
    if old == settings.webapp_url or not bot.has_webapp():
        return
    rows = await db.pool().fetch("SELECT id, coalesce(lang, 'uz') AS lang FROM users")
    for r in rows:
        try:
            await telegram_api.set_menu_button(r["id"], T[r["lang"]]["open"], bot.app_url(r["lang"]))
        except Exception:  # blocked the bot etc.
            pass
        await asyncio.sleep(0.05)
    mark.write_text(settings.webapp_url)
    log.info("menu buttons updated for %d users", len(rows))


async def main():
    alerts.install("bot")
    await db.connect()
    await call("deleteWebhook", json={"drop_pending_updates": False})
    for lang in ("uz", "ru", "en"):  # same command list as bot_setup.py
        cmds = [{"command": c, "description": T[lang][f"cmd_{c}"]} for c in ("start", "balance", "pdf", "editor", "language", "help")]
        await call("setMyCommands", json={"commands": cmds, **({} if lang == "uz" else {"language_code": lang})})
    me = (await call("getMe"))["result"]
    log.info("bot @%s started (polling)", me["username"])
    alerts.started("bot")
    offset, running = None, {asyncio.create_task(refresh_menu_buttons())}
    try:
        while True:
            try:
                updates = (await call("getUpdates", json={"offset": offset, "timeout": 50, "allowed_updates": UPDATES}))["result"]
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

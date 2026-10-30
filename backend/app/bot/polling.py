"""
Run the bot with long polling instead of the webhook: no HTTPS domain needed (local testing).
    set -a; . ./.env; set +a; python -m app.bot.polling
Telegram does not deliver getUpdates while a webhook is set, so it is removed at start;
start app.bot.webhook again to move back to the webhook. The helpers here are shared with it.
Each update is handled in its own task, so a slow one (a file import) does not hold up the others.
"""
import asyncio
import logging

from app.bot import handlers as bot
from app.core import alerts, db, systemd, telegram
from app.core.config import settings
from app.texts import T

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


COMMANDS = ("start", "taqdimot", "referat", "mustaqil", "pdf", "balance", "editor", "language", "help")  # the Menu list, in order
MENU = "commands"  # what the button by the input field is now; written to data/menu_button once every user has it


async def refresh_menu_buttons():
    """The button by the input field opens the command list. Users who still have the old per-chat "open the app"
    button are switched once (data/menu_button remembers that it was done), and the default is set for new ones."""
    mark = alerts.DATA / "menu_button"
    try:
        if mark.read_text().strip() == MENU:
            return
    except OSError:
        pass
    await telegram.set_commands_menu()
    rows = await db.pool().fetch("SELECT id FROM users")
    for r in rows:
        try:
            await telegram.set_commands_menu(r["id"])
        except Exception:  # blocked the bot etc.
            pass
        await asyncio.sleep(0.05)
    mark.write_text(MENU)
    log.info("menu buttons: the command list for %d users", len(rows))


async def set_commands():
    for lang in ("uz", "ru", "en"):
        cmds = [{"command": c, "description": T[lang][f"cmd_{c}"]} for c in COMMANDS]
        await telegram.call("setMyCommands", json={"commands": cmds, **({} if lang == "uz" else {"language_code": lang})})


async def main():
    alerts.install("bot")
    await db.connect()
    await telegram.call("deleteWebhook", json={"drop_pending_updates": False})
    await set_commands()
    me = (await telegram.call("getMe"))["result"]
    log.info("bot @%s started (polling)", me["username"])
    alerts.started("bot")
    offset, running = None, {asyncio.create_task(refresh_menu_buttons()), asyncio.create_task(systemd.watchdog())}
    try:
        while True:
            try:
                updates = (await telegram.call("getUpdates", json={"offset": offset, "timeout": 50, "allowed_updates": UPDATES}))["result"]
            except Exception as e:  # network hiccup: wait and retry
                log.warning("getUpdates failed: %s", str(e).replace(settings.bot_token, "***"))  # keep the token out of logs
                await asyncio.sleep(3)
                continue
            for u in updates:
                offset = u["update_id"] + 1
                task = asyncio.create_task(handle(u))
                running.add(task); task.add_done_callback(running.discard)
    finally:
        await telegram.close()
        await db.close()


if __name__ == "__main__":
    asyncio.run(main())

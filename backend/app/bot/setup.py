"""
One-time setup after deploying (run again if the URLs change):
  - webhook  -> PUBLIC_URL/telegram/webhook (protected with WEBHOOK_SECRET)
  - commands -> /start, /balance, /language, /help in uz (default), ru and en
  - default menu button -> opens the Mini App
"""
import asyncio

from app.core import telegram
from app.core.config import settings
from app.texts import T


async def main():
    print(await telegram.call("setWebhook", json={"url": settings.public_url.rstrip("/") + "/telegram/webhook", "secret_token": settings.webhook_secret,
                                         "allowed_updates": ["message", "callback_query", "my_chat_member"]}))
    for lang in ("uz", "ru", "en"):
        cmds = [{"command": c, "description": T[lang][f"cmd_{c}"]} for c in ("start", "balance", "pdf", "editor", "language", "help")]
        print(await telegram.call("setMyCommands", json={"commands": cmds, **({} if lang == "uz" else {"language_code": lang})}))
    print(await telegram.call("setChatMenuButton", json={"menu_button": {"type": "web_app", "text": T["uz"]["open"], "web_app": {"url": settings.webapp_url}}}))
    await telegram.close()


asyncio.run(main())

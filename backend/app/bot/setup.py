"""
One-time setup after deploying (run again if the URLs change):
  - webhook  -> PUBLIC_URL/telegram/webhook (protected with WEBHOOK_SECRET)
  - commands -> the Menu list (app.bot.polling.COMMANDS) in uz (default), ru and en
  - default menu button -> the command list
"""
import asyncio

from app.bot.polling import set_commands
from app.core import telegram
from app.core.config import settings


async def main():
    print(await telegram.call("setWebhook", json={"url": settings.public_url.rstrip("/") + "/telegram/webhook", "secret_token": settings.webhook_secret,
                                         "allowed_updates": ["message", "callback_query", "my_chat_member"]}))
    await set_commands()
    print(await telegram.set_commands_menu())
    await telegram.close()


asyncio.run(main())

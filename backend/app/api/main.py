"""
SlideAI web API (FastAPI): uvicorn app.api.main:app

routes/miniapp.py   the Telegram Mini App (generate, restyle, decks, me, templates, health)
routes/payments.py  Payme / Click callbacks and the Telegram webhook (the bot runs here: app.bot.webhook.serve)
routes/editor.py    the desktop presentation editor (editor.html)
routes/admin.py     the admin panel (admin.html, opened from the bot's /admin link)
routes/web.py       the website slidechi.uz (web/): sign-in with a code from the bot, the same account
Paid work is not done here: it is queued in `jobs` and drawn by the worker (app/worker.py).
"""
import asyncio
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import admin, editor, miniapp, payments, web
from app.bot import webhook
from app.core import alerts, db, systemd, telegram
from app.core.config import DATA_DIR, settings
from app.services import jobs
from app.services.ai import models
from app.services.editor import EditorError

logging.getLogger("httpx").setLevel(logging.WARNING)  # its request lines contain the bot token


class _HideTokens(logging.Filter):
    """Access log lines carry the path with its query: the admin panel's ?t=<token> must not end up in the journal."""

    def filter(self, record):
        if record.args and isinstance(record.args, tuple):
            record.args = tuple(a.split("?t=")[0] + "?t=***" if isinstance(a, str) and "?t=" in a
                                else a.split("&t=")[0] + "&t=***" if isinstance(a, str) and "&t=" in a else a for a in record.args)
        return True


@asynccontextmanager
async def lifespan(_: FastAPI):
    alerts.install("backend")
    logging.getLogger("uvicorn.access").addFilter(_HideTokens())
    await db.connect(max_size=10)
    models.on_usage = jobs.save_usage  # the website's outline requests are Gemini calls too -> ai_usage
    alerts.started("backend")
    tasks = [asyncio.create_task(systemd.watchdog())]
    if webhook.enabled():  # the bot: its updates come here (routes/payments.py); no separate bot service
        tasks.append(asyncio.create_task(webhook.serve()))
    yield
    for task in tasks:
        task.cancel()
    await telegram.close()
    await db.close()


def create_app() -> FastAPI:
    DATA_DIR.mkdir(exist_ok=True)
    api = FastAPI(title="SlideAI", docs_url="/docs" if settings.demo else None, lifespan=lifespan)  # no public /docs in production
    api.add_middleware(CORSMiddleware, allow_origins=settings.allowed_origins, allow_methods=["GET", "POST", "PUT"],
                       allow_headers=["Content-Type", "X-Telegram-Init-Data", "X-App-Token", "X-Admin-Token", "X-Editor-Token", "X-Filename", "Authorization"])
    api.add_exception_handler(EditorError, editor.editor_error)
    for module in (miniapp, payments, editor, admin, web):
        api.include_router(module.router)
    return api


app = create_app()

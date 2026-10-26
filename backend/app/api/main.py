"""
SlideAI web API (FastAPI): uvicorn app.api.main:app

routes/miniapp.py   the Telegram Mini App (generate, restyle, decks, me, templates, health)
routes/payments.py  Payme / Click callbacks and the Telegram webhook
routes/editor.py    the desktop presentation editor (editor.html)
routes/admin.py     the admin panel (admin.html, opened from the bot's /admin link)
Paid work is not done here: it is queued in `jobs` and drawn by the worker (app/worker.py).
"""
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import admin, editor, miniapp, payments
from app.core import alerts, db, telegram
from app.core.config import DATA_DIR, settings
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
    await admin.mark_interrupted()
    alerts.started("backend")
    yield
    await telegram.close()
    await db.close()


def create_app() -> FastAPI:
    DATA_DIR.mkdir(exist_ok=True)
    api = FastAPI(title="SlideAI", docs_url="/docs" if settings.demo else None, lifespan=lifespan)  # no public /docs in production
    api.add_middleware(CORSMiddleware, allow_origins=settings.allowed_origins, allow_methods=["GET", "POST", "PUT"],
                       allow_headers=["Content-Type", "X-Telegram-Init-Data", "X-App-Token", "X-Admin-Token", "X-Editor-Token", "X-Filename"])
    api.add_exception_handler(EditorError, editor.editor_error)
    for module in (miniapp, payments, editor, admin):
        api.include_router(module.router)
    return api


app = create_app()

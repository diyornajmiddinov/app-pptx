"""
Test setup: a separate PostgreSQL database (TEST_DATABASE_URL), a fake bot token, and a fake Telegram:
nothing in the tests reaches Telegram, Gemini, Pexels or the log channel.

    TEST_DATABASE_URL=postgresql://slideai:...@127.0.0.1:5432/slideai_test  .venv/bin/pytest
"""
import os
import sys
from pathlib import Path

# settings are read at import time: the test environment goes in first
os.environ.update({
    "DATABASE_URL": os.environ.get("TEST_DATABASE_URL", "postgresql://slideai:slideai@127.0.0.1:5432/slideai_test"),
    "BOT_TOKEN": "123456:TEST-TOKEN-ABCDEFGHIJKLMNOPQRSTUVWXYZ012",
    "WEBAPP_URL": "https://app.test", "PUBLIC_URL": "https://app.test", "SITE_URL": "https://site.test",
    "ADMIN_IDS": "1000", "CARD_NUMBER": "8600123412341234", "CARD_HOLDER": "Test Holder",
    "PRICE_GENERATE": "5000", "PRICE_RESTYLE": "2000", "TOPUP_AMOUNTS": "15000,30000",
    "GEMINI_API_KEY": "", "PEXELS_API_KEY": "", "ANTHROPIC_API_KEY": "", "LOG_CHANNEL_ID": "",
    "SLIDEAI_DEMO": "0",
})
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))  # backend/: the `app` package

import pytest

from app.core import (
    alerts,
    db,
    telegram,
)

ADMIN = 1000
REAL_POST = alerts.post  # the fixtures below replace it; tests of post() itself use this
TABLES = ("users", "balances", "ledger", "orders", "payme_txns", "click_txns", "decks", "app_settings",
          "broadcasts", "admin_log", "ai_usage", "pdf_drafts", "jobs", "web_logins", "web_sessions", "web_actions",
          "promo_codes", "promo_uses", "ref_codes", "referrals", "web_stats", "web_visitors")


@pytest.fixture(scope="session", autouse=True)
async def database():
    await db.connect(max_size=20)
    yield db
    await db.close()


@pytest.fixture(autouse=True)
async def clean(database):
    await db.pool().execute(f"TRUNCATE {', '.join(TABLES)} RESTART IDENTITY CASCADE")


class FakeTelegram:
    """Records every Bot API call; files 'downloaded' from Telegram come from `files`."""

    def __init__(self):
        self.calls: list[tuple[str, dict]] = []
        self.files: dict[str, bytes] = {}
        self.fail: dict[str, Exception] = {}

    async def call(self, method, **kw):
        self.calls.append((method, kw.get("json") or kw.get("data") or {}))
        if method in self.fail:
            raise self.fail[method]
        return {"ok": True, "result": {"username": "testbot"}}

    async def download_file(self, file_id, limit=0):
        return self.files[file_id]

    def sent(self, method="sendMessage"):
        return [kw for m, kw in self.calls if m == method]

    def texts(self):
        return [kw.get("text", "") for kw in self.sent()]

    def last(self):
        return self.sent()[-1]


@pytest.fixture(autouse=True)
def tg(monkeypatch):
    fake = FakeTelegram()
    monkeypatch.setattr(telegram, "call", fake.call)
    monkeypatch.setattr(telegram, "download_file", fake.download_file)
    monkeypatch.setattr(alerts, "post", lambda *a, **k: True)  # never the real channel
    monkeypatch.setattr(alerts, "post_file", lambda *a, **k: True)
    return fake


async def add_user(uid: int, lang: str | None = "uz", balance: int = 0, name: str = "Test"):
    await db.pool().execute("INSERT INTO users (id, first_name, lang) VALUES ($1, $2, $3) ON CONFLICT (id) DO NOTHING", uid, name, lang)
    if balance:
        from app.services import billing
        await billing.top_up(uid, balance, ref=f"seed:{uid}:{balance}")

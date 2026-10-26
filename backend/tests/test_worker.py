"""The worker process loop: woken by NOTIFY, draws a real deck (demo content, node engine), stops cleanly."""
import asyncio
import shutil

import pytest
from conftest import add_user

from app import worker
from app.core import db
from app.core.config import settings
from app.services import billing, jobs

pytestmark = pytest.mark.slow


async def test_worker_draws_a_queued_deck_and_stops(tg, monkeypatch):
    if not shutil.which("node"):
        pytest.skip("node not installed")
    monkeypatch.setattr(settings, "demo", True)  # sample content instead of AI and Pexels
    monkeypatch.setattr(worker.alerts, "install", lambda *a: None)
    await add_user(1, balance=5000)
    stop = asyncio.Event()
    task = asyncio.create_task(worker.main(stop))
    await asyncio.sleep(0.5)                       # the worker is idle, listening
    await billing.charge(1, 5000, "generate")
    req = {"user_id": 1, "template_id": 12, "slide_count": 8, "language": "uz", "topic": "Worker sinovi"}
    await jobs.enqueue("generate", 1, req, 5000)
    for _ in range(120):
        if await db.pool().fetchval("SELECT state FROM jobs") in ("done", "failed"):
            break
        await asyncio.sleep(0.5)
    stop.set()
    await asyncio.wait_for(task, 30)
    assert await db.pool().fetchval("SELECT state FROM jobs") == "done"
    assert tg.sent("sendDocument") and await billing.balance(1) == 0

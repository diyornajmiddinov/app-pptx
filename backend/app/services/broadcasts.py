"""
Messages to all users (or one language) from the admin panel. The panel only queues one (routes/admin.py);
the worker sends it (python -m app.worker), so it neither slows the API nor stops when the API restarts.

broadcasts row   queued -> running -> done; at most one queued or running (a unique index)
last_user        progress, saved after every message: a worker restart continues after it (one message at most twice)
"""
import asyncio
import logging

import httpx

from app.core import db
from app.core.telegram import send_message

log = logging.getLogger("broadcasts")
PAUSE = 0.05  # s between messages: ~20 a second, under Telegram's limit


async def claim() -> dict | None:
    row = await db.pool().fetchrow(
        """UPDATE broadcasts SET state = 'running'
           WHERE id = (SELECT id FROM broadcasts WHERE state = 'queued' ORDER BY id FOR UPDATE SKIP LOCKED LIMIT 1) RETURNING *""")
    return dict(row) if row else None


async def recover():
    """At worker start: a broadcast cut off by a restart is queued again and continues where it stopped."""
    await db.pool().execute("UPDATE broadcasts SET state = 'queued' WHERE state = 'running'")


async def _send(user_id: int, text: str) -> bool:
    for attempt in range(3):
        try:
            await send_message(user_id, text, parse_mode=None)  # as the admin typed it
            return True
        except httpx.HTTPStatusError as e:
            wait = ((e.response.json() or {}).get("parameters") or {}).get("retry_after") if e.response.status_code == 429 else None
            if wait and attempt < 2:
                await asyncio.sleep(wait + 1); continue
            return False  # blocked the bot, deleted account, ...
        except httpx.HTTPError:
            return False
    return False


async def run(b: dict):
    p = db.pool()
    users = "FROM users WHERE ($1::text IS NULL OR lang = $1)"
    if not b["last_user"]:  # a fresh start (not a resume): count the audience
        await p.execute(f"UPDATE broadcasts SET total = (SELECT count(*) {users}) WHERE id = $2", b["lang"], b["id"])
    ids = [r["id"] for r in await p.fetch(f"SELECT id {users} AND id > $2 ORDER BY id", b["lang"], b["last_user"])]
    for user_id in ids:
        ok = await _send(user_id, b["text"])
        await p.execute(f"UPDATE broadcasts SET last_user = $2, {'sent = sent' if ok else 'failed = failed'} + 1 WHERE id = $1", b["id"], user_id)
        await asyncio.sleep(PAUSE)
    await p.execute("UPDATE broadcasts SET state = 'done', finished = now() WHERE id = $1", b["id"])


async def loop(stopping: asyncio.Event, every: float = 5):
    """A task of the worker: send queued broadcasts one after another."""
    while not stopping.is_set():
        try:
            while b := await claim():
                log.info("broadcast %s started", b["id"])
                await run(b)
        except Exception:
            log.exception("Ommaviy xabarni yuborib bo'lmadi")
        try:
            await asyncio.wait_for(stopping.wait(), every)
        except TimeoutError:
            pass

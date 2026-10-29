"""
The worker: draws the paid presentations from the `jobs` queue (app/services/jobs.py).

    python -m app.worker          (systemd: slideai-worker.service)

Up to WORKER_CONCURRENCY jobs at a time; woken by NOTIFY jobs when the API adds one, and every few seconds anyway.
On SIGTERM it takes no new jobs and lets the running ones finish (systemd waits up to TimeoutStopSec).
"""
import asyncio
import logging
import signal

from app.core import alerts, db, systemd, telegram
from app.core.config import settings
from app.services import billing, growth, housekeeping, jobs
from app.services.ai import models

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s %(message)s")
logging.getLogger("httpx").setLevel(logging.WARNING)  # its request lines contain the bot token
log = logging.getLogger("worker")
POLL = 5  # s: look for jobs even without a NOTIFY


async def _hourly():
    """Cleanup, and the money check: every cached balance must equal its ledger."""
    while True:
        try:
            await asyncio.to_thread(housekeeping.sweep)
        except Exception:
            log.exception("Vaqtinchalik fayllarni tozalash ishlamadi")
        try:  # the website: invite bonuses after a first top-up; visitor hashes older than 90 days
            await growth.settle()
            await growth.purge()
        except Exception:
            log.exception("Taklif bonuslarini hisoblab bo'lmadi")
        try:
            if diff := await billing.reconcile():
                log.error("Balans va ledger mos emas: %s", diff[:10])
        except Exception:
            log.exception("Balanslarni tekshirib bo'lmadi")
        await asyncio.sleep(3600)


async def main(stopping: asyncio.Event | None = None):
    """Run until SIGTERM / SIGINT (or until `stopping` is set: tests)."""
    alerts.install("worker")
    await db.connect(max_size=settings.worker_concurrency + 3)
    loop = asyncio.get_running_loop()
    models.on_usage = jobs.save_usage  # every Gemini request -> ai_usage
    await jobs.recover()

    wake = asyncio.Event()
    if stopping is None:
        stopping = asyncio.Event()
        for sig in (signal.SIGTERM, signal.SIGINT):
            loop.add_signal_handler(sig, stopping.set)
    def on_notify(*_):
        wake.set()
    listener = await db.pool().acquire()
    await listener.add_listener("jobs", on_notify)
    slots = asyncio.Semaphore(settings.worker_concurrency)
    background = [asyncio.create_task(_hourly()), asyncio.create_task(systemd.watchdog())]
    running: set[asyncio.Task] = set()

    async def work(job):
        try:
            await jobs.run(job)
        finally:
            slots.release()

    log.info("worker started: %d at a time", settings.worker_concurrency)
    alerts.started("worker")
    while not stopping.is_set():
        await slots.acquire()
        wake.clear()  # before claiming: a NOTIFY that comes during claim() is not lost
        job = await jobs.claim()
        if job is None:
            slots.release()
            waits = [asyncio.create_task(wake.wait()), asyncio.create_task(stopping.wait())]
            await asyncio.wait(waits, timeout=POLL, return_when=asyncio.FIRST_COMPLETED)
            for w in waits:
                w.cancel()
            continue
        log.info("job %s (%s) for user %s", job["id"], job["kind"], job["user_id"])
        task = asyncio.create_task(work(job))
        running.add(task); task.add_done_callback(running.discard)

    log.info("stopping: waiting for %d running jobs", len(running))
    for task in background:
        task.cancel()
    await asyncio.gather(*running, return_exceptions=True)
    await listener.remove_listener("jobs", on_notify)
    await db.pool().release(listener)
    await telegram.close()


async def run():
    try:
        await main()
    finally:
        await db.close()


if __name__ == "__main__":
    asyncio.run(run())

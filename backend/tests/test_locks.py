"""Server-wide "one at a time" locks (core/locks.py): they hold across processes, threads and async code."""
import asyncio
import multiprocessing
import time

from app.core import locks


def _hold(name, seconds, ready):
    with locks.machine_lock(name):
        ready.set()
        time.sleep(seconds)


async def test_a_lock_held_by_another_process_is_waited_for(tmp_path, monkeypatch):
    monkeypatch.setattr(locks, "DATA_DIR", tmp_path)
    ctx = multiprocessing.get_context("fork")
    ready = ctx.Event()
    other = ctx.Process(target=_hold, args=("office", 0.6, ready))
    other.start()
    assert ready.wait(5)
    started = time.monotonic()
    await asyncio.to_thread(lambda: locks.machine_lock("office").__enter__())  # blocking variant, in a thread
    assert time.monotonic() - started > 0.3
    other.join()


async def test_async_lock_waits_without_blocking_and_can_be_cancelled(tmp_path, monkeypatch):
    monkeypatch.setattr(locks, "DATA_DIR", tmp_path)
    monkeypatch.setattr(locks, "POLL", 0.01)
    order = []

    async def job(n, hold):
        async with locks.machine_lock_async("drawing"):
            order.append(f"in{n}")
            await asyncio.sleep(hold)
            order.append(f"out{n}")
    first = asyncio.create_task(job(1, 0.1))
    await asyncio.sleep(0.02)
    waiting = asyncio.create_task(job(2, 0))
    ticks = 0
    while not first.done():  # the event loop keeps running while job 2 waits
        ticks += 1
        await asyncio.sleep(0.005)
    await waiting
    assert order == ["in1", "out1", "in2", "out2"] and ticks > 5
    first = asyncio.create_task(job(3, 0.2))
    await asyncio.sleep(0.02)
    cancelled = asyncio.create_task(job(4, 0))
    await asyncio.sleep(0.03)
    cancelled.cancel()
    await first
    async with locks.machine_lock_async("drawing"):  # free again: the cancelled waiter took nothing
        pass

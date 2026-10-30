"""
"One at a time on this server" for heavy work (LibreOffice, node drawing): a lock file under data/locks/, held with
flock, so it holds across every process (API workers, the worker) and every thread. The kernel drops the lock when
its holder dies, so a crash never leaves it stuck. These guard this machine's CPU and memory, not data: data is in
PostgreSQL.

    with machine_lock("office"): ...           blocking code (threads)
    async with machine_lock_async("drawing"):  async code; waiting does not block the event loop and can be cancelled
"""
import asyncio
import fcntl
from collections.abc import AsyncIterator, Iterator
from contextlib import asynccontextmanager, contextmanager

from app.core.config import DATA_DIR

POLL = 0.2  # s between tries while another process holds it


def _path(name: str):
    folder = DATA_DIR / "locks"
    folder.mkdir(parents=True, exist_ok=True)
    return folder / f"{name}.lock"


@contextmanager
def machine_lock(name: str) -> Iterator[None]:
    with open(_path(name), "a") as f:
        fcntl.flock(f, fcntl.LOCK_EX)
        try:
            yield
        finally:
            fcntl.flock(f, fcntl.LOCK_UN)


@asynccontextmanager
async def machine_lock_async(name: str) -> AsyncIterator[None]:
    with open(_path(name), "a") as f:
        while True:
            try:
                fcntl.flock(f, fcntl.LOCK_EX | fcntl.LOCK_NB)
                break
            except BlockingIOError:
                await asyncio.sleep(POLL)
        try:
            yield
        finally:
            fcntl.flock(f, fcntl.LOCK_UN)

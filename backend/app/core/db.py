"""
The one PostgreSQL database of the bot and the backend (asyncpg).

    DATABASE_URL=postgresql://slideai:<password>@127.0.0.1:5432/slideai

Each process (uvicorn, polling.py, worker.py) opens its own small pool with `await db.connect()` and closes it
with `await db.close()`. connect() first applies the migrations/NNNN_*.sql files that this database has not
had yet, each in its own transaction and recorded in schema_migrations, so a new server needs only an empty
database. Photos and editor files stay on disk in data/; the database holds everything else.
"""
import json
from contextlib import asynccontextmanager

import asyncpg

from app.core.config import MIGRATIONS_DIR, settings

MIGRATIONS = MIGRATIONS_DIR
_pool: asyncpg.Pool | None = None


async def _init_conn(con):
    for t in ("json", "jsonb"):  # dicts in, dicts out
        await con.set_type_codec(t, encoder=lambda v: json.dumps(v, ensure_ascii=False), decoder=json.loads, schema="pg_catalog")


async def connect(min_size: int = 1, max_size: int = 5):
    global _pool
    if _pool is None:
        if not settings.database_url:
            raise RuntimeError("DATABASE_URL is not set")
        _pool = await asyncpg.create_pool(settings.database_url, min_size=min_size, max_size=max_size, init=_init_conn)
        async with _pool.acquire() as con:
            await migrate(con)
    return _pool


async def migrate(con) -> list[str]:
    """Apply the migration files this database has not had yet, in name order. An advisory lock makes the
    processes that start together (backend, bot, worker) take turns; the first one does the work."""
    await con.execute("SELECT pg_advisory_lock(727001)")
    try:
        await con.execute("CREATE TABLE IF NOT EXISTS schema_migrations (version TEXT PRIMARY KEY, applied TIMESTAMPTZ NOT NULL DEFAULT now())")
        done = {r["version"] for r in await con.fetch("SELECT version FROM schema_migrations")}
        applied = []
        for f in sorted(MIGRATIONS.glob("[0-9][0-9][0-9][0-9]_*.sql")):
            if f.stem in done:
                continue
            async with con.transaction():
                await con.execute(f.read_text(encoding="utf-8"))
                await con.execute("INSERT INTO schema_migrations (version) VALUES ($1)", f.stem)
            applied.append(f.stem)
        return applied
    finally:
        await con.execute("SELECT pg_advisory_unlock(727001)")


async def close():
    global _pool
    if _pool is not None:
        await _pool.close()
        _pool = None


def pool() -> asyncpg.Pool:
    if _pool is None:
        raise RuntimeError("db.connect() was not awaited")
    return _pool


@asynccontextmanager
async def transaction():
    """One transaction: commits on success, rolls back on any exception. Rows that are about to change are
    locked with SELECT ... FOR UPDATE inside it, so parallel requests for the same user / order wait in turn."""
    async with pool().acquire() as con, con.transaction():
        yield con

"""
Every presentation a user has made, so any of them can be redrawn in another template.

decks table (db.py)                        id, user_id, created, updated, request, content
data/<user_id>/decks/<deck_id>/img-NN.jpg  the deck's photos (kept, so a redraw needs no new image search)
"""
import shutil
import time
from pathlib import Path

from app.core import db
from app.core.config import DATA_DIR

DATA = DATA_DIR


def new_id() -> str:
    return str(time.time_ns() // 1_000_000)


def keep_images(user_id: int, deck_id: str, content: dict):
    """Copy the deck's photos out of the job's temp folder into the deck's own folder (blocking file work)."""
    folder = DATA / str(user_id) / "decks" / str(deck_id)
    folder.mkdir(parents=True, exist_ok=True)
    for i, sl in enumerate(content["slides"]):
        img = sl.get("image")
        p = img.get("src") if isinstance(img, dict) else img
        if p and Path(p).exists() and Path(p).parent != folder:
            dst = folder / f"img-{i:02d}{Path(p).suffix or '.jpg'}"; shutil.copy(p, dst)
            sl["image"] = {**img, "src": str(dst)} if isinstance(img, dict) else str(dst)


async def save(user_id: int, content: dict, request: dict, deck_id: str) -> str:
    """Store a new deck or replace an existing one (after a redraw); call keep_images() first. Returns the deck id."""
    await db.pool().execute(
        """INSERT INTO decks (id, user_id, request, content) VALUES ($1, $2, $3, $4)
           ON CONFLICT (id) DO UPDATE SET updated = now(), request = excluded.request, content = excluded.content
           WHERE decks.user_id = excluded.user_id""",
        deck_id, user_id, request, content)
    return deck_id


async def load(user_id: int, deck_id: str) -> dict | None:
    """Only the user's own decks."""
    row = await db.pool().fetchrow("SELECT id, created, updated, request, content FROM decks WHERE id = $1 AND user_id = $2",
                                   str(deck_id), user_id)
    return dict(row) if row else None


async def list_all(user_id: int) -> list[dict]:
    """Short info for the Mini App, newest first."""
    rows = await db.pool().fetch(
        """SELECT id, content->'meta'->>'topic' AS topic, (request->>'template_id')::int AS template_id,
                  jsonb_array_length(content->'slides') AS slides,
                  extract(epoch FROM created)::bigint AS created, extract(epoch FROM updated)::bigint AS updated  -- the Mini App wants seconds
           FROM decks WHERE user_id = $1 ORDER BY decks.created DESC""", user_id)
    return [dict(r) for r in rows]


async def delete(user_id: int, deck_id: str) -> bool:
    """Remove one of the user's decks and its photos. False if there was no such deck of theirs."""
    gone = await db.pool().fetchval("DELETE FROM decks WHERE id = $1 AND user_id = $2 RETURNING 1", str(deck_id), user_id)
    if gone:
        shutil.rmtree(DATA / str(user_id) / "decks" / str(deck_id), ignore_errors=True)
    return bool(gone)

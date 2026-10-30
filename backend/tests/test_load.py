"""Busy-server behaviour: ordinary requests do not write to the database; the settings are cached briefly."""
import hashlib

from conftest import add_user

from app.core import db
from app.services import app_settings, users, web_auth


async def _xmin(table: str, where: str, *args):
    return await db.pool().fetchval(f"SELECT xmin::text FROM {table} WHERE {where}", *args)  # changes on every write


async def test_a_signed_in_request_reads_the_session_without_writing():
    await add_user(5)
    await db.pool().execute("INSERT INTO web_sessions (token_hash, user_id, expires) VALUES ($1, 5, now() + interval '1 day')",
                            hashlib.sha256(b"tok").hexdigest())
    before = await _xmin("web_sessions", "user_id = 5")
    assert await web_auth.session("tok") == 5 and await web_auth.session("tok") == 5
    assert await _xmin("web_sessions", "user_id = 5") == before
    await db.pool().execute("UPDATE web_sessions SET last_seen = now() - interval '10 minutes'")
    stale = await _xmin("web_sessions", "user_id = 5")
    assert await web_auth.session("tok") == 5 and await _xmin("web_sessions", "user_id = 5") != stale  # 5 minutes: refreshed
    assert await web_auth.session("nope") is None


async def test_seeing_a_user_again_writes_only_what_changed():
    await users.touch({"id": 6, "first_name": "Ali", "username": "ali"})
    before = await _xmin("users", "id = 6")
    await users.touch({"id": 6, "first_name": "Ali", "username": "ali"})
    await users.touch({"id": 6, "first_name": "Ali"})  # no username in this update: the saved one stays
    assert await _xmin("users", "id = 6") == before
    await users.touch({"id": 6, "first_name": "Vali"})
    assert await db.pool().fetchval("SELECT first_name || ' ' || username FROM users WHERE id = 6") == "Vali ali"


async def test_settings_are_cached_briefly_and_a_change_is_seen_at_once(monkeypatch):
    assert (await app_settings.get())["price_generate"] == 5000
    await db.pool().execute("INSERT INTO app_settings (key, value) VALUES ('price_generate', '9000')")  # another process
    assert (await app_settings.get())["price_generate"] == 5000  # cached
    monkeypatch.setattr(app_settings, "TTL", 0)
    assert (await app_settings.get())["price_generate"] == 9000
    monkeypatch.setattr(app_settings, "TTL", 60)
    await app_settings.set_many({"price_generate": 7000}, 1)  # this process changed it: no waiting
    got = await app_settings.get()
    assert got["price_generate"] == 7000
    got["topup_amounts"].append(1)  # callers get their own copy
    assert 1 not in (await app_settings.get())["topup_amounts"]

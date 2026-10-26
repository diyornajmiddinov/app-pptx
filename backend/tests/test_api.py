"""Mini App API through the ASGI app (no network)."""
import httpx
import pytest
from conftest import add_user
from test_auth import init_data

from app.api import main
from app.core import db
from app.core.auth import make_app_token
from app.services import billing, decks, jobs

U = 601


@pytest.fixture
async def client():
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=main.app), base_url="http://t") as c:
        yield c


def h(uid=U):
    return {"X-Telegram-Init-Data": init_data(uid)}


async def test_me_with_init_data_and_with_keyboard_token(client):
    await add_user(U, balance=12000, name="Vali")
    r = (await client.get("/api/me", headers=h())).json()
    assert r["balance"] == 12000 and r["prices"]["generate"] == 5000
    r = (await client.get("/api/me", headers={"X-App-Token": make_app_token(U)})).json()
    assert r["user"]["first_name"] == "T"  # updated from the initData user of the first call
    assert (await client.get("/api/me")).status_code == 401


async def test_language_is_saved(client):
    await client.post("/api/me", headers=h(), json={"lang": "en"})
    assert await db.pool().fetchval("SELECT lang FROM users WHERE id = $1", U) == "en"


async def test_generate_without_money_is_402_and_sends_top_up_buttons(client, tg):
    await add_user(U)
    body = {"user_id": U, "template_id": 3, "slide_count": 8, "language": "uz", "topic": "Mavzu"}
    r = await client.post("/api/generate", headers=h(), json=body)
    assert r.status_code == 402 and "inline_keyboard" in tg.last()["reply_markup"]


async def test_generate_for_someone_else_is_403(client):
    await add_user(U, balance=10000)
    body = {"user_id": U + 1, "template_id": 3, "slide_count": 8, "topic": "Mavzu"}
    assert (await client.post("/api/generate", headers=h(), json=body)).status_code == 403
    assert await billing.balance(U) == 10000


async def test_failed_generation_is_refunded(client, tg, monkeypatch):
    await add_user(U, balance=10000)
    def broken(*a, **k):
        raise RuntimeError("AI kontenti tekshiruvdan o'tmadi: test")
    monkeypatch.setattr(jobs, "build", broken)
    body = {"user_id": U, "template_id": 3, "slide_count": 8, "topic": "Mavzu"}
    assert (await client.post("/api/generate", headers=h(), json=body)).status_code == 202
    await jobs.run_pending()  # what the worker does
    assert await billing.balance(U) == 10000
    assert any("qaytarildi" in t or "refund" in t.lower() for t in tg.texts())


async def test_successful_generation_saves_the_deck_and_sends_the_file(client, tg, monkeypatch, tmp_path):
    await add_user(U, balance=10000)
    content = {"meta": {"topic": "Mavzu"}, "slides": [{"type": "cover", "title": "Mavzu"}, {"type": "closing", "title": "Rahmat"}]}
    def fake_build(req, deck_id, user_id):
        p = tmp_path / "slideai-x.pptx"; p.write_bytes(b"pptx"); return p, content
    monkeypatch.setattr(jobs, "build", fake_build)
    body = {"user_id": U, "template_id": 3, "slide_count": 8, "topic": "Mavzu"}
    assert (await client.post("/api/generate", headers=h(), json=body)).status_code == 202
    await jobs.run_pending()  # what the worker does
    assert await billing.balance(U) == 5000
    assert tg.sent("sendDocument")
    lst = (await client.get("/api/decks", headers=h())).json()["decks"]
    assert lst[0]["topic"] == "Mavzu" and lst[0]["slides"] == 2


async def test_restyle_rules(client):
    await add_user(U, balance=10000)
    did = await decks.save(U, {"meta": {"topic": "T"}, "slides": [{"type": "cover"}]}, {"template_id": 3}, "77")
    same = {"user_id": U, "template_id": 3, "deck_id": did}
    assert (await client.post("/api/restyle", headers=h(), json=same)).status_code == 422
    assert (await client.post("/api/restyle", headers=h(), json={**same, "deck_id": "12345"})).status_code == 404
    await add_user(U + 1)
    assert (await client.post("/api/restyle", headers=h(U + 1), json={**same, "user_id": U + 1, "template_id": 4})).status_code == 404
    assert await billing.balance(U) == 10000


async def test_busy_worker_tells_how_many_are_ahead(client, tg, monkeypatch):
    await add_user(U, balance=50000)
    body = {"user_id": U, "template_id": 3, "slide_count": 8, "topic": "Mavzu"}
    for _ in range(3):
        r = await client.post("/api/generate", headers=h(), json=body)
    assert r.json()["ahead"] == 2
    assert "Navbatda oldingizda 2 ta" in tg.texts()[-1]  # 2 workers busy -> it has to wait

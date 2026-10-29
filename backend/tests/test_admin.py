"""Admin panel API."""
import httpx
import pytest
from conftest import ADMIN, add_user

from app.api import main
from app.core import db
from app.core.auth import make_admin_token
from app.services import billing, payments


@pytest.fixture
async def admin():
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=main.app), base_url="http://t",
                                 headers={"X-Admin-Token": make_admin_token(ADMIN)}) as c:
        yield c


async def test_needs_an_admin_token(admin):
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=main.app), base_url="http://t") as c:
        assert (await c.get("/api/admin/stats")).status_code == 401
        assert (await c.get("/api/admin/stats", headers={"X-Admin-Token": make_admin_token(5)})).status_code == 401


async def test_dashboard_and_lists(admin):
    await add_user(7, balance=20000)
    await billing.charge(7, 5000, "generate")
    k = (await admin.get("/api/admin/stats")).json()["kpi"]
    assert k["users"] == 1 and k["balances"] == 15000 and k["generations"] == 1
    assert k["jobs_queued"] == 0 and k["jobs_failed_1d"] == 0
    users = (await admin.get("/api/admin/users", params={"q": "7"})).json()
    assert users["total"] == 1 and users["items"][0]["balance"] == 15000
    assert (await admin.get("/api/admin/users/7")).json()["totals"]["spent"] == 5000
    for path in ("orders", "ledger", "decks", "broadcasts", "settings", "log"):
        assert (await admin.get(f"/api/admin/{path}")).status_code == 200, path


async def test_balance_change_cannot_go_negative_and_is_logged(admin):
    await add_user(7)
    assert (await admin.post("/api/admin/users/7/balance", json={"amount": 3000, "note": "naqd"})).json()["balance"] == 3000
    assert (await admin.post("/api/admin/users/7/balance", json={"amount": -5000})).status_code == 422
    assert (await admin.post("/api/admin/users/7/balance", json={"amount": 0})).status_code == 422  # Field(ne=0) never worked
    log = (await admin.get("/api/admin/log")).json()["items"]
    assert log[0]["action"] == "balance" and log[0]["details"]["note"] == "naqd"


async def test_card_decision_from_the_panel(admin, tg):
    await add_user(7)
    oid = await payments.create_order(7, 30000, "card")
    await payments.card_submit(7, "f", "photo")
    assert (await admin.post(f"/api/admin/orders/{oid}/decide", json={"approve": True})).json()["outcome"] == "paid"
    assert await billing.balance(7) == 30000 and any("30" in t for t in tg.texts())
    assert (await admin.post(f"/api/admin/orders/{oid}/decide", json={"approve": True})).status_code == 409


async def test_prices_change_for_bot_and_app(admin):
    r = await admin.put("/api/admin/settings", json={"price_generate": 7000, "price_restyle": 3000, "topup_amounts": [20000, 10000]})
    assert r.json()["values"] == {"price_generate": 7000, "price_restyle": 3000, "topup_amounts": [10000, 20000],
                                  "referral_bonus": 1000, "first_generate_price": None}  # the website's two: .env defaults
    assert (await admin.put("/api/admin/settings", json={"price_generate": 1, "price_restyle": 1, "topup_amounts": [5]})).status_code == 422
    assert await db.pool().fetchval("SELECT value FROM app_settings WHERE key = 'price_generate'") == 7000


async def test_card_screenshot_is_proxied_from_telegram(admin, tg, monkeypatch):
    await add_user(7)
    oid = await payments.create_order(7, 15000, "card")
    await payments.card_submit(7, "shot-1", "photo")
    tg.files["shot-1"] = b"\xff\xd8\xff\xe0jpeg"
    from app.api.routes import admin as admin_routes
    monkeypatch.setattr(admin_routes, "download_file", tg.download_file)  # imported by name in the route module
    r = await admin.get(f"/api/admin/orders/{oid}/screenshot")
    assert r.status_code == 200 and r.headers["content-type"] == "image/jpeg"


async def test_broadcast_reaches_everyone_it_can(admin, tg, monkeypatch):
    import asyncio
    for uid in (11, 12, 13):
        await add_user(uid, lang="uz")
    await add_user(14, lang="ru")
    from app.core import telegram
    real = tg.call

    async def call(method, **kw):
        if (kw.get("json") or {}).get("chat_id") == 12:
            raise httpx.HTTPStatusError("blocked", request=httpx.Request("POST", "x"), response=httpx.Response(403))
        return await real(method, **kw)
    monkeypatch.setattr(telegram, "call", call)
    assert (await admin.post("/api/admin/broadcasts", json={"text": "Salom", "test": True})).json()["test"]
    bid = (await admin.post("/api/admin/broadcasts", json={"text": "Yangi shablonlar!", "lang": "uz"})).json()["id"]
    for _ in range(50):
        b = (await admin.get("/api/admin/broadcasts")).json()["items"][0]
        if b["state"] == "done":
            break
        await asyncio.sleep(0.1)
    assert b["id"] == bid and (b["total"], b["sent"], b["failed"]) == (3, 2, 1)
    assert (await admin.post("/api/admin/broadcasts", json={"text": "x"})).status_code == 200  # the first one finished


async def test_deck_download_redraws_the_saved_content(admin, monkeypatch, tmp_path):
    from app.api.routes import admin as admin_routes
    from app.services import decks
    await add_user(7)
    await decks.save(7, {"meta": {"topic": "Soliq / 2026"}, "slides": [{"type": "cover"}]}, {"template_id": 4}, "99")

    async def fake_render(content, template_id, out):
        out.write_bytes(b"PK-pptx"); return out
    monkeypatch.setattr(admin_routes, "render", fake_render)
    r = await admin.get("/api/admin/decks/99/download")
    assert r.content == b"PK-pptx" and "Soliq%20_%202026.pptx" in r.headers["content-disposition"]  # RFC 5987: a slash cannot reach the file name
    assert (await admin.get("/api/admin/decks/nope/download")).status_code == 404

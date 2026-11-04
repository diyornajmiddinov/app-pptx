"""The archive channel: a copy of every file made, with who made it; never in the user's way."""
import httpx
import pytest
from conftest import ADMIN, add_user

from app.api import main
from app.core import db, telegram
from app.core.auth import make_admin_token
from app.services import app_settings, archive, jobs

U = 801
ARCHIVE = "-100777"


@pytest.fixture
def made(monkeypatch, tmp_path):
    """jobs.build makes a one-slide 'deck' without AI or node."""
    async def build(req, deck_id, user_id):
        p = tmp_path / f"slideai-{deck_id}.pptx"
        p.write_bytes(b"PK-deck")
        return p, {"meta": {"topic": req["topic"]}, "slides": [{"type": "cover"}] * 9}
    monkeypatch.setattr(jobs, "build", build)


def docs_to(tg, chat):
    return [kw for m, kw in tg.calls if m == "sendDocument" and str(kw.get("chat_id")) == str(chat)]


async def test_nothing_goes_anywhere_without_a_channel(tg, made):
    await db.pool().execute("INSERT INTO users (id, first_name) VALUES ($1, 'Ali')", U)
    await jobs.order("generate", U, {"topic": "Mavzu", "template_id": 3, "slide_count": 9}, 0)
    await jobs.run_pending()
    assert len(tg.sent("sendDocument")) == 2  # only to the user: the deck and its PDF


async def test_a_new_deck_is_copied_with_who_made_it(tg, made):
    await add_user(U, balance=5000, name="Ali <Vali>")
    await db.pool().execute("UPDATE users SET username = 'ali' WHERE id = $1", U)
    await app_settings.set_many({"archive_channel": ARCHIVE}, 1)
    await jobs.order("generate", U, {"topic": "Soliq & byudjet", "template_id": 3, "slide_count": 9, "via": "web"})
    await jobs.run_pending()
    to_user, copy = docs_to(tg, U), docs_to(tg, ARCHIVE)
    assert len(to_user) == 2 and len(copy) == 1  # the PDF is not archived
    cap = copy[0]["caption"]
    assert "📊 <b>Taqdimot</b>" in cap and "Ali &lt;Vali&gt; (@ali)" in cap and f"<code>{U}</code>" in cap
    assert "«Soliq &amp; byudjet»" in cap and "9 slayd · shablon #3" in cap and "5 000 so'm · sayt" in cap


async def test_a_sent_file_goes_by_its_id_not_uploaded_again(tg, monkeypatch):
    calls = []

    async def call(method, **kw):
        calls.append((method, kw))
        return {"ok": True, "result": {}}
    monkeypatch.setattr(telegram, "call", call)
    await add_user(U)
    await app_settings.set_many({"archive_channel": ARCHIVE}, 1)
    await archive.post("pdf", U, sent={"result": {"document": {"file_id": "F1"}}}, path="/nonexistent", topic="Rasmlar", via="bot")
    (method, kw), = calls
    assert method == "sendDocument" and kw["json"]["document"] == "F1" and kw["json"]["chat_id"] == ARCHIVE
    assert "🖼 <b>Rasmdan PDF</b>" in kw["json"]["caption"]


async def test_a_broken_archive_never_stops_the_users_file(tg, made, monkeypatch, caplog):
    real = tg.call

    async def call(method, **kw):
        if str((kw.get("data") or kw.get("json") or {}).get("chat_id")) == ARCHIVE:
            raise httpx.HTTPStatusError("403", request=httpx.Request("POST", "x"), response=httpx.Response(403))
        return await real(method, **kw)
    monkeypatch.setattr(telegram, "call", call)
    await add_user(U, balance=5000)
    await app_settings.set_many({"archive_channel": ARCHIVE}, 1)
    await jobs.order("generate", U, {"topic": "Mavzu", "template_id": 3, "slide_count": 9})
    await jobs.run_pending()
    assert await db.pool().fetchval("SELECT state FROM jobs") == "done" and docs_to(tg, U)
    assert "not posted" in caplog.text


async def test_the_panel_checks_the_archive_channel_and_says_hello(monkeypatch):
    role = {"status": "member"}
    sent = []

    async def call(method, **kw):
        body = kw.get("json") or {}
        if method == "getChat":
            return {"ok": True, "result": {"id": -100555, "type": "channel", "title": "Arxiv"}}
        if method == "getMe":
            return {"ok": True, "result": {"id": 42}}
        if method == "getChatMember":
            return {"ok": True, "result": role}
        sent.append(body)
        return {"ok": True, "result": {}}
    monkeypatch.setattr(telegram, "call", call)
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=main.app), base_url="http://t",
                                 headers={"X-Admin-Token": make_admin_token(ADMIN)}) as admin:
        assert (await admin.put("/api/admin/archive", json={"channel": "-100555"})).status_code == 422  # not an admin there
        role.update(status="administrator", can_post_messages=False)
        assert (await admin.put("/api/admin/archive", json={"channel": "-100555"})).status_code == 422  # may not post
        role["can_post_messages"] = True
        r = (await admin.put("/api/admin/archive", json={"channel": "-100555"})).json()
        assert r == {"archive_channel": "-100555", "title": "Arxiv", "public": False}
        assert "arxiv kanali ulandi" in sent[-1]["text"]
        assert (await admin.put("/api/admin/archive", json={"channel": ""})).json()["archive_channel"] == ""

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
    async def broken(*a, **k):
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
    async def fake_build(req, deck_id, user_id):
        p = tmp_path / "slideai-x.pptx"; p.write_bytes(b"pptx"); return p, content
    monkeypatch.setattr(jobs, "build", fake_build)
    body = {"user_id": U, "template_id": 3, "slide_count": 8, "topic": "Mavzu"}
    assert (await client.post("/api/generate", headers=h(), json=body)).status_code == 202
    await jobs.run_pending()  # what the worker does
    assert await billing.balance(U) == 5000
    sent = str(tg.sent("sendDocument")[0])
    assert "Kompyuterda PowerPoint" in sent and "slayd-shou" not in sent  # the phone note; not animated: no slide-show line
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
    from app.core.config import settings
    monkeypatch.setattr(settings, "worker_concurrency", 2)
    await add_user(U, balance=50000)
    body = {"user_id": U, "template_id": 3, "slide_count": 8, "topic": "Mavzu"}
    for _ in range(3):
        r = await client.post("/api/generate", headers=h(), json=body)
    assert r.json()["ahead"] == 2
    assert "Navbatda oldingizda <b>2 ta</b>" in tg.texts()[-1]  # 2 workers busy -> it has to wait


# ---------------------------------------------------------------- the first deck may be free (admin panel)

async def test_first_deck_free_in_the_mini_app_once(client, tg):
    from app.services import app_settings
    await app_settings.set_many({"first_generate_price": 0}, 1000)
    await add_user(U)  # no money at all
    assert (await client.get("/api/me", headers=h())).json()["prices"]["now"] == 0
    body = {"user_id": U, "template_id": 3, "slide_count": 7, "language": "uz", "topic": "Mavzu"}
    assert (await client.post("/api/generate", headers=h(), json=body)).status_code == 202
    assert await billing.balance(U) == 0
    assert await db.pool().fetchval("SELECT price FROM jobs") == 0
    assert (await client.get("/api/me", headers=h())).json()["prices"]["now"] == 5000
    assert (await client.post("/api/generate", headers=h(), json=body)).status_code == 402  # the second one is paid


async def test_a_free_first_deck_has_up_to_ten_slides_a_longer_one_is_paid(client, tg):
    from app.services import app_settings
    await app_settings.set_many({"first_generate_price": 0}, 1000)
    await add_user(U)  # no money
    assert (await client.get("/api/me", headers=h())).json()["prices"]["first_max_slides"] == jobs.FIRST_MAX_SLIDES == 10
    body = {"user_id": U, "template_id": 3, "slide_count": 11, "language": "uz", "topic": "Mavzu"}
    assert (await client.post("/api/generate", headers=h(), json=body)).status_code == 402  # 11 slides: the usual price
    assert "Kerak: <b>5\xa0000" in tg.texts()[-1]  # the top-up message names that price, not 0
    assert not await db.pool().fetchval("SELECT count(*) FROM jobs")
    await billing.top_up(U, 5000, "test-1")
    assert (await client.post("/api/generate", headers=h(), json=body)).status_code == 202
    assert await billing.balance(U) == 0 and await db.pool().fetchval("SELECT price FROM jobs") == 5000
    assert (await client.get("/api/me", headers=h())).json()["prices"]["now"] == 5000  # that was the first deck


async def test_ten_slides_stay_free(tg):
    from app.services import app_settings
    await app_settings.set_many({"first_generate_price": 0}, 1000)
    await add_user(U)
    assert (await jobs.order("generate", U, {"topic": "Mavzu", "template_id": 1, "slide_count": 10}))[2] == 0


async def test_two_requests_at_once_get_one_free_deck(tg):
    import asyncio

    from app.services import app_settings
    await app_settings.set_many({"first_generate_price": 0}, 1000)
    await add_user(U, balance=10000)
    payload = {"topic": "Mavzu", "template_id": 1, "slide_count": 7}
    results = await asyncio.gather(*(jobs.order("generate", U, payload) for _ in range(3)), return_exceptions=True)
    assert sorted(r[2] for r in results) == [0, 5000, 5000]  # 10 000 so'm: one free deck + two paid
    await db.pool().execute("UPDATE jobs SET state = 'done'")
    with pytest.raises(jobs.LowBalance):
        await jobs.order("generate", U, payload)
    assert await billing.balance(U) == 0 and not await billing.reconcile()


async def test_a_failed_first_deck_leaves_the_free_one(tg, monkeypatch):
    from app.services import app_settings
    await app_settings.set_many({"first_generate_price": 0}, 1000)
    await add_user(U)

    async def broken(*a, **k):
        raise RuntimeError("test")
    monkeypatch.setattr(jobs, "build", broken)
    assert (await jobs.order("generate", U, {"topic": "Mavzu", "template_id": 1, "slide_count": 7}))[2] == 0
    await jobs.run_pending()  # failed, "refunded" 0
    assert await jobs.generate_price(U) == 0  # still the first deck
    await db.pool().execute("INSERT INTO decks (id, user_id, request, content) VALUES ('1', $1, '{}', '{}')", U)
    assert await jobs.generate_price(U) == 5000  # a deck from before the jobs table counts too


async def test_one_user_cannot_fill_the_queue(client, tg):
    await add_user(U, balance=100000)
    body = {"user_id": U, "template_id": 3, "slide_count": 8, "language": "uz", "topic": "Mavzu"}
    codes = [(await client.post("/api/generate", headers=h(), json=body)).status_code for _ in range(jobs.MAX_ACTIVE + 1)]
    assert codes == [202] * jobs.MAX_ACTIVE + [429]
    assert await billing.balance(U) == 100000 - 5000 * jobs.MAX_ACTIVE  # the refused one took no money
    await db.pool().execute("UPDATE jobs SET state = 'done' WHERE id = (SELECT min(id) FROM jobs)")
    assert (await client.post("/api/generate", headers=h(), json=body)).status_code == 202  # one finished: room again


# ---------------------------------------------------------------- referat from the bot (Mini App paper form)

async def test_paper_from_the_mini_app_is_charged_queued_and_announced(client, tg):
    await add_user(U, balance=10000)
    body = {"topic": "Inflyatsiya", "doc_type": "mustaqil", "language": "uzc", "pages": 12, "university": "TDIU",
            "format": {"font_size": 12, "page_numbers": "top_right"}}
    assert (await client.get("/api/me", headers=h())).json()["prices"]["paper"] == 7000
    r = await client.post("/api/paper", headers=h(), json=body)
    assert r.status_code == 202, r.text
    assert await billing.balance(U) == 3000
    job = await db.pool().fetchrow("SELECT kind, price, payload FROM jobs")
    assert job["kind"] == "paper" and job["price"] == 7000
    assert job["payload"]["via"] == "bot" and job["payload"]["format"]["page_numbers"] == "top_right"
    assert "Inflyatsiya" in tg.texts()[-1] and "Word" in tg.texts()[-1]
    assert (await client.post("/api/paper", headers=h(), json=body)).status_code == 402  # 3 000 left


async def test_paper_bad_input_is_422_and_free_of_charge(client):
    await add_user(U, balance=10000)
    for bad in ({"topic": "ab"}, {"topic": "Mavzu", "pages": 40}, {"topic": "Mavzu", "format": {"margin_left": 5}}):
        assert (await client.post("/api/paper", headers=h(), json=bad)).status_code == 422
    assert await billing.balance(U) == 10000


# ---------------------------------------------------------------- the profile photo (opened from the bottom keyboard)

async def test_profile_photo_comes_through_the_server_and_is_cached(client, tg, monkeypatch, tmp_path):
    from app.core import telegram
    from app.services import users
    monkeypatch.setattr(users, "AVATARS", tmp_path)
    photos = {"photos": [[{"file_id": "s", "width": 80}, {"file_id": "m", "width": 320}, {"file_id": "l", "width": 640}]]}

    async def call(method, **kw):
        tg.calls.append((method, kw.get("json") or {}))
        return {"ok": True, "result": photos if method == "getUserProfilePhotos" else {}}
    monkeypatch.setattr(telegram, "call", call)
    tg.files.update({"m": b"\xff\xd8JPEG-320"})
    await add_user(U)
    r = await client.get("/api/me/photo", headers={"X-App-Token": make_app_token(U)})
    assert r.status_code == 200 and r.content == b"\xff\xd8JPEG-320" and r.headers["content-type"] == "image/jpeg"
    assert (await client.get("/api/me/photo", headers=h())).content == b"\xff\xd8JPEG-320"
    assert [m for m, _ in tg.calls].count("getUserProfilePhotos") == 1  # the second time from disk
    assert (await client.get("/api/me/photo")).status_code == 401  # someone else's photo: no


async def test_no_photo_is_404_and_telegram_is_not_asked_again(client, tg, monkeypatch, tmp_path):
    from app.core import telegram
    from app.services import users
    monkeypatch.setattr(users, "AVATARS", tmp_path)
    asked = []

    async def call(method, **kw):
        asked.append(method)
        return {"ok": True, "result": {"photos": [], "total_count": 0}}
    monkeypatch.setattr(telegram, "call", call)
    await add_user(U)
    for _ in range(2):
        assert (await client.get("/api/me/photo", headers=h())).status_code == 404
    assert asked == ["getUserProfilePhotos"]

    async def down(method, **kw):
        raise ConnectionError("telegram down")
    monkeypatch.setattr(telegram, "call", down)
    (tmp_path / f"{U}.none").unlink()
    assert (await client.get("/api/me/photo", headers=h())).status_code == 404  # an error is a missing photo, not a 500


async def test_the_mini_app_sends_how_much_text(client, tg):
    await add_user(U, balance=10000)
    body = {"user_id": U, "template_id": 3, "slide_count": 8, "language": "uz", "topic": "Mavzu", "density": "detailed"}
    assert (await client.post("/api/generate", headers=h(), json=body)).status_code == 202
    assert (await db.pool().fetchval("SELECT payload FROM jobs"))["density"] == "detailed"
    assert (await client.post("/api/generate", headers=h(), json={**body, "density": "huge"})).status_code == 422


async def test_the_mini_app_passes_the_users_wishes(client, tg):
    await add_user(U, balance=10000)
    body = {"user_id": U, "template_id": 3, "slide_count": 8, "language": "uz", "topic": "Mavzu", "wishes": "Ko'proq statistika"}
    assert (await client.post("/api/generate", headers=h(), json=body)).status_code == 202
    assert (await db.pool().fetchval("SELECT payload FROM jobs"))["wishes"] == "Ko'proq statistika"
    assert (await client.post("/api/generate", headers=h(), json={**body, "wishes": "x" * 601})).status_code == 422


# ---------------------------------------------------------------- animated decks: admins only until opened, extra price

async def test_animated_decks_are_for_admins_until_opened_and_cost_extra(client, tg, monkeypatch):
    from app.core.config import settings
    from app.services import app_settings
    from app.services.ai.render import ANIMATED
    assert set(range(1, 201)) == ANIMATED  # every template has its animated copy
    await add_user(U, balance=20000)
    me = (await client.get("/api/me", headers=h())).json()["animation"]
    assert me["open"] is False and me["price"] == 3000 and 1 in me["templates"]
    body = {"user_id": U, "template_id": 3, "slide_count": 8, "language": "uz", "topic": "Mavzu", "animated": True}
    r = await client.post("/api/generate", headers=h(), json=body)
    assert r.status_code == 403 and r.json()["detail"] == "animSoon"  # "coming soon" for users
    assert await billing.balance(U) == 20000
    monkeypatch.setattr(settings, "admin_ids", {U})
    assert (await client.get("/api/me", headers=h())).json()["animation"]["open"] is True
    from app.services import animation
    monkeypatch.setattr(animation, "ANIMATED", frozenset({1}))  # a template without an animated copy
    r = await client.post("/api/generate", headers=h(), json=body)
    assert r.status_code == 422 and r.json()["detail"] == "animTemplate"
    monkeypatch.setattr(animation, "ANIMATED", ANIMATED)
    assert (await client.post("/api/generate", headers=h(), json=body)).status_code == 202
    assert await db.pool().fetchval("SELECT price FROM jobs") == 5000 + 3000 and await billing.balance(U) == 12000
    monkeypatch.setattr(settings, "admin_ids", set())
    await app_settings.set_many({"animation_public": True, "price_animation": 1000}, 1)
    assert (await client.post("/api/generate", headers=h(), json=body)).status_code == 202  # opened to everyone
    assert await db.pool().fetchval("SELECT price FROM jobs ORDER BY id DESC LIMIT 1") == 6000 and not await billing.reconcile()


async def _video_order(client, monkeypatch, tmp_path, make):
    """An animated deck with its video, ordered in the Mini App and run; `make` stands in for video.make."""
    from app.services import app_settings, video
    await app_settings.set_many({"animation_public": True, "price_animation": 3000, "price_video": 2000}, 1)
    await add_user(U, balance=20000)
    content = {"meta": {"topic": "Mavzu"}, "slides": [{"type": "cover", "title": "Mavzu"}, {"type": "closing", "title": "Rahmat"}]}

    async def fake_build(req, deck_id, user_id):
        d = tmp_path / "slideai-v"; d.mkdir(exist_ok=True)
        p = d / "deck.pptx"; p.write_bytes(b"pptx"); (d / "deck.pptx.timeline.json").write_text('{"slides": []}')
        return p, content
    monkeypatch.setattr(jobs, "build", fake_build)
    monkeypatch.setattr(video, "make", make)
    body = {"user_id": U, "template_id": 3, "slide_count": 8, "topic": "Mavzu", "animated": True, "video": True}
    assert (await client.post("/api/generate", headers=h(), json=body)).status_code == 202
    assert await db.pool().fetchval("SELECT price FROM jobs") == 5000 + 3000 + 2000 and await billing.balance(U) == 10000
    await jobs.run_pending()


async def test_a_video_needs_the_animation(client, tg):
    from app.services import app_settings
    await app_settings.set_many({"animation_public": True}, 1)
    await add_user(U, balance=20000)
    body = {"user_id": U, "template_id": 3, "slide_count": 8, "topic": "Mavzu", "video": True}
    r = await client.post("/api/generate", headers=h(), json=body)
    assert r.status_code == 422 and r.json()["detail"] == "videoNeedsAnim" and await billing.balance(U) == 20000
    me = (await client.get("/api/me", headers=h())).json()["animation"]
    assert me["video_price"] == 2000


async def test_an_animated_deck_with_its_video_sends_both(client, tg, monkeypatch, tmp_path):
    def make(deck):
        assert deck.with_name("deck.pptx.timeline.json").exists()  # the deck's copy came with its timeline
        out = deck.with_suffix(".mp4"); out.write_bytes(b"mp4"); return out
    await _video_order(client, monkeypatch, tmp_path, make)
    assert len(tg.sent("sendDocument")) == 1 and len(tg.sent("sendVideo")) == 1
    assert "video" in tg.sent("sendVideo")[0]["caption"].lower() and await billing.balance(U) == 10000
    assert await db.pool().fetchval("SELECT state FROM jobs") == "done"


async def test_a_failed_video_gives_back_its_price_only(client, tg, monkeypatch, tmp_path):
    def make(deck):
        raise RuntimeError("ffmpeg")
    await _video_order(client, monkeypatch, tmp_path, make)
    assert len(tg.sent("sendDocument")) == 1 and not tg.sent("sendVideo")      # the deck came; the video did not
    assert await billing.balance(U) == 12000 and "2\xa0000" in tg.texts()[-1]   # its 2 000 so'm back, once
    assert await db.pool().fetchval("SELECT state FROM jobs") == "done" and not await billing.reconcile()

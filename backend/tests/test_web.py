"""Website API (/api/web): sign-in with a code from the bot, then the same account as in the bot."""
import io
import re

import httpx
import pytest
from conftest import add_user
from PIL import Image

from app.api import main
from app.api.routes import web
from app.core import db
from app.services import billing, decks, jobs, web_auth

U = 701
SITE = {"Origin": "https://site.test"}


@pytest.fixture
async def client():
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=main.app), base_url="https://t", headers=SITE) as c:
        yield c


async def named(uid=U, username="vali", balance=0):
    await add_user(uid, balance=balance)
    await db.pool().execute("UPDATE users SET username = $2 WHERE id = $1", uid, username)


def sent_code(tg) -> str:
    return re.search(r"<code>(\d{6})</code>", tg.last()["text"]).group(1)


async def sign_in(client, tg, login="@Vali"):
    r = await client.post("/api/web/login", json={"login": login})
    assert r.status_code == 200, r.text
    r = await client.post("/api/web/verify", json={"login_id": r.json()["login_id"], "code": sent_code(tg)},
                          headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0) Chrome/130.0"})
    assert r.status_code == 200, r.text
    return r


def jpeg(size=(40, 30)) -> bytes:
    buf = io.BytesIO()
    Image.new("RGB", size, "red").save(buf, "JPEG")
    return buf.getvalue()


# ---------------------------------------------------------------- sign-in

async def test_code_goes_to_the_bot_chat_and_signs_in_with_a_cookie(client, tg):
    await named()
    r = await sign_in(client, tg)
    cookie = r.headers["set-cookie"]
    assert "__Host-sid=" in cookie and "HttpOnly" in cookie and "Secure" in cookie and "SameSite=strict" in cookie
    assert "Chrome · Windows" in tg.last()["text"]  # the "signed in" notice names the device
    me = (await client.get("/api/web/me")).json()
    assert me["user"]["id"] == U and me["user"]["username"] == "vali" and me["prices"]["generate"] == 5000
    # the code is stored as an HMAC, the token as a sha256: neither is in the database as it is
    assert not await db.pool().fetchval("SELECT count(*) FROM web_sessions WHERE token_hash = $1", client.cookies["__Host-sid"])


async def test_sign_in_by_telegram_id_and_link(client, tg):
    await named()
    assert (await client.post("/api/web/login", json={"login": str(U)})).status_code == 200
    await db.pool().execute("DELETE FROM web_actions")
    assert (await client.post("/api/web/login", json={"login": "https://t.me/VALI"})).status_code == 200


async def test_unknown_user_and_blocked_bot(client, tg):
    assert (await client.post("/api/web/login", json={"login": "@nobody"})).json()["detail"] == "notFound"
    await named()
    tg.fail["sendMessage"] = RuntimeError("Forbidden: bot was blocked by the user")
    r = await client.post("/api/web/login", json={"login": "vali"})
    assert r.status_code == 409 and r.json()["detail"] == "botBlocked"


async def test_one_code_a_minute_and_five_an_hour(client, tg):
    await named()
    assert (await client.post("/api/web/login", json={"login": "vali"})).status_code == 200
    r = await client.post("/api/web/login", json={"login": "vali"})
    assert r.status_code == 429 and r.json()["detail"] == "wait"
    await db.pool().execute("UPDATE web_actions SET created = now() - interval '2 minutes'")
    for _ in range(4):
        assert (await client.post("/api/web/login", json={"login": "vali"})).status_code == 200
        await db.pool().execute("UPDATE web_actions SET created = now() - interval '2 minutes'")
    assert (await client.post("/api/web/login", json={"login": "vali"})).json()["detail"] == "tooMany"


async def test_too_many_codes_from_one_address(client, tg, monkeypatch):
    monkeypatch.setattr(web_auth, "CODES_PER_HOUR_IP", 2)
    for i in range(2):
        await client.post("/api/web/login", json={"login": f"@nobody{i}"})
    assert (await client.post("/api/web/login", json={"login": "@nobody"})).json()["detail"] == "tooMany"


async def test_wrong_codes_kill_the_code(client, tg):
    await named()
    login_id = (await client.post("/api/web/login", json={"login": "vali"})).json()["login_id"]
    good = sent_code(tg)
    bad = "000000" if good != "000000" else "111111"
    for _ in range(web_auth.MAX_ATTEMPTS - 1):
        assert (await client.post("/api/web/verify", json={"login_id": login_id, "code": bad})).json()["detail"] == "badCode"
    assert (await client.post("/api/web/verify", json={"login_id": login_id, "code": bad})).json()["detail"] == "expired"
    r = await client.post("/api/web/verify", json={"login_id": login_id, "code": good})
    assert r.status_code == 410  # even the right code does not work any more


async def test_a_code_works_once_and_not_after_it_expires(client, tg):
    await named()
    login_id = (await client.post("/api/web/login", json={"login": "vali"})).json()["login_id"]
    code = sent_code(tg)
    await db.pool().execute("UPDATE web_logins SET expires = now() - interval '1 second'")
    assert (await client.post("/api/web/verify", json={"login_id": login_id, "code": code})).status_code == 410
    await db.pool().execute("UPDATE web_logins SET expires = now() + interval '1 minute'")
    assert (await client.post("/api/web/verify", json={"login_id": login_id, "code": code})).status_code == 200
    assert (await client.post("/api/web/verify", json={"login_id": login_id, "code": code})).status_code == 410


async def test_signed_out_and_expired_sessions_are_401(client, tg):
    assert (await client.get("/api/web/me")).status_code == 401
    await named()
    await sign_in(client, tg)
    await db.pool().execute("UPDATE web_sessions SET expires = now() - interval '1 second'")
    assert (await client.get("/api/web/me")).status_code == 401


async def test_logout_here_and_everywhere(client, tg):
    await named()
    await sign_in(client, tg)
    other = client.cookies["__Host-sid"]
    await db.pool().execute("UPDATE web_actions SET created = now() - interval '2 minutes'")
    await sign_in(client, tg)
    assert await db.pool().fetchval("SELECT count(*) FROM web_sessions") == 2
    await client.post("/api/web/logout", json={"everywhere": True})
    assert await db.pool().fetchval("SELECT count(*) FROM web_sessions") == 0
    assert await web_auth.session(other) is None


async def test_post_from_another_site_is_refused(client, tg):
    await named()
    r = await client.post("/api/web/login", json={"login": "vali"}, headers={"Origin": "https://evil.test"})
    assert r.status_code == 403
    assert (await client.get("/api/web/config", headers={"Origin": "https://evil.test"})).status_code == 200


# ---------------------------------------------------------------- presentations

async def test_generate_charges_the_bot_balance_and_queues(client, tg):
    await named(balance=7000)
    await sign_in(client, tg)
    body = {"template_id": 3, "slide_count": 8, "language": "uz", "topic": "Quyosh energiyasi"}
    r = await client.post("/api/web/generate", json=body)
    assert r.status_code == 202
    assert await billing.balance(U) == 2000
    job = await jobs.claim()
    assert job["user_id"] == U and job["payload"]["topic"] == "Quyosh energiyasi"
    listed = (await client.get("/api/web/jobs")).json()["jobs"]
    assert listed[0]["state"] == "running" and listed[0]["topic"] == "Quyosh energiyasi"
    r = await client.post("/api/web/generate", json=body)
    assert r.status_code == 402 and await billing.balance(U) == 2000


async def test_restyle_download_and_editor(client, tg, monkeypatch, tmp_path):
    await named(balance=10000)
    await sign_in(client, tg)
    content = {"meta": {"topic": "Tarix: qadimgi davr"}, "slides": [{"title": "A"}]}
    await decks.save(U, content, {"template_id": 2}, "123")
    await add_user(999)
    await decks.save(999, content, {"template_id": 2}, "456")  # someone else's
    assert (await client.post("/api/web/restyle", json={"deck_id": "123", "template_id": 2})).status_code == 422
    assert (await client.post("/api/web/restyle", json={"deck_id": "456", "template_id": 5})).status_code == 404
    assert (await client.post("/api/web/restyle", json={"deck_id": "123", "template_id": 5})).status_code == 202
    assert await billing.balance(U) == 8000

    def fake_render(content, template_id, out):
        out.write_bytes(b"PK-pptx"); return out
    monkeypatch.setattr(web, "render_sync", fake_render)
    r = await client.get("/api/web/decks/123/download")
    assert r.status_code == 200 and r.content == b"PK-pptx" and "Tarix" in r.headers["content-disposition"]
    assert (await client.get("/api/web/decks/456/download")).status_code == 404
    assert [d["id"] for d in (await client.get("/api/web/decks")).json()["decks"]] == ["123"]
    assert (await client.get("/api/web/editor")).json()["url"].startswith("/editor.html#t=701.")


async def test_history_lists_the_ledger(client, tg):
    await named(balance=15000)
    await sign_in(client, tg)
    items = (await client.get("/api/web/history")).json()["items"]
    assert items[0]["delta"] == 15000


# ---------------------------------------------------------------- top-up

async def test_card_top_up_receipt_goes_to_the_admins(client, tg, monkeypatch):
    await named()
    await sign_in(client, tg)
    assert (await client.post("/api/web/topup", json={"amount": 12345})).status_code == 422
    order = (await client.post("/api/web/topup", json={"amount": 15000})).json()
    assert order["code"].startswith("T-") and order["card"]["number"] == "8600 1234 1234 1234"
    assert (await client.post(f"/api/web/topup/{order['id']}/receipt", content=b"not an image")).status_code == 422

    real = tg.call
    async def call(method, **kw):
        if method == "sendPhoto" and "files" in kw:  # the upload: Telegram answers with the new file_id
            tg.calls.append((method, kw.get("data")))
            return {"ok": True, "result": {"photo": [{"file_id": "small"}, {"file_id": "big"}]}}
        return await real(method, **kw)
    monkeypatch.setattr(web.telegram, "call", call)  # the module every Bot API call goes through

    r = await client.post(f"/api/web/topup/{order['id']}/receipt", content=jpeg())
    assert r.status_code == 200 and r.json()["state"] == "review"
    row = await db.pool().fetchrow("SELECT state, screenshot FROM orders WHERE id = $1", order["id"])
    assert row["state"] == "review" and row["screenshot"] == "big"
    to_admin = [kw for m, kw in tg.calls if m == "sendPhoto" and kw.get("chat_id") == 1000]
    assert to_admin and to_admin[0]["photo"] == "big" and "card_ok" in str(to_admin[0]["reply_markup"])
    assert (await client.get("/api/web/topup")).json()["orders"][0]["state"] == "review"


async def test_receipt_for_someone_elses_order_is_404(client, tg):
    await named()
    await add_user(702)
    other = await db.pool().fetchval("INSERT INTO orders (user_id, amount, provider) VALUES (702, 15000, 'card') RETURNING id")
    await sign_in(client, tg)
    assert (await client.post(f"/api/web/topup/{other}/receipt", content=jpeg())).status_code == 404


# ---------------------------------------------------------------- images -> PDF

async def test_images_become_one_pdf(client, tg):
    await named()
    await sign_in(client, tg)
    files = [("files", ("a.jpg", jpeg(), "image/jpeg")), ("files", ("b.jpg", jpeg((30, 40)), "image/jpeg")),
             ("files", ("c.txt", b"hello", "text/plain"))]
    r = await client.post("/api/web/pdf", files=files, data={"name": "Mening/rasmlarim"})
    assert r.status_code == 200 and r.content.startswith(b"%PDF") and r.content.count(b"/Type /Page ") == 2
    assert r.headers["x-skipped"] == "1" and "Mening%20rasmlarim.pdf" in r.headers["content-disposition"]
    r = await client.post("/api/web/pdf", files=[("files", ("c.txt", b"hello", "text/plain"))])
    assert r.status_code == 422


async def test_pdf_daily_limit(client, tg, monkeypatch):
    await named()
    await sign_in(client, tg)
    monkeypatch.setattr(web, "PDFS_PER_DAY", 1)
    one = [("files", ("a.jpg", jpeg(), "image/jpeg"))]
    assert (await client.post("/api/web/pdf", files=one)).status_code == 200
    assert (await client.post("/api/web/pdf", files=one)).json()["detail"] == "pdfLimit"

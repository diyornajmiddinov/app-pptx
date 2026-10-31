"""Mandatory channel subscription: who is let in, what a non-member sees, the admin panel's checks."""
import httpx
import pytest
from conftest import ADMIN, add_user
from test_bot import U, msg, press

from app.api import main
from app.bot import handlers as bot
from app.core import alerts, telegram
from app.core.auth import make_admin_token
from app.services import app_settings, billing

CHANNEL = "@slidechi_news"


@pytest.fixture
def channel(tg, monkeypatch):
    """The channel is on; `members` decides getChatMember; every Telegram call is recorded in tg."""
    members, state = set(), {"broken": False, "asked": 0}

    async def call(method, **kw):
        body = kw.get("json") or kw.get("data") or {}
        tg.calls.append((method, body))
        if method == "getChatMember":
            state["asked"] += 1
            if state["broken"]:
                raise httpx.HTTPStatusError("400", request=httpx.Request("POST", "x"),
                                            response=httpx.Response(400, text="Bad Request: member list is inaccessible"))
            return {"ok": True, "result": {"status": "member" if body["user_id"] in members else "left"}}
        return {"ok": True, "result": {}}
    monkeypatch.setattr(telegram, "call", call)
    return members, state


async def on(channel_name=CHANNEL):
    await app_settings.set_many({"required_channel": channel_name, "required_channel_link": "https://t.me/slidechi_news"}, 1)


def join_prompt(tg) -> dict | None:
    for m, kw in reversed(tg.calls):
        if m == "sendMessage" and "sub_check" in str(kw.get("reply_markup")):
            return kw
    return None


async def test_a_new_user_is_asked_to_join_right_after_the_language(tg, channel):
    members, _ = channel
    await on()
    await bot.handle(msg("/start"))
    await bot.handle(press("lang:uz"))
    prompt = join_prompt(tg)
    assert prompt and "a'zo bo'ling" in prompt["text"]
    rows = prompt["reply_markup"]["inline_keyboard"]
    assert rows[0][0]["url"] == "https://t.me/slidechi_news" and rows[1][0]["callback_data"] == "sub_check"
    assert not any("keyboard" in (kw.get("reply_markup") or {}) for m, kw in tg.calls)  # no menu before joining

    tg.calls.clear()
    await bot.handle(press("sub_check"))  # pressed without joining
    assert tg.sent("answerCallbackQuery")[-1]["text"].startswith("Siz hali") and not tg.sent("sendMessage")
    members.add(U)
    await bot.handle(press("sub_check"))
    assert "keyboard" in tg.last()["reply_markup"]  # welcome with the menu


async def test_a_non_member_cannot_use_anything_until_joining(tg, channel):
    members, state = channel
    await add_user(U, balance=5000)
    await on()
    for text in ("/help", "/balance", "💰 Balans", "/referat", "salom"):
        tg.calls.clear()
        await bot.handle(msg(text))
        assert join_prompt(tg), text
    tg.calls.clear()
    await bot.handle(press("balance"))
    assert join_prompt(tg)
    members.add(U)
    tg.calls.clear()
    await bot.handle(msg("/help"))
    await bot.handle(msg("/balance"))
    assert not join_prompt(tg)
    asked = state["asked"]
    await bot.handle(msg("/help"))
    assert state["asked"] == asked + 1  # every request is checked with Telegram
    members.discard(U)  # left the channel: stopped at the very next message
    tg.calls.clear()
    await bot.handle(msg("/help"))
    assert join_prompt(tg)


async def test_a_new_user_writing_anything_first_picks_the_language_then_is_asked_in_it(tg, channel):
    await on()
    await bot.handle(msg("salom", uid=777))  # never pressed /start, no language yet
    assert tg.last()["reply_markup"]["inline_keyboard"][0][0]["callback_data"].startswith("lang:")
    assert not join_prompt(tg)
    await bot.handle(press("lang:ru", uid=777))
    prompt = join_prompt(tg)
    assert "подпишитесь" in prompt["text"] and prompt["reply_markup"]["inline_keyboard"][1][0]["text"] == "✅ Я подписался"


async def test_admins_and_a_broken_check_are_never_locked_out(tg, channel, caplog):
    _, state = channel
    await add_user(U)
    await on()
    await bot.handle(msg("/help", uid=ADMIN))
    assert not join_prompt(tg)
    state["broken"] = True  # the bot lost its admin rights in the channel
    await bot.handle(msg("/help"))
    assert not join_prompt(tg) and "bot admin emasmi" in caplog.text


async def test_without_a_channel_nothing_is_asked(tg, channel):
    _, state = channel
    await add_user(U)
    await bot.handle(msg("/help"))
    assert not join_prompt(tg) and state["asked"] == 0


async def test_the_mini_app_refuses_orders_of_non_members_without_charging(tg, channel):
    from test_api import U as MU
    from test_api import h
    members, _ = channel
    await add_user(MU, balance=10000)
    await on()
    body = {"user_id": MU, "template_id": 3, "slide_count": 8, "language": "uz", "topic": "Mavzu"}
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=main.app), base_url="http://t") as c:
        r = await c.post("/api/generate", headers=h(), json=body)
        assert r.status_code == 403 and r.json()["detail"] == "subscribe"
        assert await billing.balance(MU) == 10000 and join_prompt(tg)
        members.add(MU)
        assert (await c.post("/api/generate", headers=h(), json=body)).status_code == 202


async def test_the_admin_panel_checks_the_channel_before_saving(tg, monkeypatch):
    role = {"value": "member"}
    chats = {"@slidechi_news": {"id": -1001, "type": "channel", "title": "SlideAI", "username": "slidechi_news"},
             "-1002": {"id": -1002, "type": "channel", "title": "Yopiq"}}

    async def call(method, **kw):
        body = kw.get("json") or {}
        if method == "getChat":
            if str(body["chat_id"]) not in chats:
                raise httpx.HTTPStatusError("400", request=httpx.Request("POST", "x"), response=httpx.Response(400, json={"description": "chat not found"}))
            return {"ok": True, "result": chats[str(body["chat_id"])]}
        if method == "getMe":
            return {"ok": True, "result": {"id": 42}}
        if method == "getChatMember":
            return {"ok": True, "result": {"status": role["value"]}}
        return {"ok": True, "result": {}}
    monkeypatch.setattr(telegram, "call", call)
    monkeypatch.setattr(alerts, "channel_id", lambda: "-1003")
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=main.app), base_url="http://t",
                                 headers={"X-Admin-Token": make_admin_token(ADMIN)}) as admin:
        put = lambda **b: admin.put("/api/admin/subscription", json=b)
        assert (await put(channel="https://t.me/nope")).status_code == 422  # no such channel
        r = await put(channel="t.me/slidechi_news")
        assert r.status_code == 422 and "administrator" in r.json()["detail"]
        role["value"] = "administrator"
        r = await put(channel="https://t.me/slidechi_news")
        assert r.json()["required_channel"] == "@slidechi_news" and r.json()["required_channel_link"] == "https://t.me/slidechi_news"
        assert (await put(channel="-1002")).status_code == 422  # private: needs its invite link
        assert (await put(channel="-1002", link="https://t.me/+abc")).json()["required_channel"] == "-1002"
        assert (await put(channel="-1003")).status_code == 422  # the log channel
        assert (await put(channel="")).json()["required_channel"] == ""
    assert (await app_settings.get())["required_channel"] == ""


async def test_a_public_channel_never_becomes_the_log_channel(tg, monkeypatch, tmp_path):
    monkeypatch.setattr(alerts, "CHANNEL_FILE", tmp_path / "log_channel")
    monkeypatch.setattr(alerts, "DATA", tmp_path)
    monkeypatch.delenv("LOG_CHANNEL_ID", raising=False)
    joined = lambda chat: {"update_id": 1, "my_chat_member": {"chat": chat, "from": {"id": ADMIN},
                                                              "new_chat_member": {"status": "administrator"}}}
    await bot.handle(joined({"id": -1001, "type": "channel", "username": "slidechi_news"}))
    assert not (tmp_path / "log_channel").exists()
    await bot.handle(joined({"id": -1009, "type": "channel", "title": "log"}))
    assert (tmp_path / "log_channel").read_text().strip() == "-1009"

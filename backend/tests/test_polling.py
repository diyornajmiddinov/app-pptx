"""Long polling helpers: what an update was (for error reports), and fixing menu buttons after the address changed."""
import pytest
from conftest import add_user

from app.bot import polling
from app.core import alerts


def test_what_names_the_update():
    assert polling.what({"update_id": 1, "callback_query": {"data": "topup:15000", "from": {"id": 5}}}) == "tugma «topup:15000» · foydalanuvchi 5"
    assert polling.what({"update_id": 1, "message": {"text": "/start", "from": {"id": 5}}}) == "xabar «/start» · foydalanuvchi 5"
    assert "rasm" in polling.what({"update_id": 1, "message": {"photo": [{}], "from": {"id": 5}}})
    assert polling.what({"update_id": 1, "my_chat_member": {}}) == "my_chat_member"


async def test_menu_buttons_follow_a_new_address(tg, tmp_path, monkeypatch):
    monkeypatch.setattr(alerts, "DATA", tmp_path)
    await add_user(1, lang="ru")
    await add_user(2, lang=None)
    (tmp_path / "last_webapp_url").write_text("https://old.example")
    await polling.refresh_menu_buttons()
    buttons = {kw["chat_id"]: kw["menu_button"]["web_app"]["url"] for kw in tg.sent("setChatMenuButton")}
    assert buttons == {1: "https://app.test?lang=ru", 2: "https://app.test?lang=uz"}
    tg.calls.clear()
    await polling.refresh_menu_buttons()  # same address: nothing to do
    assert not tg.sent("setChatMenuButton")


async def test_one_failing_update_does_not_stop_the_bot(monkeypatch, caplog):
    async def boom(u):
        raise KeyError("x")
    monkeypatch.setattr(polling.bot, "handle", boom)
    await polling.handle({"update_id": 7, "message": {"text": "hi", "from": {"id": 3}}})
    assert "Bot xabarni qayta ishlay olmadi" in caplog.text


# ---------------------------------------------------------------- webhook mode (app.bot.webhook)

async def test_webhook_check_reports_each_error_once(tg, monkeypatch, caplog):
    from app.bot import webhook
    monkeypatch.setattr(webhook.settings, "public_url", "https://slidechi.test")
    monkeypatch.setattr(webhook.settings, "webhook_secret", "s")
    info = {"url": "https://slidechi.test/telegram/webhook", "last_error_date": 100, "last_error_message": "Connection refused",
            "pending_update_count": 0}

    async def call(method, **kw):
        tg.calls.append((method, kw.get("json") or {}))
        return {"ok": True, "result": info if method == "getWebhookInfo" else True}
    monkeypatch.setattr(webhook.telegram, "call", call)
    assert await webhook.check(0) == 100 and "Connection refused" in caplog.text
    caplog.clear()
    assert await webhook.check(100) == 100 and not caplog.text  # same error: not again
    info["url"] = ""  # polling removed it
    await webhook.check(100)
    assert tg.sent("setWebhook")[0]["url"] == "https://slidechi.test/telegram/webhook"  # put back


async def test_webhook_refuses_to_start_without_a_secret(monkeypatch):
    from app.bot import webhook
    monkeypatch.setattr(webhook.settings, "public_url", "https://slidechi.test")
    monkeypatch.setattr(webhook.settings, "webhook_secret", "")
    with pytest.raises(SystemExit):
        await webhook.install()

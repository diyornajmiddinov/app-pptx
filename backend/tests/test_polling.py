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


async def test_every_user_gets_the_command_list_as_the_menu_once(tg, tmp_path, monkeypatch):
    monkeypatch.setattr(alerts, "DATA", tmp_path)
    await add_user(1, lang="ru")
    await add_user(2, lang=None)
    await polling.refresh_menu_buttons()
    sent = tg.sent("setChatMenuButton")
    assert all(kw["menu_button"] == {"type": "commands"} for kw in sent)
    assert sorted(kw.get("chat_id", 0) for kw in sent) == [0, 1, 2]  # the default (no chat_id) and each user's own
    tg.calls.clear()
    await polling.refresh_menu_buttons()  # done once
    assert not tg.sent("setChatMenuButton")


async def test_the_command_list_has_the_three_makers(tg):
    await polling.set_commands()
    uz = tg.sent("setMyCommands")[0]["commands"]
    assert [c["command"] for c in uz][:4] == ["start", "taqdimot", "referat", "mustaqil"]
    assert {c["command"]: c["description"] for c in uz}["referat"] == "Referat yozish"


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


async def test_backend_sets_the_bot_up_and_survives_telegram_errors(tg, monkeypatch, caplog, tmp_path):
    import asyncio

    from app.bot import webhook
    monkeypatch.setattr(alerts, "DATA", tmp_path)
    monkeypatch.setattr(webhook.settings, "public_url", "https://slidechi.test")
    monkeypatch.setattr(webhook.settings, "webhook_secret", "")
    assert not webhook.enabled()  # no secret: the backend leaves the bot alone
    monkeypatch.setattr(webhook.settings, "webhook_secret", "s")
    assert webhook.enabled()
    tasks = [asyncio.create_task(webhook.serve()) for _ in range(3)]  # three API processes
    await asyncio.sleep(0.1)
    assert len(tg.sent("setWebhook")) == 1 and tg.sent("setWebhook")[0]["secret_token"] == "s"  # only one looks after the bot
    assert tg.sent("setMyCommands") and not any(t.done() for t in tasks)  # keeps watching
    for t in tasks:
        t.cancel()
    await asyncio.gather(*tasks, return_exceptions=True)

    async def down(method, **kw):
        raise ConnectionError("telegram down")
    monkeypatch.setattr(webhook.telegram, "call", down)
    task = asyncio.create_task(webhook.serve())
    await asyncio.sleep(0.1)
    assert not task.done() and "webhook'ini o'rnatib bo'lmadi" in caplog.text  # logged; the API keeps running
    task.cancel()
    await asyncio.gather(task, return_exceptions=True)


async def test_telegram_calls_wait_on_429_and_retry_unsent_requests(monkeypatch):
    import httpx

    from app.core import telegram
    seen, waits = [], []
    answers = [httpx.Response(429, json={"ok": False, "parameters": {"retry_after": 2}}), httpx.ConnectError("down"),
               httpx.Response(200, json={"ok": True, "result": 1})]

    class Client:
        async def post(self, url, **kw):
            seen.append(kw["files"]["document"][1].read() if "files" in kw else url)
            a = answers.pop(0)
            if isinstance(a, Exception):
                raise a
            return a.__class__(a.status_code, content=a.content, request=httpx.Request("POST", url))

    async def sleep(s):
        waits.append(s)
    from conftest import REAL_CALL
    monkeypatch.setattr(telegram, "call", REAL_CALL)
    monkeypatch.setattr(telegram, "_client", Client())
    monkeypatch.setattr(telegram.asyncio, "sleep", sleep)
    import io
    assert (await telegram.call("sendDocument", files={"document": ("a.pdf", io.BytesIO(b"PDF"))}))["result"] == 1
    assert seen == [b"PDF"] * 3 and waits == [2.0, 2]  # the file is sent whole every time; waited as Telegram asked
    answers[:] = [httpx.Response(400, json={"ok": False})]
    with pytest.raises(httpx.HTTPStatusError):
        await telegram.call("sendMessage", json={})  # other errors: not retried
    monkeypatch.setattr(telegram, "_client", None)

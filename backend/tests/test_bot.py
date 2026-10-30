"""Bot conversations, end to end through bot.handle() with a fake Telegram."""
import io

from conftest import ADMIN, add_user
from PIL import Image

from app.bot import handlers as bot
from app.core import alerts, db
from app.services import billing
from app.services import images_pdf as pdfs

U = 501


def msg(text="", uid=U, mid=1, **extra):
    return {"update_id": mid, "message": {"message_id": mid, "chat": {"id": uid, "type": "private"},
                                          "from": {"id": uid, "first_name": "Ali", "language_code": "uz"}, "text": text, **extra}}


def press(data, uid=U):
    return {"update_id": 9, "callback_query": {"id": "q", "data": data, "from": {"id": uid, "first_name": "Ali"},
                                               "message": {"message_id": 5, "chat": {"id": uid}, "caption": "c"}}}


def jpeg(color="red"):
    b = io.BytesIO(); Image.new("RGB", (600, 800), color).save(b, "JPEG"); return b.getvalue()


async def test_first_start_asks_language_then_welcome_with_menu(tg):
    await bot.handle(msg("/start"))
    assert "inline_keyboard" in tg.last()["reply_markup"]  # language buttons
    await bot.handle(press("lang:ru"))
    welcome = tg.last()
    rows = welcome["reply_markup"]["keyboard"]
    assert rows[0][0]["web_app"]["url"].startswith("https://app.test?lang=ru&t=")  # the app opens from the menu itself
    assert db.pool() and (await db.pool().fetchval("SELECT lang FROM users WHERE id = $1", U)) == "ru"
    assert not tg.sent("setChatMenuButton")  # the button by the input field stays the command list


async def test_users_are_recorded(tg):
    await bot.handle(msg("/help"))
    row = await db.pool().fetchrow("SELECT first_name, language_code FROM users WHERE id = $1", U)
    assert row["first_name"] == "Ali" and row["language_code"] == "uz"


async def test_card_topup_screenshot_admin_approval(tg):
    await add_user(U)
    await add_user(ADMIN)
    await bot.handle(press("topup:15000"))
    assert "T-000001" in tg.last()["text"]
    await bot.handle(msg("", photo=[{"file_id": "shot"}], caption=""))
    assert any(kw.get("chat_id") == ADMIN for kw in tg.sent("sendPhoto"))
    await bot.handle(press("card_ok:1", uid=ADMIN))
    assert await billing.balance(U) == 15000
    await bot.handle(press("card_ok:1", uid=ADMIN))  # a second press does nothing
    assert await billing.balance(U) == 15000


async def test_only_admins_can_add_balance_or_open_the_panel(tg):
    await add_user(U)
    await bot.handle(msg(f"/addbalance {U} 5000"))
    await bot.handle(msg("/admin"))
    assert await billing.balance(U) == 0 and not any("admin.html" in str(kw) for kw in tg.sent())
    await bot.handle(msg(f"/addbalance {U} 5000", uid=ADMIN))
    assert await billing.balance(U) == 5000
    await bot.handle(msg("/admin", uid=ADMIN))
    assert "admin.html#t=" in tg.last()["reply_markup"]["inline_keyboard"][0][0]["url"]


async def test_images_to_pdf_with_a_name(tg):
    await add_user(U)
    tg.files.update({"a": jpeg("red"), "b": jpeg("blue"), "c": b"not an image"})
    await bot.handle(msg("🖼 Rasmdan PDF"))
    for i, f in enumerate(["a", "b"], 2):
        await bot.handle(msg("", mid=i, photo=[{"file_id": f}]))
    await bot.handle(msg("", mid=4, document={"file_id": "c", "mime_type": "image/jpeg", "file_name": "c.jpg"}))
    await bot.handle(msg("✅ PDF yaratish", mid=5))
    assert await pdfs.stage(U) == "name"
    await bot.handle(msg("...", mid=6))  # not a name
    assert await pdfs.stage(U) == "name"
    await bot.handle(msg("Kurs ishi: chizmalar", mid=7))
    doc = tg.sent("sendDocument")[-1]
    assert "<b>«Kurs ishi chizmalar»</b> tayyor: 2 sahifa" in doc["caption"] and doc["parse_mode"] == "HTML"
    assert await pdfs.stage(U) is None
    assert any("1 ta faylni" in t for t in tg.texts())  # the non-image was reported


async def test_an_album_gets_one_answer_even_across_processes(tg):
    import asyncio
    await add_user(U)
    await bot.handle(msg("🖼 Rasmdan PDF"))
    tg.calls.clear()
    # the photos of one album arrive together (with several API processes, to different ones): one "received: 3"
    await asyncio.gather(*(bot.handle(msg("", mid=i, photo=[{"file_id": f"p{i}"}])) for i in range(2, 5)))
    answers = [t for t in tg.texts() if "3" in t]
    assert len(tg.texts()) == 1 and answers, tg.texts()
    await bot.handle(msg("", mid=5, photo=[{"file_id": "p5"}]))
    assert len(tg.texts()) == 2  # a later photo answers again
    await asyncio.gather(bot.handle(msg("", mid=6, photo=[{"file_id": "p6"}])), bot.handle(msg("✅ PDF yaratish", mid=7)))
    assert len(tg.texts()) == 3  # only the question for the file name: the photo still waiting stays silent


async def test_card_choice_closes_an_open_pdf_draft(tg):
    await add_user(U)
    await bot.handle(msg("/pdf"))
    await bot.handle(press("topup:15000"))
    assert await pdfs.stage(U) is None  # the payment screenshot must not land in the PDF


async def test_admin_adds_bot_to_a_channel(tg, tmp_path, monkeypatch):
    monkeypatch.setattr(alerts, "CHANNEL_FILE", tmp_path / "log_channel")
    monkeypatch.setattr(alerts, "DATA", tmp_path)
    upd = {"update_id": 1, "my_chat_member": {"chat": {"id": -100123, "type": "channel"}, "from": {"id": 42},
                                              "new_chat_member": {"status": "administrator"}}}
    await bot.handle(upd)
    assert alerts.channel_id() is None  # not an admin
    upd["my_chat_member"]["from"]["id"] = ADMIN
    await bot.handle(upd)
    assert alerts.channel_id() == "-100123"


async def test_the_menu_has_referat_and_mustaqil_ish_buttons(tg):
    from app.bot.keyboards import main_keyboard
    rows = main_keyboard("uz", U)["keyboard"]
    papers = rows[1]
    assert [b["text"] for b in papers] == ["📝 Referat", "📘 Mustaqil ish"]
    assert "mode=paper&type=referat" in papers[0]["web_app"]["url"] and "&t=" in papers[0]["web_app"]["url"]
    assert "type=mustaqil" in papers[1]["web_app"]["url"]
    await add_user(U)
    await bot.handle(msg("📘 Mustaqil ish"))  # an old keyboard sends the text: the form comes as an inline button
    url = tg.last()["reply_markup"]["inline_keyboard"][0][0]["web_app"]["url"]
    assert "mode=paper&type=mustaqil" in url


async def test_menu_commands_open_the_forms(tg):
    await add_user(U)
    for command, part in (("/taqdimot", "lang=uz"), ("/referat", "type=referat"), ("/mustaqil", "type=mustaqil")):
        await bot.handle(msg(command))
        assert part in tg.last()["reply_markup"]["inline_keyboard"][0][0]["web_app"]["url"]

"""How the bot's messages look: Telegram HTML, escaped values, coloured buttons, Telegram's animated (custom) emoji."""
import re
from html.parser import HTMLParser

import httpx
from conftest import ADMIN, add_user
from test_bot import U, msg

from app.bot import handlers as bot
from app.bot.keyboards import main_keyboard, pdf_keyboard
from app.core import telegram
from app.services import app_settings
from app.texts import T, t

ALLOWED = {"b", "i", "u", "s", "code", "pre", "a", "blockquote", "tg-emoji"}  # what Telegram's HTML mode accepts


class _Check(HTMLParser):
    def __init__(self):
        super().__init__()
        self.open, self.bad = [], []

    def handle_starttag(self, tag, attrs):
        if tag not in ALLOWED:
            self.bad.append(tag)
        self.open.append(tag)

    def handle_endtag(self, tag):
        if not self.open or self.open.pop() != tag:
            self.bad.append(f"/{tag}")


def test_every_message_is_valid_telegram_html():
    for lang, texts in T.items():
        for key, value in texts.items():
            if callable(value):
                continue
            filled = re.sub(r"\{(\w+)\}", "X", value)
            c = _Check()
            c.feed(filled)
            assert not c.bad and not c.open, f"{lang}.{key}: {c.bad or c.open}"
            assert not re.search(r"&(?![a-z]+;|#\d+;)", filled), f"{lang}.{key}: a bare & breaks HTML mode"


def test_values_are_escaped_but_markup_stays():
    out = t("uz", "queued", topic="A<B & C")
    assert "<b>«A&lt;B &amp; C»</b>" in out and out.startswith("⏳")
    assert t("uz", "card_details", code="X", amount="1", card="2", holder=t("uz", "card_holder", name="Ali")).count("<b>Ali</b>") == 1


def test_buttons_have_colours():
    rows = main_keyboard("uz", U)["keyboard"]
    assert rows[0][0]["style"] == "primary" and {b["style"] for b in rows[1]} == {"success"}
    pdf = pdf_keyboard("uz")["keyboard"]
    assert pdf[0][0]["style"] == "success" and pdf[1][0]["style"] == "danger"


async def test_admin_sets_animated_emoji_and_the_bot_uses_them(tg):
    await add_user(U)
    text = "/emoji 📊✏️"
    ents = [{"type": "custom_emoji", "offset": 7, "length": 2, "custom_emoji_id": "111"},
            {"type": "custom_emoji", "offset": 9, "length": 2, "custom_emoji_id": "222"}]
    await bot.handle(msg(text, uid=U, entities=ents))  # not an admin: nothing saved
    assert not (await app_settings.get())["custom_emoji"]
    await bot.handle(msg(text, uid=ADMIN, entities=ents))
    assert (await app_settings.get())["custom_emoji"] == {"📊": "111", "✏️": "222"}

    await bot.handle(msg("/start"))
    await bot.handle(msg("/help"))
    sent = tg.last()
    assert sent["parse_mode"] == "HTML"
    await bot.handle(msg("/language"))
    tg.calls.clear()
    await bot.welcome(U, "uz")
    w = tg.last()
    assert '<tg-emoji emoji-id="111">📊</tg-emoji>' in w["text"]
    create = w["reply_markup"]["keyboard"][0][0]
    assert create["icon_custom_emoji_id"] == "111" and create["text"] == "Taqdimot yaratish"
    tg.calls.clear()
    await bot.handle(msg("Muharrir"))  # the editor button pressed: its text comes without the emoji now
    assert "editor.html" in str(tg.last()["reply_markup"])
    await bot.handle(msg("/emoji off", uid=ADMIN))
    assert (await app_settings.get())["custom_emoji"] == {}


async def test_a_message_telegram_refuses_for_custom_emoji_goes_plain(monkeypatch):
    await app_settings.set_many({"custom_emoji": {"✅": "333"}}, 1)
    sent = []

    async def call(method, **kw):
        sent.append(kw["json"])
        if "tg-emoji" in kw["json"]["text"]:
            raise httpx.HTTPStatusError("400", request=httpx.Request("POST", "x"),
                                        response=httpx.Response(400, text="Bad Request: custom emoji not allowed"))
        return {"ok": True}
    monkeypatch.setattr(telegram, "call", call)
    await telegram.send_message(5, "✅ <b>Tayyor</b>")
    assert len(sent) == 2 and sent[-1]["text"] == "✅ <b>Tayyor</b>"
    sent.clear()
    await telegram.send_message(5, "✅ admin <yozgan> matn", parse_mode=None)  # typed by an admin: sent as it is
    assert sent == [{"chat_id": 5, "text": "✅ admin <yozgan> matn"}]

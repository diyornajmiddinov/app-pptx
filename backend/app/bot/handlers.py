"""
Telegram bot: one entry point, handle(update), used by both the webhook (/telegram/webhook) and app.bot.polling.

/start     first time: choose a language; later: welcome with the bottom menu
/language  choose the language again          /help     short help
/balance   balance, prices, top-up (money.py) /pdf      images -> PDF (pdf.py)
/editor    link to the desktop editor          /admin, /addbalance   admins only
The bottom menu repeats these: 📊 Taqdimot yaratish (opens the Mini App), 🖼 Rasmdan PDF, 💰 Balans, ✏️ Muharrir, 🌐 Til, ❓ Yordam.
A .pptx / .ppt / .odp sent to the bot goes to the editor; a photo is a card-payment screenshot (or a PDF page while
the PDF section is open). The chosen language is used everywhere: messages, the Mini App (?lang=), file captions.
"""
import asyncio
import logging
from collections.abc import Awaitable, Callable
from dataclasses import dataclass

from app.bot import money, pdf
from app.bot.keyboards import BUTTONS, app_url, editor_keyboard, has_webapp, lang_keyboard, main_keyboard, open_keyboard, paper_url
from app.core import alerts, telegram
from app.core.auth import make_admin_token
from app.core.config import settings
from app.core.telegram import answer_callback, send_message
from app.services import billing, editor
from app.services import images_pdf as pdfs
from app.services.users import has_choice, lang_of, set_lang, touch
from app.texts import CHOOSE, LANGS, som, t

log = logging.getLogger("bot")
notify_paid = money.notify_paid          # used by the API after Payme / Click / admin-panel payments
send_low_balance = money.send_low_balance


@dataclass
class Msg:
    """One private message, with what the handlers keep asking about it."""
    raw: dict
    chat_id: int
    uid: int
    user: dict
    lang: str
    text: str
    key: str | None                       # which bottom-menu button, if the text is one (any language)
    doc: dict
    image_id: str | None                  # a photo, or an image sent as a file
    image_kind: str

    @property
    def message_id(self) -> int:
        return self.raw["message_id"]


async def welcome(chat_id: int, lang: str):
    await send_message(chat_id, t(lang, "welcome"), main_keyboard(lang, chat_id))


async def receive_presentation(m: Msg):
    """A .pptx / .ppt / .odp sent to the bot goes into the user's editor documents."""
    if (m.doc.get("file_size") or 0) > 20 * 1024 * 1024:
        await send_message(m.chat_id, t(m.lang, "editor_too_big")); return
    await send_message(m.chat_id, t(m.lang, "editor_wait"))
    try:
        data = await telegram.download_file(m.doc["file_id"])
        doc_id = await asyncio.to_thread(editor.import_file, m.uid, data, m.doc.get("file_name") or "taqdimot.pptx", source="bot")
    except (editor.EditorError, ValueError):
        await send_message(m.chat_id, t(m.lang, "editor_bad")); return
    await send_message(m.chat_id, t(m.lang, "editor_added", name=editor.clean_name(m.doc.get("file_name") or "")),
                       editor_keyboard(m.uid, m.lang, doc_id))


async def channel_joined(cm: dict):
    """The bot was made an administrator of a channel / group by an admin: that chat becomes the log channel."""
    chat, status = cm["chat"], cm["new_chat_member"]["status"]
    if chat["type"] not in ("channel", "supergroup", "group") or cm["from"]["id"] not in settings.admin_ids:
        return
    if status == "administrator":
        alerts.set_channel(chat["id"])
        await send_message(chat["id"], "✅ SlideAI log kanali ulandi.\n\nBu yerga keladi:\n• har kuni bazaning zaxira nusxasi\n"
                                       "• bot va backend xatolari\n• xizmatlar qayta ishga tushgani")
        log.info("log channel set: %s", chat["id"])
    elif status in ("left", "kicked") and alerts.channel_id() == str(chat["id"]):
        alerts.CHANNEL_FILE.unlink(missing_ok=True)


# ---------------------------------------------------------------- commands and menu buttons

async def cmd_start(m: Msg):
    if await has_choice(m.uid):
        await welcome(m.chat_id, m.lang)
    else:
        await send_message(m.chat_id, CHOOSE, lang_keyboard())


async def cmd_create(m: Msg):
    # an old keyboard (plain text button) or no HTTPS address yet: answer with the inline button
    if has_webapp():
        await send_message(m.chat_id, t(m.lang, "create_open"), {"inline_keyboard": [[{"text": t(m.lang, "open"), "web_app": {"url": app_url(m.lang)}}]]})
    else:
        await send_message(m.chat_id, t(m.lang, "hint"))


async def cmd_paper(m: Msg):
    """/referat, /mustaqil (the Menu), or an old keyboard without the buttons' web_app: the form as an inline button."""
    doc_type = "mustaqil" if m.key == "kb_mustaqil" or m.text.lower().startswith("/mustaqil") else "referat"
    if has_webapp():
        await send_message(m.chat_id, t(m.lang, "create_open"),
                           {"inline_keyboard": [[{"text": t(m.lang, f"kb_{doc_type}"), "web_app": {"url": paper_url(m.lang, doc_type)}}]]})
    else:
        await send_message(m.chat_id, t(m.lang, "hint"))


async def cmd_pdf(m: Msg):
    await pdf.start(m.chat_id, m.uid, m.lang)


async def cmd_old_pdf_button(m: Msg):  # the PDF keyboard was still shown after the section closed
    await send_message(m.chat_id, t(m.lang, "menu"), main_keyboard(m.lang, m.chat_id))


async def cmd_language(m: Msg):
    await send_message(m.chat_id, CHOOSE, lang_keyboard())


async def cmd_balance(m: Msg):
    await money.show_balance(m.chat_id, m.uid, m.lang)


async def cmd_editor(m: Msg):
    await send_message(m.chat_id, t(m.lang, "editor_link"), editor_keyboard(m.uid, m.lang))


async def cmd_help(m: Msg):
    await send_message(m.chat_id, t(m.lang, "help"), open_keyboard(m.lang))


async def cmd_admin(m: Msg):
    url = f"{settings.webapp_url.rstrip('/')}/admin.html#t={make_admin_token(m.uid)}"
    await send_message(m.chat_id, t(m.lang, "admin_link"),
                       {"inline_keyboard": [[{"text": t(m.lang, "admin_btn"), "url": url}]]} if has_webapp() else None)


async def cmd_addbalance(m: Msg):
    """/addbalance <user_id> <amount>: manual top-up (cash, tests)."""
    parts = m.text.split()
    if len(parts) == 3 and parts[1].isdigit() and parts[2].lstrip("-").isdigit():
        target, amount = int(parts[1]), int(parts[2])
        new = await billing.top_up(target, amount, ref=f"admin:{m.chat_id}:{m.message_id}", kind="admin")
        if new is None:  # more taken than there is (or Telegram delivered this message twice)
            await send_message(m.chat_id, t(m.lang, "admin_refused"))
            return
        await send_message(m.chat_id, t(m.lang, "admin_added", user=target, amount=som(amount, m.lang), balance=som(new, m.lang)))
    else:
        await send_message(m.chat_id, "/addbalance <user_id> <amount>")


Handler = Callable[[Msg], Awaitable[None]]
# (commands, bottom-menu button keys, admins only, handler) — the first match wins
ROUTES: list[tuple[tuple[str, ...], tuple[str, ...], bool, Handler]] = [
    (("/start",), (), False, cmd_start),
    (("/taqdimot",), ("kb_create",), False, cmd_create),
    (("/referat", "/mustaqil"), ("kb_referat", "kb_mustaqil"), False, cmd_paper),
    (("/pdf",), ("kb_pdf",), False, cmd_pdf),
    ((), ("kb_pdf_make", "kb_pdf_cancel"), False, cmd_old_pdf_button),
    (("/language", "/til"), ("kb_lang",), False, cmd_language),
    (("/balance", "/balans"), ("kb_balance",), False, cmd_balance),
    (("/addbalance",), (), True, cmd_addbalance),
    (("/admin",), (), True, cmd_admin),
    (("/editor", "/muharrir"), ("kb_editor",), False, cmd_editor),
    (("/help",), ("kb_help",), False, cmd_help),
]


def route(m: Msg) -> Handler | None:
    command = m.text.split()[0].split("@")[0].lower() if m.text.startswith("/") else ""
    for commands, keys, admin_only, handler in ROUTES:
        if (command in commands or (m.key and m.key in keys)) and (not admin_only or m.uid in settings.admin_ids):
            return handler
    return None


# ---------------------------------------------------------------- entry point

async def on_callback(q: dict):
    data, uid, chat_id = q.get("data", ""), q["from"]["id"], q["message"]["chat"]["id"]
    await touch(q["from"])
    lang = await lang_of(uid, q["from"].get("language_code"))
    if data.startswith("lang:") and data[5:] in LANGS:
        lang = data[5:]
        await set_lang(uid, lang)
        await answer_callback(q["id"], t(lang, "saved"))
        await welcome(chat_id, lang)
    elif not await money.on_callback(q, data, chat_id, uid, lang):
        await answer_callback(q["id"])


async def on_message(raw: dict):
    user = raw.get("from", {})
    await touch(user)
    doc, text = raw.get("document") or {}, (raw.get("text") or "").strip()
    image_id, kind = (raw["photo"][-1]["file_id"], "photo") if raw.get("photo") else \
        (doc["file_id"], "document") if str(doc.get("mime_type", "")).startswith("image/") else (None, "")
    uid = user.get("id", raw["chat"]["id"])
    m = Msg(raw, raw["chat"]["id"], uid, user, await lang_of(uid, user.get("language_code")), text, BUTTONS.get(text), doc, image_id, kind)

    if (stage := await pdfs.stage(m.uid)) and await pdf.on_message(m, stage):
        return
    if str(doc.get("file_name", "")).lower().endswith(editor.IMPORTABLE):
        await receive_presentation(m)
    elif m.image_id:
        await money.receive_screenshot(m.chat_id, user, m.image_id, m.image_kind, raw.get("caption", ""), m.lang)
    elif handler := route(m):
        await handler(m)
    else:
        await send_message(m.chat_id, t(m.lang, "hint"), open_keyboard(m.lang))


async def handle(update: dict):
    if "my_chat_member" in update:
        await channel_joined(update["my_chat_member"])
    elif "callback_query" in update:
        await on_callback(update["callback_query"])
    elif (msg := update.get("message")) and msg.get("chat", {}).get("type") == "private":
        await on_message(msg)

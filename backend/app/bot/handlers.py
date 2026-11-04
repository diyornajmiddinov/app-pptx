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
from urllib.parse import quote

from app.bot import money, pdf
from app.bot.keyboards import (
    BUTTONS,
    PRIMARY,
    anim_url,
    app_url,
    editor_keyboard,
    has_webapp,
    lang_keyboard,
    main_keyboard,
    open_keyboard,
    paper_url,
)
from app.core import alerts, db, telegram
from app.core.auth import make_admin_token
from app.core.config import settings
from app.core.telegram import answer_callback, send_message
from app.services import animation, app_settings, billing, editor, growth, subscription
from app.services import images_pdf as pdfs
from app.services.users import has_choice, lang_of, set_lang, touch
from app.texts import CHOOSE, LANGS, esc, som, t

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
    """The bot was made an administrator of a channel / group by an admin. It becomes the log channel (database backups,
    errors) only when there is none yet, and never when it is public, the subscription or the archive channel; otherwise
    the admin is told it was not taken, so an archive / subscription channel cannot quietly receive the backups."""
    chat, status = cm["chat"], cm["new_chat_member"]["status"]
    admin = cm["from"]["id"]
    if chat["type"] not in ("channel", "supergroup", "group") or admin not in settings.admin_ids:
        return
    if status in ("left", "kicked"):
        if alerts.channel_id() == str(chat["id"]):
            alerts.CHANNEL_FILE.unlink(missing_ok=True)
        return
    if status != "administrator":
        return
    cfg = await app_settings.get()
    names = {str(chat["id"]), f"@{(chat.get('username') or '').lower()}"}
    other_use = {(cfg.get("required_channel") or "").lower(), str(cfg.get("archive_channel") or "")} & names
    if alerts.channel_id() or chat.get("username") or other_use:
        try:
            await send_message(admin, f"ℹ️ Bot «{esc(chat.get('title') or chat['id'])}» ga administrator qilindi. "
                                      "<b>Log kanali o'zgarmadi.</b>\n\nBu kanalni arxiv yoki majburiy obuna uchun ishlatish: "
                                      "admin panel → Sozlamalar.")
        except Exception:  # the admin never opened the bot: nothing to tell
            pass
        return
    alerts.set_channel(chat["id"])
    await send_message(chat["id"], "✅ <b>SlideAI log kanali ulandi.</b>\n\nBu yerga keladi:\n• har kuni bazaning zaxira nusxasi\n"
                                   "• bot va backend xatolari\n• xizmatlar qayta ishga tushgani")
    log.info("log channel set: %s", chat["id"])


# ---------------------------------------------------------------- commands and menu buttons

async def not_member(chat_id: int, user_id: int, lang: str):
    """Not in the mandatory channel: a new user first picks the language (the join message then comes in it),
    everyone else gets the join message."""
    if await has_choice(user_id):
        await subscription.ask(chat_id, lang)
    else:
        await send_message(chat_id, CHOOSE, lang_keyboard())


_ME: dict = {}


async def bot_username() -> str:
    if "username" not in _ME:
        _ME.update((await telegram.call("getMe"))["result"])
    return _ME["username"]


async def invite_link(uid: int) -> str:
    """The bot link with the user's invite code (the same code as the website's ?ref=)."""
    return f"https://t.me/{await bot_username()}?start=ref_{await growth.ref_code(uid)}"


async def came_by_invite(m: Msg):
    """/start ref_CODE: a new user came by someone's link; the inviter is told (the bonus comes after the first top-up)."""
    parts = m.text.split(maxsplit=1)
    if len(parts) < 2 or not parts[1].startswith("ref_") or not await growth.attach(m.uid, parts[1][4:]):
        return
    inviter = await db.pool().fetchval("SELECT referrer_id FROM referrals WHERE referred_id = $1", m.uid)
    bonus = (await app_settings.get())["referral_bonus"]
    if inviter and bonus:
        name = " ".join(x for x in (m.user.get("first_name"), m.user.get("last_name")) if x) or "Döstingiz"
        lang = await lang_of(inviter)
        try:
            await send_message(inviter, t(lang, "invite_joined", name=name, bonus=som(bonus, lang)))
        except Exception:  # the inviter blocked the bot: the referral still counts
            log.info("invite note to %s not sent", inviter)


async def cmd_invite(m: Msg):
    await growth.settle(m.uid)  # a friend may have topped up since the last hourly run
    info = await growth.referral_info(m.uid)
    if not info["bonus"]:
        await send_message(m.chat_id, t(m.lang, "invite_off"))
        return
    link = await invite_link(m.uid)
    share = f"https://t.me/share/url?url={quote(link)}&text={quote(t(m.lang, 'share_text'))}"
    await send_message(m.chat_id, t(m.lang, "invite", bonus=som(info["bonus"], m.lang), link=link, invited=info["invited"],
                                    paid=info["paid"], earned=som(info["paid"] * info["bonus"], m.lang)),
                       {"inline_keyboard": [[{"text": t(m.lang, "btn_share"), "url": share, "style": PRIMARY}]]})


async def cmd_start(m: Msg):
    await came_by_invite(m)
    if await has_choice(m.uid):
        if await subscription.is_member(m.uid):
            await welcome(m.chat_id, m.lang)
        else:
            await subscription.ask(m.chat_id, m.lang)
    else:
        await send_message(m.chat_id, CHOOSE, lang_keyboard())


async def cmd_create(m: Msg):
    # an old keyboard (plain text button) or no HTTPS address yet: answer with the inline button
    if has_webapp():
        await send_message(m.chat_id, t(m.lang, "create_open"), {"inline_keyboard": [[{"text": t(m.lang, "open"), "web_app": {"url": app_url(m.lang)}, "style": PRIMARY}]]})
    else:
        await send_message(m.chat_id, t(m.lang, "hint"))


async def cmd_anim(m: Msg):
    """✨ Animated presentation: the Mini App with the switch on, for those it is open to; "coming soon" for the rest."""
    if not await animation.allowed(m.uid):
        await send_message(m.chat_id, t(m.lang, "anim_soon"))
    elif has_webapp():
        await send_message(m.chat_id, t(m.lang, "anim_open"), {"inline_keyboard": [[{"text": t(m.lang, "btn_anim"), "web_app": {"url": anim_url(m.lang)}, "style": PRIMARY}]]})
    else:
        await send_message(m.chat_id, t(m.lang, "hint"))


async def cmd_paper(m: Msg):
    """/referat, /mustaqil (the Menu), or a keyboard button without web_app (an old one, or no HTTPS yet): the form as
    an inline button. The one "Referat / Mustaqil ish" button lets the form ask which."""
    doc_type = "mustaqil" if m.key == "kb_mustaqil" or m.text.lower().startswith("/mustaqil") else None if m.key == "kb_paper" else "referat"
    if has_webapp():
        await send_message(m.chat_id, t(m.lang, "create_open"),
                           {"inline_keyboard": [[{"text": t(m.lang, f"kb_{doc_type or 'paper'}"), "web_app": {"url": paper_url(m.lang, doc_type)}, "style": PRIMARY}]]})
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
                       {"inline_keyboard": [[{"text": t(m.lang, "admin_btn"), "url": url, "style": PRIMARY}]]} if has_webapp() else None)


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
        await send_message(m.chat_id, "/addbalance &lt;user_id&gt; &lt;amount&gt;")


async def cmd_emoji(m: Msg):
    """Admins: /emoji with premium (animated) emoji from the Telegram keyboard — the bot uses them instead of the plain
    ones in its messages and as button icons (core/telegram.py). /emoji off — back to plain emoji."""
    current = dict((await app_settings.get()).get("custom_emoji") or {})
    raw = m.raw.get("text") or ""
    if raw.split()[1:2] == ["off"]:
        await app_settings.set_many({"custom_emoji": {}}, m.uid)
        await send_message(m.chat_id, "✅ Animatsiyali emojilar o'chirildi, oddiy emojilar ishlatiladi.")
        return
    u16 = raw.encode("utf-16-le")  # entity offsets count UTF-16 code units
    found = {u16[e["offset"] * 2:(e["offset"] + e["length"]) * 2].decode("utf-16-le"): e["custom_emoji_id"]
             for e in m.raw.get("entities") or [] if e.get("type") == "custom_emoji"}
    if not found:
        await send_message(m.chat_id, "✨ <b>Animatsiyali emojilar</b>\n\nBuyruq bilan birga Telegram'dagi premium emojilarni yuboring, "
                                      "masalan: <code>/emoji</code> 📊📝📘🖼💰✏️🌐❓✅❌\nHar biri o'sha oddiy emoji o'rnida ishlatiladi.\n\n"
                                      f"Hozir sozlangan: <b>{len(current)} ta</b>. O'chirish: <code>/emoji off</code>\n\n"
                                      "<i>Ular faqat bot egasida Telegram Premium bo'lsa ko'rinadi.</i>")
        return
    current.update(found)
    await app_settings.set_many({"custom_emoji": current}, m.uid)
    await send_message(m.chat_id, f"✅ Saqlandi: {' '.join(found)}\nJami: <b>{len(current)} ta</b>. Endi xabarlar va tugmalarda shular chiqadi.")


Handler = Callable[[Msg], Awaitable[None]]
# (commands, bottom-menu button keys, admins only, handler) — the first match wins
ROUTES: list[tuple[tuple[str, ...], tuple[str, ...], bool, Handler]] = [
    (("/start",), (), False, cmd_start),
    (("/taqdimot",), ("kb_create",), False, cmd_create),
    (("/referat", "/mustaqil"), ("kb_referat", "kb_mustaqil", "kb_paper"), False, cmd_paper),
    (("/animatsiya", "/anim"), ("kb_anim",), False, cmd_anim),
    (("/taklif", "/invite"), ("kb_invite",), False, cmd_invite),
    (("/pdf",), ("kb_pdf",), False, cmd_pdf),
    ((), ("kb_pdf_make", "kb_pdf_cancel"), False, cmd_old_pdf_button),
    (("/language", "/til"), ("kb_lang",), False, cmd_language),
    (("/balance", "/balans"), ("kb_balance",), False, cmd_balance),
    (("/addbalance",), (), True, cmd_addbalance),
    (("/admin",), (), True, cmd_admin),
    (("/emoji",), (), True, cmd_emoji),
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
        if await subscription.is_member(uid):  # a new user: the channel comes right after the language
            await welcome(chat_id, lang)
        else:
            await subscription.ask(chat_id, lang)
    elif data == "sub_check":
        if await subscription.is_member(uid):
            await answer_callback(q["id"], t(lang, "sub_thanks"))
            await welcome(chat_id, lang)
        else:
            await answer_callback(q["id"], t(lang, "sub_not_yet"))
    elif not await subscription.is_member(uid):
        await answer_callback(q["id"])
        await not_member(chat_id, uid, lang)
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

    if route(m) not in (cmd_start, cmd_language) and not await subscription.is_member(uid):
        # not in the channel: nothing works but /start and choosing the language (which then asks to join)
        await not_member(m.chat_id, uid, m.lang)
        return
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

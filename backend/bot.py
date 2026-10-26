"""
Telegram bot (webhook or polling.py), async: language choice, the button that opens the Mini App, balance top-up.
Users, languages, balances and orders are in PostgreSQL (db.py).

/start     first time: choose a language; later: welcome + "open app" and "balance" buttons
/language  choose the language again
/help      short help
/balance   balance, prices and top-up buttons (the only place where money is added)
/pdf       images -> PDF: the user sends photos / image files, "✅ PDF yaratish", then the file name -> one PDF (images_pdf.py)
The bottom (reply) keyboard repeats these: 📊 Taqdimot yaratish, 🖼 Rasmdan PDF, 💰 Balans, ✏️ Muharrir, 🌐 Til, ❓ Yordam.
The chosen language is used everywhere: bot messages, the Mini App (?lang=), files' captions.

Top-up goes through payment links (payments.py), not Telegram invoices:
topup:<amount> -> pay:<provider>:<amount> (choice shown only if both are connected) -> order + Payme/Click link
-> the provider calls /api/pay/... -> balance credited -> notify_paid() tells the user.
Card transfer: pay:card:<amount> -> card number + payment ID -> the user sends a screenshot -> it goes to every
admin with the ID and card_ok:/card_no:<order> buttons -> the admin's choice credits the balance or rejects.
"""
import asyncio
import html
import logging
import re
import tempfile
from pathlib import Path

import alerts
import appconfig
import billing
import editor
import images_pdf as pdfs
import payments
from config import settings
from prefs import has_choice, lang_of, set_lang, touch
from texts import CHOOSE, LANG_NAMES, LANGS, T, som, t
from telegram_api import answer_callback, download_file, edit_caption, send_document, send_file_id, send_message, set_menu_button
from telegram_auth import make_admin_token, make_editor_token

log = logging.getLogger("bot")

PROVIDER_NAMES = {"payme": "Payme", "click": "Click"}
BUTTONS = {T[lang][k]: k for lang in LANGS for k in T[lang] if k.startswith("kb_")}  # reply-keyboard text -> key, any language


def app_url(lang: str) -> str:
    sep = "&" if "?" in settings.webapp_url else "?"
    return f"{settings.webapp_url}{sep}lang={lang}"


def lang_keyboard() -> dict:
    return {"inline_keyboard": [[{"text": LANG_NAMES[l], "callback_data": f"lang:{l}"} for l in LANGS]]}


def has_webapp() -> bool:
    return settings.webapp_url.startswith("https://")  # Telegram accepts web_app buttons only with HTTPS


def open_keyboard(lang: str) -> dict:
    rows = [[{"text": t(lang, "open"), "web_app": {"url": app_url(lang)}}]] if has_webapp() else []
    rows.append([{"text": t(lang, "btn_balance"), "callback_data": "balance"}])
    return {"inline_keyboard": rows}


def main_keyboard(lang: str) -> dict:
    """The bottom menu that stays under the input field."""
    b = lambda k: {"text": t(lang, k)}
    return {"keyboard": [[b("kb_create")], [b("kb_pdf"), b("kb_balance")], [b("kb_editor"), b("kb_lang"), b("kb_help")]],
            "resize_keyboard": True, "is_persistent": True}


def pdf_keyboard(lang: str) -> dict:
    return {"keyboard": [[{"text": t(lang, "kb_pdf_make")}], [{"text": t(lang, "kb_pdf_cancel")}]],
            "resize_keyboard": True, "is_persistent": True}


def pdf_name_keyboard(lang: str) -> dict:
    """While the name is awaited: the field is for typing; only Cancel stays as a button."""
    return {"keyboard": [[{"text": t(lang, "kb_pdf_cancel")}]], "resize_keyboard": True, "is_persistent": True,
            "input_field_placeholder": t(lang, "pdf_name_ph")}


def topup_keyboard(lang: str, amounts: list[int]) -> dict:
    btns = [{"text": t(lang, "topup_btn", amount=som(a, lang)), "callback_data": f"topup:{a}"} for a in amounts]
    return {"inline_keyboard": [btns[i:i + 2] for i in range(0, len(btns), 2)]}


def provider_name(provider: str, lang: str) -> str:
    return t(lang, "card_name") if provider == "card" else PROVIDER_NAMES[provider]


def provider_keyboard(amount: int, lang: str) -> dict:
    return {"inline_keyboard": [[{"text": provider_name(p, lang), "callback_data": f"pay:{p}:{amount}"} for p in payments.providers()]]}


async def welcome(chat_id: int, lang: str):
    if has_webapp():
        await set_menu_button(chat_id, t(lang, "open"), app_url(lang))  # the menu button follows the language too
    # no inline buttons here: the app opens from the menu button by the input field, the rest is in the bottom menu
    await send_message(chat_id, t(lang, "welcome"), main_keyboard(lang))


async def show_balance(chat_id: int, user_id: int, lang: str):
    cfg = await appconfig.get()
    await send_message(chat_id, t(lang, "balance", balance=som(await billing.balance(user_id), lang),
                            p_gen=som(cfg["price_generate"], lang), p_restyle=som(cfg["price_restyle"], lang)),
                 topup_keyboard(lang, cfg["topup_amounts"]))


async def send_low_balance(user_id: int, lang: str, price: int):
    """Called by the API when a paid job is refused: tells how much is missing, with top-up buttons."""
    await send_message(user_id, t(lang, "low_balance", price=som(price, lang), balance=som(await billing.balance(user_id), lang)),
                 topup_keyboard(lang, (await appconfig.get())["topup_amounts"]))


async def send_pay_link(chat_id: int, user_id: int, amount: int, lang: str, provider: str):
    """New order for this amount, and a URL button that opens the provider's payment page."""
    order_id = await payments.create_order(user_id, amount, provider)
    if provider == "card" and await pdfs.cancel(user_id):  # the screenshot must not land in an unfinished PDF
        await send_message(chat_id, t(lang, "pdf_cancelled"), main_keyboard(lang))
    if provider == "card":
        await send_card_details(chat_id, order_id, amount, lang)
        return
    url = payments.payme_link(order_id, amount) if provider == "payme" else payments.click_link(order_id, amount)
    await send_message(chat_id, t(lang, "pay_link", amount=som(amount, lang), provider=PROVIDER_NAMES[provider]),
                 {"inline_keyboard": [[{"text": t(lang, "pay_btn", provider=PROVIDER_NAMES[provider]), "url": url}]]})


def card_display(number: str) -> str:
    digits = "".join(ch for ch in number if ch.isdigit())
    return " ".join(digits[i:i + 4] for i in range(0, len(digits), 4)) or number


async def send_card_details(chat_id: int, order_id: int, amount: int, lang: str):
    holder = t(lang, "card_holder", name=html.escape(settings.card_holder)) if settings.card_holder else ""
    await send_message(chat_id, t(lang, "card_details", code=payments.payment_code(order_id), amount=som(amount, lang),
                            card=html.escape(card_display(settings.card_number)), holder=holder), parse_mode="HTML")


def editor_url(user_id: int, lang: str) -> str:
    """Signed link to the desktop editor; the token is in the #fragment, so it never reaches server logs."""
    return f"{settings.webapp_url.rstrip('/')}/editor.html#t={make_editor_token(user_id)}&lang={lang}"


def editor_keyboard(user_id: int, lang: str, doc: str | None = None) -> dict | None:
    if not has_webapp():
        return None
    return {"inline_keyboard": [[{"text": t(lang, "editor_btn"), "url": editor_url(user_id, lang) + (f"&doc={doc}" if doc else "")}]]}


async def receive_presentation(chat_id: int, user: dict, doc: dict, lang: str):
    """A .pptx / .ppt / .odp sent to the bot goes into the user's editor documents."""
    if (doc.get("file_size") or 0) > 20 * 1024 * 1024:
        await send_message(chat_id, t(lang, "editor_too_big")); return
    await send_message(chat_id, t(lang, "editor_wait"))
    try:
        data = await download_file(doc["file_id"])
        doc_id = await asyncio.to_thread(editor.import_file, user["id"], data, doc.get("file_name") or "taqdimot.pptx", source="bot")
    except (editor.EditorError, ValueError):
        await send_message(chat_id, t(lang, "editor_bad")); return
    name = editor.clean_name(doc.get("file_name") or "")
    await send_message(chat_id, t(lang, "editor_added", name=name), editor_keyboard(user["id"], lang, doc_id))


# ---------- images -> PDF ----------

_acks: dict[int, asyncio.Task] = {}  # one "received: N" answer per album, not one per photo


async def pdf_start(chat_id: int, user_id: int, lang: str):
    await pdfs.start(user_id)
    await send_message(chat_id, t(lang, "pdf_start", max=pdfs.MAX_IMAGES), pdf_keyboard(lang))


async def _ack_later(chat_id: int, user_id: int, lang: str):
    await asyncio.sleep(1.5)
    _acks.pop(user_id, None)
    n = await pdfs.count(user_id)
    if n:
        await send_message(chat_id, t(lang, "pdf_full" if n >= pdfs.MAX_IMAGES else "pdf_added", n=n, max=pdfs.MAX_IMAGES))


async def pdf_receive(chat_id: int, user_id: int, file_id: str, message_id: int, lang: str):
    await pdfs.add(user_id, file_id, message_id)  # None (full) is reported by the answer below
    if old := _acks.pop(user_id, None):
        old.cancel()
    _acks[user_id] = asyncio.create_task(_ack_later(chat_id, user_id, lang))


async def pdf_ask_name(chat_id: int, user_id: int, lang: str):
    """"✅ PDF yaratish": the images are in; the user names the file before it is made."""
    if task := _acks.pop(user_id, None):
        task.cancel()
    n = await pdfs.count(user_id)
    if not n:
        await send_message(chat_id, t(lang, "pdf_empty"), pdf_keyboard(lang))
        return
    await pdfs.set_stage(user_id, "name")
    await send_message(chat_id, t(lang, "pdf_ask_name", n=n), pdf_name_keyboard(lang))


async def pdf_make(chat_id: int, user_id: int, lang: str, name: str):
    files = await pdfs.take(user_id)
    if not files:
        await pdfs.start(user_id)
        await send_message(chat_id, t(lang, "pdf_empty"), pdf_keyboard(lang))
        return
    await send_message(chat_id, t(lang, "pdf_wait"), main_keyboard(lang))
    skipped = 0
    try:
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / f"{name}.pdf"
            with open(path, "wb") as f:
                pdf = pdfs.PdfWriter(f)
                for file_id in files:  # one image in memory at a time
                    try:
                        page = await asyncio.to_thread(pdfs.prepare, await download_file(file_id))
                    except Exception:  # not an image (or too big for the Bot API): leave it out
                        skipped += 1
                        continue
                    pdf.page(*page)
                if pdf.pages:
                    pdf.close()
            if not pdf.pages:
                raise ValueError("no readable images")
            await send_document(chat_id, str(path), caption=t(lang, "pdf_done", name=name, n=len(pdf.pages)))
        if skipped:
            await send_message(chat_id, t(lang, "pdf_skipped", n=skipped))
    except Exception:
        log.exception("PDF yaratilmadi · foydalanuvchi %s · %s ta rasm", user_id, len(files))
        await send_message(chat_id, t(lang, "pdf_error"))


def user_label(u: dict) -> str:
    name = " ".join(x for x in (u.get("first_name"), u.get("last_name")) if x) or "—"
    return f"{name} (@{u['username']})" if u.get("username") else name


async def receive_screenshot(chat_id: int, user: dict, file_id: str, kind: str, caption: str, lang: str):
    order = await payments.card_submit(user["id"], file_id, kind, caption)
    if not order:
        await send_message(chat_id, t(lang, "card_no_order"), topup_keyboard(lang, (await appconfig.get())["topup_amounts"]))
        return
    code = payments.payment_code(order["id"])
    await send_message(chat_id, t(lang, "card_got", code=code, amount=som(order["amount"], lang)))
    for admin in settings.admin_ids:
        al = await lang_of(admin)
        kb = {"inline_keyboard": [[{"text": t(al, "card_ok_btn"), "callback_data": f"card_ok:{order['id']}"},
                                   {"text": t(al, "card_no_btn"), "callback_data": f"card_no:{order['id']}"}]]}
        caption = t(al, "card_admin", code=code, amount=som(order["amount"], al), user=user_label(user), uid=user["id"])
        try:
            await send_file_id(admin, file_id, kind, caption, kb)
        except Exception:  # an admin who never started the bot must not break the others
            pass


async def card_decision(q: dict, approve: bool, order_id: int):
    admin, al = q["from"], await lang_of(q["from"]["id"], q["from"].get("language_code"))
    outcome, order, new = await payments.card_decide(order_id, approve, admin["id"])
    if outcome in ("done", "missing"):
        await answer_callback(q["id"], t(al, "card_admin_done"))
        return
    await answer_callback(q["id"])
    m = q.get("message") or {}
    if m.get("message_id"):
        verdict = t(al, "card_admin_paid" if outcome == "paid" else "card_admin_rejected", admin=user_label(admin))
        await edit_caption(m["chat"]["id"], m["message_id"], f"{m.get('caption', '')}\n\n{verdict}")
    if outcome == "paid":
        await notify_paid({"user_id": order["user_id"], "amount": order["amount"], "balance": new})
    else:
        ul = await lang_of(order["user_id"])
        await send_message(order["user_id"], t(ul, "card_rejected", code=payments.payment_code(order["id"])))


async def notify_paid(paid: dict):
    """Called by the API after Payme / Click confirmed a payment."""
    uid = paid["user_id"]; lang = await lang_of(uid)
    await send_message(uid, t(lang, "paid", amount=som(paid["amount"], lang), balance=som(paid["balance"], lang)), open_keyboard(lang))


async def channel_joined(m: dict):
    """The bot was made an administrator of a channel / group by an admin: that chat becomes the log channel."""
    chat, status = m["chat"], m["new_chat_member"]["status"]
    if chat["type"] not in ("channel", "supergroup", "group") or m["from"]["id"] not in settings.admin_ids:
        return
    if status == "administrator":
        alerts.set_channel(chat["id"])
        await send_message(chat["id"], "✅ SlideAI log kanali ulandi.\n\nBu yerga keladi:\n• har kuni bazaning zaxira nusxasi\n"
                                       "• bot va backend xatolari\n• xizmatlar qayta ishga tushgani")
        log.info("log channel set: %s", chat["id"])
    elif status in ("left", "kicked") and alerts.channel_id() == str(chat["id"]):
        alerts.CHANNEL_FILE.unlink(missing_ok=True)


async def handle(update: dict):
    if "my_chat_member" in update:
        await channel_joined(update["my_chat_member"])
        return
    if "callback_query" in update:
        q = update["callback_query"]
        data, uid = q.get("data", ""), q["from"]["id"]
        chat_id = q["message"]["chat"]["id"]
        await touch(q["from"])
        lang = await lang_of(uid, q["from"].get("language_code"))
        if data.startswith("lang:") and data[5:] in LANGS:
            lang = data[5:]
            await set_lang(uid, lang)
            await answer_callback(q["id"], t(lang, "saved"))
            await welcome(chat_id, lang)
        elif data == "balance":
            await answer_callback(q["id"])
            await show_balance(chat_id, uid, lang)
        elif data.startswith("topup:") and data[6:].isdigit() and int(data[6:]) in (await appconfig.get())["topup_amounts"]:
            amount, available = int(data[6:]), payments.providers()
            if not available:
                await answer_callback(q["id"], t(lang, "no_payments"))
            elif len(available) == 1:
                await answer_callback(q["id"])
                await send_pay_link(chat_id, uid, amount, lang, available[0])
            else:
                await answer_callback(q["id"])
                await send_message(chat_id, t(lang, "choose_provider", amount=som(amount, lang)), provider_keyboard(amount, lang))
        elif data.split(":")[0] in ("card_ok", "card_no") and data.split(":")[-1].isdigit():
            if uid in settings.admin_ids:
                await card_decision(q, data.startswith("card_ok"), int(data.split(":")[-1]))
            else:
                await answer_callback(q["id"])
        elif data.startswith("pay:"):
            _, provider, amount = (data.split(":") + ["", ""])[:3]
            if provider in payments.providers() and amount.isdigit() and int(amount) in (await appconfig.get())["topup_amounts"]:
                await answer_callback(q["id"])
                await send_pay_link(chat_id, uid, int(amount), lang, provider)
            else:
                await answer_callback(q["id"], t(lang, "no_payments"))
        return

    msg = update.get("message")
    if not msg or msg.get("chat", {}).get("type") != "private":
        return
    chat_id, user = msg["chat"]["id"], msg.get("from", {})
    await touch(user)
    text = (msg.get("text") or "").strip()
    lang = await lang_of(user.get("id", chat_id), user.get("language_code"))

    doc = msg.get("document") or {}
    uid = user.get("id", chat_id)
    is_image = bool(msg.get("photo")) or str(doc.get("mime_type", "")).startswith("image/")
    key = BUTTONS.get(text)

    # images -> PDF: while a draft is open, images go into it
    if stage := await pdfs.stage(uid):
        if key == "kb_pdf_cancel":
            await pdfs.cancel(uid)
            await send_message(chat_id, t(lang, "pdf_cancelled"), main_keyboard(lang)); return
        if stage == "name" and text and not text.startswith("/") and not key:  # the file name
            name = pdfs.clean_name(text)
            if not re.search(r"\w", name):
                await send_message(chat_id, t(lang, "pdf_bad_name"), pdf_name_keyboard(lang)); return
            await pdf_make(chat_id, uid, lang, name); return
        if stage == "name" and (is_image or key == "kb_pdf_make"):  # still adding photos: take them, ask for the name again
            if is_image:
                await pdfs.add(uid, msg["photo"][-1]["file_id"] if msg.get("photo") else doc["file_id"], msg["message_id"])
            await send_message(chat_id, t(lang, "pdf_need_name"), pdf_name_keyboard(lang)); return
        if key == "kb_pdf_make":
            await pdf_ask_name(chat_id, uid, lang); return
        if is_image:
            file_id = msg["photo"][-1]["file_id"] if msg.get("photo") else doc["file_id"]
            await pdf_receive(chat_id, uid, file_id, msg["message_id"], lang); return
        if doc or not (text.startswith("/") or key):
            n = await pdfs.count(uid)
            await send_message(chat_id, t(lang, "pdf_not_image") if doc else
                               t(lang, "pdf_added", n=n) if n else t(lang, "pdf_empty"),
                               pdf_name_keyboard(lang) if stage == "name" else pdf_keyboard(lang)); return
        await pdfs.cancel(uid)  # another command or menu button: leave the PDF section
        await send_message(chat_id, t(lang, "pdf_cancelled"), main_keyboard(lang))

    # a presentation to edit
    if str(doc.get("file_name", "")).lower().endswith(editor.IMPORTABLE):
        await receive_presentation(chat_id, user, doc, lang)
        return

    # a payment screenshot: a photo, or an image sent as a file
    if is_image:
        file_id, kind = (msg["photo"][-1]["file_id"], "photo") if msg.get("photo") else (doc["file_id"], "document")
        await receive_screenshot(chat_id, user, file_id, kind, msg.get("caption", ""), lang)
        return

    if text.startswith("/start"):
        if await has_choice(user["id"]):
            await welcome(chat_id, lang)
        else:
            await send_message(chat_id, CHOOSE, lang_keyboard())
    elif key == "kb_create":
        # a reply-keyboard web_app button would open the app without initData (no user, no balance): send the inline one
        if has_webapp():
            await send_message(chat_id, t(lang, "create_open"), {"inline_keyboard": [[{"text": t(lang, "open"), "web_app": {"url": app_url(lang)}}]]})
        else:
            await send_message(chat_id, t(lang, "hint"))
    elif text.startswith("/pdf") or key == "kb_pdf":
        await pdf_start(chat_id, uid, lang)
    elif key in ("kb_pdf_make", "kb_pdf_cancel"):  # an old PDF keyboard after the section was closed
        await send_message(chat_id, t(lang, "menu"), main_keyboard(lang))
    elif text.startswith("/language") or text.startswith("/til") or key == "kb_lang":
        await send_message(chat_id, CHOOSE, lang_keyboard())
    elif text.startswith("/balance") or text.startswith("/balans") or key == "kb_balance":
        await show_balance(chat_id, user["id"], lang)
    elif text.startswith("/admin") and uid in settings.admin_ids:
        url = f"{settings.webapp_url.rstrip('/')}/admin.html#t={make_admin_token(uid)}"
        await send_message(chat_id, t(lang, "admin_link"), {"inline_keyboard": [[{"text": t(lang, "admin_btn"), "url": url}]]}
                           if has_webapp() else None)
    elif text.startswith("/addbalance") and user.get("id") in settings.admin_ids:
        # admin: /addbalance <user_id> <amount>  (manual top-up, e.g. cash or tests)
        parts = text.split()
        if len(parts) == 3 and parts[1].isdigit() and parts[2].lstrip("-").isdigit():
            target, amount = int(parts[1]), int(parts[2])
            new = await billing.top_up(target, amount, ref=f"admin:{chat_id}:{msg['message_id']}", kind="admin")
            await send_message(chat_id, t(lang, "admin_added", user=target, amount=som(amount, lang), balance=som(new, lang)))
        else:
            await send_message(chat_id, "/addbalance <user_id> <amount>")
    elif text.startswith("/editor") or text.startswith("/muharrir") or key == "kb_editor":
        await send_message(chat_id, t(lang, "editor_link"), editor_keyboard(user["id"], lang))
    elif text.startswith("/help") or key == "kb_help":
        await send_message(chat_id, t(lang, "help"), open_keyboard(lang))
    else:
        await send_message(chat_id, t(lang, "hint"), open_keyboard(lang))

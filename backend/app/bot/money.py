"""
Balance and top-up in the bot (the only place where money is added).

topup:<amount> -> pay:<provider>:<amount> (the choice is shown only if several are connected) -> order + Payme/Click
link -> the provider calls /api/pay/... -> balance credited -> notify_paid() tells the user.
Card transfer: card number + payment ID -> the user sends a screenshot -> it goes to every admin with
card_ok:/card_no:<order> buttons -> the admin's choice credits the balance or rejects.
"""
import html
import logging

from app.bot.keyboards import (
    DANGER,
    PROVIDER_NAMES,
    SUCCESS,
    main_keyboard,
    open_keyboard,
    provider_keyboard,
    topup_keyboard,
    user_label,
)
from app.core.config import settings
from app.core.telegram import answer_callback, edit_caption, send_file_id, send_message
from app.services import app_settings, billing, payments
from app.services import images_pdf as pdfs
from app.services.users import lang_of
from app.texts import esc, som, t

log = logging.getLogger("bot")


async def show_balance(chat_id: int, user_id: int, lang: str):
    cfg = await app_settings.get()
    await send_message(chat_id, t(lang, "balance", balance=som(await billing.balance(user_id), lang),
                                  p_gen=som(cfg["price_generate"], lang), p_restyle=som(cfg["price_restyle"], lang),
                                  p_paper=som(cfg["price_paper"], lang)),
                       topup_keyboard(lang, cfg["topup_amounts"]))


async def send_low_balance(user_id: int, lang: str, price: int):
    """Called by the API when a paid job is refused: tells how much is missing, with top-up buttons."""
    await send_message(user_id, t(lang, "low_balance", price=som(price, lang), balance=som(await billing.balance(user_id), lang)),
                       topup_keyboard(lang, (await app_settings.get())["topup_amounts"]))


def card_display(number: str) -> str:
    digits = "".join(ch for ch in number if ch.isdigit())
    return " ".join(digits[i:i + 4] for i in range(0, len(digits), 4)) or number


async def send_pay_link(chat_id: int, user_id: int, amount: int, lang: str, provider: str):
    """New order for this amount: card details, or a URL button that opens the provider's payment page."""
    order_id = await payments.create_order(user_id, amount, provider)
    if provider == "card":
        if await pdfs.cancel(user_id):  # the screenshot must not land in an unfinished PDF
            await send_message(chat_id, t(lang, "pdf_cancelled"), main_keyboard(lang, chat_id))
        holder = t(lang, "card_holder", name=html.escape(settings.card_holder)) if settings.card_holder else ""
        await send_message(chat_id, t(lang, "card_details", code=payments.payment_code(order_id), amount=som(amount, lang),
                                      card=html.escape(card_display(settings.card_number)), holder=holder), parse_mode="HTML")
        return
    url = payments.payme_link(order_id, amount) if provider == "payme" else payments.click_link(order_id, amount)
    await send_message(chat_id, t(lang, "pay_link", amount=som(amount, lang), provider=PROVIDER_NAMES[provider]),
                       {"inline_keyboard": [[{"text": t(lang, "pay_btn", provider=PROVIDER_NAMES[provider]), "url": url, "style": SUCCESS}]]})


async def receive_screenshot(chat_id: int, user: dict, file_id: str, kind: str, caption: str, lang: str):
    order = await payments.card_submit(user["id"], file_id, kind, caption)
    if not order:
        await send_message(chat_id, t(lang, "card_no_order"), topup_keyboard(lang, (await app_settings.get())["topup_amounts"]))
        return
    code = payments.payment_code(order["id"])
    await send_message(chat_id, t(lang, "card_got", code=code, amount=som(order["amount"], lang)))
    for admin in settings.admin_ids:
        al = await lang_of(admin)
        kb = {"inline_keyboard": [[{"text": t(al, "card_ok_btn"), "callback_data": f"card_ok:{order['id']}", "style": SUCCESS},
                                   {"text": t(al, "card_no_btn"), "callback_data": f"card_no:{order['id']}", "style": DANGER}]]}
        text = t(al, "card_admin", code=code, amount=som(order["amount"], al), user=user_label(user), uid=user["id"])
        try:
            await send_file_id(admin, file_id, kind, text, kb)
        except Exception:  # an admin who never started the bot must not break the others
            log.warning("could not send the card screenshot to admin %s", admin)


async def card_decision(q: dict, approve: bool, order_id: int):
    admin, al = q["from"], await lang_of(q["from"]["id"], q["from"].get("language_code"))
    outcome, order, new = await payments.card_decide(order_id, approve, admin["id"])
    if outcome in ("done", "missing") or order is None:
        await answer_callback(q["id"], t(al, "card_admin_done"))
        return
    await answer_callback(q["id"])
    m = q.get("message") or {}
    if m.get("message_id"):
        verdict = t(al, "card_admin_paid" if outcome == "paid" else "card_admin_rejected", admin=user_label(admin))
        await edit_caption(m["chat"]["id"], m["message_id"], f"{esc(m.get('caption', ''))}\n\n<b>{verdict}</b>")  # HTML
    if outcome == "paid":
        await notify_paid({"user_id": order["user_id"], "amount": order["amount"], "balance": new})
    else:
        ul = await lang_of(order["user_id"])
        await send_message(order["user_id"], t(ul, "card_rejected", code=payments.payment_code(order["id"])))


async def notify_paid(paid: dict):
    """A payment was credited (Payme / Click callback, card approval): tell the user."""
    uid = paid["user_id"]; lang = await lang_of(uid)
    await send_message(uid, t(lang, "paid", amount=som(paid["amount"], lang), balance=som(paid["balance"], lang)), open_keyboard(lang))


async def on_callback(q: dict, data: str, chat_id: int, uid: int, lang: str) -> bool:
    """Money buttons. True if this was one of them."""
    amounts = (await app_settings.get())["topup_amounts"]
    if data == "balance":
        await answer_callback(q["id"])
        await show_balance(chat_id, uid, lang)
    elif data.startswith("topup:") and data[6:].isdigit() and int(data[6:]) in amounts:
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
        _, provider, raw = ([*data.split(":"), "", ""])[:3]
        if provider in payments.providers() and raw.isdigit() and int(raw) in amounts:
            await answer_callback(q["id"])
            await send_pay_link(chat_id, uid, int(raw), lang, provider)
        else:
            await answer_callback(q["id"], t(lang, "no_payments"))
    else:
        return False
    return True

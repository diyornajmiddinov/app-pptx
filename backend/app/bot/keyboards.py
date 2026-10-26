"""Keyboards and links the bot sends. Every label comes from texts.py in the user's language."""
from app.core.auth import make_app_token, make_editor_token
from app.core.config import settings
from app.services import payments
from app.texts import LANG_NAMES, LANGS, T, som, t

PROVIDER_NAMES = {"payme": "Payme", "click": "Click"}
BUTTONS = {T[lang][k]: k for lang in LANGS for k in T[lang] if k.startswith("kb_")}  # reply-keyboard text -> key, any language


def has_webapp() -> bool:
    return settings.webapp_url.startswith("https://")  # Telegram accepts web_app buttons only with HTTPS


def app_url(lang: str) -> str:
    sep = "&" if "?" in settings.webapp_url else "?"
    return f"{settings.webapp_url}{sep}lang={lang}"


def editor_url(user_id: int, lang: str) -> str:
    """Signed link to the desktop editor; the token is in the #fragment, so it never reaches server logs."""
    return f"{settings.webapp_url.rstrip('/')}/editor.html#t={make_editor_token(user_id)}&lang={lang}"


def lang_keyboard() -> dict:
    return {"inline_keyboard": [[{"text": LANG_NAMES[code], "callback_data": f"lang:{code}"} for code in LANGS]]}


def open_keyboard(lang: str) -> dict:
    rows = [[{"text": t(lang, "open"), "web_app": {"url": app_url(lang)}}]] if has_webapp() else []
    rows.append([{"text": t(lang, "btn_balance"), "callback_data": "balance"}])
    return {"inline_keyboard": rows}


def main_keyboard(lang: str, user_id: int) -> dict:
    """The bottom menu that stays under the input field. Its first button opens the Mini App itself; the app gets
    no initData that way, so the URL carries this user's signed token (auth.make_app_token)."""
    def b(key):
        return {"text": t(lang, key)}
    create = {**b("kb_create"), "web_app": {"url": f"{app_url(lang)}&t={make_app_token(user_id)}"}} if has_webapp() else b("kb_create")
    return {"keyboard": [[create], [b("kb_pdf"), b("kb_balance")], [b("kb_editor"), b("kb_lang"), b("kb_help")]],
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


def editor_keyboard(user_id: int, lang: str, doc: str | None = None) -> dict | None:
    if not has_webapp():
        return None
    return {"inline_keyboard": [[{"text": t(lang, "editor_btn"), "url": editor_url(user_id, lang) + (f"&doc={doc}" if doc else "")}]]}


def user_label(u: dict) -> str:
    name = " ".join(x for x in (u.get("first_name"), u.get("last_name")) if x) or "—"
    return f"{name} (@{u['username']})" if u.get("username") else name

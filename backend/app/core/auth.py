"""Verify Telegram Mini App initData (HMAC-SHA256 with the bot token)."""
import hashlib
import hmac
import json
import time
from urllib.parse import parse_qsl

from fastapi import Header, HTTPException

from app.core.config import settings

MAX_AGE = 60 * 60 * 24  # seconds


def verify_init_data(init_data: str, bot_token: str) -> dict:
    try:
        fields = dict(parse_qsl(init_data, keep_blank_values=True, strict_parsing=True))
    except ValueError as e:
        raise HTTPException(401, "Invalid initData") from e
    received = fields.pop("hash", None)
    if not received:
        raise HTTPException(401, "Missing hash")
    check = "\n".join(f"{k}={v}" for k, v in sorted(fields.items()))
    secret = hmac.new(b"WebAppData", bot_token.encode(), hashlib.sha256).digest()
    if not hmac.compare_digest(hmac.new(secret, check.encode(), hashlib.sha256).hexdigest(), received):
        raise HTTPException(401, "Bad signature")
    if time.time() - int(fields.get("auth_date", 0)) > MAX_AGE:
        raise HTTPException(401, "initData expired")
    return json.loads(fields["user"])


# ---------------------------------------------------------------- Mini App opened from the bottom keyboard
# Telegram gives a Mini App opened by a reply-keyboard button NO initData. So that button's URL carries a signed
# token made for that one user (?t=<user_id>.<expires>.<hmac>); the bot puts a fresh one in every keyboard it sends.
APP_TTL = 60 * 24 * 60 * 60


def _app_key() -> bytes:
    return hmac.new(b"SlideAI-app", settings.bot_token.encode(), hashlib.sha256).digest()


def make_app_token(user_id: int, ttl: int = APP_TTL) -> str:
    body = f"{int(user_id)}.{int(time.time()) + ttl}"
    return f"{body}.{hmac.new(_app_key(), body.encode(), hashlib.sha256).hexdigest()[:40]}"


def check_app_token(token: str) -> int | None:
    try:
        uid, exp, sig = token.split(".")
        good = hmac.new(_app_key(), f"{uid}.{exp}".encode(), hashlib.sha256).hexdigest()[:40]
        if hmac.compare_digest(sig, good) and int(exp) > time.time():
            return int(uid)
    except (ValueError, AttributeError):
        pass
    return None


def telegram_user(x_telegram_init_data: str | None = Header(None), x_app_token: str | None = Header(None)) -> dict:
    """The Mini App's user: from Telegram's signed initData, or from the bottom-keyboard token."""
    if x_telegram_init_data:
        return verify_init_data(x_telegram_init_data, settings.bot_token)
    if uid := check_app_token(x_app_token or ""):
        return {"id": uid}
    raise HTTPException(401, "Missing initData")


# ---------------------------------------------------------------- editor links
# The editor runs in a normal desktop browser, outside Telegram, so it has no initData. The bot / Mini App
# hands out a signed link instead: token = <user_id>.<expires>.<hmac>, valid for EDITOR_TTL seconds.
EDITOR_TTL = 12 * 60 * 60


def _editor_key() -> bytes:
    return hmac.new(b"SlideAI-editor", settings.bot_token.encode(), hashlib.sha256).digest()


def make_editor_token(user_id: int, ttl: int = EDITOR_TTL) -> str:
    body = f"{int(user_id)}.{int(time.time()) + ttl}"
    return f"{body}.{hmac.new(_editor_key(), body.encode(), hashlib.sha256).hexdigest()[:32]}"


def check_editor_token(token: str) -> int:
    try:
        uid, exp, sig = token.split(".")
        good = hmac.new(_editor_key(), f"{uid}.{exp}".encode(), hashlib.sha256).hexdigest()[:32]
        if hmac.compare_digest(sig, good) and int(exp) > time.time():
            return int(uid)
    except (ValueError, AttributeError):
        pass
    raise HTTPException(401, "Editor link expired")


def editor_user(x_editor_token: str | None = Header(None), t: str | None = None) -> int:
    """Token from the X-Editor-Token header, or ?t= for <img> / download links."""
    return check_editor_token(x_editor_token or t or "")


# ---------------------------------------------------------------- admin panel links
# Same scheme with its own key: /admin in the bot (ADMIN_IDS only) -> admin.html#t=<token>. The id is checked
# against ADMIN_IDS again on every request, so removing someone from ADMIN_IDS locks them out at once.
ADMIN_TTL = 12 * 60 * 60


def _admin_key() -> bytes:
    return hmac.new(b"SlideAI-admin", settings.bot_token.encode(), hashlib.sha256).digest()


def make_admin_token(user_id: int, ttl: int = ADMIN_TTL) -> str:
    body = f"{int(user_id)}.{int(time.time()) + ttl}"
    return f"{body}.{hmac.new(_admin_key(), body.encode(), hashlib.sha256).hexdigest()}"


def admin_user(x_admin_token: str | None = Header(None), t: str | None = None) -> int:
    """Token from the X-Admin-Token header, or ?t= for <img> / download links."""
    try:
        uid, exp, sig = (x_admin_token or t or "").split(".")
        good = hmac.new(_admin_key(), f"{uid}.{exp}".encode(), hashlib.sha256).hexdigest()
        if hmac.compare_digest(sig, good) and int(exp) > time.time() and int(uid) in settings.admin_ids:
            return int(uid)
    except (ValueError, AttributeError):
        pass
    raise HTTPException(401, "expired")

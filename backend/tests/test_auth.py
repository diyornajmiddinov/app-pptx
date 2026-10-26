"""Signed links and Telegram initData."""
import hashlib
import hmac
import json
import time
from urllib.parse import urlencode

import pytest
from fastapi import HTTPException

from app.core import auth as ta
from app.core.config import settings


def init_data(uid: int, age: int = 0) -> str:
    fields = {"auth_date": str(int(time.time()) - age), "user": json.dumps({"id": uid, "first_name": "T"})}
    check = "\n".join(f"{k}={v}" for k, v in sorted(fields.items()))
    secret = hmac.new(b"WebAppData", settings.bot_token.encode(), hashlib.sha256).digest()
    return urlencode({**fields, "hash": hmac.new(secret, check.encode(), hashlib.sha256).hexdigest()})


def test_init_data_valid_tampered_expired():
    assert ta.telegram_user(init_data(7))["id"] == 7
    with pytest.raises(HTTPException):
        ta.telegram_user(init_data(7).replace("%22T%22", "%22X%22"))
    with pytest.raises(HTTPException):
        ta.telegram_user(init_data(7, age=ta.MAX_AGE + 10))


def test_app_token_from_the_bottom_keyboard():
    tok = ta.make_app_token(5)
    assert ta.telegram_user(None, tok) == {"id": 5}
    assert ta.check_app_token(tok[:-1] + ("0" if tok[-1] != "0" else "1")) is None
    assert ta.check_app_token(ta.make_app_token(5, ttl=-1)) is None
    with pytest.raises(HTTPException):
        ta.telegram_user(None, None)


def test_admin_token_needs_admin_id():
    assert ta.admin_user(ta.make_admin_token(1000)) == 1000
    for bad in (ta.make_admin_token(42), ta.make_admin_token(1000, ttl=-1), "1000.1.x", ""):
        with pytest.raises(HTTPException):
            ta.admin_user(bad)


def test_tokens_are_not_interchangeable():
    with pytest.raises(HTTPException):
        ta.admin_user(ta.make_editor_token(1000))
    assert ta.check_app_token(ta.make_admin_token(1000)) is None

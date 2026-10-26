"""Card transfers, Payme JSON-RPC and Click SHOP API: every payment is credited exactly once."""
import asyncio
import base64
import hashlib
import time

import pytest
from conftest import add_user

from app.core.config import settings
from app.services import billing, payments


async def test_card_screenshot_then_parallel_approvals_credit_once():
    await add_user(1)
    oid = await payments.create_order(1, 15000, "card")
    order = await payments.card_submit(1, "file-1", "photo", f"chek {payments.payment_code(oid)}")
    assert order["state"] == "review" and order["id"] == oid
    results = await asyncio.gather(*(payments.card_decide(oid, True, 1000) for _ in range(5)))
    assert [r[0] for r in results].count("paid") == 1
    assert await billing.balance(1) == 15000


async def test_card_reject_and_no_open_order():
    await add_user(1)
    assert await payments.card_submit(1, "f", "photo") is None  # nothing to attach the screenshot to
    oid = await payments.create_order(1, 15000, "card")
    await payments.card_submit(1, "f", "photo")
    outcome, _, _ = await payments.card_decide(oid, False, 1000)
    assert outcome == "rejected" and await billing.balance(1) == 0
    assert (await payments.card_decide(oid, True, 1000))[0] == "done"


@pytest.fixture
def payme(monkeypatch):
    monkeypatch.setattr(settings, "payme_key", "k")
    monkeypatch.setattr(settings, "payme_merchant_id", "m")
    auth = "Basic " + base64.b64encode(b"Paycom:k").decode()
    return lambda method, params, a=auth: payments.payme_rpc({"id": 1, "method": method, "params": params}, a)


async def test_payme_full_cycle(payme):
    await add_user(1)
    oid = await payments.create_order(1, 30000, "payme")
    acc = {settings.payme_account_field: str(oid)}
    assert (await payme("CheckPerformTransaction", {"amount": 3000000, "account": acc}))[0]["result"] == {"allow": True}
    assert (await payme("CheckPerformTransaction", {"amount": 1, "account": acc}))[0]["error"]["code"] == -31001
    r, _ = await payme("CreateTransaction", {"id": "t1", "time": int(time.time() * 1000), "amount": 3000000, "account": acc})
    assert r["result"]["state"] == 1
    performed = await asyncio.gather(*(payme("PerformTransaction", {"id": "t1"}) for _ in range(5)))
    assert sum(paid is not None for _, paid in performed) == 1
    assert await billing.balance(1) == 30000
    r, _ = await payme("CancelTransaction", {"id": "t1", "reason": 5})
    assert r["result"]["state"] == -2 and await billing.balance(1) == 0  # refunded after payment: money taken back


async def test_payme_rejects_bad_auth(payme):
    r, _ = await payme("CheckPerformTransaction", {}, "Basic eDp5")
    assert r["error"]["code"] == -32504


async def test_click_prepare_complete_credit_once(monkeypatch):
    monkeypatch.setattr(settings, "click_secret_key", "s")
    await add_user(1)
    oid = await payments.create_order(1, 50000, "click")

    def sign(f, prep=False):
        parts = [f["click_trans_id"], f["service_id"], "s", f["merchant_trans_id"]] + ([f["merchant_prepare_id"]] if prep else []) \
            + [f["amount"], f["action"], f["sign_time"]]
        return {**f, "sign_string": hashlib.md5("".join(parts).encode()).hexdigest()}

    base = {"click_trans_id": "777", "service_id": "11", "merchant_trans_id": str(oid), "amount": "50000", "sign_time": "t", "error": "0"}
    r = await payments.click_prepare(sign({**base, "action": "0"}))
    assert r["error"] == 0
    done = await asyncio.gather(*(payments.click_complete(sign({**base, "action": "1", "merchant_prepare_id": str(r["merchant_prepare_id"])}, True))
                                  for _ in range(5)))
    assert sum(paid is not None for _, paid in done) == 1 and await billing.balance(1) == 50000
    assert (await payments.click_prepare({**sign({**base, "action": "0"}), "sign_string": "x"}))["error"] == -1

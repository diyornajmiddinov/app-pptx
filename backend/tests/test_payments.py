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


def _click_signed(f, prep=False):
    parts = [f["click_trans_id"], f["service_id"], "s", f["merchant_trans_id"]] + ([f["merchant_prepare_id"]] if prep else []) \
        + [f["amount"], f["action"], f["sign_time"]]
    return {**f, "sign_string": hashlib.md5("".join(parts).encode()).hexdigest()}


@pytest.fixture
def click(monkeypatch):
    monkeypatch.setattr(settings, "click_secret_key", "s")
    monkeypatch.setattr(settings, "click_service_id", "11")


def _click_base(oid, ctid="777", amount="50000.00"):
    return {"click_trans_id": ctid, "service_id": "11", "click_paydoc_id": "1", "merchant_trans_id": str(oid),
            "amount": amount, "sign_time": "2026-11-02 10:00:00", "error": "0", "error_note": "Success"}


async def _click_pay(base):
    r = await payments.click_prepare(_click_signed({**base, "action": "0"}))
    assert r["error"] == 0, r
    return await payments.click_complete(_click_signed({**base, "action": "1", "merchant_prepare_id": str(r["merchant_prepare_id"])}, True))


async def test_click_answers_follow_the_shop_api_docs(click):
    await add_user(1)
    oid = await payments.create_order(1, 50000, "click")
    base = _click_base(oid)
    r = await payments.click_prepare(_click_signed({**base, "action": "0"}))
    assert r == {"click_trans_id": 777, "merchant_trans_id": str(oid), "error": 0, "error_note": "Success",
                 "merchant_prepare_id": r["merchant_prepare_id"]} and isinstance(r["merchant_prepare_id"], int)
    assert (await payments.click_prepare({**_click_signed({**base, "action": "0"}), "sign_string": "x"}))["error_note"] == "SIGN CHECK FAILED!"
    assert (await payments.click_prepare(_click_signed({**base, "action": "1"})))["error"] == -3
    assert (await payments.click_prepare(_click_signed({**base, "action": "0", "service_id": "12"})))["error"] == -8  # not our service
    assert (await payments.click_prepare(_click_signed({**base, "action": "0", "amount": "49000"})))["error"] == -2
    assert (await payments.click_prepare(_click_signed({**base, "action": "0", "merchant_trans_id": "999999"})))["error"] == -5
    assert (await payments.click_prepare(_click_signed({**base, "action": "0"})))["merchant_prepare_id"] == r["merchant_prepare_id"]  # repeated
    done = {**base, "action": "1", "merchant_prepare_id": str(r["merchant_prepare_id"])}
    assert (await payments.click_complete(_click_signed({**done, "merchant_prepare_id": "0"}, True)))[0]["error"] == -6
    reply, paid = await payments.click_complete(_click_signed(done, True))
    assert reply["error"] == 0 and reply["merchant_confirm_id"] == r["merchant_prepare_id"] and paid["amount"] == 50000
    reply, paid = await payments.click_complete(_click_signed(done, True))  # Click repeats Complete
    assert reply["error"] == -4 and paid is None and await billing.balance(1) == 50000
    assert (await payments.click_prepare(_click_signed({**base, "action": "0", "click_trans_id": "778"})))["error"] == -4


async def test_click_error_cancels_the_payment(click):
    await add_user(1)
    oid = await payments.create_order(1, 50000, "click")
    base = _click_base(oid)
    r = await payments.click_prepare(_click_signed({**base, "action": "0"}))
    failed = {**base, "action": "1", "merchant_prepare_id": str(r["merchant_prepare_id"]), "error": "-5017", "error_note": "Insufficient funds"}
    reply, paid = await payments.click_complete(_click_signed(failed, True))
    assert reply["error"] == -9 and paid is None and await billing.balance(1) == 0
    assert (await payments.click_complete(_click_signed({**failed, "error": "0"}, True)))[0]["error"] == -9  # cancelled stays cancelled
    assert (await payments.click_prepare(_click_signed({**base, "action": "0", "click_trans_id": "779"})))["error"] == -9
    oid2 = await payments.create_order(1, 50000, "click")
    r = await payments.click_prepare(_click_signed({**_click_base(oid2, "780"), "action": "0", "error": "-1"}))
    assert r["error"] == -9  # Click's error at Prepare: cancelled too


async def test_click_money_taken_twice_for_one_order_is_credited_twice(click):
    """Two Click payment pages for one order, both Prepared before either completed: Click takes the money twice and a
    Complete after a withdrawal may not be an error (except -4 / -9 for that same payment), so both are credited."""
    await add_user(1)
    oid = await payments.create_order(1, 50000, "click")
    a, b = _click_base(oid, "801"), _click_base(oid, "802")
    ra = await payments.click_prepare(_click_signed({**a, "action": "0"}))
    rb = await payments.click_prepare(_click_signed({**b, "action": "0"}))
    for base, r in ((a, ra), (b, rb)):
        reply, paid = await payments.click_complete(_click_signed({**base, "action": "1", "merchant_prepare_id": str(r["merchant_prepare_id"])}, True))
        assert reply["error"] == 0 and paid
    assert await billing.balance(1) == 100000 and not await billing.reconcile()


async def test_payme_refuses_a_second_payment_for_one_order_and_expires_old_ones(payme):
    from app.core import db
    await add_user(1)
    oid = await payments.create_order(1, 30000, "payme")
    acc = {settings.payme_account_field: str(oid)}
    now = int(time.time() * 1000)
    assert (await payme("CreateTransaction", {"id": "a", "time": now, "amount": 3000000, "account": acc}))[0]["result"]["state"] == 1
    r, _ = await payme("CreateTransaction", {"id": "b", "time": now, "amount": 3000000, "account": acc})
    assert r["error"]["code"] == -31099                       # this order already waits for transaction "a"
    await db.pool().execute("UPDATE payme_txns SET create_time = create_time - $1 WHERE id = 'a'", payments.PAYME_TIMEOUT_MS + 1000)
    r, _ = await payme("PerformTransaction", {"id": "a"})
    assert r["error"]["code"] == -31008                       # older than 12 h: cancelled, cannot be performed
    r, _ = await payme("CheckTransaction", {"id": "a"})
    assert r["result"]["state"] == -1 and r["result"]["reason"] == 4
    assert await billing.balance(1) == 0

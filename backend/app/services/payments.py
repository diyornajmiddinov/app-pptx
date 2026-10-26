"""
Balance top-up through payment links (no Telegram invoice): the bot sends a Payme or Click link,
the user pays on the provider's page, the provider calls our server, and the balance is credited.

  1. bot: amount + provider chosen -> create_order() -> payme_link() / click_link()
  2. Payme Merchant API (JSON-RPC)  POST /api/pay/payme          -> payme_rpc()
     Click SHOP API                 POST /api/pay/click/prepare  -> click_prepare()
                                    POST /api/pay/click/complete -> click_complete()
  3. money is credited exactly once (ledger ref "payme:<id>" / "click:<id>"), then the bot tells the user.

Card transfer (manual): the bot shows the card number and a payment ID (T-000123) bound to the order;
the user sends a screenshot, it goes to the admins with the ID, an admin confirms -> card_decide() credits.

Set the callback URLs in the provider cabinets: PUBLIC_URL + the paths above.
Amounts: orders are in so'm; Payme works in tiyin (x100), Click in so'm.
"""
import base64
import hashlib
import hmac
import re
import time
from urllib.parse import urlencode

from app.core import db
from app.core.config import settings
from app.services import billing

PAYME_TIMEOUT_MS = 12 * 3600 * 1000  # Payme: an unperformed transaction expires after 12 hours


def now_ms() -> int:
    return int(time.time() * 1000)


async def create_order(user_id: int, amount: int, provider: str) -> int:
    return await db.pool().fetchval("INSERT INTO orders (user_id, amount, provider, created) VALUES ($1, $2, $3, $4) RETURNING id",
                                    user_id, amount, provider, int(time.time()))


async def _order(con, order_id) -> dict | None:
    """The order, locked until the transaction ends (parallel callbacks for one order wait in turn)."""
    try:
        oid = int(order_id)
    except (TypeError, ValueError):
        return None
    row = await con.fetchrow("SELECT id, user_id, amount, provider, state FROM orders WHERE id = $1 FOR UPDATE", oid)
    return dict(row) if row else None


def providers() -> list[str]:
    """Providers whose merchant settings are filled in, in the order shown to the user."""
    out = []
    if settings.payme_merchant_id and settings.payme_key:
        out.append("payme")
    if settings.click_service_id and settings.click_merchant_id and settings.click_secret_key:
        out.append("click")
    if settings.card_number and settings.admin_ids:  # someone has to check the screenshots
        out.append("card")
    return out


# ---------- links ----------

def payme_link(order_id: int, amount: int) -> str:
    params = f"m={settings.payme_merchant_id};ac.{settings.payme_account_field}={order_id};a={amount * 100}"
    if settings.return_url:
        params += f";c={settings.return_url}"
    host = "https://test.paycom.uz" if settings.payme_test else "https://checkout.paycom.uz"
    return f"{host}/{base64.b64encode(params.encode()).decode()}"


def click_link(order_id: int, amount: int) -> str:
    q = {"service_id": settings.click_service_id, "merchant_id": settings.click_merchant_id,
         "amount": amount, "transaction_param": order_id}
    if settings.return_url:
        q["return_url"] = settings.return_url
    return "https://my.click.uz/services/pay?" + urlencode(q)


# ---------- card transfer: screenshot + admin confirmation ----------

def payment_code(order_id: int) -> str:
    """The ID the user sees and the admin checks: T-000123."""
    return f"T-{order_id:06d}"


def parse_code(text: str) -> int | None:
    m = re.search(r"\bT-?(\d{1,9})\b", text or "", re.IGNORECASE)
    return int(m.group(1)) if m else None


async def card_submit(user_id: int, file_id: str, kind: str, caption: str = "") -> dict | None:
    """Attach a screenshot to the user's card order: the one whose ID is in the caption, else the latest open one.
    Returns the order (now waiting for review), or None if the user has no open card order."""
    async with db.transaction() as con:
        oid = parse_code(caption)
        q = "SELECT id FROM orders WHERE user_id = $1 AND provider = 'card' AND state IN ('new', 'review')"
        row = (await con.fetchval(q + " AND id = $2", user_id, oid) if oid else None) \
            or await con.fetchval(q + " ORDER BY id DESC LIMIT 1", user_id)
        if not row:
            return None
        await con.execute("UPDATE orders SET state = 'review', screenshot = $1, screenshot_kind = $2 WHERE id = $3", file_id, kind, row)
        return await _order(con, row)


async def card_decide(order_id: int, approve: bool, admin_id: int) -> tuple[str, dict | None, int | None]:
    """Admin's decision. Returns (outcome, order, new balance): outcome is 'paid', 'rejected', 'done' (already
    decided, maybe by another admin) or 'missing'. The money is credited once (ledger ref card:<id>)."""
    async with db.transaction() as con:
        order = await _order(con, order_id)
        if not order or order["provider"] != "card":
            return "missing", None, None
        if order["state"] != "review":
            return "done", order, None
        if not approve:
            await con.execute("UPDATE orders SET state = 'rejected', reviewed_by = $1 WHERE id = $2", admin_id, order_id)
            return "rejected", order, None
        await con.execute("UPDATE orders SET state = 'paid', reviewed_by = $1 WHERE id = $2", admin_id, order_id)
        new = await billing.apply_in(con, order["user_id"], order["amount"], "topup:card", f"card:{order_id}", True)
        return "paid", order, new


# ---------- Payme Merchant API (JSON-RPC 2.0) ----------

class PaymeError(Exception):
    def __init__(self, code: int, uz: str, ru: str, en: str, data: str | None = None):
        super().__init__(en)
        self.code, self.message, self.data = code, {"uz": uz, "ru": ru, "en": en}, data


def _err_no_order():
    return PaymeError(-31050, "Buyurtma topilmadi", "Заказ не найден", "Order not found", settings.payme_account_field)


def _err_no_txn():
    return PaymeError(-31003, "Tranzaksiya topilmadi", "Транзакция не найдена", "Transaction not found")


def _err_state():
    return PaymeError(-31008, "Amalni bajarib bo'lmaydi", "Невозможно выполнить операцию", "Unable to perform operation")


def payme_authorized(auth_header: str | None) -> bool:
    """Payme sends 'Basic base64(Paycom:<key>)'. Compared in constant time."""
    if not settings.payme_key or not auth_header or not auth_header.startswith("Basic "):
        return False
    try:
        login, _, key = base64.b64decode(auth_header[6:]).decode().partition(":")
    except Exception:
        return False
    return login == "Paycom" and hmac.compare_digest(key, settings.payme_key)


async def _check_order(con, params) -> dict:
    order = await _order(con, (params.get("account") or {}).get(settings.payme_account_field))
    if not order or order["provider"] != "payme":
        raise _err_no_order()
    if order["state"] != "new":
        raise PaymeError(-31051, "Buyurtma to'langan yoki bekor qilingan", "Заказ уже оплачен или отменён",
                         "Order already paid or cancelled", settings.payme_account_field)
    if params.get("amount") != order["amount"] * 100:
        raise PaymeError(-31001, "Noto'g'ri summa", "Неверная сумма", "Incorrect amount")
    return order


async def _txn(con, txn_id) -> dict | None:
    row = await con.fetchrow("SELECT id, order_id, amount, state, reason, paycom_time, create_time, perform_time, cancel_time "
                             "FROM payme_txns WHERE id = $1 FOR UPDATE", str(txn_id))
    return dict(row) if row else None


async def _cancel_expired(con, txn: dict) -> dict:
    """An unperformed transaction older than 12 h is cancelled with reason 4 (timeout)."""
    if txn["state"] == 1 and now_ms() - txn["create_time"] > PAYME_TIMEOUT_MS:
        t = now_ms()
        await con.execute("UPDATE payme_txns SET state = -1, reason = 4, cancel_time = $1 WHERE id = $2", t, txn["id"])
        txn = {**txn, "state": -1, "reason": 4, "cancel_time": t}
    return txn


async def _payme_method(method: str, params: dict) -> tuple[dict, dict | None]:
    """Returns (result, paid) where paid = {"user_id", "amount", "balance"} when money was just credited."""
    order: dict | None
    if params.get("id") is not None:  # expire first in its own transaction, so it is saved even if we answer with an error
        async with db.transaction() as con:
            txn = await _txn(con, params["id"])
            if txn:
                await _cancel_expired(con, txn)
    async with db.transaction() as con:
        if method == "CheckPerformTransaction":
            await _check_order(con, params)
            return {"allow": True}, None

        if method == "CreateTransaction":
            txn = await _txn(con, params.get("id"))
            if txn:
                txn = await _cancel_expired(con, txn)
                if txn["state"] != 1:
                    raise _err_state()
                return {"create_time": txn["create_time"], "transaction": txn["id"], "state": 1}, None
            order = await _check_order(con, params)
            if await con.fetchval("SELECT 1 FROM payme_txns WHERE order_id = $1 AND state = 1", order["id"]):
                raise PaymeError(-31099, "Buyurtma uchun to'lov kutilmoqda", "Заказ ожидает оплаты",
                                 "Order is awaiting payment", settings.payme_account_field)
            t = now_ms()
            await con.execute("INSERT INTO payme_txns (id, order_id, amount, state, paycom_time, create_time) VALUES ($1, $2, $3, 1, $4, $5)",
                              str(params["id"]), order["id"], int(params["amount"]), int(params.get("time") or t), t)
            return {"create_time": t, "transaction": str(params["id"]), "state": 1}, None

        if method == "PerformTransaction":
            txn = await _txn(con, params.get("id"))
            if not txn:
                raise _err_no_txn()
            txn = await _cancel_expired(con, txn)
            if txn["state"] == 2:
                return {"transaction": txn["id"], "perform_time": txn["perform_time"], "state": 2}, None
            if txn["state"] != 1:
                raise _err_state()
            order = await _order(con, txn["order_id"])
            if order is None:  # the order row is gone: nothing to credit or take back
                raise _err_no_order()
            t = now_ms()
            await con.execute("UPDATE payme_txns SET state = 2, perform_time = $1 WHERE id = $2", t, txn["id"])
            await con.execute("UPDATE orders SET state = 'paid' WHERE id = $1", order["id"])
            new = await billing.apply_in(con, order["user_id"], order["amount"], "topup:payme", f"payme:{txn['id']}", True)
            paid = {"user_id": order["user_id"], "amount": order["amount"], "balance": new} if new is not None else None
            return {"transaction": txn["id"], "perform_time": t, "state": 2}, paid

        if method == "CancelTransaction":
            txn = await _txn(con, params.get("id"))
            if not txn:
                raise _err_no_txn()
            if txn["state"] in (-1, -2):
                return {"transaction": txn["id"], "cancel_time": txn["cancel_time"], "state": txn["state"]}, None
            t, reason = now_ms(), params.get("reason")
            order = await _order(con, txn["order_id"])
            if order is None:  # the order row is gone: nothing to credit or take back
                raise _err_no_order()
            if txn["state"] == 2:  # refund after payment: take the money back if it has not been spent yet
                if await billing.apply_in(con, order["user_id"], -order["amount"], "refund:payme", f"payme-cancel:{txn['id']}", False) is None:
                    raise PaymeError(-31007, "Mablag' ishlatilgan, bekor qilib bo'lmaydi",
                                     "Средства уже использованы, отмена невозможна", "Funds already used, cannot cancel")
                state = -2
            else:
                state = -1
            await con.execute("UPDATE payme_txns SET state = $1, reason = $2, cancel_time = $3 WHERE id = $4", state, reason, t, txn["id"])
            await con.execute("UPDATE orders SET state = 'cancelled' WHERE id = $1", order["id"])
            return {"transaction": txn["id"], "cancel_time": t, "state": state}, None

        if method == "CheckTransaction":
            txn = await _txn(con, params.get("id"))
            if not txn:
                raise _err_no_txn()
            txn = await _cancel_expired(con, txn)
            return {"create_time": txn["create_time"], "perform_time": txn["perform_time"], "cancel_time": txn["cancel_time"],
                    "transaction": txn["id"], "state": txn["state"], "reason": txn["reason"]}, None

        if method == "GetStatement":
            rows = await con.fetch("SELECT t.id, t.paycom_time, t.amount, t.order_id, t.create_time, t.perform_time, t.cancel_time, "
                                   "t.state, t.reason FROM payme_txns t WHERE t.paycom_time BETWEEN $1 AND $2 ORDER BY t.paycom_time",
                                   int(params.get("from", 0)), int(params.get("to", 0)))
            return {"transactions": [{"id": r[0], "time": r[1], "amount": r[2], "account": {settings.payme_account_field: str(r[3])},
                                      "create_time": r[4], "perform_time": r[5], "cancel_time": r[6], "transaction": r[0],
                                      "state": r[7], "reason": r[8]} for r in rows]}, None

    raise PaymeError(-32601, "Metod topilmadi", "Метод не найден", "Method not found", method)


async def payme_rpc(body: dict, auth_header: str | None) -> tuple[dict, dict | None]:
    """One JSON-RPC call from Payme -> (response body, paid info or None). Payme always gets HTTP 200."""
    rid = body.get("id") if isinstance(body, dict) else None
    if not payme_authorized(auth_header):
        e = PaymeError(-32504, "Ruxsat yo'q", "Недостаточно привилегий", "Insufficient privileges")
        return {"jsonrpc": "2.0", "id": rid, "error": {"code": e.code, "message": e.message}}, None
    try:
        result, paid = await _payme_method(body.get("method", ""), body.get("params") or {})
        return {"jsonrpc": "2.0", "id": rid, "result": result}, paid
    except PaymeError as e:
        err = {"code": e.code, "message": e.message, **({"data": e.data} if e.data else {})}
        return {"jsonrpc": "2.0", "id": rid, "error": err}, None
    except (KeyError, TypeError, ValueError, AttributeError):
        return {"jsonrpc": "2.0", "id": rid, "error": {"code": -32600, "message": {
            "uz": "So'rov noto'g'ri", "ru": "Неверный запрос", "en": "Invalid request"}}}, None


# ---------- Click SHOP API (Prepare / Complete) ----------

def _click_sign_ok(f: dict, with_prepare_id: bool) -> bool:
    parts = [f.get("click_trans_id", ""), f.get("service_id", ""), settings.click_secret_key, f.get("merchant_trans_id", "")]
    if with_prepare_id:
        parts.append(f.get("merchant_prepare_id", ""))
    parts += [f.get("amount", ""), f.get("action", ""), f.get("sign_time", "")]
    expected = hashlib.md5("".join(parts).encode()).hexdigest()
    return bool(settings.click_secret_key) and hmac.compare_digest(expected, f.get("sign_string", ""))


def _click_amount_ok(f: dict, order: dict) -> bool:
    try:
        return abs(float(f.get("amount", "")) - order["amount"]) < 0.01
    except ValueError:
        return False


def _click_reply(f: dict, error: int, note: str, **extra) -> dict:
    return {"click_trans_id": f.get("click_trans_id"), "merchant_trans_id": f.get("merchant_trans_id"),
            "error": error, "error_note": note, **extra}


async def click_prepare(f: dict) -> dict:
    if not _click_sign_ok(f, with_prepare_id=False):
        return _click_reply(f, -1, "SIGN CHECK FAILED")
    if f.get("action") != "0":
        return _click_reply(f, -3, "Action not found")
    async with db.transaction() as con:
        order = await _order(con, f.get("merchant_trans_id"))
        if not order or order["provider"] != "click":
            return _click_reply(f, -5, "Order does not exist")
        if order["state"] == "paid":
            return _click_reply(f, -4, "Already paid")
        if order["state"] != "new":
            return _click_reply(f, -9, "Transaction cancelled")
        if not _click_amount_ok(f, order):
            return _click_reply(f, -2, "Incorrect parameter amount")
        try:
            ctid = int(f.get("click_trans_id", ""))
        except ValueError:
            return _click_reply(f, -8, "Error in request from click")
        prepare_id = await con.fetchval("SELECT id FROM click_txns WHERE click_trans_id = $1", ctid) \
            or await con.fetchval("INSERT INTO click_txns (click_trans_id, order_id, amount, state, created) "
                                  "VALUES ($1, $2, $3, 'prepared', $4) RETURNING id", ctid, order["id"], order["amount"], int(time.time()))
    return _click_reply(f, 0, "Success", merchant_prepare_id=prepare_id)


async def click_complete(f: dict) -> tuple[dict, dict | None]:
    if not _click_sign_ok(f, with_prepare_id=True):
        return _click_reply(f, -1, "SIGN CHECK FAILED"), None
    if f.get("action") != "1":
        return _click_reply(f, -3, "Action not found"), None
    async with db.transaction() as con:
        try:
            prepare_id, ctid = int(f.get("merchant_prepare_id", "")), int(f.get("click_trans_id", ""))
        except ValueError:
            return _click_reply(f, -8, "Error in request from click"), None
        row = await con.fetchrow("SELECT id, order_id, state FROM click_txns WHERE id = $1 AND click_trans_id = $2 FOR UPDATE", prepare_id, ctid)
        if not row:
            return _click_reply(f, -6, "Transaction does not exist"), None
        order = await _order(con, row[1])
        if not order or str(order["id"]) != str(f.get("merchant_trans_id")):
            return _click_reply(f, -5, "Order does not exist"), None
        if row[2] == "paid":
            return _click_reply(f, -4, "Already paid", merchant_confirm_id=prepare_id), None
        if row[2] == "cancelled" or order["state"] == "cancelled":
            return _click_reply(f, -9, "Transaction cancelled"), None
        if not _click_amount_ok(f, order):
            return _click_reply(f, -2, "Incorrect parameter amount"), None
        if f.get("error", "0") not in ("0", ""):  # Click reports that the payment failed on its side
            await con.execute("UPDATE click_txns SET state = 'cancelled' WHERE id = $1", prepare_id)
            await con.execute("UPDATE orders SET state = 'cancelled' WHERE id = $1 AND state = 'new'", order["id"])
            return _click_reply(f, -9, "Transaction cancelled"), None
        if order["state"] == "paid":  # the same order paid through another Click transaction
            return _click_reply(f, -4, "Already paid"), None
        await con.execute("UPDATE click_txns SET state = 'paid' WHERE id = $1", prepare_id)
        await con.execute("UPDATE orders SET state = 'paid' WHERE id = $1", order["id"])
        new = await billing.apply_in(con, order["user_id"], order["amount"], "topup:click", f"click:{ctid}", True)
        paid = {"user_id": order["user_id"], "amount": order["amount"], "balance": new} if new is not None else None
    return _click_reply(f, 0, "Success", merchant_confirm_id=prepare_id), paid

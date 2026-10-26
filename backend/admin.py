"""
Admin panel API (/api/admin/...). The panel is admin.html, opened in a desktop browser with a signed link
from the bot's /admin command (ADMIN_IDS only); every request carries it in X-Admin-Token (telegram_auth.admin_user).

  GET  /me, /stats                          who is signed in; dashboard numbers and 30-day series
  GET  /users, /users/{id}                  list (search, sort, pages); one user with ledger, decks, orders
  POST /users/{id}/balance, /users/{id}/message
  GET  /orders, /orders/{id}/screenshot     top-up orders; the card receipt image (proxied from Telegram)
  POST /orders/{id}/decide                  approve / reject a card transfer (same rules as the bot's buttons)
  GET  /ledger, /decks, /decks/{id}/download
  GET/POST /broadcasts                      message to all users (or one language), sent in the background
  GET/PUT /settings                         prices and top-up amounts (appconfig), payment providers, system
  GET  /log                                 what the admins did
Every change is written to admin_log.
"""
import asyncio
import json
import logging
import os
import shutil
import tempfile
import time
import uuid
from pathlib import Path
from typing import Literal

import httpx
from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Query
from fastapi.responses import FileResponse, Response
from pydantic import BaseModel, Field
from starlette.concurrency import run_in_threadpool

import appconfig
import billing
import bot
import content_ai
import db
import payments
from config import settings
from prefs import lang_of
from telegram_api import download_file, send_message
from telegram_auth import admin_user
from texts import som, t

log = logging.getLogger("admin")
router = APIRouter(prefix="/api/admin")
TZ = "Asia/Tashkent"
STARTED = time.time()
DATA = Path(__file__).resolve().parent / "data"
TEMPLATE_NAMES = {t_["id"]: t_["name"] for t_ in json.loads((content_ai.PRO_DIR / "templates.json").read_text(encoding="utf-8"))}
PAID_KINDS = "kind LIKE 'topup:%'"  # real money in (admin corrections are not revenue)


async def audit(admin_id: int, action: str, target=None, **details):
    await db.pool().execute("INSERT INTO admin_log (admin_id, action, target, details) VALUES ($1, $2, $3, $4)",
                            admin_id, action, None if target is None else str(target), details or None)


def page_args(page: int, size: int) -> tuple[int, int]:
    size = max(1, min(size, 200))
    return size, (max(page, 1) - 1) * size


def rows(records) -> list[dict]:
    return [dict(r) for r in records]


# ---------------------------------------------------------------- who / dashboard

@router.get("/me")
async def me(uid: int = Depends(admin_user)):
    u = await db.pool().fetchrow("SELECT first_name, last_name, username FROM users WHERE id = $1", uid)
    name = " ".join(x for x in ((u or {}).get("first_name"), (u or {}).get("last_name")) if x) if u else ""
    return {"id": uid, "name": name or str(uid), "username": u["username"] if u else None}


@router.get("/stats")
async def stats(uid: int = Depends(admin_user), days: int = Query(30, ge=7, le=180)):
    p = db.pool()
    today = f"(now() AT TIME ZONE '{TZ}')::date"
    local = lambda col: f"({col} AT TIME ZONE '{TZ}')::date"
    epoch = lambda col: f"(to_timestamp({col}) AT TIME ZONE '{TZ}')::date"
    k = await p.fetchrow(f"""SELECT
        (SELECT count(*) FROM users) users,
        (SELECT count(*) FROM users WHERE {local('created')} = {today}) users_today,
        (SELECT count(*) FROM users WHERE {local('created')} > {today} - 7) users_7d,
        (SELECT count(*) FROM users WHERE last_seen > now() - interval '1 day') active_1d,
        (SELECT count(*) FROM users WHERE last_seen > now() - interval '7 days') active_7d,
        (SELECT count(*) FROM decks) decks,
        (SELECT count(*) FROM decks WHERE {epoch('created')} = {today}) decks_today,
        (SELECT count(*) FROM decks WHERE {epoch('created')} > {today} - 30) decks_30d,
        (SELECT coalesce(sum(delta), 0) FROM ledger WHERE {PAID_KINDS}) revenue,
        (SELECT coalesce(sum(delta), 0) FROM ledger WHERE {PAID_KINDS} AND {epoch('created')} = {today}) revenue_today,
        (SELECT coalesce(sum(delta), 0) FROM ledger WHERE {PAID_KINDS} AND {epoch('created')} > {today} - 30) revenue_30d,
        (SELECT coalesce(-sum(delta), 0) FROM ledger WHERE kind IN ('generate', 'restyle')) spent,
        (SELECT coalesce(sum(delta), 0) FROM ledger WHERE kind LIKE 'refund:%' AND delta > 0) refunded,
        (SELECT count(*) FROM ledger WHERE kind = 'generate') generations,
        (SELECT count(*) FROM ledger WHERE kind = 'restyle') restyles,
        (SELECT count(*) FROM ledger WHERE kind = 'refund:generate') failed_generations,
        (SELECT coalesce(sum(amount), 0) FROM balances) balances,
        (SELECT count(*) FROM orders WHERE provider = 'card' AND state = 'review') pending,
        (SELECT coalesce(sum(total_tokens), 0) FROM ai_usage) ai_tokens,
        (SELECT coalesce(sum(total_tokens), 0) FROM ai_usage WHERE {local('created')} = {today}) ai_tokens_today,
        (SELECT coalesce(sum(total_tokens), 0) FROM ai_usage WHERE {local('created')} > {today} - 30) ai_tokens_30d,
        (SELECT count(*) FROM ai_usage WHERE {local('created')} > {today} - 30) ai_requests_30d,
        (SELECT count(*) FROM ai_usage WHERE status <> 'ok' AND {local('created')} > {today} - 30) ai_errors_30d,
        (SELECT coalesce(round(avg(t)), 0) FROM (SELECT sum(total_tokens) t FROM ai_usage
            WHERE purpose = 'generate' AND job IS NOT NULL GROUP BY job) x) ai_tokens_per_deck""")
    series = await p.fetch(f"""
        WITH d AS (SELECT generate_series({today} - $1::int + 1, {today}, interval '1 day')::date AS day)
        SELECT d.day,
          (SELECT count(*) FROM users u WHERE {local('u.created')} = d.day) AS users,
          (SELECT count(*) FROM decks x WHERE {epoch('x.created')} = d.day) AS decks,
          (SELECT coalesce(sum(delta), 0) FROM ledger l WHERE l.{PAID_KINDS} AND {epoch('l.created')} = d.day) AS revenue,
          (SELECT coalesce(sum(total_tokens), 0) FROM ai_usage a WHERE {local('a.created')} = d.day) AS ai_tokens
        FROM d ORDER BY d.day""", days)
    tpl = await p.fetch("SELECT (request->>'template_id')::int AS id, count(*) AS n FROM decks GROUP BY 1 ORDER BY 2 DESC, 1 LIMIT 10")
    langs = await p.fetch("SELECT coalesce(lang, '—') AS lang, count(*) AS n FROM users GROUP BY 1 ORDER BY 2 DESC")
    recent = await p.fetch("""SELECT l.id, l.user_id, l.delta, l.kind, l.created, u.first_name, u.username
                              FROM ledger l LEFT JOIN users u ON u.id = l.user_id ORDER BY l.id DESC LIMIT 8""")
    return {"kpi": dict(k), "series": [{**dict(r), "day": r["day"].isoformat()} for r in series],
            "templates": [{"id": r["id"], "name": TEMPLATE_NAMES.get(r["id"], str(r["id"])), "n": r["n"]} for r in tpl],
            "langs": rows(langs), "recent": rows(recent)}


# ---------------------------------------------------------------- users

USER_SORT = {"created": "u.created", "last_seen": "u.last_seen", "balance": "balance", "decks": "decks", "paid": "paid", "id": "u.id"}
USER_COLS = """u.id, u.first_name, u.last_name, u.username, u.lang, u.language_code, u.created, u.last_seen,
    coalesce(b.amount, 0) AS balance,
    (SELECT count(*) FROM decks d WHERE d.user_id = u.id) AS decks,
    (SELECT coalesce(sum(delta), 0) FROM ledger l WHERE l.user_id = u.id AND l.""" + PAID_KINDS + """) AS paid"""
USER_WHERE = """($1 = '' OR u.id::text = $1 OR u.username ILIKE '%' || $1 || '%'
    OR (coalesce(u.first_name, '') || ' ' || coalesce(u.last_name, '')) ILIKE '%' || $1 || '%')"""


@router.get("/users")
async def users(uid: int = Depends(admin_user), q: str = "", sort: str = "created", desc: bool = True,
                page: int = 1, size: int = 25):
    q = q.strip().lstrip("@")
    lim, off = page_args(page, size)
    order = f"{USER_SORT.get(sort, 'u.created')} {'DESC' if desc else 'ASC'} NULLS LAST, u.id DESC"
    p = db.pool()
    total = await p.fetchval(f"SELECT count(*) FROM users u WHERE {USER_WHERE}", q)
    items = await p.fetch(f"SELECT {USER_COLS} FROM users u LEFT JOIN balances b ON b.user_id = u.id "
                          f"WHERE {USER_WHERE} ORDER BY {order} LIMIT $2 OFFSET $3", q, lim, off)
    return {"total": total, "items": rows(items)}


@router.get("/users/{user_id}")
async def user(user_id: int, uid: int = Depends(admin_user)):
    p = db.pool()
    u = await p.fetchrow(f"SELECT {USER_COLS} FROM users u LEFT JOIN balances b ON b.user_id = u.id WHERE u.id = $1", user_id)
    if not u:
        raise HTTPException(404, "Foydalanuvchi topilmadi")
    totals = await p.fetchrow("""SELECT
        coalesce(-sum(delta) FILTER (WHERE kind IN ('generate', 'restyle')), 0) AS spent,
        coalesce(sum(delta) FILTER (WHERE kind LIKE 'refund:%' AND delta > 0), 0) AS refunded,
        coalesce(sum(delta) FILTER (WHERE kind = 'admin'), 0) AS admin,
        count(*) FILTER (WHERE kind = 'generate') AS generations, count(*) FILTER (WHERE kind = 'restyle') AS restyles
        FROM ledger WHERE user_id = $1""", user_id)
    ledger = await p.fetch("SELECT id, delta, kind, ref, created FROM ledger WHERE user_id = $1 ORDER BY id DESC LIMIT 200", user_id)
    decks = await p.fetch("""SELECT id, content->'meta'->>'topic' AS topic, (request->>'template_id')::int AS template_id,
                             jsonb_array_length(content->'slides') AS slides, request->>'language' AS language, created
                             FROM decks WHERE user_id = $1 ORDER BY created DESC LIMIT 200""", user_id)
    orders = await p.fetch("SELECT id, amount, provider, state, created, reviewed_by FROM orders WHERE user_id = $1 ORDER BY id DESC LIMIT 100", user_id)
    return {"user": dict(u), "totals": dict(totals), "ledger": rows(ledger),
            "decks": [{**dict(d), "template": TEMPLATE_NAMES.get(d["template_id"], "")} for d in decks], "orders": rows(orders)}


class BalanceChange(BaseModel):
    amount: int = Field(ne=0, ge=-10_000_000, le=10_000_000)
    note: str = Field("", max_length=200)
    notify: bool = False


@router.post("/users/{user_id}/balance")
async def change_balance(user_id: int, req: BalanceChange, uid: int = Depends(admin_user)):
    if not await db.pool().fetchval("SELECT 1 FROM users WHERE id = $1", user_id):
        raise HTTPException(404, "Foydalanuvchi topilmadi")
    async with db.transaction() as con:
        new = await billing.apply_in(con, user_id, req.amount, "admin", f"panel:{uuid.uuid4().hex}", allow_negative=False)
    if new is None:
        raise HTTPException(422, "Balans manfiy bo'lib qoladi")
    await audit(uid, "balance", user_id, amount=req.amount, note=req.note, balance=new)
    if req.notify and req.amount > 0:
        lang = await lang_of(user_id)
        try:
            await send_message(user_id, t(lang, "paid", amount=som(req.amount, lang), balance=som(new, lang)), bot.open_keyboard(lang))
        except httpx.HTTPError:
            pass  # the balance is changed either way
    return {"balance": new}


class Message(BaseModel):
    text: str = Field(min_length=1, max_length=4000)


def _tg_error(e: httpx.HTTPError) -> str:
    try:
        return e.response.json().get("description", str(e))  # e.g. "Forbidden: bot was blocked by the user"
    except Exception:
        return str(e)


@router.post("/users/{user_id}/message")
async def message_user(user_id: int, req: Message, uid: int = Depends(admin_user)):
    try:
        await send_message(user_id, req.text)
    except httpx.HTTPError as e:
        raise HTTPException(400, f"Telegram: {_tg_error(e)}")
    await audit(uid, "message", user_id, text=req.text[:200])
    return {"ok": True}


# ---------------------------------------------------------------- orders / payments

@router.get("/orders")
async def orders(uid: int = Depends(admin_user), state: str = "", provider: str = "", page: int = 1, size: int = 25):
    lim, off = page_args(page, size)
    where = "($1 = '' OR o.state = $1) AND ($2 = '' OR o.provider = $2)"
    p = db.pool()
    total = await p.fetchval(f"SELECT count(*) FROM orders o WHERE {where}", state, provider)
    items = await p.fetch(f"""SELECT o.id, o.user_id, o.amount, o.provider, o.state, o.created, o.reviewed_by,
                              o.screenshot IS NOT NULL AS has_screenshot, u.first_name, u.last_name, u.username
                              FROM orders o LEFT JOIN users u ON u.id = o.user_id WHERE {where}
                              ORDER BY (o.state = 'review') DESC, o.id DESC LIMIT $3 OFFSET $4""", state, provider, lim, off)
    return {"total": total, "items": [{**dict(r), "code": payments.payment_code(r["id"])} for r in items]}


def _image_type(data: bytes) -> str:
    if data[:3] == b"\xff\xd8\xff":
        return "image/jpeg"
    if data[:8] == b"\x89PNG\r\n\x1a\n":
        return "image/png"
    if data[:4] == b"RIFF" and data[8:12] == b"WEBP":
        return "image/webp"
    return "application/octet-stream"


@router.get("/orders/{order_id}/screenshot")
async def screenshot(order_id: int, uid: int = Depends(admin_user)):
    file_id = await db.pool().fetchval("SELECT screenshot FROM orders WHERE id = $1", order_id)
    if not file_id:
        raise HTTPException(404, "Skrinshot yo'q")
    try:
        data = await download_file(file_id)
    except (httpx.HTTPError, ValueError) as e:
        raise HTTPException(502, f"Telegram: {e}")
    return Response(data, media_type=_image_type(data), headers={"Cache-Control": "private, max-age=3600"})


class Decision(BaseModel):
    approve: bool


@router.post("/orders/{order_id}/decide")
async def decide(order_id: int, req: Decision, uid: int = Depends(admin_user)):
    outcome, order, new = await payments.card_decide(order_id, req.approve, uid)
    if outcome == "missing":
        raise HTTPException(404, "Buyurtma topilmadi")
    if outcome == "done":
        raise HTTPException(409, "Bu buyurtma allaqachon ko'rib chiqilgan")
    await audit(uid, "card_" + outcome, order_id, amount=order["amount"], user=order["user_id"])
    try:  # the user hears about it exactly as with the bot's buttons
        if outcome == "paid":
            await bot.notify_paid({"user_id": order["user_id"], "amount": order["amount"], "balance": new})
        else:
            lang = await lang_of(order["user_id"])
            await send_message(order["user_id"], t(lang, "card_rejected", code=payments.payment_code(order_id)))
    except httpx.HTTPError:
        log.warning("could not notify user %s about order %s", order["user_id"], order_id)
    return {"outcome": outcome, "balance": new}


# ---------------------------------------------------------------- ledger / decks

@router.get("/ledger")
async def ledger(uid: int = Depends(admin_user), kind: str = "", user_id: int | None = None, page: int = 1, size: int = 50):
    lim, off = page_args(page, size)
    where = "($1 = '' OR l.kind = $1 OR l.kind LIKE $1 || ':%') AND ($2::bigint IS NULL OR l.user_id = $2)"
    p = db.pool()
    total = await p.fetchval(f"SELECT count(*) FROM ledger l WHERE {where}", kind, user_id)
    items = await p.fetch(f"""SELECT l.id, l.user_id, l.delta, l.kind, l.ref, l.created, u.first_name, u.username
                              FROM ledger l LEFT JOIN users u ON u.id = l.user_id WHERE {where}
                              ORDER BY l.id DESC LIMIT $3 OFFSET $4""", kind, user_id, lim, off)
    kinds = await p.fetch("SELECT kind, count(*) AS n, sum(delta) AS total FROM ledger GROUP BY kind ORDER BY kind")
    return {"total": total, "items": rows(items), "kinds": rows(kinds)}


@router.get("/decks")
async def decks_list(uid: int = Depends(admin_user), q: str = "", template_id: int | None = None, page: int = 1, size: int = 25):
    lim, off = page_args(page, size)
    where = "($1 = '' OR d.content->'meta'->>'topic' ILIKE '%' || $1 || '%' OR d.user_id::text = $1) AND ($2::int IS NULL OR (d.request->>'template_id')::int = $2)"
    p = db.pool()
    total = await p.fetchval(f"SELECT count(*) FROM decks d WHERE {where}", q.strip(), template_id)
    items = await p.fetch(f"""SELECT d.id, d.user_id, d.content->'meta'->>'topic' AS topic, (d.request->>'template_id')::int AS template_id,
                              jsonb_array_length(d.content->'slides') AS slides, d.request->>'language' AS language,
                              d.created, d.updated, u.first_name, u.username
                              FROM decks d LEFT JOIN users u ON u.id = d.user_id WHERE {where}
                              ORDER BY d.created DESC LIMIT $3 OFFSET $4""", q.strip(), template_id, lim, off)
    return {"total": total, "items": [{**dict(r), "template": TEMPLATE_NAMES.get(r["template_id"], "")} for r in items],
            "templates": [{"id": k, "name": v} for k, v in sorted(TEMPLATE_NAMES.items())]}


@router.get("/decks/{deck_id}/download")
async def deck_download(deck_id: str, background: BackgroundTasks, uid: int = Depends(admin_user)):
    d = await db.pool().fetchrow("SELECT content, request FROM decks WHERE id = $1", deck_id)
    if not d:
        raise HTTPException(404, "Taqdimot topilmadi")
    tmp = tempfile.mkdtemp()
    background.add_task(shutil.rmtree, tmp, True)
    path = await run_in_threadpool(content_ai.render, d["content"], d["request"]["template_id"], Path(tmp) / "deck.pptx")
    name = "".join(ch if ch.isalnum() or ch in " -_" else "_" for ch in d["content"]["meta"].get("topic", "deck"))[:60].strip() or "deck"
    return FileResponse(path, filename=f"{name}.pptx",
                        media_type="application/vnd.openxmlformats-officedocument.presentationml.presentation")


# ---------------------------------------------------------------- broadcasts

class BroadcastReq(BaseModel):
    text: str = Field(min_length=1, max_length=4000)
    lang: Literal["uz", "ru", "en"] | None = None
    test: bool = False  # only to the admin who sends it


_running: set[asyncio.Task] = set()


async def _broadcast(bid: int, text: str, lang: str | None):
    p = db.pool()
    ids = [r["id"] for r in await p.fetch("SELECT id FROM users WHERE $1::text IS NULL OR lang = $1 ORDER BY id", lang)]
    await p.execute("UPDATE broadcasts SET total = $2 WHERE id = $1", bid, len(ids))
    sent = failed = 0
    for i, user_id in enumerate(ids, 1):
        for attempt in range(3):
            try:
                await send_message(user_id, text); sent += 1; break
            except httpx.HTTPStatusError as e:
                wait = ((e.response.json() or {}).get("parameters") or {}).get("retry_after") if e.response.status_code == 429 else None
                if wait and attempt < 2:
                    await asyncio.sleep(wait + 1); continue
                failed += 1; break  # blocked the bot, deleted account, ...
            except httpx.HTTPError:
                failed += 1; break
        if i % 20 == 0 or i == len(ids):
            await p.execute("UPDATE broadcasts SET sent = $2, failed = $3 WHERE id = $1", bid, sent, failed)
        await asyncio.sleep(0.05)  # ~20 messages a second, under Telegram's limit
    await p.execute("UPDATE broadcasts SET state = 'done', sent = $2, failed = $3, finished = now() WHERE id = $1", bid, sent, failed)


@router.post("/broadcasts")
async def broadcast(req: BroadcastReq, uid: int = Depends(admin_user)):
    if req.test:
        try:
            await send_message(uid, req.text)
        except httpx.HTTPError as e:
            raise HTTPException(400, f"Telegram: {_tg_error(e)}")
        return {"ok": True, "test": True}
    if await db.pool().fetchval("SELECT 1 FROM broadcasts WHERE state = 'running'"):
        raise HTTPException(409, "Boshqa xabar yuborilmoqda, tugashini kuting")
    bid = await db.pool().fetchval("INSERT INTO broadcasts (text, lang, created_by) VALUES ($1, $2, $3) RETURNING id", req.text, req.lang, uid)
    await audit(uid, "broadcast", bid, lang=req.lang, text=req.text[:200])
    task = asyncio.create_task(_broadcast(bid, req.text, req.lang))
    _running.add(task); task.add_done_callback(_running.discard)
    return {"id": bid}


@router.get("/broadcasts")
async def broadcasts(uid: int = Depends(admin_user)):
    items = await db.pool().fetch("SELECT * FROM broadcasts ORDER BY id DESC LIMIT 50")
    audience = await db.pool().fetch("SELECT coalesce(lang, '—') AS lang, count(*) AS n FROM users GROUP BY 1")
    return {"items": rows(items), "audience": {r["lang"]: r["n"] for r in audience}}


async def mark_interrupted():
    """At startup: a broadcast that was running when the server stopped will not continue by itself."""
    await db.pool().execute("UPDATE broadcasts SET state = 'interrupted', finished = now() WHERE state = 'running'")


# ---------------------------------------------------------------- settings / system / log

class SettingsReq(BaseModel):
    price_generate: int = Field(ge=0, le=10_000_000)
    price_restyle: int = Field(ge=0, le=10_000_000)
    topup_amounts: list[int] = Field(min_length=1, max_length=8)


def _dir_size(path: Path) -> int:
    total = 0
    for root, _, files in os.walk(path):
        for f in files:
            try:
                total += os.path.getsize(os.path.join(root, f))
            except OSError:
                pass
    return total


@router.get("/settings")
async def get_settings(uid: int = Depends(admin_user)):
    p = db.pool()
    disk = shutil.disk_usage(DATA)
    counts = await p.fetchrow("""SELECT (SELECT count(*) FROM users) users, (SELECT count(*) FROM ledger) ledger,
        (SELECT count(*) FROM orders) orders, (SELECT count(*) FROM decks) decks,
        pg_database_size(current_database()) AS db_size, version() AS pg""")
    try:
        mem = dict(line.split(":", 1) for line in Path("/proc/meminfo").read_text().splitlines())
        ram = {"total": int(mem["MemTotal"].split()[0]) * 1024, "available": int(mem["MemAvailable"].split()[0]) * 1024}
    except (OSError, KeyError, ValueError):
        ram = None
    return {
        "values": await appconfig.get(), "defaults": appconfig.defaults(),
        "providers": {"payme": "payme" in payments.providers(), "click": "click" in payments.providers(),
                      "card": "card" in payments.providers(), "payme_test": settings.payme_test},
        "admins": sorted(settings.admin_ids), "webapp_url": settings.webapp_url,
        "ai": {"model": content_ai.GEMINI_MODEL if os.getenv("GEMINI_API_KEY") else "Claude", "photos": "Pexels" if os.getenv("PEXELS_API_KEY") else "Gemini"},
        "system": {"uptime": int(time.time() - STARTED), "disk_total": disk.total, "disk_free": disk.free,
                   "data_size": await run_in_threadpool(_dir_size, DATA), "ram": ram, "load": os.getloadavg(),
                   "db_size": counts["db_size"], "postgres": " ".join(counts["pg"].split()[:2]),
                   "rows": {k: counts[k] for k in ("users", "ledger", "orders", "decks")}},
    }


@router.put("/settings")
async def put_settings(req: SettingsReq, uid: int = Depends(admin_user)):
    amounts = sorted({a for a in req.topup_amounts})
    if any(a < 1000 or a > 10_000_000 for a in amounts):
        raise HTTPException(422, "To'ldirish summalari 1 000 – 10 000 000 so'm oralig'ida bo'lsin")
    old = await appconfig.get()
    new = {"price_generate": req.price_generate, "price_restyle": req.price_restyle, "topup_amounts": amounts}
    await appconfig.set_many(new, uid)
    await audit(uid, "settings", None, before=old, after=new)
    return {"values": await appconfig.get()}


@router.get("/log")
async def admin_log(uid: int = Depends(admin_user), page: int = 1, size: int = 50):
    lim, off = page_args(page, size)
    p = db.pool()
    total = await p.fetchval("SELECT count(*) FROM admin_log")
    items = await p.fetch("""SELECT a.id, a.admin_id, a.action, a.target, a.details, a.created, u.first_name, u.username
                             FROM admin_log a LEFT JOIN users u ON u.id = a.admin_id ORDER BY a.id DESC LIMIT $1 OFFSET $2""", lim, off)
    return {"total": total, "items": rows(items)}

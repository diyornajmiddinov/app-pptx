"""
Paid work queue: a new deck ('generate'), a redraw in another template ('restyle'), a referat ('paper', website).

The API charges the user and enqueue()s; the worker (python -m app.worker) claim()s jobs one at a time per free
slot (WORKER_CONCURRENCY), draws them and sends the file. A job is a row in `jobs`, so nothing is lost when a
process restarts: at start the worker recover()s the jobs that were running when it stopped — tried again once,
then failed and refunded. A failed job always gives the money back and tells the user.
"""
import asyncio
import json
import logging
import re
import shutil
import tempfile
from pathlib import Path

from app.core import db
from app.core.config import ENGINE_DIR, settings
from app.core.telegram import send_document, send_message
from app.services import app_settings, billing, decks, papers
from app.services.ai import models, pipeline
from app.services.ai.render import render
from app.services.users import lang_of
from app.texts import esc, som, t

log = logging.getLogger("jobs")
TMP = Path(tempfile.gettempdir())
MAX_ATTEMPTS = 2  # a job interrupted by a restart is run once more, then refunded
JOB_TIMEOUT = 600  # s: AI + photos + drawing; longer than this (e.g. Gemini busy for minutes) -> refunded
MAX_ACTIVE = 3     # a user's jobs queued or running at once: one person cannot fill the queue for everybody


class LowBalance(Exception):
    pass


class TooMany(Exception):
    """The user already has MAX_ACTIVE jobs waiting."""


# ---------------------------------------------------------------- queue

async def enqueue(kind: str, user_id: int, payload: dict, price: int) -> tuple[int, int]:
    """Add a paid job. Returns (job id, how many jobs are ahead of it); the worker is woken at once."""
    async with db.transaction() as con:
        return await _enqueue_in(con, kind, user_id, payload, price)


async def _enqueue_in(con, kind: str, user_id: int, payload: dict, price: int) -> tuple[int, int]:
    job_id = await con.fetchval("INSERT INTO jobs (kind, user_id, payload, price) VALUES ($1, $2, $3, $4) RETURNING id",
                                kind, user_id, payload, price)
    ahead = await con.fetchval("SELECT count(*) FROM jobs WHERE state IN ('queued', 'running') AND id < $1", job_id)
    await con.execute("SELECT pg_notify('jobs', $1)", str(job_id))  # sent when the transaction commits
    return job_id, ahead


# ---------------------------------------------------------------- a new deck: the first one may be free

_HAS_DECK = """SELECT EXISTS (SELECT 1 FROM jobs WHERE user_id = $1 AND kind = 'generate' AND state <> 'failed')
                   OR EXISTS (SELECT 1 FROM decks WHERE user_id = $1)"""


def _price(cfg: dict, has_deck: bool) -> int:
    first = cfg["first_generate_price"]
    return first if first is not None and first < cfg["price_generate"] and not has_deck else cfg["price_generate"]


async def generate_price(user_id: int) -> int:
    """What a new deck costs this user now (to show): first_generate_price (app_settings, the admin panel) for the
    first deck ever — bot, Mini App or site; a first deck that failed does not count."""
    return _price(await app_settings.get(), await db.pool().fetchval(_HAS_DECK, user_id))


async def order(kind: str, user_id: int, payload: dict, price: int | None = None) -> tuple[int, int, int]:
    """Charge and queue paid work in one transaction, under the user's balance lock: a refused order takes no money,
    and two requests at the same moment cannot both get the first-deck price. price=None: a new deck at this user's
    price (generate_price). Returns (job id, jobs ahead, price). Raises LowBalance or TooMany."""
    cfg = await app_settings.get() if price is None else None
    async with db.transaction() as con:
        await billing.lock_in(con, user_id)
        if await con.fetchval("SELECT count(*) FROM jobs WHERE user_id = $1 AND state IN ('queued', 'running')", user_id) >= MAX_ACTIVE:
            raise TooMany
        if cfg is not None:
            price = _price(cfg, await con.fetchval(_HAS_DECK, user_id))
        assert price is not None
        if await billing.apply_in(con, user_id, -price, kind, None, False) is None:
            raise LowBalance
        job_id, ahead = await _enqueue_in(con, kind, user_id, payload, price)
    return job_id, ahead, price


async def claim() -> dict | None:
    """Take the oldest queued job (SKIP LOCKED: two workers never take the same one)."""
    row = await db.pool().fetchrow(
        """UPDATE jobs SET state = 'running', started = now(), attempts = attempts + 1
           WHERE id = (SELECT id FROM jobs WHERE state = 'queued' ORDER BY id FOR UPDATE SKIP LOCKED LIMIT 1)
           RETURNING *""")
    return dict(row) if row else None


async def recover():
    """At worker start: jobs still 'running' were cut off by a restart. Queue them again, or give up and refund."""
    rows = await db.pool().fetch("SELECT * FROM jobs WHERE state = 'running' ORDER BY id")
    for job in map(dict, rows):
        if job["attempts"] < MAX_ATTEMPTS:
            await db.pool().execute("UPDATE jobs SET state = 'queued' WHERE id = $1 AND state = 'running'", job["id"])
            log.info("job %s re-queued after a restart", job["id"])
        else:
            await fail(job, "Server qayta ishga tushgani uchun ish ikki marta to'xtadi")


async def counts() -> dict:
    row = await db.pool().fetchrow("SELECT count(*) FILTER (WHERE state = 'queued') AS queued, "
                                   "count(*) FILTER (WHERE state = 'running') AS running FROM jobs")
    return dict(row)


# ---------------------------------------------------------------- running a job

def _drop_tmp(path: Path):
    """Remove a job's own temp folder (/tmp/slideai-*) once its file has been sent."""
    if path.parent == TMP and path.name.startswith("slideai-"):
        shutil.rmtree(path, ignore_errors=True)


def demo_content(topic: str, meta: dict) -> dict:
    content = json.loads((ENGINE_DIR / "content" / "soliq.json").read_text(encoding="utf-8"))
    content["meta"] = {"topic": topic, **meta}
    for s in content["slides"]:
        if isinstance(s.get("image"), str) and not s["image"].startswith("/"):
            s["image"] = str(ENGINE_DIR / s["image"])
    return content


async def build(req: dict, deck_id: str, user_id: int) -> tuple[Path, dict]:
    """New deck: AI text, photos, drawing."""
    models.usage_context.set({"user_id": user_id, "purpose": "generate", "job": deck_id})
    meta = {k: req.get(k, "") for k in ("author", "org", "loc", "year")}
    if settings.demo:  # offline demo: ready content instead of AI + Pexels
        content = demo_content(req["topic"], meta)
        path = await render(content, req["template_id"], pipeline.workdir() / "demo.pptx")
    else:
        path, content = await pipeline.build_presentation(req["topic"], req["template_id"], req["slide_count"], req.get("language", "uz"), meta=meta,
                                                          outline=req.get("outline"), notes=bool(req.get("notes")), source=req.get("source", ""))
    await asyncio.to_thread(decks.keep_images, user_id, deck_id, content)
    return path, content


async def redraw(content: dict, template_id: int, user_id: int, deck_id: str) -> tuple[Path, dict]:
    """The same deck in another template (one short AI call adapts the tone)."""
    models.usage_context.set({"user_id": user_id, "purpose": "restyle", "job": deck_id})
    if settings.demo:
        return await render(content, template_id, pipeline.workdir() / "demo.pptx"), content
    return await pipeline.switch_template(content, template_id)


async def deliver(chat_id: int, path: Path, topic: str, note: str, ext: str = ".pptx"):  # note is already localized
    name = re.sub(r"[^\w\-]+", "_", topic)[:60] + ext
    final = Path(path).with_name(name); Path(path).rename(final)
    try:
        await send_document(chat_id, str(final), caption=f"<b>{esc(topic)}</b>\n{note}")
    finally:
        _drop_tmp(final.parent)


async def run(job: dict):
    """Do one claimed job. Any failure ends in fail(): refund + message."""
    try:
        if job["kind"] == "generate":
            req, deck_id = job["payload"], decks.new_id()
            path, content = await asyncio.wait_for(build(req, deck_id, job["user_id"]), JOB_TIMEOUT)
            await decks.save(job["user_id"], content, req, deck_id)
            await deliver(job["user_id"], path, req["topic"], t(await lang_of(job["user_id"]), "slides", n=len(content["slides"])))
        elif job["kind"] == "restyle":
            p = job["payload"]
            deck = await decks.load(job["user_id"], p["deck_id"])
            if not deck:
                raise LookupError(f"taqdimot {p['deck_id']} topilmadi")
            path, content = await asyncio.wait_for(redraw(deck["content"], p["template_id"], job["user_id"], p["deck_id"]), JOB_TIMEOUT)
            await decks.save(job["user_id"], content, {**deck["request"], "template_id": p["template_id"]}, p["deck_id"])
            await deliver(job["user_id"], path, content["meta"]["topic"], t(await lang_of(job["user_id"]), "new_template"))
        elif job["kind"] == "paper":
            req = job["payload"]
            _, path, pages = await asyncio.wait_for(papers.make(job["user_id"], req), JOB_TIMEOUT)
            copy = Path(tempfile.mkdtemp(prefix="slideai-")) / "paper.docx"  # the kept file stays; the copy is renamed and sent
            shutil.copy(path, copy)
            lang = await lang_of(job["user_id"])
            await deliver(job["user_id"], copy, req["topic"], t(lang, "paper_ready", pages=pages or "—"), ".docx")
            if (pdf := path.with_suffix(".pdf")).exists():  # the PDF too: to print or send as it is
                copy = Path(tempfile.mkdtemp(prefix="slideai-")) / "paper.pdf"
                shutil.copy(pdf, copy)
                await deliver(job["user_id"], copy, req["topic"], "PDF", ".pdf")
        else:
            raise ValueError(f"unknown job kind {job['kind']}")
    except TimeoutError:  # wait_for cancelled the work (node is killed): nothing is sent
        log.error("Ish %s daqiqada tugamadi · ish %s · foydalanuvchi %s", JOB_TIMEOUT // 60, job["id"], job["user_id"])
        await fail(job, f"timeout {JOB_TIMEOUT}s")
        return
    except Exception as e:
        what = {"generate": "Taqdimot yaratilmadi", "paper": "Referat yozilmadi"}.get(job["kind"], "Shablon almashtirilmadi")
        log.exception("%s · ish %s · foydalanuvchi %s · %s", what, job["id"], job["user_id"],
                      json.dumps(job["payload"], ensure_ascii=False)[:200])
        await fail(job, f"{type(e).__name__}: {e}"[:500])
        return
    await db.pool().execute("UPDATE jobs SET state = 'done', finished = now() WHERE id = $1", job["id"])


async def fail(job: dict, error: str):
    """Mark failed, give the money back, tell the user. Only the first call for a job refunds."""
    done = await db.pool().fetchval("UPDATE jobs SET state = 'failed', error = $2, finished = now() "
                                    "WHERE id = $1 AND state <> 'failed' RETURNING id", job["id"], error)
    if not done:
        return
    await billing.refund(job["user_id"], job["price"], job["kind"])
    lang = await lang_of(job["user_id"])
    try:
        await send_message(job["user_id"], t(lang, {"generate": "err_gen", "paper": "err_paper"}.get(job["kind"], "err_restyle")))
        await send_message(job["user_id"], t(lang, "refunded", amount=som(job["price"], lang)))
    except Exception:  # blocked the bot: the refund stands anyway
        log.warning("could not tell user %s about failed job %s", job["user_id"], job["id"])


async def run_pending():
    """Run every queued job now, one by one (tests and manual runs; the worker does this in parallel)."""
    while job := await claim():
        await run(job)


# ---------------------------------------------------------------- AI usage rows (ai.models.on_usage)

async def save_usage(rec: dict):
    await db.pool().execute(
        """INSERT INTO ai_usage (user_id, purpose, job, model, op, status, ms, prompt_tokens, output_tokens, thinking_tokens, total_tokens)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)""",
        rec.get("user_id"), rec.get("purpose"), rec.get("job"), rec["model"], rec["op"], rec["status"], rec["ms"],
        rec["prompt_tokens"], rec["output_tokens"], rec["thinking_tokens"], rec["total_tokens"])

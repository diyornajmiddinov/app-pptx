"""The paid-work queue: nothing lost on a restart, money back on failure, a job taken by one worker only."""
import asyncio

from conftest import add_user

from app.core import db
from app.services import billing, decks, jobs

REQ = {"user_id": 1, "template_id": 3, "slide_count": 8, "language": "uz", "topic": "Mavzu"}


async def paid_job(price=5000):
    await billing.charge(1, price, "generate")
    return (await jobs.enqueue("generate", 1, REQ, price))[0]


async def test_jobs_ahead_are_counted():
    await add_user(1, balance=20000)
    ids = [await paid_job() for _ in range(3)]
    assert (await jobs.enqueue("generate", 1, REQ, 0))[1] == 3
    assert ids == sorted(ids)


async def test_parallel_claims_never_take_the_same_job():
    await add_user(1, balance=50000)
    for _ in range(5):
        await paid_job()
    claimed = await asyncio.gather(*(jobs.claim() for _ in range(8)))
    ids = [j["id"] for j in claimed if j]
    assert len(ids) == 5 == len(set(ids))


async def test_restart_requeues_once_then_refunds(tg):
    await add_user(1, balance=5000)
    jid = await paid_job()
    await jobs.claim()                       # the worker took it ... and died
    await jobs.recover()
    assert await db.pool().fetchval("SELECT state FROM jobs WHERE id = $1", jid) == "queued"
    await jobs.claim()                       # second try ... died again
    await jobs.recover()
    assert await db.pool().fetchval("SELECT state FROM jobs WHERE id = $1", jid) == "failed"
    assert await billing.balance(1) == 5000  # money back
    assert any("qaytarildi" in text for text in tg.texts())


async def test_failure_refunds_exactly_once(tg, monkeypatch):
    await add_user(1, balance=5000)
    await paid_job()
    monkeypatch.setattr(jobs, "build", lambda *a: (_ for _ in ()).throw(RuntimeError("AI band")))
    await jobs.run_pending()
    job = dict(await db.pool().fetchrow("SELECT * FROM jobs"))
    await jobs.fail(job, "again")            # a second report of the same failure
    assert await billing.balance(1) == 5000
    assert await db.pool().fetchval("SELECT count(*) FROM ledger WHERE kind = 'refund:generate'") == 1


async def test_restyle_redraws_the_same_deck(tg, monkeypatch, tmp_path):
    await add_user(1, balance=5000)
    content = {"meta": {"topic": "T"}, "slides": [{"type": "cover"}]}
    did = await decks.save(1, content, {"template_id": 3}, "55")
    def fake_redraw(c, template_id, user_id, deck_id):
        p = tmp_path / "x.pptx"; p.write_bytes(b"x"); return p, c
    monkeypatch.setattr(jobs, "redraw", fake_redraw)
    await jobs.enqueue("restyle", 1, {"deck_id": did, "template_id": 9}, 2000)
    await jobs.run_pending()
    assert (await decks.load(1, did))["request"]["template_id"] == 9
    assert tg.sent("sendDocument")
    assert await db.pool().fetchval("SELECT state FROM jobs") == "done"


async def test_migrations_are_recorded():
    rows = await db.pool().fetch("SELECT version FROM schema_migrations ORDER BY version")
    assert [r["version"] for r in rows][:2] == ["0001_initial", "0002_jobs"]
    async with db.pool().acquire() as con:
        assert await db.migrate(con) == []  # nothing left to apply

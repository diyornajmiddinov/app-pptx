"""
Referat / mustaqil ish (website): written by the worker (jobs kind 'paper'), kept as files the user downloads.

papers table (0006)                        id, user_id, topic, request, content, pages, has_pdf
data/<user_id>/papers/<id>.docx, .pdf      the files as delivered (made once: the page numbers come from a layout)
"""
import asyncio
import shutil
import tempfile
from pathlib import Path

from app.core import db
from app.core.config import DATA_DIR, settings
from app.services import paper_docx
from app.services.ai import models
from app.services.ai import paper as paper_ai

DATA = DATA_DIR


def folder(user_id: int) -> Path:
    return DATA / str(user_id) / "papers"


def file(user_id: int, paper_id: int, ext: str) -> Path:
    return folder(user_id) / f"{paper_id}.{ext}"


def fmt_of(req: dict) -> dict:
    return {**paper_docx.DEFAULT_FORMAT, **(req.get("format") or {})}


def demo_content(req: dict) -> dict:
    """Offline demo (SLIDEAI_DEMO=1): placeholder text of the right shape, no AI."""
    n_ch, n_sec = paper_ai.shape(req["pages"])
    para = ("Ushbu bo‘limda mavzuning asosiy jihatlari ko‘rib chiqiladi va ularning amaliy ahamiyati tahlil qilinadi [1]. " * 6).strip()
    return {"meta": {"topic": req["topic"], "language": req.get("language", "uz"), "doc_type": req.get("doc_type", "referat"),
                     **{k: req.get(k, "") for k in ("ministry", "university", "faculty", "department", "subject", "student",
                                                    "group", "teacher", "city", "year")}},
            "intro": [f"**{p}** {para}" for p in paper_ai.INTRO_PARTS[req.get("language", "uz")]],
            "chapters": [{"title": f"Mavzuning {i + 1}-jihati", "sections": [{"title": f"{i + 1}-bobning {j + 1}-masalasi",
                                                                              "paragraphs": [para] * 4} for j in range(n_sec)]}
                         for i in range(n_ch)],
            "conclusion": [para, para], "references": [f"Muallif {n}. Kitob. – Toshkent, 2024. – 200 b." for n in range(1, 11)]}


async def make(user_id: int, req: dict) -> tuple[int, Path, int | None]:
    """Write the text, lay out the files, store them. Returns (paper id, the .docx, pages)."""
    models.usage_context.set({"user_id": user_id, "purpose": "paper", "job": None})
    fmt = fmt_of(req)
    content = demo_content(req) if settings.demo else await paper_ai.write(req, fmt)
    tmp = Path(tempfile.mkdtemp(prefix="slideai-paper-"))
    try:
        docx, pdf, pages = await asyncio.to_thread(paper_docx.build, content, fmt, tmp)
        paper_id = await db.pool().fetchval(
            "INSERT INTO papers (user_id, topic, request, content, pages, has_pdf) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
            user_id, req["topic"], req, content, pages, pdf is not None)
        folder(user_id).mkdir(parents=True, exist_ok=True)
        shutil.move(str(docx), file(user_id, paper_id, "docx"))
        if pdf:
            shutil.move(str(pdf), file(user_id, paper_id, "pdf"))
    finally:
        shutil.rmtree(tmp, ignore_errors=True)
    return paper_id, file(user_id, paper_id, "docx"), pages


async def list_all(user_id: int) -> list[dict]:
    rows = await db.pool().fetch(
        """SELECT id, topic, pages, has_pdf, request->>'language' AS language, coalesce(request->>'doc_type', 'referat') AS doc_type,
                  extract(epoch FROM created)::bigint AS created
           FROM papers WHERE user_id = $1 ORDER BY id DESC""", user_id)
    return [dict(r) for r in rows]


async def load(user_id: int, paper_id: int) -> dict | None:
    row = await db.pool().fetchrow("SELECT id, topic, pages, has_pdf FROM papers WHERE id = $1 AND user_id = $2", paper_id, user_id)
    return dict(row) if row else None


async def delete(user_id: int, paper_id: int) -> bool:
    if not await db.pool().fetchval("DELETE FROM papers WHERE id = $1 AND user_id = $2 RETURNING 1", paper_id, user_id):
        return False
    for ext in ("docx", "pdf"):
        file(user_id, paper_id, ext).unlink(missing_ok=True)
    return True

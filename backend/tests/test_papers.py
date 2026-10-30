"""Referat / mustaqil ish: the AI text (plan, budgets, retries), the Word layout and its MUNDARIJA page numbers, the website."""
import json
import re
import shutil
import zipfile

import pytest
from test_web import U, client, named, sign_in  # noqa: F401  (client is a fixture)

from app.core import db
from app.services import billing, jobs, paper_docx, papers
from app.services.ai import models
from app.services.ai import paper as paper_ai

FMT = paper_docx.DEFAULT_FORMAT
ORDER = {"topic": "Inflyatsiya va uning ta'siri", "subject": "Iqtisodiyot", "language": "uz", "pages": 12,
         "university": "TDIU", "student": "Aliyev Vali", "teacher": "dots. Karimov A.", "city": "Toshkent", "year": "2026"}


def text(words: int) -> list[str]:
    """`words` words in paragraphs of 100, each citing [1]."""
    out, left = [], words
    while left > 0:
        n = min(100, left)
        out.append(" ".join(["so'z"] * (n - 1)) + " [1].")
        left -= n
    return out if len(out) > 1 else [*out, "Qo'shimcha xatboshi [2]."]


class FakeAI:
    """Answers each kind of prompt the way the model should; `short` makes the first chapter answer too short once."""
    def __init__(self, short=False):
        self.prompts, self.short = [], short

    async def __call__(self, messages):
        p = messages[0]["content"]
        self.prompts.append(messages)
        refs = [f"Muallif {i}. Kitob. – Toshkent, 2020. – 200 b." for i in range(1, 13)]
        if "rejasini tuz" in p:
            n_ch, n_sec = map(int, re.search(r"aynan (\d) ta bob, har birida aynan (\d) ta", p).groups())
            return json.dumps({"chapters": [{"title": f"Bob {i}", "sections": [f"Masala {i}.{j}" for j in range(n_sec)]} for i in range(n_ch)],
                               "references": refs})
        if "adabiyotlar ro'yxatini tuz" in p:
            return json.dumps({"references": refs})
        if "-BOBni yoz" in p:
            want = [int(w) for w in re.findall(r"taxminan (\d+) so'z", p)]
            if self.short and len(messages) == 1:
                return json.dumps({"sections": [{"paragraphs": text(20)} for _ in want]})
            return json.dumps({"sections": [{"paragraphs": text(w)} for w in want]})
        want = int(re.search(r"taxminan (\d+) so'z", p).group(1))
        return json.dumps({"paragraphs": text(want)})


# ---------------------------------------------------------------- the text

def test_shape_and_budget_follow_the_pages():
    assert paper_ai.shape(10) == (2, 2) and paper_ai.shape(15) == (2, 3) and paper_ai.shape(25) == (3, 3)
    chapters = [{"title": "a", "sections": ["x", "y", "z"]}] * 2
    b15, b25 = paper_ai.budget(15, FMT, chapters), paper_ai.budget(25, FMT, chapters)
    assert b25["sections"][0][0] > b15["sections"][0][0] > 200
    small = paper_ai.budget(15, {**FMT, "font_size": 12, "spacing": 1.0}, chapters)
    assert small["intro"] > b15["intro"] * 1.8  # smaller type, single spacing: much more text per page


def test_uzbek_apostrophes_are_made_consistent():
    assert paper_ai.polish("O'zbekiston ta'sir g'oya bo`yicha", "uz") == "O‘zbekiston ta’sir g‘oya bo‘yicha"
    assert paper_ai.polish({"a": ["Ma'rifat"]}, "uz") == {"a": ["Ma’rifat"]}
    assert paper_ai.polish("l'économie", "ru") == "l'économie"


async def test_write_plans_then_writes_every_part():
    ai = FakeAI()
    c = await paper_ai.write(ORDER, FMT, ask=ai)
    assert [len(ch["sections"]) for ch in c["chapters"]] == [2, 2]  # 12 pages: 2 chapters x 2
    assert c["intro"] and c["conclusion"] and len(c["references"]) == 12
    assert c["meta"]["student"] == "Aliyev Vali" and c["meta"]["language"] == "uz"
    assert len(ai.prompts) == 1 + 1 + 2 + 1  # plan, introduction, two chapters, conclusion
    assert "**Mavzuning dolzarbligi.**" in next(m[0]["content"] for m in ai.prompts if "KIRISH qismini" in m[0]["content"])


async def test_a_too_short_chapter_is_asked_again():
    ai = FakeAI(short=True)
    c = await paper_ai.write(ORDER, FMT, ask=ai)
    retried = [m for m in ai.prompts if len(m) > 1]
    assert retried and "kengaytir" in retried[0][-1]["content"]
    assert sum(len(p.split()) for p in c["chapters"][0]["sections"][0]["paragraphs"]) > 100


async def test_an_approved_plan_is_kept_and_bad_references_are_caught():
    outline = [{"title": "Mening bobim", "sections": ["Bir", "Ikki", "Uch"]}, {"title": "Ikkinchi", "sections": ["A", "B"]}]
    ai = FakeAI()
    c = await paper_ai.write({**ORDER, "outline": outline}, FMT, ask=ai)
    assert [ch["title"] for ch in c["chapters"]] == ["Mening bobim", "Ikkinchi"]
    assert [s["title"] for s in c["chapters"][0]["sections"]] == ["Bir", "Ikki", "Uch"]
    _, errors = paper_ai._check_paragraphs({"paragraphs": [*text(300)[:-1], "Manba [40]."]}, 300, 12)
    assert any("[40]" in e for e in errors)


# ---------------------------------------------------------------- the Word file

def sample_content(language="uz"):
    para = " ".join(["Inflyatsiya iqtisodiyotga ta’sir qiladi."] * 30)
    return {"meta": {"topic": "Inflyatsiya", "language": language, "doc_type": "referat", "university": "TDIU", "city": "Toshkent", "year": "2026"},
            "intro": ["**Mavzuning dolzarbligi.** " + para, para],
            "chapters": [{"title": f"Bob {i}", "sections": [{"title": f"Masala {i}.{j}", "paragraphs": [para] * 5} for j in range(2)]} for i in range(2)],
            "conclusion": [para, "Xulosa qilib aytganda, " + para],
            "references": ["Muallif A. Kitob. – Toshkent, 2020. – 200 b."] * 10}


def xml(docx) -> str:
    with zipfile.ZipFile(docx) as z:
        return z.read("word/document.xml").decode()


def test_the_layout_follows_the_usual_requirements(tmp_path):
    path = paper_docx.write(sample_content(), FMT, tmp_path / "r.docx")
    from docx import Document
    d = Document(str(path))
    normal = d.styles["Normal"]
    assert normal.font.name == "Times New Roman" and normal.font.size.pt == 14
    assert normal.paragraph_format.line_spacing == 1.5 and round(normal.paragraph_format.first_line_indent.cm, 2) == 1.25
    main = d.sections[1]
    assert round(main.left_margin.mm) == 30 and round(main.right_margin.mm) == 15 and round(main.top_margin.mm) == 20
    assert "Toshkent – 2026" in d.sections[0].footer.paragraphs[0].text  # the title page: city and year, no number
    body = xml(path)
    with zipfile.ZipFile(path) as z:
        assert any(" PAGE " in z.read(n).decode() for n in z.namelist() if "footer" in n)
    assert 'TOC \\o "1-2"' in body and "I BOB. BOB 0" in body and "1.1. Masala 0.0" in body
    assert "FOYDALANILGAN ADABIYOTLAR RO‘YXATI" in body and "<w:b/>" in body  # **bold** intro labels


def test_heading_pages_are_read_from_the_layout():
    items = [(1, "KIRISH"), (1, "I BOB. NAZARIYA"), (2, "1.1. Tushuncha"), (1, "XULOSA")]
    pages = ["titul", "MUNDARIJA KIRISH 3 XULOSA 6", "KIRISH matn", "I BOB. NAZARIYA 1.1. Tushuncha",
             "matn ... Xulosa qilib aytganda ...", "matn", "XULOSA matn"]
    assert paper_docx.find_pages(items, pages) == {0: 3, 1: 4, 2: 4, 3: 7}  # not page 5: the word in the text


@pytest.mark.skipif(not shutil.which("soffice"), reason="LibreOffice is not installed")
def test_real_layout_puts_true_page_numbers_into_the_mundarija(tmp_path):
    _docx, pdf, pages = paper_docx.build(sample_content(), FMT, tmp_path)
    assert pdf and pdf.exists() and pages >= 6
    layout = paper_docx.pdf_pages(pdf)
    numbers = paper_docx.find_pages(paper_docx.headings(sample_content()), layout)
    conclusion = len(numbers) - 2
    assert re.search(r"XULOSA[ .]*(\d+)", layout[1]).group(1) == str(numbers[conclusion])  # the MUNDARIJA shows the real page
    assert layout[numbers[conclusion] - 1].lstrip().startswith("XULOSA")
    assert numbers[0] == 3  # KIRISH right after the title page and the MUNDARIJA


def test_without_libreoffice_the_docx_still_comes(tmp_path, monkeypatch):
    def fail(*a, **k):
        raise OSError("no soffice")
    monkeypatch.setattr(paper_docx, "to_pdf", fail)
    docx, pdf, pages = paper_docx.build(sample_content("ru"), FMT, tmp_path)
    assert docx.exists() and pdf is None and pages is None
    with zipfile.ZipFile(docx) as z:
        assert "updateFields" in z.read("word/settings.xml").decode()  # Word fills the numbers on opening
    assert "ВВЕДЕНИЕ" in xml(docx) and "ГЛАВА I." in xml(docx)


# ---------------------------------------------------------------- the website

@pytest.fixture
def offline(monkeypatch, tmp_path):
    """Fake model, files in a temp folder, no LibreOffice (fast)."""
    ai = FakeAI()
    monkeypatch.setattr(models, "ai", ai)
    monkeypatch.setattr(paper_ai, "ai", ai)
    monkeypatch.setattr(papers, "DATA", tmp_path)

    def no_office(*a, **k):
        raise OSError("tests")
    monkeypatch.setattr(paper_docx, "to_pdf", no_office)
    return ai


async def test_order_a_paper_download_and_delete(client, tg, offline):  # noqa: F811
    await named(balance=20000)
    await sign_in(client, tg)
    me = (await client.get("/api/web/me")).json()
    assert me["prices"]["paper"] == 7000
    order = {**ORDER, "doc_type": "mustaqil", "format": {"font_size": 12, "spacing": 1.0, "page_numbers": "top_right"}}
    r = await client.post("/api/web/paper", json=order)
    assert r.status_code == 202, r.text
    assert await billing.balance(U) == 13000
    await jobs.run_pending()
    assert tg.sent("sendDocument"), "the .docx goes to the Telegram chat too"
    listed = (await client.get("/api/web/papers")).json()["papers"]
    assert len(listed) == 1 and listed[0]["doc_type"] == "mustaqil" and listed[0]["has_pdf"] is False
    pid = listed[0]["id"]
    r = await client.get(f"/api/web/papers/{pid}/docx")
    assert r.status_code == 200 and r.content[:2] == b"PK"
    assert "MUSTAQIL ISH" in zipfile.ZipFile(__import__("io").BytesIO(r.content)).read("word/document.xml").decode()
    assert (await client.get(f"/api/web/papers/{pid}/pdf")).status_code == 404  # no LibreOffice here: no PDF
    job = await db.pool().fetchrow("SELECT state, kind FROM jobs")
    assert dict(job) == {"state": "done", "kind": "paper"}
    assert (await client.post(f"/api/web/papers/{pid}/delete")).json() == {"ok": True}
    assert (await client.get(f"/api/web/papers/{pid}/docx")).status_code == 404
    assert (await client.get("/api/web/papers")).json()["papers"] == []


async def test_paper_checks_balance_and_input(client, tg, offline):  # noqa: F811
    await named(balance=1000)
    await sign_in(client, tg)
    assert (await client.post("/api/web/paper", json=ORDER)).json()["detail"] == "lowBalance"
    assert (await client.post("/api/web/paper", json={**ORDER, "pages": 100})).status_code == 422
    assert (await client.post("/api/web/paper", json={**ORDER, "format": {"margin_left": 99}})).status_code == 422
    assert await billing.balance(U) == 1000


async def test_failed_paper_is_refunded(client, tg, offline, monkeypatch):  # noqa: F811
    await named(balance=7000)
    await sign_in(client, tg)

    async def broken(messages):
        return "not json"
    monkeypatch.setattr(paper_ai, "ai", broken)
    assert (await client.post("/api/web/paper", json=ORDER)).status_code == 202
    await jobs.run_pending()
    assert await billing.balance(U) == 7000
    assert any("Referat" in t for t in tg.texts())
    assert await db.pool().fetchval("SELECT state FROM jobs") == "failed"


async def test_paper_outline_is_free_and_limited(client, tg, offline, monkeypatch):  # noqa: F811
    await named()
    await sign_in(client, tg)
    r = await client.post("/api/web/paper/outline", json={"topic": "Inflyatsiya", "pages": 20, "language": "ru"})
    assert r.status_code == 200, r.text
    assert [len(c["sections"]) for c in r.json()["chapters"]] == [3, 3]
    assert await billing.balance(U) == 0


async def test_the_chat_gets_word_and_pdf(client, tg, offline, monkeypatch):  # noqa: F811
    def built(content, fmt, out):
        (out / "referat.docx").write_bytes(b"PK-docx"); (out / "referat.pdf").write_bytes(b"%PDF-1.4")
        return out / "referat.docx", out / "referat.pdf", 12
    monkeypatch.setattr(paper_docx, "build", built)
    await named(balance=7000)
    await jobs.order("paper", U, {**ORDER, "user_id": U}, 7000)
    await jobs.run_pending()
    docs = tg.sent("sendDocument")
    assert len(docs) == 2 and "12 bet" in docs[0]["caption"] and docs[1]["caption"].endswith("PDF")

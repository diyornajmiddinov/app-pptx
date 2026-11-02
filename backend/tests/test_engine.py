"""Every template draws the sample deck into a .pptx that opens, with every slide (node + the engine)."""
import json
import shutil

import pytest
from pptx import Presentation

from app.core.config import ENGINE_DIR
from app.services.ai.render import render, render_sync

pytestmark = pytest.mark.slow
SAMPLE = json.loads((ENGINE_DIR / "content" / "soliq.json").read_text(encoding="utf-8"))


@pytest.fixture(scope="module")
def sample():
    if not shutil.which("node") or not (ENGINE_DIR / "node_modules").exists():
        pytest.skip("node / engine dependencies not installed")
    c = json.loads(json.dumps(SAMPLE))
    c["meta"] = {"topic": "Soliq islohotlari", "author": "Test", "org": "TDIU", "loc": "Toshkent", "year": "2026"}
    for s in c["slides"]:
        if isinstance(s.get("image"), str) and not s["image"].startswith("/"):
            s["image"] = str(ENGINE_DIR / s["image"])
    return c


@pytest.mark.parametrize("template_id", range(1, 201))
def test_template_renders(template_id, sample, tmp_path):
    out = render_sync(sample, template_id, tmp_path / "t.pptx")
    prs = Presentation(out)
    assert len(prs.slides) == len(sample["slides"])


async def test_async_render_and_a_broken_deck(sample, tmp_path):
    import subprocess
    out = await render(sample, 7, tmp_path / "a.pptx")
    assert len(Presentation(out).slides) == len(sample["slides"])
    with pytest.raises(subprocess.CalledProcessError) as e:
        await render({"slides": "broken", "meta": {}}, 3, tmp_path / "b.pptx")
    assert "TypeError" in e.value.stderr  # what alerts.why shows to the admins


@pytest.mark.parametrize("template_id", range(1, 21))
def test_animated_copy_renders_with_transitions_and_animations(template_id, sample, tmp_path):
    import re
    import zipfile
    out = render_sync(sample, template_id, tmp_path / "a.pptx", animated=True)
    assert len(Presentation(out).slides) == len(sample["slides"])
    z = zipfile.ZipFile(out)
    slides = [z.read(n).decode() for n in z.namelist() if re.fullmatch(r"ppt/slides/slide\d+\.xml", n)]
    assert all("<p:timing>" in x and ("<p:transition" in x) for x in slides)
    for x in slides:  # every animation points at a shape of its slide; timing node ids are unique
        assert set(re.findall(r'spid="(\d+)"', x)) <= set(re.findall(r'<p:cNvPr id="(\d+)"', x))
        ids = re.findall(r'<p:cTn id="(\d+)"', x)
        assert len(ids) == len(set(ids))


def test_a_template_without_an_animated_copy_is_drawn_still(sample, tmp_path):
    import zipfile
    out = render_sync(sample, 150, tmp_path / "s.pptx", animated=True)
    assert "<p:timing>" not in zipfile.ZipFile(out).read("ppt/slides/slide2.xml").decode()

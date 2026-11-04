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


@pytest.mark.parametrize("template_id", [1, 9, 17, 23, 36, 43, 52, 65, 75, 88, 99, 104, 118, 127, 136, 144, 153, 160, 163, 178, 190, 200])
def test_animated_copy_renders_with_transitions_and_animations(template_id, sample, tmp_path):  # every family, all 200 in the engine check
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


def test_not_animated_is_drawn_still(sample, tmp_path):
    import zipfile
    out = render_sync(sample, 150, tmp_path / "s.pptx")
    assert "<p:timing>" not in zipfile.ZipFile(out).read("ppt/slides/slide2.xml").decode()


@pytest.mark.parametrize(("template_id", "animated"), [(75, False), (165, False), (80, True)])
def test_every_picture_is_named_by_what_it_holds(template_id, animated, sample, tmp_path):  # a JPEG behind a .png name: iPhone won't open the deck
    import zipfile
    z = zipfile.ZipFile(render_sync(sample, template_id, tmp_path / "m.pptx", animated=animated))
    media = [n for n in z.namelist() if n.startswith("ppt/media/") and not n.endswith("/")]
    assert any(z.read(n).startswith(b"\xff\xd8\xff") for n in media)  # these templates do draw JPEG backgrounds
    for n in media:
        head = z.read(n)[:4]
        assert n.endswith((".jpeg", ".jpg")) == head.startswith(b"\xff\xd8\xff"), n
        assert n.endswith(".png") == head.startswith(b"\x89PNG"), n

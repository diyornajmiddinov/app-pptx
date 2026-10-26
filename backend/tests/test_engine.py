"""Every template draws the sample deck into a .pptx that opens, with every slide (node + the engine)."""
import json
import shutil

import pytest
from pptx import Presentation

import content_ai

pytestmark = pytest.mark.slow
SAMPLE = json.loads((content_ai.PRO_DIR / "content" / "soliq.json").read_text(encoding="utf-8"))


@pytest.fixture(scope="module")
def sample():
    if not shutil.which("node") or not (content_ai.PRO_DIR / "node_modules").exists():
        pytest.skip("node / engine dependencies not installed")
    c = json.loads(json.dumps(SAMPLE))
    c["meta"] = {"topic": "Soliq islohotlari", "author": "Test", "org": "TDIU", "loc": "Toshkent", "year": "2026"}
    for s in c["slides"]:
        if isinstance(s.get("image"), str) and not s["image"].startswith("/"):
            s["image"] = str(content_ai.PRO_DIR / s["image"])
    return c


@pytest.mark.parametrize("template_id", range(1, 41))
def test_template_renders(template_id, sample, tmp_path):
    out = content_ai.render(sample, template_id, tmp_path / "t.pptx")
    prs = Presentation(out)
    assert len(prs.slides) == len(sample["slides"])

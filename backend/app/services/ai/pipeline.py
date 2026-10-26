"""One job, start to finish: AI text -> photos -> drawing (new deck), or AI tone change -> drawing (other template)."""
import tempfile
from pathlib import Path

from app.services.ai.catalog import PHOTO_TEMPLATES
from app.services.ai.content import Meta, generate_content, restyle
from app.services.ai.images import Search, resolve_images
from app.services.ai.models import Ask, ai
from app.services.ai.render import render


def workdir() -> Path:
    """A job's own temp folder (/tmp/slideai-*): removed after the file is sent, or by the hourly sweep."""
    return Path(tempfile.mkdtemp(prefix="slideai-"))


async def build_presentation(topic: str, template_id: int, slide_count: int = 10, language: str = "uz", meta: dict | None = None,
                             out_path: Path | None = None, ask: Ask = ai, search: Search | None = None) -> tuple[Path, dict]:
    """Returns (pptx path, content) — the content is kept to switch templates later."""
    content = await generate_content(topic, slide_count, language, template_id, ask=ask)
    content["meta"] = Meta(topic=topic, **(meta or {})).model_dump()
    work = workdir()
    if template_id in PHOTO_TEMPLATES:
        await resolve_images(content, work, search)
    return await render(content, template_id, out_path or work / f"slideai-{template_id}.pptx"), content


async def switch_template(content: dict, template_id: int, out_path: Path | None = None, ask: Ask = ai) -> tuple[Path, dict]:
    """Same presentation in another template: one short AI call adapts tone and length, then it is drawn again."""
    new = await restyle(content, template_id, ask=ask)
    return await render(new, template_id, out_path or workdir() / f"slideai-{template_id}.pptx"), new

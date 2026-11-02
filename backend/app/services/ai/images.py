"""
Slide photos: Pexels when PEXELS_API_KEY is set, otherwise drawn by Gemini's image model.
All photos of a deck are fetched at the same time (at most 4 at once). From Pexels' first results the photo whose
description matches the query best is taken, and never one the deck already has. A query with no result is tried
again shorter; only then does the slide get a neutral sample picture, so one failed search never fails a paid deck.
"""
import asyncio
import base64
import functools
import os
import re
from collections.abc import Awaitable, Callable
from pathlib import Path

from app.core.config import ENGINE_DIR
from app.services.ai import models

Search = Callable[[str, Path], Awaitable[dict]]
UA = {"User-Agent": "SlideAI/1.0 (+https://t.me/slidechibot)"}  # Pexels' CDN refuses clients without one (403)
FALLBACK_IMAGES = sorted((ENGINE_DIR / "demo" / "img").glob("*.jpg"))


CANDIDATES = 15  # Pexels results looked at per query
STOP = {"a", "an", "the", "of", "and", "or", "in", "on", "at", "for", "with", "to", "by", "from", "photo", "image", "picture"}


def _words(text: str) -> set[str]:
    return {w[:5] for w in re.findall(r"[a-z]+", (text or "").lower()) if w not in STOP and len(w) > 2}


def pick(photos: list[dict], query: str, taken: set) -> dict | None:
    """The result whose description (alt) shares most words with the query (Pexels' order breaks ties), skipping
    photos already in the deck; when every result is taken, the first one."""
    want = _words(query)
    fresh = [p for p in photos if p.get("id") not in taken]
    if not fresh:
        return photos[0] if photos else None
    return max(fresh, key=lambda p: (len(want & _words(p.get("alt", ""))), -fresh.index(p)))


async def pexels_search(query: str, dest: Path, taken: set | None = None) -> dict:
    """Download the best-matching landscape Pexels photo for the query. Returns {src, credit, url}.
    taken: ids of the deck's photos so far (the chosen one is added), so two slides never show one picture."""
    taken = set() if taken is None else taken
    async with models.client(60) as c:
        r = await c.get("https://api.pexels.com/v1/search", params={"query": query, "per_page": CANDIDATES, "orientation": "landscape"},
                        headers={"Authorization": os.environ["PEXELS_API_KEY"], **UA})
        r.raise_for_status()
        p = pick(r.json().get("photos") or [], query, taken)
        if p is None:
            raise LookupError(f"Pexels: '{query}' bo'yicha rasm topilmadi")
        taken.add(p.get("id"))  # no await since pick(): parallel searches of one deck cannot take the same photo
        img = await c.get(p["src"]["large2x"], headers=UA)
        img.raise_for_status()
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_bytes(img.content)
    return {"src": str(dest), "credit": f"Photo: {p['photographer']} / Pexels", "url": p["url"]}


async def gemini_image(query: str, dest: Path) -> dict:
    """No stock-photo key: a photo drawn for the query by Gemini. Returns {src, credit}."""
    prompt = (f"A high-quality, realistic, landscape (16:9) photograph for a presentation slide about: {query}. "
              "No text, no letters, no logos, no watermark.")
    data = await models.gemini_call(models.GEMINI_IMAGE_MODEL, {"contents": [{"parts": [{"text": prompt}]}],
                                    "generationConfig": {"responseModalities": ["IMAGE"], "imageConfig": {"aspectRatio": "16:9"}}}, http_timeout=120)
    for part in ((data.get("candidates") or [{}])[0].get("content") or {}).get("parts") or []:
        inline = part.get("inlineData") or part.get("inline_data")
        if inline and inline.get("data"):
            ext = ".png" if "png" in inline.get("mimeType", inline.get("mime_type", "")) else ".jpg"
            dest = dest.with_suffix(ext); dest.parent.mkdir(parents=True, exist_ok=True)
            dest.write_bytes(base64.b64decode(inline["data"]))
            return {"src": str(dest), "credit": "AI image (Gemini)"}
    raise LookupError(f"Gemini: '{query}' uchun rasm yaratilmadi")


def default_search() -> Search:
    return pexels_search if os.getenv("PEXELS_API_KEY") or not os.getenv("GEMINI_API_KEY") else gemini_image


def _shorter(query: str) -> list[str]:
    """The query, then without its last words: 'old samarkand madrasa tiles' -> 'old samarkand madrasa' -> 'old samarkand'."""
    w = query.split()
    return [" ".join(w[:n]) for n in range(len(w), 1, -1)] or [query]


async def resolve_images(content: dict, workdir: Path, search: Search | None = None) -> dict:
    """Put a downloaded photo into every slide that asks for one ({"query": ...})."""
    find = search or default_search()
    if find is pexels_search:
        find = functools.partial(pexels_search, taken=set())  # one deck, no photo twice
    slots = asyncio.Semaphore(4)
    wanted = [(i, s) for i, s in enumerate(content["slides"])
              if isinstance(s.get("image"), dict) and "src" not in s["image"] and s["image"].get("query")]

    async def one(i: int, s: dict) -> tuple[int, dict | None]:
        async with slots:
            for q in _shorter(s["image"]["query"]):
                try:
                    return i, await find(q, workdir / f"img-{i:02d}.jpg")
                except Exception:
                    continue
            fb = FALLBACK_IMAGES[i % len(FALLBACK_IMAGES)] if FALLBACK_IMAGES else None
            return i, ({"src": str(fb), "credit": ""} if fb else None)

    for i, img in await asyncio.gather(*(one(i, s) for i, s in wanted)):
        if img:
            content["slides"][i]["image"] = img
        else:
            content["slides"][i].pop("image", None)
    return content

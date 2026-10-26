"""
content_ai.py — the AI half of the filler (v2).

    topic + meta + slide_count + language  ->  AI writes content JSON  ->  validated
    ->  photos fetched (Pexels)  ->  fill.js draws the .pptx

All 30 templates use the same structure:
    cover (Kirish/titul) -> intro (Kirish) -> agenda (Reja) -> ... -> sources (Manbalar) -> closing
with 3–6 photos and any slide count from 6 to 30.

    from content_ai import make_presentation
    path = make_presentation(
        "Soliq islohotlari va iqtisodiy o'sish", template_id=25, slide_count=14, language="uz",
        meta={"author": "Diyorbek Toshmatov", "org": "TDIU", "loc": "Toshkent", "year": "2024"})

Environment: GEMINI_API_KEY (Gemini, used when set) or ANTHROPIC_API_KEY (Claude); optional GEMINI_MODEL / SLIDEAI_MODEL.
Photos: PEXELS_API_KEY if set, otherwise generated with Gemini (GEMINI_IMAGE_MODEL).
"""
from __future__ import annotations

import json
import os
import re
import subprocess
import tempfile
import urllib.parse
import urllib.request
from pathlib import Path
from typing import Callable, Literal

from pydantic import BaseModel, ValidationError

PRO_DIR = Path(os.getenv("SLIDEAI_ENGINE_DIR", Path(__file__).resolve().parent.parent / "engine")).resolve()
MODEL = os.getenv("SLIDEAI_MODEL", "claude-sonnet-5-5")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-3.5-flash")  # a fixed model: "*-latest" moves to the newest model, which is often overloaded (503)
# tried in turn when the main model is overloaded (503 / 429) or too slow
GEMINI_FALLBACKS = [m for m in os.getenv("GEMINI_FALLBACKS", "gemini-3.5-flash,gemini-flash-lite-latest").split(",") if m]
GEMINI_THINKING = os.getenv("GEMINI_THINKING", "low")  # "low" answers much faster; "" = the model's default
GEMINI_IMAGE_MODEL = os.getenv("GEMINI_IMAGE_MODEL", "gemini-2.5-flash-image")
GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"
TEMPLATE_INFO = {t["id"]: t for t in json.loads((PRO_DIR / "templates.json").read_text(encoding="utf-8"))}

def style_of(template_id: int) -> dict:
    """The template's style passport: tone for the AI, its own length limits, preferred slide mix."""
    return TEMPLATE_INFO.get(template_id, {}).get("style", {})

SECTION_TITLES = {  # titles of the fixed slides, in the presentation language
    "uz": {"intro": "Kirish", "agenda": "Reja", "sources": "Foydalanilgan manbalar"},
    "ru": {"intro": "Введение", "agenda": "План", "sources": "Список источников"},
    "en": {"intro": "Introduction", "agenda": "Outline", "sources": "References"},
}

LANG = {"uz": "o'zbek tilida, lotin yozuvida", "ru": "на русском языке", "en": "in English"}
PHOTO_TEMPLATES = range(1, 41)  # all 30 templates follow the same rules now

ICONS = ["FiTarget", "FiTrendingUp", "FiUsers", "FiUser", "FiFlag", "FiSun", "FiDroplet", "FiLayers", "FiGrid", "FiClock",
         "FiSmartphone", "FiBarChart2", "FiPieChart", "FiSend", "FiCreditCard", "FiDatabase", "FiMessageCircle",
         "FiBookOpen", "FiMapPin", "FiCompass", "FiAward", "FiCheckSquare", "FiShuffle", "FiShield", "FiHeart",
         "FiGlobe", "FiFeather", "FiZap", "FiCpu", "FiCode", "FiSettings", "FiTool", "FiHome", "FiBriefcase",
         "FiDollarSign", "FiShoppingCart", "FiShoppingBag", "FiPercent", "FiTruck", "FiActivity", "FiThermometer",
         "FiWind", "FiCamera", "FiMusic", "FiStar", "FiEye", "FiLock", "FiSearch", "FiLink", "FiMonitor", "FiEdit3", "FiSliders"]

# ---------------------------------------------------------------- plans
CLASSIC = {
    5: ["cover", "cards", "process", "stats", "closing"],
    10: ["cover", "agenda", "cards", "process", "stats", "compare", "statement", "timeline", "quote", "closing"],
    15: ["cover", "agenda", "statement", "cards", "process", "stats", "compare", "timeline",
         "cards", "process", "stats", "compare", "statement", "quote", "closing"],
    20: ["cover", "agenda", "statement", "cards", "process", "stats", "compare", "timeline", "cards", "statement",
         "process", "stats", "compare", "cards", "timeline", "stats", "compare", "statement", "quote", "closing"],
}
MIDDLE_POOL = ["image", "cards", "stats", "process", "compare", "image", "timeline", "statement",
               "cards", "image", "process", "stats", "compare", "timeline", "cards", "statement"]
POOLS = {  # template "prefer" -> order in which middle slides are picked
    None: MIDDLE_POOL,
    "data": ["image", "stats", "cards", "compare", "process", "image", "stats", "timeline",
             "cards", "image", "stats", "compare", "process", "statement", "timeline", "cards"],
    "text": ["image", "cards", "statement", "process", "timeline", "image", "compare", "statement",
             "cards", "image", "stats", "process", "timeline", "compare", "statement", "cards"],
    "visual": ["image", "cards", "image", "stats", "process", "image", "compare", "timeline",
               "statement", "cards", "process", "stats", "compare", "timeline", "cards", "statement"],
}

def plan_for(n: int, template_id: int) -> list[str]:
    """Slide-type order for n slides. Photo templates: any n in 6..30, always with
    cover, intro (Kirish), agenda (Reja), sources (Manbalar) and closing, and 3–6 photos."""
    if template_id not in PHOTO_TEMPLATES:
        if n not in CLASSIC:
            raise ValueError("1–20 shablonlar uchun slaydlar soni 5, 10, 15 yoki 20 bo'lishi kerak")
        return CLASSIC[n]
    if not 6 <= n <= 30:
        raise ValueError("slaydlar soni 6 dan 30 gacha bo'lishi kerak")
    m = n - 5
    pool = POOLS.get(style_of(template_id).get("prefer"), MIDDLE_POOL)
    middle, k = [], 0
    while len(middle) < m:
        tp = pool[k % len(pool)]; k += 1
        if tp == "image" and middle.count("image") >= 3:   # cover+intro+closing = 3 photos, max 6 in total
            continue
        middle.append(tp)
    if m >= 6:                                             # a quote near the end when there is room
        middle[-1] = "quote"
    return ["cover", "intro", "agenda", *middle, "sources", "closing"]

# ---------------------------------------------------------------- limits
LIMITS = {  # characters
    "title": 50, "cover_title": 60, "subtitle": 110, "agenda_item": 32, "card_h": 22, "card_t3": 90, "card_t4": 70,
    "step_h": 22, "step_t": 80, "stat_v": 7, "stat_l": 50, "note": 110, "side_h": 24, "side_item": 38,
    "stmt": 70, "caption": 140, "year": 9, "event_h": 16, "event_t": 80, "quote": 130, "author": 50,
    "intro": 320, "image_text": 260, "source": 120, "query": 60,
}

class Meta(BaseModel):
    topic: str
    author: str = ""
    org: str = ""
    loc: str = ""
    year: str = ""

class Slide(BaseModel):
    type: Literal["cover", "intro", "agenda", "image", "cards", "process", "stats", "compare",
                  "statement", "timeline", "quote", "sources", "closing"]
    model_config = {"extra": "allow"}

def _len(e, where, v, n):
    if not isinstance(v, str) or not v.strip(): e.append(f"{where}: bo'sh bo'lmasligi kerak")
    elif len(v) > n: e.append(f"{where}: {len(v)} belgi, ko'pi bilan {n}")

def limits_for(template_id: int) -> dict:
    return {**LIMITS, **style_of(template_id).get("limits", {})}

def check_slide(d: dict, photos: bool, Lm: dict = LIMITS) -> list[str]:
    e, T = [], d.get("type")
    if T not in ("quote",): _len(e, "title", d.get("title"), Lm["cover_title"] if T in ("cover", "closing") else Lm["title"])
    if T in ("cover", "closing"): _len(e, "subtitle", d.get("subtitle"), Lm["subtitle"])
    if photos and T in ("cover", "intro", "image", "closing"):
        img = d.get("image")
        if not img: e.append("'image' kerak: {\"query\": \"inglizcha qidiruv so'zi\"}")
        elif isinstance(img, dict) and "src" not in img: _len(e, "image.query", img.get("query"), Lm["query"])
    if T == "intro": _len(e, "text", d.get("text"), Lm["intro"])
    if T == "image": _len(e, "text", d.get("text"), Lm["image_text"])
    if T == "agenda":
        it = d.get("items") or []
        if not 4 <= len(it) <= 6: e.append("items: 4–6 ta band kerak")
        for k, x in enumerate(it): _len(e, f"items[{k}]", x, Lm["agenda_item"])
    if T == "cards":
        it = d.get("items") or []
        if not 3 <= len(it) <= 4: e.append("items: 3 yoki 4 ta kartochka kerak")
        for k, x in enumerate(it):
            _len(e, f"items[{k}].h", x.get("h"), Lm["card_h"]); _len(e, f"items[{k}].t", x.get("t"), Lm["card_t4"] if len(it) == 4 else Lm["card_t3"])
            if x.get("icon") not in ICONS: x["icon"] = "FiCircle"
    if T == "process":
        st = d.get("steps") or []
        if not 3 <= len(st) <= 4: e.append("steps: 3 yoki 4 ta kerak")
        for k, x in enumerate(st): _len(e, f"steps[{k}].h", x.get("h"), Lm["step_h"]); _len(e, f"steps[{k}].t", x.get("t"), Lm["step_t"])
    if T == "stats":
        st = d.get("stats") or []
        if len(st) != 3: e.append("stats: aynan 3 ta kerak")
        for k, x in enumerate(st): _len(e, f"stats[{k}].value", x.get("value"), Lm["stat_v"]); _len(e, f"stats[{k}].label", x.get("label"), Lm["stat_l"])
        if d.get("note"): _len(e, "note", d["note"], Lm["note"])
    if T == "compare":
        for side in ("left", "right"):
            s = d.get(side) or {}
            _len(e, f"{side}.h", s.get("h"), Lm["side_h"])
            if not 3 <= len(s.get("items") or []) <= 4: e.append(f"{side}.items: 3–4 ta kerak")
            for k, x in enumerate(s.get("items") or []): _len(e, f"{side}.items[{k}]", x, Lm["side_item"])
    if T == "statement": _len(e, "text", d.get("text"), Lm["stmt"]); _len(e, "caption", d.get("caption"), Lm["caption"])
    if T == "timeline":
        it = d.get("items") or []
        if len(it) != 4: e.append("items: aynan 4 ta kerak")
        for k, x in enumerate(it):
            _len(e, f"items[{k}].year", x.get("year"), Lm["year"]); _len(e, f"items[{k}].h", x.get("h"), Lm["event_h"]); _len(e, f"items[{k}].t", x.get("t"), Lm["event_t"])
    if T == "quote": _len(e, "text", d.get("text"), Lm["quote"]); _len(e, "author", d.get("author"), Lm["author"])
    if T == "sources":
        it = d.get("items") or []
        if not 3 <= len(it) <= 6: e.append("items: 3–6 ta manba kerak")
        for k, x in enumerate(it): _len(e, f"items[{k}]", x, Lm["source"])
    return e

def validate(data: dict, plan: list[str], photos: bool, Lm: dict = LIMITS) -> tuple[dict | None, list[str]]:
    slides = data.get("slides") if isinstance(data, dict) else None
    if not isinstance(slides, list): return None, ["'slides' ro'yxati yo'q"]
    errors = []
    if [s.get("type") for s in slides] != plan: errors.append(f"slayd turlari tartibi aynan shunday bo'lishi kerak: {plan}")
    for i, s in enumerate(slides):
        try: Slide.model_validate(s)
        except ValidationError: errors.append(f"slayd {i + 1}: noma'lum tur {s.get('type')}"); continue
        errors += [f"slayd {i + 1} ({s['type']}): {p}" for p in check_slide(s, photos, Lm)]
    return (data if not errors else None), errors

# ---------------------------------------------------------------- prompt
def build_prompt(topic: str, plan: list[str], language: str, photos: bool, template_id: int = 1) -> str:
    Lm, st = limits_for(template_id), style_of(template_id)
    tone = f"\nUslub ({TEMPLATE_INFO.get(template_id, {}).get('name', '')} shabloni): {st['tone']}." if st.get("tone") else ""
    ST = SECTION_TITLES[language]
    extra = f"""
- intro: title = "{ST['intro']}", text ≤{Lm['intro']} (mavzuga kirish, 2–3 gap), image
- image: title ≤{Lm['title']}, text ≤{Lm['image_text']}, image
- sources: title = "{ST['sources']}", items: 3–6 ta, har biri ≤{Lm['source']}
- cover va closing ham image oladi.
image formati: {{"query": "2–5 so'zli INGLIZCHA qidiruv, masalan 'tax office documents'"}}. Fotostokdan qidiriladi, URL yozma.""" if photos else ""
    lang_rule = f"\nMUHIM: ko'rsatmalar o'zbekcha yozilgan, lekin JAVOBDAGI BARCHA MATN (sarlavhalar, matn, manbalar nomi, iqtibos) faqat {LANG[language]} bo'lsin. agenda sarlavhasi: \"{SECTION_TITLES[language]['agenda']}\"."
    return f"""Sen professional taqdimot muallifisan. Mavzu: "{topic}". Barcha matnni {LANG[language]} yoz.{tone}{lang_rule}
Slaydlar soni {len(plan)} ta, turlari AYNAN shu tartibda: {json.dumps(plan)}

Maydonlar va QATTIQ uzunlik chegaralari (belgilarda):
- cover / closing: title ≤{Lm['cover_title']}, subtitle ≤{Lm['subtitle']}
- agenda: title, items 4–6 ta, har biri ≤{Lm['agenda_item']}. Bandlar keyingi slaydlar sarlavhalariga mos bo'lsin.
- cards: title ≤{Lm['title']}, items 3 yoki 4 ta {{icon, h ≤{Lm['card_h']}, t}}: 3 ta bo'lsa t ≤{Lm['card_t3']}, 4 ta bo'lsa t ≤{Lm['card_t4']}. icon faqat: {", ".join(ICONS)}
- process: title, steps 3–4 ta {{h ≤{Lm['step_h']}, t ≤{Lm['step_t']}}}
- stats: title, stats aynan 3 ta {{value ≤{Lm['stat_v']}, label ≤{Lm['stat_l']}}}, note ≤{Lm['note']} (manba ko'rsatilsa yaxshi)
- compare: title, left/right {{h ≤{Lm['side_h']}, items 3–4 ta, har biri ≤{Lm['side_item']}}}
- statement: title, text ≤{Lm['stmt']}, caption ≤{Lm['caption']}
- timeline: title, items aynan 4 ta {{year ≤{Lm['year']}, h ≤{Lm['event_h']}, t ≤{Lm['event_t']}}}
- quote: text ≤{Lm['quote']}, author ≤{Lm['author']}{extra}

Qoidalar:
1. Faqat to'g'ri, tekshirsa bo'ladigan faktlar. Ishonching komil bo'lmagan raqam yoki sanani yozma.
2. quote: faqat haqiqatan mavjud, muallifi aniq iqtibos; aks holda xalq maqoli.
3. sources: faqat haqiqatan mavjud hujjat, qonun, rasmiy sayt yoki nashrlar. To'qima manba yozma.
4. Sarlavhalar nuqta bilan tugamasin. Indekslar Unicode bilan: CO₂.
Javob: FAQAT JSON: {{"slides": [...]}}"""

def parse_json(text: str) -> dict:
    text = re.sub(r"^```(?:json)?\s*|\s*```$", "", text.strip())
    return json.loads(text[text.find("{"): text.rfind("}") + 1])

def claude(messages: list[dict]) -> str:
    import anthropic  # pip install anthropic
    r = anthropic.Anthropic().messages.create(model=MODEL, max_tokens=12000, messages=messages)
    return "".join(b.text for b in r.content if b.type == "text")

def _gemini_call(model: str, body: dict, timeout: int = 180) -> dict:
    req = urllib.request.Request(GEMINI_URL.format(model=model), data=json.dumps(body).encode(), method="POST",
                                 headers={"Content-Type": "application/json", "x-goog-api-key": os.environ["GEMINI_API_KEY"]})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return json.load(r)

RETRY_WAIT = (3, 8, 15, 25)

def _gemini_generate(contents: list[dict]) -> dict:
    """generateContent with retries: busy / slow answers are retried after a pause, moving through the fallback
    models; a model that rejects the thinking setting is asked again without it."""
    import time
    import urllib.error
    models = [GEMINI_MODEL] + [m for m in GEMINI_FALLBACKS if m != GEMINI_MODEL]
    thinking = {"thinkingConfig": {"thinkingLevel": GEMINI_THINKING}} if GEMINI_THINKING else {}
    last = None
    for attempt in range(len(RETRY_WAIT) + 1):
        model = models[attempt % len(models)]
        config = {"responseMimeType": "application/json", "maxOutputTokens": 32000, "temperature": 0.7, **thinking}
        try:
            return _gemini_call(model, {"contents": contents, "generationConfig": config}, timeout=150)
        except urllib.error.HTTPError as e:
            body = e.read().decode("utf-8", "replace")
            if e.code == 400 and thinking and "think" in body.lower():
                thinking = {}; continue  # this model has no thinking levels
            if e.code not in (429, 500, 502, 503, 504):
                raise RuntimeError(f"Gemini {e.code}: {body[:300]}") from e
            last = f"Gemini {e.code} ({model})"
        except (TimeoutError, OSError) as e:
            last = f"Gemini timeout ({model}): {e}"
        if attempt < len(RETRY_WAIT):
            time.sleep(RETRY_WAIT[attempt])
    raise RuntimeError(f"Gemini javob bermadi: {last}")

def gemini(messages: list[dict]) -> str:
    """Same contract as claude(): chat messages in, text out (JSON mode, so the reply is plain JSON)."""
    contents = [{"role": "model" if m["role"] == "assistant" else "user", "parts": [{"text": m["content"]}]} for m in messages]
    data = _gemini_generate(contents)
    parts = ((data.get("candidates") or [{}])[0].get("content") or {}).get("parts") or []
    text = "".join(p.get("text", "") for p in parts if not p.get("thought"))
    if not text:
        raise RuntimeError(f"Gemini: bo'sh javob ({(data.get('candidates') or [{}])[0].get('finishReason', data.get('promptFeedback'))})")
    return text

def ai(messages: list[dict]) -> str:
    """The configured model: Gemini when GEMINI_API_KEY is set, otherwise Claude."""
    return gemini(messages) if os.getenv("GEMINI_API_KEY") else claude(messages)

_OVER = re.compile(r": (\d+) belgi, ko'pi bilan (\d+)$")

def _only_slightly_long(errors: list[str], slack: float = 1.25) -> bool:
    """True when every error is a text at most 25% over its limit: the templates fit such text
    (L.fit shrinks the font a little), so it is not worth failing a paid presentation for."""
    for e in errors:
        m = _OVER.search(e)
        if not m or int(m.group(1)) > int(m.group(2)) * slack:
            return False
    return bool(errors)

def _until_valid(messages, plan, photos, Lm, ask, retries=2) -> dict:
    errors, last = [], None
    for _ in range(retries + 1):
        reply = ask(messages)
        try:
            parsed = parse_json(reply)
            data, errors = validate(parsed, plan, photos, Lm)
            last = parsed
        except (json.JSONDecodeError, ValueError): data, errors = None, ["javob to'g'ri JSON emas"]
        if data: return data
        messages = messages + [{"role": "assistant", "content": reply},
                               {"role": "user", "content": "Xatolarni tuzat va BUTUN JSON'ni qaytadan yubor:\n- " + "\n- ".join(errors[:40])}]
    if last is not None and _only_slightly_long(errors):
        return last
    raise RuntimeError("AI kontenti tekshiruvdan o'tmadi: " + "; ".join(errors[:10]))

def generate_content(topic, slide_count, language="uz", template_id=1, ask: Callable = ai, retries=2) -> dict:
    """First generation: plan, tone and limits all come from the chosen template."""
    if language not in LANG: raise ValueError("language: uz, ru yoki en")
    photos = template_id in PHOTO_TEMPLATES
    plan = plan_for(slide_count, template_id)
    messages = [{"role": "user", "content": build_prompt(topic, plan, language, photos, template_id)}]
    return _until_valid(messages, plan, photos, limits_for(template_id), ask, retries)

def restyle(content: dict, template_id: int, ask: Callable = ai, retries=2) -> dict:
    """Cheap re-edit when the user switches template: same slides, facts, numbers, sources and
    images; only tone and length are adapted to the new template's passport."""
    st, Lm, name = style_of(template_id), limits_for(template_id), TEMPLATE_INFO.get(template_id, {}).get("name", "")
    plan = [s["type"] for s in content["slides"]]
    body = {"slides": content["slides"]}
    prompt = f"""Quyidagi taqdimot JSON'ini "{name}" shabloniga moslashtir.
Uslub: {st.get('tone', 'neytral')}.
Uzunlik chegaralari (belgilarda): {json.dumps(Lm, ensure_ascii=False)}
QAT'IY: slaydlar soni va tartibi, type, faktlar, raqamlar, sanalar, nomlar, manbalar (sources), image maydonlari va matn TILI O'ZGARMAYDI.
Faqat matnning ohangi, so'z tanlovi va uzunligini moslashtir. Tilni o'zgartirma.
Javob: FAQAT JSON: {{"slides": [...]}}

{json.dumps(body, ensure_ascii=False)}"""
    out = _until_valid([{"role": "user", "content": prompt}], plan, template_id in PHOTO_TEMPLATES, Lm, ask, retries)
    for a, b in zip(content["slides"], out["slides"]):  # facts that must never drift
        for k in ("image", "items") if a["type"] == "sources" else ("image",):
            if k in a: b[k] = a[k]
    return {**content, "slides": out["slides"]}

# ---------------------------------------------------------------- photos (Pexels)
def pexels_search(query: str, dest: Path, key: str | None = None) -> dict:
    """Download the first landscape Pexels photo for query. Returns {src, credit, url}."""
    key = key or os.environ["PEXELS_API_KEY"]
    url = "https://api.pexels.com/v1/search?" + urllib.parse.urlencode({"query": query, "per_page": 1, "orientation": "landscape"})
    ua = {"User-Agent": "SlideAI/1.0 (+https://t.me/slidechibot)"}  # Pexels' CDN refuses urllib's default agent (403)
    with urllib.request.urlopen(urllib.request.Request(url, headers={"Authorization": key, **ua}), timeout=20) as r:
        photos = json.load(r).get("photos") or []
    if not photos: raise LookupError(f"Pexels: '{query}' bo'yicha rasm topilmadi")
    p = photos[0]
    dest.parent.mkdir(parents=True, exist_ok=True)
    with urllib.request.urlopen(urllib.request.Request(p["src"]["large2x"], headers=ua), timeout=60) as r:
        dest.write_bytes(r.read())
    return {"src": str(dest), "credit": f"Photo: {p['photographer']} / Pexels", "url": p["url"]}

def gemini_image(query: str, dest: Path, key: str | None = None) -> dict:
    """No stock-photo key: draw a photo for the query with Gemini's image model. Returns {src, credit}."""
    import base64
    prompt = (f"A high-quality, realistic, landscape (16:9) photograph for a presentation slide about: {query}. "
              "No text, no letters, no logos, no watermark.")
    data = _gemini_call(GEMINI_IMAGE_MODEL, {"contents": [{"parts": [{"text": prompt}]}],
                                             "generationConfig": {"responseModalities": ["IMAGE"], "imageConfig": {"aspectRatio": "16:9"}}}, timeout=120)
    for part in ((data.get("candidates") or [{}])[0].get("content") or {}).get("parts") or []:
        inline = part.get("inlineData") or part.get("inline_data")
        if inline and inline.get("data"):
            raw = base64.b64decode(inline["data"])
            ext = ".png" if "png" in inline.get("mimeType", inline.get("mime_type", "")) else ".jpg"
            dest = dest.with_suffix(ext); dest.parent.mkdir(parents=True, exist_ok=True); dest.write_bytes(raw)
            return {"src": str(dest), "credit": "AI image (Gemini)"}
    raise LookupError(f"Gemini: '{query}' uchun rasm yaratilmadi")

def default_search() -> Callable:
    """Pexels when its key is set, otherwise Gemini-generated photos."""
    return pexels_search if os.getenv("PEXELS_API_KEY") or not os.getenv("GEMINI_API_KEY") else gemini_image

FALLBACK_IMAGES = sorted((PRO_DIR / "demo" / "img").glob("*.jpg"))

def resolve_images(content: dict, workdir: Path, search: Callable | None = None) -> dict:
    """Fetch every slide photo in parallel. A photo that cannot be found falls back to a neutral demo picture,
    so one failed search never fails the whole presentation."""
    from concurrent.futures import ThreadPoolExecutor
    search = search or default_search()
    jobs = [(i, s) for i, s in enumerate(content["slides"])
            if isinstance(s.get("image"), dict) and "src" not in s["image"] and s["image"].get("query")]

    def one(job):
        i, s = job
        try:
            return i, search(s["image"]["query"], workdir / f"img-{i:02d}.jpg")
        except Exception:
            fb = FALLBACK_IMAGES[i % len(FALLBACK_IMAGES)] if FALLBACK_IMAGES else None
            return i, ({"src": str(fb), "credit": ""} if fb else None)

    with ThreadPoolExecutor(max_workers=4) as pool:
        for i, img in pool.map(one, jobs):
            if img:
                content["slides"][i]["image"] = img
            else:
                content["slides"][i].pop("image", None)
    return content

# ---------------------------------------------------------------- render
def render(content: dict, template_id: int, out_path) -> Path:
    with tempfile.NamedTemporaryFile("w", suffix=".json", delete=False, encoding="utf-8") as f:
        json.dump(content, f, ensure_ascii=False)
    try:
        subprocess.run(["node", "fill.js", str(template_id), f.name, str(out_path)], cwd=PRO_DIR, check=True, timeout=180, capture_output=True, text=True)
    finally:
        os.unlink(f.name)
    return Path(out_path)

def build_presentation(topic, template_id, slide_count=10, language="uz", meta: dict | None = None,
                       out_path=None, ask=ai, search=None) -> tuple[Path, dict]:
    """Full pipeline. Returns (pptx path, content) — keep the content to switch templates later."""
    content = generate_content(topic, slide_count, language, template_id, ask=ask)
    content["meta"] = Meta(topic=topic, **(meta or {})).model_dump()
    work = Path(tempfile.mkdtemp(prefix="slideai-"))
    if template_id in PHOTO_TEMPLATES:
        resolve_images(content, work, search)
    out = out_path or work / f"slideai-{template_id}.pptx"
    return render(content, template_id, out), content

def make_presentation(topic, template_id, slide_count=10, language="uz", meta: dict | None = None,
                      out_path=None, ask=ai, search=None) -> Path:
    return build_presentation(topic, template_id, slide_count, language, meta, out_path, ask, search)[0]

def switch_template(content: dict, template_id: int, out_path=None, ask=ai) -> tuple[Path, dict]:
    """Same presentation in another template: one short AI call to adapt tone/length, then redraw."""
    new = restyle(content, template_id, ask=ask)
    out = out_path or Path(tempfile.mkdtemp(prefix="slideai-")) / f"slideai-{template_id}.pptx"
    return render(new, template_id, out), new

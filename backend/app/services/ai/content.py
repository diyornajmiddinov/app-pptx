"""The prompt, checking the model's answer against the plan and the limits, and asking again with the errors."""
import json
import re
from typing import Literal

from pydantic import BaseModel, ValidationError

from app.services.ai.catalog import ICONS, LANG, LIMITS, PHOTO_TEMPLATES, SECTION_TITLES, TEMPLATE_INFO, limits_for, plan_for, style_of
from app.services.ai.models import Ask, Messages, ai


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


def _len(e: list[str], where: str, v, n: int):
    if not isinstance(v, str) or not v.strip(): e.append(f"{where}: bo'sh bo'lmasligi kerak")
    elif len(v) > n: e.append(f"{where}: {len(v)} belgi, ko'pi bilan {n}")


def check_slide(d: dict, photos: bool, Lm: dict = LIMITS) -> list[str]:
    e: list[str] = []
    T = d.get("type")
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


_OVER = re.compile(r": (\d+) belgi, ko'pi bilan (\d+)$")


def only_slightly_long(errors: list[str], slack: float = 1.25) -> bool:
    """True when every error is a text at most 25% over its limit: the templates fit such text
    (L.fit shrinks the font a little), so it is not worth failing a paid presentation for."""
    for e in errors:
        m = _OVER.search(e)
        if not m or int(m.group(1)) > int(m.group(2)) * slack:
            return False
    return bool(errors)


async def until_valid(messages: Messages, plan: list[str], photos: bool, Lm: dict, ask: Ask, retries: int = 2) -> dict:
    errors: list[str] = []
    last = None
    for _ in range(retries + 1):
        reply = await ask(messages)
        try:
            parsed = parse_json(reply)
            data, errors = validate(parsed, plan, photos, Lm)
            last = parsed
        except (json.JSONDecodeError, ValueError): data, errors = None, ["javob to'g'ri JSON emas"]
        if data: return data
        messages = [*messages, {"role": "assistant", "content": reply},
                    {"role": "user", "content": "Xatolarni tuzat va BUTUN JSON'ni qaytadan yubor:\n- " + "\n- ".join(errors[:40])}]
    if last is not None and only_slightly_long(errors):
        return last
    raise RuntimeError("AI kontenti tekshiruvdan o'tmadi: " + "; ".join(errors[:10]))


async def generate_content(topic: str, slide_count: int, language: str = "uz", template_id: int = 1, ask: Ask = ai, retries: int = 2) -> dict:
    """First generation: plan, tone and limits all come from the chosen template."""
    if language not in LANG: raise ValueError("language: uz, ru yoki en")
    photos = template_id in PHOTO_TEMPLATES
    plan = plan_for(slide_count, template_id)
    messages = [{"role": "user", "content": build_prompt(topic, plan, language, photos, template_id)}]
    return await until_valid(messages, plan, photos, limits_for(template_id), ask, retries)


async def restyle(content: dict, template_id: int, ask: Ask = ai, retries: int = 2) -> dict:
    """Cheap re-edit when the user switches template: same slides, facts, numbers, sources and
    images; only tone and length are adapted to the new template's passport."""
    st, Lm, name = style_of(template_id), limits_for(template_id), TEMPLATE_INFO.get(template_id, {}).get("name", "")
    plan = [s["type"] for s in content["slides"]]
    prompt = f"""Quyidagi taqdimot JSON'ini "{name}" shabloniga moslashtir.
Uslub: {st.get('tone', 'neytral')}.
Uzunlik chegaralari (belgilarda): {json.dumps(Lm, ensure_ascii=False)}
QAT'IY: slaydlar soni va tartibi, type, faktlar, raqamlar, sanalar, nomlar, manbalar (sources), image maydonlari va matn TILI O'ZGARMAYDI.
Faqat matnning ohangi, so'z tanlovi va uzunligini moslashtir. Tilni o'zgartirma.
Javob: FAQAT JSON: {{"slides": [...]}}

{json.dumps({"slides": content["slides"]}, ensure_ascii=False)}"""
    out = await until_valid([{"role": "user", "content": prompt}], plan, template_id in PHOTO_TEMPLATES, Lm, ask, retries)
    for a, b in zip(content["slides"], out["slides"], strict=True):  # facts that must never drift
        for k in ("image", "items") if a["type"] == "sources" else ("image",):
            if k in a: b[k] = a[k]
    return {**content, "slides": out["slides"]}

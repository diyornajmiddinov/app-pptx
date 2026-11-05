"""What the engine can draw: the 200 templates, which slide types go where, and how long each text may be."""
import json

from app.core.config import ENGINE_DIR

TEMPLATE_INFO = {t["id"]: t for t in json.loads((ENGINE_DIR / "templates.json").read_text(encoding="utf-8"))}
TEMPLATE_NAMES = {i: t["name"] for i, t in TEMPLATE_INFO.items()}
PHOTO_TEMPLATES = range(1, max(TEMPLATE_INFO) + 1)  # every template takes photos (1–200)


def style_of(template_id: int) -> dict:
    """The template's style passport: tone for the AI, its own length limits, preferred slide mix."""
    return TEMPLATE_INFO.get(template_id, {}).get("style", {})


SECTION_TITLES = {  # titles of the fixed slides, in the presentation language
    "uz": {"intro": "Kirish", "agenda": "Reja", "summary": "Xulosa", "sources": "Foydalanilgan manbalar"},
    "ru": {"intro": "Введение", "agenda": "План", "summary": "Выводы", "sources": "Список источников"},
    "en": {"intro": "Introduction", "agenda": "Outline", "summary": "Conclusions", "sources": "References"},
}
LANG = {"uz": "o'zbek tilida, lotin yozuvida", "ru": "на русском языке", "en": "in English"}

ICONS = ["FiTarget", "FiTrendingUp", "FiUsers", "FiUser", "FiFlag", "FiSun", "FiDroplet", "FiLayers", "FiGrid", "FiClock",
         "FiSmartphone", "FiBarChart2", "FiPieChart", "FiSend", "FiCreditCard", "FiDatabase", "FiMessageCircle",
         "FiBookOpen", "FiMapPin", "FiCompass", "FiAward", "FiCheckSquare", "FiShuffle", "FiShield", "FiHeart",
         "FiGlobe", "FiFeather", "FiZap", "FiCpu", "FiCode", "FiSettings", "FiTool", "FiHome", "FiBriefcase",
         "FiDollarSign", "FiShoppingCart", "FiShoppingBag", "FiPercent", "FiTruck", "FiActivity", "FiThermometer",
         "FiWind", "FiCamera", "FiMusic", "FiStar", "FiEye", "FiLock", "FiSearch", "FiLink", "FiMonitor", "FiEdit3", "FiSliders"]

# ---------------------------------------------------------------- plans
CLASSIC = {
    5: ["cover", "cards", "process", "stats", "closing"],
    10: ["cover", "agenda", "cards", "process", "stats", "compare", "statement", "timeline", "summary", "closing"],
    15: ["cover", "agenda", "statement", "cards", "process", "stats", "compare", "timeline",
         "cards", "process", "stats", "compare", "statement", "summary", "closing"],
    20: ["cover", "agenda", "statement", "cards", "process", "stats", "compare", "timeline", "cards", "statement",
         "process", "stats", "compare", "cards", "timeline", "stats", "compare", "statement", "summary", "closing"],
}
ANY = "any"  # a slide of the deck's main part: the model picks the type that fits what it says
FREE_TYPES = ("image", "cards", "process", "stats", "compare", "statement", "timeline")


WAYS = {"image": 4, "cards": 5, "process": 4, "stats": 3, "compare": 3, "statement": 3, "timeline": 3}  # how many ways a template draws a type


def most_of_a_type(m: int) -> int:
    """How many of m main slides may share a type: none in a short deck."""
    return 1 if m <= 5 else (m + 4) // 5


def most_of(slide_type: str, m: int) -> int:
    """The share of one type: beyond the ways a template draws it, a page would come back."""
    return min(most_of_a_type(m), WAYS[slide_type])


def plan_for(n: int, template_id: int) -> list[str]:
    """Slide-type order for n slides. Photo templates: any n in 6..30, always with cover, intro (Kirish), agenda (Reja),
    sources (Manbalar) and closing; the slides between are the topic's own: a fixed mix made the text fit the form
    (a stats slide about nothing, a whole process squeezed into one)."""
    if template_id not in PHOTO_TEMPLATES:
        if n not in CLASSIC:
            raise ValueError("1–20 shablonlar uchun slaydlar soni 5, 10, 15 yoki 20 bo'lishi kerak")
        return CLASSIC[n]
    if not 6 <= n <= 30:
        raise ValueError("slaydlar soni 6 dan 30 gacha bo'lishi kerak")
    m = n - 5
    # the conclusions near the end when there is room
    middle = [ANY] * (m - 1) + ["summary"] if m >= 6 else [ANY] * m
    return ["cover", "intro", "agenda", *middle, "sources", "closing"]


# ---------------------------------------------------------------- limits
LIMITS = {  # characters
    "title": 50, "cover_title": 60, "subtitle": 110, "agenda_item": 32, "card_h": 22, "card_t3": 90, "card_t4": 70,
    "step_h": 22, "step_t": 80, "stat_v": 7, "stat_l": 50, "note": 110, "side_h": 24, "side_item": 38,
    "stmt": 70, "caption": 140, "year": 9, "event_h": 16, "event_t": 80, "quote": 130, "author": 50,
    "intro": 320, "image_text": 260, "source": 120, "query": 60,
}


# How much text a deck gets (the user's choice), as a share of the template's running-text limits: concise 45%,
# balanced 125% (asked to fill 70–90% of it), detailed 180% (90–100%). The template limits leave a lot of air; 180% was
# checked on all 200 templates at full length (no box spills or clips; the shared fit shrinks the font a little where
# needed; 230% begins to spill). The answer is checked against the balanced limits, or the detailed ones for a detailed
# deck (content.py), so a deck is never failed for missing the level a little.
DENSITY = ("concise", "balanced", "detailed")
BODY_TEXT = ("subtitle", "intro", "image_text", "card_t3", "card_t4", "step_t", "side_item", "stmt", "caption", "event_t", "quote", "note")
FACTOR = {"concise": 0.45, "balanced": 1.25, "detailed": 1.8}
DENSITY_RULE = {
    "concise": "\nMatn hajmi: LO'NDA — har bir maydonda qisqa ibora va kalit fikrlar, ortiqcha so'zsiz; tomoshabin bir qarashda ilg'ab olsin.",
    "balanced": "\nMatn hajmi: MUVOZANATLI — har bir matn maydonini chegarasining 70–90% igacha to'ldir: 1–2 to'liq, mazmunli gap, "
                "aniq fakt yoki misol bilan (chegaradan oshma). Kartochka, qadam va voqealar matni ham bitta ibora emas, to'liq fikr bo'lsin.",
    "detailed": "\nMatn hajmi: BATAFSIL — har bir matn maydonini chegarasiga YAQIN (90–100%) to'ldir, qisqa yozma: 2–4 to'liq gap, "
                "izoh, misol, sabab-oqibat va aniq raqamlar bilan (chegaradan oshma). Kartochka, qadam, taqqoslash va voqealar matni ham "
                "chegarasigacha bo'lsin: bitta ibora emas, to'liq tushuntirish. Slaydda bo'sh joy kam qolsin.",
}


def limits_for(template_id: int, density: str = "balanced") -> dict:
    Lm = {**LIMITS, **style_of(template_id).get("limits", {})}
    f = FACTOR.get(density, FACTOR["balanced"])
    return {k: max(20, int(v * f)) if k in BODY_TEXT else v for k, v in Lm.items()}


def check_limits(template_id: int, density: str = "balanced") -> dict:
    """What the answer is checked against: the balanced limits, a detailed deck's own (it is asked for more)."""
    return limits_for(template_id, "detailed" if density == "detailed" else "balanced")

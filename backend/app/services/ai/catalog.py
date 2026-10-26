"""What the engine can draw: the 40 templates, which slide types go where, and how long each text may be."""
import json

from app.core.config import ENGINE_DIR

TEMPLATE_INFO = {t["id"]: t for t in json.loads((ENGINE_DIR / "templates.json").read_text(encoding="utf-8"))}
TEMPLATE_NAMES = {i: t["name"] for i, t in TEMPLATE_INFO.items()}
PHOTO_TEMPLATES = range(1, 41)  # every template takes photos


def style_of(template_id: int) -> dict:
    """The template's style passport: tone for the AI, its own length limits, preferred slide mix."""
    return TEMPLATE_INFO.get(template_id, {}).get("style", {})


SECTION_TITLES = {  # titles of the fixed slides, in the presentation language
    "uz": {"intro": "Kirish", "agenda": "Reja", "sources": "Foydalanilgan manbalar"},
    "ru": {"intro": "Введение", "agenda": "План", "sources": "Список источников"},
    "en": {"intro": "Introduction", "agenda": "Outline", "sources": "References"},
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
    middle: list[str] = []
    k = 0
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


def limits_for(template_id: int) -> dict:
    return {**LIMITS, **style_of(template_id).get("limits", {})}

"""
Animated decks (engine/animated): which templates have an animated copy, who may order one, what it adds to the price.
Until the admin opens it to everyone (app_settings animation_public, admin panel), only admins can order one; the
others see the option as "coming soon".
"""
from app.core.config import settings
from app.services import app_settings
from app.services.ai.render import ANIMATED


async def allowed(user_id: int, cfg: dict | None = None) -> bool:
    return user_id in settings.admin_ids or bool((cfg or await app_settings.get())["animation_public"])


async def info(user_id: int) -> dict:
    """For the Mini App and the site: {templates: [ids], open: may this user order, price: extra so'm}."""
    cfg = await app_settings.get()
    return {"templates": sorted(ANIMATED), "open": await allowed(user_id, cfg), "price": cfg["price_animation"], "video_price": cfg["price_video"]}


async def refusal(user_id: int, template_id: int) -> str | None:
    """Why this user cannot have this template animated (an error key), or None."""
    if not await allowed(user_id):
        return "animSoon"
    if template_id not in ANIMATED:
        return "animTemplate"
    return None


async def for_restyle(user_id: int, deck_request: dict, template_id: int) -> tuple[bool, int]:
    """An animated deck stays animated in its new template when that template has an animated copy: (animated, extra)."""
    cfg = await app_settings.get()
    animated = bool(deck_request.get("animated")) and template_id in ANIMATED and await allowed(user_id, cfg)
    return animated, cfg["price_animation"] if animated else 0

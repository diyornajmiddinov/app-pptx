"""
Settings from the environment (backend/.env, loaded by systemd's EnvironmentFile), checked once at start:
a missing token or a malformed value stops the service with a clear message instead of failing later.
Also the project's folders, so no module has to work them out from its own location.
"""
import os
from pathlib import Path
from typing import Annotated

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, NoDecode, SettingsConfigDict

BACKEND_DIR = Path(__file__).resolve().parents[2]
PROJECT_DIR = BACKEND_DIR.parent
DATA_DIR = BACKEND_DIR / "data"                 # photos of decks, editor files, the log channel id
MIGRATIONS_DIR = BACKEND_DIR / "migrations"
ENGINE_DIR = Path(os.getenv("SLIDEAI_ENGINE_DIR", PROJECT_DIR / "engine")).resolve()


def _split(v):
    """"1,2, 3" -> ["1", "2", "3"] (lists are written comma-separated in .env)."""
    return [x.strip() for x in v.split(",") if x.strip()] if isinstance(v, str) else v


class Settings(BaseSettings):
    model_config = SettingsConfigDict(extra="ignore")

    # Telegram
    bot_token: str = Field(pattern=r"^\d+:[\w-]{20,}$")
    webapp_url: str = ""                  # Mini App / editor / admin pages (HTTPS)
    site_url: str = ""                    # the website (https://slidechi.uz): POSTs to /api/web must come from it
    public_url: str = ""                  # backend address for the webhook and payment callbacks
    webhook_secret: str = ""              # Telegram sends it back in a header
    allowed_origins: Annotated[list[str], NoDecode] = ["*"]
    admin_ids: Annotated[set[int], NoDecode] = set()
    log_channel_id: str = ""              # else data/log_channel (set by adding the bot to a channel)

    # storage and jobs
    database_url: str = Field(pattern=r"^postgres(ql)?://")
    worker_concurrency: int = Field(2, ge=1, le=8)  # presentations drawn at the same time (2 CPUs, 2 GB RAM)
    demo: bool = Field(False, validation_alias="SLIDEAI_DEMO")  # no AI / Pexels: engine/content/soliq.json

    # billing, UZS (so'm); the admin panel can override the prices (app_settings)
    price_generate: int = Field(5000, ge=0)
    price_restyle: int = Field(2000, ge=0)
    topup_amounts: Annotated[list[int], NoDecode] = [15000, 30000, 50000, 100000]

    # payment links (payments.py); a provider is offered only when all its fields are set
    payme_merchant_id: str = ""
    payme_key: str = ""
    payme_test: bool = True               # test.paycom.uz instead of checkout.paycom.uz
    payme_account_field: str = "order_id"
    click_service_id: str = ""
    click_merchant_id: str = ""
    click_secret_key: str = ""
    card_number: str = ""                 # manual card transfer: screenshot + admin confirmation
    card_holder: str = ""
    return_url: str = Field("", validation_alias="PAYMENT_RETURN_URL")

    @field_validator("allowed_origins", "topup_amounts", mode="before")
    @classmethod
    def _list(cls, v):
        return _split(v)

    @field_validator("admin_ids", mode="before")
    @classmethod
    def _ids(cls, v):
        return {int(x) for x in _split(v)} if isinstance(v, str) else v

    @field_validator("topup_amounts")
    @classmethod
    def _amounts(cls, v: list[int]) -> list[int]:
        if not v or any(a <= 0 for a in v):
            raise ValueError("TOPUP_AMOUNTS: positive amounts, comma-separated")
        return v


settings = Settings()  # type: ignore[call-arg]  # values come from the environment

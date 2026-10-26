import os
from dataclasses import dataclass, field


@dataclass
class Settings:
    bot_token: str = os.getenv("BOT_TOKEN", "")
    webapp_url: str = os.getenv("WEBAPP_URL", "")
    public_url: str = os.getenv("PUBLIC_URL", "")          # backend address, for the bot webhook
    webhook_secret: str = os.getenv("WEBHOOK_SECRET", "")  # random string; Telegram sends it back in a header
    allowed_origins: list = field(default_factory=lambda: [o for o in os.getenv("ALLOWED_ORIGINS", "*").split(",") if o])
    database_url: str = os.getenv("DATABASE_URL", "")     # PostgreSQL of the bot and the backend (db.py)
    demo: bool = os.getenv("SLIDEAI_DEMO", "0") == "1"   # no AI / Pexels calls: uses engine/content/soliq.json
    # billing, all amounts in UZS (so'm)
    price_generate: int = int(os.getenv("PRICE_GENERATE", "5000"))
    price_restyle: int = int(os.getenv("PRICE_RESTYLE", "2000"))
    topup_amounts: list = field(default_factory=lambda: [int(a) for a in os.getenv("TOPUP_AMOUNTS", "15000,30000,50000,100000").split(",") if a])
    # payment links (payments.py); a provider is offered only when all its fields are set
    payme_merchant_id: str = os.getenv("PAYME_MERCHANT_ID", "")      # Payme business cabinet -> cashbox ID
    payme_key: str = os.getenv("PAYME_KEY", "")                      # cashbox key (test key while PAYME_TEST=1)
    payme_test: bool = os.getenv("PAYME_TEST", "1") == "1"           # links to test.paycom.uz instead of checkout.paycom.uz
    payme_account_field: str = os.getenv("PAYME_ACCOUNT_FIELD", "order_id")  # must match the cashbox "account" field
    click_service_id: str = os.getenv("CLICK_SERVICE_ID", "")
    click_merchant_id: str = os.getenv("CLICK_MERCHANT_ID", "")
    click_secret_key: str = os.getenv("CLICK_SECRET_KEY", "")
    card_number: str = os.getenv("CARD_NUMBER", "")      # manual card transfer: the user sends a screenshot, an admin confirms
    card_holder: str = os.getenv("CARD_HOLDER", "")
    return_url: str = os.getenv("PAYMENT_RETURN_URL", "")            # where the provider page sends the user after paying, e.g. https://t.me/<bot>
    admin_ids: set = field(default_factory=lambda: {int(i) for i in os.getenv("ADMIN_IDS", "").split(",") if i.strip()})


settings = Settings()

-- 0001: the schema as it was when migrations were introduced (bot, payments, decks, admin panel, AI usage, PDF).
-- Written with IF NOT EXISTS, so it also applies cleanly to the database that already had these tables.

CREATE TABLE IF NOT EXISTS users (
    id BIGINT PRIMARY KEY, first_name TEXT, last_name TEXT, username TEXT, language_code TEXT,
    lang TEXT,                                    -- chosen interface language (NULL = not chosen yet)
    created TIMESTAMPTZ NOT NULL DEFAULT now(), last_seen TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS balances (user_id BIGINT PRIMARY KEY, amount BIGINT NOT NULL DEFAULT 0);
CREATE TABLE IF NOT EXISTS ledger (
    id BIGSERIAL PRIMARY KEY, user_id BIGINT NOT NULL, delta BIGINT NOT NULL,
    kind TEXT NOT NULL, ref TEXT UNIQUE, created BIGINT NOT NULL);
CREATE INDEX IF NOT EXISTS ledger_user ON ledger (user_id);
CREATE TABLE IF NOT EXISTS orders (
    id BIGSERIAL PRIMARY KEY, user_id BIGINT NOT NULL, amount BIGINT NOT NULL,
    provider TEXT NOT NULL, state TEXT NOT NULL DEFAULT 'new', created BIGINT NOT NULL,
    screenshot TEXT, screenshot_kind TEXT, reviewed_by BIGINT);
CREATE INDEX IF NOT EXISTS orders_user ON orders (user_id);
CREATE TABLE IF NOT EXISTS payme_txns (
    id TEXT PRIMARY KEY, order_id BIGINT NOT NULL, amount BIGINT NOT NULL, state INTEGER NOT NULL,
    reason INTEGER, paycom_time BIGINT NOT NULL, create_time BIGINT NOT NULL,
    perform_time BIGINT NOT NULL DEFAULT 0, cancel_time BIGINT NOT NULL DEFAULT 0);
CREATE TABLE IF NOT EXISTS click_txns (
    id BIGSERIAL PRIMARY KEY, click_trans_id BIGINT UNIQUE NOT NULL, order_id BIGINT NOT NULL,
    amount BIGINT NOT NULL, state TEXT NOT NULL, created BIGINT NOT NULL);
CREATE TABLE IF NOT EXISTS decks (
    id TEXT PRIMARY KEY, user_id BIGINT NOT NULL, created BIGINT NOT NULL, updated BIGINT NOT NULL,
    request JSONB NOT NULL, content JSONB NOT NULL);
CREATE INDEX IF NOT EXISTS decks_user ON decks (user_id, created DESC);
CREATE TABLE IF NOT EXISTS app_settings (         -- prices etc. changed in the admin panel (appconfig.py)
    key TEXT PRIMARY KEY, value JSONB NOT NULL, updated TIMESTAMPTZ NOT NULL DEFAULT now(), updated_by BIGINT);
CREATE TABLE IF NOT EXISTS broadcasts (           -- admin panel: messages sent to many users
    id BIGSERIAL PRIMARY KEY, text TEXT NOT NULL, lang TEXT, state TEXT NOT NULL DEFAULT 'running',
    total INTEGER NOT NULL DEFAULT 0, sent INTEGER NOT NULL DEFAULT 0, failed INTEGER NOT NULL DEFAULT 0,
    created TIMESTAMPTZ NOT NULL DEFAULT now(), finished TIMESTAMPTZ, created_by BIGINT);
CREATE TABLE IF NOT EXISTS admin_log (            -- who did what in the admin panel
    id BIGSERIAL PRIMARY KEY, admin_id BIGINT NOT NULL, action TEXT NOT NULL, target TEXT, details JSONB,
    created TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE INDEX IF NOT EXISTS users_created ON users (created);
CREATE INDEX IF NOT EXISTS ledger_created ON ledger (created);
CREATE TABLE IF NOT EXISTS ai_usage (             -- every Gemini request, failed ones too (content_ai.on_usage)
    id BIGSERIAL PRIMARY KEY, created TIMESTAMPTZ NOT NULL DEFAULT now(), user_id BIGINT, purpose TEXT, job TEXT,
    model TEXT NOT NULL, op TEXT NOT NULL, status TEXT NOT NULL, ms INTEGER NOT NULL DEFAULT 0,
    prompt_tokens INTEGER NOT NULL DEFAULT 0, output_tokens INTEGER NOT NULL DEFAULT 0,
    thinking_tokens INTEGER NOT NULL DEFAULT 0, total_tokens INTEGER NOT NULL DEFAULT 0);
CREATE INDEX IF NOT EXISTS ai_usage_created ON ai_usage (created);
CREATE TABLE IF NOT EXISTS pdf_drafts (           -- images -> PDF: what the user has sent so far (images_pdf.py)
    user_id BIGINT PRIMARY KEY, files JSONB NOT NULL DEFAULT '[]', created TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE pdf_drafts ADD COLUMN IF NOT EXISTS stage TEXT NOT NULL DEFAULT 'collect';  -- 'collect' -> 'name'

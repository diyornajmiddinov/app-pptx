-- 0004: the website (slidechi.uz). A visitor signs in with a code the bot sends to their Telegram chat, so the site
-- account IS the bot account (users.id): same balance, decks and orders. Nothing here changes the bot's tables.
CREATE TABLE IF NOT EXISTS web_logins (           -- one sign-in code sent through the bot (services/web_auth.py)
    id TEXT PRIMARY KEY,                          -- random, handed to the browser with the "code sent" answer
    user_id BIGINT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    code_hash TEXT NOT NULL,                      -- HMAC of the 6 digits, never the digits themselves
    attempts INTEGER NOT NULL DEFAULT 0 CHECK (attempts >= 0),
    ip TEXT,
    created TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires TIMESTAMPTZ NOT NULL,
    used TIMESTAMPTZ);
CREATE INDEX IF NOT EXISTS web_logins_user ON web_logins (user_id, created DESC);
CREATE INDEX IF NOT EXISTS web_logins_ip ON web_logins (ip, created DESC);

CREATE TABLE IF NOT EXISTS web_sessions (         -- a signed-in browser; the token itself is only in the browser
    token_hash TEXT PRIMARY KEY,                  -- sha256 of the bearer token
    user_id BIGINT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    created TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_seen TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires TIMESTAMPTZ NOT NULL,
    ip TEXT, user_agent TEXT);
CREATE INDEX IF NOT EXISTS web_sessions_user ON web_sessions (user_id);

CREATE TABLE IF NOT EXISTS web_actions (          -- rate limits: what a user / IP did on the site, and when
    id BIGSERIAL PRIMARY KEY, user_id BIGINT, ip TEXT, action TEXT NOT NULL,
    created TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE INDEX IF NOT EXISTS web_actions_user ON web_actions (action, user_id, created DESC);
CREATE INDEX IF NOT EXISTS web_actions_ip ON web_actions (action, ip, created DESC);

CREATE INDEX IF NOT EXISTS users_username_lower ON users (lower(username));  -- sign-in by @username

-- 0005: website growth features: promo codes, referral links, visit statistics (routes/web.py, routes/admin.py).
CREATE TABLE IF NOT EXISTS promo_codes (          -- created in the admin panel, redeemed on the site
    id BIGSERIAL PRIMARY KEY,
    code TEXT NOT NULL UNIQUE CHECK (code ~ '^[A-Z0-9_-]{3,32}$'),
    amount BIGINT NOT NULL CHECK (amount > 0),    -- so'm added to the balance
    max_uses INTEGER CHECK (max_uses IS NULL OR max_uses > 0),
    uses INTEGER NOT NULL DEFAULT 0 CHECK (uses >= 0),
    expires TIMESTAMPTZ,
    active BOOLEAN NOT NULL DEFAULT true,
    created TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by BIGINT);
CREATE TABLE IF NOT EXISTS promo_uses (           -- one use per user per code (the ledger ref promo:<id>:<user> agrees)
    promo_id BIGINT NOT NULL REFERENCES promo_codes (id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    created TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (promo_id, user_id));

CREATE TABLE IF NOT EXISTS ref_codes (            -- a user's invite code: slidechi.uz/?ref=<code> (not the Telegram id)
    user_id BIGINT PRIMARY KEY REFERENCES users (id) ON DELETE CASCADE,
    code TEXT NOT NULL UNIQUE);
CREATE TABLE IF NOT EXISTS referrals (            -- who brought whom; the bonus is paid once, after the first top-up
    referred_id BIGINT PRIMARY KEY REFERENCES users (id) ON DELETE CASCADE,
    referrer_id BIGINT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    created TIMESTAMPTZ NOT NULL DEFAULT now(),
    rewarded TIMESTAMPTZ,
    CHECK (referred_id <> referrer_id));
CREATE INDEX IF NOT EXISTS referrals_referrer ON referrals (referrer_id);

CREATE TABLE IF NOT EXISTS web_stats (            -- daily counters (Tashkent date): visits, sign-ins, web jobs ...
    day DATE NOT NULL, metric TEXT NOT NULL, value BIGINT NOT NULL DEFAULT 0,
    PRIMARY KEY (day, metric));
CREATE TABLE IF NOT EXISTS web_visitors (         -- unique visitors per day: a salted hash, never the IP itself
    day DATE NOT NULL, visitor TEXT NOT NULL,
    PRIMARY KEY (day, visitor));

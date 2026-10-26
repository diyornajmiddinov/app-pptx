-- 0003: the database guards its own rules (not only the code): links between tables, allowed values,
-- no negative balance, and every timestamp as TIMESTAMPTZ (Payme's own millisecond fields stay as Payme sends them).

-- leftovers that the new rules would refuse: an empty balance row of a user who never existed
DELETE FROM balances b WHERE b.amount = 0 AND NOT EXISTS (SELECT 1 FROM users u WHERE u.id = b.user_id)
    AND NOT EXISTS (SELECT 1 FROM ledger l WHERE l.user_id = b.user_id);

-- timestamps: epoch seconds -> TIMESTAMPTZ
ALTER TABLE ledger     ALTER COLUMN created TYPE TIMESTAMPTZ USING to_timestamp(created), ALTER COLUMN created SET DEFAULT now();
ALTER TABLE orders     ALTER COLUMN created TYPE TIMESTAMPTZ USING to_timestamp(created), ALTER COLUMN created SET DEFAULT now();
ALTER TABLE click_txns ALTER COLUMN created TYPE TIMESTAMPTZ USING to_timestamp(created), ALTER COLUMN created SET DEFAULT now();
ALTER TABLE decks      ALTER COLUMN created TYPE TIMESTAMPTZ USING to_timestamp(created), ALTER COLUMN created SET DEFAULT now(),
                       ALTER COLUMN updated TYPE TIMESTAMPTZ USING to_timestamp(updated), ALTER COLUMN updated SET DEFAULT now();

-- links
ALTER TABLE balances   ADD CONSTRAINT balances_user_fk   FOREIGN KEY (user_id)  REFERENCES users (id);
ALTER TABLE ledger     ADD CONSTRAINT ledger_user_fk     FOREIGN KEY (user_id)  REFERENCES users (id);
ALTER TABLE orders     ADD CONSTRAINT orders_user_fk     FOREIGN KEY (user_id)  REFERENCES users (id);
ALTER TABLE decks      ADD CONSTRAINT decks_user_fk      FOREIGN KEY (user_id)  REFERENCES users (id);
ALTER TABLE jobs       ADD CONSTRAINT jobs_user_fk       FOREIGN KEY (user_id)  REFERENCES users (id);
ALTER TABLE pdf_drafts ADD CONSTRAINT pdf_drafts_user_fk FOREIGN KEY (user_id)  REFERENCES users (id) ON DELETE CASCADE;
ALTER TABLE payme_txns ADD CONSTRAINT payme_order_fk     FOREIGN KEY (order_id) REFERENCES orders (id);
ALTER TABLE click_txns ADD CONSTRAINT click_order_fk     FOREIGN KEY (order_id) REFERENCES orders (id);
CREATE INDEX IF NOT EXISTS payme_txns_order ON payme_txns (order_id);
CREATE INDEX IF NOT EXISTS click_txns_order ON click_txns (order_id);

-- allowed values
ALTER TABLE balances   ADD CONSTRAINT balances_not_negative CHECK (amount >= 0);
ALTER TABLE users      ADD CONSTRAINT users_lang CHECK (lang IN ('uz', 'ru', 'en'));
ALTER TABLE orders     ADD CONSTRAINT orders_state    CHECK (state IN ('new', 'review', 'paid', 'rejected', 'cancelled')),
                       ADD CONSTRAINT orders_provider CHECK (provider IN ('card', 'payme', 'click')),
                       ADD CONSTRAINT orders_amount   CHECK (amount > 0);
ALTER TABLE payme_txns ADD CONSTRAINT payme_state  CHECK (state IN (1, 2, -1, -2));
ALTER TABLE click_txns ADD CONSTRAINT click_state  CHECK (state IN ('prepared', 'paid', 'cancelled'));
ALTER TABLE jobs       ADD CONSTRAINT jobs_state   CHECK (state IN ('queued', 'running', 'done', 'failed')),
                       ADD CONSTRAINT jobs_kind    CHECK (kind IN ('generate', 'restyle')),
                       ADD CONSTRAINT jobs_price   CHECK (price >= 0);
ALTER TABLE pdf_drafts ADD CONSTRAINT pdf_stage    CHECK (stage IN ('collect', 'name'));

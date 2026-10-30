-- 0007: state that lived in one process's memory, so that the API can run as several processes.
-- Images -> PDF: which photo of an album answers "received: N" (only the last one; bot/pdf.py).
ALTER TABLE pdf_drafts ADD COLUMN IF NOT EXISTS ack_seq BIGINT NOT NULL DEFAULT 0;
-- Broadcasts are sent by the worker (services/broadcasts.py): queued -> running -> done; a restart resumes after last_user.
ALTER TABLE broadcasts ADD COLUMN IF NOT EXISTS last_user BIGINT NOT NULL DEFAULT 0;
ALTER TABLE broadcasts ALTER COLUMN state SET DEFAULT 'queued';
UPDATE broadcasts SET state = 'interrupted', finished = coalesce(finished, now()) WHERE state NOT IN ('done', 'interrupted');
ALTER TABLE broadcasts ADD CONSTRAINT broadcasts_state CHECK (state IN ('queued', 'running', 'done', 'interrupted'));
CREATE UNIQUE INDEX IF NOT EXISTS broadcasts_one_active ON broadcasts ((true)) WHERE state IN ('queued', 'running');

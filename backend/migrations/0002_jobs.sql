-- 0002: paid work (new deck / redraw) is a row here, done by the worker (python -m app.worker), not inside the
-- web process: a restart loses nothing, and only WORKER_CONCURRENCY jobs draw at the same time.
CREATE TABLE IF NOT EXISTS jobs (
    id BIGSERIAL PRIMARY KEY,
    kind TEXT NOT NULL,                      -- 'generate' | 'restyle'
    user_id BIGINT NOT NULL,
    payload JSONB NOT NULL,                  -- generate: the Mini App request; restyle: {deck_id, template_id}
    price BIGINT NOT NULL,                   -- what was charged: refunded as is if the job fails
    state TEXT NOT NULL DEFAULT 'queued',    -- queued -> running -> done | failed
    attempts INTEGER NOT NULL DEFAULT 0,
    error TEXT,
    created TIMESTAMPTZ NOT NULL DEFAULT now(),
    started TIMESTAMPTZ,
    finished TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS jobs_queued ON jobs (id) WHERE state = 'queued';
CREATE INDEX IF NOT EXISTS jobs_user ON jobs (user_id, created DESC);

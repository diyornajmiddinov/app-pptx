-- 0006: referat / mustaqil ish made on the website (services/papers.py). The files are kept on disk:
-- data/<user_id>/papers/<id>.docx and .pdf; this row holds what they were made from.
CREATE TABLE IF NOT EXISTS papers (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    topic TEXT NOT NULL,
    request JSONB NOT NULL,                       -- the order: title page, format, options
    content JSONB NOT NULL,                       -- the text: intro, chapters, conclusion, references
    pages INTEGER,                                -- counted from the PDF; NULL when it could not be laid out
    has_pdf BOOLEAN NOT NULL DEFAULT false,
    created TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE INDEX IF NOT EXISTS papers_user ON papers (user_id, created DESC);
ALTER TABLE jobs DROP CONSTRAINT IF EXISTS jobs_kind;
ALTER TABLE jobs ADD CONSTRAINT jobs_kind CHECK (kind IN ('generate', 'restyle', 'paper'));

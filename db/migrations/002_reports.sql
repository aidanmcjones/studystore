-- Problem reports and feature suggestions from the site form (functions/api/report.js).
-- Stores only the page path, category, type, the text typed and an optional card/question ref.
-- No email, IP, user agent or cookies. dedupe = sha256(page|kind|normalized message).
CREATE TABLE IF NOT EXISTS reports (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ts INTEGER NOT NULL,                 -- unix seconds (server time)
  type TEXT NOT NULL DEFAULT 'bug',    -- bug | feature
  page TEXT NOT NULL,                  -- path only, no query string
  kind TEXT NOT NULL,                  -- broken_link | wrong_content | typo | display | other | feature_content | feature_other
  message TEXT NOT NULL,               -- visitor text, 10 to 1500 chars, control chars stripped
  ref TEXT NOT NULL DEFAULT '',        -- optional card/question id, max 40 chars
  status TEXT NOT NULL DEFAULT 'new',  -- new | open | fixed | rejected | needs_human
  resolution TEXT NOT NULL DEFAULT '',
  updated INTEGER NOT NULL DEFAULT 0,
  requests INTEGER NOT NULL DEFAULT 1, -- times the same report was sent (duplicates within 7 days add 1)
  dedupe TEXT NOT NULL DEFAULT ''
);
CREATE INDEX IF NOT EXISTS reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS reports_dedupe ON reports(dedupe, ts);

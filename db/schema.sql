-- StudyStore analytics (D1: studystore_analytics). No PII, no IPs, no cookies.
CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ts INTEGER NOT NULL,            -- unix seconds (server time)
  sid TEXT NOT NULL,              -- random anonymous id from localStorage
  page TEXT NOT NULL,             -- path only, no query string
  exp TEXT NOT NULL DEFAULT '',   -- experiment id ('' for plain events)
  variant TEXT NOT NULL DEFAULT '',
  event TEXT NOT NULL,            -- view | cta_click | checkout_click | sampler_click
  ref_domain TEXT NOT NULL DEFAULT '',
  utm_source TEXT NOT NULL DEFAULT '',
  utm_campaign TEXT NOT NULL DEFAULT ''
);
CREATE INDEX IF NOT EXISTS events_exp ON events(exp, variant, event);
CREATE INDEX IF NOT EXISTS events_sid_ts ON events(sid, ts);
-- Purchases attributed through the Lemon Squeezy order_created webhook (meta.custom_data).
CREATE TABLE IF NOT EXISTS purchases (
  order_id TEXT PRIMARY KEY,
  ts INTEGER NOT NULL,
  custom TEXT NOT NULL DEFAULT '{}', -- JSON of exp_<id> -> variant only
  total INTEGER NOT NULL DEFAULT 0,  -- cents
  test_mode INTEGER NOT NULL DEFAULT 0
);
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

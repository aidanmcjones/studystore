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

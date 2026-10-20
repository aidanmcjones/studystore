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
  source TEXT NOT NULL DEFAULT 'public', -- owner | public (owner = valid X-Owner-Key)
  page TEXT NOT NULL,                  -- path only, no query string
  kind TEXT NOT NULL,                  -- broken_link | wrong_content | typo | display | other | feature_content | feature_other
  message TEXT NOT NULL,               -- visitor text, 10 to 1500 chars, control chars stripped
  ref TEXT NOT NULL DEFAULT '',        -- optional card/question id, max 40 chars
  status TEXT NOT NULL DEFAULT 'pending', -- pending | approved | in_progress | fixed | needs_human | rejected
  resolution TEXT NOT NULL DEFAULT '',
  updated INTEGER NOT NULL DEFAULT 0,
  requests INTEGER NOT NULL DEFAULT 1, -- times the same report was sent (duplicates within 7 days add 1)
  approval_note TEXT NOT NULL DEFAULT '', -- owner's note on approve or reject
  dedupe TEXT NOT NULL DEFAULT ''
);
CREATE INDEX IF NOT EXISTS reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS reports_dedupe ON reports(dedupe, ts);
-- Marketing outbox: ready-to-paste posts the owner works through on /admin/marketing.html, plus the
-- campaign registry. Items are upserted by ops/outbox.py (owner key); statuses are set by the owner.
CREATE TABLE IF NOT EXISTS outbox (
  id TEXT PRIMARY KEY,                 -- <campaign_id>-<nnn>
  campaign TEXT NOT NULL DEFAULT '',
  channel TEXT NOT NULL DEFAULT '',    -- reddit | discord | tiktok | shorts | reels | pinterest | x | threads | email | club | advisor | ankiweb | ih | ph | waitlist
  target TEXT NOT NULL DEFAULT '',
  target_url TEXT,
  title TEXT NOT NULL DEFAULT '',
  body TEXT NOT NULL DEFAULT '',
  link TEXT,
  asset_url TEXT,
  gate TEXT NOT NULL DEFAULT 'now',    -- now | launch
  notes TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'ready', -- ready | held | posted | skipped
  posted_url TEXT,
  created INTEGER NOT NULL DEFAULT 0,  -- unix seconds
  updated INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS outbox_status ON outbox(status, created);
CREATE INDEX IF NOT EXISTS outbox_campaign ON outbox(campaign);
CREATE TABLE IF NOT EXISTS campaigns (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL DEFAULT '',
  channel TEXT NOT NULL DEFAULT '',
  gate TEXT NOT NULL DEFAULT 'now',
  goal TEXT NOT NULL DEFAULT '',
  owner_step TEXT NOT NULL DEFAULT '',
  created TEXT NOT NULL DEFAULT ''     -- YYYY-MM-DD
);

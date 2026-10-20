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

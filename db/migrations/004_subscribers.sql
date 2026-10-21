-- Launch waitlist (functions/api/subscribe.js). Stores only what the visitor submits: email (lower-cased),
-- optional test month (YYYY-MM), the page path the form was on, first-touch utm_source/utm_campaign,
-- a status and a random unsubscribe token. No IP, user agent or cookies.
CREATE TABLE IF NOT EXISTS subscribers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ts INTEGER,                          -- unix seconds (server time) of signup
  email TEXT UNIQUE,                   -- lower-cased, max 254 chars
  exam_month TEXT,                     -- 'YYYY-MM' or '' (not sure / not given)
  source_page TEXT,                    -- path only, no query string
  utm_source TEXT,
  utm_campaign TEXT,
  status TEXT DEFAULT 'active',        -- active | pending (double opt-in not yet confirmed; never emailed) | reconfirm_sent | unsubscribed
  unsub_token TEXT                     -- crypto.randomUUID(), used by /api/unsubscribe?t=
);
CREATE INDEX IF NOT EXISTS subscribers_ts ON subscribers(ts);
CREATE UNIQUE INDEX IF NOT EXISTS subscribers_unsub ON subscribers(unsub_token);

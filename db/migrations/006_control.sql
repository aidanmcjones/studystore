-- Owner control switches (launch agent). One row per switch; value is JSON.
-- Row 'launch' drives the go button on /admin/launch.html and ops/launch.py in the private repo:
--   {"state": "idle|requested|running|done|failed", "requested_ts": unix, "steps": [...], "preflight": [...], "log": "..."}
CREATE TABLE IF NOT EXISTS control (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL DEFAULT '{}',
  ts INTEGER NOT NULL DEFAULT 0      -- unix seconds of the last write
);
INSERT OR IGNORE INTO control (key, value, ts) VALUES ('launch', '{"state":"idle","steps":[],"preflight":[]}', 0);

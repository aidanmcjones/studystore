-- Adds the owner-approval columns that 002 (first version) lacked. Safe on an empty or populated table.
ALTER TABLE reports ADD COLUMN source TEXT NOT NULL DEFAULT 'public';
ALTER TABLE reports ADD COLUMN approval_note TEXT NOT NULL DEFAULT '';
CREATE INDEX IF NOT EXISTS reports_source_status ON reports(source, status);

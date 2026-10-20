// /api/launch : owner-only launch switch for /admin/launch.html.
//   GET                     -> {ok, state, value, ts}   (the control row 'launch', or idle when missing)
//   POST {action:"go"}      -> state 'requested' with requested_ts, only from idle or failed (idempotent:
//                              any other state is returned unchanged with changed:false)
//   POST {action:"reset"}   -> state 'idle', allowed from any state except running
// The private launcher (ops/launch.py poll, every 5 minutes) picks up 'requested', runs the launch and
// writes steps[] and preflight[] back into the same row. Completed steps are kept on reset so a new GO
// resumes instead of repeating them. Requires X-Owner-Key (requireOwner); 401 otherwise.
import { requireOwner, json, empty } from "../_lib/owner.js";

const IDLE = { state: "idle", steps: [], preflight: [] };

async function readRow(env) {
  try {
    const row = await env.DB.prepare("SELECT value, ts FROM control WHERE key = 'launch'").first();
    if (!row) return { value: { ...IDLE }, ts: null, missing: false };
    let v;
    try { v = JSON.parse(row.value || "{}"); } catch (e) { v = {}; }
    if (!v || typeof v !== "object" || Array.isArray(v)) v = {};
    if (!v.state) v.state = "idle";
    return { value: v, ts: row.ts, missing: false };
  } catch (e) {
    // table not created yet (migration 006 not applied)
    return { value: { ...IDLE }, ts: null, missing: true };
  }
}

async function writeRow(env, value, prevTs) {
  const now = Math.floor(Date.now() / 1000);
  const s = JSON.stringify(value);
  if (prevTs == null) {
    const r = await env.DB.prepare("INSERT OR IGNORE INTO control (key, value, ts) VALUES ('launch', ?, ?)").bind(s, now).run();
    return (r && r.meta && r.meta.changes) || 0;
  }
  // optimistic: only if nobody (the launcher) wrote in between
  const r = await env.DB.prepare("UPDATE control SET value = ?, ts = ? WHERE key = 'launch' AND ts = ?").bind(s, now, prevTs).run();
  return (r && r.meta && r.meta.changes) || 0;
}

export async function onRequestGet({ request, env }) {
  const deny = await requireOwner(request, env);
  if (deny) return deny;
  const row = await readRow(env);
  return json(200, { ok: true, state: row.value.state, value: row.value, ts: row.ts,
    ...(row.missing ? { note: "control table missing: apply migration 006" } : {}) });
}

export async function onRequestPost({ request, env }) {
  const deny = await requireOwner(request, env);
  if (deny) return deny;
  let body;
  try { const raw = await request.text(); if (raw.length > 500) return json(413, { ok: false, error: "too_large" }); body = JSON.parse(raw); }
  catch (e) { return json(400, { ok: false, error: "bad_json" }); }
  const action = body && body.action;
  if (action !== "go" && action !== "reset") return json(400, { ok: false, error: "bad_action" });
  const row = await readRow(env);
  if (row.missing) return json(503, { ok: false, error: "control_table_missing", state: "idle" });
  const v = row.value, cur = v.state;
  let next = null;
  if (action === "go" && (cur === "idle" || cur === "failed")) {
    next = { ...v, state: "requested", requested_ts: Math.floor(Date.now() / 1000), log: "" };
  } else if (action === "reset" && cur !== "running" && cur !== "idle") {
    next = { ...v, state: "idle", log: "reset by owner" };
  }
  if (!next) return json(200, { ok: true, changed: false, state: cur, value: v });
  const changes = await writeRow(env, next, row.ts);
  if (!changes) {
    const again = await readRow(env);
    return json(409, { ok: false, error: "changed_meanwhile", state: again.value.state, value: again.value });
  }
  return json(200, { ok: true, changed: true, state: next.state, value: next });
}

export async function onRequest({ request }) {
  if (request.method === "OPTIONS") return empty(204);
  return new Response("GET or POST only", { status: 405, headers: { Allow: "GET, POST" } });
}

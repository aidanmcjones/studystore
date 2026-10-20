// /api/outbox : owner-only marketing posting queue for /admin/marketing.html and ops/outbox.py.
// GET  ?status=ready|held|posted|skipped|all (default ready). Returns the items (ready and held oldest
//      first by created; posted and skipped most recently updated first), counts per status, counts per
//      channel for the selected status, and "today": the suggested posts (oldest ready item per channel, max 5;
//      {id, channel, target, title} each).
// POST {items:[...]}      upserts outbox items by id. New rows get status ready (gate now) or held (gate
//                         launch). Existing rows keep status, posted_url and created; only content changes.
// POST {campaigns:[...]}  upserts campaign registry rows.
// POST {release_launch:true} moves every held item to ready (used by the launcher).
// Item text is returned as plain data; the admin page renders it with textContent only.
import { requireOwner, json, empty, stripControl } from "../_lib/owner.js";

export const CHANNELS = ["reddit", "discord", "tiktok", "shorts", "reels", "pinterest", "x", "threads", "snapchat", "facebook", "lemon8", "email",
  "club", "advisor", "ankiweb", "ih", "ph", "waitlist"];
const STATUSES = ["ready", "held", "posted", "skipped"];
const COLS = "id, campaign, channel, target, target_url, title, body, link, asset_url, gate, notes, status, posted_url, created, updated";
const MAX_BODY = 1_000_000, MAX_ITEMS = 500;
const ID_RE = /^[a-z0-9][a-z0-9-]{0,79}$/;

export async function onRequestGet({ request, env }) {
  const deny = await requireOwner(request, env);
  if (deny) return deny;
  const want = new URL(request.url).searchParams.get("status") || "ready";
  if (want !== "all" && !STATUSES.includes(want)) return json(400, { ok: false, error: "bad_status" });
  const order = want === "posted" || want === "skipped" ? "updated DESC, id DESC" : "created ASC, id ASC";
  const where = want === "all" ? "" : "WHERE status = ?";
  const listQ = env.DB.prepare(`SELECT ${COLS} FROM outbox ${where} ORDER BY ${order} LIMIT 1000`);
  const [items, byStatus, byChannel, ready] = await Promise.all([
    (want === "all" ? listQ : listQ.bind(want)).all(),
    env.DB.prepare("SELECT status, COUNT(*) AS n FROM outbox GROUP BY status").all(),
    env.DB.prepare("SELECT status, channel, COUNT(*) AS n FROM outbox GROUP BY status, channel").all(),
    env.DB.prepare("SELECT id, channel, target, title FROM outbox WHERE status = 'ready' ORDER BY created ASC, id ASC LIMIT 1000").all(),
  ]);
  const counts = { ready: 0, held: 0, posted: 0, skipped: 0 };
  for (const r of byStatus.results || []) counts[r.status] = r.n;
  const channels = {}, by_status_channel = {};
  for (const r of byChannel.results || []) {
    (by_status_channel[r.status] ||= {})[r.channel] = r.n;
    if (want === "all" || r.status === want) channels[r.channel] = (channels[r.channel] || 0) + r.n;
  }
  const today = [], seen = new Set();
  for (const r of ready.results || []) {
    if (seen.has(r.channel)) continue;
    seen.add(r.channel); today.push(r);
    if (today.length >= 5) break;
  }
  return json(200, { ok: true, status: want, items: items.results || [], counts, channels, by_status_channel, today });
}

const str = (v, max) => (v == null ? "" : stripControl(String(v)).slice(0, max));
const optUrl = (v, abs) => {
  if (v == null || v === "") return null;
  const s = String(v).trim();
  if (s.length > 1000) return undefined;
  if (abs ? /^https:\/\/[^\s]+$/.test(s) : /^(https:\/\/[^\s]+|\/[^\s]*)$/.test(s)) return s;
  return undefined;
};

export function cleanItem(it) {
  if (!it || typeof it !== "object") return { error: "not_an_object" };
  const id = String(it.id || "");
  if (!ID_RE.test(id)) return { error: "bad_id" };
  if (!CHANNELS.includes(it.channel)) return { error: "bad_channel", id };
  if (it.gate !== "now" && it.gate !== "launch") return { error: "bad_gate", id };
  const target_url = optUrl(it.target_url, true), link = optUrl(it.link, true), asset_url = optUrl(it.asset_url, false);
  if (target_url === undefined || link === undefined || asset_url === undefined) return { error: "bad_url", id };
  const body = str(it.body, 20000);
  if (!body) return { error: "empty_body", id };
  return { row: { id, campaign: str(it.campaign, 80), channel: it.channel, target: str(it.target, 200), target_url,
    title: str(it.title, 500), body, link, asset_url, gate: it.gate, notes: str(it.notes, 1000) } };
}

function cleanCampaign(c) {
  if (!c || typeof c !== "object" || !ID_RE.test(String(c.id || ""))) return { error: "bad_id" };
  if (c.channel && !CHANNELS.includes(c.channel)) return { error: "bad_channel", id: c.id };
  if (c.gate !== "now" && c.gate !== "launch") return { error: "bad_gate", id: c.id };
  return { row: { id: String(c.id), name: str(c.name, 200), channel: c.channel || "", gate: c.gate, goal: str(c.goal, 500),
    owner_step: str(c.owner_step, 500), created: /^\d{4}-\d{2}-\d{2}$/.test(String(c.created || "")) ? c.created : "" } };
}

const UPSERT_ITEM = "INSERT INTO outbox (id, campaign, channel, target, target_url, title, body, link, asset_url, gate, notes, status, posted_url, created, updated) " +
  "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, ?, ?) ON CONFLICT(id) DO UPDATE SET campaign = excluded.campaign, channel = excluded.channel, " +
  "target = excluded.target, target_url = excluded.target_url, title = excluded.title, body = excluded.body, link = excluded.link, " +
  "asset_url = excluded.asset_url, gate = excluded.gate, notes = excluded.notes, updated = excluded.updated";
const UPSERT_CAMPAIGN = "INSERT INTO campaigns (id, name, channel, gate, goal, owner_step, created) VALUES (?, ?, ?, ?, ?, ?, ?) " +
  "ON CONFLICT(id) DO UPDATE SET name = excluded.name, channel = excluded.channel, gate = excluded.gate, goal = excluded.goal, " +
  "owner_step = excluded.owner_step, created = excluded.created";

export async function onRequestPost({ request, env }) {
  const deny = await requireOwner(request, env);
  if (deny) return deny;
  const raw = await request.text();
  if (raw.length > MAX_BODY) return json(413, { ok: false, error: "too_large" });
  let b;
  try { b = JSON.parse(raw); } catch (e) { return json(400, { ok: false, error: "bad_json" }); }
  if (!b || typeof b !== "object") return json(400, { ok: false, error: "bad_json" });
  const ts = Math.floor(Date.now() / 1000);

  if (b.release_launch === true) {
    const r = await env.DB.prepare("UPDATE outbox SET status = 'ready', updated = ? WHERE status = 'held'").bind(ts).run();
    return json(200, { ok: true, released: (r && r.meta && r.meta.changes) || 0 });
  }
  const isItems = Array.isArray(b.items), isCamps = Array.isArray(b.campaigns);
  if (isItems === isCamps) return json(400, { ok: false, error: "send_items_or_campaigns" });
  const list = isItems ? b.items : b.campaigns;
  if (list.length > MAX_ITEMS) return json(413, { ok: false, error: "too_many" });
  const rows = [], errors = [];
  for (const x of list) {
    const c = isItems ? cleanItem(x) : cleanCampaign(x);
    if (c.error) errors.push({ id: c.id || (x && x.id) || null, error: c.error }); else rows.push(c.row);
  }
  if (errors.length) return json(400, { ok: false, error: "invalid_rows", errors });
  const stmts = rows.map((r) => isItems
    ? env.DB.prepare(UPSERT_ITEM).bind(r.id, r.campaign, r.channel, r.target, r.target_url, r.title, r.body, r.link,
      r.asset_url, r.gate, r.notes, r.gate === "launch" ? "held" : "ready", ts, ts)
    : env.DB.prepare(UPSERT_CAMPAIGN).bind(r.id, r.name, r.channel, r.gate, r.goal, r.owner_step, r.created));
  if (stmts.length) await env.DB.batch(stmts);
  return json(200, { ok: true, upserted: stmts.length, kind: isItems ? "items" : "campaigns" });
}

export async function onRequest({ request }) {
  if (request.method === "OPTIONS") return empty(204);
  return new Response("GET or POST only", { status: 405, headers: { Allow: "GET, POST" } });
}

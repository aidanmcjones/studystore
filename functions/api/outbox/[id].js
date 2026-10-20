// PATCH /api/outbox/<id> {status: "posted" | "skipped" | "ready", posted_url?} : owner-only status change for
// one outbox item. posted stores the optional https post URL; ready (undo, or release one held item) clears it.
import { requireOwner, json, empty } from "../../_lib/owner.js";

const ID_RE = /^[a-z0-9][a-z0-9-]{0,79}$/;

export async function onRequestPatch({ request, env, params }) {
  const deny = await requireOwner(request, env);
  if (deny) return deny;
  const id = String(params.id || "");
  if (!ID_RE.test(id)) return json(400, { ok: false, error: "bad_id" });
  const raw = await request.text();
  if (raw.length > 4096) return json(413, { ok: false, error: "too_large" });
  let b;
  try { b = JSON.parse(raw); } catch (e) { return json(400, { ok: false, error: "bad_json" }); }
  const status = b && b.status;
  if (!["posted", "skipped", "ready"].includes(status)) return json(400, { ok: false, error: "bad_status" });
  let url = b.posted_url == null ? "" : String(b.posted_url).trim();
  if (url && (url.length > 1000 || !/^https:\/\/[^\s]+$/.test(url))) return json(400, { ok: false, error: "bad_posted_url" });
  const ts = Math.floor(Date.now() / 1000);
  let r;
  if (status === "posted") {
    r = await env.DB.prepare("UPDATE outbox SET status = 'posted', posted_url = ?, updated = ? WHERE id = ?").bind(url || null, ts, id).run();
  } else if (status === "ready") {
    r = await env.DB.prepare("UPDATE outbox SET status = 'ready', posted_url = NULL, updated = ? WHERE id = ?").bind(ts, id).run();
  } else {
    r = await env.DB.prepare("UPDATE outbox SET status = 'skipped', updated = ? WHERE id = ?").bind(ts, id).run();
  }
  const changed = (r && r.meta && r.meta.changes) || 0;
  if (!changed) return json(404, { ok: false, error: "not_found" });
  return json(200, { ok: true, id, status });
}

export async function onRequest({ request }) {
  if (request.method === "OPTIONS") return empty(204);
  return new Response("PATCH only", { status: 405, headers: { Allow: "PATCH" } });
}

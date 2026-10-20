// GET /api/reports : owner-only list for /admin/reports.html.
// Requires X-Owner-Key (sha256 must match the OWNER_KEY_SHA256 Pages secret); 401 otherwise.
// Returns pending public reports to approve or reject, the approved/in-progress work queue, and
// the most recent resolved items with their resolutions. Report text is returned as plain data;
// the admin page renders it with textContent only.
import { requireOwner, json, empty } from "../_lib/owner.js";

const COLS = "id, ts, type, source, page, kind, message, ref, status, resolution, updated, requests, approval_note";

export async function onRequestGet({ request, env }) {
  const deny = await requireOwner(request, env);
  if (deny) return deny;
  const q = (where, order, n) => env.DB.prepare(`SELECT ${COLS} FROM reports WHERE ${where} ORDER BY ${order} LIMIT ${n}`).all();
  const [pending, queue, recent] = await Promise.all([
    q("status = 'pending'", "id ASC", 200),
    q("status IN ('approved','in_progress')", "id ASC", 200),
    q("status IN ('fixed','needs_human','rejected')", "updated DESC, id DESC", 50),
  ]);
  return json(200, { ok: true, pending: pending.results || [], queue: queue.results || [], recent: recent.results || [] });
}

export async function onRequest({ request }) {
  if (request.method === "OPTIONS") return empty(204);
  return new Response("GET only", { status: 405, headers: { Allow: "GET" } });
}

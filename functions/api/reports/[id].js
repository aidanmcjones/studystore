// POST /api/reports/<id> {action: "approve" | "reject", note?} : owner-only approval of a public report.
// approve: pending -> approved (the autofix job picks it up). reject: pending or approved -> rejected.
// The optional note (max 200 chars) is stored as approval_note; the job reads "build" in it as the
// owner's go-ahead to build a public feature_other request instead of adding it to the backlog.
import { requireOwner, json, empty, stripControl } from "../../_lib/owner.js";

export async function onRequestPost({ request, env, params }) {
  const deny = await requireOwner(request, env);
  if (deny) return deny;
  const id = String(params.id || "");
  if (!/^[0-9]{1,10}$/.test(id)) return json(400, { ok: false, error: "bad_id" });
  const raw = await request.text();
  if (raw.length > 1024) return json(413, { ok: false, error: "too_large" });
  let b;
  try { b = JSON.parse(raw); } catch (e) { return json(400, { ok: false, error: "bad_json" }); }
  const action = b && b.action;
  const note = typeof b.note === "string" ? stripControl(b.note).slice(0, 200) : "";
  const ts = Math.floor(Date.now() / 1000);
  let r;
  if (action === "approve") {
    r = await env.DB.prepare("UPDATE reports SET status = 'approved', approval_note = ?, updated = ? WHERE id = ? AND status = 'pending'")
      .bind(note, ts, Number(id)).run();
  } else if (action === "reject") {
    r = await env.DB.prepare("UPDATE reports SET status = 'rejected', resolution = ?, updated = ? WHERE id = ? AND status IN ('pending','approved')")
      .bind(note || "rejected by owner", ts, Number(id)).run();
  } else {
    return json(400, { ok: false, error: "bad_action" });
  }
  const changed = (r && r.meta && r.meta.changes) || 0;
  if (!changed) return json(409, { ok: false, error: "not_in_a_state_for_that_action" });
  return json(200, { ok: true, id: Number(id), status: action === "approve" ? "approved" : "rejected" });
}

export async function onRequest({ request }) {
  if (request.method === "OPTIONS") return empty(204);
  return new Response("POST only", { status: 405, headers: { Allow: "POST" } });
}

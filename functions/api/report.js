// POST /api/report : "Report a problem or suggest something" intake for StudyStore.
// Stores only: server timestamp, page path, category (kind), type (bug or feature), source
// (public or owner), the text the visitor typed, an optional short card/question reference, and a
// one-way dedupe hash of page + kind + normalized message. Never stores IPs, user agents, emails
// or cookies. Public reports start 'pending' and wait for the owner's approval; reports sent with a
// valid X-Owner-Key start 'approved' and are picked up by the private autofix job.
// Accepts JSON (fetch from assets/js/report.js) or a plain form post (the no-JS /report.html page,
// answered with a 303 back to /report.html#sent or #rerror, shown by CSS :target).
import { sha256hex, ownerStatus, overLimit, stripControl, empty, json } from "../_lib/owner.js";

export const BUG_KINDS = ["broken_link", "wrong_content", "typo", "display", "other"];
export const FEATURE_KINDS = ["feature_content", "feature_other"];
const KINDS = new Set([...BUG_KINDS, ...FEATURE_KINDS]);
const MAX_BODY = 4096;
const MIN_MSG = 10, MAX_MSG = 1500;
const PUBLIC_PER_MIN = 5, PUBLIC_PER_DAY = 20, OWNER_PER_HOUR = 60;
const DEDUPE_SECS = 7 * 86400;
const BOT = /bot|crawl|spider|slurp|preview|headless|lighthouse|facebookexternalhit|curl|wget|python-requests|httpclient/i;
const PAGE_RE = /^\/(?:[A-Za-z0-9._\-]+\/)*[A-Za-z0-9._\-]*$/;  // sitemap-style path (Pages also serves it without .html)
const REF_RE = /^[A-Za-z0-9 _.\-]{1,40}$/;

export function normalizeMessage(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

// Accept "/notes/x.html" or a full https://(www.)studystore.co URL; return the path or "".
export function normalizePage(p) {
  if (typeof p !== "string") return "";
  p = p.trim();
  const m = p.match(/^https?:\/\/(?:www\.)?(?:studystore\.co|studystore\.pages\.dev)(\/\S*)?$/i);
  if (m) p = m[1] || "/";
  p = p.split(/[?#]/)[0];
  if (p.length > 200 || !PAGE_RE.test(p) || p.includes("..")) return "";
  return p;
}

export function validate(b) {
  if (!b || typeof b !== "object" || Array.isArray(b)) return { error: "bad_request" };
  if (b.hp != null && String(b.hp).trim() !== "") return { honeypot: true };
  const page = normalizePage(b.page);
  if (!page) return { error: "bad_page" };
  const kind = typeof b.kind === "string" && KINDS.has(b.kind) ? b.kind : "";
  if (!kind) return { error: "bad_kind" };
  const message = typeof b.message === "string" ? stripControl(b.message) : "";
  if (message.length < MIN_MSG) return { error: "message_too_short" };
  if (message.length > MAX_MSG) return { error: "message_too_long" };
  const ref = typeof b.ref === "string" ? stripControl(b.ref) : "";
  if (ref && !REF_RE.test(ref)) return { error: "bad_ref" };
  const type = FEATURE_KINDS.includes(kind) ? "feature" : "bug";
  return { page, kind, type, message, ref };
}

const back = (url, frag) =>
  new Response(null, { status: 303, headers: { "Cache-Control": "no-store", Location: new URL("/report.html#" + frag, url).toString() } });

export async function onRequestPost({ request, env }) {
  const ctype = (request.headers.get("Content-Type") || "").toLowerCase();
  const isForm = ctype.startsWith("application/x-www-form-urlencoded");
  const fail = (status, error) => (isForm ? back(request.url, "rerror") : json(status, { ok: false, error }));
  const done = (owner) => (isForm ? back(request.url, "sent") : owner ? json(200, { ok: true, owner: true }) : empty(204));

  const who = await ownerStatus(request, env);
  if (who === "bad") return fail(401, "bad_owner_key");
  const owner = who === "owner";
  const ip = request.headers.get("CF-Connecting-IP") || "";
  if (owner) {
    if (await overLimit("owner", "o-h", 3600, OWNER_PER_HOUR)) return fail(429, "rate_limited");
  } else {
    if ((await overLimit(ip, "p-m", 60, PUBLIC_PER_MIN)) || (await overLimit(ip, "p-d", 86400, PUBLIC_PER_DAY)))
      return fail(429, "rate_limited");
    if (BOT.test(request.headers.get("User-Agent") || "")) return done(false);
  }
  const len = Number(request.headers.get("Content-Length") || 0);
  if (len > MAX_BODY) return fail(413, "too_large");
  const raw = await request.text();
  if (raw.length > MAX_BODY) return fail(413, "too_large");

  let b;
  try {
    b = isForm ? Object.fromEntries(new URLSearchParams(raw)) : JSON.parse(raw);
  } catch (e) { return fail(400, "bad_json"); }
  const v = validate(b);
  if (v.honeypot) return done(false);    // pretend success, store nothing
  if (v.error) return fail(400, v.error);

  const ts = Math.floor(Date.now() / 1000);
  const source = owner ? "owner" : "public";
  const dedupe = await sha256hex(v.page + "|" + v.kind + "|" + normalizeMessage(v.message));
  const dup = await env.DB.prepare("SELECT id, source, status FROM reports WHERE dedupe = ? AND ts > ? ORDER BY id DESC LIMIT 1")
    .bind(dedupe, ts - DEDUPE_SECS).first();
  if (dup) {
    // Same report again within 7 days: count it, store nothing new. An owner resend of a still
    // pending public report approves it.
    if (owner && dup.status === "pending") {
      await env.DB.prepare("UPDATE reports SET requests = requests + 1, status = 'approved', updated = ?, approval_note = 'owner resent' WHERE id = ?")
        .bind(ts, dup.id).run();
    } else {
      await env.DB.prepare("UPDATE reports SET requests = requests + 1 WHERE id = ?").bind(dup.id).run();
    }
    return done(owner);
  }
  await env.DB.prepare(
    "INSERT INTO reports (ts, type, source, page, kind, message, ref, status, dedupe) VALUES (?,?,?,?,?,?,?,?,?)")
    .bind(ts, v.type, source, v.page, v.kind, v.message, v.ref, owner ? "approved" : "pending", dedupe).run();
  return done(owner);
}

export async function onRequest({ request }) {
  if (request.method === "OPTIONS") return empty(204);
  return new Response("POST only", { status: 405, headers: { Allow: "POST" } });
}

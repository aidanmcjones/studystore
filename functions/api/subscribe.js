// POST /api/subscribe : launch waitlist signup (the "Get launch day access" box, assets/js/waitlist.js).
// Stores only what the visitor submits: email (lower-cased), an optional 2027 test month, the page path
// the form was on, first-touch utm_source/utm_campaign, a status and a random unsubscribe token.
// Never stores IPs, user agents or cookies, and never returns anything about other subscribers:
// every accepted request answers {ok:true}, whether the address is new or already on the list.
// Accepts JSON (fetch from waitlist.js) or a plain form post (no-JS fallback, answered with a small
// HTML confirmation page).
import { empty, json } from "../_lib/owner.js";
import { normalizePage } from "./report.js";

export const MAX_BODY = 2048;
export const EXAM_MONTHS = ["2027-01", "2027-02", "2027-03", "2027-04", "2027-05", "2027-06", "2027-07", "2027-08", "2027-09"];
const EMAIL_RE = /^[a-z0-9.!#$%&'*+\/=?^_`{|}~-]{1,64}@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*\.[a-z]{2,24}$/;
const UTM_RE = /^[A-Za-z0-9_.\-]{1,60}$/;
const BOT = /bot|crawl|spider|slurp|preview|headless|lighthouse|facebookexternalhit|curl|wget|python-requests|httpclient/i;

export function normalizeEmail(s) {
  if (typeof s !== "string") return "";
  const e = s.trim().toLowerCase();
  if (e.length > 254 || !EMAIL_RE.test(e) || e.includes("..")) return "";
  return e;
}

const utm = (s) => (typeof s === "string" && UTM_RE.test(s) ? s : "");

export function validate(b) {
  if (!b || typeof b !== "object" || Array.isArray(b)) return { error: "bad_request" };
  if (b.hp != null && String(b.hp).trim() !== "") return { honeypot: true };
  const email = normalizeEmail(b.email);
  if (!email) return { error: "bad_email" };
  const exam_month = EXAM_MONTHS.includes(b.exam_month) ? b.exam_month : "";  // "Not sure" or anything else -> ""
  const source_page = normalizePage(b.source_page) || "";
  return { email, exam_month, source_page, utm_source: utm(b.utm_source), utm_campaign: utm(b.utm_campaign) };
}

const PAGE = (title, msg) => new Response(
  `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex"><title>${title} | StudyStore</title><link rel="stylesheet" href="/assets/style.css"></head>
<body><main class="wrap narrow legal"><h1>${title}</h1><p>${msg}</p><p><a href="/">Back to StudyStore</a> &middot; <a href="/notes/index.html">Free notes</a></p></main></body></html>`,
  { status: 200, headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex", "Content-Type": "text/html; charset=utf-8" } });

export async function onRequestPost({ request, env }) {
  const ctype = (request.headers.get("Content-Type") || "").toLowerCase();
  const isForm = ctype.startsWith("application/x-www-form-urlencoded");
  const fail = (status, error) => (isForm
    ? PAGE("Please check your email address", "That address did not look right. Go back and try again.")
    : json(status, { ok: false, error }));
  const done = () => (isForm
    ? PAGE("You are on the list", "We will send one email when checkout opens. Unsubscribe anytime from the link in that email.")
    : json(200, { ok: true }));

  const len = Number(request.headers.get("Content-Length") || 0);
  if (len > MAX_BODY) return fail(413, "too_large");
  const raw = await request.text();
  if (raw.length > MAX_BODY) return fail(413, "too_large");
  if (BOT.test(request.headers.get("User-Agent") || "")) return done();

  let b;
  try {
    b = isForm ? Object.fromEntries(new URLSearchParams(raw)) : JSON.parse(raw);
  } catch (e) { return fail(400, "bad_json"); }
  // No-JS form posts carry no source_page field; fall back to the Referer path.
  if (b && typeof b === "object" && !b.source_page) b.source_page = request.headers.get("Referer") || "";
  const v = validate(b);
  if (v.honeypot) return done();         // pretend success, store nothing
  if (v.error) return fail(400, v.error);

  const ts = Math.floor(Date.now() / 1000);
  const res = await env.DB.prepare(
    "INSERT OR IGNORE INTO subscribers (ts, email, exam_month, source_page, utm_source, utm_campaign, status, unsub_token) VALUES (?,?,?,?,?,?,'active',?)")
    .bind(ts, v.email, v.exam_month, v.source_page, v.utm_source, v.utm_campaign, crypto.randomUUID()).run();
  if (!(res && res.meta && res.meta.changes)) {
    // Already on the list. A visitor who unsubscribed and signs up again is re-activated (fresh consent).
    await env.DB.prepare("UPDATE subscribers SET status = 'active' WHERE email = ? AND status = 'unsubscribed'").bind(v.email).run();
  }
  return done();
}

export async function onRequest({ request }) {
  if (request.method === "OPTIONS") return empty(204);
  return new Response("POST only", { status: 405, headers: { Allow: "POST" } });
}

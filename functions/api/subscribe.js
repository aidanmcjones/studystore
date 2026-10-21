// POST /api/subscribe : same-origin side of the free sampler opt-in (waitlist.py box, assets/js/waitlist.js).
//
// Double opt-in lives in the income-brain Worker (marketing/SPEC-shared.md section 2, list studystore-mcat).
// The browser posts the brain contract straight to the brain; this function is the path for
//   (a) no-JS form posts (application/x-www-form-urlencoded), and
//   (b) the JS fallback when the brain could not be reached or is not live yet.
// It forwards the same contract to the brain server side. A 202 from the brain means a confirm email is on
// its way. If the brain is unreachable or answers anything but 202/400/429 (for example 501 before the
// email-kit ships), the address is kept in D1 `subscribers` with status 'pending' and the consent text the
// visitor saw (no new column: 'pending' rows saw CONSENT_TEXTS[0], 'active' rows the legacy text). Pending rows get exactly one confirm email later through ops/reconfirm_subscribers.py in the
// private repo, and they are never emailed by ops/launch.py (it reads status 'active' only).
//
// Legacy shape (email, exam_month, source_page, utm_source, utm_campaign, hp) from the pre-double-opt-in box
// is still accepted from cached pages and stored as before (status 'active', single opt-in); the
// re-confirmation pass covers those rows too.
//
// Stores only what the visitor submits; never IPs, user agents or cookies; never reveals whether an address
// is already known: every accepted request gets the same answer.
import { empty, json } from "../_lib/owner.js";
import { normalizePage } from "./report.js";

export const MAX_BODY = 2048;
export const BRAIN_SUBSCRIBE_URL = "https://income-brain.premed-toolkit.workers.dev/api/subscribe";
export const LIST_ID = "studystore-mcat";
// Consent texts this site has shown. The first is the current box (waitlist.py CONSENT_TEXT, verbatim).
export const CONSENT_TEXTS = [
  "Email me free MCAT notes, practice sets and new packs from StudyStore. Double opt-in, unsubscribe in one click.",
];
export const LEGACY_CONSENT_TEXT = "Only emails about new packs and free notes. Unsubscribe anytime.";
export const EXAM_MONTHS = ["2027-01", "2027-02", "2027-03", "2027-04", "2027-05", "2027-06", "2027-07", "2027-08", "2027-09"];
const EMAIL_RE = /^[a-z0-9.!#$%&'*+\/=?^_`{|}~-]{1,64}@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*\.[a-z]{2,24}$/;
const UTM_RE = /^[A-Za-z0-9_.\-]{1,60}$/;
const BOT = /bot|crawl|spider|slurp|preview|headless|lighthouse|facebookexternalhit|curl|wget|python-requests|httpclient/i;
const SITE_ORIGIN = "https://www.studystore.co";

export function normalizeEmail(s) {
  if (typeof s !== "string") return "";
  const e = s.trim().toLowerCase();
  if (e.length > 254 || !EMAIL_RE.test(e) || e.includes("..")) return "";
  return e;
}

const utm = (s) => (typeof s === "string" && UTM_RE.test(s) ? s : "");

// https://www.studystore.co/<path> only, no query or hash; anything else falls back to the site root.
export function normalizeSourceUrl(s) {
  try {
    const u = new URL(String(s || ""));
    if (u.protocol !== "https:" || !/^(www\.)?studystore\.co$/.test(u.hostname)) return SITE_ORIGIN + "/";
    return SITE_ORIGIN + (normalizePage(u.pathname) || "/");
  } catch (e) { return SITE_ORIGIN + "/"; }
}

// A body in the brain contract shape (has list_id or consent_text or a utm object)?
export const isContract = (b) => !!b && typeof b === "object" && ("list_id" in b || "consent_text" in b || (b.utm && typeof b.utm === "object"));

export function validate(b) {
  if (!b || typeof b !== "object" || Array.isArray(b)) return { error: "bad_request" };
  if (isContract(b)) {
    if (String(b.website ?? "").trim() !== "" || String(b.hp ?? "").trim() !== "") return { honeypot: true };
    const email = normalizeEmail(b.email);
    if (!email) return { error: "bad_email" };
    if (b.list_id !== LIST_ID) return { error: "bad_list" };
    if (!CONSENT_TEXTS.includes(b.consent_text)) return { error: "bad_consent" };
    // Flat utm_* fields come from no-JS form posts; the utm object from JSON.
    const u = b.utm && typeof b.utm === "object" ? b.utm : { source: b.utm_source, medium: b.utm_medium, campaign: b.utm_campaign };
    return { contract: true, email, list_id: LIST_ID, consent_text: b.consent_text, source_url: normalizeSourceUrl(b.source_url),
      utm: { source: utm(u.source), medium: utm(u.medium), campaign: utm(u.campaign) } };
  }
  if (b.hp != null && String(b.hp).trim() !== "") return { honeypot: true };
  const email = normalizeEmail(b.email);
  if (!email) return { error: "bad_email" };
  const exam_month = EXAM_MONTHS.includes(b.exam_month) ? b.exam_month : "";  // "Not sure" or anything else -> ""
  const source_page = normalizePage(b.source_page) || "";
  return { email, exam_month, source_page, utm_source: utm(b.utm_source), utm_campaign: utm(b.utm_campaign) };
}

// Forward one validated contract body to the brain. Returns "ok" | "bad_email" | "rate_limited" | "unavailable".
export async function forward(v, env, ip, fetcher = fetch) {
  const url = (env && env.BRAIN_SUBSCRIBE_URL) || BRAIN_SUBSCRIBE_URL;
  const headers = { "Content-Type": "application/json", "Origin": SITE_ORIGIN, "User-Agent": "studystore-pages-subscribe/1" };
  if (ip) headers["X-Forwarded-For"] = ip;
  try {
    const r = await fetcher(url, { method: "POST", headers, body: JSON.stringify({ email: v.email, list_id: v.list_id,
      consent_text: v.consent_text, source_url: v.source_url, utm: v.utm, website: "" }) });
    if (r.status === 202 || r.status === 200) return "ok";
    if (r.status === 400) return "bad_email";
    if (r.status === 429) return "rate_limited";
    return "unavailable";
  } catch (e) { return "unavailable"; }
}

const PAGE = (title, msg, status = 200) => new Response(
  `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex"><title>${title} | StudyStore</title><link rel="stylesheet" href="/assets/style.css"></head>
<body><main class="wrap narrow legal"><h1>${title}</h1><p>${msg}</p><p><a href="/">Back to StudyStore</a> &middot; <a href="/notes/index.html">Free notes</a></p></main></body></html>`,
  { status, headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex", "Content-Type": "text/html; charset=utf-8" } });

const MSG = {
  ok: ["Check your email", "We sent a link to confirm your address. Nothing else is sent until you click it."],
  pending: ["You are on the list", "Before we send anything else, we will email you a link to confirm your address."],
  legacy: ["You are on the list", "We will only email you about StudyStore packs and free notes. Unsubscribe anytime from the link in any email."],
  rate_limited: ["Please try again later", "Too many tries from this connection. Wait a few minutes and try again."],
  bad: ["Please check your email address", "That address did not look right. Go back and try again."],
};

export async function onRequestPost({ request, env }, fetcher) {
  const ctype = (request.headers.get("Content-Type") || "").toLowerCase();
  const isForm = ctype.startsWith("application/x-www-form-urlencoded");
  const answer = (kind) => {
    if (isForm) return PAGE(...(MSG[kind] || MSG.bad), kind === "rate_limited" ? 429 : 200);
    if (kind === "ok") return json(202, { ok: true, status: "check_email" });
    if (kind === "pending") return json(202, { ok: true, status: "pending" });
    if (kind === "legacy") return json(200, { ok: true });
    if (kind === "rate_limited") return json(429, { ok: false, error: "rate_limited" });
    return json(400, { ok: false, error: kind });
  };

  const len = Number(request.headers.get("Content-Length") || 0);
  if (len > MAX_BODY) return isForm ? PAGE(...MSG.bad) : json(413, { ok: false, error: "too_large" });
  const raw = await request.text();
  if (raw.length > MAX_BODY) return isForm ? PAGE(...MSG.bad) : json(413, { ok: false, error: "too_large" });

  let b;
  try {
    b = isForm ? Object.fromEntries(new URLSearchParams(raw)) : JSON.parse(raw);
  } catch (e) { return isForm ? PAGE(...MSG.bad) : json(400, { ok: false, error: "bad_json" }); }
  const contract = isContract(b);
  if (BOT.test(request.headers.get("User-Agent") || "")) return answer(contract ? "ok" : "legacy");
  // No-JS posts carry no page field; fall back to the Referer.
  if (b && typeof b === "object") {
    if (contract && !b.source_url) b.source_url = request.headers.get("Referer") || "";
    if (!contract && !b.source_page) b.source_page = request.headers.get("Referer") || "";
  }
  const v = validate(b);
  if (v.honeypot) return answer(contract ? "ok" : "legacy");   // pretend success, store and send nothing
  if (v.error) return answer(v.error);
  const ts = Math.floor(Date.now() / 1000);

  if (v.contract) {
    const res = await forward(v, env, request.headers.get("CF-Connecting-IP") || "", fetcher || fetch);
    if (res === "ok" || res === "bad_email" || res === "rate_limited") return answer(res);
    // Brain unavailable: keep the address pending (never emailed until the one confirm email).
    const page = new URL(v.source_url).pathname;
    const ins = await env.DB.prepare(
      "INSERT OR IGNORE INTO subscribers (ts, email, exam_month, source_page, utm_source, utm_campaign, status, unsub_token) VALUES (?,?,?,?,?,?,'pending',?)")
      .bind(ts, v.email, "", page, v.utm.source, v.utm.campaign, crypto.randomUUID()).run();
    if (!(ins && ins.meta && ins.meta.changes)) {
      // Known address: someone who unsubscribed and signs up again gives fresh consent (pending, never active).
      await env.DB.prepare("UPDATE subscribers SET status = 'pending' WHERE email = ? AND status = 'unsubscribed'").bind(v.email).run();
    }
    return answer("pending");
  }

  const res = await env.DB.prepare(
    "INSERT OR IGNORE INTO subscribers (ts, email, exam_month, source_page, utm_source, utm_campaign, status, unsub_token) VALUES (?,?,?,?,?,?,'active',?)")
    .bind(ts, v.email, v.exam_month, v.source_page, v.utm_source, v.utm_campaign, crypto.randomUUID()).run();
  if (!(res && res.meta && res.meta.changes)) {
    await env.DB.prepare("UPDATE subscribers SET status = 'active' WHERE email = ? AND status = 'unsubscribed'").bind(v.email).run();
  }
  return answer("legacy");
}

export async function onRequest({ request }) {
  if (request.method === "OPTIONS") return empty(204);
  return new Response("POST only", { status: 405, headers: { Allow: "POST" } });
}

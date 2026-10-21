// Unit tests for the launch waitlist Pages Functions (subscribe, unsubscribe, owner stats/export).
// Run: node tests/subscribe_test.mjs   (Node 22.5+, no dependencies; D1 is emulated with node:sqlite
// running the real migration db/migrations/004_subscribers.sql)
import { readFileSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import * as sub from "../functions/api/subscribe.js";
import * as unsub from "../functions/api/unsubscribe.js";
import * as stats from "../functions/api/subscribers.js";
import { _resetCounters, sha256hex } from "../functions/_lib/owner.js";

const OWNER_KEY = "test-owner-key-" + "y".repeat(40);   // test value only
let pass = 0, fail = 0;
const ok = (cond, name) => { if (cond) pass++; else { fail++; console.log("FAIL:", name); } };

// Minimal D1 emulation over a real SQLite database.
function d1() {
  const db = new DatabaseSync(":memory:");
  db.exec(readFileSync(new URL("../db/migrations/004_subscribers.sql", import.meta.url), "utf8"));
  return {
    db,
    prepare(sql) {
      let args = [];
      const st = {
        bind(...a) { args = a; return st; },
        async all() { return { results: db.prepare(sql).all(...args) }; },
        async first() { return db.prepare(sql).get(...args) || null; },
        async run() { const r = db.prepare(sql).run(...args); return { meta: { changes: Number(r.changes) } }; },
      };
      return st;
    },
  };
}

const DB = d1();
const env = { DB, OWNER_KEY_SHA256: await sha256hex(OWNER_KEY) };
const rows = () => DB.db.prepare("SELECT * FROM subscribers ORDER BY id").all();

function req(body, o = {}) {
  const headers = new Headers({ "Content-Type": o.ctype || "application/json", "User-Agent": o.ua || "Mozilla/5.0" });
  if (o.key) headers.set("X-Owner-Key", o.key);
  if (o.referer) headers.set("Referer", o.referer);
  const method = o.method || "POST";
  const raw = typeof body === "string" ? body : JSON.stringify(body);
  return new Request(o.url || "https://www.studystore.co/api/subscribe", { method, headers, body: method === "GET" ? undefined : raw });
}
const post = (b, o) => { _resetCounters(); return sub.onRequestPost({ request: req(b, o), env }); };

// --- validation helpers
ok(sub.normalizeEmail("  Jane.Doe+mcat@Example.COM ") === "jane.doe+mcat@example.com", "email lower-cased and trimmed");
ok(sub.normalizeEmail("no-at-sign") === "", "email without @ rejected");
ok(sub.normalizeEmail("a@b") === "", "email without tld rejected");
ok(sub.normalizeEmail("a b@c.com") === "", "email with space rejected");
ok(sub.normalizeEmail("a@" + "x".repeat(250) + ".com") === "", "email over 254 rejected");
ok(sub.normalizeEmail("<script>@x.com") === "", "email with angle brackets rejected");

// --- happy path
let r = await post({ email: "Student@Example.com", exam_month: "2027-04", source_page: "/notes/x.html", utm_source: "reddit", utm_campaign: "r-ankimcat-1", hp: "" });
let j = await r.json();
ok(r.status === 202 && j.ok === true && j.status === "pending" && Object.keys(j).length === 2, "legacy body: 202 pending, never single opt-in");
let all = rows();
ok(all.length === 1 && all[0].email === "student@example.com", "row stored lower-cased");
ok(all[0].exam_month === "2027-04" && all[0].source_page === "/notes/x.html", "month and source page stored");
ok(all[0].utm_source === "reddit" && all[0].utm_campaign === "r-ankimcat-1", "utm stored");
ok(all[0].status === "pending_legacy" && /^[0-9a-f-]{36}$/.test(all[0].unsub_token), "legacy row stored pending_legacy (saw the legacy consent text) with uuid token");

// duplicate: same answer, no new row, token unchanged
const tok = all[0].unsub_token;
r = await post({ email: "STUDENT@example.com", exam_month: "2027-09" });
j = await r.json();
ok(r.status === 202 && j.status === "pending", "duplicate gets identical answer");
ok(rows().length === 1 && rows()[0].unsub_token === tok && rows()[0].exam_month === "2027-04", "duplicate stores nothing");

// bad inputs
r = await post({ email: "nope" }); j = await r.json();
ok(r.status === 400 && j.error === "bad_email", "bad email 400");
r = await post({ email: "x@y.co", exam_month: "2030-01", source_page: "javascript:alert(1)", utm_source: "a b<c>" });
ok(r.status === 202, "junk optional fields tolerated");
const x = rows().find((q) => q.email === "x@y.co");
ok(x && x.exam_month === "" && x.source_page === "" && x.utm_source === "", "junk optional fields stored empty");
r = await post({ email: "hp@y.co", hp: "i am a bot" }); j = await r.json();
ok(r.status === 202 && j.ok === true && !rows().some((q) => q.email === "hp@y.co"), "honeypot: silent success, nothing stored");
r = await post({ email: "big@y.co", pad: "z".repeat(3000) });
ok(r.status === 413 && !rows().some((q) => q.email === "big@y.co"), "body over 2KB rejected");
r = await post("{not json");
ok(r.status === 400, "bad json 400");
r = await post({ email: "bot@y.co" }, { ua: "Googlebot/2.1" });
ok(r.status === 202 && !rows().some((q) => q.email === "bot@y.co"), "bot UA: silent success, nothing stored");

// no-JS form post: HTML answer, source page from Referer
r = await post("email=form%40y.co&exam_month=&hp=", { ctype: "application/x-www-form-urlencoded", referer: "https://www.studystore.co/products/1a-amino-acids-proteins.html?utm_source=x" });
ok(r.status === 200 && (r.headers.get("Content-Type") || "").startsWith("text/html"), "form post answers HTML");
ok(rows().find((q) => q.email === "form@y.co").source_page === "/products/1a-amino-acids-proteins.html", "form post source page from Referer path");

r = await sub.onRequest({ request: req(null, { method: "GET" }) });
ok(r.status === 405, "GET subscribe 405");

// --- unsubscribe
const ureq = (t, m = "GET") => new Request("https://www.studystore.co/api/unsubscribe?t=" + encodeURIComponent(t), { method: m });
r = await unsub.onRequestGet({ request: ureq(tok), env });
let h = await r.text();
ok(r.status === 200 && /unsubscribed/i.test(h) && !h.includes("student@"), "unsubscribe ok, no email echoed");
ok(rows()[0].status === "unsubscribed", "status set unsubscribed");
r = await unsub.onRequestGet({ request: ureq("not-a-token"), env });
ok(r.status === 400, "malformed token 400");
r = await unsub.onRequestGet({ request: ureq("00000000-0000-4000-8000-000000000000"), env });
ok(r.status === 404, "unknown token 404");
r = await unsub.onRequestPost({ request: ureq(tok, "POST"), env });
ok(r.status === 200, "one-click POST unsubscribe ok");
// re-joining re-activates
r = await post({ email: "student@example.com" });
ok(rows()[0].status === "pending_legacy", "legacy re-subscribe after unsubscribe goes to pending_legacy, never straight to active");
// confirmed rows (what ops/reconfirm or the old list leaves as active) for the owner stats below
DB.db.prepare("UPDATE subscribers SET status = 'active'").run();

// --- owner stats
_resetCounters();
const sreq = (q = "", key) => stats.onRequestGet({ request: req(null, { method: "GET", url: "https://www.studystore.co/api/subscribers" + q, key }), env });
r = await sreq("");
ok(r.status === 401, "stats without key 401");
r = await sreq("?export=csv");
ok(r.status === 401, "csv without key 401");
r = await sreq("", "wrong-key-" + "q".repeat(40));
ok(r.status === 401, "stats with wrong key 401");
r = await sreq("", OWNER_KEY); j = await r.json();
ok(r.status === 200 && j.ok, "stats with key 200");
ok(j.totals.total === 3 && j.totals.active === 3, "totals count");
ok(j.by_day.length === 14 && j.by_day[13].n === 3, "14 days, today has the signups");
ok(j.by_source_page.some((q) => q.k === "/notes/x.html" && q.n === 1), "by source page");
ok(j.by_utm_source.some((q) => q.k === "reddit") && j.by_utm_source.some((q) => q.k === "(none)" && q.n === 2), "by utm_source");
ok(!JSON.stringify(j).includes("@"), "stats JSON has no emails");
DB.db.prepare("UPDATE subscribers SET status='unsubscribed', utm_campaign='=HYPERLINK(1)' WHERE email='x@y.co'").run();
DB.db.prepare("UPDATE subscribers SET utm_campaign='=SUM(1)' WHERE email='form@y.co'").run();
r = await sreq("?export=csv", OWNER_KEY); h = await r.text();
ok(r.status === 200 && (r.headers.get("Content-Type") || "").startsWith("text/csv"), "csv content type");
ok(/attachment; filename="studystore-subscribers-\d{4}-\d{2}-\d{2}\.csv"/.test(r.headers.get("Content-Disposition") || ""), "csv download name");
const lines = h.trim().split("\r\n");
ok(lines[0] === "email,exam_month,source_page,utm_source,utm_campaign,signed_up_utc" && lines.length === 3, "csv has header + active rows only");
ok(!h.includes("x@y.co"), "unsubscribed excluded from csv");
ok(h.includes(`"'=SUM(1)"`), "csv formula neutralized");

// --- double opt-in contract (marketing/SPEC-shared.md section 2): forward to the brain, pending fallback
const CONSENT = "Email me free MCAT notes, practice sets and new packs from StudyStore. Double opt-in, unsubscribe in one click.";
ok(sub.CONSENT_TEXTS[0] === CONSENT, "consent allowlist holds the verbatim box text");
const wl = readFileSync(new URL("../waitlist.py", import.meta.url), "utf8");
ok(wl.includes('"Email me free MCAT notes, practice sets and new packs from StudyStore. "') && wl.includes('"Double opt-in, unsubscribe in one click."'), "waitlist.py CONSENT_TEXT matches the allowlist");
const sent = [];
const brainBody = (status) => (status === 400 ? JSON.stringify({ error: { code: "bad_email", message: "x" } }) : "{}");
const fakeBrain = (status, body) => async (url, init) => { sent.push({ url, init, body: JSON.parse(init.body) }); return new Response(body ?? brainBody(status), { status }); };
const cpost = (b, status, o = {}) => { _resetCounters(); return sub.onRequestPost({ request: req(b, o), env }, typeof status === "function" ? status : fakeBrain(status)); };
const cbody = (e, extra = {}) => ({ email: e, list_id: "studystore-mcat", consent_text: CONSENT, source_url: "https://www.studystore.co/notes/x.html?utm_source=reddit#q1",
  utm: { source: "reddit", medium: "", campaign: "c-1" }, website: "", ...extra });

r = await cpost(cbody("Brain@Example.com"), 202); j = await r.json();
ok(r.status === 202 && j.ok === true && j.status === "check_email", "brain 202 -> 202 check_email");
let fw = sent.at(-1);
ok(fw.url === sub.BRAIN_SUBSCRIBE_URL && fw.init.method === "POST", "forwarded to the brain endpoint");
ok(fw.body.email === "brain@example.com" && fw.body.list_id === "studystore-mcat" && fw.body.consent_text === CONSENT, "forward body: email, list, verbatim consent");
ok(fw.body.source_url === "https://www.studystore.co/notes/x.html" && fw.body.utm.source === "reddit" && fw.body.utm.campaign === "c-1" && fw.body.website === "", "forward body: clean source_url, utm, empty honeypot");
ok(Object.keys(fw.body).sort().join() === "consent_text,email,list_id,source_url,utm,website", "forward body has exactly the contract fields");
ok(!rows().some((q) => q.email === "brain@example.com"), "brain accepted: nothing stored in D1");

r = await cpost(cbody("down@example.com"), 501); j = await r.json();
ok(r.status === 202 && j.status === "pending", "brain 501 -> pending answer");
let pr = rows().find((q) => q.email === "down@example.com");
ok(pr && pr.status === "pending" && pr.source_page === "/notes/x.html" && pr.utm_campaign === "c-1", "brain 501 -> stored pending with page and utm");
r = await cpost(cbody("down@example.com"), 501); j = await r.json();
ok(r.status === 202 && j.status === "pending" && rows().filter((q) => q.email === "down@example.com").length === 1, "pending duplicate: same answer, one row");
r = await cpost(cbody("throw@example.com"), async () => { throw new Error("network"); }); j = await r.json();
ok(r.status === 202 && rows().find((q) => q.email === "throw@example.com").status === "pending", "brain unreachable -> pending");

r = await cpost(cbody("bad@example.com"), 400); j = await r.json();
ok(r.status === 400 && j.error === "bad_email" && !rows().some((q) => q.email === "bad@example.com"), "brain 400 -> 400, nothing stored");
r = await cpost(cbody("slow@example.com"), 429); j = await r.json();
ok(r.status === 202 && j.status === "pending" && rows().find((q) => q.email === "slow@example.com").status === "pending", "brain 429 (shared egress IP) -> kept pending, not lost");
r = await cpost(cbody("turn@example.com"), fakeBrain(400, JSON.stringify({ error: { code: "turnstile_required" } }))); j = await r.json();
ok(r.status === 202 && j.status === "pending" && rows().some((q) => q.email === "turn@example.com"), "brain 400 that is not bad_email -> pending, not a bad-email error");
r = await cpost(cbody("list@example.com"), fakeBrain(400, JSON.stringify({ error: { code: "unknown_list" } }))); j = await r.json();
ok(j.status === "pending", "brain 400 unknown_list -> pending");
ok(sent.at(-1).init.signal !== undefined, "brain fetch carries a timeout signal");
ok(!("X-Forwarded-For" in sent.at(-1).init.headers), "no misleading X-Forwarded-For");
// the same-origin path has its own per-visitor limit (5 a minute)
_resetCounters();
let codes = [];
for (let i = 0; i < 7; i++) codes.push((await sub.onRequestPost({ request: req(cbody("rl" + i + "@example.com"), {}), env }, fakeBrain(202))).status);
ok(codes.slice(0, 5).every((c) => c === 202) && codes.slice(5).every((c) => c === 429), "per-visitor limit: 5 a minute, then 429");

let n0 = sent.length;
r = await cpost(cbody("bot2@example.com", { website: "http://spam" }), 202); j = await r.json();
ok(r.status === 202 && sent.length === n0 && !rows().some((q) => q.email === "bot2@example.com"), "website honeypot: silent 202, not forwarded, not stored");
r = await cpost(cbody("x2@example.com", { consent_text: "Something else" }), 202); j = await r.json();
ok(r.status === 400 && j.error === "bad_consent" && sent.length === n0, "unknown consent text rejected, not forwarded");
r = await cpost(cbody("x3@example.com", { list_id: "wages-updates" }), 202); j = await r.json();
ok(r.status === 400 && j.error === "bad_list" && sent.length === n0, "other list rejected");
r = await cpost(cbody("x4@example.com", { source_url: "https://evil.example/x" }), 202);
ok(sent.at(-1).body.source_url === "https://www.studystore.co/", "foreign source_url replaced by the site root");
r = await cpost(cbody("not-an-email"), 202); j = await r.json();
ok(r.status === 400 && j.error === "bad_email", "contract bad email 400");

// no-JS form post in the contract shape (waitlist.py box without JS)
const form = new URLSearchParams({ email: "nojs@example.com", list_id: "studystore-mcat", consent_text: CONSENT, source_url: "", utm_source: "pinterest", utm_medium: "", utm_campaign: "pins-1", website: "" }).toString();
r = await cpost(form, 202, { ctype: "application/x-www-form-urlencoded", referer: "https://www.studystore.co/tools/mcat-study-schedule.html?x=1" });
h = await r.text();
ok(r.status === 200 && /Check your email/.test(h), "no-JS form, brain 202: check your email page");
ok(sent.at(-1).body.source_url === "https://www.studystore.co/tools/mcat-study-schedule.html" && sent.at(-1).body.utm.source === "pinterest", "no-JS form: Referer source_url, flat utm fields");
r = await cpost(form.replace("nojs%40", "nojs2%40"), 501, { ctype: "application/x-www-form-urlencoded" });
h = await r.text();
ok(r.status === 200 && /You are on the list/.test(h) && rows().find((q) => q.email === "nojs2@example.com").status === "pending", "no-JS form, brain down: pending page and row");
// re-signup after unsubscribe through the contract stays pending (never active without a confirm)
DB.db.prepare("UPDATE subscribers SET status='unsubscribed' WHERE email='down@example.com'").run();
await cpost(cbody("down@example.com"), 503);
ok(rows().find((q) => q.email === "down@example.com").status === "pending", "contract re-signup after unsubscribe -> pending, not active");

console.log(`${pass} passed, ${fail} failed`);
if (fail) process.exit(1);

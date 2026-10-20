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
const post = (b, o) => sub.onRequestPost({ request: req(b, o), env });

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
ok(r.status === 200 && j.ok === true && Object.keys(j).length === 1, "subscribe returns exactly {ok:true}");
let all = rows();
ok(all.length === 1 && all[0].email === "student@example.com", "row stored lower-cased");
ok(all[0].exam_month === "2027-04" && all[0].source_page === "/notes/x.html", "month and source page stored");
ok(all[0].utm_source === "reddit" && all[0].utm_campaign === "r-ankimcat-1", "utm stored");
ok(all[0].status === "active" && /^[0-9a-f-]{36}$/.test(all[0].unsub_token), "active with uuid token");

// duplicate: same answer, no new row, token unchanged
const tok = all[0].unsub_token;
r = await post({ email: "STUDENT@example.com", exam_month: "2027-09" });
j = await r.json();
ok(r.status === 200 && j.ok === true && Object.keys(j).length === 1, "duplicate gets identical answer");
ok(rows().length === 1 && rows()[0].unsub_token === tok && rows()[0].exam_month === "2027-04", "duplicate stores nothing");

// bad inputs
r = await post({ email: "nope" }); j = await r.json();
ok(r.status === 400 && j.error === "bad_email", "bad email 400");
r = await post({ email: "x@y.co", exam_month: "2030-01", source_page: "javascript:alert(1)", utm_source: "a b<c>" });
ok(r.status === 200, "junk optional fields tolerated");
const x = rows().find((q) => q.email === "x@y.co");
ok(x && x.exam_month === "" && x.source_page === "" && x.utm_source === "", "junk optional fields stored empty");
r = await post({ email: "hp@y.co", hp: "i am a bot" }); j = await r.json();
ok(r.status === 200 && j.ok === true && !rows().some((q) => q.email === "hp@y.co"), "honeypot: silent 200, nothing stored");
r = await post({ email: "big@y.co", pad: "z".repeat(3000) });
ok(r.status === 413 && !rows().some((q) => q.email === "big@y.co"), "body over 2KB rejected");
r = await post("{not json");
ok(r.status === 400, "bad json 400");
r = await post({ email: "bot@y.co" }, { ua: "Googlebot/2.1" });
ok(r.status === 200 && !rows().some((q) => q.email === "bot@y.co"), "bot UA: silent 200, nothing stored");

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
ok(rows()[0].status === "active", "re-subscribe re-activates");

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

console.log(`${pass} passed, ${fail} failed`);
if (fail) process.exit(1);

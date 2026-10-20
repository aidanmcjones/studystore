// Unit tests for the report intake and owner approval Pages Functions.
// Run: node tests/functions_test.mjs   (Node 22+, no dependencies; D1 is mocked in memory)
import * as report from "../functions/api/report.js";
import * as list from "../functions/api/reports.js";
import * as action from "../functions/api/reports/[id].js";
import { _resetCounters, sha256hex } from "../functions/_lib/owner.js";

const OWNER_KEY = "test-owner-key-" + "x".repeat(40);   // test value only
let pass = 0, fail = 0;
const ok = (cond, name) => { if (cond) pass++; else { fail++; console.log("FAIL:", name); } };

function mockDB() {
  const rows = [];
  let next = 1;
  const db = {
    rows,
    prepare(sql) {
      let args = [];
      const st = {
        bind(...a) { args = a; return st; },
        async first() { return (await st.all()).results[0] || null; },
        async all() {
          if (/^SELECT id, source, status FROM reports WHERE dedupe = \? AND ts > \?/.test(sql)) {
            return { results: rows.filter((r) => r.dedupe === args[0] && r.ts > args[1]).sort((a, b) => b.id - a.id).slice(0, 1) };
          }
          const m = sql.match(/^SELECT .* FROM reports WHERE (.*) ORDER BY/);
          if (m) {
            const where = m[1];
            const want = [...where.matchAll(/'([a-z_]+)'/g)].map((x) => x[1]);
            return { results: rows.filter((r) => want.includes(r.status)) };
          }
          throw new Error("unmocked SQL: " + sql);
        },
        async run() {
          let changes = 0;
          if (sql.startsWith("INSERT INTO reports")) {
            const [ts, type, source, page, kind, message, ref, status, dedupe] = args;
            rows.push({ id: next++, ts, type, source, page, kind, message, ref, status, dedupe, resolution: "", updated: 0, requests: 1, approval_note: "" });
            changes = 1;
          } else if (sql.startsWith("UPDATE reports SET requests = requests + 1, status = 'approved'")) {
            const r = rows.find((x) => x.id === args[1]); if (r) { r.requests++; r.status = "approved"; r.updated = args[0]; changes = 1; }
          } else if (sql.startsWith("UPDATE reports SET requests = requests + 1")) {
            const r = rows.find((x) => x.id === args[0]); if (r) { r.requests++; changes = 1; }
          } else if (sql.startsWith("UPDATE reports SET status = 'approved'")) {
            const r = rows.find((x) => x.id === args[2] && x.status === "pending");
            if (r) { r.status = "approved"; r.approval_note = args[0]; r.updated = args[1]; changes = 1; }
          } else if (sql.startsWith("UPDATE reports SET status = 'rejected'")) {
            const r = rows.find((x) => x.id === args[2] && ["pending", "approved"].includes(x.status));
            if (r) { r.status = "rejected"; r.resolution = args[0]; r.updated = args[1]; changes = 1; }
          } else throw new Error("unmocked SQL: " + sql);
          return { meta: { changes } };
        },
      };
      return st;
    },
  };
  return db;
}

let ipN = 0;
function req(body, { ip, ua = "Mozilla/5.0 Test", key, form = false, url = "https://www.studystore.co/api/report", method = "POST" } = {}) {
  const headers = { "CF-Connecting-IP": ip || "10.0.0." + (++ipN), "User-Agent": ua,
    "Content-Type": form ? "application/x-www-form-urlencoded" : "application/json" };
  if (key) headers["X-Owner-Key"] = key;
  const raw = body == null ? undefined : form ? new URLSearchParams(body).toString() : typeof body === "string" ? body : JSON.stringify(body);
  return new Request(url, { method, headers, body: method === "GET" ? undefined : raw });
}

const env = { DB: mockDB(), OWNER_KEY_SHA256: await sha256hex(OWNER_KEY) };
const post = (b, o) => report.onRequestPost({ request: req(b, o), env });
const good = { page: "/notes/glycolysis-steps-enzymes-net-atp.html", kind: "typo", message: "The third paragraph says hexokinsae instead of hexokinase.", hp: "" };

// public, valid
let r = await post(good);
ok(r.status === 204, "valid public report returns 204");
ok(env.DB.rows.length === 1 && env.DB.rows[0].status === "pending" && env.DB.rows[0].source === "public" && env.DB.rows[0].type === "bug", "public report stored pending/public/bug");
ok(!("ip" in env.DB.rows[0]) && !Object.values(env.DB.rows[0]).some((v) => String(v).includes("10.0.0.")), "no IP stored");
ok(/^[0-9a-f]{64}$/.test(env.DB.rows[0].dedupe), "dedupe is sha256 hex");
// honeypot
r = await post({ ...good, message: "Totally different message here", hp: "http://spam" });
ok(r.status === 204 && env.DB.rows.length === 1, "honeypot answered 204 and not stored");
// too short / long / bad kind / bad page / bad ref
r = await post({ ...good, message: "short" });
ok(r.status === 400 && (await r.json()).error === "message_too_short", "too short is 400 message_too_short");
r = await post({ ...good, message: "x".repeat(1501) });
ok(r.status === 413 || r.status === 400, "too long rejected (" + r.status + ")");
r = await post({ ...good, kind: "delete_everything" });
ok(r.status === 400 && (await r.json()).error === "bad_kind", "bad kind is 400");
r = await post({ ...good, page: "javascript:alert(1)" });
ok(r.status === 400, "bad page is 400");
r = await post({ ...good, page: "/../etc/passwd" });
ok(r.status === 400, "dot-dot page is 400");
r = await post({ ...good, message: "Card id field has a bad value in it", ref: "<script>" });
ok(r.status === 400 && (await r.json()).error === "bad_ref", "bad ref is 400");
r = await post("{not json");
ok(r.status === 400, "bad JSON is 400");
// duplicate (same page+kind+normalized message, different case/punctuation)
r = await post({ ...good, message: "the third paragraph says HEXOKINSAE instead of hexokinase!!" });
ok(r.status === 204 && env.DB.rows.length === 1 && env.DB.rows[0].requests === 2, "duplicate within 7 days: 204, not stored, requests=2");
// control chars stripped, full URL normalized, feature type
r = await post({ page: "https://www.studystore.co/practice/1a-enzyme-inhibition-allosteric-regulation?x=1#q3", kind: "feature_content",
                 message: "Please add a practice page on\u0000 allosteric​ regulation of PFK-1", ref: "Q3" });
const fr = env.DB.rows.at(-1);
ok(r.status === 204 && fr.type === "feature" && fr.page === "/practice/1a-enzyme-inhibition-allosteric-regulation" && !/[\u0000​]/.test(fr.message) && fr.ref === "Q3",
   "feature stored with type=feature, path normalized, control chars stripped");
// bot UA: silently 204, nothing stored
const n0 = env.DB.rows.length;
r = await post({ ...good, message: "A bot message that should be dropped" }, { ua: "Googlebot/2.1" });
ok(r.status === 204 && env.DB.rows.length === n0, "bot UA dropped with 204");
// public rate limit: 5 per minute per IP
_resetCounters();
let codes = [];
for (let i = 0; i < 7; i++) codes.push((await post({ ...good, message: "Rate limit test message number " + i }, { ip: "192.0.2.9" })).status);
ok(codes.slice(0, 5).every((c) => c === 204) && codes[5] === 429 && codes[6] === 429, "6th public report in a minute is 429: " + codes.join(","));
// owner: valid key -> approved, owner, 200; skips public limit
_resetCounters();
codes = [];
for (let i = 0; i < 8; i++) codes.push((await post({ ...good, kind: "display", message: "Owner display report number " + i }, { ip: "192.0.2.10", key: OWNER_KEY })).status);
ok(codes.every((c) => c === 200), "owner skips the 5/min public limit: " + codes.join(","));
const orow = env.DB.rows.at(-1);
ok(orow.source === "owner" && orow.status === "approved", "owner report stored source=owner status=approved");
// owner cap 60/hour
_resetCounters();
let last = 0;
for (let i = 0; i < 61; i++) last = (await post({ ...good, kind: "other", message: "Owner cap message " + i }, { key: OWNER_KEY })).status;
ok(last === 429, "61st owner report in an hour is 429");
_resetCounters();
// bad key -> 401, nothing stored
const n1 = env.DB.rows.length;
r = await post({ ...good, message: "Message with a wrong owner key" }, { key: "wrong-key-" + "y".repeat(40) });
ok(r.status === 401 && env.DB.rows.length === n1, "bad owner key is 401 and not stored");
r = await post({ ...good, message: "Message with a short owner key" }, { key: "short" });
ok(r.status === 401, "short owner key is 401");
const envNoSecret = { DB: mockDB() };
r = await report.onRequestPost({ request: req({ ...good }, { key: OWNER_KEY }), env: envNoSecret });
ok(r.status === 401 && envNoSecret.DB.rows.length === 0, "owner key without the secret configured is 401");
// owner resend of a pending public report approves it
const pubMsg = { ...good, kind: "wrong_content", message: "The Km value in question 2 looks wrong to me" };
await post(pubMsg);
const pend = env.DB.rows.at(-1);
await post(pubMsg, { key: OWNER_KEY });
ok(pend.status === "approved" && pend.requests === 2, "owner resend of a pending public report approves it");
// form post (no JS): 303 to #sent / #rerror
r = await post({ ...good, message: "No-JS form post about a typo here" }, { form: true });
ok(r.status === 303 && r.headers.get("Location").endsWith("/report.html#sent"), "form post success is 303 to #sent");
r = await post({ ...good, message: "tiny" }, { form: true });
ok(r.status === 303 && r.headers.get("Location").endsWith("/report.html#rerror"), "form post failure is 303 to #rerror");
// body cap
r = await post(JSON.stringify({ ...good, message: "z".repeat(5000) }));
ok(r.status === 413, "body over 4 KB is 413");
// GET on report is 405
r = await report.onRequest({ request: req(null, { method: "GET" }) });
ok(r.status === 405, "GET /api/report is 405");

// ---- admin API ----
const get = (o) => list.onRequestGet({ request: req(null, { method: "GET", url: "https://www.studystore.co/api/reports", ...o }), env });
r = await get({});
ok(r.status === 401, "GET /api/reports without key is 401");
r = await get({ key: "wrong-key-" + "y".repeat(40) });
ok(r.status === 401, "GET /api/reports with bad key is 401");
r = await get({ key: OWNER_KEY });
const lj = await r.json();
ok(r.status === 200 && lj.pending.every((x) => x.status === "pending") && lj.pending.length >= 1 && lj.queue.every((x) => ["approved", "in_progress"].includes(x.status)),
   "GET /api/reports with key lists pending and queue");
const act = (id, body, key) => action.onRequestPost({ request: req(body, { url: "https://www.studystore.co/api/reports/" + id, key }), env, params: { id: String(id) } });
const pid = lj.pending[0].id;
r = await act(pid, { action: "approve", note: "build" });
ok(r.status === 401, "approve without key is 401");
r = await act(pid, { action: "approve", note: "build" }, "wrong-key-" + "y".repeat(40));
ok(r.status === 401, "approve with bad key is 401");
r = await act(pid, { action: "approve", note: "build" }, OWNER_KEY);
ok(r.status === 200 && env.DB.rows.find((x) => x.id === pid).status === "approved" && env.DB.rows.find((x) => x.id === pid).approval_note === "build", "approve sets approved + note");
r = await act(pid, { action: "approve" }, OWNER_KEY);
ok(r.status === 409, "approving a non-pending report is 409");
r = await act(pid, { action: "reject", note: "not a defect" }, OWNER_KEY);
ok(r.status === 200 && env.DB.rows.find((x) => x.id === pid).status === "rejected", "reject sets rejected");
r = await act(pid, { action: "nuke" }, OWNER_KEY);
ok(r.status === 400, "bad action is 400");
r = await act("1;DROP", { action: "approve" }, OWNER_KEY);
ok(r.status === 400, "non-integer id is 400");

console.log(`functions tests: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);

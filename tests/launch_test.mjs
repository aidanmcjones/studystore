// Unit tests for the owner-only launch switch (functions/api/launch.js).
// Run: node tests/launch_test.mjs   (Node 22+, no dependencies; D1 is mocked in memory)
import * as launch from "../functions/api/launch.js";
import { _resetCounters, sha256hex } from "../functions/_lib/owner.js";

const OWNER_KEY = "test-owner-key-" + "x".repeat(40);   // test value only
let pass = 0, fail = 0;
const ok = (cond, name) => { if (cond) pass++; else { fail++; console.log("FAIL:", name); } };

function mockDB({ missing = false } = {}) {
  const db = { row: null, missing, prepare(sql) {
    let args = [];
    const st = {
      bind(...a) { args = a; return st; },
      async first() {
        if (db.missing) throw new Error("no such table: control");
        if (sql.startsWith("SELECT value, ts FROM control")) return db.row ? { ...db.row } : null;
        throw new Error("unmocked SQL: " + sql);
      },
      async run() {
        if (db.missing) throw new Error("no such table: control");
        if (sql.startsWith("INSERT OR IGNORE INTO control")) {
          if (db.row) return { meta: { changes: 0 } };
          db.row = { value: args[0], ts: args[1] }; return { meta: { changes: 1 } };
        }
        if (sql.startsWith("UPDATE control SET value = ?, ts = ? WHERE key = 'launch' AND ts = ?")) {
          if (!db.row || db.row.ts !== args[2]) return { meta: { changes: 0 } };
          db.row = { value: args[0], ts: args[1] }; return { meta: { changes: 1 } };
        }
        throw new Error("unmocked SQL: " + sql);
      } };
    return st;
  } };
  return db;
}
let ipN = 0;
function req(method, body, key = OWNER_KEY) {
  const headers = { "CF-Connecting-IP": "10.1.0." + (++ipN), "Content-Type": "application/json" };
  if (key) headers["X-Owner-Key"] = key;
  return new Request("https://www.studystore.co/api/launch", { method, headers, body: method === "GET" ? undefined : JSON.stringify(body) });
}
const H = await sha256hex(OWNER_KEY);
const env = { DB: mockDB(), OWNER_KEY_SHA256: H };
const get = async (e = env, key) => (await launch.onRequestGet({ request: req("GET", null, key), env: e }));
const post = async (b, e = env, key) => (await launch.onRequestPost({ request: req("POST", b, key), env: e }));

let r = await get(env, null);
ok(r.status === 401, "GET without key is 401");
r = await post({ action: "go" }, env, "wrong-" + "y".repeat(40));
ok(r.status === 401, "POST with bad key is 401");
let j = await (await get()).json();
ok(j.ok && j.state === "idle" && j.ts === null, "no row: GET returns idle");
j = await (await post({ action: "go" })).json();
ok(j.ok && j.changed && j.state === "requested" && JSON.parse(env.DB.row.value).requested_ts > 0, "go from idle (no row) sets requested with requested_ts");
j = await (await post({ action: "go" })).json();
ok(j.ok && j.changed === false && j.state === "requested", "second go is idempotent");
// launcher takes it: running, with preflight and steps
env.DB.row = { value: JSON.stringify({ state: "running", steps: [{ name: "deploy", status: "done" }], preflight: [{ name: "x", ok: true }] }), ts: 1000 };
j = await (await post({ action: "reset" })).json();
ok(j.changed === false && j.state === "running", "reset refused while running");
j = await (await post({ action: "go" })).json();
ok(j.changed === false && j.state === "running", "go while running returns current state");
env.DB.row = { value: JSON.stringify({ state: "failed", steps: [{ name: "deploy", status: "done" }], preflight: [{ name: "x", ok: false }], log: "store not active" }), ts: 2000 };
j = await (await post({ action: "go" })).json();
const v = JSON.parse(env.DB.row.value);
ok(j.changed && v.state === "requested" && v.steps.length === 1 && v.preflight.length === 1 && v.log === "", "go from failed keeps steps and preflight, clears log");
j = await (await post({ action: "reset" })).json();
ok(j.changed && JSON.parse(env.DB.row.value).state === "idle", "reset from requested sets idle");
j = await (await post({ action: "reset" })).json();
ok(j.changed === false, "reset from idle is a no-op");
r = await post({ action: "launch-the-missiles" });
ok(r.status === 400, "bad action is 400");
// optimistic write: launcher wrote in between
env.DB.row = { value: JSON.stringify({ state: "idle" }), ts: 3000 };
const origPrepare = env.DB.prepare.bind(env.DB);
let bumped = false;
env.DB.prepare = (sql) => { const st = origPrepare(sql); if (sql.startsWith("UPDATE") && !bumped) { bumped = true; env.DB.row.ts = 3001; } return st; };
r = await post({ action: "go" });
ok(r.status === 409, "concurrent write gives 409");
env.DB.prepare = origPrepare;
// table missing
const envM = { DB: mockDB({ missing: true }), OWNER_KEY_SHA256: H };
j = await (await get(envM)).json();
ok(j.ok && j.state === "idle" && /006/.test(j.note), "missing table: GET idle with migration note");
r = await post({ action: "go" }, envM);
ok(r.status === 503, "missing table: POST is 503");

console.log(`launch tests: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);

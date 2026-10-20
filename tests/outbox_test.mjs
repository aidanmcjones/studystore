// Unit tests for the owner-only marketing outbox API (functions/api/outbox.js and outbox/[id].js).
// Run: node tests/outbox_test.mjs   (Node 22.5+, no dependencies; D1 is emulated with node:sqlite
// running the real migration db/migrations/005_outbox.sql)
import { readFileSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import * as outbox from "../functions/api/outbox.js";
import * as one from "../functions/api/outbox/[id].js";
import { _resetCounters, sha256hex } from "../functions/_lib/owner.js";

const OWNER_KEY = "test-owner-key-" + "x".repeat(40);   // test value only
let pass = 0, fail = 0;
const ok = (cond, name) => { if (cond) pass++; else { fail++; console.log("FAIL:", name); } };

function d1() {
  const db = new DatabaseSync(":memory:");
  db.exec(readFileSync(new URL("../db/migrations/005_outbox.sql", import.meta.url), "utf8"));
  const wrap = (sql) => {
    let args = [];
    const st = {
      bind(...a) { args = a; return st; },
      async all() { return { results: db.prepare(sql).all(...args).map((r) => ({ ...r })) }; },
      async first() { return (await st.all()).results[0] || null; },
      async run() { const r = db.prepare(sql).run(...args); return { meta: { changes: Number(r.changes) } }; },
    };
    return st;
  };
  return { raw: db, prepare: wrap, async batch(stmts) { const out = []; for (const s of stmts) out.push(await s.run()); return out; } };
}

let ipN = 0;
function req(method, url, body, key) {
  const headers = { "CF-Connecting-IP": "10.1.0." + (++ipN % 250), "Content-Type": "application/json" };
  if (key) headers["X-Owner-Key"] = key;
  return new Request("https://www.studystore.co" + url, { method, headers, body: body == null ? undefined : JSON.stringify(body) });
}
const env = { DB: d1(), OWNER_KEY_SHA256: await sha256hex(OWNER_KEY) };
const get = (qs = "", key = OWNER_KEY) => outbox.onRequestGet({ request: req("GET", "/api/outbox" + qs, null, key), env });
const post = (b, key = OWNER_KEY) => outbox.onRequestPost({ request: req("POST", "/api/outbox", b, key), env });
const patch = (id, b, key = OWNER_KEY) => one.onRequestPatch({ request: req("PATCH", "/api/outbox/" + id, b, key), env, params: { id } });
const row = (id) => env.DB.raw.prepare("SELECT * FROM outbox WHERE id = ?").get(id);

const item = (n, channel, gate = "now", extra = {}) => ({ id: "camp-a-" + String(n).padStart(3, "0"), campaign: "camp-a", channel,
  target: "r/AnkiMCAT", target_url: "https://www.reddit.com/r/AnkiMCAT/submit", title: "Title " + n, body: "Body " + n + "\nline two",
  link: "https://www.studystore.co/?utm_source=" + channel + "&utm_campaign=camp-a", asset_url: n % 2 ? "/media/a.mp4" : null,
  gate, notes: "check rules", ...extra });

// auth
let r = await get("", null);
ok(r.status === 401, "GET without key is 401");
r = await post({ items: [item(1, "reddit")] }, "wrong-key-" + "y".repeat(40));
ok(r.status === 401, "POST with bad key is 401");
r = await patch("camp-a-001", { status: "posted" }, null);
ok(r.status === 401, "PATCH without key is 401");

// upsert items
r = await post({ items: [item(1, "reddit"), item(2, "reddit"), item(3, "tiktok"), item(4, "discord", "launch")] });
let j = await r.json();
ok(r.status === 200 && j.upserted === 4, "POST items upserts 4");
ok(row("camp-a-001").status === "ready" && row("camp-a-004").status === "held", "gate now -> ready, launch -> held");
r = await post({ items: [item(5, "myspace")] });
j = await r.json();
ok(r.status === 400 && j.errors[0].error === "bad_channel", "unknown channel rejected");
r = await post({ items: [item(5, "x", "now", { target_url: "javascript:alert(1)" })] });
ok(r.status === 400, "non-https target_url rejected");
r = await post({ items: [item(5, "x", "now", { id: "Bad ID" })] });
ok(r.status === 400, "bad id rejected");
r = await post({ items: [], campaigns: [] });
ok(r.status === 400, "items and campaigns together rejected");
ok(!row("camp-a-005"), "invalid batch writes nothing");

// GET
_resetCounters();
r = await get();
j = await r.json();
ok(r.status === 200 && j.items.length === 3 && j.items.every((x) => x.status === "ready"), "GET default lists ready items");
ok(j.counts.ready === 3 && j.counts.held === 1 && j.counts.posted === 0, "counts per status");
ok(j.channels.reddit === 2 && j.channels.tiktok === 1 && !j.channels.discord, "channel counts for selected status");
ok(JSON.stringify(j.today.map((x) => x.id)) === JSON.stringify(["camp-a-001", "camp-a-003"]), "today = oldest ready per channel");
r = await get("?status=all"); j = await r.json();
ok(j.items.length === 4 && j.channels.discord === 1, "status=all lists everything");
r = await get("?status=nope");
ok(r.status === 400, "bad status param is 400");

// PATCH
r = await patch("camp-a-001", { status: "posted", posted_url: "https://www.reddit.com/r/AnkiMCAT/comments/abc" });
ok(r.status === 200 && row("camp-a-001").status === "posted" && row("camp-a-001").posted_url.endsWith("/abc"), "PATCH posted stores url");
r = await patch("camp-a-002", { status: "posted", posted_url: "ftp://x" });
ok(r.status === 400, "non-https posted_url rejected");
r = await patch("camp-a-002", { status: "skipped" });
ok(r.status === 200 && row("camp-a-002").status === "skipped", "PATCH skipped");
r = await patch("camp-a-002", { status: "held" });
ok(r.status === 400, "PATCH to held not allowed");
r = await patch("camp-a-999", { status: "skipped" });
ok(r.status === 404, "PATCH unknown id is 404");

// re-upsert never touches status/posted_url/created
const before = row("camp-a-001");
_resetCounters();
r = await post({ items: [item(1, "reddit", "now", { body: "Edited body" })] });
const after = row("camp-a-001");
ok(after.status === "posted" && after.posted_url === before.posted_url && after.created === before.created && after.body === "Edited body",
  "upsert updates content only");

// release launch
r = await post({ release_launch: true }); j = await r.json();
ok(j.released === 1 && row("camp-a-004").status === "ready", "release_launch moves held to ready");
r = await patch("camp-a-001", { status: "ready" });
ok(row("camp-a-001").status === "ready" && row("camp-a-001").posted_url === null, "PATCH ready clears posted_url");

// campaigns
r = await post({ campaigns: [{ id: "camp-a", name: "Camp A", channel: "reddit", gate: "now", goal: "g", owner_step: "post", created: "2026-10-20" }] });
j = await r.json();
ok(j.ok && env.DB.raw.prepare("SELECT name FROM campaigns WHERE id='camp-a'").get().name === "Camp A", "campaign upsert");
r = await post({ campaigns: [{ id: "camp-a", name: "Camp A2", channel: "reddit", gate: "launch" }] });
ok(env.DB.raw.prepare("SELECT name, gate FROM campaigns WHERE id='camp-a'").get().gate === "launch", "campaign re-upsert updates");

console.log(`outbox tests: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);

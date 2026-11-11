// /api/e stores events only for requests served on the live host, never on preview deploys.
import assert from "node:assert/strict";
import * as e from "../functions/api/e.js";

const inserted = [];
const env = {
  ASSETS: { fetch: async () => new Response(JSON.stringify({ experiments: [] })) },
  DB: {
    prepare(sql) {
      return {
        bind(...args) { return { sql, args, first: async () => ({ n: 0 }) }; },
      };
    },
    batch: async (stmts) => { for (const s of stmts) inserted.push(s.args); return []; },
  },
};

let ipN = 0;
const send = (url) => e.onRequestPost({
  env,
  request: new Request(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", "User-Agent": "Mozilla/5.0 Test", "CF-Connecting-IP": "10.1.0." + (++ipN) },
    body: JSON.stringify({ sid: "0123456789abcdef01234567", event: "view", page: "/notes/x" }),
  }),
});

let r = await send("https://www.studystore.co/api/e");
assert.equal(r.status, 204);
assert.equal(inserted.length, 1, "live www host stores the event");

r = await send("https://studystore.co/api/e");
assert.equal(inserted.length, 2, "apex host stores the event");

for (const u of ["https://4f2a91c3.studystore-site.pages.dev/api/e", "https://studystore-notes-w46.studystore-site.pages.dev/api/e",
                 "http://localhost:8788/api/e", "https://www.studystore.co.evil.example/api/e"]) {
  r = await send(u);
  assert.equal(r.status, 204, u + " answers 204");
}
assert.equal(inserted.length, 2, "preview and other hosts store nothing");
console.log("events_test: ok");

// refund_confirm: stores the one-time code only with a well formed /refund/<32 hex> page, and only on the live host.
{
  const code = "0123456789abcdef0123456789abcdef";
  const post = (body) => e.onRequestPost({ env, request: new Request("https://www.studystore.co/api/e", {
    method: "POST", headers: { "Content-Type": "application/json", "User-Agent": "Mozilla/5.0 Test", "CF-Connecting-IP": "10.2.0." + (++ipN) },
    body: JSON.stringify(body) }) });
  const n0 = inserted.length;
  let r2 = await post({ sid: "0123456789abcdef01234567", event: "refund_confirm", page: "/refund/" + code });
  assert.equal(r2.status, 204);
  assert.equal(inserted.length, n0 + 1, "refund_confirm with a valid code is stored");
  assert.ok(inserted[inserted.length - 1].includes("/refund/" + code));
  for (const bad of [{ event: "refund_confirm", page: "/refund/" }, { event: "refund_confirm", page: "/refund/" + code + "x" },
                     { event: "refund_confirm", page: "/notes/x" }, { event: "view", page: "/refund/" + code }]) {
    r2 = await post({ sid: "0123456789abcdef01234567", ...bad });
    assert.equal(r2.status, 400, JSON.stringify(bad));
  }
  assert.equal(inserted.length, n0 + 1, "malformed refund_confirm and codes on other events store nothing");
}

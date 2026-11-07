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

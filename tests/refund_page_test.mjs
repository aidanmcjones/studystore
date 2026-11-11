// /refund-confirm/?c=<code>: loading the page never confirms; only a click on "Confirm refund" POSTs the event.
// Run after build.py: node tests/refund_page_test.mjs
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const html = fs.readFileSync("refund-confirm/index.html", "utf8");
assert.match(html, /<button[^>]*id="rc-go"[^>]*>Confirm refund<\/button>/, "visible Confirm refund button");
assert.match(html, /<meta name="robots" content="noindex">/);
assert.match(html, /<noscript>[^]*reply to the email[^]*order number[^]*<\/noscript>/, "visible no-JS fallback");
assert.doesNotMatch(html, /30 minutes/, "no timing promise");
assert.doesNotMatch(html, /fetch\(|\/api\/e/, "no inline beacon: nothing can fire on load");
const src = fs.readFileSync("assets/js/refund.js", "utf8");

function run(search) {
  const els = {};
  const mk = (id) => (els[id] = { hidden: id !== "rc-go" && id !== "rc-actions" ? true : false, disabled: true, id, listeners: {}, addEventListener(t, f) { this.listeners[t] = f; } });
  ["rc-go", "rc-bad", "rc-done", "rc-fail", "rc-actions"].forEach(mk);
  const calls = [];
  const ctx = { location: { search }, URLSearchParams, document: { getElementById: (i) => els[i] },
    crypto: { getRandomValues: (a) => { a.fill(7); } }, Uint8Array, Date,
    fetch: (url, o) => { calls.push([url, JSON.parse(o.body)]); return Promise.resolve({ status: 204 }); } };
  vm.runInNewContext(src, ctx);
  return { els, calls };
}

const code = "0123456789abcdef0123456789abcdef";
let t = run("?c=" + code);
assert.equal(t.calls.length, 0, "page load sends nothing");
assert.equal(t.els["rc-go"].disabled, false, "button enabled for a well formed code");
t.els["rc-go"].listeners.click();
await new Promise((r) => setTimeout(r, 5));
assert.equal(t.calls.length, 1, "click sends exactly one POST");
assert.deepEqual([t.calls[0][0], t.calls[0][1].event, t.calls[0][1].page], ["/api/e", "refund_confirm", "/refund/" + code]);
assert.equal(t.els["rc-done"].hidden, false);

for (const q of ["", "?c=abc", "?c=" + code + "0", "?c=../../x", "?c=" + code.toUpperCase().replace(/[A-F]/g, "G")]) {
  t = run(q);
  assert.equal(t.calls.length, 0, q + " sends nothing");
  assert.equal(t.els["rc-bad"].hidden, false, q + " shows the invalid message");
}
console.log("refund page ok");

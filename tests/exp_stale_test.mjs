// A returning visitor's stored assignment for an experiment that is no longer running (ended or removed) must not reach the
// reference_id or events, and is pruned from storage; running experiments are kept. Runs exp.js's run() in a fake browser.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
const src = readFileSync(new URL("../assets/js/exp.js", import.meta.url), "utf8");
const store = { ss_exp: JSON.stringify({ note_cta: "b", price_frame: "d", gone_exp: "a" }), ss_seen: JSON.stringify({ note_cta: "b", price_frame: "d", gone_exp: "a" }) };
const link = { href: "https://buy.polar.sh/polar_cl_x?utm_source=site-cta", closest: () => null };
const handlers = [], sent = [];
const cfg = { experiments: [
  { id: "note_cta", status: "ended", pages: "^/notes/", variants: [{ id: "b", status: "retired", weight: 0 }] },
  { id: "price_frame", status: "running", pages: "^/notes/", variants: [{ id: "d", status: "active", weight: 1, fields: {} }] },
] };
const H = { classList: { remove() {} }, getAttribute: () => null };
const win = {
  localStorage: { getItem: (k) => store[k] ?? null, setItem: (k, v) => { store[k] = String(v); }, removeItem: (k) => { delete store[k]; } },
  sessionStorage: { getItem: () => null, setItem() {} }, crypto: { getRandomValues: (a) => a.fill(7) },
  addEventListener() {}, removeEventListener() {}, scrollY: 0,
};
const ctx = {
  window: win, document: { documentElement: H, readyState: "loading", referrer: "", addEventListener: (t, f) => handlers.push([t, f]), removeEventListener() {},
    querySelectorAll: (q) => (q === "a[href]" ? [link] : []), querySelector: () => null },
  navigator: { webdriver: false }, location: { pathname: "/notes/x.html", search: "", hostname: "www.studystore.co", href: "https://www.studystore.co/notes/x.html" },
  URL, URLSearchParams, setTimeout() {}, JSON, Object, Array, Math, Blob: class {}, Promise,
  fetch: (u, o) => { if (String(u).includes("experiments")) return Promise.resolve({ ok: true, json: () => Promise.resolve(cfg) }); sent.push(o && o.body); return Promise.resolve({ ok: true }); },
};
vm.createContext(ctx);
vm.runInContext(src.replace("(function () {", "(function () { var window = this.window;").replace(/W = window/, "W = this.window"), ctx);
handlers.filter(([t]) => t === "DOMContentLoaded").forEach(([, f]) => f());
await new Promise((r) => setTimeout(r, 50));
const ref = new URL(link.href).searchParams.get("reference_id");
assert.ok(ref && ref.includes("price_frame.d"), "running experiment kept: " + ref);
assert.ok(!/note_cta|gone_exp/.test(ref), "ended or removed experiment dropped: " + ref);
assert.deepEqual(JSON.parse(store.ss_exp), { price_frame: "d" });
assert.deepEqual(JSON.parse(store.ss_seen), { price_frame: "d" });
assert.ok(sent.every((b) => !/note_cta|gone_exp/.test(b || "")), "events carry no ended experiment");
console.log("exp_stale_test: ok");

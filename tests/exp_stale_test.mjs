// A returning visitor's stored assignment for an experiment that is no longer running (ended or removed) must not reach the
// reference_id or events, and is pruned from storage; running experiments are kept. Runs exp.js's run() in a fake browser.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
const src = readFileSync(new URL("../assets/js/exp.js", import.meta.url), "utf8");
const SEED = { note_cta: "b", price_frame: "d", gone_exp: "a" };
const CFG = { experiments: [
  { id: "note_cta", status: "ended", pages: "^/notes/", variants: [{ id: "b", status: "retired", weight: 0 }] },
  { id: "price_frame", status: "running", pages: "^/notes/", variants: [{ id: "d", status: "active", weight: 1, fields: {} }] },
] };
async function runCase(load) {
  const store = { ss_exp: JSON.stringify(SEED), ss_seen: JSON.stringify(SEED) };
  const link = { href: "https://buy.polar.sh/polar_cl_x?utm_source=site-cta", closest: () => null };
  const handlers = [], sent = [];
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
    fetch: (u, o) => { if (String(u).includes("experiments")) return load(); sent.push(o && o.body); return Promise.resolve({ ok: true }); },
  };
  vm.createContext(ctx);
  vm.runInContext(src.replace("(function () {", "(function () { var window = this.window;").replace(/W = window/, "W = this.window"), ctx);
  handlers.filter(([t]) => t === "DOMContentLoaded").forEach(([, f]) => f());
  await new Promise((r) => setTimeout(r, 50));
  return { store, ref: new URL(link.href).searchParams.get("reference_id") || "", sent };
}
const json = (v) => () => Promise.resolve({ ok: true, json: () => Promise.resolve(v) });

// load succeeds with an ended experiment: pruned, running kept
let r = await runCase(json(CFG));
assert.ok(r.ref.includes("price_frame.d"), r.ref);
assert.ok(!/note_cta|gone_exp/.test(r.ref), r.ref);
assert.deepEqual(JSON.parse(r.store.ss_exp), { price_frame: "d" });
assert.deepEqual(JSON.parse(r.store.ss_seen), { price_frame: "d" });
assert.ok(r.sent.every((b) => !/note_cta|gone_exp/.test(b || "")));

// load succeeds with an empty list: everything pruned, deliberately
r = await runCase(json({ experiments: [] }));
assert.deepEqual(JSON.parse(r.store.ss_exp), {});
assert.deepEqual(JSON.parse(r.store.ss_seen), {});

// failed loads and bad input: storage untouched, nothing pruned
const SAME = JSON.stringify(SEED);
for (const [name, load] of [
  ["network error", () => Promise.reject(new Error("offline"))],
  ["http 500", () => Promise.resolve({ ok: false, json: () => Promise.resolve({}) })],
  ["malformed json", () => Promise.resolve({ ok: true, json: () => Promise.reject(new SyntaxError("bad")) })],
  ["null body", json(null)],
  ["no experiments key", json({})],
  ["experiments not an array", json({ experiments: "x" })],
  ["entry without id", json({ experiments: [{ status: "running", variants: [] }] })],
  ["entry null", json({ experiments: [null] })],
]) {
  r = await runCase(load);
  assert.equal(r.store.ss_exp, SAME, name + ": ss_exp untouched");
  assert.equal(r.store.ss_seen, SAME, name + ": ss_seen untouched");
}
// http 500 keeps stored assignments in the reference, as before the pruning change
r = await runCase(() => Promise.resolve({ ok: false }));
assert.ok(r.ref.includes("price_frame.d") && r.ref.includes("note_cta.b"), "stored assignments still tagged: " + r.ref);
console.log("exp_stale_test: ok");

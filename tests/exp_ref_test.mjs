// exp.js reference_id on Polar links: home, pack and /go/ pages all carry ss~..., /go/ adds go.<slug>, a campaign adds
// c.<utm_campaign>; experiments follow; max 100 chars. Runs exp.js in a minimal fake browser.
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import vm from "node:vm";
const src = readFileSync(new URL("../assets/js/exp.js", import.meta.url), "utf8");
let pass = 0;
function load({ search = "", landing = "" } = {}) {
  const attrs = landing ? { "data-landing": landing } : {};
  const store = {}, sess = {};
  const H = { classList: { remove() {} }, getAttribute: (k) => attrs[k] ?? null };
  const win = {
    localStorage: { getItem: (k) => store[k] ?? null, setItem: (k, v) => { store[k] = String(v); }, removeItem: (k) => { delete store[k]; } },
    sessionStorage: { getItem: (k) => sess[k] ?? null, setItem: (k, v) => { sess[k] = String(v); } },
    crypto: { getRandomValues: (a) => a.fill(7) }, addEventListener() {}, removeEventListener() {}, scrollY: 0,
  };
  const ctx = {
    window: win, document: { documentElement: H, readyState: "loading", referrer: "", addEventListener() {}, removeEventListener() {}, querySelectorAll: () => [] },
    navigator: { webdriver: false }, location: { pathname: landing ? `/go/${landing}/` : "/", search, hostname: "www.studystore.co", href: "https://www.studystore.co/" + search },
    URL, URLSearchParams, setTimeout() {}, fetch: () => Promise.resolve({ ok: false }), JSON, Object, Array, Math, Blob: class {},
  };
  vm.createContext(ctx);
  vm.runInContext(src.replace("(function () {", "(function () { var window = this.window;").replace(/W = window/, "W = this.window"), ctx);
  return win.ssExp;
}
const tag = (exp, seen) => { const u = new URL("https://buy.polar.sh/polar_cl_x"); exp.tagPolar(u, seen); return u; };

{ // entry page (notes and practice offers): fixed fields first (landing, campaign, experiments), entry last; only the slug is cut
  const x = load({ search: "?utm_campaign=reel7" }), mk = (en, seen = { note_cta: "a" }) => { const u = new URL("https://buy.polar.sh/polar_cl_x"); x.tagPolar(u, seen, en); return u.searchParams.get("reference_id"); };
  assert.equal(mk("n.enantiomers-vs-diastereomers"), "ss~c.reel7~note_cta.a~e.n.enantiomers-vs-diastereomers"); pass++;
  assert.equal(mk("p.8c-status-roles"), "ss~c.reel7~note_cta.a~e.p.8c-status-roles"); pass++;
  assert.equal(mk("x.bad slug"), "ss~c.reel7~note_cta.a"); pass++;
  assert.equal(mk("n.enantiomers-vs-diastereomers", {}), "ss~c.reel7~e.n.enantiomers-vs-diastereomers"); pass++;
  // longest slug in the site with a long campaign and two experiments: nothing before the slug is cut
  const slugs = [...readdirSync(new URL("../content/notes/", import.meta.url)).map((f) => "n." + f.replace(/\.md$/, "")),
                 ...readdirSync(new URL("../content/practice/", import.meta.url)).filter((f) => f.endsWith(".md")).map((f) => "p." + f.replace(/\.md$/, ""))];
  const longest = slugs.sort((a, b) => b.length - a.length)[0];
  const camp = "c".repeat(40), y = load({ search: "?utm_campaign=" + camp });
  const u2 = new URL("https://buy.polar.sh/polar_cl_x"); y.tagPolar(u2, { home_hero: "e", price_frame: "d" }, longest);
  const r = u2.searchParams.get("reference_id");
  assert.ok(r.length <= 100, r); pass++;
  assert.ok(r.startsWith(`ss~c.${camp}~home_hero.e~price_frame.d~e.${longest[0]}.`), r); pass++;
  assert.ok(r.endsWith(longest.slice(2, 12)) || longest.length < 70 || r.includes(longest.slice(2, 12)), r); pass++;
}
let e = load({ landing: "enzyme-inhibition", search: "?utm_source=shorts&utm_campaign=qotd-enzyme" });
let u = tag(e, {});
assert.equal(u.searchParams.get("reference_id"), "ss~go.enzyme-inhibition~c.qotd-enzyme"); pass++;
assert.equal(u.searchParams.get("utm_source"), "shorts"); pass++;
e = load({ search: "?utm_campaign=reel7" });
assert.equal(tag(e, { home_hero: "e", price_frame: "d" }).searchParams.get("reference_id"), "ss~c.reel7~home_hero.e~price_frame.d"); pass++;
e = load();
assert.equal(tag(e, { price_frame: "a" }).searchParams.get("reference_id"), "ss~price_frame.a"); pass++;
assert.equal(tag(e, {}).searchParams.get("reference_id"), null, "no landing, campaign or experiment: no reference"); pass++;
e = load({ landing: "x".repeat(61), search: "?utm_campaign=" + "c".repeat(60) });
assert.ok(tag(e, { a: "b" }).searchParams.get("reference_id").length <= 100); pass++;
e = load({ landing: "Bad Slug" });
assert.equal(tag(e, {}).searchParams.get("reference_id"), null, "invalid landing attribute ignored"); pass++;
console.log(`exp_ref_test: ${pass} passed, 0 failed`);

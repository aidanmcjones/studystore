// Tests for the MCAT study schedule generator (assets/js/tools/schedule.js) against the BUILT page's data.
// Run after `python3 build.py`:  node tests/schedule_test.mjs   (Node 18+, no dependencies; a tiny fake DOM
// runs the real tool scripts in a vm context.)
import { readFileSync, existsSync } from "node:fs";
import vm from "node:vm";

let pass = 0, fail = 0;
const ok = (cond, name) => { if (cond) pass++; else { fail++; console.log("FAIL:", name); } };
const root = new URL("../", import.meta.url);
const page = readFileSync(new URL("tools/mcat-study-schedule.html", root), "utf8");
const data = JSON.parse(page.match(/<script type="application\/json" id="sched-data">([\s\S]*?)<\/script>/)[1]);
const py = readFileSync(new URL("build_tools.py", root), "utf8");

// ---- data: the 35 official 2027 dates, in order, matching build_tools.TEST_DATES_2027
const pyDates = [...py.slice(py.indexOf("TEST_DATES_2027 = ["), py.indexOf("assert len(TEST_DATES_2027)")).matchAll(/"(2027-\d\d-\d\d)"/g)].map((m) => m[1]);
ok(data.dates.length === 35, "35 test dates");
ok(JSON.stringify(data.dates) === JSON.stringify(pyDates), "page dates equal build_tools.TEST_DATES_2027");
ok(data.dates.every((d, i) => i === 0 || d > data.dates[i - 1]), "dates strictly increasing");
ok(data.dates[0] === "2027-01-15" && data.dates[34] === "2027-09-11", "first Jan 15, last Sep 11");
ok(/^https:\/\/students-residents\.aamc\.org\//.test(data.dates_source) && /^\d{4}-\d\d-\d\d$/.test(data.dates_checked), "dates carry an AAMC source and check date");

// ---- data: every category links free notes and practice pages that exist on disk
const codes = data.categories.map((c) => c.aamc);
ok(codes.length === 32, "32 categories");
for (const [kind, dir] of [["notes", "notes"], ["practice", "practice"]]) {
  const all = Object.entries(data[kind] || {});
  ok(all.length >= 1, kind + " present");
  ok(all.every(([code]) => codes.includes(code)), kind + " keyed by real AAMC codes");
  const missing = all.flatMap(([, v]) => v).filter((x) => !existsSync(new URL(`${dir}/${x.slug}.html`, root)));
  ok(missing.length === 0, kind + " pages exist: " + missing.map((x) => x.slug).join(","));
}

// ---- tiny fake DOM
function fakeEl(id) {
  const el = { id, value: "", checked: false, min: "", innerHTML: "", textContent: "", children: [], listeners: {},
    addEventListener(t, f) { (this.listeners[t] = this.listeners[t] || []).push(f); },
    appendChild(c) { this.children.push(c); return c; }, remove() {}, click() {}, scrollIntoView() {},
    querySelector(sel) { const m = sel.match(/option\[value="([^"]+)"\]/); return m ? this.children.find((c) => c.value === m[1]) || null : null; },
    classList: { add() {}, remove() {}, toggle() {} }, setAttribute() {}, removeAttribute() {} };
  return el;
}
function run(today) {
  const els = {};
  const document = {
    getElementById(id) {
      if (id === "sched-data") return { textContent: JSON.stringify(data) };
      return (els[id] = els[id] || fakeEl(id));
    },
    createElement: () => fakeEl(""), body: fakeEl("body"), documentElement: fakeEl("html"),
    querySelector: () => null, querySelectorAll: () => [], readyState: "complete", addEventListener() {},
  };
  const RealDate = Date;
  class FakeDate extends RealDate { constructor(...a) { if (a.length) super(...a); else super(today); } static now() { return new RealDate(today).getTime(); } }
  const window = { document, localStorage: undefined, print() {}, URL: { createObjectURL: () => "blob:x", revokeObjectURL() {} } };
  const ctx = vm.createContext({ window, document, Date: FakeDate, Math, JSON, navigator: {}, setTimeout, console, Blob: class {}, URL: window.URL });
  window.window = window;
  vm.runInContext(readFileSync(new URL("assets/js/tools/common.js", root), "utf8"), ctx);
  vm.runInContext(readFileSync(new URL("assets/js/tools/schedule.js", root), "utf8"), ctx);
  return { els, window, $: (id) => document.getElementById(id) };
}

const { els, window, $ } = run("2026-10-21T12:00:00");
const S = window.__sched;
ok(typeof S.plan === "function", "plan exposed");
ok(els["f-test"].children.length === 35, "all 35 dates offered on Oct 21, 2026");
const later = run("2027-05-05T12:00:00");
const cutoff = "2027-05-12";  // May 5 plus 7 days: only later dates are offered
ok(later.els["f-test"].children.length === data.dates.filter((d) => d > cutoff).length && later.els["f-test"].children[0].value === "2027-05-13", "dates within 7 days are not offered");

// ---- plan shape
const weak0 = { bio_biochem: false, chem_phys: false, psych_soc: false, cars: false };
const inp = { start: "2026-11-02", test: "2027-04-10", hours: 20, weak: { ...weak0 } };
const p = S.plan(inp);
const days = (Date.UTC(2027, 3, 10) - Date.UTC(2026, 10, 2)) / 864e5;
ok(p.n === Math.ceil(days / 7) && p.weeks.length === p.n, "week count = ceil(days / 7)");
const phases = p.weeks.map((w) => w.phase);
ok(phases[phases.length - 1] === "final" && phases[0] === "content", "starts with content, ends with the final stretch");
ok(phases.join(",").replace(/(content,)+/, "C,").replace(/(practice,)+/, "P,") === "C,P,final", "phases in order content, practice, final");
ok(p.weeks.every((w) => Math.abs(w.cars + w.content + w.practice - w.hours) <= 1), "each week's blocks add up to the weekly hours (half-hour rounding)");
ok(p.weeks[0].start === Date.UTC(2026, 10, 2) && p.weeks[p.n - 1].end <= Date.UTC(2027, 3, 10), "weeks run from the start date to the test date");
const seen = new Set(p.weeks.flatMap((w) => w.cats.map((x) => x.c.aamc)));
ok(data.categories.filter((c) => c.section !== "cars").every((c) => seen.has(c.aamc)), "every science and psych/soc category gets content time");
const hoursFor = (pl, sec) => pl.weeks.flatMap((w) => w.cats).filter((x) => x.c.section === sec).reduce((s, x) => s + x.h, 0);
const pw = S.plan({ ...inp, weak: { ...weak0, chem_phys: true } });
ok(hoursFor(pw, "chem_phys") > hoursFor(p, "chem_phys") * 1.2, "marking Chem/Phys weak gives it clearly more content hours");
ok(S.plan({ ...inp, weak: { ...weak0, cars: true } }).weeks[0].cars > p.weeks[0].cars, "weak CARS raises weekly CARS time");
ok(S.plan({ ...inp, test: "2026-11-01" }).error, "test date before start is an error");
const short = S.plan({ start: "2027-01-01", test: "2027-01-15", hours: 10, weak: { ...weak0 } });
ok(short.n === 2 && short.weeks[1].phase === "final", "two-week runway still ends in the final stretch");

// ---- full-lengths
const flw = (pl) => pl.weeks.filter((w) => w.fl).map((w) => w.n);
const fp = S.plan({ ...inp, fl: 4 });
const fn = flw(fp);
ok(fn.length === 4 && fp.flPlaced === 4, "4 full-lengths placed for a 23-week runway");
ok(fn[3] === fp.n - 1, "last full-length is in the second-to-last week");
ok(fn.every((n, i) => i === 0 || (n - fn[i - 1] >= 1 && n - fn[i - 1] <= 2)), "full-lengths 1 to 2 weeks apart");
ok(fp.weeks[fp.n - 1].fl === undefined && fp.weeks[0].fl === undefined, "no full-length in the final week or week 1");
ok(flw(S.plan({ ...inp, fl: 0 })).length === 0, "zero full-lengths requested places none");
const f12 = S.plan({ ...inp, fl: 12 });
ok(f12.flPlaced === 12 && flw(f12).every((n, i, a) => i === 0 || n - a[i - 1] === 1 || n - a[i - 1] === 2), "12 full-lengths still spaced 1 to 2 weeks");
const tight = S.plan({ start: "2027-01-01", test: "2027-02-05", hours: 20, weak: { ...weak0 }, fl: 12 });
ok(tight.n === 5 && tight.flPlaced < 12 && tight.flPlaced >= 1, "5-week runway places fewer than 12 and reports it");
const t3 = S.plan({ start: "2027-01-01", test: "2027-01-22", hours: 20, weak: { ...weak0 }, fl: 3 });
ok(t3.n === 3 && t3.flPlaced >= 1 && t3.weeks[2].fl === undefined, "under 4 weeks: full-lengths only before the final week");
const t1 = S.plan({ start: "2027-01-01", test: "2027-01-05", hours: 20, weak: { ...weak0 }, fl: 3 });
ok(t1.n === 1 && t1.flPlaced === 0 && !t1.error, "single-week runway places no full-length");
const t1d = S.plan({ start: "2027-01-01", test: "2027-01-02", hours: 20, weak: { ...weak0 }, fl: 1 });
ok(t1d.n === 1 && t1d.weeks[0].end === Date.UTC(2027, 0, 2), "one-day runway is a single week ending on test day");
ok(S.plan({ ...inp, test: inp.start }).error, "same-day test is an error");
const txt = S.planText(fp, { ...inp, fl: 4 });
ok(txt.split("\n").filter((l) => /^Week \d+/.test(l)).length === fp.n && /full-length exam 4/.test(txt) && /no promise about your score/.test(txt), "copy text lists every week and the full-lengths");

// ---- rendered plan: free links resolve, one pack mention, source line, opt-in nudge
$("f-start").value = "2026-11-02"; $("f-test").value = "2027-04-10"; $("f-hours").value = "20"; $("f-fl").value = "4";
for (const k of Object.keys(weak0)) $("w-" + k).checked = k === "bio_biochem";
$("sf").listeners.submit[0]({ preventDefault() {} });
const out = $("result").innerHTML;
ok(/Your plan: \d+ weeks to Apr 10, 2027/.test(out), "plan heading names the test date");
const links = [...out.matchAll(/href="\.\.\/([^"#]+)"/g)].map((m) => m[1]);
ok(links.some((l) => l.startsWith("notes/")) && links.some((l) => l.startsWith("practice/")), "plan links free notes and practice");
ok(links.filter((l) => l.startsWith("notes/") || l.startsWith("practice/")).every((l) => existsSync(new URL(l, root))), "every free link exists on disk");
ok(links.filter((l) => l.startsWith("products/")).length >= 1, "plan links the relevant paid packs");
ok(/Paid pack:/.test(out) && /id="copy"/.test(out), "paid pack line and copy button");
ok(!/checkout|buy\.polar/.test(out), "no checkout links in the plan");
ok(out.includes(data.dates_source) && out.includes('href="#waitlist"'), "source line and opt-in nudge");
ok(!/[\u2013\u2014]/.test(out) && !/[\u2013\u2014]/.test(page), "no em or en dashes");

// ---- page: print view and opt-in present
ok(/id="print"/.test(out) && /id="ics"/.test(out), "print and calendar buttons");
const css = readFileSync(new URL("assets/tools.css", root), "utf8");
ok(/@media print\{[\s\S]*\.tool:has\(#sched-data\)>:not\(\.panel\):not\(h1\)\{display:none!important\}/.test(css), "print view shows only the plan");
ok(page.includes('data-waitlist') && page.includes("Double opt-in, unsubscribe in one click."), "opt-in box with consent text on the page");

console.log(`${pass} passed, ${fail} failed`);
if (fail) process.exit(1);

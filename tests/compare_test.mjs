// Comparison guides (build_compare.py): sourced, dated, disclosed, arithmetic right. Run after `python3 build.py`:
//   node tests/compare_test.mjs
import { readFileSync } from "node:fs";
let pass = 0, fail = 0;
const ok = (c, n) => { if (c) pass++; else { fail++; console.log("FAIL:", n); } };
const root = new URL("../", import.meta.url);
const read = (p) => readFileSync(new URL(p, root), "utf8");
const data = JSON.parse(read("data/compare.json"));
const site = JSON.parse(read("site.json"));
const decks = read("compare/mcat-anki-decks-anking-miledown-pankow.html");
const cost = read("compare/mcat-prep-cost-courses-vs-diy.html");
const rows = (h) => [...h.matchAll(/<tr>(.*?)<\/tr>/gs)].map((m) => m[1]).filter((r) => r.includes("<td"));

for (const [name, h] of [["decks", decks], ["cost", cost]]) {
  ok(!/[‒-―]/.test(h), name + ": no em or en dashes");
  ok(/StudyStore (wrote this page and )?sells/.test(h), name + ": discloses that StudyStore sells a product");
  ok(h.includes("Checked 2026-10-21") || h.includes("checked 2026-10-21"), name + ": dated");
  ok(/"@type": "Article"/.test(h), name + ": Article JSON-LD");
  ok(h.includes('data-waitlist'), name + ": opt-in box");
}
// every third-party or maker number row links its source with a check date
const sourced = (r) => /<a href="https:\/\/[^"]+" rel="noopener">[^<]+<\/a> \((own page|third-party page|AnkiWeb shared-deck listing, uploader not verified as the maker)(, page dated \d{4}-\d\d-\d\d)?, checked \d{4}-\d\d-\d\d\)/.test(r);
const deckRows = rows(decks).filter((r) => !r.includes("StudyStore packs"));
ok(deckRows.length === data.decks.length && deckRows.every(sourced), "every competitor deck row is sourced and dated");
ok(deckRows.every((r) => r.includes("(approximate)")), "deck sizes marked approximate");
ok(deckRows.slice(1).every((r) => r.includes("premiermcatprep.com")), "third-party card counts link their source");
const cards = site.products.filter((p) => p.status === "available").reduce((s, p) => s + p.contents.cards, 0);
ok(decks.includes(cards.toLocaleString("en-US") + " cards across"), "StudyStore card count from site.json");
ok(cost.includes("Estimate, not advice"), "cost page: YMYL label");
const tableRows = rows(cost).filter((r) => r.includes('rel="noopener"'));
ok(tableRows.length === 3 + 7 + data.courses.length, "fee, prep and course rows each carry a source");
ok(tableRows.every(sourced), "every fee, prep and course row sourced and dated");
ok(data.courses.filter((c) => c.source_type !== "own").every((c) => cost.includes(c.company) && c.approximate), "third-party course prices marked approximate");
const A = Object.fromEntries(data.aamc.map((a) => [a.id, a.price_usd]));
const uq = data.courses.find((c) => c.id === "uworld_qbank_90").price_usd;
const fmt = (x) => "$" + x.toLocaleString("en-US", { minimumFractionDigits: x % 1 ? 2 : 0, maximumFractionDigits: 2 });
ok(cost.includes(`<td class=n>${fmt(A.reg_standard + A.pe1)}</td>`), "free route total");
ok(cost.includes(`<td class=n>${fmt(A.reg_standard + A.bundle)}</td>`), "official prep route total");
ok(cost.includes(`<td class=n>${fmt(A.reg_standard + A.bundle + uq)}</td>`), "qbank route total");
ok(A.reg_standard === 360 && A.reg_fap === 145, "AAMC 2027 registration fees as checked");
ok(data.courses.filter((c) => c.from).every((c) => cost.includes(`<td class=n>from $${c.price_usd.toLocaleString("en-US")}`)), "'From' prices keep the word from");
ok(!decks.includes("AnkiWeb</a> (own page"), "AnkiWeb listings are not labeled as the maker's own page");
ok([decks, cost].every((h) => (h.match(/<div class="tablewrap"/g) || []).length === (h.match(/<div class="tablewrap" role="region" aria-label="[^"]+" tabindex="0">/g) || []).length), "scrollable tables are focusable labeled regions");
console.log(`${pass} passed, ${fail} failed`);
if (fail) process.exit(1);

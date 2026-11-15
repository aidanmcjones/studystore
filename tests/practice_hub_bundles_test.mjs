// Main practice hub links every bundle product page with the price from site.json. Run after `python3 build.py`:
//   node tests/practice_hub_bundles_test.mjs
import { readFileSync } from "node:fs";
let pass = 0, fail = 0;
const ok = (c, n) => { if (c) pass++; else { fail++; console.log("FAIL:", n); } };
const root = new URL("../", import.meta.url);
const site = JSON.parse(readFileSync(new URL("site.json", root), "utf8"));
const hub = readFileSync(new URL("practice/index.html", root), "utf8");
ok(site.bundles.length === 4, "site.json has four bundles");
for (const b of site.bundles) {
  const m = hub.match(new RegExp(`<a href="[^"]*products/${b.slug}"[^>]*data-track="cta"[^>]*>[^<]*</a> (\\$\\d+)`));
  ok(m, b.slug + ": linked from /practice/ with data-track=cta");
  ok(m && m[1] === b.price, b.slug + ": price matches site.json (" + b.price + ")");
}
console.log(`practice_hub_bundles: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);

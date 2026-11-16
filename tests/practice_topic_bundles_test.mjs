// Every practice topic page names its section bundle (price from site.json) below the end offer, and that bundle
// contains a pack the page links to. Run after `python3 build.py`:  node tests/practice_topic_bundles_test.mjs
import { readFileSync, readdirSync } from "node:fs";
let pass = 0, fail = 0;
const ok = (c, n) => { if (c) pass++; else { fail++; console.log("FAIL:", n); } };
const root = new URL("../", import.meta.url);
const site = JSON.parse(readFileSync(new URL("site.json", root), "utf8"));
const bundles = Object.fromEntries(site.bundles.map(b => [b.slug, b]));
const pages = readdirSync(new URL("practice/", root)).filter(f => f.endsWith(".html") && f !== "index.html");
ok(pages.length > 50, "found practice topic pages (" + pages.length + ")");
for (const f of pages) {
  const s = readFileSync(new URL("practice/" + f, root), "utf8");
  const m = s.match(/Practicing across the whole section\? Get the bundle: <a href="[^"]*products\/(bundle-[a-z-]+)" data-track="cta">[^<]*<\/a> (\$\d+)\./);
  ok(m, f + ": has the section bundle line");
  if (!m) continue;
  const b = bundles[m[1]];
  ok(b && m[2] === b.price, f + ": bundle " + m[1] + " price matches site.json");
  const packs = [...s.matchAll(/products\/([a-z0-9-]+)"/g)].map(x => x[1]).filter(x => !x.startsWith("bundle-"));
  ok(b && packs.some(p => b.members.includes(p)), f + ": bundle " + m[1] + " contains a pack this page links to");
}
console.log(`practice_topic_bundles: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);

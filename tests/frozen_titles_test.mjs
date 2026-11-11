// Freeze: until tools/gsc_targets.json "frozen_until", the built <title> and canonical of every page listed there
// must equal the recorded "frozen" values. Run after `python3 build.py`:  node tests/frozen_titles_test.mjs
// To change one on purpose after the date, update the "frozen" values in the same PR.
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const t = JSON.parse(readFileSync(join(ROOT, "tools", "gsc_targets.json"), "utf8"));
const today = process.env.FREEZE_TODAY || new Date().toISOString().slice(0, 10);
if (!t.frozen_until || today >= t.frozen_until) {
  console.log(`freeze over (frozen_until ${t.frozen_until}, today ${today}); nothing to check`);
  process.exit(0);
}
const errs = [];
for (const p of t.pages) {
  if (!p.frozen) { errs.push(`${p.page}: no frozen title/canonical recorded`); continue; }
  const file = join(ROOT, p.page.endsWith("/") ? p.page.slice(1) + "index.html" : p.page.slice(1) + ".html");
  if (!existsSync(file)) { errs.push(`${p.page}: page is gone (URL frozen until ${t.frozen_until})`); continue; }
  const s = readFileSync(file, "utf8");
  const title = (s.match(/<title>(.*?)<\/title>/) || [])[1];
  const canon = (s.match(/<link rel="canonical" href="([^"]+)"/) || [])[1];
  if (title !== p.frozen.title) errs.push(`${p.page}: <title> changed during the freeze\n  was: ${p.frozen.title}\n  now: ${title}`);
  if (canon !== p.frozen.canonical) errs.push(`${p.page}: canonical changed during the freeze: ${canon}`);
}
console.log(`${t.pages.length} frozen pages checked (until ${t.frozen_until})`);
if (errs.length) { console.log(errs.join("\n")); process.exit(1); }

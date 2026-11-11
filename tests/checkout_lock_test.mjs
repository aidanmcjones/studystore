// Checkout ids are locked: every checkout_url in site.json, and every buy.polar.sh URL in any rendered page, must be
// listed in data/checkout_lock.json. The lock is changed only by the owner's product tooling, never by content automation.
import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const lock = new Set(JSON.parse(readFileSync(path.join(root, "data/checkout_lock.json"), "utf8")).checkout_urls);
let bad = 0;
const fail = (m) => { console.error("FAIL  " + m); bad++; };

const urls = [];
(function walk(o) {
  if (Array.isArray(o)) o.forEach(walk);
  else if (o && typeof o === "object") for (const [k, v] of Object.entries(o)) { if (k === "checkout_url" && v) urls.push(v); else walk(v); }
})(JSON.parse(readFileSync(path.join(root, "site.json"), "utf8")));
for (const u of urls) if (!lock.has(u)) fail(`site.json checkout_url not in data/checkout_lock.json: ${u}`);

const skip = new Set([".git", "node_modules", ".wrangler", ".mf", "templates", "content", "tests"]);
let pages = 0;
(function walk(d) {
  for (const n of readdirSync(d)) {
    if (skip.has(n)) continue;
    const p = path.join(d, n);
    if (statSync(p).isDirectory()) { walk(p); continue; }
    if (!/\.(html|js|json|xml|txt)$/.test(n)) continue;
    if (n === "checkout_lock.json" || (n === "site.json" && d === root)) continue;
    const text = readFileSync(p, "utf8");
    pages++;
    for (const m of text.matchAll(/https:\/\/buy\.polar\.sh\/[^\s"'<>)\\]*/gi)) {
      const u = m[0].replace(/&amp;/g, "&");
      if (![...lock].some((l) => u === l || u.startsWith(l + "?") || u.startsWith(l + "#"))) fail(`${path.relative(root, p)}: buy.polar.sh URL not in lock: ${u}`);
    }
  }
})(root);
if (bad) process.exit(1);
console.log(`checkout_lock: ${urls.length} catalog urls and ${pages} files checked, ${lock.size} locked`);

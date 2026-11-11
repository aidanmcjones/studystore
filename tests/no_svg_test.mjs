// No SVG anywhere in the tracked tree or deployable output, except reviewed files listed by path and sha256 in
// data/svg_allowlist.json (empty by default). An SVG is served from our origin and can run script.
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const allow = new Map(JSON.parse(readFileSync(path.join(root, "data/svg_allowlist.json"), "utf8")).reviewed.map((r) => [r.path, r.sha256]));
const found = new Set();
try {
  for (const f of execFileSync("git", ["ls-files", "-z"], { cwd: root, encoding: "utf8" }).split("\0")) if (/\.svg$/i.test(f)) found.add(f);
} catch {}
const skip = new Set([".git", "node_modules", ".wrangler", ".mf"]);
(function walk(d) {
  for (const n of readdirSync(d)) {
    if (skip.has(n)) continue;
    const p = path.join(d, n);
    const st = statSync(p);
    if (st.isDirectory()) walk(p);
    else if (/\.svg$/i.test(n)) found.add(path.relative(root, p));
  }
})(root);
let bad = 0;
for (const f of found) {
  const sha = createHash("sha256").update(readFileSync(path.join(root, f))).digest("hex");
  if (allow.get(f) !== sha) { console.error(`FAIL  ${f}: SVG not in data/svg_allowlist.json with sha256 ${sha}`); bad++; }
}
if (bad) process.exit(1);
console.log(`no_svg: ${found.size} svg file(s), all reviewed`);

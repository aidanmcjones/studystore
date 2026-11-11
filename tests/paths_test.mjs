// Fails if two generated pages can serve the same URL, or a page URL is also a redirect source.
// Pages serves X.html at /X and X/index.html at /X/ (and redirects /X/ <-> /X), so a X.html + X/index.html pair makes
// /X/?query land on the other page (the /refund vs /refund-confirm incident). Run after build.py.
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const SKIP = new Set([".deploy", "node_modules", "templates", "content", "tests", "db", "functions", ".git", ".wrangler", "tools", "design"]);
const pages = [];
(function walk(d) {
  for (const n of fs.readdirSync(d, { withFileTypes: true })) {
    if (n.name.startsWith(".") || SKIP.has(n.name) && d === ".") continue;
    const p = path.join(d, n.name);
    if (n.isDirectory()) walk(p);
    else if (n.name.endsWith(".html")) pages.push(p.replace(/^\.\//, ""));
  }
})(".");
// tools/*.html are deployed pages too (they are in the tracked allowlist), include them.
for (const n of fs.readdirSync("tools")) if (n.endsWith(".html")) pages.push("tools/" + n);

const served = new Map();   // canonical path (no trailing slash, no .html) -> source file
const clash = [];
for (const f of pages) {
  const canon = "/" + (f.endsWith("/index.html") ? f.slice(0, -"/index.html".length) : f === "index.html" ? "" : f.slice(0, -5));
  if (served.has(canon)) clash.push(`${f} and ${served.get(canon)} both serve ${canon || "/"}`);
  else served.set(canon, f);
}
const redirects = fs.readFileSync("_redirects", "utf8").split("\n").filter((l) => l.trim() && !l.startsWith("#")).map((l) => l.split(/\s+/)[0]);
for (const r of redirects) {
  const canon = r.replace(/\.html$/, "").replace(/\/$/, "") || "/";
  if (served.has(canon)) clash.push(`redirect ${r} shadows page ${served.get(canon)}`);
}
assert.deepEqual(clash, [], "colliding page paths:\n" + clash.join("\n"));
assert.ok(served.get("/refund-confirm") === "refund-confirm/index.html", "confirmation page is built at /refund-confirm/");
assert.ok(served.get("/refund") === "refund.html", "policy page stays at /refund");
console.log("paths ok (" + served.size + " pages)");

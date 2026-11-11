// Real hop counts against `wrangler pages dev` (the static host and functions/_middleware.js together, which the
// unit tests stub). Use tools/check_hops.sh, which starts the dev server, runs this and stops it.
//   DEV=http://127.0.0.1:8791 node tests/pages_dev_hops.mjs
// Every duplicate form (apex, .html, index.html, slash or no slash, retired/merged URL) must reach its final page in
// exactly ONE redirect with status 301 and land on a 200 whose canonical is that URL; canonical URLs answer 200 directly.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import http from "node:http";

const DEV = process.env.DEV;
if (!DEV) { console.log("DEV not set; run tools/check_hops.sh"); process.exit(0); }
const ROOT = fileURLToPath(new URL("..", import.meta.url));
const BASE = "https://www.studystore.co";
const errs = [];

// node:http, because fetch() ignores a Host header and the middleware decides by host.
const dev = new URL(DEV);
function get(abs) {
  const u = new URL(abs);
  return new Promise((resolve, reject) => {
    const req = http.request({ host: dev.hostname, port: dev.port, path: u.pathname + u.search, method: "GET", headers: { host: u.host } }, (res) => {
      let body = "";
      res.setEncoding("utf8");
      res.on("data", (c) => (body += c));
      res.on("end", () => resolve({ status: res.statusCode, headers: { get: (k) => res.headers[k.toLowerCase()] }, text: async () => body }));
    });
    req.on("error", reject);
    req.end();
  });
}
async function follow(abs) {
  const chain = [];
  let cur = abs;
  for (let i = 0; i < 6; i++) {
    const r = await get(cur);
    chain.push(r.status);
    if (r.status < 300 || r.status >= 400) return { chain, final: cur, res: r };
    cur = new URL(r.headers.get("location"), cur).toString();
  }
  return { chain, final: cur, res: null };
}

const sm = [...readFileSync(join(ROOT, "sitemap.xml"), "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const rules = readFileSync(join(ROOT, "_redirects"), "utf8").split("\n").filter((l) => l && !l.startsWith("#"))
  .map((l) => l.split(/\s+/)).filter((r) => !r[0].endsWith(".html"));
const cases = [];
for (const u of sm) {
  const path = u.slice(BASE.length);
  cases.push([u, u, 0]);
  const forms = path === "/" ? ["/", "/index.html"]
    : path.endsWith("/") ? [path, path + "index.html", path.slice(0, -1)]
    : [path, path + ".html", path + "/"];
  for (const f of forms) {
    if (f !== path) cases.push([BASE + f, u, 1]);
    cases.push(["https://studystore.co" + f, u, 1]);
  }
}
for (const [src, dst] of rules) {
  for (const h of [BASE, "https://studystore.co"]) for (const f of [src, src + ".html", src + "/"]) cases.push([h + f + "?q=1", BASE + dst + "?q=1", 1]);
}

let n = 0;
for (const [from, want, hops] of cases) {
  const { chain, final, res } = await follow(from);
  n++;
  const redirects = chain.slice(0, -1);
  if (final !== want || redirects.length !== hops || redirects.some((s) => s !== 301) || !res || res.status !== 200) {
    errs.push(`${from}: ${chain.join(" > ")} ending at ${final}, want ${hops} x 301 to ${want}`);
    continue;
  }
  if (hops === 0) {
    const html = await res.text();
    const canon = (html.match(/<link rel="canonical" href="([^"]+)"/) || [])[1];
    if (canon && canon !== want) errs.push(`${from}: canonical ${canon}`);
  }
}
const pd = await get("https://studystore.pages.dev/");
if (pd.headers.get("x-robots-tag") !== "noindex") errs.push("studystore.pages.dev is not noindex");
console.log(`${n} URL forms checked against wrangler pages dev`);
if (errs.length) { console.log(errs.slice(0, 60).join("\n")); console.log(`${errs.length} errors`); process.exit(1); }
console.log("hop checks passed");

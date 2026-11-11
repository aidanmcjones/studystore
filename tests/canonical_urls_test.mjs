// One indexable URL per page. Run after `python3 build.py`:  node tests/canonical_urls_test.mjs
// Asserts that canonical tags, og:url, sitemap, internal links and _redirects agree on the clean www URL, that
// no page is reachable at two indexable URLs (x.html, apex host, /index.html all 301 to it in ONE hop through
// functions/_middleware.js), that redirect rules never chain, and that robots.txt points at the www sitemap.
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { onRequest, cleanPath } from "../functions/_middleware.js";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const BASE = "https://www.studystore.co";
const SKIP = ["templates/", "content/", "node_modules/", ".deploy/", "assets/", "media/", "design/", "landing/", "tests/", "db/", "functions/", "products/_upload/"];
const errs = [];
const err = (m) => errs.push(m);

function walk(dir, out = []) {
  for (const n of readdirSync(dir)) {
    if (n.startsWith(".")) continue;
    const p = join(dir, n);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (n.endsWith(".html")) out.push(relative(ROOT, p).split("\\").join("/"));
  }
  return out;
}

const pages = walk(ROOT).filter((r) => !SKIP.some((s) => r.startsWith(s)));
const indexable = new Map(); // clean url -> file
for (const rel of pages) {
  const s = readFileSync(join(ROOT, rel), "utf8");
  if (/<meta name="robots" content="noindex/.test(s)) continue;
  if (!/<link rel="canonical"/.test(s)) continue; // standalone fragments without a head
  const want = BASE + cleanPath("/" + rel);
  const canon = (s.match(/<link rel="canonical" href="([^"]+)"/) || [])[1];
  if (canon !== want) err(`${rel}: canonical ${canon} != ${want}`);
  const og = (s.match(/<meta property="og:url" content="([^"]+)"/) || [])[1];
  if (og && og !== want) err(`${rel}: og:url ${og} != ${want}`);
  if (indexable.has(want)) err(`${rel} and ${indexable.get(want)} both claim ${want}`);
  indexable.set(want, rel);
  // Internal links must point at the final URL, never at a redirecting .html or /index.html form.
  for (const m of s.matchAll(/href="([^"]*)"/g)) {
    const h = m[1];
    if (/^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(h) && !h.startsWith(BASE) && !h.startsWith("https://studystore.co")) continue;
    const path = h.replace(/^https:\/\/(?:www\.)?studystore\.co/, "").split(/[?#]/)[0];
    if (/\.html$/.test(path)) err(`${rel}: internal link to redirecting URL ${h}`);
    if (/^https:\/\/studystore\.co/.test(h)) err(`${rel}: internal link to apex host ${h}`);
  }
}

// x.html next to x/index.html would put two near-identical pages at /x and /x/.
for (const rel of pages) {
  if (rel.endsWith("/index.html")) {
    const twin = rel.slice(0, -"/index.html".length) + ".html";
    if (existsSync(join(ROOT, twin))) err(`${twin} and ${rel} both exist`);
  }
}

// Sitemap: clean, unique, every entry an indexable page whose canonical is that entry.
const sm = [...readFileSync(join(ROOT, "sitemap.xml"), "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const seen = new Set();
for (const u of sm) {
  if (seen.has(u)) err(`sitemap: duplicate ${u}`);
  seen.add(u);
  if (!u.startsWith(BASE + "/")) err(`sitemap: not on ${BASE}: ${u}`);
  if (/\.html$|\/index\.html$/.test(u)) err(`sitemap: redirecting form ${u}`);
  if (!indexable.has(u)) err(`sitemap: ${u} is not an indexable page with that canonical`);
}
for (const [u, rel] of indexable) if (!seen.has(u)) err(`indexable page missing from sitemap: ${rel} (${u})`);

// _redirects: no sitemap URL is a redirect source, no rule chains, targets are clean.
const rules = readFileSync(join(ROOT, "_redirects"), "utf8").split("\n").map((l) => l.trim())
  .filter((l) => l && !l.startsWith("#")).map((l) => l.split(/\s+/));
const sources = new Set(rules.map((r) => r[0]));
for (const [src, dst, code] of rules) {
  if (code !== "301") err(`_redirects: ${src} uses ${code}, want 301`);
  if (sources.has(dst)) err(`_redirects: chain ${src} -> ${dst} -> ...`);
  if (/\.html$/.test(dst)) err(`_redirects: target ${dst} is itself redirected by the host`);
  if (seen.has(BASE + src)) err(`_redirects: sitemap URL ${src} is redirected away`);
  const tf = dst.endsWith("/") ? dst.slice(1) + "index.html" : dst.slice(1) + ".html";
  if (!dst.startsWith("http") && !existsSync(join(ROOT, tf))) err(`_redirects: target ${dst} does not exist`);
  if (existsSync(join(ROOT, src.slice(1) + ".html")) || existsSync(join(ROOT, src.slice(1)))) err(`_redirects: source ${src} still exists as a file`);
}

// Every duplicate form of every sitemap URL reaches it in exactly one 301; the clean form is served as is.
async function hit(url) {
  let nexted = 0;
  const res = await onRequest({ request: new Request(url), next: async () => { nexted++; return new Response("ok"); } });
  return { res, nexted };
}
for (const u of sm) {
  const path = u.slice(BASE.length);
  const variants = [`https://studystore.co${path}`];
  if (path.endsWith("/")) variants.push(`${BASE}${path}index.html`, `https://studystore.co${path}index.html`);
  else variants.push(`${u}.html`, `https://studystore.co${path}.html`);
  for (const v of variants) {
    const { res, nexted } = await hit(v);
    if (res.status !== 301 || res.headers.get("location") !== u || nexted) err(`${v}: want one 301 to ${u}, got ${res.status} ${res.headers.get("location")}`);
  }
  const { res, nexted } = await hit(u);
  if (nexted !== 1 || res.status !== 200) err(`${u}: clean URL not served directly`);
}

// Retired and merged URLs: every form reaches the final page in one 301, and the middleware map matches _redirects.
const { REDIRECTS } = await import("../functions/_lib/redirects.js");
const fromFile = Object.fromEntries(rules.filter((r) => !r[0].endsWith(".html")).map((r) => [r[0], r[1]]));
if (JSON.stringify(Object.entries(REDIRECTS).sort()) !== JSON.stringify(Object.entries(fromFile).sort())) err("functions/_lib/redirects.js does not match _redirects (rebuild)");
for (const [src, dst] of Object.entries(fromFile)) {
  for (const v of [BASE + src, BASE + src + ".html", "https://studystore.co" + src, "https://studystore.co" + src + ".html"]) {
    const { res, nexted } = await hit(v + "?utm_source=x");
    if (res.status !== 301 || res.headers.get("location") !== BASE + dst + "?utm_source=x" || nexted) err(`${v}: want one 301 to ${dst}, got ${res.status} ${res.headers.get("location")}`);
  }
}

const robots = readFileSync(join(ROOT, "robots.txt"), "utf8");
if (!robots.includes(`Sitemap: ${BASE}/sitemap.xml`)) err("robots.txt: sitemap line missing or not www");
if (!/Disallow: \/cdn-cgi\//.test(robots)) err("robots.txt: /cdn-cgi/ not disallowed");
if (/Disallow: \/\s*$/m.test(robots)) err("robots.txt blocks the whole site");

console.log(`${indexable.size} indexable pages, ${sm.length} sitemap URLs, ${rules.length} redirect rules`);
if (errs.length) { console.log(errs.slice(0, 80).join("\n")); console.log(`${errs.length} errors`); process.exit(1); }
console.log("canonical URL checks passed");

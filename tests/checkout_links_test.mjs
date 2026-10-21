// Checks the built site against site.json for the active checkout provider (Polar by default).
// Run after `python3 build.py`:  node tests/checkout_links_test.mjs   (Node 22+, no dependencies)
// - every available pack and bundle page has a Buy link to its own Polar checkout link with its price
// - Product JSON-LD says InStock with the listed price
// - no public page names Lemon Squeezy while the provider is Polar
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const site = JSON.parse(readFileSync(join(ROOT, "site.json"), "utf8"));
const provider = site.checkout_provider || "polar";
let pass = 0, fail = 0;
const ok = (cond, name) => { if (cond) pass++; else { fail++; console.log("FAIL:", name); } };

if (provider !== "polar") {
  console.log(`checkout_provider is ${provider}; Polar link checks skipped`);
  process.exit(0);
}

const POLAR = /^https:\/\/buy\.polar\.sh\/polar_cl_[A-Za-z0-9]+$/;
const items = [...site.products, ...site.bundles].filter((p) => p.status === "available");
const urls = new Set();
for (const p of items) {
  ok(POLAR.test(p.checkout_url || ""), `${p.slug}: checkout_url is a Polar checkout link`);
  ok(!urls.has(p.checkout_url), `${p.slug}: checkout_url is unique`);
  urls.add(p.checkout_url);
  const page = readFileSync(join(ROOT, "products", `${p.slug}.html`), "utf8");
  const buy = `href="${p.checkout_url}" data-checkout="polar" data-slug="${p.slug}" rel="noopener">Buy now, ${p.price}</a>`;
  ok(page.includes(buy), `${p.slug}: Buy link points to its Polar checkout with ${p.price}`);
  ok(!/data-buy=/.test(page), `${p.slug}: no Lemon Squeezy data-buy buttons`);
  const ld = [...page.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    .map((m) => JSON.parse(m[1])).flatMap((x) => (x["@graph"] ? x["@graph"] : [x]));
  const prod = ld.find((x) => x["@type"] === "Product");
  ok(prod && prod.offers && prod.offers.availability === "https://schema.org/InStock", `${p.slug}: JSON-LD InStock`);
  ok(prod && prod.offers && prod.offers.price === p.price_usd.toFixed(2), `${p.slug}: JSON-LD price ${p.price_usd}`);
}

// every built page (home, catalog, notes, practice, tools, products): each Polar Buy link matches its item
// and price, and a page that sells never says checkout is not open (review H1)
const bySlug = Object.fromEntries(items.map((p) => [p.slug, p]));
const NOT_OPEN = /not open yet|when checkout opens|day it opens|launch day access/i;
let pagesWithBuy = 0, pagesScanned = 0;
const allPages = (d) => readdirSync(join(ROOT, d), { withFileTypes: true }).flatMap((e) =>
  e.isDirectory() ? (["node_modules", "templates", ".deploy", ".git", ".wrangler"].includes(e.name) ? [] : allPages(join(d, e.name)))
    : e.name.endsWith(".html") ? [join(d, e.name)] : []);
for (const f of allPages(".")) {
  const h = readFileSync(join(ROOT, f), "utf8");
  pagesScanned++;
  const links = [...h.matchAll(/<a [^>]*href="(https:\/\/buy\.polar\.sh\/[^"]+)"[^>]*data-slug="([^"]+)"[^>]*>Buy now, (\$\d+)<\/a>/g)];
  const raw = (h.match(/buy\.polar\.sh/g) || []).length;
  ok(links.length === raw, `${f}: every Polar link is a well-formed Buy link`);
  for (const [, href, slug, price] of links) {
    const p = bySlug[slug];
    ok(p && href === p.checkout_url && price === p.price, `${f}: Buy link for ${slug} -> its own checkout and price`);
  }
  if (links.length) {
    pagesWithBuy++;
    ok(!NOT_OPEN.test(h.replace(/<script[\s\S]*?<\/script>/g, "")), `${f}: sells, so no "checkout is not open" copy`);
  }
}
ok(pagesScanned >= 172, `scanned ${pagesScanned} pages`);
console.log(`scanned ${pagesScanned} pages, ${pagesWithBuy} with Polar Buy links`);

// experiments.json: no active variant promises a launch email (review H1)
const exps = JSON.parse(readFileSync(join(ROOT, "experiments.json"), "utf8"));
for (const e of exps.experiments) for (const v of e.variants) {
  if (v.status === "active") ok(!NOT_OPEN.test(JSON.stringify(v.fields || {})), `experiment ${e.id}/${v.id}: no launch promise`);
}

// /api/checkout stays dormant unless checkout_provider is lemonsqueezy (review L1). The module's JSON imports
// are swapped for inline values so plain Node can load it.
async function loadCheckout(provider) {
  let src = readFileSync(join(ROOT, "functions/api/checkout.js"), "utf8");
  src = src.replace(/import VARIANTS from "[^"]+";/, `const VARIANTS = ${JSON.stringify({ store_id: "1", variants: { x: { variant_id: "9" } }, sellable: ["x"] })};`)
    .replace(/import SITE from "[^"]+";/, `const SITE = ${JSON.stringify({ checkout_provider: provider })};`);
  return import("data:text/javascript;base64," + Buffer.from(src).toString("base64"));
}
const envLS = { LS_API_KEY: "k", LS_STORE_ID: "1" };
for (const prov of ["polar", "lemonsqueezy"]) {
  const m = await loadCheckout(prov);
  const g = await (await m.onRequestGet({ env: envLS })).json();
  const post = await m.onRequestPost({ env: envLS, request: new Request("https://www.studystore.co/api/checkout", { method: "POST", body: "{bad" }) });
  if (prov === "polar") {
    ok(g.enabled === false && g.sellable.length === 0, "polar: GET /api/checkout disabled");
    ok(post.status === 503, "polar: POST /api/checkout 503");
  } else {
    ok(g.enabled === true && g.sellable[0] === "x", "lemonsqueezy: GET /api/checkout enabled");
    ok(post.status === 400, "lemonsqueezy: POST reaches validation");
  }
}

// public pages: no Lemon Squeezy copy (admin pages are owner tools and may describe the dormant path)
const walk = (d) => readdirSync(join(ROOT, d), { withFileTypes: true }).flatMap((e) =>
  e.isDirectory() ? (["admin", "node_modules", "templates", ".deploy", ".git"].includes(e.name) ? [] : walk(join(d, e.name)))
    : e.name.endsWith(".html") ? [join(d, e.name)] : []);
for (const f of walk(".")) {
  ok(!/lemon ?squeezy/i.test(readFileSync(join(ROOT, f), "utf8")), `${f}: no Lemon Squeezy copy`);
}

console.log(`${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);

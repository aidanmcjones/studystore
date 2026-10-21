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

// public pages: no Lemon Squeezy copy (admin pages are owner tools and may describe the dormant path)
const walk = (d) => readdirSync(join(ROOT, d), { withFileTypes: true }).flatMap((e) =>
  e.isDirectory() ? (["admin", "node_modules", "templates", ".deploy", ".git"].includes(e.name) ? [] : walk(join(d, e.name)))
    : e.name.endsWith(".html") ? [join(d, e.name)] : []);
for (const f of walk(".")) {
  ok(!/lemon ?squeezy/i.test(readFileSync(join(ROOT, f), "utf8")), `${f}: no Lemon Squeezy copy`);
}

console.log(`${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);

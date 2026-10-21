// /api/checkout : create a Lemon Squeezy checkout for one pack or bundle and return its URL.
// DORMANT while site.json checkout_provider is "polar" (the default): buy buttons then link straight to
// Polar checkout links and never call this endpoint. Kept so the site can switch back by flipping the flag.
//   GET  -> {enabled, sellable}            (buy.js uses this to show "Available soon" before keys exist)
//   POST {slug, custom:{exp_*, utm_source, utm_campaign}} -> {url} | 503 not_configured | 400/404/502
// Inactive (503) until both Pages secrets exist:
//   npx wrangler@3.114.0 pages secret put LS_API_KEY  --project-name studystore
//   npx wrangler@3.114.0 pages secret put LS_STORE_ID --project-name studystore
// Variant ids come from ls_variants.json (written by ops/sync_catalog.py). Only slugs listed in
// `sellable` (packs that passed accuracy review and exist in Lemon Squeezy) can be bought.
// The client never sets a price; no custom_price is sent. The only LS write calls in this
// project are POST /v1/checkouts (here) and POST /v1/discounts (see ops/LEMONSQUEEZY_API.md).
import VARIANTS from "../../ls_variants.json";
import SITE from "../../site.json";

// Lemon Squeezy checkouts are minted only when site.json selects it; any other provider (polar) -> 503.
export const lsActive = (site = SITE) => (site && site.checkout_provider) === "lemonsqueezy";

const LS = "https://api.lemonsqueezy.com/v1/checkouts";
const HOSTS = /^(www\.)?studystore\.co$|^([a-z0-9-]+\.)?studystore\.pages\.dev$/;
const json = (o, status = 200) => new Response(JSON.stringify(o), {
  status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });

function sellable() { return new Set(VARIANTS.sellable || []); }
function configured(env) { return lsActive() && !!(env.LS_API_KEY && (env.LS_STORE_ID || VARIANTS.store_id)); }

function siteOrigin(request) {
  try { const u = new URL(request.url); if (HOSTS.test(u.hostname)) return u.origin; } catch (e) {}
  return "https://www.studystore.co";
}

function cleanCustom(c) {
  const out = { src: "site" };
  if (!c || typeof c !== "object") return out;
  let n = 0;
  for (const [k, v] of Object.entries(c)) {
    if (n >= 20) break;
    if (/^(exp_[a-z0-9_]{1,40}|utm_source|utm_campaign|utm_medium|utm_content|ref)$/.test(k)
        && typeof v === "string" && v.length && v.length <= 60 && /^[\w .:\/-]+$/.test(v)) { out[k] = v; n++; }
  }
  return out;
}

export async function onRequestGet({ env }) {
  const on = configured(env);
  return json({ enabled: on, sellable: on ? [...sellable()] : [] });
}

export async function onRequestPost({ request, env }) {
  if (!configured(env)) return json({ error: "not_configured" }, 503);
  let body;
  try { const raw = await request.text(); if (raw.length > 4000) return json({ error: "too_large" }, 413); body = JSON.parse(raw); }
  catch (e) { return json({ error: "bad_json" }, 400); }
  const slug = typeof body.slug === "string" ? body.slug : "";
  const v = (VARIANTS.variants || {})[slug];
  if (!sellable().has(slug) || !v || !v.variant_id) return json({ error: "not_for_sale" }, 404);
  const thanks = `${siteOrigin(request)}/thanks?p=${encodeURIComponent(slug)}`;
  const payload = { data: { type: "checkouts",
    attributes: {
      product_options: { redirect_url: thanks, enabled_variants: [Number(v.variant_id)] },
      checkout_options: { embed: false, media: true, logo: true, desc: true, discount: true },
      checkout_data: { custom: cleanCustom(body.custom) },
      test_mode: env.LS_TEST_MODE === "1",
    },
    relationships: {
      store: { data: { type: "stores", id: String(env.LS_STORE_ID || VARIANTS.store_id) } },
      variant: { data: { type: "variants", id: String(v.variant_id) } },
    } } };
  let r;
  try {
    r = await fetch(LS, { method: "POST", body: JSON.stringify(payload), headers: {
      Accept: "application/vnd.api+json", "Content-Type": "application/vnd.api+json",
      Authorization: `Bearer ${env.LS_API_KEY}` } });
  } catch (e) { return json({ error: "upstream_unreachable" }, 502); }
  if (!r.ok) return json({ error: "upstream", status: r.status }, 502);
  const d = await r.json().catch(() => ({}));
  const url = d && d.data && d.data.attributes && d.data.attributes.url;
  if (!url || !/^https:\/\/[a-z0-9.-]+\.lemonsqueezy\.com\//.test(url)) return json({ error: "no_url" }, 502);
  return json({ url });
}

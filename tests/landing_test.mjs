// /go/<slug>/ landing pages (build.py, landing/*.json): one offer, one capture form, one buy button, noindex,
// never in the sitemap, default first-touch utm only as <html data-utm-*> (URL tags win in exp.js). Run after build.
import { readFileSync, readdirSync, existsSync } from "node:fs";
let pass = 0, fail = 0;
const ok = (c, n) => { if (c) pass++; else { fail++; console.log("FAIL:", n); } };
const rd = (p) => readFileSync(new URL("../" + p, import.meta.url), "utf8");
const site = JSON.parse(rd("site.json"));
const items = Object.fromEntries([...site.products, ...site.bundles].map((p) => [p.slug, p]));
const sitemap = rd("sitemap.xml");
const files = readdirSync(new URL("../landing/", import.meta.url)).filter((f) => f.endsWith(".json"));
ok(files.length > 0, "landing entries exist");
for (const f of files) {
  let d;
  try { d = JSON.parse(rd("landing/" + f)); } catch (e) { ok(false, `landing/${f}: not valid JSON (${e.message})`); continue; }
  const out = `go/${d.slug}/index.html`;
  ok(existsSync(new URL("../" + out, import.meta.url)), out + " built");
  if (!existsSync(new URL("../" + out, import.meta.url))) continue;
  const h = rd(out), p = items[d.pack];
  ok(/<meta name="robots" content="noindex">/.test(h), out + ": noindex");
  ok(!sitemap.includes("/go/" + d.slug), out + ": not in sitemap");
  const buys = h.match(/href="https:\/\/buy\.polar\.sh\/[^"]+"/g) || [];
  ok(buys.length === 1, out + ": exactly one buy link");
  ok(buys[0] === `href="${p.checkout_url}"`, out + ": buy link is the pack's own checkout link, untagged (exp.js adds visitor utm)");
  ok(h.includes(", " + p.price + "</a>"), out + ": price from the catalog");
  ok((h.match(/data-waitlist/g) || []).length === 1, out + ": exactly one capture form");
  ok(/14-day refund/.test(h), out + ": refund line");
  for (const [k, v] of Object.entries(d.default_utm || {}))
    ok(h.includes(`H.setAttribute("data-${k.replace("_", "-")}",${JSON.stringify(v)})`), out + `: default ${k}`);
  if (d.question_ids) ok((h.match(/class="qitem"/g) || []).length === d.question_ids.length, out + ": shows exactly the chosen questions");
  for (const id of d.preview_ids || []) ok(new RegExp(`/${id}\\.webp[?"]`).test(h), out + `: preview ${id} shown`);
  ok(h.includes('H.setAttribute("data-landing",' + JSON.stringify(d.slug) + ')'), out + ": landing slug for reference_id");
  for (const k of ["hook", "headline", "subhead"]) if (d[k]) ok(h.includes(d[k].replace(/&/g, "&amp;").replace(/'/g, "&#x27;")), out + `: ${k} shown`);
}
// home hero: the same one-offer block, one primary buy button above the capture form
const home = rd("index.html");
const hero = (home.match(/<section class="hero offerhero" id="top">[\s\S]*?<\/section>/) || [""])[0];
ok((hero.match(/buy\.polar\.sh/g) || []).length === 1, "home hero: one buy button");
ok((hero.match(/data-waitlist/g) || []).length === 1, "home hero: one capture form");
ok(!/data-exp=/.test(hero), "home hero: no experiment hooks rewrite the offer");
ok(!/Coming soon/.test((home.match(/<article class="pcard sampler[\s\S]*?<\/article>/) || [""])[0]), "home: free sample card is not 'coming soon'");
console.log(`landing_test: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);

# StudyStore site

Static storefront for StudyStore, served by GitHub Pages from the repo root.
Live: https://aidanmcjones.github.io/studystore/

## Edit and rebuild

All values that change live in `site.json`:

- `support_email`: set to an address and every page footer, refund, terms, and privacy page shows it. While `null`, pages read "Support email launching this week."
- `checkout_provider`: `"polar"` (default) or `"lemonsqueezy"` (dormant). Picks the Buy button path and the
  merchant named in page copy (`{{merchant}}`, `{{orders_url}}`, `{{orders_label}}`).
- `products[].checkout_url` (and `bundles[].checkout_url`): the Polar checkout link (`https://buy.polar.sh/polar_cl_...`).
  Only links for the active provider count; without one, Buy buttons read "Available soon" and are disabled.
- `products[].price`, `title`, `updated`, `base_url`, `disclaimer`.

Then run:

    python3 build.py

`build.py` (Python 3 stdlib only) renders `templates/*.html` through `templates/base.html` into `index.html`, `products/aa-enzymes.html`, `refund.html`, `terms.html`, `privacy.html`, `404.html`, and regenerates `sitemap.xml` and `robots.txt`. The built HTML is committed; commit and push to deploy.

Never put paid files (deck.apkg, pack.zip, full PDF) in this public repo. Only preview images belong in `assets/img/`.

## Notes (free SEO study articles)

`content/notes/<slug>.md` (frontmatter: title, description, product, published, related; optional updated) renders to
`notes/<slug>.html` plus `notes/index.html`. `mdlite.py` is the tiny Markdown converter. Each note needs a `:::quiz` block with
exactly 5 `Q:`/`A:` pairs. `build.py` adds Article and FAQPage JSON-LD, the pack call to action, and sitemap entries.

Assets: `/Users/aidanjones/dev/studystore/.venv/bin/python tools/gen_note_assets.py [slug]` draws each note's diagram
(`assets/notes/<slug>.png`, functions registered in `DIAGRAMS`) and Open Graph card (`assets/notes/og-<slug>.png`, 1200x630). Note cards on the home and notes index show a WebP thumbnail of the diagram when present:
`cwebp -q 82 -resize 800 0 assets/notes/<slug>.png -o assets/notes/thumb-<slug>.webp` (otherwise the OG card is used).

The autonomous writing prompt is `/Users/aidanjones/dev/studystore/engine/NOTES_PROMPT.md`.

## IndexNow (automatic indexing)

The root file `61cfad664bbb52328ce1c2a15b876a63.txt` is the public IndexNow key (its content is the key). After a push and
deploy, run `tools/ping_sitemap.sh` (all URLs) or `tools/ping_sitemap.sh --new` (URLs added in the last commit). It POSTs to
api.indexnow.org; HTTP 200 or 202 means accepted. IndexNow reaches Bing and partner engines. Google does not use IndexNow; it
finds pages through `sitemap.xml` (declared in `robots.txt`) and ordinary crawling.

## Cloudflare Pages, experiments and analytics

- Deploy: `tools/deploy_pages.sh` builds, copies an allowlist of public files into `.deploy/` (aborts on any paid or source
  file), and runs `npx wrangler@3.114.0 pages deploy` to project `studystore` (https://studystore.pages.dev).
- `functions/api/e.js`: anonymous event collector into D1 `studystore_analytics` (binding `DB` in `wrangler.toml`,
  schema in `db/schema.sql`). `functions/api/ls-webhook.js`: Lemon Squeezy `order_created` webhook, inactive until the
  `LS_WEBHOOK_SECRET` Pages secret is set.
- `experiments.json` + `assets/js/exp.js`: A/B/C tests. Mark elements with `data-exp="<id>" data-exp-field="<field>"`.
  Weights are rewritten by the private ops learner; see `ops/EXPERIMENTS.md` in the private studystore repo.

## Catalog, product pages and checkout

- `python3 /Users/aidanjones/dev/studystore/ops/sync_catalog.py` writes `site.json` products and bundles from
  engine/CATALOG.json (a pack is available only when its accuracy_report.md ends `VERDICT: PASS`), refreshes
  `ls_variants.json` from Lemon Squeezy (read-only), and regenerates preview crops with `tools/gen_previews.py`
  (max 4 cards, 5 questions, partial faded page crops). Set `STUDYSTORE_SITE` to build into another checkout.
- `products_build.py` renders every pack and bundle page (templates/product.html, bundle.html), the catalog page,
  thanks.html and `_redirects` (retired slugs). Home numbers come from `{{stat:*}}` (catalog-wide totals over available packs) and
  `{{feat:*}}` (featured pack) placeholders, never hardcoded. The home page's four scroll-drawn figures (one per MCAT
  section) are inline SVG/HTML in `templates/index.html`, drawn by `assets/js/site.js` from their formulas.
- Polar (default): Buy buttons are plain links to each item's Polar checkout link (site.json `checkout_url`). The
  Polar products, downloadable files and links are created by `ops/polar/studystore_polar.py` in the income-brain
  repo (ids in `ops/polar/studystore-catalog.json` there). `assets/js/exp.js` appends the visitor's first-touch
  `utm_*` tags and shown experiment variants (`reference_id=ss~<exp>.<variant>~...`) so Polar stores them in the
  checkout metadata. After payment Polar redirects to `/thanks?p=<slug>&checkout_id=...`.
  Test: `python3 build.py && node tests/checkout_links_test.mjs`.
- Lemon Squeezy (dormant, `checkout_provider: "lemonsqueezy"`): Buy buttons call `/api/checkout`
  (functions/api/checkout.js). It returns 503 unless `checkout_provider` is `lemonsqueezy` and the `LS_API_KEY` /
  `LS_STORE_ID` Pages secrets exist. Flipping the flag back is not an instant fallback: buttons read "Available soon"
  until `ops/sync_catalog.py` fills `ls_variants.json` with live variant ids.

## Problem reports, suggestions and owner approval

- Every page footer, note, practice and product page has a "Report a problem or suggest something" link
  (`assets/js/report.js`). With JS it opens a native `<dialog>`; without JS it goes to `/report.html`, a plain form post.
- `functions/api/report.js` (POST `/api/report`) stores rows in D1 table `reports` (schema in `db/schema.sql`, migration
  `db/migrations/002_reports.sql`): page path, kind, type (bug or feature), source, the typed text, an optional card or
  question ref and a dedupe hash. No email, IP, user agent or cookies. Public reports start `pending`; limits 5/min and
  20/day per IP (hashed, edge cache only), 4 KB body, bot filter, honeypot, duplicates within 7 days only bump `requests`.
- Owner mode: `/owner.html` saves the owner key in that browser's localStorage after the server accepts it. Reports sent
  with it (header `X-Owner-Key`) start `approved` (cap 60/hour). The server only knows the key's sha256, as the Pages
  secret `OWNER_KEY_SHA256` (set by `ops/owner_key.sh` in the private repo).
- `/admin/reports.html` (owner only, noindex): approve or reject pending public reports (`GET /api/reports`,
  `POST /api/reports/<id>`), and see the queue and recent resolutions written back by the private `feedback` job.
- Lifecycle: pending (public) -> approved -> in_progress -> fixed | needs_human | rejected.
- Tests: `node tests/functions_test.mjs` (mocked D1).

## Email list (free sampler opt-in, double opt-in)

- `waitlist.py` renders the "Free MCAT sampler" box for `{{waitlist}}` (home, product, bundle and catalog pages, notes,
  practice pages, tools, comparison guides). The free sampler (live counts of free notes and practice sets plus the
  schedule tool, set by build.py into `waitlist.STATS`) is the headline offer. The consent text
  (`waitlist.CONSENT_TEXT`) is shown verbatim next to the button with the privacy link.
- Double opt-in through the income-brain subscribe contract (income-brain `marketing/SPEC-shared.md` section 2,
  list `studystore-mcat`): `assets/js/waitlist.js` POSTs `{email, list_id, consent_text, source_url, utm, website}`
  to `https://income-brain.premed-toolkit.workers.dev/api/subscribe`; 202 shows "Check your email". `website` is the
  honeypot.
- `functions/api/subscribe.js` (same origin) serves no-JS form posts and the JS fallback: it forwards the same
  contract to the brain; if the brain is unreachable or not live (501), it keeps the address in D1 `subscribers`
  with status `pending` (never emailed by ops/launch.py, which reads `active` only). The private repo's
  `ops/reconfirm_subscribers.py` later sends each pending or old single opt-in address exactly one confirm email
  (owner-run, gated by outbox item reconfirm-email-001). Legacy single opt-in bodies from cached pages are stored pending too, and a brain 429 or non-email 400 on this server path keeps the address pending instead of losing it. Own per-visitor limit: 5 a minute, 20 a day.
- D1 table `subscribers` (migration `db/migrations/004_subscribers.sql`), unsubscribe `/api/unsubscribe?t=<token>`,
  owner view `/admin/subscribers.html`.
- Tests: `node tests/subscribe_test.mjs` (server), `node tests/waitlist_js_test.mjs` (browser script, after build).

## Comparison guides

`build_compare.py` renders `/compare/*.html` from `data/compare.json`: every competitor or AAMC number carries its
URL, whether it is the maker's own page or a third-party page, the page date if any, the check date, and an
approximate flag; StudyStore's own numbers come from `site.json`. The cost page is labeled "Estimate, not advice".
Re-check the sources and update `checked` before changing any number. Test: `node tests/compare_test.mjs`.

## Study schedule generator

`/tools/mcat-study-schedule.html` (build_tools.py, assets/js/tools/schedule.js): the 35 2027 test dates
(`TEST_DATES_2027`, verified against the AAMC U.S. calendar, `TEST_DATES_SOURCE`), free notes and practice sets per
AAMC category derived from content frontmatter, a print view that shows only the plan, and the opt-in box.
Test: `node tests/schedule_test.mjs` (after build).

# StudyStore site

Static storefront for StudyStore, served by GitHub Pages from the repo root.
Live: https://aidanmcjones.github.io/studystore/

## Edit and rebuild

All values that change live in `site.json`:

- `support_email`: set to an address and every page footer, refund, terms, and privacy page shows it. While `null`, pages read "Support email launching this week."
- `products[].checkout_url`: the Lemon Squeezy checkout link. While `null`, Buy buttons read "Available soon" and are disabled.
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
- Buy buttons call `/api/checkout` (functions/api/checkout.js). Without the `LS_API_KEY` and `LS_STORE_ID` Pages
  secrets it returns 503 and buttons read "Available soon".

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

## Launch waitlist

- `waitlist.py` renders the "Get launch day access" box for the `{{waitlist}}` placeholder (home, product, bundle and
  catalog pages, notes and the notes index, practice pages and hubs, tools and the tools index). `assets/js/waitlist.js`
  posts it to `POST /api/subscribe` (functions/api/subscribe.js) and fires the anonymous `subscribe` event through
  `window.ssTrack` in exp.js; without JS it is a plain form post.
- D1 table `subscribers` (migration `db/migrations/004_subscribers.sql`): email, optional 2027 test month, source page,
  first-touch utm tags, status (active or unsubscribed) and a random `unsub_token`. Unsubscribe link:
  `/api/unsubscribe?t=<unsub_token>` (GET or one-click POST).
- `/admin/subscribers.html` (owner only, `GET /api/subscribers`, `?export=csv` for the active list).
- Tests: `node tests/subscribe_test.mjs` (node:sqlite runs the real migration).

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
(`assets/notes/<slug>.png`, functions registered in `DIAGRAMS`) and Open Graph card (`assets/notes/og-<slug>.png`, 1200x630).

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

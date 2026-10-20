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

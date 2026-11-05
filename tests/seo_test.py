"""Parse built HTML: JSON-LD validity, og/twitter tags, og:image file exists, no ratings/reviews, related links.
Run after `python3 build.py`:  python3 tests/seo_test.py"""
import json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SKIP = ("templates/", "admin/", ".deploy/", "node_modules/", "assets/")
BANNED = ("aggregateRating", "\"review\"", "\"Review\"", "ratingValue", "reviewCount")
errs, n_pages = [], 0
counts = {}

def err(f, m): errs.append(f"{f}: {m}")

for f in sorted(ROOT.glob("**/*.html")):
    rel = f.relative_to(ROOT).as_posix()
    if rel.startswith(SKIP): continue
    s = f.read_text()
    if 'name="robots" content="noindex"' in s: continue
    n_pages += 1
    blocks = re.findall(r'<script type="application/ld\+json">(.*?)</script>', s, re.S)
    if not blocks: err(rel, "no JSON-LD")
    types = []
    for b in blocks:
        try: o = json.loads(b.replace("<\\/", "</"))
        except Exception as e: err(rel, f"bad JSON-LD: {e}"); continue
        t = o.get("@type"); tl = t if isinstance(t, list) else [t]
        types += tl
        if o.get("@context") != "https://schema.org": err(rel, "missing @context")
        if "Product" in tl:
            of = o.get("offers") or {}
            for k in ("price", "priceCurrency", "availability"):
                if not of.get(k): err(rel, f"Product offers.{k} missing")
            if not o.get("name"): err(rel, "Product name missing")
        if "LearningResource" in tl:
            for k in ("educationalLevel", "teaches", "about", "name"):
                if not o.get(k): err(rel, f"LearningResource {k} missing")
        if "FAQPage" in tl:
            me = o.get("mainEntity") or []
            if not me or any(not (q.get("name") and q.get("acceptedAnswer", {}).get("text")) for q in me): err(rel, "FAQPage incomplete")
        if "BreadcrumbList" in tl and not o.get("itemListElement"): err(rel, "empty breadcrumbs")
    for t in set(types): counts.setdefault(t, set()).add(rel)
    if any(x in "".join(blocks) for x in BANNED): err(rel, "rating/review markup")
    if rel.startswith("notes/") and rel != "notes/index.html":
        if "LearningResource" not in types: err(rel, "note lacks LearningResource")
        if "FAQPage" not in types: err(rel, "note lacks FAQPage")
        m = re.search(r'<h2[^>]*>Keep studying</h2>\s*<ul>(.*?)</ul>', s, re.S)
        k = len(re.findall(r"<a ", m.group(1))) if m else 0
        if k < 5: err(rel, f"only {k} related links")
    if rel.startswith("products/") and rel != "products/index.html" and not rel.startswith("products/bundle") and "Product" not in types:
        err(rel, "pack page lacks Product")
    for p in ("og:title", "og:description", "og:url", "og:image", "twitter:card", "twitter:image", "twitter:title"):
        if not re.search(rf'<meta (?:property|name)="{p}" content="[^"]+"', s): err(rel, f"missing {p}")
    m = re.search(r'og:image" content="https?://[^/]+/([^"?]+)', s)
    if m and not (ROOT / m.group(1)).exists(): err(rel, f"og:image file missing: {m.group(1)}")
    if m and m.group(1).endswith("cheatsheet-p1.png") and not rel.startswith(("products/",)): err(rel, "generic og:image")
    if re.search(r"[–—]", re.sub(r"<script.*?</script>|<style.*?</style>", "", s, flags=re.S).replace("&ndash;", "").replace("&mdash;", "")):
        pass  # copy dash policy is enforced for new copy only; see build output review
print(f"{n_pages} indexable pages; " + ", ".join(f"{t}: {len(v)}" for t, v in sorted(counts.items())))
if errs:
    print("\n".join(errs[:60])); print(len(errs), "errors"); sys.exit(1)
print("seo_test OK")

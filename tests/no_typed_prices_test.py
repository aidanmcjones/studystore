"""Prices come only from the catalog (site.json). Fail if any content or landing source line has a dollar amount on the
same line as a StudyStore product link or the words pack/bundle, so a typed price cannot drift from the catalog again."""
import re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MONEY = re.compile(r"\$\s?\d")
PRODUCT = re.compile(r"products/|/go/|\b(packs?|bundles?)\b", re.I)
EXTS = {".md", ".html", ".json", ".txt", ".yml", ".yaml"}
hits = []
for base in ("content", "landing"):
    for f in sorted((ROOT / base).rglob("*")):
        if not f.is_file() or f.suffix not in EXTS:
            continue
        for n, line in enumerate(f.read_text(errors="replace").splitlines(), 1):
            if MONEY.search(line) and PRODUCT.search(line):
                hits.append(f"{f.relative_to(ROOT)}:{n}: {line.strip()[:140]}")
if hits:
    print("FAIL: typed price next to a product link or pack/bundle mention (use the catalog price block instead):")
    print("\n".join(hits))
    sys.exit(1)
print("ok: no typed prices next to product mentions in content/ or landing/")

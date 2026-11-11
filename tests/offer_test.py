"""Offer blocks on notes and practice pages (build.py offer_block): general pages never claim a topic match, a/an before page counts,
and the general offer leads with the free 1A sheet. Reads the built HTML and content front matter."""
import re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
fails = 0

def check(c, name):
    global fails
    if not c:
        fails += 1
        print("FAIL:", name)

def product(md):
    m = re.search(r"^product:\s*(\S+)", md.read_text(), re.M)
    return m.group(1) if m else ""

general = topic = 0
for f in sorted((ROOT / "content" / "notes").glob("*.md")):
    html = (ROOT / "notes" / (f.stem + ".html")).read_text()
    gen = product(f) == "none" or product(f).startswith("bundle-")
    if gen:
        general += 1
        check("Studying for the MCAT?" in html, f"{f.stem}: general offer heading")
        check("this topic as a full pack" not in html and "pack for this topic" not in html and "Pack for this topic" not in html,
              f"{f.stem}: general page renders topic-match wording")
        check("data-offer=\"end\"" in html and "1A amino acids" in html, f"{f.stem}: general offer has the free 1A sheet capture")
    else:
        topic += 1
        check("Want this topic as a full pack?" in html, f"{f.stem}: topic offer heading")
check(general >= 9, f"general notes found ({general})")
check(topic > 100, "topic notes found")

# a/an before "<n>-page" in every built note and practice page
pages = list((ROOT / "notes").glob("*.html")) + list((ROOT / "practice").glob("*.html"))
seen = set()
for h in pages:
    for art, n in re.findall(r"\b([Aa]n?) (\d+)-page (?:cheat sheet|study guide)", h.read_text()):
        seen.add(n)
        want = "an" if n.startswith("8") or n in ("11", "18") else "a"
        check(art.lower() == want, f"{h.name}: '{art} {n}-page'")
sys.path.insert(0, str(ROOT))
import products_build as PB
for n, art in ((3, "a"), (8, "an"), (10, "a"), (11, "an"), (12, "a"), (18, "an"), (80, "an")):
    check(PB.a_n(n) == art, f"a_n({n}) is {art}")
print("offer_test:", "ok" if not fails else f"{fails} failed", f"(general {general}, topic {topic}, page counts seen {sorted(seen)})")
sys.exit(1 if fails else 0)

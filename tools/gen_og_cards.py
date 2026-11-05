#!/usr/bin/env python3
"""Per-page Open Graph cards (1200x630) drawn from each page's title: assets/og/<key>.png.
Only pages that would otherwise share the default share image get one (practice, hubs, bundles, compare, root pages).
Pages with their own image (notes, packs, tools) are left alone. build.py picks the file up by key.
Run after `python3 build.py`, then build again:
  /Users/aidanjones/dev/studystore/.venv/bin/python tools/gen_og_cards.py"""
import html, re, textwrap
from pathlib import Path
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "assets" / "og"
OUT.mkdir(parents=True, exist_ok=True)
PAPER, INK, MUTED, ACC, ACCD = "#f6f1e7", "#17212b", "#5d6670", "#c2410c", "#9a3412"
SKIP = ("templates", "admin", ".deploy", "node_modules", "assets")

def label(rel):
    if rel.startswith("practice/"): return "FREE MCAT PRACTICE"
    if rel.startswith("compare/"): return "MCAT PREP GUIDE"
    if rel.startswith("products/"): return "MCAT PACKS"
    if rel.startswith("notes/"): return "FREE MCAT NOTES"
    return "STUDYSTORE"

n = 0
for f in sorted(ROOT.glob("**/*.html")):
    rel = f.relative_to(ROOT).as_posix()
    if rel.startswith(SKIP): continue
    s = f.read_text()
    if 'name="robots" content="noindex"' in s: continue
    m = re.search(r'og:image" content="[^"]*/assets/img/cheatsheet-p1\.png', s)
    if not m: continue
    t = html.unescape(re.search(r'og:title" content="([^"]*)"', s).group(1))
    title = t.split(" | ")[0].strip()
    key = re.sub(r"[^a-z0-9]+", "-", rel[:-5].lower()).strip("-")
    fig = plt.figure(figsize=(12, 6.3), dpi=100); fig.patch.set_facecolor(PAPER)
    ax = fig.add_axes([0, 0, 1, 1]); ax.set_xlim(0, 1200); ax.set_ylim(0, 630); ax.axis("off")
    ax.add_patch(plt.Rectangle((0, 0), 1200, 18, fc=ACC, ec="none"))
    ax.add_patch(plt.Rectangle((70, 538), 70, 6, fc=ACC, ec="none"))
    ax.text(70, 570, "Study", fontsize=30, fontweight="bold", family="DejaVu Serif", color=INK, va="center")
    ax.text(198, 570, "Store", fontsize=30, fontweight="bold", family="DejaVu Serif", color=ACC, va="center")
    ax.text(1130, 570, label(rel), fontsize=14, color=ACCD, fontweight="bold", ha="right", va="center")
    lines = textwrap.wrap(title, 26)[:4]
    for i, ln in enumerate(lines):
        ax.text(70, 430 - i * 78 + (39 if len(lines) > 3 else 0), ln, fontsize=40, family="DejaVu Serif", fontweight="bold", color=INK, va="center")
    ax.text(70, 60, "studystore.co", fontsize=16, color=MUTED, va="center")
    fig.savefig(OUT / f"{key}.png", facecolor=PAPER); plt.close(fig); n += 1
print("cards", n)

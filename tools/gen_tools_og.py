#!/usr/bin/env python3
"""Open Graph cards (1200x630) for the free tools: assets/tools/og-<slug>.png.
Run: /Users/aidanjones/dev/studystore/.venv/bin/python tools/gen_tools_og.py"""
import textwrap
from pathlib import Path
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

OUT = Path(__file__).resolve().parent.parent / "assets" / "tools"
OUT.mkdir(parents=True, exist_ok=True)
PAPER, INK, MUTED, ACC, ACCD = "#f6f1e7", "#17212b", "#5d6670", "#c2410c", "#9a3412"
CARDS = {
    "index": ("Free MCAT study tools", "Quiz, trainer, planner, percentile lookup"),
    "amino-acid-quiz": ("Amino Acid Quiz: names, codes, structures, charge", "Free, no signup, works on your phone"),
    "pka-trainer": ("pKa and Charge at pH Trainer", "Henderson-Hasselbalch, worked step by step"),
    "mcat-study-schedule": ("MCAT Study Schedule Generator for 2027", "Week-by-week plan, .ics export, printable"),
    "mcat-percentile": ("MCAT Percentile Lookup and Target Score", "Official AAMC table, May 2026 to April 2027"),
}
for slug, (title, sub) in CARDS.items():
    fig = plt.figure(figsize=(12, 6.3), dpi=100); fig.patch.set_facecolor(PAPER)
    ax = fig.add_axes([0, 0, 1, 1]); ax.set_xlim(0, 1200); ax.set_ylim(0, 630); ax.axis("off")
    ax.add_patch(plt.Rectangle((0, 0), 1200, 18, fc=ACC, ec="none"))
    ax.add_patch(plt.Rectangle((70, 538), 70, 6, fc=ACC, ec="none"))
    ax.text(70, 570, "Study", fontsize=30, fontweight="bold", family="DejaVu Serif", color=INK, va="center")
    ax.text(198, 570, "Store", fontsize=30, fontweight="bold", family="DejaVu Serif", color=ACC, va="center")
    ax.text(1130, 570, "FREE MCAT TOOL", fontsize=14, color=ACCD, fontweight="bold", ha="right", va="center")
    lines = textwrap.wrap(title, 26)[:3]
    for i, ln in enumerate(lines):
        ax.text(70, 430 - i * 78, ln, fontsize=40, family="DejaVu Serif", fontweight="bold", color=INK, va="center")
    ax.text(70, 150, sub, fontsize=19, color=MUTED, va="center")
    ax.text(70, 70, "studystore.co/tools", fontsize=17, color=MUTED, va="center")
    fig.savefig(OUT / f"og-{slug}.png", dpi=100, facecolor=PAPER); plt.close(fig)
print("ok")

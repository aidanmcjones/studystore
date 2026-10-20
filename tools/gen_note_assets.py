#!/usr/bin/env python3
"""Generate note diagrams and Open Graph cards into assets/notes/.

Run with the matplotlib venv:
  /Users/aidanjones/dev/studystore/.venv/bin/python tools/gen_note_assets.py [slug ...]

- Diagrams: one function per note slug in DIAGRAMS (saved as assets/notes/<slug>.png).
  A new note adds its own function here. Diagrams are original drawings.
- OG cards: generated for EVERY note in content/notes (assets/notes/og-<slug>.png, 1200x630).
"""
import sys, textwrap
from pathlib import Path
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch, Circle, FancyArrow

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
sys.path.insert(0, str(ROOT))
from mdlite import parse_frontmatter  # noqa: E402

OUT = ROOT / "assets" / "notes"
OUT.mkdir(parents=True, exist_ok=True)
PAPER, CARD, INK, MUTED = "#f6f1e7", "#fffdf8", "#17212b", "#5d6670"
ACC, ACCD, TEAL, LINE = "#c2410c", "#9a3412", "#0f5f6b", "#ddd3c0"
GREY = "#8a8f96"
plt.rcParams.update({"font.family": "DejaVu Sans", "axes.edgecolor": INK, "axes.labelcolor": INK,
                     "xtick.color": INK, "ytick.color": INK, "text.color": INK,
                     "axes.spines.top": False, "axes.spines.right": False})

def save(fig, name):
    fig.savefig(OUT / f"{name}.png", dpi=150, facecolor="white", bbox_inches="tight", pad_inches=0.15)
    plt.close(fig)

def titration():
    pk1, pk2 = 2.34, 9.60
    pH = np.linspace(0.3, 11.8, 600)
    n = 1 / (1 + 10 ** (pk1 - pH)) + 1 / (1 + 10 ** (pk2 - pH))
    fig, ax = plt.subplots(figsize=(7.6, 5))
    ax.plot(n, pH, color=TEAL, lw=3)
    pI = (pk1 + pk2) / 2
    for y, lab, x in [(pk1, "pKa1 = 2.3\n(COOH half deprotonated)", 0.5), (pk2, "pKa2 = 9.6\n(NH3+ half deprotonated)", 1.5)]:
        ax.plot([0, x], [y, y], ls="--", color=GREY, lw=1)
        ax.plot([x], [y], "o", color=ACC, ms=9)
        if x < 1:
            ax.text(x + 0.07, y - 0.15, lab, ha="left", va="top", fontsize=9.5)
        else:
            ax.text(x + 0.05, y - 1.0, lab, ha="left", va="top", fontsize=9.5)
    ax.plot([0, 1], [pI, pI], ls="--", color=GREY, lw=1)
    ax.plot([1], [pI], "s", color=INK, ms=8)
    ax.text(1.06, pI, "pI = 6.0\nnet charge 0", fontsize=10, fontweight="bold", va="center")
    for x, y, t in [(0.3, 0.5, "net +1"), (0.55, 6.0, "net 0"), (1.55, 11.0, "net -1")]:
        ax.text(x, y, t, fontsize=11, color=ACCD, fontweight="bold")
    ax.set_xlim(0, 2); ax.set_ylim(0, 12.2)
    ax.set_xlabel("Equivalents of OH- added"); ax.set_ylabel("pH")
    ax.set_title("Glycine titration: charge steps down at each pKa", fontsize=12.5, loc="left", fontweight="bold")
    save(fig, "amino-acid-pka-charge-ph-7-4")

def mm_lb():
    Vmax, Km = 50.0, 2.0
    fig, (a, b) = plt.subplots(1, 2, figsize=(10.5, 4.6))
    S = np.linspace(0, 20, 400)
    v = Vmax * S / (Km + S)
    a.plot(S, v, color=TEAL, lw=3)
    a.axhline(Vmax, color=GREY, ls=":", lw=1.2); a.text(20, Vmax + 1.2, "Vmax", ha="right", fontsize=10.5, fontweight="bold")
    a.plot([0, Km, Km], [Vmax / 2, Vmax / 2, 0], ls="--", color=ACC, lw=1.4)
    a.plot([Km], [Vmax / 2], "o", color=ACC, ms=8)
    a.text(Km + 0.5, 7, "Km", color=ACCD, fontsize=11, fontweight="bold")
    a.annotate("Vmax/2 = 25", (0.0, Vmax / 2), (5.5, 16), color=ACCD, fontsize=10, arrowprops=dict(arrowstyle="-", color=GREY))
    a.set_xlim(0, 20); a.set_ylim(0, 58)
    a.set_xlabel("[S] (mM)"); a.set_ylabel("v (umol/min)")
    a.set_title("Michaelis-Menten", fontsize=12, loc="left", fontweight="bold")
    x = np.linspace(-0.75, 2.0, 100)
    y = (Km / Vmax) * x + 1 / Vmax
    b.plot(x, y, color=TEAL, lw=3)
    b.axhline(0, color=INK, lw=1); b.axvline(0, color=INK, lw=1)
    b.plot([0], [1 / Vmax], "o", color=ACC, ms=8); b.plot([-1 / Km], [0], "o", color=ACC, ms=8)
    b.annotate("y-intercept = 1/Vmax", (0, 1 / Vmax), (0.25, 0.012), fontsize=10, arrowprops=dict(arrowstyle="-", color=GREY))
    b.annotate("x-intercept = -1/Km", (-1 / Km, 0), (-0.72, 0.045), fontsize=10, arrowprops=dict(arrowstyle="-", color=GREY))
    b.text(0.3, 0.078, "slope = Km/Vmax", fontsize=10.5, color=ACCD, fontweight="bold")
    b.set_xlim(-0.8, 2.0); b.set_ylim(-0.006, 0.1)
    b.set_xlabel("1/[S] (1/mM)"); b.set_ylabel("1/v (min/umol)")
    b.set_title("Lineweaver-Burk", fontsize=12, loc="left", fontweight="bold")
    fig.tight_layout()
    save(fig, "michaelis-menten-and-lineweaver-burk")

def inhibition():
    Vm, Km = 1.0, 1.0
    cases = [("Competitive", 3, 1, "Km up, Vmax same\nlines meet on the y-axis"),
             ("Uncompetitive", 1, 3, "Km down, Vmax down\nparallel lines"),
             ("Noncompetitive", 3, 3, "Km same, Vmax down\nlines meet on the x-axis"),
             ("Mixed", 3, 1.8, "Km up here, Vmax down\nlines meet off-axis")]
    fig, axs = plt.subplots(2, 2, figsize=(9.6, 7.4), sharex=True, sharey=True)
    x = np.linspace(-1.9, 2.6, 100)
    for ax, (name, al, alp, note) in zip(axs.flat, cases):
        ax.plot(x, (Km / Vm) * x + 1 / Vm, color=GREY, lw=2.5, label="no inhibitor")
        ax.plot(x, (al * Km / Vm) * x + alp / Vm, color=ACC, lw=2.5, label="with inhibitor")
        ax.axhline(0, color=INK, lw=1); ax.axvline(0, color=INK, lw=1)
        ax.set_title(name, fontsize=12, loc="left", fontweight="bold")
        ax.text(-1.85, 3.55, note, fontsize=9.5, va="top", color=MUTED)
        ax.set_xlim(-1.95, 2.6); ax.set_ylim(-1.2, 4.0)
        ax.set_xticks([]); ax.set_yticks([])
    axs[0, 0].legend(loc="lower right", fontsize=8.5, frameon=False)
    for ax in axs[1]: ax.set_xlabel("1/[S]")
    for ax in axs[:, 0]: ax.set_ylabel("1/v")
    fig.tight_layout()
    save(fig, "enzyme-inhibition-types-compared")

def protein():
    fig, axs = plt.subplots(1, 4, figsize=(12.5, 4.1))
    rng = np.random.default_rng(3)
    titles = [("1. Primary", "sequence\npeptide bonds (covalent)"),
              ("2. Secondary", "helices and sheets\nbackbone H bonds"),
              ("3. Tertiary", "fold of one chain\nhydrophobic effect, ionic,\nH bonds, disulfides"),
              ("4. Quaternary", "several chains\nsame forces, between chains")]
    for ax, (t, sub) in zip(axs, titles):
        ax.set_xlim(0, 10); ax.set_ylim(0, 10); ax.axis("off")
        ax.add_patch(FancyBboxPatch((0.2, 0.2), 9.6, 9.6, boxstyle="round,pad=0.02,rounding_size=0.4", fc=CARD, ec=LINE, lw=1.5))
        ax.text(5, 9.1, t, ha="center", fontsize=13, fontweight="bold")
        ax.text(5, 1.4, sub, ha="center", va="center", fontsize=9.5, color=MUTED)
    a = axs[0]
    xs = np.linspace(1.2, 8.8, 8); ys = 5.4 + np.array([0.5, -0.4, 0.5, -0.4, 0.5, -0.4, 0.5, -0.4])
    a.plot(xs, ys, color=GREY, lw=2, zorder=1)
    cols = [TEAL, ACC, TEAL, GREY, ACC, TEAL, GREY, ACC]
    for x, y, c in zip(xs, ys, cols): a.add_patch(Circle((x, y), 0.5, fc=c, ec="white", lw=1.5, zorder=2))
    a.text(1.2, 6.9, "N", ha="center", fontweight="bold"); a.text(8.8, 6.9, "C", ha="center", fontweight="bold")
    a = axs[1]
    t = np.linspace(0, 4.2 * np.pi, 400)
    a.plot(1.2 + t * 0.52, 6.5 + 0.9 * np.sin(t), color=TEAL, lw=3.5)
    a.plot(1.2 + t * 0.52, 6.5 + 0.9 * np.sin(t + 1.0), color=TEAL, lw=1.4, alpha=0.5)
    a.text(5, 7.9, "alpha helix", ha="center", fontsize=9.5, color=TEAL)
    for i, yy in enumerate([4.3, 3.4]):
        a.add_patch(FancyArrow(1.4, yy, 6.8, 0, width=0.4, head_width=0.85, head_length=0.9, fc=ACC if i == 0 else "#e08a5c", ec="none", length_includes_head=True))
    a.text(5, 4.95, "beta strands", ha="center", fontsize=9.5, color=ACCD)
    a = axs[2]
    th = np.linspace(0, 2 * np.pi, 400)
    r = 2.7 + 0.5 * np.sin(5 * th) + 0.3 * np.cos(3 * th)
    a.plot(5 + r * np.cos(th), 5.4 + r * 0.85 * np.sin(th), color=TEAL, lw=3.5)
    a.plot([3.9, 6.2], [6.6, 4.2], color=ACC, lw=3); a.text(5.15, 5.5, "S-S", color=ACCD, fontsize=9.5, fontweight="bold", ha="center", rotation=-47)
    a = axs[3]
    for cx, cy, c, lab in [(3.2, 5.6, TEAL, "subunit A"), (6.8, 5.6, ACC, "subunit B")]:
        r = 1.9 + 0.3 * np.sin(4 * th)
        a.fill(cx + r * np.cos(th), cy + r * 0.9 * np.sin(th), color=c, alpha=0.85)
        a.text(cx, cy, lab, ha="center", va="center", color="white", fontsize=9.5, fontweight="bold")
    fig.tight_layout()
    save(fig, "protein-structure-levels-and-denaturation")

def hh():
    pKa = 4.76
    pH = np.linspace(2, 7.5, 400)
    fa = 1 / (1 + 10 ** (pH - pKa))
    fig, ax = plt.subplots(figsize=(8, 4.6))
    ax.axvspan(pKa - 1, pKa + 1, color="#fbe3d3", alpha=0.8, lw=0)
    ax.plot(pH, fa, color=TEAL, lw=3, label="acetic acid (HA)")
    ax.plot(pH, 1 - fa, color=ACC, lw=3, label="acetate (A-)")
    ax.plot([pKa], [0.5], "o", color=INK, ms=9)
    ax.annotate("pH = pKa = 4.76\n[A-] = [HA]", (pKa, 0.5), (5.45, 0.62), fontsize=10.5, fontweight="bold", arrowprops=dict(arrowstyle="-", color=GREY))
    ax.text(pKa, 0.03, "buffer range: pKa +/- 1", ha="center", fontsize=10, color=ACCD, fontweight="bold")
    ax.annotate("10 : 1\nacid : base", (pKa - 1, 0.91), (2.4, 0.74), fontsize=9.5, arrowprops=dict(arrowstyle="-", color=GREY))
    ax.annotate("1 : 10", (pKa + 1, 0.09), (6.6, 0.25), fontsize=9.5, arrowprops=dict(arrowstyle="-", color=GREY))
    ax.set_xlim(2, 7.5); ax.set_ylim(0, 1.05)
    ax.set_xlabel("pH"); ax.set_ylabel("fraction of total")
    ax.legend(loc="center left", frameon=False, bbox_to_anchor=(0.0, 0.5), ncol=1)
    ax.set_title("Henderson-Hasselbalch in one picture", fontsize=12.5, loc="left", fontweight="bold")
    save(fig, "henderson-hasselbalch-for-the-mcat")

def ec():
    rows = [("EC 1", "Oxidoreductases", "electrons move: AH2 + B -> A + BH2", "lactate dehydrogenase"),
            ("EC 2", "Transferases", "a group moves: A-X + B -> A + B-X", "hexokinase (kinases)"),
            ("EC 3", "Hydrolases", "water splits a bond: A-B + H2O -> A-OH + B-H", "trypsin, lipase"),
            ("EC 4", "Lyases", "bond made or broken, no water, no redox", "aldolase, decarboxylases"),
            ("EC 5", "Isomerases", "one molecule rearranged: A -> A'", "triose phosphate isomerase"),
            ("EC 6", "Ligases", "join two molecules, ATP pays: A + B + ATP -> A-B", "DNA ligase"),
            ("EC 7", "Translocases", "move across a membrane (added 2018)", "ATP synthase")]
    colors = [TEAL, ACC, "#7a5c2e", "#4a6b2f", "#6b3f7a", "#8a2f4a", "#2f4f7a"]
    fig, ax = plt.subplots(figsize=(10.5, 6.2))
    ax.set_xlim(0, 100); ax.set_ylim(0, 7.3); ax.axis("off")
    for i, ((n, name, rx, ex), c) in enumerate(zip(rows, colors)):
        y = 6.3 - i * 0.9
        ax.add_patch(FancyBboxPatch((0.5, y - 0.36), 9, 0.72, boxstyle="round,pad=0.02,rounding_size=0.15", fc=c, ec="none"))
        ax.text(5, y, n, color="white", ha="center", va="center", fontsize=12, fontweight="bold")
        ax.add_patch(FancyBboxPatch((10, y - 0.36), 89.5, 0.72, boxstyle="round,pad=0.02,rounding_size=0.15", fc=CARD, ec=LINE))
        ax.text(11.5, y, name, va="center", fontsize=12, fontweight="bold", color=c)
        ax.text(34, y, rx, va="center", fontsize=9.8)
        ax.text(98.5, y, ex, va="center", ha="right", fontsize=9.3, color=MUTED, style="italic")
    ax.text(0.5, 7.1, "The seven enzyme classes", fontsize=13.5, fontweight="bold", va="center")
    save(fig, "enzyme-classes-ec-1-to-7")

DIAGRAMS = {
    "amino-acid-pka-charge-ph-7-4": titration,
    "michaelis-menten-and-lineweaver-burk": mm_lb,
    "enzyme-inhibition-types-compared": inhibition,
    "protein-structure-levels-and-denaturation": protein,
    "henderson-hasselbalch-for-the-mcat": hh,
    "enzyme-classes-ec-1-to-7": ec,
}

def og_card(slug, title):
    fig = plt.figure(figsize=(12, 6.3), dpi=100)
    fig.patch.set_facecolor(PAPER)
    ax = fig.add_axes([0, 0, 1, 1]); ax.set_xlim(0, 1200); ax.set_ylim(0, 630); ax.axis("off")
    ax.add_patch(plt.Rectangle((0, 0), 1200, 18, fc=ACC, ec="none"))
    ax.add_patch(plt.Rectangle((70, 538), 70, 6, fc=ACC, ec="none"))
    ax.text(70, 570, "Study", fontsize=30, fontweight="bold", family="DejaVu Serif", color=INK, va="center")
    ax.text(70 + 128, 570, "Store", fontsize=30, fontweight="bold", family="DejaVu Serif", color=ACC, va="center")
    ax.text(1130, 570, "FREE MCAT STUDY NOTE", fontsize=14, color=ACCD, fontweight="bold", ha="right", va="center")
    lines = textwrap.wrap(title, 26)[:4]
    size = 50 if len(lines) <= 2 else 42
    for i, ln in enumerate(lines):
        ax.text(70, 440 - i * (size * 1.5), ln, fontsize=size * 0.75, family="DejaVu Serif", fontweight="bold", color=INK, va="center")
    ax.text(70, 70, "studystore.co/notes", fontsize=17, color=MUTED, va="center")
    ax.text(1130, 70, "Original diagram + 5-question quiz", fontsize=15, color=MUTED, ha="right", va="center")
    fig.savefig(OUT / f"og-{slug}.png", dpi=100, facecolor=PAPER)
    plt.close(fig)

def main():
    only = set(sys.argv[1:])
    for f in sorted((ROOT / "content" / "notes").glob("*.md")):
        slug = f.stem
        if only and slug not in only: continue
        meta, _ = parse_frontmatter(f.read_text())
        og_card(slug, meta["title"])
        if slug in DIAGRAMS:
            DIAGRAMS[slug]()
        elif not (OUT / f"{slug}.png").exists():
            print(f"WARNING: no diagram for {slug}; add a function to DIAGRAMS")
        print("assets:", slug)

if __name__ == "__main__":
    main()

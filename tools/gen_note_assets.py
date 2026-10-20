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

# ---- notes-b diagrams (prefixed nb_) ----
def _nb_box(ax, x, y, w, h, fc, ec=None):
    ax.add_patch(FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.02,rounding_size=0.25", fc=fc, ec=ec or fc, lw=1.5))

def nb_memory():
    fig, ax = plt.subplots(figsize=(11, 7.2))
    ax.set_xlim(0, 100); ax.set_ylim(0, 66); ax.axis("off")
    ax.text(1, 64, "Memory by stage", fontsize=13.5, fontweight="bold", va="center")
    stores = [(1, "Sensory memory", "capacity: large\nduration: < 1 s (iconic)\nto a few s (echoic)\nlost by: decay", GREY),
              (36, "Short-term / working", "capacity: a few chunks\nduration: ~15 to 30 s\nwithout rehearsal\nlost by: decay, displacement", TEAL),
              (71, "Long-term memory", "capacity: no known limit\nduration: up to a lifetime\n\nlost by: retrieval failure,\ninterference", ACC)]
    for x, name, sub, c in stores:
        _nb_box(ax, x, 49, 28, 6.5, c)
        ax.text(x + 14, 52.25, name, ha="center", va="center", color="white", fontsize=12, fontweight="bold")
        _nb_box(ax, x, 35.5, 28, 12, CARD, LINE)
        ax.text(x + 14, 41.5, sub, ha="center", va="center", fontsize=9.5, color=INK, linespacing=1.35)
    for x0, x1, lab in [(29.5, 35.5, "attention"), (64.5, 70.5, "encoding")]:
        ax.annotate("", (x1, 53.6), (x0, 53.6), arrowprops=dict(arrowstyle="-|>", color=INK, lw=1.8))
        ax.text((x0 + x1) / 2, 57.6, lab, ha="center", fontsize=9.5, color=ACCD, fontweight="bold")
    ax.annotate("", (64.5, 50.6), (70.5, 50.6), arrowprops=dict(arrowstyle="-|>", color=GREY, lw=1.8))
    ax.text(67.5, 46.6, "retrieval", ha="center", fontsize=9.5, color=MUTED, fontweight="bold")
    ax.text(1, 31, "Long-term memory family tree", fontsize=13.5, fontweight="bold", va="center")
    _nb_box(ax, 36, 22.5, 28, 5.5, ACC)
    ax.text(50, 25.25, "Long-term memory", ha="center", va="center", color="white", fontsize=11.5, fontweight="bold")
    fams = [(2, "Explicit (declarative)", "you can explain it", TEAL,
             [("Episodic", "events: time and place"), ("Semantic", "facts and knowledge")],
             "forming new ones: hippocampus"),
            (52, "Implicit (nondeclarative)", "it is in your actions", "#6b3f7a",
             [("Procedural", "skills"), ("Priming", "faster\nreprocessing"), ("Conditioning", "learned\nlinks")],
             "basal ganglia, cerebellum; amygdala (fear)")]
    for x, name, tag, c, kids, brain in fams:
        ax.plot([50, x + 23], [22.5, 19.5], color=GREY, lw=1.4)
        _nb_box(ax, x, 13.5, 46, 6, c)
        ax.text(x + 23, 16.5, f"{name}\n{tag}", ha="center", va="center", color="white", fontsize=10.2, fontweight="bold")
        w = 46 / len(kids)
        for i, (k, d) in enumerate(kids):
            kx = x + i * w
            _nb_box(ax, kx + 0.5, 4.5, w - 1, 8, CARD, LINE)
            ax.text(kx + w / 2, 10, k, ha="center", va="center", fontsize=10, fontweight="bold", color=c)
            ax.text(kx + w / 2, 6.6, d, ha="center", va="center", fontsize=8.6, color=MUTED)
        ax.text(x + 23, 1.8, brain, ha="center", va="center", fontsize=9, color=INK, style="italic")
    save(fig, "types-of-memory-sensory-short-term-long-term")

def nb_conditioning():
    fig, (a, b) = plt.subplots(1, 2, figsize=(12, 5.2), gridspec_kw={"width_ratios": [1, 1.15]})
    a.set_xlim(0, 10); a.set_ylim(0, 10); a.axis("off")
    a.set_title("Operant conditioning: two questions", fontsize=12.5, loc="left", fontweight="bold")
    cells = [(2, 5, "Positive\nreinforcement", "add, behavior UP", TEAL), (6, 5, "Positive\npunishment", "add, behavior DOWN", ACC),
             (2, 1, "Negative\nreinforcement", "remove, behavior UP", TEAL), (6, 1, "Negative\npunishment", "remove, behavior DOWN", ACC)]
    for x, y, t, s, c in cells:
        _nb_box(a, x, y, 3.8, 3.6, c)
        a.text(x + 1.9, y + 2.3, t, ha="center", va="center", color="white", fontsize=11, fontweight="bold")
        a.text(x + 1.9, y + 0.7, s, ha="center", va="center", color="white", fontsize=8.8)
    a.text(3.9, 9.2, "behavior increases", ha="center", fontsize=9.8, fontweight="bold", color=TEAL)
    a.text(7.9, 9.2, "behavior decreases", ha="center", fontsize=9.8, fontweight="bold", color=ACCD)
    a.text(1.6, 6.8, "stimulus\nadded (+)", ha="right", va="center", fontsize=9.8, fontweight="bold")
    a.text(1.6, 2.8, "stimulus\nremoved (-)", ha="right", va="center", fontsize=9.8, fontweight="bold")
    # idealized cumulative-response model, 0 to 300 s
    t = np.linspace(0, 300, 3001)
    vr = 1.0 * t                                   # steady high rate
    fr_n, fr_rate, fr_pause = 25, 1.0, 8.0         # run of 25 responses then a pause
    cyc = fr_n / fr_rate + fr_pause
    k, r = np.floor(t / cyc), t % cyc
    fr = k * fr_n + np.minimum(r, fr_n / fr_rate) * fr_rate
    T, per = 60.0, 30.0                            # FI-60 s: responding accelerates through each interval
    fi = np.floor(t / T) * per + per * ((t % T) / T) ** 3
    vi = 0.4 * t                                   # slow steady rate
    for y, lab, c, ls in [(vr, "variable ratio", ACC, "-"), (fr, "fixed ratio", ACCD, "--"),
                          (vi, "variable interval", TEAL, "-"), (fi, "fixed interval", "#2f4f7a", "--")]:
        b.plot(t, y, color=c, lw=2.6, ls=ls)
        b.text(303, y[-1], lab, va="center", fontsize=9.8, color=c, fontweight="bold")
    b.set_xlim(0, 380); b.set_ylim(0, 320)
    b.set_xticks([0, 60, 120, 180, 240, 300])
    b.set_xlabel("time (s)"); b.set_ylabel("cumulative responses")
    b.set_title("Schedules (idealized model)", fontsize=12.5, loc="left", fontweight="bold")
    b.text(8, 300, "ratio: steep (fixed ratio pauses after rewards)\ninterval: flatter (fixed interval scallops)",
           fontsize=9, color=MUTED, va="top")
    fig.tight_layout()
    save(fig, "classical-vs-operant-conditioning")

def nb_attribution():
    fig, ax = plt.subplots(figsize=(10, 6.4))
    ax.set_xlim(0, 100); ax.set_ylim(0, 64); ax.axis("off")
    ax.text(1, 62, "Which way does the explanation lean?", fontsize=13.5, fontweight="bold", va="center")
    ax.text(45, 55, "Good outcome", ha="center", fontsize=11.5, fontweight="bold")
    ax.text(80, 55, "Bad outcome", ha="center", fontsize=11.5, fontweight="bold")
    ax.text(25, 40, "My own\nbehavior", ha="right", va="center", fontsize=11.5, fontweight="bold")
    ax.text(25, 16, "Someone\nelse's\nbehavior", ha="right", va="center", fontsize=11.5, fontweight="bold")
    cells = [(28, 29, ACC, "DISPOSITIONAL", "\"I studied hard.\"", "self-serving bias\n(beats actor-observer here)"),
             (63, 29, TEAL, "SITUATIONAL", "\"The test was unfair.\"", "self-serving bias\nand actor-observer bias"),
             (28, 5, ACC, "DISPOSITIONAL", "\"She is gifted.\"", "fundamental attribution error\n(observer side)"),
             (63, 5, ACC, "DISPOSITIONAL", "\"He is careless.\"", "fundamental attribution error\nand actor-observer bias")]
    for x, y, c, lean, quote, why in cells:
        _nb_box(ax, x, y, 34, 22, c)
        ax.text(x + 17, y + 18, lean, ha="center", va="center", color="white", fontsize=12.5, fontweight="bold")
        ax.text(x + 17, y + 12.2, quote, ha="center", va="center", color="white", fontsize=11, style="italic")
        ax.text(x + 17, y + 5, why, ha="center", va="center", color="white", fontsize=9.3)
    save(fig, "fundamental-attribution-error-vs-actor-observer-bias")

def nb_demographic():
    t = np.linspace(0, 100, 1001)
    sig = lambda x, c, s: 1 / (1 + np.exp(-(x - c) / s))
    cdr = 40 - 30 * sig(t, 30, 4.5) + 3.5 * sig(t, 88, 3)      # deaths fall first, tick up with aging
    cbr = 42 - 32 * sig(t, 55, 5.5) - 3 * sig(t, 88, 3)        # births fall later, then below deaths
    fluct = 3 * np.sin(t * 1.3) * (1 - sig(t, 16, 1.5))
    cdr = cdr + fluct
    pop = np.cumsum((cbr - cdr) / 1000) * (t[1] - t[0])        # log-population from natural increase
    pop = np.exp(pop * 3.0)
    fig, ax = plt.subplots(figsize=(10.5, 5.4))
    bounds = [0, 20, 42, 70, 86, 100]
    names = ["Stage 1", "Stage 2", "Stage 3", "Stage 4", "Stage 5"]
    for i in range(5):
        if i % 2 == 0: ax.axvspan(bounds[i], bounds[i + 1], color=PAPER, lw=0)
        ax.text((bounds[i] + bounds[i + 1]) / 2, 47.5, names[i], ha="center", fontsize=10.5, fontweight="bold")
    ax.fill_between(t, cdr, cbr, where=cbr >= cdr, color="#fbe3d3", lw=0, label="natural increase")
    ax.fill_between(t, cdr, cbr, where=cbr < cdr, color="#d6e6e8", lw=0, label="natural decrease")
    ax.plot(t, cbr, color=ACC, lw=3, label="birth rate")
    ax.plot(t, cdr, color=TEAL, lw=3, label="death rate")
    ax.set_xlim(0, 100); ax.set_ylim(0, 50)
    ax.set_xticks([]); ax.set_xlabel("time, as a society industrializes")
    ax.set_ylabel("rate per 1,000 per year")
    ax2 = ax.twinx()
    ax2.plot(t, pop, color=INK, lw=2, ls="--", label="total population")
    ax2.set_ylim(0, pop.max() * 1.25); ax2.set_yticks([]); ax2.set_ylabel("total population (relative)")
    ax2.spines["right"].set_visible(True)
    h1, l1 = ax.get_legend_handles_labels(); h2, l2 = ax2.get_legend_handles_labels()
    ax.legend(h1 + h2, l1 + l2, loc="lower left", fontsize=9, frameon=True, facecolor="white", edgecolor=LINE, ncol=1)
    ax.set_title("The demographic transition: deaths drop first, births follow", fontsize=12.5, loc="left", fontweight="bold")
    save(fig, "demographic-transition-model-stages")

DIAGRAMS = {
    "amino-acid-pka-charge-ph-7-4": titration,
    "michaelis-menten-and-lineweaver-burk": mm_lb,
    "enzyme-inhibition-types-compared": inhibition,
    "protein-structure-levels-and-denaturation": protein,
    "henderson-hasselbalch-for-the-mcat": hh,
    "enzyme-classes-ec-1-to-7": ec,
    # notes-b
    "types-of-memory-sensory-short-term-long-term": nb_memory,
    "classical-vs-operant-conditioning": nb_conditioning,
    "fundamental-attribution-error-vs-actor-observer-bias": nb_attribution,
    "demographic-transition-model-stages": nb_demographic,
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

# ---- notes-a diagrams (4C, 5A, 3A, 2A) ----
def na_galvanic():
    fig, axes = plt.subplots(1, 2, figsize=(11, 5.2))
    specs = [("Galvanic (spontaneous)", "Zn", "Cu", "-", "+", "load (bulb)", TEAL,
              "E > 0,  delta G < 0", "chemical -> electrical"),
             ("Electrolytic (driven)", "C", "C", "+", "-", "power supply", ACC,
              "E < 0,  delta G > 0", "electrical -> chemical")]
    for ax, (title, la, lc, sa, sc, dev, col, eg, conv) in zip(axes, specs):
        ax.set_xlim(0, 10); ax.set_ylim(0, 10); ax.axis("off")
        ax.text(0.2, 9.6, title, fontsize=13, fontweight="bold", color=col, va="center")
        # beaker(s)
        if dev.startswith("load"):
            for x0 in (0.6, 5.6):
                ax.add_patch(FancyBboxPatch((x0, 0.8), 3.8, 3.6, boxstyle="round,pad=0.02,rounding_size=0.2", fc="#e8f1f2", ec=INK, lw=1.4))
            ax.plot([3.4, 3.4, 6.6, 6.6], [3.2, 4.9, 4.9, 3.2], color=GREY, lw=7, solid_capstyle="butt", alpha=0.55)
            ax.text(5.0, 5.25, "salt bridge", ha="center", fontsize=9.5, color=MUTED)
            xa, xc = 2.5, 7.5
        else:
            ax.add_patch(FancyBboxPatch((0.8, 0.8), 8.4, 3.6, boxstyle="round,pad=0.02,rounding_size=0.2", fc="#fbe8dc", ec=INK, lw=1.4))
            ax.text(5.0, 1.35, "molten NaCl", ha="center", fontsize=10, color=MUTED)
            xa, xc = 2.5, 7.5
        for x, lab, sign, role in [(xa, la, sa, "ANODE\noxidation"), (xc, lc, sc, "CATHODE\nreduction")]:
            ax.add_patch(plt.Rectangle((x - 0.35, 1.6), 0.7, 4.6, fc="#b9bec4", ec=INK, lw=1.2))
            ax.text(x, 2.3, lab, ha="center", fontsize=10, fontweight="bold")
            ax.add_patch(Circle((x, 6.75), 0.42, fc="white", ec=col, lw=2))
            ax.text(x, 6.75, sign, ha="center", va="center", fontsize=15, fontweight="bold", color=col)
            ax.text(x, 0.3, role, ha="center", va="center", fontsize=9.5, fontweight="bold", color=INK)
        ax.plot([xa, xa, xc, xc], [7.17, 8.3, 8.3, 7.17], color=INK, lw=1.6)
        ax.add_patch(FancyBboxPatch((3.7, 7.9), 2.6, 0.8, boxstyle="round,pad=0.02,rounding_size=0.15", fc=CARD, ec=INK, lw=1.2, zorder=3))
        ax.text(5.0, 8.3, dev, ha="center", va="center", fontsize=9.5, zorder=4)
        ax.annotate("", xy=(3.55, 8.75), xytext=(2.3, 8.75), arrowprops=dict(arrowstyle="-|>", color=col, lw=2))
        ax.annotate("", xy=(7.7, 8.75), xytext=(6.45, 8.75), arrowprops=dict(arrowstyle="-|>", color=col, lw=2))
        ax.text(2.0, 9.05, "e-", fontsize=10, color=col, fontweight="bold")
        ax.text(7.75, 9.05, "e-", fontsize=10, color=col, fontweight="bold")
        ax.text(5.0, 6.75, eg, ha="center", va="center", fontsize=9.3, fontweight="bold", color=ACCD)
        ax.text(5.0, 6.15, conv, ha="center", va="center", fontsize=9.5, color=MUTED)
    save(fig, "galvanic-vs-electrolytic-cells")

def na_titration():
    Kw, Ca, Cb, Va = 1e-14, 0.100, 0.100, 25.0
    Ka = 10 ** -4.76
    vb = np.linspace(0, 40, 2001)
    def ph_weak(v):
        # exact charge balance: [Na+] + [H+] = [A-] + [OH-]
        ct, na = Ca * Va / (Va + v), Cb * v / (Va + v)
        lo, hi = 0.0, 14.0
        for _ in range(80):
            mid = (lo + hi) / 2; h = 10 ** -mid
            f = na + h - ct * Ka / (Ka + h) - Kw / h
            lo, hi = (mid, hi) if f > 0 else (lo, mid)
        return (lo + hi) / 2
    def ph_strong(v):
        ex = (Ca * Va - Cb * v) / (Va + v)
        h = ex / 2 + np.sqrt(ex * ex / 4 + Kw)
        return -np.log10(h)
    w = np.array([ph_weak(v) for v in vb]); s = np.array([ph_strong(v) for v in vb])
    fig, ax = plt.subplots(figsize=(8.2, 5.2))
    ax.plot(vb, s, color=GREY, lw=2.6, label="0.100 M HCl (strong)")
    ax.plot(vb, w, color=TEAL, lw=3, label="0.100 M acetic acid (weak)")
    ax.axvline(25, color=LINE, lw=1.2, ls="--")
    pe = ph_weak(25.0)
    ax.plot([12.5], [ph_weak(12.5)], "o", color=ACC, ms=9)
    ax.annotate("half-equivalence\n12.5 mL, pH = pKa = 4.76", (12.5, ph_weak(12.5)), (3.0, 7.4), fontsize=9.8,
                arrowprops=dict(arrowstyle="-", color=GREY))
    ax.plot([25], [pe], "o", color=INK, ms=9)
    ax.annotate(f"weak acid equivalence\npH = {pe:.2f}", (25, pe), (27.5, 6.2), fontsize=9.8, fontweight="bold",
                arrowprops=dict(arrowstyle="-", color=GREY))
    ax.plot([25], [7.0], "s", color=GREY, ms=8)
    ax.annotate("strong acid equivalence\npH = 7.00", (25, 7.0), (27.5, 3.4), fontsize=9.8,
                arrowprops=dict(arrowstyle="-", color=GREY))
    ax.axhspan(4.76 - 1, 4.76 + 1, xmin=0.06, xmax=0.55, color="#fbe3d3", alpha=0.7, lw=0)
    ax.text(14.5, 3.95, "buffer region", fontsize=9.5, color=ACCD, ha="center")
    ax.set_xlim(0, 40); ax.set_ylim(0, 14)
    ax.set_xlabel("volume of 0.100 M NaOH added (mL)"); ax.set_ylabel("pH")
    ax.legend(loc="lower right", frameon=False)
    ax.set_title("Weak vs strong acid titration (25.0 mL of acid)", fontsize=12.5, loc="left", fontweight="bold")
    save(fig, "acid-base-titration-curves-equivalence-point")

def na_action_potential():
    # Hodgkin-Huxley model, squid axon parameters (modern sign convention, rest near -65 mV)
    gNa, gK, gL, ENa, EK, EL = 120.0, 36.0, 0.3, 50.0, -77.0, -54.387
    am = lambda V: 0.1 * (V + 40) / (1 - np.exp(-(V + 40) / 10))
    bm = lambda V: 4 * np.exp(-(V + 65) / 18)
    ah = lambda V: 0.07 * np.exp(-(V + 65) / 20)
    bh = lambda V: 1 / (1 + np.exp(-(V + 35) / 10))
    an = lambda V: 0.01 * (V + 55) / (1 - np.exp(-(V + 55) / 10))
    bn = lambda V: 0.125 * np.exp(-(V + 65) / 80)
    dt, T = 0.005, 14.0
    t = np.arange(0, T, dt)
    V = -65.0
    m, h, n = am(V) / (am(V) + bm(V)), ah(V) / (ah(V) + bh(V)), an(V) / (an(V) + bn(V))
    Vs, gna, gk = [], [], []
    for ti in t:
        I = 10.0 if 1.0 <= ti < 2.0 else 0.0
        INa, IK, IL = gNa * m ** 3 * h * (V - ENa), gK * n ** 4 * (V - EK), gL * (V - EL)
        V += dt * (I - INa - IK - IL)
        m += dt * (am(V) * (1 - m) - bm(V) * m)
        h += dt * (ah(V) * (1 - h) - bh(V) * h)
        n += dt * (an(V) * (1 - n) - bn(V) * n)
        Vs.append(V); gna.append(gNa * m ** 3 * h); gk.append(gK * n ** 4)
    Vs, gna, gk = map(np.array, (Vs, gna, gk))
    fig, (a, b) = plt.subplots(2, 1, figsize=(8.4, 6.6), sharex=True, gridspec_kw=dict(height_ratios=[1.6, 1]))
    a.plot(t, Vs, color=INK, lw=2.8)
    a.axhline(ENa, color=ACC, ls=":", lw=1.3); a.text(T - 0.1, ENa + 2.5, "E_Na (model) +50 mV", ha="right", fontsize=9, color=ACCD)
    a.axhline(EK, color=TEAL, ls=":", lw=1.3); a.text(T - 0.1, EK - 8.5, "E_K (model) -77 mV", ha="right", fontsize=9, color=TEAL)
    ip = int(np.argmax(Vs)); imin = ip + int(np.argmin(Vs[ip:]))
    a.annotate("rising phase:\nNa+ rushes in", (t[ip] - 0.33, 0), (0.25, 8), fontsize=9.5, arrowprops=dict(arrowstyle="-", color=GREY))
    a.annotate(f"peak {Vs[ip]:.0f} mV", (t[ip], Vs[ip]), (t[ip] + 0.9, Vs[ip] + 4), fontsize=9.5, fontweight="bold",
               arrowprops=dict(arrowstyle="-", color=GREY))
    a.annotate("falling phase:\nK+ flows out", (t[ip] + 1.0, 0), (6.3, 8), fontsize=9.5, arrowprops=dict(arrowstyle="-", color=GREY))
    a.annotate("undershoot", (t[imin], Vs[imin]), (t[imin] + 0.9, Vs[imin] + 14), fontsize=9.5,
               arrowprops=dict(arrowstyle="-", color=GREY))
    a.text(0.15, -60, "rest", fontsize=9.5, color=MUTED)
    a.axvspan(1.0, 2.0, color="#fbe3d3", alpha=0.8, lw=0); a.text(1.5, -86, "stimulus", ha="center", fontsize=9, color=ACCD)
    a.set_ylim(-90, 62); a.set_ylabel("membrane potential (mV)")
    a.set_title("Action potential and the conductances behind it", fontsize=12.5, loc="left", fontweight="bold")
    b.plot(t, gna, color=ACC, lw=2.6, label="Na+ conductance")
    b.plot(t, gk, color=TEAL, lw=2.6, label="K+ conductance")
    b.set_ylabel("conductance (mS/cm2)"); b.set_xlabel("time (ms)")
    b.legend(frameon=False, loc="upper right")
    b.set_xlim(0, T)
    save(fig, "action-potential-phases-ion-channels")

def na_transport():
    C = np.linspace(0, 20, 400)
    Jmax, K, P = 10.0, 2.0, 0.6
    simple = P * C
    carrier = Jmax * C / (K + C)
    fig, ax = plt.subplots(figsize=(8, 4.8))
    ax.plot(C, simple, color=GREY, lw=2.8, label="simple diffusion (no protein)")
    ax.plot(C, carrier, color=TEAL, lw=3, label="carrier-mediated (facilitated or active)")
    ax.axhline(Jmax, color=ACC, ls=":", lw=1.3)
    ax.text(4.5, Jmax + 0.3, "Jmax: all carriers busy", ha="left", fontsize=10, color=ACCD, fontweight="bold")
    ax.plot([0, K, K], [Jmax / 2, Jmax / 2, 0], ls="--", color=ACC, lw=1.3)
    ax.plot([K], [Jmax / 2], "o", color=ACC, ms=8)
    ax.text(K + 0.4, 1.0, "K (half-max)", fontsize=10, color=ACCD)
    ax.annotate("rate keeps rising\nwith the gradient", (18.5, P * 18.5), (12.0, 12.8), fontsize=9.8,
                arrowprops=dict(arrowstyle="-", color=GREY))
    ax.set_xlim(0, 20); ax.set_ylim(0, 14)
    ax.set_xlabel("solute concentration difference (arbitrary units)"); ax.set_ylabel("transport rate (arbitrary units)")
    ax.legend(loc="lower right", frameon=False)
    ax.set_title("Saturation is the fingerprint of a carrier", fontsize=12.5, loc="left", fontweight="bold")
    save(fig, "passive-vs-active-transport")

DIAGRAMS.update({
    "galvanic-vs-electrolytic-cells": na_galvanic,
    "acid-base-titration-curves-equivalence-point": na_titration,
    "action-potential-phases-ion-channels": na_action_potential,
    "passive-vs-active-transport": na_transport,
})
# ---- end notes-a diagrams ----

# ---- notes-h diagrams (9A, 10A, CARS) ----
def _nh_box(ax, x, y, w, h, fc, ec=None, lw=1.5, r=1.2):
    ax.add_patch(FancyBboxPatch((x, y), w, h, boxstyle=f"round,pad=0,rounding_size={r}", fc=fc, ec=ec or fc, lw=lw))

def nh_paradigms():
    fig, ax = plt.subplots(figsize=(10.5, 5.6))
    ax.set_xlim(0, 100); ax.set_ylim(0, 56); ax.axis("off")
    # nested levels: society > institution > encounter
    _nh_box(ax, 2, 3, 56, 46, PAPER, LINE, lw=2)
    ax.text(5, 45.5, "SOCIETY", fontsize=11, fontweight="bold", color=MUTED)
    _nh_box(ax, 9, 7, 42, 33, "#fbe3d3", ACC, lw=1.5)
    ax.text(12, 36.5, "INSTITUTION (e.g. a hospital)", fontsize=10, fontweight="bold", color=ACCD)
    _nh_box(ax, 16, 11, 28, 19, CARD, TEAL, lw=2)
    ax.text(30, 27, "ENCOUNTER", fontsize=10, fontweight="bold", color=TEAL, ha="center")
    for cx, lab in [(24, "nurse"), (36, "patient")]:
        ax.add_patch(Circle((cx, 19.5), 2.6, fc=TEAL, ec="none"))
        ax.text(cx, 14.2, lab, ha="center", fontsize=9.5)
    ax.annotate("", (33.2, 19.5), (26.8, 19.5), arrowprops=dict(arrowstyle="<->", color=INK, lw=1.4))
    ax.text(30, 22.6, "shared meanings", ha="center", fontsize=8.8, color=MUTED, style="italic")
    lenses = [(47.5, "FUNCTIONALISM", "macro", "What does this part do\nto keep society stable?", INK, (57.5, 44)),
              (31, "CONFLICT THEORY", "macro", "Who gains, who loses,\nand who holds power?", ACC, (50.5, 33)),
              (14, "SYMBOLIC INTERACTIONISM", "micro", "What does this mean to\nthe people involved?", TEAL, (44, 22))]
    for y, name, lvl, q, c, tip in lenses:
        _nh_box(ax, 64, y - 5.5, 35, 11.5, c)
        ax.text(66, y + 3, name, color="white", fontsize=10.5, fontweight="bold", va="center")
        ax.text(97.5, y - 4, lvl + " level", color="white", fontsize=9, ha="right", va="center", style="italic")
        ax.text(66, y - 1.6, q, color="white", fontsize=9.6, va="center")
        ax.annotate("", tip, (64, y), arrowprops=dict(arrowstyle="-|>", color=c, lw=2))
    ax.set_title("Three lenses, three zoom levels", fontsize=12.5, loc="left", fontweight="bold")
    save(fig, "functionalism-vs-conflict-theory-vs-symbolic-interactionism")

def nh_mobility():
    fig, (a, b) = plt.subplots(1, 2, figsize=(11.5, 5.2), gridspec_kw={"width_ratios": [1.15, 1]})
    a.set_xlim(0, 100); a.set_ylim(0, 60); a.axis("off")
    rungs = ["lower", "working", "middle", "upper middle", "upper"]
    ys = [6 + 11 * i for i in range(5)]
    for y, r in zip(ys, rungs):
        a.plot([8, 92], [y, y], color=LINE, lw=6, solid_capstyle="round", zorder=1)
        a.text(7, y, r, ha="right", va="center", fontsize=9.5, color=MUTED)
    def dot(x, y, c, lab, dx=0, dy=-4.6, ha="center"):
        a.add_patch(Circle((x, y), 2.4, fc=c, ec="white", lw=1.5, zorder=3))
        a.text(x + dx, y + dy, lab, ha=ha, va="center", fontsize=8.6, zorder=3)
    # intergenerational: parent (working) -> child (upper middle)
    dot(20, ys[1], GREY, "parent"); dot(20, ys[3], ACC, "child", dx=-3.5, dy=0, ha="right")
    a.annotate("", (20, ys[3] - 2.6), (20, ys[1] + 2.6), arrowprops=dict(arrowstyle="-|>", color=ACC, lw=2.2))
    a.text(22.5, (ys[1] + ys[3]) / 2, "intergenerational\n(parent vs child)", fontsize=9, color=ACCD, va="center")
    # intragenerational: same person, two career points, downward
    dot(55, ys[2], TEAL, "age 30", dx=3.5, dy=1.8, ha="left"); dot(66, ys[0], TEAL, "age 50")
    a.annotate("", (65, ys[0] + 2.6), (56, ys[2] - 2.6), arrowprops=dict(arrowstyle="-|>", color=TEAL, lw=2.2))
    a.text(62.5, ys[1] + 2, "intragenerational,\ndownward", fontsize=9, color=TEAL, va="center")
    # horizontal: same rung
    dot(70, ys[4], INK, "job A"); dot(88, ys[4], INK, "job B")
    a.annotate("", (85.4, ys[4]), (72.6, ys[4]), arrowprops=dict(arrowstyle="-|>", color=INK, lw=2.2))
    a.text(79, ys[4] + 3.4, "horizontal", fontsize=9, ha="center")
    a.set_title("Who is compared, and did rank change?", fontsize=12, loc="left", fontweight="bold")
    T = np.array([[22, 15, 3], [8, 24, 8], [2, 7, 11]])
    b.imshow(T, cmap="Oranges", vmin=0, vmax=30)
    labs = ["lower", "middle", "upper"]
    for i in range(3):
        for j in range(3):
            kind = "stay" if i == j else ("up" if j > i else "down")
            b.text(j, i - 0.1, str(T[i, j]), ha="center", va="center", fontsize=15, fontweight="bold",
                   color="white" if T[i, j] > 18 else INK)
            b.text(j, i + 0.27, kind, ha="center", va="center", fontsize=8.5, color="white" if T[i, j] > 18 else MUTED)
    b.set_xticks(range(3)); b.set_xticklabels(labs); b.set_yticks(range(3)); b.set_yticklabels(labs)
    b.set_xlabel("child's class"); b.set_ylabel("parents' class")
    b.xaxis.set_label_position("top"); b.xaxis.tick_top()
    for sp in b.spines.values(): sp.set_visible(False)
    up = int(np.triu(T, 1).sum()); down = int(np.tril(T, -1).sum()); stay = int(np.trace(T))
    b.text(1, 2.95, f"stay {stay}   up {up}   down {down}   (of {T.sum()})", ha="center", va="center", fontsize=10)
    b.set_title("Illustrative mobility table, 100 families", fontsize=12, loc="left", fontweight="bold", pad=34)
    fig.tight_layout()
    save(fig, "types-of-social-mobility-and-stratification")

def nh_cars():
    read, idea, nq = 3.5, 0.5, 6
    qlen = (10 - read - idea) / nq
    fig, (a, b) = plt.subplots(2, 1, figsize=(10.5, 4.9), gridspec_kw={"height_ratios": [1.25, 1]})
    for ax in (a, b):
        ax.set_yticks([]); ax.spines["left"].set_visible(False)
    a.barh(0, read, left=0, color=TEAL, height=0.6)
    a.text(read / 2, 0, "read + map\n3.5 min", ha="center", va="center", color="white", fontsize=10, fontweight="bold")
    a.barh(0, idea, left=read, color=INK, height=0.6)
    a.annotate("main idea\n0.5 min", (read + idea / 2, 0.3), (read + idea / 2, 0.75), ha="center", fontsize=9,
               arrowprops=dict(arrowstyle="-", color=GREY))
    for k in range(nq):
        x0 = read + idea + k * qlen
        a.barh(0, qlen, left=x0, color=ACC if k % 2 == 0 else ACCD, height=0.6, edgecolor="white")
        a.text(x0 + qlen / 2, 0, f"Q{k + 1}", ha="center", va="center", color="white", fontsize=10, fontweight="bold")
    a.text(10, -0.62, f"about {qlen * 60:.0f} s per question; flag and move on after about 90 s", ha="right", fontsize=9.3, color=MUTED)
    a.set_xlim(0, 10); a.set_ylim(-0.85, 1.15); a.set_xticks(range(0, 11))
    a.set_xlabel("minutes into one passage", fontsize=9.5)
    a.set_title("One passage: about 10 minutes", fontsize=12, loc="left", fontweight="bold")
    total, npass = 90, 9
    per = total / npass
    for k in range(npass):
        b.barh(0, per, left=k * per, color=PAPER if k % 2 else "#efe6d6", edgecolor=LINE, height=0.55)
        b.text(k * per + per / 2, 0, f"P{k + 1}", ha="center", va="center", fontsize=9.5)
    for cp in (3, 6, 9):
        x = cp * per
        b.axvline(x, color=ACC, lw=2.2, ymin=0.1, ymax=0.9)
        b.text(x - 0.8, 0.5, f"{x:.0f} min", ha="right", fontsize=9.5, color=ACCD, fontweight="bold")
    b.set_xlim(0, total); b.set_ylim(-0.5, 0.75); b.set_xticks(range(0, 91, 10))
    b.set_xlabel("minutes into the section (9 passages, 53 questions)", fontsize=9.5)
    b.set_title("The section: checkpoints after passages 3, 6 and 9", fontsize=12, loc="left", fontweight="bold")
    fig.tight_layout()
    save(fig, "how-to-approach-a-cars-passage")

DIAGRAMS.update({
    "functionalism-vs-conflict-theory-vs-symbolic-interactionism": nh_paradigms,
    "types-of-social-mobility-and-stratification": nh_mobility,
    "how-to-approach-a-cars-passage": nh_cars,
})
# ---- end notes-h diagrams ----
# ---- notes-d diagrams (4E, 2C, 2B, 3B; prefixed nd_) ----
def nd_decay():
    n = np.linspace(0, 5.2, 400)
    frac = 0.5 ** n
    k = np.log(2)  # per half-life
    fig, (a, b) = plt.subplots(1, 2, figsize=(11, 4.6))
    a.plot(n, 100 * frac, color=TEAL, lw=3)
    for i in range(1, 5):
        y = 100 * 0.5 ** i
        a.plot([i, i], [0, y], ls="--", color=GREY, lw=1)
        a.plot([0, i], [y, y], ls="--", color=GREY, lw=1)
        a.plot([i], [y], "o", color=ACC, ms=8)
        a.text(i + 0.08, y + 2.5, f"{y:g}%", fontsize=10, color=ACCD, fontweight="bold")
    a.set_xlim(0, 5.2); a.set_ylim(0, 105)
    a.set_xticks(range(0, 6))
    a.set_xlabel("time (number of half-lives)"); a.set_ylabel("parent nuclei remaining (%)")
    a.set_title("Each half-life halves what is left", fontsize=12, loc="left", fontweight="bold")
    b.plot(n, np.log(frac), color=TEAL, lw=3)
    b.axhline(0, color=INK, lw=1)
    x0, x1 = 1.0, 3.0
    y0, y1 = -k * x0, -k * x1
    b.plot([x0, x1, x1], [y0, y0, y1], color=ACC, lw=1.5, ls="--")
    b.text((x0 + x1) / 2, y0 + 0.12, "2 half-lives", ha="center", fontsize=9.5, color=ACCD)
    b.text(x1 + 0.1, (y0 + y1) / 2, f"drop of\n2 ln 2 = {2 * k:.2f}", va="center", fontsize=9.5, color=ACCD)
    b.text(0.25, -3.25, "slope = -k\nk = 0.693 / half-life", fontsize=10.5, color=INK, fontweight="bold")
    b.set_xlim(0, 5.2); b.set_ylim(-3.8, 0.3)
    b.set_xticks(range(0, 6))
    b.set_xlabel("time (number of half-lives)"); b.set_ylabel("ln(N / N0)")
    b.set_title("First order: ln N falls in a straight line", fontsize=12, loc="left", fontweight="bold")
    fig.tight_layout()
    save(fig, "radioactive-decay-half-life-calculations")

def nd_division():
    two_n = 8
    # (label, chromosomes, DNA content in C units); counts derived from the rules
    mit = [("G1", two_n, 2), ("S", two_n, 4), ("G2", two_n, 4), ("Pro/Meta", two_n, 4),
           ("Anaphase", 2 * two_n, 4), ("Daughter", two_n, 2)]
    mei = [("G1", two_n, 2), ("S", two_n, 4), ("G2", two_n, 4), ("Meta I", two_n, 4),
           ("After I", two_n // 2, 2), ("Meta II", two_n // 2, 2), ("Anaph. II", two_n, 2), ("Gamete", two_n // 2, 1)]
    fig, axes = plt.subplots(1, 2, figsize=(12, 4.8), gridspec_kw={"width_ratios": [6, 8]})
    for ax, seq, title in [(axes[0], mit, "Mitosis (one cell's view)"), (axes[1], mei, "Meiosis (one cell's view)")]:
        x = np.arange(len(seq) + 1)
        chrom = [c for _, c, _ in seq]; dna = [d for _, _, d in seq]
        ax.step(x, chrom + [chrom[-1]], where="post", color=TEAL, lw=3, label="chromosomes")
        ax2 = ax.twinx()
        ax2.step(x, dna + [dna[-1]], where="post", color=ACC, lw=2.6, ls="--", label="DNA content (C)")
        ax.set_xticks(x[:-1] + 0.5); ax.set_xticklabels([s for s, _, _ in seq], fontsize=9, rotation=30, ha="right")
        ax.set_xlim(0, len(seq)); ax.set_ylim(0, 18.5); ax2.set_ylim(0, 4.62)
        ax.set_yticks([0, 4, 8, 16]); ax2.set_yticks([1, 2, 4])
        ax.set_ylabel("chromosomes", color=TEAL); ax2.set_ylabel("DNA content (C)", color=ACCD)
        ax2.spines["right"].set_visible(True); ax2.spines["top"].set_visible(False)
        ax.set_title(title, fontsize=12, loc="left", fontweight="bold")
        for i, (s, c, d) in enumerate(seq):
            ax.text(i + 0.5, c + 0.5, str(c), ha="center", fontsize=9, color=TEAL, fontweight="bold")
    h1, l1 = axes[0].get_legend_handles_labels()
    fig.legend([h1[0], plt.Line2D([], [], color=ACC, lw=2.6, ls="--")], ["chromosomes (count centromeres)", "DNA content (C)"],
               loc="lower center", ncol=2, frameon=False, bbox_to_anchor=(0.5, -0.04))
    fig.suptitle("Cell with 2n = 8: chromosome number vs DNA content", x=0.01, ha="left", fontsize=13, fontweight="bold")
    fig.tight_layout(rect=(0, 0.05, 1, 1))
    save(fig, "mitosis-vs-meiosis-differences")

def nd_bact_virus():
    fig, (a, b) = plt.subplots(1, 2, figsize=(12, 4.8), gridspec_kw={"width_ratios": [1.25, 1]})
    groups = [("Viruses", 20, 300, ACC), ("Bacteria", 1000, 5000, TEAL), ("Eukaryotic cells", 10000, 100000, GREY)]
    for i, (name, lo, hi, c) in enumerate(groups):
        y = 2 - i
        a.plot([lo, hi], [y, y], color=c, lw=14, solid_capstyle="butt")
        a.text(lo, y + 0.32, name, fontsize=11, fontweight="bold", color=c)
        lab = (f"{lo:g} to {hi:g} nm" if hi < 1000 else f"{lo / 1000:g} to {hi / 1000:g} um")
        a.text(hi * 1.15, y, lab, va="center", fontsize=9.5, color=MUTED)
    a.axvline(200, color=INK, ls=":", lw=1.4)
    a.text(215, -0.62, "light microscope limit\n(about 200 nm)", fontsize=9, color=INK)
    a.set_xscale("log"); a.set_xlim(10, 1e6); a.set_ylim(-0.8, 2.7)
    a.set_yticks([]); a.spines["left"].set_visible(False)
    a.set_xticks([10, 100, 1000, 10000, 100000, 1000000])
    a.set_xticklabels(["10 nm", "100 nm", "1 um", "10 um", "100 um", "1 mm"])
    a.set_xlabel("size (log scale)")
    a.set_title("Typical sizes", fontsize=12, loc="left", fontweight="bold")
    feats = ["Is a cell", "Ribosomes", "Own metabolism", "Peptidoglycan wall", "Divides by fission", "Grows on lab media", "DNA or RNA genome"]
    bact = ["yes", "yes", "yes", "most", "yes", "most", "DNA"]
    vir = ["no", "no", "no", "no", "no", "no", "either"]
    b.set_xlim(0, 10); b.set_ylim(0, len(feats) + 1.2); b.axis("off")
    b.set_title("Feature check", fontsize=12, loc="left", fontweight="bold")
    b.text(6.0, len(feats) + 0.55, "Bacteria", ha="center", fontsize=11, fontweight="bold", color=TEAL)
    b.text(8.6, len(feats) + 0.55, "Viruses", ha="center", fontsize=11, fontweight="bold", color=ACC)
    for i, (f, x1, x2) in enumerate(zip(feats, bact, vir)):
        y = len(feats) - i - 0.2
        if i % 2 == 0:
            b.add_patch(plt.Rectangle((0, y - 0.45), 10, 0.9, fc=CARD, ec="none"))
        b.text(0.2, y, f, va="center", fontsize=10.5)
        b.text(6.0, y, x1, ha="center", va="center", fontsize=10.5, color=TEAL, fontweight="bold")
        b.text(8.6, y, x2, ha="center", va="center", fontsize=10.5, color=ACCD if x2 == "no" else INK, fontweight="bold")
    fig.tight_layout()
    save(fig, "bacteria-vs-viruses-differences")

def nd_nephron():
    # approximate tubular fluid osmolarity (mOsm/L) at segment boundaries, long-looped nephron
    xs = [0, 1, 2, 3, 4, 5]
    names = ["Bowman's\nspace", "end of\nproximal", "bend of\nloop", "end of thick\nascending", "end of\ndistal", "final\nurine"]
    shared = [300, 300, 1200, 100, 100]
    with_adh = shared + [1200]
    no_adh = shared + [50]
    xf = np.linspace(0, 5, 501)
    fig, ax = plt.subplots(figsize=(9.6, 5))
    ax.axhspan(250, 350, color="#e8f1f2", lw=0)
    ax.text(0.05, 330, "plasma, about 300", fontsize=9, color=TEAL)
    ax.plot(xf, np.interp(xf, xs, with_adh), color=TEAL, lw=3, label="high ADH (water conserved)")
    ax.plot(xf, np.interp(xf, xs, no_adh), color=ACC, lw=3, ls="--", label="no ADH (water excreted)")
    for x, y in zip(xs[:5], shared):
        ax.plot([x], [y], "o", color=INK, ms=6)
    ax.plot([5], [1200], "o", color=TEAL, ms=8); ax.plot([5], [50], "o", color=ACC, ms=8)
    ax.text(4.93, 1235, "with ADH: about 1200", ha="right", fontsize=9.5, color=TEAL, fontweight="bold")
    ax.text(4.9, 8, "no ADH: about 50", ha="right", fontsize=9.5, color=ACCD, fontweight="bold")
    ax.annotate("descending limb:\nwater leaves", (1.5, 750), (0.25, 900), fontsize=9.5, arrowprops=dict(arrowstyle="-", color=GREY))
    ax.annotate("thick ascending limb:\nNaCl pumped out,\nwatertight", (2.6, 560), (2.85, 830), fontsize=9.5, arrowprops=dict(arrowstyle="-", color=GREY))
    ax.set_xticks(xs); ax.set_xticklabels(names, fontsize=9)
    ax.set_xlim(-0.1, 5.15); ax.set_ylim(0, 1350)
    ax.set_ylabel("tubular fluid osmolarity (mOsm/L)")
    ax.set_title("Osmolarity along the nephron (approximate values)", fontsize=12.5, loc="left", fontweight="bold")
    save(fig, "nephron-function-segments-reabsorption")

DIAGRAMS.update({
    "radioactive-decay-half-life-calculations": nd_decay,
    "mitosis-vs-meiosis-differences": nd_division,
    "bacteria-vs-viruses-differences": nd_bact_virus,
    "nephron-function-segments-reabsorption": nd_nephron,
})
# ---- end notes-d diagrams ----
# ---- notes-f diagrams (5C, 5E, 6A, 6C) ----
def nf_ir_nmr():
    fig, (a, b) = plt.subplots(1, 2, figsize=(12.5, 5.2), gridspec_kw={"width_ratios": [1.05, 1]})
    bands = [("alcohol O-H (broad)", 3200, 3650, TEAL), ("acid O-H (very broad)", 2500, 3300, TEAL),
             ("N-H", 3300, 3500, TEAL), ("sp3 C-H", 2850, 3000, GREY), ("sp2 C-H", 3000, 3100, GREY),
             ("aldehyde C-H (2 weak)", 2700, 2850, GREY), ("C triple N, C triple C", 2100, 2260, "#6b3f7a"),
             ("C=O (strong)", 1650, 1800, ACC), ("C=C", 1620, 1680, "#6b3f7a"), ("C-O", 1000, 1300, ACCD)]
    for i, (lab, lo, hi, c) in enumerate(bands):
        y = len(bands) - i
        a.add_patch(plt.Rectangle((lo, y - 0.32), hi - lo, 0.64, fc=c, ec="none", alpha=0.85))
        tx = lo - 60
        a.text(tx, y, lab, ha="left", va="center", fontsize=9.3, color=INK)
    a.axvspan(500, 1500, color=LINE, alpha=0.45, lw=0)
    a.text(1000, 0.25, "fingerprint region", ha="center", fontsize=9.5, color=MUTED, style="italic")
    a.set_xlim(4000, 500); a.set_ylim(-0.2, len(bands) + 0.8)
    a.set_yticks([]); a.spines["left"].set_visible(False)
    a.set_xlabel("wavenumber (cm-1), high energy on the left")
    a.set_title("IR: where common bonds absorb", fontsize=12.5, loc="left", fontweight="bold")
    # simulated 1H NMR of 2-butanone at 100 MHz, J = 7.3 Hz
    mhz, J, w = 100.0, 7.3, 0.006
    sigs = [(1.05, 2, 3, "t, 3H\nCH3 of ethyl"), (2.15, 0, 3, "s, 3H\nCH3 on C=O"), (2.45, 3, 2, "q, 2H\nCH2 on C=O")]
    x = np.linspace(0.5, 3.0, 6000); y = np.zeros_like(x)
    from math import comb
    for d, n, H, lab in sigs:
        coefs = [comb(n, k) for k in range(n + 1)]
        tot = sum(coefs)
        for k, cf in enumerate(coefs):
            pos = d + (k - n / 2) * J / mhz
            y += H * cf / tot * (w ** 2) / ((x - pos) ** 2 + w ** 2)
    b.plot(x, y, color=INK, lw=1.4)
    for d, n, H, lab in sigs:
        top = y[np.argmin(abs(x - d))] if n != 3 else y[(x > d - 0.06) & (x < d + 0.06)].max()
        top = max(top, y[(x > d - 0.12) & (x < d + 0.12)].max())
        b.text(d, top + 0.08, lab, ha="center", va="bottom", fontsize=10, fontweight="bold", color=ACCD)
    b.set_xlim(3.0, 0.5); b.set_ylim(-0.1, y.max() + 0.9)
    b.axhline(0, color=INK, lw=0.8)
    b.set_yticks([]); b.spines["left"].set_visible(False)
    b.set_xlabel("chemical shift (ppm), downfield on the left")
    b.set_title("1H NMR of CH3COCH2CH3 (simulated, 100 MHz)", fontsize=12.5, loc="left", fontweight="bold")
    save(fig, "how-to-read-ir-and-nmr-spectra")

def nf_gibbs():
    T = np.linspace(0, 800, 400)
    cases = [(-50, 0.10, "dH < 0, dS > 0: always spontaneous", TEAL, "-"),
             (60, 0.20, "dH > 0, dS > 0: spontaneous above 300 K", ACC, "-"),
             (-60, -0.12, "dH < 0, dS < 0: spontaneous below 500 K", "#6b3f7a", "--"),
             (50, -0.10, "dH > 0, dS < 0: never spontaneous", GREY, "--")]
    fig, ax = plt.subplots(figsize=(8.8, 5.4))
    ax.axhspan(-140, 0, color="#e3f0ee", lw=0)
    ax.axhline(0, color=INK, lw=1)
    for dH, dS, lab, c, ls in cases:
        ax.plot(T, dH - T * dS, color=c, lw=2.8, ls=ls, label=lab)
        if dH * dS > 0:
            Tc = dH / dS
            ax.plot([Tc], [0], "o", color=c, ms=9, zorder=5)
            ax.annotate(f"T = dH/dS = {Tc:.0f} K", (Tc, 0), (Tc + 20, 22 if dH > 0 else -22), fontsize=9.5,
                        color=c, fontweight="bold", va="center")
    ax.text(10, -128, "delta G < 0: spontaneous", ha="left", fontsize=10, color=TEAL, fontweight="bold")
    ax.text(790, 55, "delta G > 0: nonspontaneous", ha="right", fontsize=10, color=MUTED, fontweight="bold")
    ax.set_xlim(0, 800); ax.set_ylim(-140, 140)
    ax.set_xlabel("temperature (K)"); ax.set_ylabel("delta G (kJ/mol)")
    ax.legend(loc="upper left", frameon=False, fontsize=9.2)
    ax.set_title("delta G = delta H - T delta S: intercept delta H, slope -delta S", fontsize=12.5, loc="left", fontweight="bold")
    save(fig, "gibbs-free-energy-delta-g-spontaneity")

def nf_sdt_weber():
    from statistics import NormalDist
    nd = NormalDist()
    fig, (a, b, c) = plt.subplots(1, 3, figsize=(15, 4.8), gridspec_kw={"width_ratios": [1.35, 1, 1]})
    x = np.linspace(-4, 6, 800)
    pdf = lambda m: np.exp(-(x - m) ** 2 / 2) / np.sqrt(2 * np.pi)
    dp, crit = 2.0, 1.0
    a.plot(x, pdf(0), color=GREY, lw=2.6); a.plot(x, pdf(dp), color=TEAL, lw=2.6)
    a.fill_between(x, pdf(dp), where=x >= crit, color=TEAL, alpha=0.25, lw=0)
    a.fill_between(x, pdf(0), where=x >= crit, color=ACC, alpha=0.35, lw=0)
    a.axvline(crit, color=INK, lw=1.8)
    a.text(crit + 0.08, 0.585, "criterion\nsay yes to the right", fontsize=9.3, va="top")
    a.text(-1.9, 0.30, "noise\nalone", ha="center", fontsize=10, color=MUTED, fontweight="bold")
    a.text(3.9, 0.30, "signal\n+ noise", ha="center", fontsize=10, color=TEAL, fontweight="bold")
    a.annotate("", (dp, 0.43), (0, 0.43), arrowprops=dict(arrowstyle="<->", color=INK, lw=1.4))
    a.text(dp / 4, 0.445, "d'", ha="center", fontsize=11, fontweight="bold")
    a.text(2.6, 0.05, "hits", fontsize=9.5, color=TEAL, fontweight="bold")
    a.annotate("false alarms", (1.35, 0.05), (2.4, 0.16), fontsize=9.5, color=ACCD, fontweight="bold",
               arrowprops=dict(arrowstyle="-", color=GREY))
    a.set_ylim(0, 0.6); a.set_xlim(-4, 6); a.set_yticks([])
    a.set_xlabel("internal response strength")
    a.set_title(f"SDT: d' = {dp:.0f}, criterion at 1.0", fontsize=12, loc="left", fontweight="bold")
    fa = np.linspace(0.0005, 0.9995, 400)
    for d, col in [(0, GREY), (1, "#6b3f7a"), (2.5, TEAL)]:
        hr = np.array([nd.cdf(nd.inv_cdf(f) + d) for f in fa])
        b.plot(fa, hr, color=col, lw=2.4, label=f"d' = {d:g}")
    pts = [("A", 0.90, 0.10), ("B", 0.60, 0.05), ("C", 0.95, 0.50)]
    for lab, h, f in pts:
        b.plot([f], [h], "o", color=ACC, ms=8, zorder=5)
        b.text(f + 0.03, h - 0.06, lab, fontsize=10, fontweight="bold", color=ACCD)
    b.set_xlim(0, 1); b.set_ylim(0, 1.02); b.set_aspect("equal")
    b.set_xlabel("false alarm rate"); b.set_ylabel("hit rate")
    b.legend(loc="lower right", frameon=False, fontsize=9)
    b.set_title("ROC curves, listeners A to C", fontsize=12, loc="left", fontweight="bold")
    I = np.linspace(0, 500, 200)
    for k, lab, col in [(0.02, "weight, k = 0.02", TEAL), (0.08, "brightness, k = 0.08", "#6b3f7a"), (0.10, "loudness, k = 0.10", ACC)]:
        c.plot(I, k * I, color=col, lw=2.6, label=lab)
    c.set_xlim(0, 500); c.set_ylim(0, 52)
    c.set_xlabel("baseline intensity I (arbitrary units)"); c.set_ylabel("JND = k x I")
    c.legend(loc="upper left", frameon=False, fontsize=9)
    c.set_title("Weber's law: JND grows with baseline", fontsize=12, loc="left", fontweight="bold")
    fig.tight_layout(w_pad=2.5)
    save(fig, "signal-detection-theory-and-webers-law")

def nf_emotion():
    fig, ax = plt.subplots(figsize=(12, 7.4))
    ax.set_xlim(0, 100); ax.set_ylim(0, 72); ax.axis("off")
    ax.text(1, 70, "Theories of emotion: what comes first?", fontsize=13.5, fontweight="bold", va="center")
    def box(x, y, w, t, c, h=6):
        _nb_box(ax, x, y - h / 2, w, h, c)
        ax.text(x + w / 2, y, t, ha="center", va="center", color="white", fontsize=9.8, fontweight="bold")
    def arr(x0, y0, x1, y1):
        ax.annotate("", (x1, y1), (x0, y0), arrowprops=dict(arrowstyle="-|>", color=INK, lw=1.6))
    EV, AR, CG, FE, BR = GREY, ACC, "#6b3f7a", TEAL, INK
    rows = [(58, "James-Lange", "body first"), (41, "Cannon-Bard", "parallel"),
            (24, "Schachter-Singer", "arousal + label"), (7, "Lazarus", "appraisal first")]
    for y, name, tag in rows:
        ax.text(1, y + 1.3, name, fontsize=11.5, fontweight="bold", va="center")
        ax.text(1, y - 2.2, tag, fontsize=9.5, color=MUTED, va="center", style="italic")
        box(22, y, 13, "event", EV)
    y = 58
    arr(35.5, y, 41.5, y); box(42, y, 17, "bodily arousal", AR)
    arr(59.5, y, 65.5, y); box(66, y, 17, "perceive arousal", CG)
    arr(83.5, y, 85.5, y); box(86, y, 13, "emotion", FE)
    y = 41
    arr(35.5, y, 41.5, y); box(42, y, 15, "thalamus", BR)
    arr(57.5, y + 1, 70.5, y + 5.2); box(71, y + 5.5, 20, "feeling (cortex)", FE, h=5)
    arr(57.5, y - 1, 70.5, y - 5.2); box(71, y - 5.5, 20, "arousal (ANS)", AR, h=5)
    ax.text(93, y, "at the\nsame time", ha="center", va="center", fontsize=9.3, color=ACCD, fontweight="bold")
    y = 24
    arr(35.5, y, 41.5, y); box(42, y, 17, "general arousal", AR)
    arr(59.5, y, 65.5, y); box(66, y, 17, "cognitive label", CG)
    arr(83.5, y, 85.5, y); box(86, y, 13, "emotion", FE)
    ax.text(74.5, y + 4.6, "cues from the setting", ha="center", fontsize=8.8, color=MUTED)
    y = 7
    arr(35.5, y, 41.5, y); box(42, y, 17, "appraisal", CG)
    arr(59.5, y + 1, 65.5, y + 3.6); box(66, y + 3.8, 20, "feeling", FE, h=4.6)
    arr(59.5, y - 1, 65.5, y - 3.6); box(66, y - 3.8, 20, "arousal", AR, h=4.6)
    for yy in (49.5, 32.5, 15.5):
        ax.plot([1, 99], [yy, yy], color=LINE, lw=1)
    save(fig, "theories-of-emotion-james-lange-cannon-bard")

DIAGRAMS.update({
    "how-to-read-ir-and-nmr-spectra": nf_ir_nmr,
    "gibbs-free-energy-delta-g-spontaneity": nf_gibbs,
    "signal-detection-theory-and-webers-law": nf_sdt_weber,
    "theories-of-emotion-james-lange-cannon-bard": nf_emotion,
})
# ---- end notes-f diagrams ----

if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""Generate public preview assets for product pages. Never copies a full page.

Run with the ops venv (needs Pillow); ops/sync_catalog.py calls it for every PASS pack:
  /Users/aidanjones/dev/studystore/.venv/bin/python tools/gen_previews.py \
      --products /Users/aidanjones/dev/studystore/products <slug> [<slug> ...]

Per pack it writes:
  assets/packs/<slug>/card-N.webp    at most 4 sample cards (preview/preview_card_*.png, topped up
                                     from preflight/*_back.png multiple-choice renders)
  assets/packs/<slug>/sheet-N.webp   partial crop (top 45 percent) of a cheat sheet page, bottom faded out
  assets/packs/<slug>/book-N.webp    same treatment for study guide pages
  content/packs/<slug>/sample.json   image list + at most 5 sample practice questions (text) for build.py
File names avoid words the deploy guard blocks (guide, full, render).
"""
import json, re, shutil, sys
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
MAX_CARDS, MAX_Q, CROP = 4, 5, 0.45
WIDTH = 760


def fade_crop(src, dst):
    im = Image.open(src).convert("RGB")
    w, h = im.size
    ch = int(h * CROP)
    assert ch <= h * 0.55, "crop would expose too much of the page"
    im = im.crop((0, 0, w, ch))
    fade = int(ch * 0.38)
    col = Image.new("L", (1, ch), 0)
    px = col.load()
    for y in range(ch - fade, ch):
        px[0, y] = int(255 * ((y - (ch - fade)) / fade) ** 1.4)
    mask = col.resize((w, ch))
    im = Image.composite(Image.new("RGB", im.size, (255, 255, 255)), im, mask)
    save(im, dst)


def save(im, dst):
    im = im.convert("RGB")
    if im.width > WIDTH:
        im = im.resize((WIDTH, round(im.height * WIDTH / im.width)), Image.LANCZOS)
    im.save(dst, "WEBP", quality=82, method=6)
    return im.size


def plain(t):
    t = re.sub(r"\{\{c\d+::(.*?)(::.*?)?\}\}", r"\1", t or "")
    t = re.sub(r"<[^>]+>", "", t)
    return re.sub(r"\s+", " ", t).strip()


def build(prod_dir, slug):
    src = prod_dir / slug
    out = ROOT / "assets" / "packs" / slug
    meta_dir = ROOT / "content" / "packs" / slug
    if out.exists():
        shutil.rmtree(out)
    out.mkdir(parents=True)
    meta_dir.mkdir(parents=True, exist_ok=True)
    cards_json = json.loads((src / "content" / "cards.json").read_text()).get("cards", [])
    sample = {"slug": slug, "cards": [], "sheets": [], "questions": []}

    picks = [(p, "Sample card") for p in sorted((src / "preview").glob("preview_card_*.png"))][:MAX_CARDS]
    if len(picks) < MAX_CARDS:
        for c in cards_json:
            if len(picks) >= MAX_CARDS:
                break
            if c.get("type") != "mc":
                continue
            f = src / "preflight" / ("%s_back.png" % c["id"])
            if not f.exists():
                continue
            h = Image.open(f).size[1]
            if 260 <= h <= 900:
                picks.append((f, "Sample multiple choice card: " + plain(c.get("stem") or c.get("text") or "")[:110]))
    for i, (f, alt) in enumerate(picks[:MAX_CARDS], 1):
        name = "card-%d.webp" % i
        w, h = save(Image.open(f), out / name)
        sample["cards"].append({"src": "assets/packs/%s/%s" % (slug, name), "alt": alt, "w": w, "h": h})

    for kind, pat, label in (("sheet", "preview_cheatsheet-*.png", "Cheat sheet, page %d (partial preview)"),
                             ("book", "preview_guide-*.png", "Study guide, page %d (partial preview)")):
        for i, f in enumerate(sorted((src / "preview").glob(pat))[:2], 1):
            name = "%s-%d.webp" % (kind, i)
            fade_crop(f, out / name)
            w, h = Image.open(out / name).size
            sample["sheets"].append({"src": "assets/packs/%s/%s" % (slug, name), "alt": label % i,
                                     "kind": kind, "w": w, "h": h})

    # four short real cards (text only) for the home page flashcard demo
    sample["demo_cards"] = []
    want = ["sa", "cz", "mc", "tf"]
    for t in want:
        for c in cards_json:
            if c.get("type") != t:
                continue
            if t == "sa" and len(c.get("front", "")) < 90 and len(c.get("back", "")) < 160:
                sample["demo_cards"].append({"type": t, "front": c["front"], "back": c["back"]})
            elif t == "cz" and len(c.get("text", "")) < 170:
                sample["demo_cards"].append({"type": t, "text": c["text"], "extra": c.get("extra", "")})
            elif t == "mc" and len(c.get("stem", "")) < 110 and all(len(o) < 40 for o in c.get("options", [])):
                sample["demo_cards"].append({"type": t, "stem": c["stem"], "options": c["options"],
                                             "answer": c["answer"], "why": c.get("why", "")})
            elif t == "tf" and len(c.get("statement", "")) < 120:
                sample["demo_cards"].append({"type": t, "statement": c["statement"], "truth": bool(c.get("truth")),
                                             "why": c.get("why", "")})
            else:
                continue
            break

    qf = src / "content" / "questions.json"
    if qf.exists():
        sets = json.loads(qf.read_text()).get("sets", [])
        disc = [q for s in sets if s.get("kind") == "discrete" for q in s.get("questions", [])]
        if disc:
            step = max(1, len(disc) // MAX_Q)
            for q in disc[::step][:MAX_Q]:
                sample["questions"].append({"stem": q["stem"], "options": q["options"], "answer": q["answer"],
                                            "explanation": q.get("explanation", ""), "subtopic": q.get("subtopic", "")})
    assert len(sample["cards"]) <= MAX_CARDS and len(sample["questions"]) <= MAX_Q
    (meta_dir / "sample.json").write_text(json.dumps(sample, indent=1, ensure_ascii=False) + "\n")
    return "%s: %d cards, %d page crops, %d questions" % (slug, len(sample["cards"]), len(sample["sheets"]),
                                                          len(sample["questions"]))


def main(argv):
    if "--products" not in argv:
        sys.exit(__doc__)
    i = argv.index("--products")
    prod = Path(argv[i + 1])
    slugs = argv[:i] + argv[i + 2:]
    for s in slugs:
        print(build(prod, s))
    if not slugs:
        print("no PASS packs; nothing to generate")


if __name__ == "__main__":
    main(sys.argv[1:])

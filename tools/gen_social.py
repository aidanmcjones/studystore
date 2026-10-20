#!/usr/bin/env python3
"""Render short-form social media from the site's own free content (nothing paid, nothing copied).

Outputs (all under media/, deployed with noindex, kept out of the sitemap):
  media/q/<qid>.mp4 + .jpg      question-of-the-day videos, 1080x1920, about 17 s, silent AAC track
  media/d/<slug>.mp4 + .jpg     diagram explainers (slow pan and zoom over a note diagram), 17 to 22 s
  media/pins/<id>.png + .webp   Pinterest pins, 1000x1500 (note-<slug> and q-<qid>)
  media/manifest.json           what has been rendered, plus outbox id counters

Sources: content/packs/<slug>/sample.json (the same verified sample questions the home quiz uses, filtered
by products_build.CONTEXT_RE), assets/notes/<slug>.png and content/notes/<slug>.md (caption beats come from the
note's own "One-minute recap"), and the Bench Notes colors in assets/style.css.

Usage (CPU heavy, run under the build lock):
  lockf -k ops/state/build.lock .venv/bin/python tools/gen_social.py --q 40 --d 30 --pins-notes 25 --pins-q 15 --ops <private repo>
  lockf -k ... tools/gen_social.py --next 3 --ops <private repo>       # daily: N new unseen items + their outbox file
  tools/gen_social.py --sample /tmp/x                                  # 2 question videos, 1 diagram, 2 pins, plus frames
  tools/gen_social.py --outbox-all --ops <private repo>                # rewrite outbox items for everything in the manifest
Outbox items go to <ops>/growth/outbox/media-<YYYY-MM-DD>.json (merged by id if the file exists).
"""
import argparse
import datetime
import html
import json
import math
import os
import re
import subprocess
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
FFMPEG = os.environ.get("FFMPEG", "/opt/homebrew/bin/ffmpeg")
BASE = "https://www.studystore.co"
W, H, FPS = 1080, 1920, 30
# TikTok safe zone: keep 150 px clear at the top, 350 px at the bottom and 150 px on the right.
SX0, SY0, SX1, SY1 = 72, 176, W - 150 - 10, H - 350 - 24
MAX_BYTES = 2_500_000

# Bench Notes dark theme (assets/style.css)
BG = (10, 15, 13); SURF = (17, 24, 21); SURF2 = (22, 32, 28); INK = (232, 238, 233); MUTED = (154, 168, 161)
LINE = (36, 48, 43); LINE2 = (52, 67, 60); ACID = (255, 210, 63); GREEN = (61, 220, 132); BLUE = (106, 162, 255)
# light theme (pins)
L_BG = (243, 245, 240); L_INK = (13, 21, 18); L_MUTED = (76, 88, 83); L_LINE = (213, 219, 212); L_ACID = (242, 183, 5)
L_GREEN = (19, 128, 74)

AVENIR = "/System/Library/Fonts/Avenir Next.ttc"
MENLO = "/System/Library/Fonts/Menlo.ttc"
_fonts = {}


def font(kind, size):
    key = (kind, size)
    if key not in _fonts:
        path, idx = {"bold": (AVENIR, 0), "heavy": (AVENIR, 8), "demi": (AVENIR, 2), "med": (AVENIR, 5),
                     "reg": (AVENIR, 7), "mono": (MENLO, 1)}[kind]
        _fonts[key] = ImageFont.truetype(path, size, index=idx)
    return _fonts[key]


_cmap = None


def glyphs_ok(text):
    global _cmap
    if _cmap is None:
        from fontTools.ttLib import TTCollection
        _cmap = set(TTCollection(AVENIR).fonts[0].getBestCmap())
    return all(ord(c) in _cmap or c in "\n" for c in text)


_measure = ImageDraw.Draw(Image.new("RGB", (8, 8)))


def tlen(text, f):
    return _measure.textlength(text, font=f)


def wrap(text, f, maxw):
    lines = []
    for para in text.split("\n"):
        cur = ""
        for w in para.split():
            t = (cur + " " + w).strip()
            if tlen(t, f) <= maxw:
                cur = t
            else:
                if cur:
                    lines.append(cur)
                if tlen(w, f) > maxw:
                    parts = re.findall(r"[^-/]+[-/]?", w)  # long URL or slug: break after - or /
                    if any(tlen(x, f) > maxw for x in parts):
                        return None  # a single word wider than the box: unreadable, caller skips
                    cur = ""
                    for x in parts:
                        if tlen(cur + x, f) <= maxw:
                            cur += x
                        else:
                            lines.append(cur)
                            cur = x
                    continue
                cur = w
        lines.append(cur)
    return lines


def fit(text, kind, sizes, maxw, maxlines):
    for s in sizes:
        f = font(kind, s)
        ls = wrap(text, f, maxw)
        if ls is not None and len(ls) <= maxlines:
            return f, ls
    return None, None


def draw_lines(d, xy, lines, f, fill, lh=1.22):
    x, y = xy
    step = int(f.size * lh)
    for ln in lines:
        d.text((x, y), ln, font=f, fill=fill)
        y += step
    return y


def grid_bg(w, h, bg, grid, step=24, major=120):
    im = Image.new("RGB", (w, h), bg)
    d = ImageDraw.Draw(im)
    gmin = tuple(int(b + (g - b) * 0.45) for b, g in zip(bg, grid))
    for x in range(0, w, step):
        d.line([(x, 0), (x, h)], fill=grid if x % major == 0 else gmin)
    for y in range(0, h, step):
        d.line([(0, y), (w, y)], fill=grid if y % major == 0 else gmin)
    return im


_bg_cache = {}


def video_bg():
    if "v" not in _bg_cache:
        _bg_cache["v"] = grid_bg(W, H, BG, (20, 28, 25))
    return _bg_cache["v"].copy()


def pill(d, x, y, text, f, fg, bg, pad=(18, 10)):
    tw = tlen(text, f)
    d.rounded_rectangle([x, y, x + tw + 2 * pad[0], y + f.size + 2 * pad[1]], radius=8, fill=bg)
    d.text((x + pad[0], y + pad[1] - 2), text, font=f, fill=fg)
    return x + tw + 2 * pad[0]


def wordmark(d, x, y, size, fg, accent):
    f = font("heavy", size)
    d.text((x, y), "Study", font=f, fill=fg)
    d.text((x + tlen("Study", f), y), "Store", font=f, fill=accent)


# ---------------------------------------------------------------- data

CLEAN_MAP = {"→": " to ", "⇌": " <-> ", "−": "-", "\u2013": "-", "\u2014": "-"}


def clean_text(s):
    s = re.sub(r"<sup>2</sup>", "²", s)
    s = re.sub(r"<sup>3</sup>", "³", s)
    s = re.sub(r"<sup>([^<]*)</sup>", r"^\1", s)
    s = re.sub(r"<[^>]+>", "", s)
    s = html.unescape(s)
    s = re.sub(r"\*\*(.*?)\*\*", r"\1", s)
    s = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", s)
    s = s.replace("`", "")
    for a, b in CLEAN_MAP.items():
        s = s.replace(a, b)
    s = re.sub(r"[₀-₉]", lambda m: str(ord(m.group(0)) - 0x2080), s)
    return re.sub(r"[ \t]+", " ", s).strip()


def sentences(t):
    return [x.strip() for x in re.split(r"(?<=[.!?])\s+(?=[A-Z0-9(])", t) if x.strip()]


def load_site():
    return json.loads((ROOT / "site.json").read_text())


def section_tag(p):
    a = p["aamc"].upper()
    if a == "CARS":
        return "#mcatcars"
    n = int(re.match(r"\d+", a).group(0))
    return {1: "#biochemistry", 2: "#biology", 3: "#physiology", 4: "#physics", 5: "#chemistry", 6: "#psychology",
            7: "#psychology", 8: "#psychology", 9: "#sociology", 10: "#sociology"}.get(n, "#mcatstudy")


def practice_pages():
    from practice_build import parse_frontmatter
    out = []
    for f in sorted((ROOT / "content" / "practice").glob("*.md")):
        meta, _ = parse_frontmatter(f.read_text())
        out.append(dict(slug=f.stem, aamc=meta.get("aamc", ""), title=meta.get("title", ""),
                        cluster=meta.get("cluster", ""), notes=[x.strip() for x in meta.get("notes", "").split(",") if x.strip()]))
    return out


STOP = set("the a an of and or to in on for with is are be by at from as that this which what how does do it its into than "
           "most best each would one two mcat".split())


def words(t):
    return {w for w in re.findall(r"[a-z0-9]+", t.lower()) if w not in STOP and len(w) > 2}


def best_practice(aamc, text, pages):
    cand = [p for p in pages if p["aamc"].upper() == aamc.upper()]
    tw = words(text)
    scored = sorted(((len(tw & words(p["title"] + " " + p["cluster"])), p["slug"]) for p in cand), reverse=True)
    if scored and scored[0][0] >= 2:
        return f"practice/{scored[0][1]}.html"
    return f"practice/{aamc.lower()}/index.html" if (ROOT / "practice" / aamc.lower() / "index.html").exists() else "practice/index.html"


def question_bank(site, pages):
    """Same filter as products_build.home_quiz: standalone sample questions only. Adds fit/score info."""
    from products_build import CONTEXT_RE, available, sample
    bank = []
    for p in available(site):
        for k, q in enumerate(((sample(p["slug"]) or {}).get("questions") or [])):
            if CONTEXT_RE.search(q["stem"]):
                continue
            expl = [x for x in sentences(q["explanation"])
                    if not re.match(r"^(\(?[A-D]\)?|Choice [A-D]|Answer [A-D])\b.{0,20}correct", x) and len(x) >= 25]
            first = expl[0] if expl else q["explanation"]
            allt = " ".join([q["stem"], first] + q["options"])
            if not glyphs_ok(allt) or len(q["options"]) != 4:
                continue
            bank.append(dict(id=f'{p["slug"]}-{k}', pack=p, q=q, expl=first,
                             score=len(q["stem"]) + sum(len(o) for o in q["options"]) + len(first),
                             practice=best_practice(p["aamc"], q["stem"] + " " + q.get("subtopic", ""), pages)))
    return bank


def order_questions(bank):
    """Round-robin across sections, then packs, shortest (most standalone) first."""
    by_pack = {}
    for b in sorted(bank, key=lambda b: b["score"]):
        by_pack.setdefault(b["pack"]["slug"], []).append(b)
    secs = {}
    for slug, items in by_pack.items():
        secs.setdefault(items[0]["pack"]["section_name"], []).append(items)
    for s in secs.values():
        s.sort(key=lambda items: items[0]["score"])
    out = []
    while any(any(x for x in packs) for packs in secs.values()):
        for sec in sorted(secs):
            packs = secs[sec]
            for _ in range(len(packs)):
                items = packs.pop(0)
                packs.append(items)
                if items:
                    out.append(items.pop(0))
                    break
    return out


def notes_with_diagrams():
    from practice_build import parse_frontmatter
    out = []
    for f in sorted((ROOT / "content" / "notes").glob("*.md")):
        img = ROOT / "assets" / "notes" / f"{f.stem}.png"
        if not img.exists():
            continue
        meta, body = parse_frontmatter(f.read_text())
        out.append(dict(slug=f.stem, title=clean_text(meta["title"]), desc=clean_text(meta.get("description", "")),
                        product=meta.get("product", ""), body=body, img=img))
    return out


def caption_beats(note, n=4, maxlen=150):
    beats = _beats(note, maxlen, recap=True)
    if len(beats) < 3:
        beats += [b for b in _beats(note, maxlen, recap=False) if b not in beats]
    return beats[:n]


def _beats(note, maxlen, recap):
    body = note["body"]
    m = re.search(r"^## One-minute recap\s*\n(.*?)(?=^## |^:::|\Z)", body, re.S | re.M) if recap else None
    chunks = []
    if m:
        for para in m.group(1).strip().split("\n"):
            para = clean_text(re.sub(r"^\s*[-*]\s+", "", para))
            if para:
                chunks.append(para)
    else:  # fall back to the first sentence of each section
        for sec in re.split(r"^## ", body, flags=re.M)[1:]:
            title, _, txt = sec.partition("\n")
            if re.search(r"trap|quiz|practice|example|faq", title, re.I):
                continue
            for para in txt.strip().split("\n\n"):
                para = clean_text(re.sub(r"^\s*[-*]\s+", "", para.strip()))
                if para and not para.startswith(("|", ":::", "<", "!")):
                    chunks.append(sentences(para)[0])
                    break
    beats = []
    for c in chunks:
        cur = ""
        parts = []
        for s in sentences(c):
            parts += [x.strip() + ("" if x.strip().endswith(".") else ".") for x in s.split("; ")] if len(s) > maxlen else [s]
        for s in parts:
            if len(s) > maxlen:
                continue
            if cur and len(cur) + 1 + len(s) > maxlen:
                beats.append(cur)
                cur = s
            else:
                cur = (cur + " " + s).strip()
        if cur:
            beats.append(cur)
    return [b for b in beats if glyphs_ok(b) and len(b) >= 25]


# ---------------------------------------------------------------- encoding

def encoder(path, maxrate):
    path.parent.mkdir(parents=True, exist_ok=True)
    cmd = [FFMPEG, "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS),
           "-i", "-", "-f", "lavfi", "-i", "anullsrc=r=44100:cl=mono", "-shortest", "-map", "0:v", "-map", "1:a",
           "-c:v", "libx264", "-preset", "medium", "-crf", "24", "-maxrate", maxrate, "-bufsize", "2M",
           "-pix_fmt", "yuv420p", "-profile:v", "high", "-c:a", "aac", "-b:a", "24k", "-movflags", "+faststart",
           "-threads", "2", str(path)]
    return subprocess.Popen(cmd, stdin=subprocess.PIPE)


def ease(t):
    t = max(0.0, min(1.0, t))
    return t * t * (3 - 2 * t)


def write_frames(path, frame_fn, seconds, poster_t, maxrate="1000k"):
    """frame_fn(t) -> PIL RGB image. Writes mp4 and a JPG poster at poster_t. Retries at a lower rate if too big."""
    n = int(round(seconds * FPS))
    for rate in (maxrate, "700k", "500k"):
        p = encoder(path, rate)
        last_key, last_bytes = None, None
        for i in range(n):
            t = i / FPS
            img, key = frame_fn(t)
            if key is None or key != last_key:
                last_bytes = img.tobytes()
                last_key = key
            p.stdin.write(last_bytes)
        p.stdin.close()
        if p.wait() != 0:
            raise SystemExit(f"ffmpeg failed for {path}")
        if path.stat().st_size <= MAX_BYTES:
            break
    img, _ = frame_fn(poster_t)
    img.save(path.with_suffix(".jpg"), quality=82, optimize=True, progressive=True)
    return path.stat().st_size


# ---------------------------------------------------------------- question video

def q_layout(b):
    """Static layers for a question video, or None if it does not fit at a readable size."""
    q, p = b["q"], b["pack"]
    tw = SX1 - SX0
    sf, sl = fit(q["stem"], "demi", (66, 62, 58, 54, 50, 46), tw, 7)
    if not sf:
        return None
    opt_pad, badge = 26, 64
    of = None
    for size in (46, 43, 40, 37):
        f = font("med", size)
        ols = [wrap(o, f, tw - badge - 3 * opt_pad) for o in q["options"]]
        if all(x is not None and len(x) <= 3 for x in ols):
            of = f
            break
    if not of:
        return None
    ef, el = fit(f'{q["answer"]}. ' + b["expl"], "med", (40, 37, 34), tw - 48, 3)
    if not ef:
        return None
    # vertical plan
    y_head = SY0
    y_stem = y_head + 112
    y = y_stem + len(sl) * int(sf.size * 1.22) + 34
    boxes = []
    for o_lines in ols:
        hgt = max(badge, len(o_lines) * int(of.size * 1.22)) + 2 * 22
        boxes.append((y, y + hgt, o_lines))
        y += hgt + 18
    y_bar = y + 18
    y_exp = y_bar + 70
    exp_h = len(el) * int(ef.size * 1.25) + 44
    if y_exp + exp_h > SY1:
        return None
    # center the block (stem to explanation) in the space under the header
    shift = max(0, (SY1 - (y_exp + exp_h)) // 2 - 10)
    y_stem += shift
    boxes = [(a + shift, b + shift, c) for a, b, c in boxes]
    y_bar += shift
    y_exp += shift
    return dict(sf=sf, sl=sl, of=of, boxes=boxes, ef=ef, el=el, y_head=y_head, y_stem=y_stem, y_bar=y_bar,
                y_exp=y_exp, exp_h=exp_h, badge=badge, opt_pad=opt_pad)


def q_header(d, b, y):
    p = b["pack"]
    x = pill(d, SX0, y, "MCAT QUESTION", font("mono", 30), BG, ACID)
    d.text((x + 22, y + 8), p["section_name"], font=font("demi", 36), fill=MUTED)


def q_screen(b, L, reveal):
    q = b["q"]
    im = video_bg()
    d = ImageDraw.Draw(im, "RGBA")
    q_header(d, b, L["y_head"])
    draw_lines(d, (SX0, L["y_stem"]), L["sl"], L["sf"], INK)
    for j, (y0, y1, ols) in enumerate(L["boxes"]):
        letter = chr(65 + j)
        right = letter == q["answer"]
        dim = reveal and not right
        fill = (GREEN[0], GREEN[1], GREEN[2], 40) if (reveal and right) else SURF + (255,)
        edge = GREEN if (reveal and right) else LINE2
        d.rounded_rectangle([SX0, y0, SX1, y1], radius=14, fill=fill, outline=edge, width=4 if (reveal and right) else 2)
        bx, by = SX0 + L["opt_pad"], y0 + (y1 - y0 - L["badge"]) // 2
        d.rounded_rectangle([bx, by, bx + L["badge"], by + L["badge"]], radius=10,
                            fill=GREEN if (reveal and right) else SURF2)
        lf = font("mono", 36)
        d.text((bx + (L["badge"] - tlen(letter, lf)) / 2, by + 10), letter, font=lf,
               fill=BG if (reveal and right) else (MUTED if dim else ACID))
        th = len(ols) * int(L["of"].size * 1.22)
        draw_lines(d, (bx + L["badge"] + L["opt_pad"], y0 + (y1 - y0 - th) // 2 - 2), ols, L["of"],
                   (95, 108, 101) if dim else INK)
    if reveal:
        y = L["y_exp"]
        d.rounded_rectangle([SX0, y - 6, SX1, y + L["exp_h"]], radius=14, fill=SURF2 + (255,))
        d.rectangle([SX0, y - 6, SX0 + 8, y + L["exp_h"]], fill=GREEN)
        draw_lines(d, (SX0 + 32, y + 16), L["el"], L["ef"], INK, lh=1.25)
        d.text((SX0, L["y_bar"] - 6), "ANSWER", font=font("mono", 30), fill=GREEN)
    return im


def q_hook(b):
    im = video_bg()
    d = ImageDraw.Draw(im)
    p = b["pack"]
    y = 560
    pill(d, SX0, y, p["section_name"].upper(), font("mono", 34), BG, ACID)
    y += 110
    f = font("heavy", 104)
    y = draw_lines(d, (SX0, y), ["MCAT question."], f, INK, lh=1.1)
    f2 = font("heavy", 84)
    y = draw_lines(d, (SX0, y + 20), ["Can you get it in"], f2, MUTED, lh=1.1)
    d.text((SX0, y), "10 seconds?", font=f2, fill=ACID)
    tf_, tl_ = fit(f'Topic: {p["title"]}', "demi", (40, 36), SX1 - SX0, 2)
    draw_lines(d, (SX0, y + 150), tl_, tf_, MUTED, lh=1.25)
    return im


def end_card(lines_top, big, sub):
    im = video_bg()
    d = ImageDraw.Draw(im)
    wordmark(d, SX0, 520, 64, INK, ACID)
    y = 680
    for t in lines_top:
        f, ls = fit(t, "demi", (60, 54, 48), SX1 - SX0, 3)
        y = draw_lines(d, (SX0, y), ls, f, INK, lh=1.15) + 10
    f, ls = fit(big, "heavy", (96, 84, 72), SX1 - SX0, 2)
    if not f:
        f, ls = fit(big, "heavy", (64, 58, 52, 46, 40), SX1 - SX0, 4)
    y = draw_lines(d, (SX0, y + 10), ls, f, ACID, lh=1.1) + 40
    d.line([(SX0, y), (SX0 + 160, y)], fill=LINE2, width=4)
    y += 40
    for t in sub:
        f, ls = fit(t, "med", (40, 36, 32), SX1 - SX0, 3)
        y = draw_lines(d, (SX0, y), ls, f, MUTED, lh=1.25) + 14
    return im


def render_question(b, out):
    L = q_layout(b)
    if not L:
        return None
    p = b["pack"]
    hook, ques, rev = q_hook(b), q_screen(b, L, False), q_screen(b, L, True)
    end = end_card(["Free practice + notes:"], "studystore.co",
                   [f'Pack: {p["title"]} (available soon)', "Free practice questions and notes on the site."])
    T_HOOK, FADE, COUNT, REV, END = 1.6, 0.35, 10.0, 3.2, 2.0
    t1 = T_HOOK
    t2 = t1 + FADE
    t3 = t2 + COUNT
    t4 = t3 + FADE
    t5 = t4 + REV
    t6 = t5 + FADE
    total = t6 + END
    bw = SX1 - SX0

    def bar(img, frac, secs_left):
        im = img.copy()
        d = ImageDraw.Draw(im)
        y = L["y_bar"]
        d.rounded_rectangle([SX0, y, SX1, y + 18], radius=9, fill=SURF2)
        w = int(bw * frac)
        if w > 18:
            d.rounded_rectangle([SX0, y, SX0 + w, y + 18], radius=9, fill=ACID)
        d.text((SX0, y + 34), f"{secs_left}s", font=font("mono", 34), fill=ACID)
        return im

    def frame(t):
        if t < t1:
            return hook, "hook"
        if t < t2:
            k = int((t - t1) / FADE * 12)
            return Image.blend(hook, bar(ques, 1.0, 10), ease(k / 12)), f"f1-{k}"
        if t < t3:
            el = t - t2
            frac = 1 - el / COUNT
            px = int(bw * frac)
            return bar(ques, frac, max(1, math.ceil(COUNT - el))), f"c-{px}"
        if t < t4:
            k = int((t - t3) / FADE * 12)
            return Image.blend(bar(ques, 0, 0), rev, ease(k / 12)), f"f2-{k}"
        if t < t5:
            return rev, "rev"
        if t < t6:
            k = int((t - t5) / FADE * 12)
            return Image.blend(rev, end, ease(k / 12)), f"f3-{k}"
        return end, "end"

    size = write_frames(out, frame, total, t2 + 0.5, maxrate="900k")
    return dict(size=size, seconds=round(total, 1))


# ---------------------------------------------------------------- diagram video

def find_panels(img, bgc, min_gap=14):
    """Column ranges of side-by-side panels, split at runs of blank columns."""
    g = img.convert("L")
    w, h = g.size
    bg = sum(bgc) / 3
    px = g.load()
    blank = []
    for x in range(w):
        ink = sum(1 for y in range(0, h, 3) if abs(px[x, y] - bg) > 40)
        blank.append(ink <= 1)
    segs, x = [], 0
    while x < w:
        if blank[x]:
            x += 1
            continue
        a = x
        while x < w and not all(blank[x:x + min_gap]):
            x += 1
        segs.append((a, x))
    return [s for s in segs if s[1] - s[0] > w * 0.15]


def render_diagram(note, out):
    beats = caption_beats(note)
    if len(beats) < 3:
        return None
    src = Image.open(note["img"]).convert("RGB")
    sw, sh = src.size
    PX0, PX1, PY0 = 40, W - 150, 0
    tf, tl = fit(note["title"], "heavy", (66, 60, 54, 48), SX1 - SX0, 3)
    if not tf:
        return None
    # static chrome
    base = video_bg()
    d = ImageDraw.Draw(base)
    pill(d, SX0, SY0, "FREE MCAT NOTE", font("mono", 30), BG, ACID)
    yt = draw_lines(d, (SX0, SY0 + 82), tl, tf, INK, lh=1.12)
    PY0 = yt + 26
    pw = PX1 - PX0
    ph = min(int(pw / 1.05), 660)
    PY1 = PY0 + ph
    cap_y0 = PY1 + 40
    caps = []
    for b in beats:
        f = ls = None
        for size in (54, 50, 46, 42, 38):
            f, ls = fit(b, "demi", (size,), SX1 - SX0, (SY1 - cap_y0 - 48) // int(size * 1.24))
            if f:
                break
        if not f:
            return None
        caps.append((f, ls))
    d.rounded_rectangle([PX0 - 4, PY0 - 4, PX1 + 4, PY1 + 4], radius=16, fill=LINE2)
    # pad the diagram onto paper so a full view fits the panel aspect
    asp = pw / ph
    bgc = src.getpixel((2, 2))
    M = int(max(sw, sh))  # generous paper margin so any window stays on paper
    paper = Image.new("RGB", (sw + 2 * M, sh + 2 * M), bgc)
    ox, oy = M, M
    paper.paste(src, (ox, oy))
    fw, fh = (sw * 1.04, sw * 1.04 / asp) if sw / sh > asp else (sh * 1.04 * asp, sh * 1.04)
    full = (ox + sw / 2 - fw / 2, oy + sh / 2 - fh / 2, ox + sw / 2 + fw / 2, oy + sh / 2 + fh / 2)
    nb = len(beats)

    def window(x0, x1, y0, y1, margin=0.05):
        w, h = (x1 - x0) * (1 + 2 * margin), (y1 - y0) * (1 + 2 * margin)
        w, h = max(w, h * asp), max(h, w / asp)
        cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
        return (ox + cx - w / 2, oy + cy - h / 2, ox + cx + w / 2, oy + cy + h / 2)

    panels = find_panels(src, bgc)
    wins = []
    if 2 <= len(panels) <= 4:
        # multi-panel figure: visit each panel in turn
        for i in range(nb):
            a, b = panels[i % len(panels)]
            wins.append(window(a, b, 0, sh, 0.03))
    else:
        # single figure: a closer crop that pans left to right across the beats
        zh = sh * 0.8
        zw = zh * asp
        if zw > sw * 0.85:
            zw = sw * 0.8
            zh = zw / asp
        for i in range(nb):
            cx = zw / 2 + (sw - zw) * (i / max(1, nb - 1))
            cy = sh / 2 + (sh - zh) * (0.25 if i % 2 else -0.25) / 2
            wins.append(window(cx - zw / 2, cx + zw / 2, cy - zh / 2, cy + zh / 2, 0))
    INTRO, BEAT, END, FADE = 2.4, 4.4, 2.6, 0.35
    t_end = INTRO + nb * BEAT
    total = t_end + END
    end = end_card(["Read the free note:"], note["title"],
                   [f"studystore.co/notes/{note['slug']}", "Free MCAT notes and practice questions."])

    def lerp(a, b, k):
        return tuple(x + (y - x) * k for x, y in zip(a, b))

    def view(t):
        if t < INTRO:
            return full
        i = min(nb - 1, int((t - INTRO) / BEAT))
        lt = (t - INTRO) - i * BEAT
        prev = full if i == 0 else wins[i - 1]
        k = ease(lt / 1.6)
        w = lerp(prev, wins[i], k)
        # slow drift (Ken Burns) inside each hold
        drift = ease((lt - 1.6) / (BEAT - 1.6)) if lt > 1.6 else 0
        cx, cy = (w[0] + w[2]) / 2, (w[1] + w[3]) / 2
        s = 1 - 0.06 * drift
        hw, hh = (w[2] - w[0]) / 2 * s, (w[3] - w[1]) / 2 * s
        return (cx - hw, cy - hh, cx + hw, cy + hh)

    def frame(t):
        if t >= t_end:
            k = (t - t_end) / FADE
            if k >= 1:
                return end, "end"
        im = base.copy()
        tv = min(t, t_end - 0.001)
        box = view(tv)
        im.paste(paper.resize((pw, ph), Image.BICUBIC, box=box), (PX0, PY0))
        dd = ImageDraw.Draw(im)
        if tv >= INTRO - 0.4:
            i = min(nb - 1, max(0, int((tv - INTRO) / BEAT)))
            lt = tv - INTRO - i * BEAT
            f, ls = caps[i]
            a = ease((lt + 0.4) / 0.6) if lt < 0.2 else 1.0
            col = tuple(int(BG[c] + (INK[c] - BG[c]) * a) for c in range(3))
            dd.text((SX0, cap_y0), f"{i + 1}/{nb}", font=font("mono", 30), fill=ACID)
            draw_lines(dd, (SX0, cap_y0 + 48), ls, f, col, lh=1.24)
        else:
            dd.text((SX0, cap_y0), "The note, in " + str(nb) + " beats", font=font("mono", 30), fill=MUTED)
        if t >= t_end:
            return Image.blend(im, end, ease((t - t_end) / FADE)), None
        return im, None

    size = write_frames(out, frame, total, INTRO + BEAT * 0.6, maxrate="850k")
    return dict(size=size, seconds=round(total, 1), beats=beats)


# ---------------------------------------------------------------- pins

PW, PH = 1000, 1500


def save_pin(im, out):
    out.parent.mkdir(parents=True, exist_ok=True)
    im.quantize(colors=256, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE).save(out, optimize=True)
    im.save(out.with_suffix(".webp"), quality=84, method=6)
    return out.stat().st_size + out.with_suffix(".webp").stat().st_size


def pin_frame(label):
    im = grid_bg(PW, PH, L_BG, (226, 231, 224))
    d = ImageDraw.Draw(im)
    d.rectangle([0, 0, PW, 26], fill=L_ACID)
    pill(d, 60, 70, label, font("mono", 30), L_BG, L_INK)
    d.rectangle([0, PH - 150, PW, PH], fill=L_INK)
    wordmark(d, 60, PH - 118, 52, L_BG, (255, 210, 63))
    return im, d


def render_note_pin(note, out):
    im, d = pin_frame("FREE MCAT NOTE")
    f, ls = fit(note["title"], "heavy", (76, 68, 62, 56, 50), PW - 120, 4)
    if not f:
        return None
    y = draw_lines(d, (60, 150), ls, f, L_INK, lh=1.1) + 30
    src = Image.open(note["img"]).convert("RGB")
    df, dl = fit(note["desc"], "med", (34, 31, 28), PW - 120, 4)
    desc_h = len(dl) * int(df.size * 1.3) if df else 0
    avail_h = PH - 150 - 40 - desc_h - 40 - y
    sc = min((PW - 120) / src.width, avail_h / src.height)
    img = src.resize((int(src.width * sc), int(src.height * sc)), Image.LANCZOS)
    x = (PW - img.width) // 2
    d.rounded_rectangle([x - 14, y - 14, x + img.width + 14, y + img.height + 14], radius=14, fill=(255, 255, 255),
                        outline=L_LINE, width=2)
    im.paste(img, (x, y))
    y += img.height + 44
    if df:
        draw_lines(d, (60, y), dl, df, L_MUTED, lh=1.3)
    rf = font("demi", 34)
    t = "Read it free: studystore.co"
    d.text((PW - 60 - tlen(t, rf), PH - 102), t, font=rf, fill=L_BG)
    return dict(size=save_pin(im, out))


def render_q_pin(b, out):
    q, p = b["q"], b["pack"]
    im, d = pin_frame("MCAT PRACTICE QUESTION")
    d.text((60 + tlen("MCAT PRACTICE QUESTION", font("mono", 30)) + 60, 76), p["section_name"], font=font("demi", 34),
           fill=L_MUTED)
    tw = PW - 120
    sf, sl = fit(q["stem"], "bold", (68, 62, 56, 50, 46, 42), tw, 7)
    if not sf:
        return None
    y = draw_lines(d, (60, 160), sl, sf, L_INK, lh=1.2) + 40
    of = None
    for size in (46, 42, 38, 35, 32):
        f = font("med", size)
        ols = [wrap(o, f, tw - 70 - 60) for o in q["options"]]
        if all(x is not None and len(x) <= 3 for x in ols):
            of = f
            break
    if not of:
        return None
    for j, o_lines in enumerate(ols):
        hgt = max(56, len(o_lines) * int(of.size * 1.22)) + 40
        d.rounded_rectangle([60, y, PW - 60, y + hgt], radius=12, fill=(255, 255, 255), outline=L_LINE, width=2)
        d.rounded_rectangle([84, y + (hgt - 56) // 2, 140, y + (hgt - 56) // 2 + 56], radius=8, fill=L_INK)
        lf = font("mono", 32)
        d.text((84 + (56 - tlen(chr(65 + j), lf)) / 2, y + (hgt - 56) // 2 + 9), chr(65 + j), font=lf, fill=(255, 210, 63))
        th = len(o_lines) * int(of.size * 1.22)
        draw_lines(d, (166, y + (hgt - th) // 2 - 2), o_lines, of, L_INK)
        y += hgt + 16
    if y > PH - 150 - 150:
        return None
    y += 24
    d.text((60, y), "Think you know it?", font=font("heavy", 50), fill=L_INK)
    d.text((60, y + 66), f'Answer + explanation at studystore.co', font=font("demi", 36), fill=L_GREEN)
    # center the question block vertically (shift by whole grid cells so the paper grid stays aligned)
    y_end, top, bottom = y + 120, 150, PH - 150
    shift = ((bottom - y_end) // 2) // 120 * 120
    if shift > 0:
        block = im.crop((0, top, PW, y_end))
        im.paste(grid_bg(PW, PH, L_BG, (226, 231, 224)).crop((0, top, PW, top + shift)), (0, top))
        im.paste(block, (0, top + shift))
    rf = font("demi", 30)
    t = f'From the {p["title"]} pack'
    if tlen(t, rf) < PW - 480:
        d.text((PW - 60 - tlen(t, rf), PH - 96), t, font=rf, fill=(154, 168, 161))
    return dict(size=save_pin(im, out))


# ---------------------------------------------------------------- manifest and outbox

CAMPAIGNS = [
    dict(id="qotd-tiktok", name="Question of the day on TikTok", channel="tiktok",
         goal="Reach premeds with 15 second MCAT questions that send them to free practice pages"),
    dict(id="qotd-shorts", name="Question of the day on YouTube Shorts", channel="shorts",
         goal="Same question videos on Shorts for search and subscriber reach"),
    dict(id="diagram-tiktok", name="Diagram explainers on TikTok", channel="tiktok",
         goal="Slow-pan explainers of note diagrams that send viewers to the free notes"),
    dict(id="pins-notes", name="Pinterest pins for free notes", channel="pinterest",
         goal="Evergreen Pinterest traffic to the free notes, one pin per note diagram"),
    dict(id="pins-questions", name="Pinterest question pins", channel="pinterest",
         goal="Question pins that link to the pack page where the answer and explanation are shown"),
]
OWNER_STEP = {
    "tiktok": "Create the TikTok account once (bio link https://www.studystore.co/?utm_source=tiktok&utm_campaign={cid}), then upload each video from /admin/marketing",
    "shorts": "Create the YouTube channel once, then upload each video as a Short from /admin/marketing",
    "pinterest": "Create a free Pinterest Business account once and claim studystore.co, then create each pin from /admin/marketing",
}


def utm(path, channel, cid):
    sep = "&" if "?" in path else "?"
    return f"{BASE}/{path}{sep}utm_source={channel}&utm_campaign={cid}"


def load_manifest():
    f = ROOT / "media" / "manifest.json"
    if f.exists():
        return json.loads(f.read_text())
    return {"q": {}, "d": {}, "pins": {}, "counters": {}}


def save_manifest(m):
    f = ROOT / "media" / "manifest.json"
    f.parent.mkdir(parents=True, exist_ok=True)
    f.write_text(json.dumps(m, indent=1, sort_keys=True) + "\n")


def next_id(m, cid):
    m["counters"][cid] = m["counters"].get(cid, 0) + 1
    return f"{cid}-{m['counters'][cid]:03d}"


def hashtags(*tags):
    seen = []
    for t in ("#mcat", "#premed", "#mcatprep") + tags:
        if t not in seen:
            seen.append(t)
    return " ".join(seen[:5])


def outbox_for(kind, key, rec, m):
    """Outbox items for one rendered asset. Ids are stored in the manifest so reruns keep them stable."""
    items = []
    ids = rec.setdefault("outbox_ids", {})

    def item(cid, channel, target, target_url, title, body, link, asset, notes):
        if cid not in ids:
            ids[cid] = next_id(m, cid)
        items.append({"id": ids[cid], "campaign": cid, "channel": channel, "target": target, "target_url": target_url,
                      "title": title, "body": body, "link": link, "asset_url": asset, "gate": "now", "notes": notes})

    if kind == "q":
        asset = f"/media/q/{key}.mp4"
        tags = hashtags(rec["tag"], "#mcatquestion")
        hook = f"MCAT {rec['section']} question: can you get it in 10 seconds? Answer at the end."
        chans = [("qotd-tiktok", "tiktok", "TikTok", "https://www.tiktok.com/upload")]
        if rec.get("shorts"):
            chans.append(("qotd-shorts", "shorts", "YouTube Shorts", "https://studio.youtube.com/"))
        for cid, ch, target, turl in chans:
            link = utm(rec["practice"], ch, cid)
            body = f"{hook}\n\nMore free MCAT practice questions and notes: link in bio.\n\n{tags}"
            title = f"MCAT question in 10 seconds: {rec['topic']}"[:100]
            item(cid, ch, target, turl, title, body, link, asset,
                 f"Upload {asset} (poster {asset[:-4]}.jpg). No link in caption; bio link carries the utm. Related free page: {link}")
    elif kind == "d":
        asset = f"/media/d/{key}.mp4"
        cid = "diagram-tiktok"
        link = utm(f"notes/{key}.html", "tiktok", cid)
        tags = hashtags(rec["tag"], "#studytok")
        body = f"{rec['title']}, explained from one diagram.\n\nThe full note is free: link in bio.\n\n{tags}"
        item(cid, "tiktok", "TikTok", "https://www.tiktok.com/upload", rec["title"][:100], body, link, asset,
             f"Upload {asset}. No link in caption; point people to the bio link. Note link for the bio or a pinned comment: {link}")
    else:
        asset = f"/media/pins/{key}.png"
        if key.startswith("note-"):
            cid = "pins-notes"
            link = utm(f"notes/{rec['slug']}.html", "pinterest", cid)
            body = f"{rec['desc']}\n\nFree MCAT note with an original diagram and a short quiz.\n\n{hashtags(rec['tag'], '#studynotes')}"
            item(cid, "pinterest", "Pinterest board: MCAT Study Guides", "https://www.pinterest.com/pin-creation-tool/",
                 f"{rec['title']} | Free MCAT Note"[:100], body, link, asset,
                 "Paste the link into the pin's destination link field. WebP copy at the same path with .webp if PNG is rejected.")
        else:
            cid = "pins-questions"
            link = utm(f"products/{rec['pack_slug']}.html", "pinterest", cid)
            body = (f"MCAT {rec['section']} practice question: {rec['topic']}. Try it, then check the answer and explanation "
                    f"on the free sample quiz at studystore.co.\n\n{hashtags(rec['tag'], '#mcatquestion')}")
            item(cid, "pinterest", "Pinterest board: MCAT Practice Questions", "https://www.pinterest.com/pin-creation-tool/",
                 f"MCAT Practice Question: {rec['topic']}"[:100], body, link, asset,
                 "Link field goes to the pack page; the answer is in its free 'Five questions from the pack' quiz. Packs are available soon, never say buy.")
    return items


def write_outbox(ops, items, date):
    if not items:
        return None
    f = Path(ops) / "growth" / "outbox" / f"media-{date}.json"
    f.parent.mkdir(parents=True, exist_ok=True)
    cur = json.loads(f.read_text()) if f.exists() else []
    byid = {x["id"]: x for x in cur}
    for it in items:
        byid[it["id"]] = it
    out = sorted(byid.values(), key=lambda x: x["id"])
    f.write_text(json.dumps(out, indent=1, ensure_ascii=False) + "\n")
    return f


def write_campaigns(ops, date):
    f = Path(ops) / "growth" / "campaigns" / "media.json"
    f.parent.mkdir(parents=True, exist_ok=True)
    arr = [dict(id=c["id"], name=c["name"], channel=c["channel"], gate="now", goal=c["goal"], created=date,
                owner_step=OWNER_STEP[c["channel"]].format(cid=c["id"])) for c in CAMPAIGNS]
    f.write_text(json.dumps(arr, indent=1) + "\n")
    return f


# ---------------------------------------------------------------- driver

class Ctx:
    def __init__(self, out_root):
        self.site = load_site()
        self.pages = practice_pages()
        self.bank = order_questions(question_bank(self.site, self.pages))
        self.notes = notes_with_diagrams()
        self.packs = {p["slug"]: p for p in self.site["products"]}
        self.out = Path(out_root)


def q_record(b, shorts):
    p = b["pack"]
    return dict(pack_slug=p["slug"], section=p["section_name"], tag=section_tag(p), practice=b["practice"],
                topic=b["q"].get("subtopic") or p["title"], shorts=shorts)


def do_q(ctx, m, b, items):
    r = render_question(b, ctx.out / "q" / f"{b['id']}.mp4")
    if not r:
        m.setdefault("skipped", {}).setdefault("q", [])
        if b["id"] not in m["skipped"]["q"]:
            m["skipped"]["q"].append(b["id"])
        return False
    shorts = sum(1 for x in m["q"].values() if x.get("shorts")) < 20
    rec = dict(q_record(b, shorts), **r)
    m["q"][b["id"]] = rec
    items += outbox_for("q", b["id"], rec, m)
    print(f"q {b['id']} {r['size'] // 1024}KB {r['seconds']}s", flush=True)
    return True


def do_d(ctx, m, note, items):
    r = render_diagram(note, ctx.out / "d" / f"{note['slug']}.mp4")
    if not r:
        m.setdefault("skipped", {}).setdefault("d", [])
        if note["slug"] not in m["skipped"]["d"]:
            m["skipped"]["d"].append(note["slug"])
        return False
    p = ctx.packs.get(note["product"])
    rec = dict(title=note["title"], tag=section_tag(p) if p else "#mcatstudy", **r)
    m["d"][note["slug"]] = rec
    items += outbox_for("d", note["slug"], rec, m)
    print(f"d {note['slug']} {r['size'] // 1024}KB {r['seconds']}s", flush=True)
    return True


def do_pin_note(ctx, m, note, items):
    key = f"note-{note['slug']}"
    r = render_note_pin(note, ctx.out / "pins" / f"{key}.png")
    if not r:
        return False
    p = ctx.packs.get(note["product"])
    rec = dict(slug=note["slug"], title=note["title"], desc=note["desc"], tag=section_tag(p) if p else "#mcatstudy", **r)
    m["pins"][key] = rec
    items += outbox_for("pins", key, rec, m)
    print(f"pin {key} {r['size'] // 1024}KB", flush=True)
    return True


def do_pin_q(ctx, m, b, items):
    key = f"q-{b['id']}"
    r = render_q_pin(b, ctx.out / "pins" / f"{key}.png")
    if not r:
        return False
    rec = dict(q_record(b, False), **r)
    rec.pop("shorts")
    m["pins"][key] = rec
    items += outbox_for("pins", key, rec, m)
    print(f"pin {key} {r['size'] // 1024}KB", flush=True)
    return True


def todo(ctx, m):
    sk = m.get("skipped", {})
    return dict(
        q=[b for b in ctx.bank if b["id"] not in m["q"] and b["id"] not in sk.get("q", [])],
        d=[n for n in ctx.notes if n["slug"] not in m["d"] and n["slug"] not in sk.get("d", [])],
        pn=[n for n in ctx.notes if f"note-{n['slug']}" not in m["pins"]],
        # question pins: questions not already used for a video first, so pins and videos differ
        pq=sorted([b for b in ctx.bank if f"q-{b['id']}" not in m["pins"]], key=lambda b: b["id"] in m["q"]),
    )


def run_counts(ctx, m, counts, items):
    fns = dict(q=do_q, d=do_d, pn=do_pin_note, pq=do_pin_q)
    for kind in ("q", "d", "pn", "pq"):
        want = counts.get(kind, 0)
        done = 0
        for x in todo(ctx, m)[kind]:
            if done >= want:
                break
            if fns[kind](ctx, m, x, items):
                done += 1
            save_manifest(m)


def run_next(ctx, m, n, items):
    fns = dict(q=do_q, d=do_d, pn=do_pin_note, pq=do_pin_q)
    cycle = ["q", "d", "pn", "q", "pq"]
    i = done = misses = 0
    while done < n and misses < len(cycle):
        kind = cycle[i % len(cycle)]
        i += 1
        rendered = False
        for x in todo(ctx, m)[kind]:
            if fns[kind](ctx, m, x, items):
                rendered = True
                break
        save_manifest(m)
        if rendered:
            done += 1
            misses = 0
        else:
            misses += 1
    return done


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--q", type=int, default=0)
    ap.add_argument("--d", type=int, default=0)
    ap.add_argument("--pins-notes", type=int, default=0)
    ap.add_argument("--pins-q", type=int, default=0)
    ap.add_argument("--next", type=int, default=0, help="render N new unseen items across all kinds")
    ap.add_argument("--ops", default=str(ROOT.parent / "studystore"), help="private repo root for the outbox file")
    ap.add_argument("--date", default=datetime.date.today().isoformat())
    ap.add_argument("--outbox-all", action="store_true", help="(re)write outbox items for every asset in the manifest")
    ap.add_argument("--sample", metavar="DIR", help="render a few items into DIR and extract preview frames, no manifest")
    a = ap.parse_args()

    if a.sample:
        ctx = Ctx(a.sample)
        m = {"q": {}, "d": {}, "pins": {}, "counters": {}}
        items = []
        picks = [ctx.bank[0], ctx.bank[7], max(ctx.bank[:40], key=lambda b: b["score"])]
        for b in picks:
            do_q(ctx, m, b, items)
        for pre in ("protein-structure", "signal", "action-potential"):
            do_d(ctx, m, next(n for n in ctx.notes if n["slug"].startswith(pre)), items)
        do_pin_note(ctx, m, ctx.notes[0], items)
        do_pin_q(ctx, m, picks[1], items)
        for sub, keys in (("q", m["q"]), ("d", m["d"])):
            for k in keys:
                for t in (1, 6, 14, 16.5):
                    subprocess.run([FFMPEG, "-y", "-loglevel", "error", "-ss", str(t), "-i", str(ctx.out / sub / f"{k}.mp4"),
                                    "-frames:v", "1", str(ctx.out / f"frame-{sub}-{k}-{t}.png")])
        print(json.dumps(items, indent=1)[:3000])
        return

    ctx = Ctx(ROOT / "media")
    m = load_manifest()
    items = []
    if a.next:
        n = run_next(ctx, m, a.next, items)
        print(f"rendered {n} new items")
    run_counts(ctx, m, {"q": a.q, "d": a.d, "pn": a.pins_notes, "pq": a.pins_q}, items)
    if a.outbox_all:
        items = []
        for kind in ("q", "d", "pins"):
            for k, rec in m[kind].items():
                items += outbox_for(kind, k, rec, m)
    save_manifest(m)
    f = write_outbox(a.ops, items, a.date)
    c = write_campaigns(a.ops, a.date)
    print(f"outbox: {f} ({len(items)} items); campaigns: {c}")


if __name__ == "__main__":
    main()

"""/go/<slug>/ landing entries (landing/<slug>.json): load and validate. Any problem is a LandingError, which build.py
turns into a failed build (exit 1) naming the file and the reason, so a broken entry can never ship a stale or
missing page.

Entry fields:
  slug          required, a-z0-9- (max 61 chars), equal to the file name
  pack          required, a buyable product slug or bundle slug from site.json
  hook, headline, subhead     optional plain text, max 300 chars, no HTML, no em or en dashes
  default_utm   optional {utm_source, utm_campaign, utm_medium, utm_content}, used only when the URL has no utm tags
  preview_ids   optional list of up to 2 image ids from the pack's content/packs/<pack>/sample.json, by file stem:
                one sheet or book page ("sheet-2", "book-1") and/or one card ("card-3"). Default: sheet-1 + card-1.
  question_ids  optional list of 1 to 5 question numbers (1-based) from the same sample.json. Default: the first 3.
For a bundle, preview_ids and question_ids refer to its first member pack.
"""
import json, re
from pathlib import Path

KEYS = {"slug", "pack", "hook", "headline", "subhead", "default_utm", "preview_ids", "question_ids"}
UTM_KEYS = ("utm_source", "utm_campaign", "utm_medium", "utm_content")
UTM_OK = re.compile(r"^[A-Za-z0-9_.\-]{1,60}$")
SLUG_OK = re.compile(r"[a-z0-9][a-z0-9-]{0,60}")


class LandingError(Exception):
    pass


def sample_for(pack, items, sample):
    """(pack slug whose samples apply, its sample.json dict): the pack itself, or a bundle's first member."""
    p = items[pack]
    slug = p["members"][0] if p.get("members") else pack
    return slug, (sample(slug) or {})


def check(f, items, buyable, sample):
    name = f.name
    try:
        d = json.loads(f.read_text())
    except ValueError as e:
        raise LandingError(f"{name}: not valid JSON ({e})")
    if not isinstance(d, dict):
        raise LandingError(f"{name}: must be a JSON object")
    bad = set(d) - KEYS
    if bad:
        raise LandingError(f"{name}: unknown keys {sorted(bad)}")
    slug = d.get("slug")
    if not isinstance(slug, str) or not SLUG_OK.fullmatch(slug) or slug != f.stem:
        raise LandingError(f"{name}: slug must be a-z0-9- and equal the file name ({f.stem!r})")
    pack = d.get("pack")
    if not isinstance(pack, str) or pack not in items or not buyable(items[pack]):
        raise LandingError(f"{name}: pack {pack!r} is not a buyable product or bundle slug in site.json")
    for k in ("hook", "headline", "subhead"):
        v = d.get(k, "")
        if not isinstance(v, str) or "—" in v or "–" in v or "<" in v or len(v) > 300:
            raise LandingError(f"{name}: {k} must be plain text under 300 chars, no HTML, no em or en dashes")
    u = d.get("default_utm", {})
    if not isinstance(u, dict):
        raise LandingError(f"{name}: default_utm must be an object")
    for k, v in u.items():
        if k not in UTM_KEYS or not isinstance(v, str) or not UTM_OK.match(v):
            raise LandingError(f"{name}: default_utm {k}={v!r} not allowed")
    _, s = sample_for(pack, items, sample)
    if "preview_ids" in d:
        ids = d["preview_ids"]
        have = {Path(x["src"]).stem: ("card" if x in (s.get("cards") or []) else "page") for x in (s.get("cards") or []) + (s.get("sheets") or [])}
        if not isinstance(ids, list) or not 1 <= len(ids) <= 2 or any(i not in have for i in ids):
            raise LandingError(f"{name}: preview_ids must be 1-2 of {sorted(have)}")
        kinds = [have[i] for i in ids]
        if len(set(kinds)) != len(kinds):
            raise LandingError(f"{name}: preview_ids takes at most one page (sheet/book) and one card")
    if "question_ids" in d:
        q = d["question_ids"]
        n = len(s.get("questions") or [])
        if (not isinstance(q, list) or not 1 <= len(q) <= 5 or len(set(q)) != len(q)
                or any(not isinstance(i, int) or isinstance(i, bool) or not 1 <= i <= n for i in q)):
            raise LandingError(f"{name}: question_ids must be 1-5 distinct numbers from 1 to {n}")
    return d


def collisions(entries, root):
    """A /go/<slug> path must not be claimed twice, by a _redirects rule, or by a page that is not a landing page."""
    errs, seen = [], {}
    for d in entries:
        k = d["slug"].lower()
        if k in seen:
            errs.append(f"{d['slug']}: duplicate landing slug (also {seen[k]})")
        seen[k] = d["slug"]
    red = Path(root) / "_redirects"
    if red.exists():
        for line in red.read_text().splitlines():
            src = line.split()[0] if line.strip() and not line.lstrip().startswith("#") else ""
            m = re.match(r"^/go/([^/]+)/?(?:index(?:\.html)?)?$", src)
            if m and m.group(1).lower() in seen:
                errs.append(f"{m.group(1)}: /go/{m.group(1)} is also a _redirects source")
    go = Path(root) / "go"
    if go.exists():
        for f in go.glob("*.html"):
            if f.stem.lower() in seen:
                errs.append(f"{f.stem}: go/{f.name} already exists as a page")
    return errs


def load(root, items, buyable, sample):
    """All landing entries, or LandingError listing every problem."""
    entries, errs = [], []
    for f in sorted((Path(root) / "landing").glob("*.json")):
        try:
            entries.append(check(f, items, buyable, sample))
        except LandingError as e:
            errs.append(str(e))
    errs += collisions(entries, root)
    if errs:
        raise LandingError("; ".join(errs))
    return entries


def stale_dirs(root, entries):
    """go/<slug>/ directories with no landing entry (removed or renamed): build.py deletes them."""
    go = Path(root) / "go"
    keep = {d["slug"] for d in entries}
    return sorted(p for p in go.iterdir() if p.is_dir() and p.name not in keep) if go.exists() else []

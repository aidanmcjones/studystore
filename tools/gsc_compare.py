#!/usr/bin/env python3
"""Compare a Search Console export against the baseline in tools/gsc_targets.json.

Export from Search Console > Performance > Search results (pick the date range, then EXPORT > Download CSV).
The zip holds Pages.csv and Queries.csv. Then:

    python3 tools/gsc_compare.py --pages Pages.csv [--queries Queries.csv]

Page rows are folded onto the target page: the .html form, the apex host and every merged note listed under
"merged_in" count toward the page they now redirect to. Positions are impression-weighted. Compare a new window
with the baseline's post_1028 numbers too (see "warning" in the JSON).
"""
import argparse, csv, json, re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def num(v):
    v = (v or "").strip().replace(",", "").rstrip("%")
    try:
        return float(v)
    except ValueError:
        return 0.0


def rows(path):
    with open(path, newline="", encoding="utf-8-sig") as f:
        r = csv.reader(f)
        next(r, None)
        for line in r:
            if len(line) >= 5:
                yield line[0], num(line[1]), num(line[2]), num(line[4])


def norm(url):
    p = re.sub(r"^https?://(www\.)?studystore\.co", "", url) or "/"
    if p.endswith("/index.html"):
        p = p[:-len("index.html")]
    elif p.endswith(".html"):
        p = p[:-5]
    return p


def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("--pages", required=True)
    ap.add_argument("--queries")
    a = ap.parse_args()
    base = json.loads((ROOT / "tools" / "gsc_targets.json").read_text())
    fold = {}
    for t in base["pages"]:
        for u in [t["page"]] + t.get("variants", []) + t.get("merged_in", []):
            fold[norm(u)] = t["page"]
    agg = {}
    for url, c, i, pos in rows(a.pages):
        k = fold.get(norm(url))
        if k:
            s = agg.setdefault(k, [0.0, 0.0, 0.0])
            s[0] += c; s[1] += i; s[2] += pos * i
    print(f"{'page':58} {'impr':>6} {'base':>6} {'pos':>5} {'base':>5} {'clicks':>6} {'ctr':>6}")
    for t in base["pages"]:
        c, i, w = agg.get(t["page"], [0, 0, 0])
        pos = w / i if i else 0
        ctr = f"{100 * c / i:.1f}%" if i else "-"
        print(f"{t['page'][:58]:58} {i:6.0f} {t['impressions']:6} {pos:5.1f} {t['position']:5.1f} {c:6.0f} {ctr:>6}")
    if a.queries:
        got = {q.lower(): (c, i, pos) for q, c, i, pos in rows(a.queries)}
        print(f"\n{'query':58} {'impr':>6} {'base':>6} {'pos':>5} {'base':>5} {'clicks':>6}")
        for q in base["queries"]:
            c, i, pos = got.get(q["query"], (0, 0, 0))
            print(f"{q['query'][:58]:58} {i:6.0f} {q['impressions']:6} {pos:5.1f} {q['position']:5.1f} {c:6.0f}")


if __name__ == "__main__":
    main()

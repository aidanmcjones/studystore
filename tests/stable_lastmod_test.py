#!/usr/bin/env python3
"""Built pages must not carry the build date: a date.today() stamp re-dirties committed HTML and sitemap.xml on
every build, and ops/experiments.py then refuses to publish. Checks the build sources for build-date calls."""
import pathlib, re, sys
ROOT = pathlib.Path(__file__).resolve().parent.parent
# A date that ends up in the output: today(), or now()/utcnow() turned into a date string. A bare now() used in a
# comparison (build.py's launch-bar gate) only flips output once, at a fixed instant, so it is allowed.
BAD = re.compile(r"\bdate\.today\s*\(|\btime\.strftime\s*\(|\b(?:now|utcnow)\([^)]*\)\s*\.\s*(?:isoformat|date|strftime)\b")
bad = []
for name in ("build.py", "build_tools.py", "build_compare.py", "practice_build.py", "products_build.py", "landing.py"):
    f = ROOT / name
    if not f.exists():
        continue
    for n, line in enumerate(f.read_text().splitlines(), 1):
        if BAD.search(line.split("#", 1)[0]):
            bad.append(f"{name}:{n}: {line.strip()}")
if bad:
    print("build-date stamp in a build source (use a fixed date):\n" + "\n".join(bad))
    sys.exit(1)
print("stable_lastmod_test: ok")

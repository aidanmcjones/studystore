"""landing.py + build.py: a bad /go/ entry fails the build (non-zero, file named), slugs cannot collide, preview_ids and
question_ids are validated, stale go/<slug>/ dirs are found, and deploy_pages.sh runs the tests before deploying."""
import json, subprocess, sys, tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import landing as LP

passed = failed = 0
def ok(c, n):
    global passed, failed
    if c: passed += 1
    else:
        failed += 1; print("FAIL:", n)

SAMPLE = {"cards": [{"src": "a/card-1.webp"}, {"src": "a/card-3.webp"}],
          "sheets": [{"src": "a/sheet-1.webp", "kind": "sheet"}, {"src": "a/sheet-2.webp", "kind": "sheet"}],
          "questions": [{}, {}, {}, {}, {}]}
ITEMS = {"1a": {"slug": "1a", "aamc": "1A", "status": "available"},
         "b": {"slug": "b", "members": ["1a"], "status": "available"},
         "soon": {"slug": "soon", "aamc": "9Z", "status": "planned"}}
buyable = lambda p: p["status"] == "available"
sample = lambda slug: SAMPLE if slug == "1a" else None

def run(files, redirects="", pages=()):
    with tempfile.TemporaryDirectory() as t:
        t = Path(t); (t / "landing").mkdir(); (t / "go").mkdir()
        for name, text in files.items(): (t / "landing" / name).write_text(text)
        if redirects: (t / "_redirects").write_text(redirects)
        for pg in pages: (t / "go" / pg).write_text("x")
        try:
            return LP.load(t, ITEMS, buyable, sample), ""
        except LP.LandingError as e:
            return None, str(e)

good = {"slug": "x", "pack": "1a"}
r, e = run({"x.json": json.dumps(good)}); ok(r and not e, "good entry loads")
r, e = run({"x.json": '{"slug": "x", "pack": "1a",}'}); ok(r is None and "x.json: not valid JSON" in e, "trailing comma fails with file name")
r, e = run({"x.json": json.dumps({"slug": "x", "pack": "1a-typo"})}); ok(r is None and "'1a-typo' is not a buyable" in e, "unknown pack fails")
r, e = run({"x.json": json.dumps({"slug": "x", "pack": "soon"})}); ok(r is None and "not a buyable" in e, "unbuyable pack fails")
r, e = run({"y.json": json.dumps(good)}); ok(r is None and "equal the file name" in e, "slug must equal file name")
r, e = run({"x.json": json.dumps({**good, "extra": 1})}); ok(r is None and "unknown keys" in e, "unknown key fails")
r, e = run({"x.json": json.dumps({**good, "headline": "A — B"})}); ok(r is None and "headline" in e, "em dash fails")
r, e = run({"x.json": json.dumps({**good, "default_utm": {"utm_source": "a b"}})}); ok(r is None and "default_utm" in e, "bad utm fails")
r, e = run({"x.json": json.dumps(good)}, redirects="/go/x /products/1a 301\n"); ok(r is None and "_redirects source" in e, "redirect collision fails")
r, e = run({"x.json": json.dumps(good)}, redirects="/go/other /products/1a 301\n"); ok(r and not e, "unrelated redirect is fine")
r, e = run({"x.json": json.dumps(good)}, pages=("x.html",)); ok(r is None and "already exists as a page" in e, "page collision fails")
r, e = run({"x.json": json.dumps({**good, "preview_ids": ["sheet-2", "card-3"]})}); ok(r and not e, "valid preview_ids")
r, e = run({"x.json": json.dumps({**good, "preview_ids": ["sheet-9"]})}); ok(r is None and "preview_ids" in e, "unknown preview id fails")
r, e = run({"x.json": json.dumps({**good, "preview_ids": ["sheet-1", "sheet-2"]})}); ok(r is None and "at most one page" in e, "two pages fail")
r, e = run({"x.json": json.dumps({**good, "question_ids": [4, 3]})}); ok(r and not e, "valid question_ids")
r, e = run({"x.json": json.dumps({**good, "question_ids": [0]})}); ok(r is None and "question_ids" in e, "question id 0 fails")
r, e = run({"x.json": json.dumps({**good, "question_ids": [6]})}); ok(r is None and "question_ids" in e, "question id past the end fails")
r, e = run({"x.json": json.dumps({**good, "question_ids": [1, 1]})}); ok(r is None and "question_ids" in e, "duplicate question id fails")
r, e = run({"x.json": json.dumps({"slug": "x", "pack": "b", "preview_ids": ["card-1"], "question_ids": [1]})}); ok(r and not e, "bundle ids use its first member")
with tempfile.TemporaryDirectory() as t:
    t = Path(t); (t / "go" / "x").mkdir(parents=True); (t / "go" / "old").mkdir()
    ok([p.name for p in LP.stale_dirs(t, [good])] == ["old"], "stale go/<slug>/ found")

# the real build stops (non-zero, file named) on a broken entry
bad = ROOT / "landing" / "zz-selftest-bad.json"
try:
    bad.write_text('{"slug": "zz-selftest-bad", "pack": "1a-amino-acids-protein",}')
    p = subprocess.run([sys.executable, "build.py"], cwd=ROOT, capture_output=True, text=True)
    ok(p.returncode != 0 and "LANDING ERROR" in (p.stderr + p.stdout) and "zz-selftest-bad.json" in (p.stderr + p.stdout), "build.py exits non-zero on a broken entry")
finally:
    bad.unlink(missing_ok=True)

d = (ROOT / "tools" / "deploy_pages.sh").read_text()
i_build, i_tests, i_deploy = d.find("python3 build.py"), d.find("tests/*_test.mjs"), d.find("pages deploy")
i_tests = d.find("tools/run_tests.sh")
runner = (ROOT / "tools" / "run_tests.sh").read_text()
ci = (ROOT / ".github" / "workflows" / "ci.yml").read_text()
ok(-1 < i_build < i_tests < i_deploy and "set -euo pipefail" in d and "tests/*_test.mjs" in runner and "tests/*_test.py" in runner and "tools/run_tests.sh" in ci,
   "deploy_pages.sh and CI run the same tests/run_tests.sh runner, after the build and before deploying")

print(f"landing_validate_test: {passed} passed, {failed} failed")
sys.exit(1 if failed else 0)

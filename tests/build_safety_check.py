"""Hostile-input checks for the build converters (run by tests/build_safety_test.mjs). Stdlib only.

Unit cases feed attacker-style text through mdlite, safeurl and the JSON-in-script helpers. End-to-end cases copy the
site to a temp dir (assets and media symlinked), plant one hostile input in a note, practice page, landing entry or
data/compare.json, run build.py there and require either a failed build that names the file, or output with the
hostile text inert. Exit 0 only if every case holds."""
import json, os, re, shutil, subprocess, sys, tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import mdlite, safeurl
import build_tools

fails = []


def check(name, ok, detail=""):
    print(("ok   " if ok else "FAIL ") + name + ("" if ok else f"  {detail}"))
    if not ok:
        fails.append(name)


def rejects(fn, *a):
    try:
        fn(*a)
    except safeurl.UnsafeContent as e:
        return str(e.code if hasattr(e, "code") else e)
    return None


# ---------- unit: markdown links and images ----------
BAD_LINKS = {
    "javascript:": "[x](javascript:alert(1))",
    "javascript entity": "[x](&#106;avascript:alert(1))",
    "JaVaScRiPt mixed case": "[x](JaVaScRiPt:alert(1))",
    "data:": "[x](data:text/html;base64,PHNjcmlwdD4=)",
    "vbscript:": "[x](vbscript:msgbox(1))",
    "protocol-relative": "[x](//evil.example/a)",
    "http (not https)": "[x](http://students-residents.aamc.org/a)",
    "host not on allowlist": "[x](https://evil.example/a)",
    "userinfo trick": "[x](https://buy.polar.sh@evil.example/a)",
    "lookalike host": "[x](https://buy.polar.sh.evil.example/a)",
    "attribute breakout": '[x](a"onmouseover="alert(1))',
    "backslash host": "[x](https:\\\\evil.example)",
}
for name, md in BAD_LINKS.items():
    check(f"link rejected: {name}", rejects(mdlite.convert, md) is not None)
    check(f"link rejected in table cell: {name}", rejects(mdlite.convert, "| a |\n|---|\n| " + md + " |") is not None)

GOOD_LINKS = ["[x](https://buy.polar.sh/abc?a=1&b=2)", "[x](passive-vs-active-transport.html)", "[x](../products/1a.html?utm_source=site-cta)",
              "[x](/#sampler)", "[x](https://students-residents.aamc.org/register-mcat-exam/mcat-scheduling-fees)"]
for md in GOOD_LINKS:
    out = mdlite.convert(md)
    check(f"link kept: {md}", out.startswith('<p><a href="') and "javascript" not in out, out)
check("& in a URL stays escaped", 'href="https://buy.polar.sh/abc?a=1&amp;b=2"' in mdlite.convert(GOOD_LINKS[0]))

BAD_IMAGES = {
    "reviewer onerror case": "![diagram](a.png\"onerror=\"location='//evil.example'\")",
    "https image": "![x](https://evil.example/a.png)",
    "javascript image": "![x](javascript:alert(1))",
    "data image": "![x](data:image/svg+xml;base64,PHN2Zz4=)",
    "protocol-relative image": "![x](//evil.example/a.png)",
    "not an image type": "![x](assets/notes/a.html)",
    "dot-dot": "![x](../../secret.png)",
    "quote in src": '![x](a".png)',
}
for name, md in BAD_IMAGES.items():
    check(f"image rejected: {name}", rejects(mdlite.convert, md) is not None)

out = mdlite.convert('![a"><script>alert(1)</script><img onerror=x src="y](assets/notes/a.png "cap<script>alert(2)</script>")')
check("quote-breaking alt text is inert", "<script" not in out and '"><' not in out.split("alt=")[1].split(" loading")[0], out)
out = mdlite.convert("![he said \"hi\" & 'bye' <b>](assets/notes/a.png)")
check("alt is one escaped attribute", out.count('alt="') == 1 and re.search(r'alt="[^"]*" loading', out) and "<b>" not in out, out)
out = mdlite.convert("![x](assets/notes/a.png)", asset_prefix="{{root}}")
check("legit image unchanged", out == '<figure><img src="{{root}}assets/notes/a.png" alt="x" loading="lazy"></figure>', out)

# ---------- unit: raw HTML in content stays text ----------
HOSTILE_TEXT = [
    "<script>alert(1)</script>", "text <img src=x onerror=alert(1)> text", '<a href="javascript:alert(1)" onclick="x()">k</a>',
    "<svg/onload=alert(1)>", "<iframe src=//evil.example></iframe>", "**<script>**", "`<script>` <script>",
    "<sub onclick=alert(1)>x</sub>", "<style>*{display:none}</style>", "\x00 0\x00 <script>",
]
for t in HOSTILE_TEXT:
    for label, fn in (("paragraph", lambda s: mdlite.convert(s)), ("heading", lambda s: mdlite.convert("## " + s)),
                      ("list", lambda s: mdlite.convert("- " + s)), ("quote", lambda s: mdlite.convert("> " + s)),
                      ("table", lambda s: mdlite.convert("| h |\n|---|\n| " + s + " |")), ("inline", mdlite.inline)):
        o = fn(t)
        bad = re.findall(r"<(?!/?(?:p|h[1-6]|ul|ol|li|strong|em|code|sub|sup|blockquote|div|table|thead|tbody|tr|th|td)\b)[a-zA-Z!][^>]*>", o)
        bad += re.findall(r"<(?:sub|sup)\s[^>]*>", o)
        check(f"raw HTML inert in {label}: {t[:30]!r}", not bad, f"{bad} in {o!r}")

# ---------- unit: lint names file and line ----------
msg = rejects(mdlite.lint, "---\ntitle: x\n---\nfine line\n\nsecond [bad](javascript:alert(1)) here\n", "content/notes/x.md")
check("lint names file and line", msg is not None and "content/notes/x.md:6:" in msg, msg)
check("lint skips fenced code", rejects(mdlite.lint, "---\na: b\n---\n```\n[x](javascript:alert(1))\n```\n", "f.md") is None)

# ---------- unit: URL fields in JSON ----------
for name, doc in {"javascript url": {"a": [{"url": "javascript:alert(1)"}]}, "data url": {"url": "data:text/html,x"},
                  "protocol-relative url": {"checkout_url": "//evil.example/x"}, "host off allowlist": {"x": {"url": "https://evil.example/"}},
                  "http url": {"url": "http://ankiweb.net/x"}, "src as URL": {"src": "https://evil.example/a.png"},
                  "script scheme in a plain field": {"note": "javascript:alert(1)"}, "script scheme in a list": {"l": ["data:x"]}}.items():
    check(f"json rejected: {name}", rejects(safeurl.check_json_urls, doc, "t.json") is not None)
check("json: real compare.json passes", rejects(safeurl.check_json_urls, json.loads((ROOT / "data/compare.json").read_text()), "data/compare.json") is None)
check("json: every content json passes", safeurl.validate_content_json(ROOT) > 10)

# ---------- unit: JSON inside inline script / JSON-LD ----------
EVIL = ["</script><script>alert(1)</script>", "</SCRIPT >", "<!--<script>", "<!-- x", "a b", "<ScRiPt src=x>"]
for s in EVIL:
    for label, o in (("json_script", safeurl.json_script({"k": s, s: [s]})), ("build_tools.ld", build_tools.ld({"k": s})),
                     ("build_tools.jsn", build_tools.jsn({"k": s})), ("js_str", safeurl.js_str(s))):
        low = o.lower().replace('<script type="application/ld+json">', "").replace("</script>\n", "").replace("</script>", "", 1) if label == "build_tools.ld" else o.lower()
        check(f"{label} inert for {s[:22]!r}", "</" not in low.replace("<\\/", "") and "<!--" not in low and "<script" not in low and " " not in o, o)
    check(f"json_script round-trips {s[:22]!r}", json.loads(safeurl.json_script({"k": s})) == {"k": s})
check("json_script output unchanged for ordinary data", safeurl.json_script({"a": "x/y", "b": "Café <b>"}) == json.dumps({"a": "x/y", "b": "Café <b>"}, ensure_ascii=False))

# ---------- end to end: full build on a temp copy ----------
SKIP = {".git", "node_modules", ".wrangler", ".mf", "assets", "media", "__pycache__"}


def make_copy(dst):
    for item in ROOT.iterdir():
        if item.name in SKIP:
            continue
        (shutil.copytree if item.is_dir() else shutil.copy2)(item, dst / item.name)
    for link in ("assets", "media"):
        if (ROOT / link).exists():
            os.symlink(ROOT / link, dst / link)


def build(dst):
    env = {k: v for k, v in os.environ.items() if k not in ("PYTHONPATH", "PYTHONSTARTUP")}
    return subprocess.run([sys.executable, "build.py"], cwd=dst, capture_output=True, text=True, timeout=280, env=env)


def e2e(name, mutate, expect_fail_naming=None, inert=None):
    with tempfile.TemporaryDirectory() as td:
        dst = Path(td) / "site"
        dst.mkdir()
        make_copy(dst)
        mutate(dst)
        r = build(dst)
        text = r.stdout + r.stderr
        if expect_fail_naming:
            ok = r.returncode != 0 and all(x in text for x in expect_fail_naming)
            check(f"e2e {name}: build fails naming {expect_fail_naming}", ok, f"rc={r.returncode} {text[-400:]}")
        else:
            ok = r.returncode == 0
            check(f"e2e {name}: build passes", ok, text[-400:])
            if ok and inert:
                bad = inert(dst)
                check(f"e2e {name}: output inert", not bad, str(bad)[:300])


NOTE = "content/notes/absolute-threshold-vs-difference-threshold-jnd.md"


def note_line(txt):
    def m(dst):
        p = dst / NOTE
        p.write_text(p.read_text().replace("\n:::quiz", "\n" + txt + "\n\n:::quiz", 1))
        assert txt in p.read_text()
    return m


def noting(*extra):
    return (NOTE.split("/")[-1], *extra)


e2e("note: reviewer onerror image", note_line("![diagram](a.png\"onerror=\"location='//evil.example'\")"), noting("UNSAFE CONTENT"))
e2e("note: javascript link", note_line("See [this](javascript:alert(1)) now."), noting("UNSAFE CONTENT"))
e2e("note: off-allowlist https link", note_line("See [this](https://evil.example/x) now."), noting("not in data/link_hosts.json"))
e2e("note: inline script and handler stay text", note_line('<script>alert(1)</script> <img src=x onerror=alert(2)> <a href="x" onclick="y()">z</a>'), None,
    lambda dst: [t for t in ("<script>alert", "<img src=x", "<a href=\"x\"") if t in (dst / "notes/absolute-threshold-vs-difference-threshold-jnd.html").read_text()])


def practice_line(txt):
    def m(dst):
        p = next((dst / "content/practice").glob("1a-protein-structure-folding-denaturation.md"))
        p.write_text(p.read_text().replace("@@QUESTIONS", txt + "\n\n@@QUESTIONS", 1))
    return m


e2e("practice: javascript link in primer", practice_line("[go](javascript:alert(1))"), ("1a-protein-structure-folding-denaturation.md", "UNSAFE CONTENT"))


def compare_mut(f):
    def m(dst):
        p = dst / "data/compare.json"
        d = json.loads(p.read_text())
        f(d)
        p.write_text(json.dumps(d, indent=1))
    return m


e2e("compare.json: javascript url", compare_mut(lambda d: d["decks"][0].update(url="javascript:alert(1)")), ("compare.json", "UNSAFE CONTENT"))
e2e("compare.json: off-allowlist url", compare_mut(lambda d: d["courses"][0].update(url="https://evil.example/")), ("compare.json", "link_hosts.json"))
e2e("compare.json: </script> in a string is inert",
    compare_mut(lambda d: d["decks"][0].update(name="X</script><script>alert(1)</script>")), None,
    lambda dst: [f for f in (dst / "compare").glob("*.html") if "<script>alert(1)" in f.read_text() or "</script><script>" in f.read_text()])


def landing_mut(dst):
    p = dst / "landing/mcat-1a.json"
    d = json.loads(p.read_text())
    d["hook"] = "<script>alert(1)</script>"
    p.write_text(json.dumps(d))


e2e("landing: script in hook", landing_mut, ("mcat-1a.json",))


def sample_mut(dst):
    p = dst / "content/packs/1a-amino-acids-proteins/sample.json"
    d = json.loads(p.read_text())
    d["cards"][0]["src"] = "javascript:alert(1)"
    p.write_text(json.dumps(d))


e2e("sample.json: javascript src", sample_mut, ("sample.json", "UNSAFE CONTENT"))

print("\n%d failed" % len(fails) if fails else "\nall build safety checks passed")
sys.exit(1 if fails else 0)

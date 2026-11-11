"""Build-time safety rules for content that reaches HTML. Stdlib only.

Content (notes, practice pages, landing and compare JSON, catalog copy) is written by automated agents, so the
build itself must be safe whoever writes it. This module is the one place the rules live:

  check_link(url)   https URL on the host allowlist (data/link_hosts.json) or a site-relative path
  check_asset(src)  local image path only (png/jpg/webp/gif/svg/avif), never a URL
  check_json_urls() walk a JSON document, apply the rules to every URL field
  json_script()     JSON for an inline <script>: no </script>, <!-- or <script sequence can survive
  js_str()          one JS string literal for an inline <script>

A violation raises UnsafeContent (a SystemExit, so an unhandled one prints the message and fails the build).
"""
import json, re
from pathlib import Path
from urllib.parse import urlsplit

ROOT = Path(__file__).parent


class UnsafeContent(SystemExit):
    pass


_HOSTS = None


def hosts():
    global _HOSTS
    if _HOSTS is None:
        _HOSTS = frozenset(h.lower() for h in json.loads((ROOT / "data" / "link_hosts.json").read_text())["hosts"])
    return _HOSTS


_RULES = None


def _rules():
    global _RULES
    if _RULES is None:
        _RULES = {h.lower(): frozenset(p.rstrip("/") for p in ps) for h, ps in json.loads((ROOT / "data" / "link_hosts.json").read_text()).get("path_exact", {}).items()}
    return _RULES


_BAD_CHARS = re.compile(r"[\x00-\x20\x7f-\x9f\\<>\"'`]")
_SCHEME = re.compile(r"^[A-Za-z][A-Za-z0-9+.\-]*:")
_ASSET = re.compile(r"/?[A-Za-z0-9_][A-Za-z0-9_./\-]*\.(?:png|jpe?g|webp|gif|svg|avif)", re.I)


_CHECKOUT_HOSTS = ("buy.polar.sh", "polar.sh")


def check_link(url, where="link", catalog=False):
    """Return url if it is an allowed link, else raise UnsafeContent. `where` names the file and line for the message.
    catalog=True is for the catalog's own checkout_url fields: only there may buy.polar.sh appear."""
    u = url if isinstance(url, str) else ""
    if not u or _BAD_CHARS.search(u):
        raise UnsafeContent(f"UNSAFE CONTENT: {where}: URL {url!r} is empty or has a space, control, quote, angle bracket or backslash")
    if u.startswith("//"):
        raise UnsafeContent(f"UNSAFE CONTENT: {where}: protocol-relative URL {url!r} is not allowed")
    if _SCHEME.match(u):
        if not u.lower().startswith("https://"):
            raise UnsafeContent(f"UNSAFE CONTENT: {where}: URL {url!r} must be https or a site-relative path (no javascript:, data:, vbscript:, http: or other schemes)")
        try:
            parts = urlsplit(u)
            host, port = (parts.hostname or "").lower(), parts.port
        except ValueError:
            raise UnsafeContent(f"UNSAFE CONTENT: {where}: URL {url!r} does not parse")
        if "@" in parts.netloc or port not in (None, 443):
            raise UnsafeContent(f"UNSAFE CONTENT: {where}: URL {url!r} has credentials or a port")
        if host.endswith(_CHECKOUT_HOSTS) and not (catalog and host == "buy.polar.sh"):
            raise UnsafeContent(f"UNSAFE CONTENT: {where}: {host} links are checkout links and may only come from the catalog's checkout_url fields (URL {url!r})")
        rules = _rules().get(host)
        if rules is not None and parts.path.rstrip("/") not in rules:
            raise UnsafeContent(f"UNSAFE CONTENT: {where}: path {parts.path!r} on {host} is not in data/link_hosts.json path_exact (URL {url!r})")
        if host not in hosts():
            raise UnsafeContent(f"UNSAFE CONTENT: {where}: host {host!r} is not in data/link_hosts.json (URL {url!r})")
    return u


def check_asset(src, where="image"):
    """Return src if it is a local image path (no scheme, no '..'), else raise UnsafeContent."""
    s = src if isinstance(src, str) else ""
    if not _ASSET.fullmatch(s) or ".." in s.split("/") or "//" in s:
        raise UnsafeContent(f"UNSAFE CONTENT: {where}: image source {src!r} must be a local asset path ending in png/jpg/webp/gif/svg/avif (no URL, no '..')")
    if s.lower().endswith(".svg"):
        check_svg(s, where)
    return s


_SVG_BAD = re.compile(r"<\s*(?:script|foreignObject|iframe|object|embed|use|image|a|style|animate|set)\b|\bon[a-z]+\s*=|javascript:|data:|<!(?:ENTITY|DOCTYPE)|@import|(?:xlink:)?href\s*=\s*[\"']?(?!#)|url\(\s*[\"']?(?!#)|https?:|//", re.I)


def check_svg(rel, where):
    """An SVG is served from our origin and can run script, so only an SVG file already in the repo is allowed, and it
    must be plain shapes: no script, event handlers, foreignObject, style, links or any external reference."""
    f = (ROOT / rel.lstrip("/")).resolve()
    if ROOT not in f.parents or not f.is_file():
        raise UnsafeContent(f"UNSAFE CONTENT: {where}: SVG {rel!r} is not a file already in the repo")
    m = _SVG_BAD.search(f.read_text(errors="replace").replace("http://www.w3.org/2000/svg", "").replace("http://www.w3.org/1999/xlink", ""))
    if m:
        raise UnsafeContent(f"UNSAFE CONTENT: {where}: SVG {rel!r} contains {m.group(0)!r} (script, handler, link or external reference)")


_URL_KEY = re.compile(r"(?:^|_)(?:url|href|base)$", re.I)
_SCHEMEISH = re.compile(r"^\s*(?:javascript|data|vbscript|file|blob):|^\s*//", re.I)


def check_json_urls(obj, where, path=""):
    """Apply the URL rules to a loaded JSON document. Fields named url/href/*_url/*_base must be allowed links (empty
    means 'not set'), fields named src must be local asset paths, and no string anywhere may start with a script or
    data scheme or '//'."""
    if isinstance(obj, dict):
        for k, v in obj.items():
            p = f"{path}.{k}"
            if isinstance(v, str):
                if k == "src":
                    check_asset(v, f"{where} {p}")
                elif _URL_KEY.search(k):
                    if v:
                        check_link(v, f"{where} {p}", catalog=(k == "checkout_url"))
                elif _SCHEMEISH.search(v):
                    raise UnsafeContent(f"UNSAFE CONTENT: {where} {p}: value {v[:60]!r} starts with a script/data scheme or '//'")
            else:
                check_json_urls(v, where, p)
    elif isinstance(obj, list):
        for i, v in enumerate(obj):
            if isinstance(v, str):
                if _SCHEMEISH.search(v):
                    raise UnsafeContent(f"UNSAFE CONTENT: {where} {path}[{i}]: value {v[:60]!r} starts with a script/data scheme or '//'")
            else:
                check_json_urls(v, where, f"{path}[{i}]")


def _script_safe(s):
    s = s.replace("</", "<\\/")
    return re.sub(r"<(?=!--|script)", "\\\\u003c", s, flags=re.I)


def json_script(obj, **kw):
    """json.dumps for an inline <script> or JSON-LD block. Escapes '</' (same output as before), plus '<!--' and
    '<script' (script-data double-escape), so no string in the data can end or confuse the script element."""
    kw.setdefault("ensure_ascii", False)
    return _script_safe(json.dumps(obj, **kw)).replace("\u2028", "\\u2028").replace("\u2029", "\\u2029")


def js_str(v):
    """One JS string literal for an inline <script> (ASCII-only json.dumps plus the script-data escapes)."""
    return _script_safe(json.dumps(v))


JSON_GLOBS = ("site.json", "experiments.json", "ls_variants.json", "data/*.json", "landing/*.json", "content/**/*.json")


def validate_content_json(root=ROOT):
    """check_json_urls on every JSON file the build reads. Called at the start of build.py."""
    root = Path(root)
    n = 0
    for pat in JSON_GLOBS:
        for f in sorted(root.glob(pat)):
            if f.name == "link_hosts.json":
                continue
            try:
                doc = json.loads(f.read_text())
            except ValueError as e:
                raise UnsafeContent(f"{f.relative_to(root)}: not valid JSON ({e})")
            check_json_urls(doc, str(f.relative_to(root)))
            n += 1
    return n

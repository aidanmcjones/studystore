"""Shared cache-busting helper: append ?v=<sha256[:10]> to every local CSS/JS URL in built HTML."""
import re, hashlib
from pathlib import Path

ROOT = Path(__file__).resolve().parent
_cache = {}
_PAT = re.compile(r'''((?:href|src)=["'])([^"':?#]*?assets/[^"'?#]+\.(?:css|js))(["'])''')

def _hash(rel):
    if rel not in _cache:
        f = ROOT / rel
        _cache[rel] = hashlib.sha256(f.read_bytes()).hexdigest()[:10] if f.is_file() else None
    return _cache[rel]

def version_assets(page):
    def sub(m):
        path = m.group(2)
        rel = path[path.index("assets/"):]
        h = _hash(rel)
        return m.group(0) if h is None else f"{m.group(1)}{path}?v={h}{m.group(3)}"
    return _PAT.sub(sub, page)

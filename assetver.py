"""Shared cache-busting helper: append ?v=<sha256[:10]> to every local asset URL (css, js, images) in built HTML."""
import re, hashlib
from pathlib import Path

ROOT = Path(__file__).resolve().parent
_cache = {}
_PAT = re.compile(r"(?<![\w-])assets/[\w./%-]+?\.(?:css|js|png|jpe?g|webp|svg|gif|ico)(?![\w?.-])(?!</code>)")

def _hash(rel):
    if rel not in _cache:
        f = ROOT / rel
        _cache[rel] = hashlib.sha256(f.read_bytes()).hexdigest()[:10] if f.is_file() else None
    return _cache[rel]

def version_assets(page):
    """Version every local assets/ path (attrs, srcset, meta og/twitter, inline JSON, data-*)."""
    def sub(m):
        h = _hash(m.group(0))
        return m.group(0) if h is None else f"{m.group(0)}?v={h}"
    return _PAT.sub(sub, page)

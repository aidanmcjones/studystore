"""Tiny Markdown-to-HTML converter for StudyStore notes. Stdlib only, original code.

Supported: ## / ### headings, paragraphs, bullet and numbered lists, pipe tables,
blockquotes, horizontal rules, fenced code, images (![alt](path "caption")),
**bold**, *italic*, `code`, [links](url), and <sub>/<sup> tags.
Quiz block:  :::quiz  with  Q: ...  /  A: ...  lines, closed by  :::
"""
import re, html

def slugify(t):
    return re.sub(r"[^a-z0-9]+", "-", re.sub(r"<[^>]+>", "", t).lower()).strip("-")

def parse_frontmatter(text):
    m = re.match(r"---\n(.*?)\n---\n(.*)", text, re.S)
    if not m:
        raise ValueError("missing frontmatter")
    meta = {}
    for line in m.group(1).splitlines():
        if ":" in line and not line.startswith("#"):
            k, v = line.split(":", 1)
            meta[k.strip()] = v.strip().strip('"')
    return meta, m.group(2)

def extract_quiz(text):
    m = re.search(r"^:::quiz\n(.*?)^:::\s*$", text, re.S | re.M)
    if not m:
        return text, []
    quiz, cur = [], None
    for line in m.group(1).splitlines():
        if line.startswith("Q:"):
            cur = [line[2:].strip(), ""]
            quiz.append(cur)
        elif line.startswith("A:") and cur:
            cur[1] = line[2:].strip()
        elif cur and line.strip():
            cur[1] += "\n" + line
    return text[:m.start()] + text[m.end():], [tuple(q) for q in quiz]

_KEEP = ("sub", "sup")

def inline(t):
    codes = []
    def stash(m):
        codes.append(f"<code>{html.escape(m.group(1))}</code>")
        return f"\x00{len(codes)-1}\x00"
    t = re.sub(r"`([^`]+)`", stash, t)
    t = html.escape(t, quote=False)
    t = re.sub(r"&amp;(#\d+|#x[0-9a-fA-F]+|[a-zA-Z]+);", r"&\1;", t)
    for tag in _KEEP:
        t = t.replace(f"&lt;{tag}&gt;", f"<{tag}>").replace(f"&lt;/{tag}&gt;", f"</{tag}>")
    t = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", t)
    t = re.sub(r"(?<![\w*])\*(?!\s)(.+?)(?<!\s)\*(?![\w*])", r"<em>\1</em>", t)
    t = re.sub(r"\[([^\]]+)\]\(([^)\s]+)\)", lambda m: f'<a href="{m.group(2)}">{m.group(1)}</a>', t)
    return re.sub(r"\x00(\d+)\x00", lambda m: codes[int(m.group(1))], t)

def _img(line, prefix):
    m = re.fullmatch(r'!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)', line.strip())
    if not m:
        return None
    alt, src, cap = m.groups()
    if not re.match(r"https?:", src):
        src = prefix + src
    c = f"<figcaption>{inline(cap)}</figcaption>" if cap else ""
    return f'<figure><img src="{src}" alt="{html.escape(alt)}" loading="lazy">{c}</figure>'

def convert(text, asset_prefix=""):
    lines = text.strip("\n").splitlines()
    out, i, n = [], 0, len(lines)
    while i < n:
        ln = lines[i]
        if not ln.strip():
            i += 1; continue
        if ln.startswith("```"):
            j = i + 1; buf = []
            while j < n and not lines[j].startswith("```"):
                buf.append(lines[j]); j += 1
            out.append("<pre><code>" + html.escape("\n".join(buf)) + "</code></pre>")
            i = j + 1; continue
        m = re.match(r"(#{2,4})\s+(.*)", ln)
        if m:
            lvl = len(m.group(1)); txt = inline(m.group(2))
            out.append(f'<h{lvl} id="{slugify(txt)}">{txt}</h{lvl}>'); i += 1; continue
        if re.fullmatch(r"-{3,}", ln.strip()):
            out.append("<hr>"); i += 1; continue
        f = _img(ln, asset_prefix)
        if f:
            out.append(f); i += 1; continue
        if ln.startswith(">"):
            buf = []
            while i < n and lines[i].startswith(">"):
                buf.append(lines[i].lstrip("> ")); i += 1
            out.append("<blockquote>" + convert("\n".join(buf), asset_prefix) + "</blockquote>"); continue
        if ln.startswith("|") and i + 1 < n and re.match(r"\|[\s:|-]+\|?\s*$", lines[i + 1]):
            rows = []
            while i < n and lines[i].startswith("|"):
                rows.append([c.strip() for c in lines[i].strip().strip("|").split("|")]); i += 1
            head, body = rows[0], rows[2:]
            t = "<div class=\"tablewrap\"><table><thead><tr>" + "".join(f"<th>{inline(c)}</th>" for c in head) + "</tr></thead><tbody>"
            for r in body:
                t += "<tr>" + "".join(f"<td>{inline(c)}</td>" for c in r) + "</tr>"
            out.append(t + "</tbody></table></div>"); continue
        m = re.match(r"(\s*)([-*]|\d+\.)\s+", ln)
        if m:
            ordered = m.group(2)[0].isdigit()
            items = []
            while i < n and re.match(r"([-*]|\d+\.)\s+", lines[i]):
                item = re.sub(r"^([-*]|\d+\.)\s+", "", lines[i]); i += 1
                while i < n and lines[i].startswith("  ") and lines[i].strip():
                    item += " " + lines[i].strip(); i += 1
                items.append(item)
            tag = "ol" if ordered else "ul"
            out.append(f"<{tag}>" + "".join(f"<li>{inline(x)}</li>" for x in items) + f"</{tag}>"); continue
        buf = []
        while i < n and lines[i].strip() and not re.match(r"(#{2,4}\s|>|\||```|([-*]|\d+\.)\s|!\[)", lines[i]):
            buf.append(lines[i].strip()); i += 1
        if not buf:  # safety against infinite loop
            buf.append(lines[i].strip()); i += 1
        out.append("<p>" + inline(" ".join(buf)) + "</p>")
    return "\n".join(out)

#!/usr/bin/env python3
"""Render templates/*.html into the site using site.json. Stdlib only.

Usage: python3 build.py
Placeholders in templates:
  {{root}} relative path to site root, {{site_name}}, {{disclaimer}}, {{contact}},
  {{updated}}, {{base_url}}, {{buy:SLUG}}, {{price:SLUG}}, {{title:SLUG}},
  any other top-level site.json string key.
"""
import json, re, html, math
from pathlib import Path
from mdlite import convert, parse_frontmatter, extract_quiz
import products_build as PB  # catalog product/bundle/thanks pages (G01)

ROOT = Path(__file__).parent
site = json.loads((ROOT / "site.json").read_text())
products = PB.lookup(site)  # products + bundles + retired-slug aliases

# (template, output, title, description, noindex)
LATEST_NOTES = ""

PAGES = [
    ("index.html", "index.html", "StudyStore | Original MCAT study packs",
     "Original, high-yield MCAT study packs: an Anki deck, illustrated study guide, cheat sheet and practice questions for each MCAT content category.", False),
    ("refund.html", "refund.html", "Refund Policy | StudyStore",
     "StudyStore offers a 14-day, no-questions-asked refund on every digital pack.", False),
    ("terms.html", "terms.html", "Terms of Sale | StudyStore",
     "Terms of sale for StudyStore digital study packs, sold through Lemon Squeezy as merchant of record.", False),
    ("privacy.html", "privacy.html", "Privacy Policy | StudyStore",
     "StudyStore sets no cookies and collects no personal data. Anonymous first-party page and click counts only. Payments are handled by Lemon Squeezy.", False),
    ("404.html", "404.html", "Page not found | StudyStore", "Page not found.", True),
]

def contact():
    e = site.get("support_email")
    if e:
        return f'Contact: <a href="mailto:{html.escape(e)}">{html.escape(e)}</a>'
    return "Support email launching this week."

def buy(slug, cls="btn", root=""):
    return PB.buy(products, slug, cls, root)

def render(text, root):
    def sub(m):
        k = m.group(1).strip()
        if k == "root": return root
        if k == "contact": return contact()
        if ":" in k:
            kind, slug = k.split(":", 1)
            if kind == "buy": return buy(slug, root=root)
            if kind == "buyghost": return buy(slug, "btn ghost", root=root)
            if kind == "price": return products[slug]["price"]
            if kind == "title": return html.escape(products[slug]["title"])
        if k == "latest_notes": return LATEST_NOTES
        v = PB.placeholder(site, products, k, root)  # catalog data: pack_grid, feat:*, stat:*
        if v is not None: return v
        if k in site and isinstance(site[k], str): return site[k]
        raise KeyError(f"unknown placeholder {k}")
    return re.sub(r"\{\{\s*([^}]+?)\s*\}\}", sub, text)

base = (ROOT / "templates" / "base.html").read_text()
urls = []  # (url, lastmod or None)
BASE = site["base_url"]
DEFAULT_OG = BASE + "/assets/img/cheatsheet-p1.png"

def emit(out, title, desc, body, noindex=False, og_image=DEFAULT_OG, og_type="website",
         head_extra="", lastmod=None):
    root = "../" * out.count("/")
    page = base.replace("{{content}}", body)
    page = page.replace("{{page_title}}", html.escape(title)).replace("{{page_desc}}", html.escape(desc))
    page = page.replace("{{page_url}}", f"{BASE}/{out}" if out != "index.html" else BASE + "/")
    page = page.replace("{{robots}}", '<meta name="robots" content="noindex">' if noindex else "")
    page = page.replace("{{og_image}}", og_image).replace("{{og_type}}", og_type)
    page = page.replace("{{head_extra}}", head_extra)
    if noindex:
        root = "/studystore/" if BASE.endswith("/studystore") else "/"
    page = render(page, root)
    dest = ROOT / out
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text(page)
    if not noindex:
        urls.append((BASE + "/" + ("" if out == "index.html" else out), lastmod))

# ---------- notes ----------
def load_notes():
    notes = []
    for f in sorted((ROOT / "content" / "notes").glob("*.md")):
        meta, text = parse_frontmatter(f.read_text())
        slug = f.stem
        for req in ("title", "description", "product", "published"):
            if req not in meta:
                raise SystemExit(f"{f.name}: missing frontmatter '{req}'")
        if meta["product"] not in products:
            raise SystemExit(f"{f.name}: unknown product {meta['product']}")
        body_md, quiz = extract_quiz(text)
        if len(quiz) != 5:
            raise SystemExit(f"{f.name}: need exactly 5 quiz questions, found {len(quiz)}")
        meta["related"] = [x.strip() for x in meta.get("related", "").split(",") if x.strip()]
        words = len(re.findall(r"\w+", body_md))
        notes.append(dict(slug=slug, meta=meta, md=body_md, quiz=quiz, words=words))
    slugs = {n["slug"] for n in notes}
    for n in notes:
        for r in n["meta"]["related"]:
            if r not in slugs:
                raise SystemExit(f"{n['slug']}: related note {r} does not exist")
    notes.sort(key=lambda n: (n["meta"]["published"], n["slug"]), reverse=True)
    return notes

def esc_braces(t):
    return t.replace("{{", "&#123;&#123;")

def note_card(n, prefix, imgprefix):
    m = n["meta"]
    thumb = f'thumb-{n["slug"]}.webp'
    src = thumb if (ROOT / "assets" / "notes" / thumb).exists() else f'og-{n["slug"]}.png'
    return (f'<article class="notecard"><a href="{prefix}{n["slug"]}.html" tabindex="-1" aria-hidden="true">'
            f'<img src="{imgprefix}{src}" alt="" loading="lazy" width="1200" height="630"></a>'
            f'<div><h3><a href="{prefix}{n["slug"]}.html">{html.escape(m["title"])}</a></h3>'
            f'<p class="meta">{html.escape(m["description"])}</p></div></article>')

def build_note(n, all_notes):
    m, slug = n["meta"], n["slug"]
    out = f"notes/{slug}.html"
    p = products[m["product"]]
    body_html = convert(esc_braces(n["md"]), asset_prefix="{{root}}")
    quiz_html = "".join(
        f'<details class="q"><summary>{i}. {convert_inline(q)}</summary><div>{convert(esc_braces(a))}</div></details>'
        for i, (q, a) in enumerate(n["quiz"], 1))
    rel = "".join(f'<li><a href="{r}.html">{html.escape(next(x for x in all_notes if x["slug"]==r)["meta"]["title"])}</a></li>'
                  for r in m["related"])
    mins = max(1, round(n["words"] / 220))
    img = f'{BASE}/assets/notes/og-{slug}.png'
    page_url = f"{BASE}/{out}"
    mod = m.get("updated", m["published"])
    article = {"@context": "https://schema.org", "@type": "Article", "headline": m["title"],
               "description": m["description"], "image": img, "datePublished": m["published"],
               "dateModified": mod, "wordCount": n["words"], "inLanguage": "en",
               "mainEntityOfPage": page_url,
               "author": {"@type": "Organization", "name": "StudyStore", "url": BASE + "/"},
               "publisher": {"@type": "Organization", "name": "StudyStore", "url": BASE + "/"}}
    faq = {"@context": "https://schema.org", "@type": "FAQPage",
           "mainEntity": [{"@type": "Question", "name": strip_tags(convert_inline(q)),
                           "acceptedAnswer": {"@type": "Answer", "text": strip_tags(convert(a))}}
                          for q, a in n["quiz"]]}
    ld = "".join(f'<script type="application/ld+json">{json.dumps(o, ensure_ascii=False).replace("</", "<\\/")}</script>\n'
                 for o in (article, faq))
    cta = (f'<aside class="cta"><div><strong>Want this as spaced-repetition cards?</strong>'
           f'<p>{{{{title:{m["product"]}}}}} is a {{{{price:{m["product"]}}}}} pack with original Anki cards and a printable cheat sheet. '
           f'<a href="{{{{root}}}}products/{m["product"]}.html">See what is inside</a>.</p></div>{{{{buy:{m["product"]}}}}}</aside>')
    body = f"""<article class="note wrap narrow">
<p class="eyebrow">Free MCAT study note</p>
<h1>{html.escape(m["title"])}</h1>
<p class="meta">By StudyStore &middot; Published {m["published"]} &middot; {mins} min read &middot; {n["words"]} words</p>
<div class="prose">
{body_html}
</div>
{cta}
<h2 id="quiz">Check yourself: 5-question mini-quiz</h2>
<p class="meta">Try each question first, then click it to reveal the answer.</p>
<div class="quiz">{quiz_html}</div>
<h2>Keep studying</h2>
<ul>{rel}<li><a href="index.html">All free notes</a></li></ul>
{cta}
<p class="meta">Written by StudyStore from standard scientific facts. Study aid only. Always check values against the reference your exam provides.</p>
</article>"""
    emit(out, f'{m["title"]} | StudyStore Notes', m["description"], body, og_image=img,
         og_type="article", head_extra=ld, lastmod=mod)

def convert_inline(t):
    from mdlite import inline
    return inline(t)

def strip_tags(t):
    return html.unescape(re.sub(r"<[^>]+>", "", t)).strip()

notes = load_notes()
LATEST_NOTES = "".join(note_card(n, "notes/", "assets/notes/") for n in notes[:6])
for n in notes:
    build_note(n, notes)
idx = f"""<div class="wrap hero" style="padding-bottom:24px">
<div class="eyebrow">Free MCAT study notes</div>
<h1>Notes</h1>
<p class="lead">Plain-language MCAT biochemistry explainers, each with an original diagram and a 5-question mini-quiz. Free, no signup.</p>
</div>
<section><div class="wrap"><div class="notegrid">{"".join(note_card(n, "", "../assets/notes/") for n in notes)}</div></div></section>"""
emit("notes/index.html", "Free MCAT Study Notes | StudyStore",
     "Free MCAT biochemistry study notes with original diagrams and mini-quizzes: amino acids, enzyme kinetics, inhibition, protein structure, and more.",
     idx, lastmod=max((n["meta"]["published"] for n in notes), default=None))

# ---------- catalog product pages ----------
PB.build_all(site, products, emit)
PB.write_redirects(site)

# ---------- regular pages ----------
for tpl, out, title, desc, noindex in PAGES:
    body = (ROOT / "templates" / tpl).read_text()
    emit(out, title, desc, body, noindex=noindex)

# ---------- free tools (isolated in build_tools.py) ----------
import build_tools
build_tools.build(emit, site, products, {n["slug"]: n["meta"]["title"] for n in notes})

sm = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
for u, lm in urls:
    sm.append(f"  <url><loc>{u}</loc>" + (f"<lastmod>{lm}</lastmod>" if lm else "") + "</url>")
sm += ["</urlset>", ""]
(ROOT / "sitemap.xml").write_text("\n".join(sm))
(ROOT / "robots.txt").write_text(f"User-agent: *\nAllow: /\n\nSitemap: {site['base_url']}/sitemap.xml\n")
print(f"built {len(PAGES)} pages + {len(notes)} notes")

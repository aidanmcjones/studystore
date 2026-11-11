#!/usr/bin/env python3
"""Render templates/*.html into the site using site.json. Stdlib only.

Usage: python3 build.py
Placeholders in templates:
  {{root}} relative path to site root, {{site_name}}, {{disclaimer}}, {{contact}},
  {{updated}}, {{base_url}}, {{buy:SLUG}}, {{price:SLUG}}, {{title:SLUG}},
  {{waitlist}} (launch list box, waitlist.py), {{signup}} (compact sampler opt-in, waitlist.py), {{merchant}} {{orders_url}} {{orders_label}} {{refund_how}} (checkout provider),
  any other top-level site.json string key.
"""
import json, re, html, math
from pathlib import Path
from mdlite import convert, parse_frontmatter, extract_quiz
import qbank_downloads as QD
import qbank_shots as QS
import products_build as PB  # catalog product/bundle/thanks pages (G01)
import practice_build
from assetver import version_assets
import waitlist

ROOT = Path(__file__).parent
site = json.loads((ROOT / "site.json").read_text())
import datetime as _dt
_le = _dt.datetime.strptime(site["launch_end"], "%Y-%m-%dT%H:%M:%SZ")  # single source for the LAUNCH50 end (matches the Polar discount)
site["launch_end_label"] = f"{_le:%b} {_le.day}, {_le.year}"
LAUNCHBAR = (ROOT / "templates" / "launchbar.html").read_text() if _dt.datetime.now(_dt.timezone.utc).replace(tzinfo=None) < _le else ""  # offer bar + scripts only before launch_end
PB.configure(site)  # checkout provider (polar by default) and {{merchant}} / {{orders_url}} copy
products = PB.lookup(site)  # products + bundles + retired-slug aliases

# (template, output, title, description, noindex)
LATEST_NOTES = ""

PAGES = [
    ("index.html", "index.html", "StudyStore | Original MCAT study packs",
     "Original, high-yield MCAT study packs: an Anki deck, illustrated study guide, cheat sheet and practice questions for each MCAT content category.", False),
    ("refund.html", "refund.html", "Refund Policy | StudyStore",
     "StudyStore offers a 14-day, no-questions-asked refund on every digital pack.", False),
    ("terms.html", "terms.html", "Terms of Sale | StudyStore",
     f"Terms of sale for StudyStore digital study packs, sold through {site['merchant']} as merchant of record.", False),
    ("privacy.html", "privacy.html", "Privacy Policy | StudyStore",
     "StudyStore sets no cookies. Anonymous first-party page and click counts, and your email only if you join the email list. Payments by " + site["merchant"] + ".", False),
    ("rangecheck_privacy.html", "rangecheck-privacy.html", "RangeCheck Privacy Policy | StudyStore",
     "Privacy policy for the RangeCheck browser extension: what it reads on LinkedIn job pages, what it sends, and what it stores.", False),
    ("rangecheck_support.html", "rangecheck-support.html", "RangeCheck Support | StudyStore",
     "Help for the RangeCheck browser extension: how it works on LinkedIn job pages, why a job has no verdict, free checks, Pro license keys and refunds.", False),
    ("support.html", "support.html", "Support | StudyStore",
     "Help with StudyStore MCAT pack downloads, refunds and problem reports, and support for the RangeCheck browser extension.", False),
    ("qbank.html", "binder.html", "Binder: flashcard app with deadline-aware scheduling | StudyStore",
     "Binder shows each flashcard right before you'd forget it, so you review less and remember more. One window, opens your existing deck files. $29 one-time.", False),
    ("qbank_source.html", "binder/source.html", "Binder source code (AGPL-3) | StudyStore",
     "Source code for every Binder release under the GNU AGPL-3.0. The full license and credits are inside the tarball and in the app's licenses view.", True),
    ("refund_confirm.html", "refund-confirm/index.html", "Confirm your refund | StudyStore", "One-time refund confirmation for StudyStore orders.", True),
    ("404.html", "404.html", "Page not found | StudyStore", "Page not found.", True),
    ("report.html", "report.html", "Report a problem or suggest something | StudyStore",
     "Tell StudyStore about a broken link, a wrong answer, a typo or a display problem, or suggest a topic.", True),
    ("owner.html", "owner.html", "Owner sign-in | StudyStore", "Owner sign-in.", True),
    ("admin_reports.html", "admin/reports.html", "Reports | StudyStore", "Owner report review.", True),
    ("admin_subscribers.html", "admin/subscribers.html", "Subscribers | StudyStore", "Owner launch list stats.", True),
    ("admin_marketing.html", "admin/marketing.html", "Marketing | StudyStore", "Owner marketing outbox.", True),
    ("admin_launch.html", "admin/launch.html", "Launch | StudyStore", "Owner launch switch.", True),
]

def contact():
    e = site.get("support_email")
    if e:
        return f'Contact: <a href="mailto:{html.escape(e)}">{html.escape(e)}</a>'
    return "Support email launching this week."

def buy(slug, cls="btn", root=""):
    return PB.buy(products, slug, cls, root)

# Arm studystore-checkout-cta-a: the CTA shows only on the top pages by analytics_pageviews (2026-11-03).
CTA_ARM_PAGES = {"notes/enantiomers-vs-diastereomers", "practice/8c-status-roles-groups-bureaucracy-dramaturgy",
                 "practice/5d-carbohydrates-sugar-chemistry-lipids"}
# Pages added 2026-11-03 for the outbox day-queue and social sessions; their Polar link carries utm_source=social-cta.
SOCIAL_CTA_PAGES = [
   "notes/bottom-up-vs-top-down-processing",
   "notes/how-to-use-anki-for-the-mcat",
   "practice/1a-michaelis-menten-kinetics-lineweaver-burk",
   "practice/1b-translation-genetic-code-protein-targeting",
   "practice/1c-mendelian-genetics-pedigrees-linkage",
   "practice/2a-membrane-transport-osmosis-tonicity",
   "practice/2a-nernst-equation-resting-membrane-potential",
   "practice/2a-organelles-protein-sorting-cytoskeleton",
   "practice/3a-endocrine-hormones-feedback-axes",
   "practice/3b-immune-system-innate-adaptive-hypersensitivity",
   "practice/3b-kidney-nephron-filtration-acid-base",
   "practice/4a-work-energy-power-conservation",
   "practice/4b-ideal-gas-law-dalton-graham-henry",
   "practice/4e-nuclear-decay-half-life-binding-energy",
   "practice/4e-periodic-trends-electron-configuration",
   "practice/6b-sleep-stages-circadian-rhythms-dreaming",
   "practice/6c-theories-of-emotion-limbic-system-arousal",
   "practice/9a-sociological-theories-functionalism-conflict-interactionism"
  ]
CTA_ARM_PAGES |= set(SOCIAL_CTA_PAGES)
practice_build.CTA_ARM_PAGES = CTA_ARM_PAGES
practice_build.SECTION_OF = {p["aamc"]: p["section_name"] for p in site["products"]}
practice_build.SOCIAL_CTA_PAGES = set(SOCIAL_CTA_PAGES)

def topbuy(slug, root=""):
    """Compact above-the-fold checkout CTA: visible price and a Polar link tagged utm_source=site-cta (or social-cta via "slug:social-cta")."""
    src = "site-cta"
    parts = slug.split(":")
    preview = "preview" in parts[1:]
    parts = [x for x in parts if x != "preview"]
    slug = parts[0]
    if len(parts) > 1:
        src = parts[1]
    if slug == "feat":
        slug = PB.featured(site)["slug"]
    p = products[slug]
    if not PB.buyable(p):
        return ""
    btn = PB.buy(products, slug, "btn small")
    btn = btn.replace("?utm_source=site-cta", "?utm_source=" + src, 1)  # PB.buy already tags site-cta and data-track="cta"
    c = p.get("contents") or {}
    if c.get("cards"):
        inside = (f'{c["cards"]} Anki flashcards, {c.get("guide_pages")}-page study guide, {c.get("cheatsheet_pages")}-page cheat sheet '
                  f'and {c.get("questions")} practice questions')
    else:
        inside = "original Anki cards, a study guide and a printable cheat sheet"
    _c = ((PB.sample(slug) or {}).get("cards") or [None])[0] if preview else None
    prev = (f' <a href="{root}products/{slug}.html#preview" data-track="cta">Preview a sample card</a>.'
            if _c and (ROOT / _c["src"]).exists() else "")
    return (f'<aside class="cta cta-top"><div><strong>{html.escape(p["title"])}</strong>'
            f'<p>{html.escape(p["price"])} one-time, instant download, 14-day refund. Inside: {html.escape(inside)}. '
            f'<a href="{root}products/{slug}.html?utm_source=site-cta" data-track="cta">See what is inside</a>.{prev}</p></div>{btn}</aside>' + waitlist.capture(root))

def render(text, root):
    def sub(m):
        k = m.group(1).strip()
        if k == "root": return root
        if k == "contact": return contact()
        if ":" in k:
            kind, slug = k.split(":", 1)
            if kind == "buy": return buy(slug, root=root)
            if kind == "waitlist": return waitlist.box(root, launch=not PB.buyable(products[slug]))
            if kind == "topbuy": return topbuy(slug, root)
            if kind == "buyghost": return buy(slug, "btn ghost", root=root)
            if kind == "price": return products[slug]["price"]
            if kind == "title": return html.escape(products[slug]["title"])
        if k == "latest_notes": return LATEST_NOTES
        if k == "waitlist": return waitlist.box(root, launch=not PB.checkout_open(site))
        if k == "signup": return waitlist.signup(root)
        if k == "capture": return waitlist.capture(root)
        v = PB.placeholder(site, products, k, root)  # catalog data: pack_grid, feat:*, stat:*
        if v is not None: return v
        if k in site and isinstance(site[k], str): return site[k]
        raise KeyError(f"unknown placeholder {k}")
    return re.sub(r"\{\{\s*([^}]+?)\s*\}\}", sub, text)

base = (ROOT / "templates" / "base.html").read_text()
urls = []  # (url, lastmod or None)
BASE = site["base_url"]
DEFAULT_OG = BASE + "/assets/img/cheatsheet-p1.png"

def _iso(d):
    import datetime
    for fmt in ("%Y-%m-%d", "%B %d, %Y"):
        try:
            return datetime.datetime.strptime(str(d), fmt).date().isoformat()
        except ValueError:
            pass
    return None

DEFAULT_LASTMOD = _iso(site.get("updated"))  # sitemap lastmod for pages without their own date
TITLE_MAX, DESC_MAX = 65, 160
_seen_titles, _seen_descs = {}, {}

def seo_title(t):
    """Drop the ' | StudyStore...' suffix when the full title would be truncated in results."""
    if len(t) > TITLE_MAX and " | StudyStore" in t:
        t = t.rsplit(" | StudyStore", 1)[0]
    return t

def seo_desc(d):
    """Cap meta descriptions at DESC_MAX characters on a word boundary."""
    if len(d) <= DESC_MAX:
        return d
    return d[:DESC_MAX - 3].rsplit(" ", 1)[0].rstrip(",;:.") + "..."

_ABS_HTML = re.compile(re.escape(BASE) + r"(/[A-Za-z0-9_\-./]*?\.html)(?=[\"'#?\s<\\]|$)")

def clean_url(u):
    """The host 308-redirects /x.html to /x and /d/index.html to /d/, so canonical, og:url, JSON-LD and
    sitemap URLs use the final form; a canonical that points at a redirect splits Search signals."""
    if u.endswith("/index.html"):
        return u[:-len("index.html")]
    return u[:-len(".html")] if u.endswith(".html") else u

def clean_abs_urls(text):
    """clean_url on every absolute same-site .html URL in a page (relative links are left alone)."""
    return _ABS_HTML.sub(lambda m: BASE + clean_url(m.group(1)), text)

_REL_HTML = re.compile(r'(href=")((?![a-z][a-z0-9+.-]*:|//)[^"#?]*?)\.html([#?][^"]*)?(?=")', re.I)

def clean_rel_links(text):
    """Point internal relative and root-relative .html hrefs at the final (non-redirecting) URL."""
    def sub(m):
        path, tail = m.group(2), m.group(3) or ""
        if path == "index" or path.endswith("/index"):
            path = path[:-len("index")] or "./"
        return m.group(1) + path + tail
    return _REL_HTML.sub(sub, text)

def ld_json(*objs):
    return "".join(f'<script type="application/ld+json">{json.dumps(o, ensure_ascii=False).replace("</", "<\\/")}</script>\n'
                   for o in objs)

def breadcrumbs(*pairs):
    """BreadcrumbList from (name, absolute url) pairs; Home is prepended."""
    items = [("StudyStore", BASE + "/")] + list(pairs)
    return {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
        {"@type": "ListItem", "position": i, "name": n, "item": u} for i, (n, u) in enumerate(items, 1)]}

def with_crumbs(body, head_extra):
    """Visible breadcrumb nav from the page's BreadcrumbList JSON-LD (one source for both), unless the body has its own."""
    if 'class="crumbs' in body or '"BreadcrumbList"' not in head_extra:
        return body
    m = re.search(r'<script type="application/ld\+json">(\{[^<]*"@type": "BreadcrumbList"[^<]*\})</script>', head_extra)
    if not m:
        return body
    items = json.loads(m.group(1))["itemListElement"]
    parts = []
    for i, it in enumerate(items):
        name = html.escape(it["name"])
        parts.append(f'<span aria-current="page">{name}</span>' if i == len(items) - 1 else f'<a href="{it["item"]}">{name}</a>')
    return f'<div class="wrap"><nav class="crumbs" aria-label="Breadcrumb">{" / ".join(parts)}</nav></div>\n' + body

def emit(out, title, desc, body, noindex=False, og_image=DEFAULT_OG, og_type="website",
         head_extra="", lastmod=None):
    root = "../" * out.count("/")
    title, desc = seo_title(title), seo_desc(desc)
    if not noindex:
        for seen, v, kind in ((_seen_titles, title, "title"), (_seen_descs, desc, "description")):
            if v in seen:
                print(f"SEO WARNING: duplicate {kind} on {out} and {seen[v]}: {v}")
            seen[v] = out
    body = with_crumbs(body, head_extra)
    page = base.replace("{{launchbar}}", LAUNCHBAR).replace("{{content}}", body)
    page = page.replace("{{page_title}}", html.escape(title)).replace("{{page_desc}}", html.escape(desc))
    page = page.replace("{{page_url}}", f"{BASE}/{out}" if out != "index.html" else BASE + "/")
    page = page.replace("{{robots}}", '<meta name="robots" content="noindex">' if noindex else "")
    if og_image == DEFAULT_OG:
        _k = re.sub(r"[^a-z0-9]+", "-", out[:-5].lower()).strip("-")
        _k = {"binder": "qbank"}.get(_k, _k)  # og image file keeps its old name until the images are replaced
        if (ROOT / "assets" / "og" / f"{_k}.png").exists():
            og_image = f"{BASE}/assets/og/{_k}.png"
    page = page.replace("{{og_image}}", og_image).replace("{{og_type}}", og_type)
    page = page.replace("{{head_extra}}", head_extra)
    if noindex:
        root = "/studystore/" if BASE.endswith("/studystore") else "/"
    page = clean_rel_links(clean_abs_urls(version_assets(render(page, root))))
    dest = ROOT / out
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text(page)
    if not noindex:
        urls.append((clean_url(BASE + "/" + ("" if out == "index.html" else out)), (_iso(lastmod) or lastmod) if lastmod else DEFAULT_LASTMOD))

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
    _pp = products.get(m["product"]) or {}
    _sec = _pp.get("section_name") or "MCAT strategy and planning"
    _rl = [r for r in m["related"] if r != slug]
    for x in all_notes:
        if len(_rl) >= 7:
            break
        _xs = (products.get(x["meta"]["product"]) or {}).get("section_name") or "MCAT strategy and planning"
        if x["slug"] != slug and x["slug"] not in _rl and _xs == _sec:
            _rl.append(x["slug"])
    for x in all_notes:
        if len(_rl) >= 5:
            break
        if x["slug"] != slug and x["slug"] not in _rl:
            _rl.append(x["slug"])
    _bt = {x["slug"]: x["meta"]["title"] for x in all_notes}
    rel = "".join(f'<li><a href="{r}.html">{html.escape(_bt[r])}</a></li>' for r in _rl)
    mins = max(1, round(n["words"] / 220))
    img = f'{BASE}/assets/notes/og-{slug}.png'
    page_url = f"{BASE}/{out}"
    mod = m.get("updated", m["published"])
    _topic = _pp.get("title") or "MCAT preparation"
    article = {"@context": "https://schema.org", "@type": ["Article", "LearningResource"], "headline": m["title"],
               "name": m["title"], "educationalLevel": "Undergraduate pre-health",
               "learningResourceType": "study note", "isAccessibleForFree": True,
               "teaches": m["description"],
               "about": {"@type": "Thing", "name": _topic},
               "description": m["description"], "image": img, "datePublished": m["published"],
               "dateModified": mod, "wordCount": n["words"], "inLanguage": "en",
               "mainEntityOfPage": page_url,
               "author": {"@type": "Organization", "name": "StudyStore", "url": BASE + "/"},
               "publisher": {"@type": "Organization", "name": "StudyStore", "url": BASE + "/"}}
    faq = {"@context": "https://schema.org", "@type": "FAQPage",
           "mainEntity": [{"@type": "Question", "name": strip_tags(convert_inline(q)),
                           "acceptedAnswer": {"@type": "Answer", "text": strip_tags(convert(a))}}
                          for q, a in n["quiz"]]}
    crumbs = breadcrumbs(("Free MCAT study notes", f"{BASE}/notes/index.html"), (m["title"], page_url))
    ld = ld_json(article, faq, crumbs)
    _s = (PB.sample(m["product"]) or {}) if m["product"] != "none" else {}
    _c = (_s.get("cards") or [None])[0]
    _thumb = (f'<a class="cta-thumb" href="{{{{root}}}}products/{m["product"]}.html#preview"><img src="{{{{root}}}}{_c["src"]}" alt="Real sample card from the pack" width="{_c["w"]}" height="{_c["h"]}" loading="lazy"></a>'
              if _c and (ROOT / _c["src"]).exists() else "")
    cta = (f'<aside class="cta">{_thumb}<div><strong>Want this as spaced-repetition cards?</strong>'
           f'<p>{{{{title:{m["product"]}}}}} is a {{{{price:{m["product"]}}}}} pack with original Anki cards, an illustrated study guide, a printable cheat sheet and practice questions, with a 14-day refund. '
           f'<a href="{{{{root}}}}products/{m["product"]}.html?utm_source=site-cta">See what is inside</a>.</p></div>{{{{buy:{m["product"]}}}}}</aside>')
    related_pack = (f'<aside class="related-pack"><h2>Related pack</h2><p>This note is part of <a href="{{{{root}}}}products/{m["product"]}.html?utm_source=site-cta">'
                    f'{{{{title:{m["product"]}}}}}</a>: original Anki cards, a study guide and practice questions on the same topic.</p></aside>'
                    if m["product"] != "none" else "")
    mid = (f'<aside class="midsample">{_thumb}<div><strong>Free sample from the pack</strong>'
           f'<p>Real card from {{{{title:{m["product"]}}}}}. <a href="{{{{root}}}}products/{m["product"]}.html?utm_source=site-cta#preview">See sample cards and 5 free questions</a>, '
           f'or <a href="{{{{root}}}}notes/index.html" data-track="sampler">browse the free MCAT sampler</a>.</p></div></aside>'
           if m["product"] != "none" else "")
    _parts = re.split(r"(?=<h2[ >])", body_html)
    if len(_parts) > 2:
        _k = (len(_parts) + 1) // 2
        body_html = "".join(_parts[:_k]) + mid + "".join(_parts[_k:])
    else:
        body_html += mid
    body = f"""<article class="note wrap narrow">
<p class="eyebrow">Free MCAT study note</p>
<h1>{html.escape(m["title"])}</h1>
<p class="meta">By StudyStore &middot; Published {m["published"]} &middot; {mins} min read &middot; {n["words"]} words</p>
{("{{topbuy:%s%s:preview}}" % (m["product"], ":social-cta" if out[:-5] in SOCIAL_CTA_PAGES else "")) if m["product"] != "none" else ""}
<div class="prose">
{body_html}
</div>
{cta}
<h2 id="quiz">Check yourself: 5-question mini-quiz</h2>
<p class="meta">Try each question first, then click it to reveal the answer.</p>
<div class="quiz">{quiz_html}</div>
{{{{signup}}}}
<h2>Keep studying</h2>
<ul>{rel}<li><a href="index.html">All free notes</a></li></ul>
{related_pack}
{practice_build.note_links(slug, PRACTICE_LIVE, None)}
{cta}{waitlist.capture("{{root}}", "cc2")}
<p class="meta">Written by StudyStore from standard scientific facts. Study aid only. Always check values against the reference your exam provides.</p>
<p class="meta"><a class="reportlink" href="{{{{root}}}}report.html" data-report>Spotted a mistake or want a topic covered? Report a problem or suggest something</a></p>
</article>"""
    emit(out, m.get("seo_title") or f'{m["title"]} | StudyStore Notes', m.get("seo_description") or m["description"], body, og_image=img,
         og_type="article", head_extra=ld, lastmod=mod)

def convert_inline(t):
    from mdlite import inline
    return inline(t)

def strip_tags(t):
    return html.unescape(re.sub(r"<[^>]+>", "", t)).strip()

notes = load_notes()
PRACTICE, PRACTICE_CATS = practice_build.load(ROOT, products, {n["slug"] for n in notes})
PRACTICE_LIVE = [p for p in PRACTICE if not p["noindex"]]
# Live counts for the free sampler opt-in box (waitlist.py), so it never states a number the site lacks.
waitlist.STATS.update(notes=len(notes), practice=len(PRACTICE_LIVE), questions=sum(len(p["qs"]) for p in PRACTICE_LIVE))
LATEST_NOTES = "".join(note_card(n, "notes/", "assets/notes/") for n in notes[:6])
for n in notes:
    build_note(n, notes)
SECTION_ORDER = ["Bio/Biochem", "Chem/Phys", "Psych/Soc", "CARS"]
OTHER_SECTION = "MCAT strategy and planning"

def note_section(n):
    return (products.get(n["meta"]["product"]) or {}).get("section_name") or OTHER_SECTION

def note_sections_html(notes):
    """Every note linked from the notes hub, grouped by MCAT section, with jump links."""
    groups = [(s, [n for n in notes if note_section(n) == s]) for s in SECTION_ORDER + [OTHER_SECTION]]
    groups = [(s, ns) for s, ns in groups if ns]
    jump = " &middot; ".join(f'<a href="#{re.sub(r"[^a-z]+", "-", s.lower()).strip("-")}">{html.escape(s)} ({len(ns)})</a>' for s, ns in groups)
    out = f'<section><div class="wrap"><p class="meta">Jump to: {jump}</p></div></section>'
    for s, ns in groups:
        sid = re.sub(r"[^a-z]+", "-", s.lower()).strip("-")
        out += (f'<section id="{sid}"><div class="wrap"><h2>{html.escape(s)} notes</h2>'
                f'<div class="notegrid">{"".join(note_card(n, "", "../assets/notes/") for n in ns)}</div></div></section>')
    return out

note_sections = note_sections_html(notes)
idx = f"""<div class="wrap hero" style="padding-bottom:24px">
<div class="eyebrow">Free MCAT study notes</div>
<h1>Notes</h1>
<p class="lead">Plain-language MCAT biochemistry explainers, each with an original diagram and a 5-question mini-quiz. Free, no signup.</p>
<p class="meta"><a href="../practice/index.html">Looking for practice questions? Browse the free MCAT practice questions by topic.</a> Or <a href="../free-mcat-sample-questions.html" data-track="sampler">try five free pack sample questions with answers</a>.</p>
</div>
<section><div class="wrap">{{{{topbuy:feat}}}}</div></section>
{note_sections}
<section><div class="wrap narrow">{{{{waitlist}}}}</div></section>"""
emit("notes/index.html", "Free MCAT Study Notes | StudyStore",
     "Free MCAT biochemistry study notes with original diagrams and mini-quizzes: amino acids, enzyme kinetics, inhibition, protein structure, and more.",
     idx, head_extra=ld_json(breadcrumbs(("Free MCAT study notes", f"{BASE}/notes/index.html"))),
     lastmod=max((n["meta"]["published"] for n in notes), default=None))

# ---------- free sample questions (flagship pack) ----------
_fp = PB.featured(site)
_fcap = waitlist.capture("").replace('name="utm_source" value=""', 'name="utm_source" value="site-cta"', 1)
emit("free-mcat-sample-questions.html", f"Free MCAT Sample Questions with Answers ({_fp['title']})",
     f"Five free MCAT style sample questions on {_fp['title'].lower()}, each with the answer and a full explanation. No signup. Same format as the {_fp['title']} pack.",
     '<div class="wrap phero"><p class="eyebrow mono"><span class="dot"></span>Free sample</p>'
     f'<h1>Free MCAT sample questions: {html.escape(_fp["title"])}</h1>'
     '<p class="lead">Five questions straight from the pack, with the answer and why. No signup, no paywall.</p></div>'
     + PB.sample_qa_html(_fp, True, 5) +
     '<section><div class="wrap">{{topbuy:feat}}</div></section>'
     '<section><div class="wrap narrow"><p class="meta">More free material: <a href="notes/index.html">MCAT study notes</a> and '
     '<a href="practice/index.html">practice questions by topic</a>.</p></div></section>'
     + f'<section><div class="wrap narrow">{_fcap}</div></section>',
     head_extra=ld_json(breadcrumbs(("Free MCAT sample questions", f"{BASE}/free-mcat-sample-questions.html"))))

# ---------- catalog product pages ----------
def product_related(slug, aamc):
    """Free practice pages and notes for a pack, found from content frontmatter (product: / aamc: / notes:)."""
    own = lambda ref: (products.get(ref) or {}).get("slug") == slug
    prs = [x for x in PRACTICE_LIVE if own(x["meta"]["product"]) or x["meta"]["aamc"].upper() == aamc.upper()]
    ns = {n["slug"] for n in notes if own(n["meta"]["product"])} | {s for x in prs for s in x["notes"]}
    nts = [n for n in notes if n["slug"] in ns]
    if len(nts) < 4:  # thin packs: top up to 4 related notes from the same section, then any pack
        _sec = (products.get(slug) or {}).get("section_name")
        _more = sorted((n for n in notes if n["slug"] not in ns and n["meta"]["product"] != "none"),
                       key=lambda n: (note_section(n) != _sec, n["meta"]["product"] != slug, n["slug"]))
        nts = nts + _more[:4 - len(nts)]
    sib = [x for x in site.get("products", []) if x["slug"] != slug]
    me = next((x for x in sib + [products.get(slug) or {}] if x.get("slug") == slug), None) or next(x for x in site["products"] if x["slug"] == slug)
    sib.sort(key=lambda x: (x["section_name"] != me["section_name"], x.get("rank", 99)))
    packs_html = ('<h2 class="split">More MCAT packs</h2><ul class="reveal">' + "".join(
        f'<li><a href="{{{{root}}}}products/{x["slug"]}.html">{html.escape(x["title"])} ({html.escape(x["aamc"])})</a></li>' for x in sib[:6])
        + '<li><a href="{{root}}products/index.html">All packs and bundles</a></li></ul>')
    if not prs and not nts:
        return packs_html
    li = "".join(f'<li><a href="{{{{root}}}}practice/{x["slug"]}.html">{html.escape(x["meta"]["title"])}</a></li>' for x in prs)
    cat = PRACTICE_CATS.get(aamc.upper())
    if prs and cat:
        li += f'<li><a href="{{{{root}}}}practice/{cat["slug"]}/index.html">All {html.escape(aamc.upper())} practice questions</a></li>'
    li += "".join(f'<li><a href="{{{{root}}}}notes/{n["slug"]}.html">{html.escape(n["meta"]["title"])}</a></li>' for n in nts)
    return ('<h2 class="split">Free practice and notes</h2>'
            '<p class="reveal">Free pages on this content category, no signup.</p>'
            f'<ul class="reveal">{li}</ul>') + packs_html

PB.RELATED = {p["slug"]: product_related(p["slug"], p["aamc"]) for p in site.get("products", [])}

def sample_notes_block(slugs, n_max=4):
    """'Free sample notes' block: up to 4 live notes (>=3) for a pack or bundle, linked with utm_source=site-cta."""
    seen, picks = set(), []
    for s in slugs:
        for nt in notes:
            if nt["slug"] not in seen and (products.get(nt["meta"]["product"]) or {}).get("slug") == s:
                seen.add(nt["slug"]); picks.append(nt); break
    for s in slugs * 4:
        if len(picks) >= n_max:
            break
        for nt in notes:
            if nt["slug"] not in seen and (products.get(nt["meta"]["product"]) or {}).get("slug") == s:
                seen.add(nt["slug"]); picks.append(nt); break
    picks = picks[:n_max]
    if len(picks) < 3:
        return ""
    li = "".join(f'<li><a href="{{{{root}}}}notes/{nt["slug"]}.html?utm_source=site-cta">{html.escape(nt["meta"]["title"])}</a></li>' for nt in picks)
    return ('<section class="psamplenotes"><div class="wrap"><p class="eyebrow mono">Free sample notes</p>'
            '<h2 class="split">Read a few of our notes first</h2>'
            f'<ul class="reveal">{li}</ul></div></section>')

PB.SAMPLE_NOTES = {p["slug"]: sample_notes_block([p["slug"]]) for p in site.get("products", [])}
PB.SAMPLE_NOTES.update({b["slug"]: sample_notes_block(list(b["members"])) for b in site.get("bundles", [])})
PB.LD, PB.CRUMBS = ld_json, breadcrumbs
PB.build_all(site, products, emit)
PB.write_redirects(site)

practice_build.build_all(emit, ROOT, PRACTICE, PRACTICE_CATS, {n["slug"]: n for n in notes}, BASE)

# ---------- regular pages ----------
# Pages whose own "last updated" date differs from site.json `updated` (sitemap lastmod must match the page).
PAGE_LASTMOD = {"rangecheck-privacy.html": "2026-10-21", "rangecheck-support.html": "2026-10-21", "support.html": "2026-10-21", "privacy.html": "2026-10-21",
                "binder.html": "2026-11-06", "binder/source.html": "2026-11-06"}

def qbank_subs(body):
    """Fill the %%qb_*%% tokens of the Binder pages from site.json `qbank` (checkout links stay disabled until set)."""
    q = site["qbank"]; b = q["bundle"]
    def btn(url, label, slug, cls="btn"):
        if not url:
            return f'<a class="{cls} off" aria-disabled="true" role="link" tabindex="-1">Available soon</a>'
        return f'<a class="{cls}" href="{html.escape(url)}" data-checkout="polar" data-slug="{slug}" rel="nofollow noopener" data-track="cta">{label}</a>'
    rel = []
    for r in q["releases"]:
        size = f'{r["size_bytes"] / 1048576:.1f} MB'
        if r.get("uploaded"):
            link = f'<a href="{html.escape(q["source_base"])}/{html.escape(r["file"])}" rel="noopener">{html.escape(r["file"])}</a>'
        else:
            link = f'{html.escape(r["file"])} (upload pending)'
        rel.append(f'<li><b>Binder {html.escape(r["version"])}</b>, {html.escape(r["date"])}: {link}, {size}<br><span class="mono meta">SHA-256 {r["sha256"]}</span></li>')
    subs = {"qb_buy": btn(q["checkout_url"], f'Buy now, {q["price"]}', "qbank"),
            "qb_buy_hero": '<p class="reveal">' + btn(q["checkout_url"], f'Buy now, {q["price"]}', "qbank") + ' <a class="btn ghost" href="#how-to-open">How to open</a></p>',
            "qb_bundle_buy": btn(b["checkout_url"], f'Buy now, {b["price"]}', "qbank-complete-mcat", "btn ghost"),
            "qb_price": q["price"], "qb_version": q["version"], **QD.tokens(q), **QS.tokens(),
            "qb_bundle_name": b["name"], "qb_bundle_price": b["price"], "qb_bundle_list": f'${b["list_usd"]}',
            "qb_releases": "<ul>" + "".join(rel) + "</ul>"}
    for k, v in subs.items():
        body = body.replace(f"%%{k}%%", v)
    return body

for tpl, out, title, desc, noindex in PAGES:
    body = (ROOT / "templates" / tpl).read_text()
    if tpl.startswith("qbank"):
        body = qbank_subs(body)
    _u = BASE + "/" if out == "index.html" else f"{BASE}/{out}"
    if noindex:
        _ld = ""
    elif out == "index.html":
        _ld = ld_json({"@context": "https://schema.org", "@type": "WebSite", "name": "StudyStore", "url": BASE + "/", "inLanguage": "en"},
                      {"@context": "https://schema.org", "@type": "Organization", "name": "StudyStore", "url": BASE + "/"})
    else:
        _ld = ld_json({"@context": "https://schema.org", "@type": "WebPage", "name": title, "description": desc, "url": clean_url(_u),
                       "isPartOf": {"@type": "WebSite", "name": "StudyStore", "url": BASE + "/"}},
                      breadcrumbs((title.split(" | ")[0], clean_url(_u))))
    emit(out, title, desc, body, noindex=noindex, lastmod=PAGE_LASTMOD.get(out), head_extra=_ld)

# ---------- free tools (isolated in build_tools.py) ----------
import build_tools
_aamc_of = lambda ref: (products.get(ref) or {}).get("aamc", "")
_notes_by, _prac_by = {}, {}
for n in sorted(notes, key=lambda n: n["slug"]):
    if _aamc_of(n["meta"]["product"]):
        _notes_by.setdefault(_aamc_of(n["meta"]["product"]).upper(), []).append((n["slug"], n["meta"]["title"]))
for x in PRACTICE_LIVE:
    _prac_by.setdefault(x["meta"]["aamc"].upper(), []).append((x["slug"], x["meta"]["title"]))
build_tools.build(emit, site, products, {n["slug"]: n["meta"]["title"] for n in notes}, _notes_by, _prac_by)

# ---------- comparison guides (build_compare.py, data/compare.json) ----------
import build_compare
COMPARE = build_compare.build(emit, site, ld_json, breadcrumbs)

sm = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
for u, lm in urls:
    sm.append(f"  <url><loc>{u}</loc>" + (f"<lastmod>{lm}</lastmod>" if lm else "") + "</url>")
sm += ["</urlset>", ""]
(ROOT / "sitemap.xml").write_text("\n".join(sm))
(ROOT / "robots.txt").write_text(f"User-agent: *\nAllow: /\n\nSitemap: {site['base_url']}/sitemap.xml\n")
print(f"built {len(PAGES)} pages + {len(notes)} notes")

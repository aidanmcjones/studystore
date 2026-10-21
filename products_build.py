"""Catalog-driven pages and home-page data blocks. Imported by build.py; stdlib only.

Data (never hand-edit numbers in templates; they come from here):
  site.json `products` and `bundles`  written by ops/sync_catalog.py from engine/CATALOG.json and
                                      products/<slug>/validation.json
  ls_variants.json                    Lemon Squeezy variant ids (sync_catalog.py, read-only API; dormant
                                      while checkout_provider is polar)
  content/packs/<slug>/sample.json    preview images, 5 sample questions, 4 demo cards (tools/gen_previews.py)
Templates: templates/product.html, templates/bundle.html, templates/thanks.html use %%name%% tokens
filled here; {{...}} placeholders are then filled by build.render().

Placeholders this module answers (see placeholder()):
  {{pack_grid}}            home/catalog pack cards, bundles, coming-soon list
  {{feat:<field>}}         featured pack (first available by rank): title price aamc cards diagrams
                           guide_pages cheatsheet_pages questions url tag section_name
  {{feat_anki}} {{feat_quiz}} {{feat_quiz_n}} {{feat_files}} {{feat_file_count}} {{feat_mix}}
  {{feat_marquee}} {{feat_sheet}} {{stat:available}} {{stat:total}} {{stat:bundles}}
  {{stat:cards}} {{stat:diagrams}} {{stat:questions}}  catalog-wide sums over available packs (home hero)
  {{stat:price_from}} {{stat:complete_price}}          lowest available pack price; Complete MCAT bundle price

Checkout provider (site.json `checkout_provider`, default "polar"; see configure()):
  polar         buy buttons are plain links to the pack's Polar checkout link (site.json
                products[].checkout_url, https://buy.polar.sh/...). assets/js/exp.js appends the
                visitor's first-touch utm_* tags and shown experiment variants (reference_id) to them.
  lemonsqueezy  dormant path kept for a switch back: variant ids from ls_variants.json and
                /api/checkout (functions/api/checkout.js); only lemonsqueezy.com checkout_urls are used.

Buy buttons:
  coming_soon                       -> disabled "Coming soon"
  available, no checkout for the active provider -> disabled "Available soon"
  polar + Polar checkout_url        -> plain link to the Polar checkout
  lemonsqueezy + variant id         -> data-buy button; assets/js/buy.js POSTs /api/checkout and
                                       redirects, or shows "Available soon" if the API is not configured
  lemonsqueezy + static checkout_url -> used as the no-JS / API-down fallback
"""
import html, json, re
from pathlib import Path

ROOT = Path(__file__).parent
E = html.escape
TYPE_NAMES = [("sa", "short answer"), ("mc", "multiple choice"), ("cz", "cloze"), ("tf", "true/false"),
              ("io", "image occlusion")]
WORDS = {1: "One", 2: "Two", 3: "Three", 4: "Four", 5: "Five", 6: "Six", 7: "Seven", 8: "Eight"}


def esc(t):
    return E(str(t)).replace("{{", "&#123;&#123;")


def lookup(site):
    items = {p["slug"]: p for p in site.get("products", []) + site.get("bundles", [])}
    for old, new in (site.get("retired_products") or {}).items():
        if new in items and old not in items:
            items[old] = items[new]  # old templates/notes keep working; the URL is redirected
    return items


PROVIDERS = {
    "polar": {"merchant": "Polar", "orders_url": "https://polar.sh/aidan-jones/portal",
              "orders_label": "polar.sh/aidan-jones/portal",
              "refund_how": ("Email support@studystore.co with the email you used at checkout (or your order number). "
                             "Refunds are issued by StudyStore through Polar, our merchant of record."),
              "url_re": r"^https://buy\.polar\.sh/polar_cl_[A-Za-z0-9]+$"},
    "lemonsqueezy": {"merchant": "Lemon Squeezy", "orders_url": "https://app.lemonsqueezy.com/my-orders",
                     "orders_label": "app.lemonsqueezy.com/my-orders",
                     "refund_how": ("Orders are processed by Lemon Squeezy, our merchant of record. Use the link in your "
                                    "order receipt email to request a refund, or email support@studystore.co with your order number."),
                     "url_re": r"^https://[a-z0-9.-]+\.lemonsqueezy\.com/"},
}
PROVIDER = "polar"


def configure(site):
    """Pick the checkout provider (site.json checkout_provider, default polar) and expose its copy
    to templates as {{merchant}}, {{orders_url}} and {{orders_label}}."""
    global PROVIDER
    PROVIDER = site.get("checkout_provider") or "polar"
    if PROVIDER not in PROVIDERS:
        raise SystemExit(f"unknown checkout_provider {PROVIDER!r}")
    for k in ("merchant", "orders_url", "orders_label", "refund_how"):
        site[k] = PROVIDERS[PROVIDER][k]
    return PROVIDER


def checkout_url(p):
    """The static checkout link for the active provider, or None."""
    url = p.get("checkout_url")
    return url if url and re.match(PROVIDERS[PROVIDER]["url_re"], url) else None


def buyable(p):
    """True when a buyer can check out this item with the active provider ("for sale")."""
    if p.get("status") != "available":
        return False
    return bool(checkout_url(p) or (PROVIDER == "lemonsqueezy" and p.get("variant_id")))


def checkout_open(site):
    """True when at least one available pack or bundle can be bought with the active provider."""
    return any(buyable(p) for p in site.get("products", []) + site.get("bundles", []))


def buy(items, slug, cls="btn", root=""):
    p = items[slug]
    if p.get("status") != "available":
        return f'<a class="{cls} off" aria-disabled="true" role="link" tabindex="-1">Coming soon</a>'
    url = checkout_url(p)
    if PROVIDER == "polar":
        if url:
            return (f'<a class="{cls}" href="{E(url)}" data-checkout="polar" data-slug="{E(p["slug"])}" '
                    f'rel="noopener">Buy now, {E(p["price"])}</a>')
        return f'<a class="{cls} off" aria-disabled="true" role="link" tabindex="-1">Available soon</a>'
    if p.get("variant_id"):
        href = E(url) if url else f'{root}products/{p["slug"]}.html#buy'
        return (f'<a class="{cls}" href="{href}" data-buy="{E(p["slug"])}" data-fallback="{E(url or "")}" '
                f'rel="noopener">Buy now, {E(p["price"])}</a>')
    if url:
        return f'<a class="{cls}" href="{E(url)}" rel="noopener">Buy now, {E(p["price"])}</a>'
    return f'<a class="{cls} off" aria-disabled="true" role="link" tabindex="-1">Available soon</a>'


# SEO hooks, set by build.py before build_all(): related-link HTML per product slug, and JSON-LD helpers.
RELATED = {}          # slug -> HTML section linking free practice pages and notes (root-relative via {{root}})
LD = None             # build.ld_json
CRUMBS = None         # build.breadcrumbs


def product_ld(site, p, url, image, kind="pack"):
    """schema.org Product. Never aggregateRating or review. PreOrder until the active provider can sell it."""
    if kind == "pack":
        c = p.get("contents") or {}
        desc = (f'Original MCAT study pack for AAMC content category {p["aamc"]}'
                + ("" if p["section_name"] == p["aamc"] else f' ({p["section_name"]})') + ": "
                + (f'{c["cards"]} Anki flashcards, {c.get("guide_pages")}-page study guide, {c.get("cheatsheet_pages")}-page cheat sheet '
                   f'and {c.get("questions")} practice questions.' if p["status"] == "available" and c.get("cards")
                   else f'{p["subtopic_count"]} topics. Coming soon.'))
        name = f'{p["title"]} MCAT {p["aamc"]} Pack'
    else:
        desc = f'{p["title"]}: {p["pack_count"]} StudyStore MCAT packs in one download.'
        name = f'{p["title"]} MCAT Bundle'
    avail = "https://schema.org/InStock" if buyable(p) else "https://schema.org/PreOrder"
    return {"@context": "https://schema.org", "@type": "Product", "name": name, "description": desc,
            "sku": p["slug"], "url": url, "image": image, "category": "MCAT study materials",
            "brand": {"@type": "Brand", "name": "StudyStore"},
            "offers": {"@type": "Offer", "url": url, "priceCurrency": "USD", "price": f'{p["price_usd"]:.2f}',
                       "availability": avail, "itemCondition": "https://schema.org/NewCondition",
                       "seller": {"@type": "Organization", "name": "StudyStore"}}}


def seo_head(site, p, out, image, kind="pack"):
    if not LD:
        return ""
    base = site["base_url"]
    url = f"{base}/{out}"
    return LD(product_ld(site, p, url, image, kind), CRUMBS(("MCAT packs", f"{base}/products/index.html"), (p["title"], url)))


_samples = {}


def sample(slug):
    if slug not in _samples:
        f = ROOT / "content" / "packs" / slug / "sample.json"
        try:
            _samples[slug] = json.loads(f.read_text())
        except (OSError, ValueError):
            _samples[slug] = None
    return _samples[slug]


def fill(tpl, **kw):
    return re.sub(r"%%(\w+)%%", lambda m: str(kw[m.group(1)]), tpl)


def available(site):
    return [p for p in site.get("products", []) if p["status"] == "available"]


def featured(site):
    a = available(site)
    return a[0] if a else (site.get("products") or [None])[0]


def section_bundle(site, slug):
    return next((b for b in site.get("bundles", []) if slug in b["members"] and b["slug"] != "bundle-complete-mcat"), None)


def complete_bundle(site):
    return next((b for b in site.get("bundles", []) if b["slug"] == "bundle-complete-mcat"), None)


def a_n(n):
    """Article for a spoken number: an 8-page, an 11-page, a 3-page."""
    t = str(n)
    return "an" if t.startswith("8") or t in ("11", "18") or (len(t) in (5, 6) and t.startswith(("11", "18"))) else "a"


def num(n):
    return f"{n:02d}"


# ---------- shared fragments ----------

def files_html(c):
    t = c.get("card_types") or {}
    mix = ", ".join(f"{t[k]} {n}" for k, n in TYPE_NAMES if t.get(k))
    li = []
    if c.get("cards"):
        li.append(f'<li><b>deck.apkg</b><span>{c["cards"]} original Anki flashcards ({mix})'
                  + (f', {c["diagrams"]} original diagrams' if c.get("diagrams") else "") + "</span></li>")
    if c.get("guide_pages"):
        li.append(f'<li><b>guide.pdf</b><span>{c["guide_pages"]}-page illustrated study guide that explains the ideas</span></li>')
    if c.get("cheatsheet_pages"):
        li.append(f'<li><b>cheatsheet.pdf</b><span>{c["cheatsheet_pages"]} printable pages, US Letter at 100 percent</span></li>')
    if c.get("questions"):
        ps = f', including {c["passage_sets"]} passage-based sets' if c.get("passage_sets") else ""
        li.append(f'<li><b>questions.pdf</b><span>{c["questions"]} original MCAT-style practice questions with explanations{ps}</span></li>')
    li.append("<li><b>README.txt</b><span>import steps</span></li>")
    return "\n".join(li)


def mix_html(c, label=True):
    t = c.get("card_types") or {}
    parts = [(k, n, t[k]) for k, n in TYPE_NAMES if t.get(k)]
    bar = "".join(f'<i style="--w:{v}" class="m{i}"></i>' for i, (k, n, v) in enumerate(parts, 1))
    key = "".join(f'<li><i class="m{i}"></i>{v} {n}</li>' for i, (k, n, v) in enumerate(parts, 1))
    lab = '<p class="mono mixlabel">Card types, chosen per fact</p>' if label else ""
    return (f'<div class="mix reveal" aria-label="Card types in the deck">{lab}<div class="mixbar">{bar}</div>'
            f'<ul class="mixkey mono">{key}</ul></div>')


def elements_html(p):
    out = []
    n = len(p["subtopics"])
    for i, t in enumerate(p["subtopics"], 1):
        k = 1 + (3 * (i - 1)) // max(n, 1)
        w = re.sub(r"[^A-Za-z0-9]", "", t.split()[0]) or t
        sym = (w[0].upper() + w[1:2].lower()) if len(w) > 1 else w.upper()
        out.append(f'<li class="k{k}"><span class="z mono">{num(i)}</span><span class="sym">{esc(sym)}</span>'
                   f'<span class="nm">{esc(t)}</span></li>')
    return '<ul class="elements reveal" aria-label="Topics">' + "".join(out) + "</ul>"


def pack_facts(p):
    c = p.get("contents") or {}
    rows = []
    if c.get("cards"): rows.append(("Flashcards", c["cards"]))
    if c.get("diagrams"): rows.append(("Original diagrams", c["diagrams"]))
    if c.get("guide_pages"): rows.append(("Study guide", f'{c["guide_pages"]} pages'))
    if c.get("cheatsheet_pages"): rows.append(("Cheat sheet", f'{c["cheatsheet_pages"]} pages'))
    if c.get("questions"): rows.append(("Practice questions", c["questions"]))
    rows.append(("Topics", p["subtopic_count"]))
    if c:
        rows.append(("Files", ".apkg, .pdf"))
    rows.append(("Refund window", "14 days"))
    return "".join(f"<li><span>{esc(a)}</span><span>{esc(b)}</span></li>" for a, b in rows)


def gallery_html(p, root="{{root}}"):
    s = sample(p["slug"]) if p["status"] == "available" else None
    if not s:
        return ""
    figs, sheets = [], []
    for c in s.get("cards", [])[:4]:
        alt = c["alt"] if c["alt"] != "Sample card" else f'Sample card from {p["title"]}, answer side'
        figs.append(f'<figure class="reveal"><button type="button" data-zoom="{root}{E(c["src"])}" aria-label="Enlarge sample card">'
                    f'<img src="{root}{E(c["src"])}" alt="{esc(alt)}" width="{c["w"]}" height="{c["h"]}" loading="lazy"></button>'
                    f'<figcaption>Sample card (answer side)</figcaption></figure>')
    for c in s.get("sheets", []):
        sheets.append(f'<figure class="reveal"><button type="button" data-zoom="{root}{E(c["src"])}" aria-label="Enlarge {esc(c["alt"])}">'
                      f'<img src="{root}{E(c["src"])}" alt="{esc(c["alt"])}" width="{c["w"]}" height="{c["h"]}" loading="lazy"></button>'
                      f'<figcaption>{esc(c["alt"])}</figcaption></figure>')
    return '<div class="gallery g4">' + "".join(figs) + ('<div class="sheets">' + "".join(sheets) + "</div>" if sheets else "") + "</div>"


def quiz_html(qs, final_html):
    items = []
    for i, q in enumerate(qs, 1):
        opts = "".join(f'<button type="button" data-o="{chr(65 + j)}"><b>{chr(65 + j)}</b>{esc(o)}</button>'
                       for j, o in enumerate(q["options"]))
        items.append(f'<div class="qitem" data-answer="{esc(q["answer"])}"><p class="qtext"><span class="mono qn">Q{i}</span>{esc(q["stem"])}</p>'
                     f'<div class="qopts">{opts}</div><p class="qexp"><b>{esc(q["answer"])}.</b> {esc(q["explanation"])}</p></div>')
    n = len(qs)
    return (f'<div class="quizbox reveal" data-quiz><div class="qhead mono"><span class="qprog" aria-hidden="true">{"<i></i>" * n}</span>'
            f'<span class="qscore" aria-live="polite">0 of {n} answered</span></div>' + "".join(items)
            + f'<div class="qdone">{final_html}</div></div>')


CONTEXT_RE = re.compile(r"passage|table|figure|graph|experiment [0-9]|study described|shown|above|below", re.I)


def home_quiz(site, root):
    """Every available pack's standalone sample questions (no passage or figure needed), tagged by section.
    site.js shows 3 per visit from 3 different sections, skipping ones this browser saw recently."""
    items = []
    for p in available(site):
        for k, q in enumerate(((sample(p["slug"]) or {}).get("questions") or [])):
            if CONTEXT_RE.search(q["stem"]):
                continue
            opts = "".join(f'<button type="button" data-o="{chr(65 + j)}"><b>{chr(65 + j)}</b>{esc(o)}</button>'
                           for j, o in enumerate(q["options"]))
            src = (f' <a class="qsrc mono" href="{root}products/{E(p["slug"])}.html">From the {E(p["aamc"])} pack: '
                   f'{esc(p["title"])}</a>')
            hide = "" if len(items) < 3 else " qx"
            items.append(f'<div class="qitem{hide}" data-answer="{esc(q["answer"])}" data-sec="{E(p["section_name"])}" '
                         f'data-qid="{E(p["slug"])}-{k}"><p class="qtext"><span class="mono qn">Q{len(items) + 1}</span>{esc(q["stem"])}</p>'
                         f'<div class="qopts">{opts}</div><p class="qexp"><b>{esc(q["answer"])}.</b> {esc(q["explanation"])}{src}</p></div>')
    fin = (f'<p class="qfinal">Those are real questions from our packs, word for word. Reload for a new set.</p>'
           f'<a class="btn magnetic" href="#packs"><span>See the packs</span></a>')
    return (f'<div class="quizbox reveal" data-quiz data-pickq="3"><div class="qhead mono"><span class="qprog" aria-hidden="true">'
            f'{"<i></i>" * 3}</span><span class="qscore" aria-live="polite">0 of 3 answered</span></div>' + "".join(items)
            + f'<div class="qdone">{fin}</div></div>'), len(items)


def sample_quiz(p, n=5, final=""):
    s = sample(p["slug"]) if p["status"] == "available" else None
    qs = (s or {}).get("questions", [])[:n]
    return quiz_html(qs, final) if qs else ""


def anki_html(p):
    s = sample(p["slug"]) or {}
    arts = [anki_card(c) for c in s.get("demo_cards", [])[:4]]
    return "\n".join(arts), len(arts)


def home_anki(site):
    """Every available pack's demo cards, tagged by MCAT section; site.js shows one random card per section."""
    arts, secs = [], []
    for p in available(site):
        for c in ((sample(p["slug"]) or {}).get("demo_cards") or [])[:4]:
            arts.append(anki_card(c, f' data-sec="{E(p["section_name"])}" data-tag="StudyStore::MCAT::{E(p["aamc"])}"'))
            if p["section_name"] not in secs:
                secs.append(p["section_name"])
    return "\n".join(arts), len(secs)


def anki_card(c, attrs=""):
    t = c["type"]
    if t == "sa":
        kind, q, a = "Short answer", esc(c["front"]), f'<p class="a">{esc(c["back"])}</p>'
        front = f'<p class="q">{q}</p>'
        back = f'<p class="q">{q}</p><hr>{a}'
    elif t == "cz":
        kind = "Cloze"
        front = '<p class="q">' + re.sub(r"\{\{c\d+::(.*?)(::.*?)?\}\}", '<span class="cloze">[...]</span>', c["text"].replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")) + "</p>"
        back = ('<p class="q">' + re.sub(r"\{\{c\d+::(.*?)(::.*?)?\}\}", r'<span class="cloze on">\1</span>', c["text"].replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")) + "</p>"
                + (f'<hr><p class="a">{esc(c["extra"])}</p>' if c.get("extra") else ""))
    elif t == "mc":
        kind = "Multiple choice"
        opts = "".join(f"<li><b>{chr(65 + j)}.</b> {esc(o)}</li>" for j, o in enumerate(c["options"]))
        front = f'<p class="q">{esc(c["stem"])}</p><ol class="opts">{opts}</ol>'
        ans = c["options"][ord(c["answer"]) - 65] if len(c["answer"]) == 1 else ""
        back = f'<p class="q">{esc(c["stem"])}</p><hr><p class="a"><b>{esc(c["answer"])}. {esc(ans)}</b> {esc(c["why"])}</p>'
    else:
        kind = "True or false"
        front = f'<p class="q">{esc(c["statement"])}</p>'
        back = f'<p class="q">{esc(c["statement"])}</p><hr><p class="a"><b>{"True" if c["truth"] else "False"}.</b> {esc(c["why"])}</p>'
    return (f'<article class="ankicard"{attrs}><div class="face front"><p class="kind mono">{kind}</p>{front}</div>'
            f'<div class="face back"><p class="kind mono">{kind}</p>{back}</div></article>')


# ---------- home / catalog blocks ----------

def pack_card(p, root, main=False):
    c = p.get("contents") or {}
    avail = p["status"] == "available"
    if avail and c:
        ticks = []
        if c.get("cards"):
            ticks.append(f'{c["cards"]}-card Anki deck' + (f' with {c["diagrams"]} original diagrams' if c.get("diagrams") else ""))
        if c.get("guide_pages"): ticks.append(f'{c["guide_pages"]}-page illustrated study guide (PDF)')
        if c.get("cheatsheet_pages"): ticks.append(f'{c["cheatsheet_pages"]}-page printable cheat sheet (PDF)')
        if c.get("questions"): ticks.append(f'{c["questions"]} MCAT-style practice questions with explanations')
        ticks.append("14-day, no-questions-asked refund")
        top = f'<span>MCAT {E(p["aamc"])}</span><span>{E(p["section_name"])}</span>'
    else:
        ticks = [f'{p["subtopic_count"]} topics planned', "Deck, study guide, cheat sheet and practice questions",
                 "On sale once it passes accuracy review"]
        top = f'<span>MCAT {E(p["aamc"])}</span><span class="soonpill">Coming soon</span>'
    li = "".join(f"<li>{esc(t)}</li>" for t in ticks)
    price_attr = ' data-exp="price_frame" data-exp-field="price"' if avail else ""
    return (f'<article class="pcard{" main" if main else ""} product reveal"><div class="pcardtop mono">{top}</div>'
            f'<h3>{esc(p["title"])}</h3><p class="pprice"><span class="amt"{price_attr}>{E(p["price"])}</span>'
            f'<span class="mono">{"instant download" if avail else "planned price"}</span></p><ul class="ticks">{li}</ul>'
            f'<div class="row">{buy({p["slug"]: p}, p["slug"], root=root)}<a class="textlink" href="{root}products/{p["slug"]}.html">Full details</a></div></article>')


def bundle_card(b, root):
    avail = b["status"] == "available"
    pill = "" if avail else '<span class="soonpill">Coming soon</span>'
    ticks = [f'All {b["pack_count"]} packs in the section' if b["slug"] != "bundle-complete-mcat" else f'All {b["pack_count"]} packs',
             f'${b["list_value_usd"]} if bought separately', f'{b["ready_count"]} of {b["pack_count"]} packs ready now']
    li = "".join(f"<li>{esc(t)}</li>" for t in ticks)
    return (f'<article class="pcard bundle reveal"><div class="pcardtop mono"><span>Bundle</span>{pill}</div>'
            f'<h3>{esc(b["title"])}</h3><p class="pprice"><span class="amt">{E(b["price"])}</span><span class="mono">one time</span></p>'
            f'<ul class="ticks">{li}</ul><div class="row">{buy({b["slug"]: b}, b["slug"], root=root)}'
            f'<a class="textlink" href="{root}products/{b["slug"]}.html">Details</a></div></article>')


def soon_list(site, root):
    soon = [p for p in site.get("products", []) if p["status"] != "available"]
    if not soon:
        return ""
    secs = []
    for p in soon:
        if p["section_name"] not in secs:
            secs.append(p["section_name"])
    cols = []
    for s in secs:
        li = "".join(f'<li><a href="{root}products/{p["slug"]}.html"><b>{E(p["aamc"])}</b>{esc(p["title"])}</a>'
                     f'<span>{E(p["price"])}</span></li>' for p in soon if p["section_name"] == s)
        cols.append(f'<div><p class="flabel mono">{E(s)}</p><ul class="mono">{li}</ul></div>')
    return (f'<div class="soonlist reveal"><p class="eyebrow mono">Coming soon &middot; {len(soon)} packs in review or in writing</p>'
            f'<div class="soongrid">{"".join(cols)}</div></div>')


def pack_grid(site, root):
    a = available(site)
    cards = "".join(pack_card(p, root, main=(i == 0)) for i, p in enumerate(a))
    if not a:
        cards = '<p class="lead">The first packs are finishing accuracy review. Every pack below lists its planned topics.</p>'
    bundles = "".join(bundle_card(b, root) for b in site.get("bundles", []))
    return (f'<div class="pgrid catalog">{cards}</div>'
            f'<div class="sechead" style="margin-top:56px"><p class="eyebrow mono">Bundles</p></div>'
            f'<div class="pgrid catalog">{bundles}</div>' + soon_list(site, root))


def stat(site, f):
    """Catalog-wide numbers for the home page, summed over available packs only."""
    a = available(site)
    if f == "available": return str(len(a))
    if f == "total": return str(len(site.get("products", [])))
    if f == "bundles": return str(len(site.get("bundles", [])))
    if f in ("cards", "diagrams", "questions"):
        return f'{sum(int((p.get("contents") or {}).get(f) or 0) for p in a):,}'
    if f == "price_from":
        priced = [p for p in a if p.get("price_usd") is not None]
        return E(min(priced, key=lambda p: p["price_usd"])["price"]) if priced else ""
    if f == "complete_price":
        b = complete_bundle(site)
        return E(b["price"]) if b else ""
    raise KeyError("stat:" + f)


def placeholder(site, items, k, root):
    """Answer catalog placeholders for build.render(); None if k is not ours."""
    if k == "pack_grid":
        return pack_grid(site, root)
    if k == "home_anki": return home_anki(site)[0]
    if k == "home_anki_n": return str(home_anki(site)[1])
    if k == "home_quiz": return home_quiz(site, root)[0]
    if k == "home_quiz_bank": return str(home_quiz(site, root)[1])
    if k.startswith("stat:"):
        return stat(site, k[5:])
    if not k.startswith("feat"):
        return None
    p = featured(site)
    c = (p or {}).get("contents") or {}
    if k.startswith("feat:"):
        f = k[5:]
        if f == "url": return f'{root}products/{p["slug"]}.html'
        if f in ("title", "section_name"): return esc(p[f])
        if f in ("price", "aamc", "slug"): return E(p[f])
        if f == "tag": return "StudyStore::MCAT::" + E(p["aamc"])
        if f == "cheatsheet_words": return WORDS.get(c.get("cheatsheet_pages"), str(c.get("cheatsheet_pages")))
        return str(c.get(f, ""))
    if k == "feat_anki": return anki_html(p)[0]
    if k == "feat_anki_n": return str(anki_html(p)[1])
    if k == "feat_quiz_n": return str(len(((sample(p["slug"]) or {}).get("questions") or [])[:3]))
    if k == "feat_quiz":
        n = len(((sample(p["slug"]) or {}).get("questions") or [])[:3])
        fin = (f'<p class="qfinal">That was {n} questions. This pack has {c.get("questions", "")}, plus {c.get("cards", "")} flashcards.</p>'
               f'<a class="btn magnetic" href="{root}products/{p["slug"]}.html"><span>See the pack</span></a>')
        return sample_quiz(p, 3, fin)
    if k == "feat_files": return files_html(c)
    if k == "feat_file_count":
        n = 1 + sum(1 for x in ("cards", "guide_pages", "cheatsheet_pages", "questions") if c.get(x))
        return WORDS.get(n, str(n))
    if k == "feat_mix": return mix_html(c)
    if k == "feat_marquee": return "".join(f"<span>{esc(t)}</span>" for t in p["subtopics"][:18])
    if k == "feat_sheet":
        s = sample(p["slug"]) or {}
        sh = [x for x in s.get("sheets", []) if x["kind"] == "sheet"]
        if not sh: return ""
        x = sh[0]
        return (f'<img src="{root}{E(x["src"])}" alt="{esc(x["alt"])}" width="{x["w"]}" height="{x["h"]}" loading="lazy">')
    raise KeyError(k)


# ---------- pages ----------

def compare_html(site, p, root):
    rows = [f'<li><span>This pack</span><span>{E(p["price"])}</span></li>']
    for b in (section_bundle(site, p["slug"]), complete_bundle(site)):
        if b:
            st = "" if b["status"] == "available" else " (soon)"
            rows.append(f'<li><span><a href="{root}products/{b["slug"]}.html">{esc(b["title"])}</a>, {b["pack_count"]} packs</span>'
                        f'<span>{E(b["price"])}{st}</span></li>')
    return '<p class="eyebrow mono" style="margin-top:22px">Or get the whole section</p><ul class="mono compare">' + "".join(rows) + "</ul>"


def pack_page(site, items, p, emit, tpl):
    root = "../"
    avail = p["status"] == "available"
    c = p.get("contents") or {}
    if avail and c:
        lead = (f'{c.get("cards")} original Anki flashcards, {a_n(c.get("guide_pages"))} {c.get("guide_pages")}-page illustrated study guide, '
                f'{a_n(c.get("cheatsheet_pages"))} {c.get("cheatsheet_pages")}-page cheat sheet and {c.get("questions")} practice questions for MCAT content category {E(p["aamc"])}.')
        inside = ('<h2 class="split">What is inside</h2><ul class="files mono reveal">' + files_html(c) + "</ul>" + mix_html(c, label=False))
        how = ('<h2 class="split">Import in 30 seconds</h2><ol class="steps reveal"><li>Install Anki (free) from apps.ankiweb.net.</li>'
               '<li>Unzip the download, then double-click <code>deck.apkg</code> or use File, Import.</li>'
               f'<li>Cards are tagged under <code>StudyStore::MCAT</code>. Re-importing a later version updates the same notes.</li>'
               '<li>Print the PDFs on US Letter at 100 percent, or read them on screen.</li></ol>')
        note = "One-time purchase. Instant digital download. 14-day no-questions refund."
        bottom = ('<section class="pbottom"><div class="wrap"><p class="eyebrow mono">Previews</p>'
                  '<h2 class="split">Look before you buy.</h2>' + gallery_html(p) +
                  ('<div class="sechead" style="margin-top:56px"><p class="eyebrow mono">Try it &middot; sample practice questions</p>'
                   '<h2 class="split">Five questions from the pack.</h2></div>' + sample_quiz(p, 5, "<p class=\"qfinal\">Those are real questions from the pack, word for word.</p>")
                   if sample_quiz(p, 5) else "")
                  + f'<p style="margin-top:36px">{buy(items, p["slug"], root=root)}</p></div></section>'
                  '<dialog class="lightbox" aria-label="Preview image"><img src="data:image/gif;base64,R0lGODlhAQABAAAAACw=" alt="">'
                  '<button type="button" aria-label="Close">&times;</button></dialog>')
        desc = (f'{p["title"]} MCAT pack ({p["aamc"]}): {c.get("cards")} original Anki flashcards, study guide, cheat sheet '
                f'and {c.get("questions")} practice questions. {p["price"]}, one-time.')
    else:
        lead = (f'A StudyStore pack for MCAT content category {E(p["aamc"])}, covering {p["subtopic_count"]} topics. '
                'It is being written and accuracy-checked now, and it is not for sale yet.')
        inside = ('<h2 class="split">Planned contents</h2><p class="reveal">Every StudyStore pack follows the same format, so this one is planned to include:</p>'
                  '<ul class="files mono reveal"><li><b>deck.apkg</b><span>original Anki deck, terse answers, original diagrams</span></li>'
                  '<li><b>guide.pdf</b><span>illustrated study guide</span></li><li><b>cheatsheet.pdf</b><span>printable cheat sheet</span></li>'
                  '<li><b>questions.pdf</b><span>original MCAT-style practice questions with explanations</span></li></ul>'
                  '<p class="meta reveal">Exact card and question counts are published when the pack passes its accuracy review. Nothing is for sale until then.</p>')
        how = ""
        note = "Planned price. Not for sale yet; this page updates when the pack passes review."
        ready = available(site)[:3]
        bottom = ""
        if ready:
            bottom = ('<section class="pbottom"><div class="wrap"><p class="eyebrow mono">Ready now</p><div class="pgrid catalog">'
                      + "".join(pack_card(x, root) for x in ready) + "</div></div></section>")
        desc = f'{p["title"]} MCAT pack ({p["aamc"]}), coming soon: {p["subtopic_count"]} topics, planned price {p["price"]}.'
    body = fill(tpl, eyebrow=f'MCAT {E(p["aamc"])} &middot; {E(p["section_name"])}' + ("" if avail else " &middot; coming soon"),
                title=esc(p["title"]), lead=lead, inside=inside, how=how, topics_count=p["subtopic_count"],
                elements=elements_html(p), price=E(p["price"]), price_note=note,
                price_attr=' data-exp="price_frame" data-exp-field="price"' if avail else "",
                buy=buy(items, p["slug"], root=root), facts=pack_facts(p), compare=compare_html(site, p, root),
                bottom=bottom, kicker=f'MCAT {E(p["aamc"])} &middot; one-time' if avail else "Coming soon",
                related=RELATED.get(p["slug"], ""))
    s = sample(p["slug"]) if avail else None
    kw = {}
    image = site["base_url"] + "/assets/img/cheatsheet-p1.png"
    if s and s.get("sheets") and (ROOT / s["sheets"][0]["src"]).exists():
        image = kw["og_image"] = site["base_url"] + "/" + s["sheets"][0]["src"]
    out = f'products/{p["slug"]}.html'
    kw["head_extra"] = seo_head(site, p, out, image)
    emit(out, f'{p["title"]} MCAT {p["aamc"]} Pack | StudyStore', desc, body, **kw)


def bundle_page(site, items, b, emit, tpl):
    root = "../"
    avail = b["status"] == "available"
    rows = []
    for i, m in enumerate(b["members"], 1):
        p = items[m]
        st = "ready" if p["status"] == "available" else "coming soon"
        rows.append(f'<li><span><a href="{m}.html">{E(p["aamc"])} {esc(p["title"])}</a></span><span>{E(p["price"])} &middot; {st}</span></li>')
    status = ("Every pack in this bundle is ready." if avail else
              f'{b["ready_count"]} of {b["pack_count"]} packs have passed accuracy review so far. The bundle goes on sale when all of them have.')
    body = fill(tpl, title=esc(b["title"]), pack_count=b["pack_count"], price=E(b["price"]), list_value=b["list_value_usd"],
                status=status, rows="".join(rows), buy=buy(items, b["slug"], root=root),
                ready=b["ready_count"], kicker="Bundle &middot; one-time" if avail else "Bundle &middot; coming soon")
    out = f'products/{b["slug"]}.html'
    emit(out, f'{b["title"]} MCAT Bundle | StudyStore',
         f'{b["title"]}: {b["pack_count"]} StudyStore MCAT packs for {b["price"]} (${b["list_value_usd"]} if bought separately).'
         + ("" if avail else " Coming soon."), body,
         head_extra=seo_head(site, b, out, site["base_url"] + "/assets/img/cheatsheet-p1.png", kind="bundle"))


def build_all(site, items, emit):
    tp = (ROOT / "templates" / "product.html").read_text()
    tb = (ROOT / "templates" / "bundle.html").read_text()
    # {{waitlist:<slug>}}: the launch-list copy shows only when this item cannot be bought (see waitlist.py)
    for p in site.get("products", []):
        pack_page(site, items, p, emit, tp.replace("{{waitlist}}", "{{waitlist:" + p["slug"] + "}}"))
    for b in site.get("bundles", []):
        bundle_page(site, items, b, emit, tb.replace("{{waitlist}}", "{{waitlist:" + b["slug"] + "}}"))
    emit("products/index.html", "All MCAT Packs and Bundles | StudyStore",
         "Every StudyStore MCAT pack and bundle, with prices and what is ready now.",
         '<div class="wrap phero"><p class="eyebrow mono"><span class="dot"></span>Catalog</p><h1 class="split">MCAT packs</h1>'
         f'<p class="lead reveal">One pack per MCAT content category. {len(available(site))} of {len(site.get("products", []))} are ready now; '
         'each one ships only after it passes an accuracy review.</p></div>'
         '<section class="packs"><div class="wrap">{{pack_grid}}</div></section>'
         '<section><div class="wrap narrow">{{waitlist}}</div></section>')
    emit("thanks.html", "Thank you | StudyStore", "Your StudyStore download.",
         (ROOT / "templates" / "thanks.html").read_text(), noindex=True)


def write_redirects(site):
    lines = ["# Generated by build.py (products_build.write_redirects). Retired product URLs."]
    for old, new in (site.get("retired_products") or {}).items():
        lines.append(f"/products/{old}.html /products/{new} 301")
        lines.append(f"/products/{old} /products/{new} 301")
    (ROOT / "_redirects").write_text("\n".join(lines) + "\n")
    for old in (site.get("retired_products") or {}):
        f = ROOT / "products" / f"{old}.html"
        if f.exists():
            f.unlink()

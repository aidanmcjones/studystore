#!/usr/bin/env python3
"""Programmatic practice-question pages (growth item G10). Isolated from build.py. Stdlib only.

Input:  content/practice/<aamc>-<slug>.md   (format documented in engine/PRACTICE_PROMPT.md)
        content/practice/categories.json     (aamc -> slug/title/blurb)
Output: practice/<aamc>-<slug>.html, practice/<aamc-lower>/index.html, practice/index.html

Quality gates (SystemExit on failure): 8 to 10 questions, 4 choices, a lettered answer, an explanation
of at least 25 words, a primer of at least 100 words, unique stems across the whole site, no em dashes,
no "official exam" claims, answer letters not all identical.
"""
import json, re, html
from pathlib import Path
from mdlite import convert, parse_frontmatter, inline

STYLE = """<style>
.practice .crumbs{font-size:.9rem;color:var(--muted);margin:18px 0 6px}
.practice .lead-sm{font-size:1.1rem;color:var(--muted)}
.pq{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:18px 20px;margin:18px 0}
.pq h3{margin:0 0 .5em;font-size:1.05rem;color:var(--accent-d)}
.pq .stem p{margin:.4em 0}
.pq ol.choices{list-style:upper-alpha;padding-left:1.6em;margin:.6em 0}
.pq ol.choices li{margin:.3em 0}
.pq details{margin:.8em 0 0;background:#fff}
.pq details .ans{font-weight:700;color:var(--teal)}
.pq table{border-collapse:collapse;margin:.6em 0;font-size:.95rem}
.pq th,.pq td{border:1px solid var(--line);padding:5px 10px;text-align:left}
.pq th{background:#efe8d9}
.notelinks{margin:1.2em 0;font-size:.95rem}
.catlist{list-style:none;padding:0}
.catlist li{margin:.8em 0}
</style>
"""

TOOLS = {"pka-trainer": "pKa and charge trainer", "amino-acid-quiz": "Amino acid quiz",
         "mcat-study-schedule": "MCAT study schedule builder", "mcat-percentile": "MCAT percentile lookup"}

def _words(t):
    return len(re.findall(r"\w+", t))

def _plain(t):
    return html.unescape(re.sub(r"<[^>]+>", "", t)).strip()

def parse_questions(text, fname):
    qs = []
    for block in re.split(r"(?m)^### Q\d+\s*$", text)[1:]:
        m = re.search(r"(?ms)^(.*?)^A\) (.*?)^ANSWER: ([A-D])\s*\nWHY: (.*)$", "\n".join(["", block.strip("\n")]) + "\n")
        if not m:
            raise SystemExit(f"{fname}: malformed question block: {block[:60]!r}")
        stem = m.group(1).strip()
        chs = re.findall(r"(?m)^([A-D])\) (.*)$", "A) " + m.group(2))
        if [c[0] for c in chs] != list("ABCD"):
            raise SystemExit(f"{fname}: need exactly choices A to D in order: {stem[:50]!r}")
        qs.append(dict(stem=stem, choices=[c[1].strip() for c in chs], answer=m.group(3), why=m.group(4).strip()))
    return qs

def load(root, products, note_slugs):
    d = Path(root) / "content" / "practice"
    cats = json.loads((d / "categories.json").read_text())
    pages, seen = [], {}
    for f in sorted(d.glob("*.md")):
        meta, text = parse_frontmatter(f.read_text())
        for req in ("title", "description", "aamc", "category", "cluster", "product", "published"):
            if req not in meta:
                raise SystemExit(f"{f.name}: missing frontmatter '{req}'")
        if meta["aamc"] not in cats:
            raise SystemExit(f"{f.name}: aamc {meta['aamc']} not in categories.json")
        if not f.stem.lower().startswith(meta["aamc"].lower() + "-"):
            raise SystemExit(f"{f.name}: file name must start with the aamc code")
        if meta["product"] != "none" and meta["product"] not in products:
            raise SystemExit(f"{f.name}: unknown product {meta['product']}")
        meta["product_status"] = (products.get(meta["product"]) or {}).get("status", "available") if meta["product"] != "none" else ""
        notes = [x.strip() for x in meta.get("notes", "").split(",") if x.strip()]
        for n in notes:
            if n not in note_slugs:
                raise SystemExit(f"{f.name}: notes link {n} does not exist")
        tools = [x.strip() for x in meta.get("tools", "").split(",") if x.strip()]
        for x in tools:
            if x not in TOOLS:
                raise SystemExit(f"{f.name}: unknown tool {x}")
        if "@@QUESTIONS" not in text:
            raise SystemExit(f"{f.name}: missing @@QUESTIONS marker")
        primer_md, qtext = text.split("@@QUESTIONS", 1)
        qs = parse_questions(qtext, f.name)
        if not 8 <= len(qs) <= 10:
            raise SystemExit(f"{f.name}: need 8 to 10 questions, found {len(qs)}")
        if _words(primer_md) < 100:
            raise SystemExit(f"{f.name}: primer under 100 words (thin page)")
        if len({q['answer'] for q in qs}) < 3:
            raise SystemExit(f"{f.name}: answer letters not varied")
        for q in qs:
            if _words(q["why"]) < 25:
                raise SystemExit(f"{f.name}: explanation under 25 words: {q['stem'][:50]!r}")
            key = re.sub(r"\W+", " ", q["stem"].lower()).strip()
            if key in seen:
                raise SystemExit(f"{f.name}: duplicate stem also in {seen[key]}")
            seen[key] = f.name
        blob = text + meta["title"] + meta["description"]
        if "—" in blob or "–" in blob:
            raise SystemExit(f"{f.name}: contains a dash character that is banned (em or en dash)")
        if re.search(r"(?i)\b(official|real mcat|actual mcat|aamc[- ]approved)\b", blob):
            raise SystemExit(f"{f.name}: forbidden claim wording")
        if "{{" in blob:
            raise SystemExit(f"{f.name}: contains {{{{")
        pages.append(dict(slug=f.stem, meta=meta, primer_md=primer_md, qs=qs, notes=notes, tools=tools,
                          noindex=meta.get("noindex") == "true", cat=cats[meta["aamc"]], words=_words(text)))
    pages.sort(key=lambda p: (p["meta"]["aamc"], p["slug"]))
    return pages, cats

def _esc(t):
    return t.replace("{{", "&#123;&#123;")

def _q_html(i, q):
    ch = "".join(f"<li>{inline(_esc(c))}</li>" for c in q["choices"])
    letter = q["answer"]
    ans = q["choices"]["ABCD".index(letter)]
    return (f'<section class="pq" id="q{i}"><h3>Question {i}</h3>'
            f'<div class="stem">{convert(_esc(q["stem"]))}</div><ol class="choices" type="A">{ch}</ol>'
            f'<details><summary>Show answer and explanation</summary>'
            f'<p><span class="ans">Answer: {letter}.</span> {inline(_esc(ans))}</p>'
            f'<p>{inline(_esc(q["why"]))}</p></details></section>')

def _jsonld(p, BASE, notes_by_slug):
    url = f"{BASE}/practice/{p['slug']}.html"
    parts = []
    for i, q in enumerate(p["qs"], 1):
        letter = q["answer"]
        parts.append({
            "@type": "Question", "eduQuestionType": "Multiple choice",
            "name": f"Question {i}", "text": _plain(convert(q["stem"])),
            "suggestedAnswer": [{"@type": "Answer", "text": _plain(inline(c))} for c in q["choices"]],
            "acceptedAnswer": {"@type": "Answer",
                               "text": f"{letter}. {_plain(inline(q['choices']['ABCD'.index(letter)]))} {_plain(inline(q['why']))}"}})
    quiz = {"@context": "https://schema.org", "@type": "Quiz", "name": p["meta"]["title"],
            "description": p["meta"]["description"], "url": url, "inLanguage": "en",
            "isAccessibleForFree": True, "educationalLevel": "Undergraduate pre-health",
            "about": {"@type": "Thing", "name": p["meta"]["cluster"]},
            "datePublished": p["meta"]["published"], "dateModified": p["meta"].get("updated", p["meta"]["published"]),
            "author": {"@type": "Organization", "name": "StudyStore", "url": BASE + "/"},
            "publisher": {"@type": "Organization", "name": "StudyStore", "url": BASE + "/"},
            "hasPart": parts}
    crumbs = {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
        {"@type": "ListItem", "position": 1, "name": "Practice questions", "item": BASE + "/practice/index.html"},
        {"@type": "ListItem", "position": 2, "name": f"{p['meta']['aamc']} {p['cat']['title']}",
         "item": f"{BASE}/practice/{p['cat']['slug']}/index.html"},
        {"@type": "ListItem", "position": 3, "name": p["meta"]["title"], "item": url}]}
    return "".join(f'<script type="application/ld+json">{json.dumps(o, ensure_ascii=False).replace("</", "<\\/")}</script>\n'
                   for o in (quiz, crumbs))

def _crumbs_ld(base, *pairs):
    o = {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
        {"@type": "ListItem", "position": i, "name": n, "item": u}
        for i, (n, u) in enumerate([("StudyStore", base + "/")] + list(pairs), 1)]}
    return f'<script type="application/ld+json">{json.dumps(o, ensure_ascii=False)}</script>\n'

CTA_ARM_PAGES = set()  # set by build.py
SOCIAL_CTA_PAGES = set()  # set by build.py


SECTION_ORDER = ["Bio/Biochem", "Chem/Phys", "Psych/Soc", "CARS"]
SECTION_OF = {}  # AAMC code -> MCAT section name; set by build.py from site.json products

def build_all(emit, root, pages, cats, notes_by_slug, base_url):
    tpl = (Path(root) / "templates" / "practice.html").read_text()
    hub_tpl = (Path(root) / "templates" / "practice_hub.html").read_text()
    live = [p for p in pages if not p["noindex"]]
    def fill(t, d):
        for k, v in d.items():
            t = t.replace(f"[[{k}]]", v)
        return t
    for p in pages:
        m = p["meta"]
        notelinks = ""
        pnotes = p["notes"] or [s for s, n in notes_by_slug.items() if m["product"] != "none" and n["meta"].get("product") == m["product"]][:3]
        if pnotes:
            notelinks = ("<strong>Free notes for this topic:</strong> " + " &middot; ".join(
                f'<a href="{{{{root}}}}notes/{n}.html">{html.escape(notes_by_slug[n]["meta"]["title"])}</a>' for n in pnotes))
        if p["tools"]:
            notelinks += ("<br><strong>Free tools:</strong> " + " &middot; ".join(
                f'<a href="{{{{root}}}}tools/{x}.html">{TOOLS[x]}</a>' for x in p["tools"]))
        if m["product"] != "none":
            pr = m["product"]
            lead = ("is a {{price:%s}} pack" % pr) if m.get("product_status") == "available" else ("is coming soon, a planned {{price:%s}} pack" % pr)
            import products_build as PB
            _s = (PB.sample(pr) or {}) if m.get("product_status") == "available" else {}
            _c = (_s.get("cards") or [None])[0]
            _thumb = (f'<a class="cta-thumb" href="{{{{root}}}}products/{pr}.html#preview"><img src="{{{{root}}}}{_c["src"]}" alt="Real sample card from the pack" width="{_c["w"]}" height="{_c["h"]}" loading="lazy"></a>'
                      if _c and (Path(root) / _c["src"]).exists() else "")
            cta = (f'<aside class="cta">{_thumb}<div><strong>Want this as spaced-repetition cards?</strong>'
                   f'<p>{{{{title:{pr}}}}} {lead} with original Anki cards, a study guide and a printable cheat sheet. '
                   f'<a href="{{{{root}}}}products/{pr}.html">See what is inside</a>.</p></div>{{{{buy:{pr}}}}}</aside>')
        else:
            cta = (f'<aside class="cta"><div><strong>Study this topic with spaced repetition</strong>'
                   f'<p>StudyStore makes one pack per MCAT content category: original Anki cards, an illustrated study guide, a printable cheat sheet and practice questions. '
                   f'<a href="{{{{root}}}}products/index.html">See every pack</a>.</p></div></aside>')
        same = [x for x in live if x["meta"]["aamc"] == m["aamc"] and x["slug"] != p["slug"]]
        more = "".join(f'<li><a href="{{{{root}}}}practice/{x["slug"]}.html">{html.escape(x["meta"]["title"])}</a></li>' for x in same)
        more += f'<li><a href="{{{{root}}}}practice/{p["cat"]["slug"]}/index.html">All {m["aamc"]} practice pages</a></li>'
        more += '<li><a href="{{root}}practice/index.html">All practice questions</a></li><li><a href="{{root}}notes/index.html">Free study notes</a></li><li><a href="{{root}}tools/mcat-study-schedule.html">Build an MCAT study schedule</a></li>'
        body = fill(tpl, dict(
            cat_slug=p["cat"]["slug"], cat_code=m["aamc"], cat_title=html.escape(p["cat"]["title"]),
            title=html.escape(m["title"]), published=m["published"], nq=str(len(p["qs"])),
            mins=str(max(5, round(len(p["qs"]) * 1.5))), description=html.escape(m["description"]),
            primer=convert(_esc(p["primer_md"])), notelinks=notelinks, cta_top=("{{topbuy:%s%s}}" % (m["product"], ":social-cta" if "practice/" + p["slug"] in SOCIAL_CTA_PAGES else "")) if m["product"] != "none" else "",
            questions="".join(_q_html(i, q) for i, q in enumerate(p["qs"], 1)), cta=cta, more=more))
        emit(f"practice/{p['slug']}.html", m.get("seo_title") or f'{m["title"]} | StudyStore', m.get("seo_description") or m["description"], body,
             noindex=p["noindex"], og_type="article", head_extra=STYLE + _jsonld(p, base_url, notes_by_slug),
             lastmod=m.get("updated", m["published"]))
    # category hubs
    for code, c in cats.items():
        items = [x for x in live if x["meta"]["aamc"] == code]
        if not items:
            continue
        lis = "".join(f'<li><a href="{{{{root}}}}practice/{x["slug"]}.html"><strong>{html.escape(x["meta"]["title"])}</strong></a>'
                      f'<p class="meta">{html.escape(x["meta"]["description"])}</p></li>' for x in items)
        nl = sorted({n for x in items for n in x["notes"]})
        extra = sorted(sl for sl, n in notes_by_slug.items() if n["meta"].get("product") in {x["meta"]["product"] for x in items} and sl not in nl)
        nl = (nl + extra)[:10]
        notes_html = ""
        if nl:
            notes_html = "<h2>Free study notes for this section</h2><ul>" + "".join(
                f'<li><a href="{{{{root}}}}notes/{n}.html">{html.escape(notes_by_slug[n]["meta"]["title"])}</a></li>' for n in nl) + "</ul>"
        nq = sum(len(x["qs"]) for x in items)
        topics = []
        for x in items:
            for t in x["meta"]["cluster"].split(","):
                t = t.strip()
                if t and t.lower() not in {u.lower() for u in topics}:
                    topics.append(t)
        topics_html = ("<h2>Topics covered</h2><p>" + html.escape("; ".join(topics[:24])) + ".</p>") if topics else ""
        samples, ns = "", 0
        for x in items:
            if ns >= 3:
                break
            q = next((q for q in x["qs"] if "|" not in q["stem"] and "![" not in q["stem"] and len(q["stem"]) < 700), None)
            if q:
                i = x["qs"].index(q) + 1
                samples += _q_html(i, q).replace(f'<h3>Question {i}</h3>', f'<h3>Sample: <a href="{{{{root}}}}practice/{x["slug"]}.html#q{i}">{html.escape(x["meta"]["title"])}</a></h3>')
                ns += 1
        samples_html = ("<h2>Sample questions</h2>" + samples) if samples else ""
        plist = [x["meta"]["product"] for x in items if x["meta"]["product"] != "none"]
        pack_html = ""
        if plist:
            pk = max(set(plist), key=plist.count)
            pack_html = (f'<h2>The matching pack</h2><p>{{{{title:{pk}}}}} covers this section with original Anki cards, an illustrated study guide and a printable cheat sheet. '
                         f'<a href="{{{{root}}}}products/{pk}.html">See what is inside the pack</a>.</p>')
        intro = (f'<p>{html.escape(c["blurb"])} This section has {len(items)} topic page{"s" if len(items) != 1 else ""} with {nq} original practice questions in all, '
                 f'each with a short concept primer and a full explanation for every answer choice. Work a topic page, check the explanation, then read the matching note.</p>')
        prods = [x["meta"]["product"] for x in items if x["meta"]["product"] != "none"]
        hub_cta = ("{{topbuy:%s}}" % max(set(prods), key=prods.count)) if prods else ""
        body = fill(hub_tpl, dict(eyebrow=f"Free MCAT-style practice, {code}", title=html.escape(f"{c['title']} Practice Questions"),
                                  lead=html.escape(c["blurb"] + " Original questions with full explanations, free, no signup."),
                                  body=f'{hub_cta}{intro}{topics_html}<h2>Topic pages</h2><ul class="catlist">{lis}</ul>{samples_html}{notes_html}{pack_html}<p><a href="{{{{root}}}}practice/index.html">All practice categories</a></p>'))
        emit(f"practice/{c['slug']}/index.html", f"MCAT {c['title']} Practice Questions | StudyStore",
             f"Free MCAT-style {c['title']} practice: {nq} original questions across {len(items)} topic page{'s' if len(items) != 1 else ''}, with the topics covered, sample questions and full explanations.", body,
             head_extra=STYLE + _crumbs_ld(base_url, ("Practice questions", f"{base_url}/practice/index.html"),
                                           (f"{code} {c['title']}", f"{base_url}/practice/{c['slug']}/index.html")),
             lastmod="2026-11-04")
    # main hub
    secs = ""
    last_sec = None
    for code, c in sorted(cats.items(), key=lambda kv: (SECTION_ORDER.index(SECTION_OF.get(kv[0], "CARS")), list(cats).index(kv[0]))):
        items = [x for x in live if x["meta"]["aamc"] == code]
        if not items:
            continue
        sec = SECTION_OF.get(code)
        if sec and sec != last_sec:
            secs += f'<h2 class="secthead" id="{sec.lower().replace("/", "-").replace(" ", "-")}">{html.escape(sec)} practice questions</h2>'
            last_sec = sec
        lis = "".join(f'<li><a href="{{{{root}}}}practice/{x["slug"]}.html">{html.escape(x["meta"]["title"])}</a></li>' for x in items)
        secs += (f'<h3><a href="{{{{root}}}}practice/{c["slug"]}/index.html">{code}: {html.escape(c["title"])}</a></h3>'
                 f'<p class="meta">{html.escape(c["blurb"])}</p><ul>{lis}</ul>')
    total = sum(len(x["qs"]) for x in live)
    body = fill(hub_tpl, dict(eyebrow="Free MCAT-style practice", title="MCAT Practice Questions by Topic",
                              lead=f"{total} original practice questions across {len(live)} topic pages, each with a concept primer and a full explanation for every answer. Free, no signup.",
                              body="{{topbuy:feat}}" + secs))
    emit("practice/index.html", "Free MCAT Practice Questions by Topic | StudyStore",
         f"{total} free, original MCAT-style practice questions by topic with full explanations: biology, biochemistry, general and organic chemistry, physics, psychology and sociology.",
         body, head_extra=STYLE + _crumbs_ld(base_url, ("Practice questions", f"{base_url}/practice/index.html")), lastmod="2026-11-04")
    return live

def note_links(slug, live, cats):
    rel = [p for p in live if slug in p["notes"]]
    if not rel:
        return ""
    return ("<h2>Practice this topic</h2><ul>" + "".join(
        f'<li><a href="../practice/{p["slug"]}.html">{html.escape(p["meta"]["title"])}</a></li>' for p in rel) + "</ul>")

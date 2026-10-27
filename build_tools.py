"""Free interactive tools: /tools/*.html. Called from build.py with the site's emit() helper.

Everything is client-side. Data files (data/*.json) are inlined into each page as application/json
so nothing but HTML, CSS and JS needs to be deployed. Stdlib only.
"""
import json, html, datetime
import products_build as PB
from pathlib import Path

ROOT = Path(__file__).parent
CATALOG_SRC = Path("/Users/aidanjones/dev/studystore/engine/CATALOG.json")  # private source, optional at build time

TEST_DATES_2027 = [
    "2027-01-15", "2027-01-16", "2027-01-21", "2027-01-29", "2027-01-30", "2027-02-12", "2027-03-06", "2027-03-19",
    "2027-04-09", "2027-04-10", "2027-04-16", "2027-04-17", "2027-05-01", "2027-05-07", "2027-05-08", "2027-05-13",
    "2027-05-14", "2027-05-21", "2027-05-29", "2027-06-11", "2027-06-12", "2027-06-25", "2027-06-26", "2027-07-09",
    "2027-07-10", "2027-07-23", "2027-07-30", "2027-08-14", "2027-08-20", "2027-08-21", "2027-08-28", "2027-09-02",
    "2027-09-03", "2027-09-10", "2027-09-11"]
assert len(TEST_DATES_2027) == 35
TEST_DATES_SOURCE = "https://students-residents.aamc.org/register-mcat-exam/us-mcat-calendar-scheduling-deadlines-and-score-release-dates-0"
TEST_DATES_CHECKED = "2026-10-21"

# Free notes and practice pages by AAMC code are derived at build time from content frontmatter (build.py passes
# them in), so every category with a free page links to it and nothing is hand-maintained here.
PACK_AAMC = {}  # product slug -> AAMC code; filled in build() from site.json available packs

TOOLS = [
    ("amino-acid-quiz", "Amino Acid Quiz", "Free amino acid quiz: names, codes, structures, charge and pI | StudyStore",
     "Free MCAT amino acid quiz with the 20 standard residues: names and codes, structures, side-chain class, charge at a chosen pH and pI. No signup."),
    ("pka-trainer", "pKa and Charge at pH Trainer", "pKa Quiz: Free MCAT pKa and Charge at pH Practice | StudyStore",
     "Free pKa quiz for the MCAT. Practice Henderson-Hasselbalch: decide if a group is protonated, find the net charge of a short peptide at any pH, with the working shown. Free, no signup."),
    ("mcat-study-schedule", "MCAT Study Schedule Generator", "MCAT Study Schedule Generator: Free Week-by-Week Study Plan | StudyStore",
     "Free MCAT study plan generator: enter your 2027 test date, weekly hours, weak sections and full-length count for a week-by-week MCAT study schedule. Printable, runs in your browser."),
    ("mcat-percentile", "MCAT Score Calculator: Percentile and Target Score", "MCAT Score Calculator: Percentile and Target Score | StudyStore",
     "Free MCAT score calculator: look up MCAT total and section percentile ranks from the official AAMC table in effect May 2026 to April 2027, and find the score needed for a target percentile."),
]

FOOT_CTA = ('<aside class="cta"><div><strong>Want these facts as spaced-repetition cards?</strong>'
            '<p>{{title:1a-amino-acids-proteins}} is a {{price:1a-amino-acids-proteins}} pack with original Anki cards, a study guide and a printable cheat sheet. '
            '<a href="{{root}}products/1a-amino-acids-proteins.html" data-track="cta">See what is inside</a>.</p></div>{{buy:1a-amino-acids-proteins}}</aside>')

EMBED_BOX = ('<section class="panel embedbox noembed"><h2>Embed this tool</h2><p class="meta">Free to embed on a club, tutoring or study-group site. '
             'The credit link stays in the snippet.</p><textarea id="embed-code" readonly aria-label="Embed code"></textarea>'
             '<p><button type="button" class="tbtn" id="embed-copy">Copy embed code</button></p></section>')

FAQ = {
 "amino-acid-quiz": [
  ("Which pKa values does the quiz use?", "Typical textbook values: about 2 for the alpha carboxyl group, 9 to 10 for the alpha amino group, and side-chain values of 3.9 (Asp), 4.1 (Glu), 6.0 (His), 8.3 (Cys), 10.1 (Tyr), 10.5 (Lys) and 12.5 (Arg). Sources differ by a few tenths, so use the numbers your course or passage gives you."),
  ("How is charge at a chosen pH calculated?", "For each ionizable group the tool computes the fraction charged with the Henderson-Hasselbalch relation, then sums the charges. Acids count as -1 when deprotonated and bases as +1 when protonated. The answer is rounded to the nearest whole number only when the sum is clearly near an integer."),
  ("How is the isoelectric point (pI) found?", "The pI is the pH where the net charge is zero. The tool finds it numerically, and the explanation shows the shortcut: average the two pKa values on either side of the neutral form."),
  ("Does the quiz save my scores or collect personal data?", "No account is needed. Your best score is stored only in your own browser. StudyStore counts anonymous page views and clicks and nothing else."),
 ],
 "pka-trainer": [
  ("What is the Henderson-Hasselbalch equation?", "pH = pKa + log([A-]/[HA]). When the pH equals the pKa the group is half protonated. Each unit above or below the pKa changes the ratio of the two forms by a factor of 10."),
  ("Which pKa values are used for peptide termini?", "A teaching convention of 2.0 for the C-terminal carboxyl and 9.0 for the N-terminal amino group. Real peptide termini shift by up to about a unit depending on neighbors, so follow the values given in your exam passage."),
  ("Why does the trainer avoid pH values very close to a pKa?", "Right at the pKa a group is about half charged, which makes a whole-number answer ambiguous. The questions keep a clear margin so there is one defensible answer."),
  ("Is this a substitute for my course materials?", "No. It is a practice aid built from standard facts. Always check numbers against the reference your exam or instructor provides."),
 ],
 "mcat-study-schedule": [
  ("Which MCAT dates are included?", "The 35 test dates in the published 2027 calendar, from January 15 to September 11, 2027. Always confirm your date and registration on the AAMC website."),
  ("How does the plan choose what to study each week?", "Content review hours are split across the AAMC content categories in proportion to how many subtopics each covers, with extra weight for the sections you mark as weak. Later weeks shift toward practice and targeted review, and CARS gets steady weekly time."),
  ("Does the plan predict my score?", "No. It organizes your time. It makes no claim about score outcomes."),
  ("Is my data sent anywhere?", "No. The plan is built in your browser. The calendar file and print view are created on your device."),
 ],
 "mcat-percentile": [
  ("Where do the percentile numbers come from?", "From the AAMC table Summary of MCAT Total and Section Scores, Percentile Ranks in Effect May 1, 2026 to April 30, 2027, based on all MCAT results from 2023, 2024 and 2025. StudyStore transcribed the numbers and checked them against the source."),
  ("What does a percentile rank mean?", "It is the percentage of scores equal to or less than a given score. For example, AAMC notes that 74 percent of total scores were at or below 508 in the reference group."),
  ("Can this convert my practice test raw score to a scaled score?", "No. AAMC does not publish a raw-to-scaled conversion, so this tool does not estimate one."),
  ("How often is the table updated?", "AAMC updates percentile ranks each May 1. This page states the date range its numbers are valid for and shows a warning once that range has passed."),
 ],
}

def ld(*objs):
    return "".join(f'<script type="application/ld+json">{json.dumps(o, ensure_ascii=False).replace("</", "<\\/")}</script>\n' for o in objs)

def jsn(obj):
    return json.dumps(obj, separators=(",", ":"), ensure_ascii=False).replace("</", "<\\/")

def faq_html(slug):
    return "".join(f'<details class="q"><summary>{html.escape(q)}</summary><div><p>{html.escape(a)}</p></div></details>' for q, a in FAQ[slug])

def build(emit, site, products, notes_meta, notes_by_aamc=None, practice_by_aamc=None):
    """notes_meta: {slug: title}. notes_by_aamc / practice_by_aamc: {AAMC code: [(slug, title), ...]} for the schedule."""
    base = site["base_url"]
    today = datetime.date.today().isoformat()
    # ---- public catalog data (slug, aamc, title, subtopic_count, section only) ----
    data_dir = ROOT / "data"
    if CATALOG_SRC.exists():
        cat = json.loads(CATALOG_SRC.read_text())
        pub = [{k: c[k] for k in ("slug", "aamc", "title", "subtopic_count", "section")} for c in cat["categories"]]
        (data_dir / "catalog_public.json").write_text(json.dumps(pub, indent=1) + "\n")
    pub = json.loads((data_dir / "catalog_public.json").read_text())
    aa = json.loads((data_dir / "amino_acids.json").read_text())
    pct = json.loads((data_dir / "aamc_percentiles_2026.json").read_text())

    PACK_AAMC.update({p["slug"]: p["aamc"] for p in site.get("products", []) if p.get("status") == "available"})
    packs = {}
    for slug, code in PACK_AAMC.items():
        if slug in products:
            p = products[slug]
            packs[code] = {"title": p["title"], "href": f"products/{slug}.html", "price": p["price"], "buyable": PB.buyable(p)}
    notes = {code: [{"slug": sl, "title": t} for sl, t in items] for code, items in (notes_by_aamc or {}).items() if items}
    practice = {code: [{"slug": sl, "title": t} for sl, t in items] for code, items in (practice_by_aamc or {}).items() if items}
    for sl in (x["slug"] for v in notes.values() for x in v):
        if sl not in notes_meta:
            raise SystemExit(f"tools: note {sl} not found")
    sched = {"categories": pub, "packs": packs, "notes": notes, "practice": practice, "dates": TEST_DATES_2027,
             "dates_source": TEST_DATES_SOURCE, "dates_checked": TEST_DATES_CHECKED}

    def page(slug, h1, lead, tool_html, scripts, explainer, data_blocks="", embed=True, cta=True):
        title, desc = next((t[2], t[3]) for t in TOOLS if t[0] == slug)
        url = f"{base}/tools/{slug}.html"
        webapp = {"@context": "https://schema.org", "@type": "WebApplication", "name": h1, "url": url, "description": desc,
                  "applicationCategory": "EducationalApplication", "operatingSystem": "Any (runs in a web browser)",
                  "browserRequirements": "Requires JavaScript", "isAccessibleForFree": True, "inLanguage": "en",
                  "offers": {"@type": "Offer", "price": "0", "priceCurrency": "USD"},
                  "image": f"{base}/assets/tools/og-{slug}.png", "datePublished": "2026-10-20", "dateModified": today,
                  "publisher": {"@type": "Organization", "name": "StudyStore", "url": base + "/"}}
        faq = {"@context": "https://schema.org", "@type": "FAQPage",
               "mainEntity": [{"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in FAQ[slug]]}
        crumbs = {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "StudyStore", "item": base + "/"},
            {"@type": "ListItem", "position": 2, "name": "Free tools", "item": base + "/tools/"},
            {"@type": "ListItem", "position": 3, "name": h1, "item": url}]}
        head = ('<link rel="stylesheet" href="{{root}}assets/tools.css">'
                '<script>if(/[?&]embed=1/.test(location.search))document.documentElement.classList.add("embed")</script>' + ld(webapp, faq, crumbs))
        others = "".join(f'<li><a href="{t[0]}.html">{html.escape(t[1])}</a></li>' for t in TOOLS if t[0] != slug)
        body = f"""<div class="wrap tool">
<p class="eyebrow mono noembed"><span class="dot"></span>Free MCAT tool</p>
<h1>{html.escape(h1)}</h1>
<p class="lead noembed">{lead}</p>
<section class="panel" style="border-top:1px solid var(--line)" aria-label="{html.escape(h1)}">
{tool_html}
</section>
<p class="embed-credit">Free tool by <a href="{url}" target="_top">StudyStore</a></p>
<div class="prose noembed">{explainer}</div>
{FOOT_CTA if cta else ""}
<div class="noembed">{{{{waitlist}}}}</div>
<section class="noembed"><h2>Questions</h2>{faq_html(slug)}</section>
{EMBED_BOX if embed else ""}
<section class="noembed"><h2>More free tools</h2><ul><li><a href="index.html">All free tools</a></li>{others}<li><a href="{{{{root}}}}notes/index.html">Free study notes</a></li></ul></section>
{data_blocks}
<noscript><p class="warn">This tool needs JavaScript. Nothing is sent to a server; it all runs in your browser.</p></noscript>
<script src="{{{{root}}}}assets/js/tools/common.js" defer></script>
{scripts}
</div>"""
        emit(f"tools/{slug}.html", title, desc, body, og_image=f"{base}/assets/tools/og-{slug}.png", head_extra=head, lastmod=today)

    aa_json = f'<script type="application/json" id="aa-data">{jsn(aa)}</script>'

    # ---------------- amino acid quiz ----------------
    page("amino-acid-quiz", "Amino Acid Quiz",
         "Ten-question rounds on the 20 standard amino acids: names, codes, structures, classes, charge at a chosen pH and pI. Missed items come back later in the round.",
         '<div class="modes" id="modes" role="group" aria-label="Quiz mode"></div><div id="qbox" aria-live="off"></div>',
         '<script src="{{root}}assets/js/tools/aaquiz.js" defer></script>',
         """<h2>How to use this quiz</h2>
<p>Amino acids are the most reliable source of biochemistry points on the MCAT because every question rests on the same few facts: the name and code of each residue, what its side chain looks like, and what charge it carries in a given solution. This quiz drills each of those in short rounds. Pick a single mode to focus, or leave it on mixed to practice recognizing a residue from any angle.</p>
<p>The <strong>structure</strong> mode draws each residue as a zwitterion, with a positive ammonium group and a negative carboxylate. The <strong>charge</strong> mode asks for the net charge of the free amino acid at a pH from 1 to 14. The tool computes every answer from the pKa values with the Henderson-Hasselbalch relation, adding up one term per ionizable group. The <strong>pI</strong> mode asks for the pH where the net charge is zero. For an amino acid with a neutral side chain, that is the average of the two backbone pKa values. For an acidic one, average the two lowest pKa values. For a basic one, average the two highest.</p>
<p>Questions you miss return a few questions later, and items you keep missing are drawn more often, so a round spends its time where you are weakest. Classes follow a common five-group scheme (nonpolar, aromatic, polar, acidic, basic). Textbooks disagree about a few residues such as Tyr, His, Cys and Gly, so follow the scheme in your own course.</p>
<p>Want the explanation behind the numbers? Read <a href="../notes/amino-acid-pka-charge-ph-7-4.html">Amino Acid pKa Values and Charge at pH 7.4</a>, then practice the arithmetic in the <a href="pka-trainer.html">pKa and charge trainer</a>.</p>""",
         aa_json)

    # ---------------- pKa trainer ----------------
    page("pka-trainer", "pKa Quiz: pKa and Charge at pH Trainer",
         "Practice Henderson-Hasselbalch the way the MCAT uses it: is a group protonated, and what is the net charge of a short peptide at a given pH? The working is shown every time.",
         '<div class="modes" id="modes" role="group" aria-label="Trainer mode"></div>'
         '<p class="progress"><span id="scorewrap"><span id="score"></span></span><span id="hidewrap"><label><input type="checkbox" id="hidepka"> Hide the pKa (memory challenge)</label></span></p>'
         '<div id="stage"></div>',
         '<script src="{{root}}assets/js/tools/pka.js" defer></script>',
         """<h2>The idea behind the trainer</h2>
<p>Every ionizable group is an acid-base pair, and the Henderson-Hasselbalch equation, pH = pKa + log([A-]/[HA]), tells you how the two forms split at any pH. If the pH is below the pKa, the protonated form wins. If it is above, the deprotonated form wins. At the pKa the two are equal. A difference of one pH unit corresponds to a ratio of ten to one, which is about 91 percent in the favored form.</p>
<p>Whether that matters for charge depends on the kind of group. An acidic group (a carboxyl, a thiol, a phenol) is neutral when protonated and negative when deprotonated. A basic group (an amino, imidazole or guanidinium group) is positive when protonated and neutral when deprotonated. Mixing those two up is the most common mistake on charge questions, which is why the first mode makes you commit to protonated or deprotonated before it shows the arithmetic.</p>
<p>The <strong>peptide</strong> mode scales the same logic up. A short peptide has one free N-terminus, one free C-terminus and a side chain for each ionizable residue. Add one charge contribution per group and you have the net charge. The tool lists every group, its pKa, the distance from the pH and the fraction in the charged form, so you can see exactly where your own estimate went wrong. The <strong>explorer</strong> lets you slide the pH and watch charge and pI change for any residue.</p>
<p>For background, read <a href="../notes/henderson-hasselbalch-for-the-mcat.html">The Henderson-Hasselbalch Equation for the MCAT</a> and <a href="../notes/amino-acid-pka-charge-ph-7-4.html">Amino Acid pKa Values and Charge at pH 7.4</a>. Values are typical textbook numbers and sources differ by a few tenths.</p>""",
         aa_json)

    # ---------------- schedule ----------------
    form = """<form id="sf" class="noprint"><div class="fields">
<label>MCAT test date (2027)<select id="f-test" required><option value="">Select a date</option></select></label>
<label>Start date<input type="date" id="f-start" required></label>
<label>Study hours per week<input type="number" id="f-hours" min="3" max="80" step="1" value="20" inputmode="numeric"></label>
<label>Full-length exams you want<input type="number" id="f-fl" min="0" max="12" step="1" value="4" inputmode="numeric"></label>
</div>
<fieldset style="border:0;padding:0;margin:16px 0 0"><legend style="font-weight:600">Sections you want extra time on</legend>
<div class="checks"><label><input type="checkbox" id="w-bio_biochem"> Bio/Biochem</label><label><input type="checkbox" id="w-chem_phys"> Chem/Phys</label><label><input type="checkbox" id="w-psych_soc"> Psych/Soc</label><label><input type="checkbox" id="w-cars"> CARS</label></div></fieldset>
<p><button class="tbtn primary" type="submit">Build my plan</button></p></form>
<div id="result" aria-live="polite"></div>"""
    page("mcat-study-schedule", "MCAT Study Schedule Generator",
         "Choose your 2027 test date, your weekly hours and your weak sections. Get a week-by-week plan by AAMC content category, with a calendar file and a printable view.",
         form, '<script src="{{root}}assets/js/tools/schedule.js" defer></script>',
         """<h2>How the plan is built</h2>
<p>The plan counts the weeks between your start date and your test date, then divides them into three stretches. Early weeks are <strong>content review</strong>. Middle weeks shift toward <strong>practice and targeted review</strong>. The last week is a <strong>final stretch</strong> with no new content in the last two days. CARS gets a steady slice of every week because it rewards daily repetition more than cramming.</p>
<p>During content review, your hours are split across the AAMC content categories in proportion to how many subtopics each one covers, using StudyStore's own topic titles and the public category codes (such as 1A or 5D). Marking a section as weak raises the weight of every category in it by half. Each week links the free StudyStore notes and free practice sets for its categories, so you can read first and then test yourself on the same topic. Practice weeks link the practice sets for the categories you are re-drilling.</p>
<p>The 35 test dates come from the AAMC 2027 calendar (<a href="https://students-residents.aamc.org/register-mcat-exam/us-mcat-calendar-scheduling-deadlines-and-score-release-dates-0" rel="noopener">AAMC U.S. MCAT calendar</a>, checked October 21, 2026). AAMC notes that U.S. and Canada testing on January 30, May 14, July 9 and August 28 is limited to select locations. Dates less than a week away are not offered. To keep the plan, print it or save it as a PDF; the print view shows only the plan.</p>
<p>The plan organizes your time and makes no claim about score outcomes. Adjust it to your own situation, and check dates and registration deadlines on the AAMC website. To see what a target score means in percentile terms, use the <a href="mcat-percentile.html">percentile lookup</a>.</p>""",
         f'<script type="application/json" id="sched-data">{jsn(sched)}</script>', embed=False)

    # ---------------- percentile ----------------
    ptool = f"""<p class="warn" id="expired" hidden><strong>This table has passed its valid date range ({pct["valid_from"]} to {pct["valid_to"]}).</strong> Check AAMC for the current table.</p>
<div class="grid">
<div><h2>Total score to percentile</h2><div class="fields"><label>Total score (472 to 528)<input id="t-score" type="number" min="472" max="528" step="1" value="510" inputmode="numeric"></label></div><div id="t-out" role="status" aria-live="polite"></div></div>
<div><h2>Target percentile to score</h2><div class="fields"><label>Target percentile (1 to 99)<input id="g-pct" type="number" min="1" max="99" step="1" value="90" inputmode="numeric"></label></div><div id="g-out" role="status" aria-live="polite"></div></div>
</div>
<h2 style="margin-top:28px">Section scores</h2>
<div class="fields">
<label>Chem/Phys (118 to 132)<input id="s-chem_phys" type="number" min="118" max="132" value="128" inputmode="numeric"></label>
<label>CARS (118 to 132)<input id="s-cars" type="number" min="118" max="132" value="127" inputmode="numeric"></label>
<label>Bio/Biochem (118 to 132)<input id="s-bio_biochem" type="number" min="118" max="132" value="128" inputmode="numeric"></label>
<label>Psych/Soc (118 to 132)<input id="s-psych_soc" type="number" min="118" max="132" value="128" inputmode="numeric"></label></div>
<div id="s-out" role="status" aria-live="polite"></div>
<details><summary>Full total-score table</summary><div class="tablewrap"><table><thead><tr><th>Total score</th><th>Percentile rank</th></tr></thead><tbody id="full-table"></tbody></table></div></details>
<p class="meta">Source: <a href="{pct["source_url"]}" rel="noopener">AAMC, Summary of MCAT Total and Section Scores, Percentile Ranks in Effect May 1, 2026 to April 30, 2027</a>. Based on all MCAT results from 2023, 2024 and 2025 combined. A percentile rank is the percentage of scores equal to or less than the score.</p>"""
    page("mcat-percentile", "MCAT Score Calculator: Percentile and Target Score",
         "Look up percentile ranks from the official AAMC table in effect May 2026 to April 2027, and see the lowest score that reaches a percentile you are aiming for.",
         ptool, '<script src="{{root}}assets/js/tools/percentile.js" defer></script>',
         """<h2>Reading the percentile table</h2>
<p>The AAMC publishes one table that converts each scaled score to a percentile rank, the percentage of test takers in a reference group who scored at or below that score. The current table is built from every MCAT result in 2023, 2024 and 2025 combined and takes effect each May 1. Because the scores are bunched near the middle, a point near 500 moves your percentile much more than a point near 525.</p>
<p>The total score is the sum of four section scores, each from 118 to 132, so the lowest possible total is 472 and the highest is 528. When you enter a target percentile, the tool returns the lowest total score that reaches it and shows one balanced set of section scores that adds up to that total. It does not convert practice-test raw scores to scaled scores, because AAMC does not publish such a conversion.</p>
<p>Planning backward from a target? Pair this with the <a href="mcat-study-schedule.html">study schedule generator</a>. This page is not affiliated with or endorsed by AAMC; the numbers are public facts transcribed from the source linked above.</p>""",
         f'<script type="application/json" id="pct-data">{jsn(pct)}</script>', cta=True)

    # ---------------- index ----------------
    cards = "".join(
        f'<article class="toolcard"><a href="{s}.html"><img src="../assets/tools/og-{s}.png" alt="" loading="lazy" width="1200" height="630"></a>'
        f'<div><h3><a href="{s}.html">{html.escape(h)}</a></h3><p class="meta">{html.escape(d)}</p></div></article>' for s, h, _, d in TOOLS)
    itemlist = {"@context": "https://schema.org", "@type": "ItemList", "name": "Free MCAT study tools",
                "itemListElement": [{"@type": "ListItem", "position": i + 1, "url": f"{base}/tools/{s}.html", "name": h} for i, (s, h, _, _) in enumerate(TOOLS)]}
    idx = f"""<div class="wrap phero"><p class="eyebrow mono"><span class="dot"></span>Free MCAT tools</p><h1 class="split">Free tools</h1>
<p class="lead">Interactive MCAT practice and planning tools. Free, no signup, runs in your browser, and nothing you enter leaves your device.</p></div>
<section><div class="wrap"><div class="toolgrid">{cards}</div></div></section>
<section><div class="wrap narrow"><h2>Comparison guides</h2><ul><li><a href="../compare/mcat-anki-decks-anking-miledown-pankow.html">AnKing vs MileDown vs Pankow vs StudyStore: MCAT Anki decks compared</a></li><li><a href="../compare/mcat-prep-cost-courses-vs-diy.html">MCAT prep cost in 2027: courses vs DIY, with official AAMC prices</a></li></ul></div></section>
<section><div class="wrap narrow">{{{{waitlist}}}}</div></section>"""
    emit("tools/index.html", "Free MCAT Tools: Amino Acid Quiz, pKa Trainer, Study Planner | StudyStore",
         "Free interactive MCAT tools: amino acid quiz, pKa and charge at pH trainer, 2027 study schedule generator and AAMC percentile lookup. No signup.",
         idx, og_image=f"{base}/assets/tools/og-index.png", head_extra='<link rel="stylesheet" href="{{root}}assets/tools.css">' + ld(itemlist), lastmod=today)

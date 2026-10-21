"""Comparison guides: /compare/*.html. Called from build.py with the site's emit() helper. Stdlib only.

Rules (marketing/SPEC-shared.md section 1): factual, sourced, dated and neutral. Every third-party number in
data/compare.json carries its URL, the as-of date, whether it is the maker's own page or a third-party page, and
an approximate flag; the page prints all of that next to the number. StudyStore's own numbers come from
site.json at build time, and the page says StudyStore wrote it. Money pages carry "Estimate, not advice".
No question content lives on these pages, so the practice overlap guard has nothing to check; the site audit
(links, JSON-LD, no dashes) covers them like any page.
"""
import html, json
from pathlib import Path

ROOT = Path(__file__).parent
E = html.escape


def money(x):
    if x is None:
        return "not listed"
    return ("$%s" % format(x, ",.2f")).replace(".00", "")


def src(r):
    kind = {"own": "own page", "listing": "AnkiWeb shared-deck listing, uploader not verified as the maker"}.get(r["source_type"], "third-party page")
    dated = f", page dated {E(r['page_date'])}" if r.get("page_date") else ""
    return f'<a href="{E(r["url"])}" rel="noopener">{E(r["source_name"])}</a> ({kind}{dated}, checked {E(r["as_of"])})'


def table(head, rows, num_cols=(), wide=False, label="Comparison table"):
    th = "".join(f'<th scope="col"{" class=n" if i in num_cols else ""}>{E(h)}</th>' for i, h in enumerate(head))
    body = "".join("<tr>" + "".join(f'<td{" class=n" if i in num_cols else ""}>{c}</td>' for i, c in enumerate(r)) + "</tr>" for r in rows)
    return f'<div class="tablewrap" role="region" aria-label="{E(label)}" tabindex="0"><table class="ctable{' wide' if wide else ''}"><thead><tr>{th}</tr></thead><tbody>{body}</tbody></table></div>'


def article_ld(base, url, title, desc, day):
    return {"@context": "https://schema.org", "@type": "Article", "headline": title, "description": desc,
            "datePublished": day, "dateModified": day, "inLanguage": "en", "mainEntityOfPage": url,
            "author": {"@type": "Organization", "name": "StudyStore", "url": base + "/"},
            "publisher": {"@type": "Organization", "name": "StudyStore", "url": base + "/"}}


def build(emit, site, ld_json, breadcrumbs):
    base = site["base_url"]
    d = json.loads((ROOT / "data" / "compare.json").read_text())
    day = d["checked"]
    packs = [p for p in site["products"] if p.get("status") == "available"]
    bundles = {b["slug"]: b for b in site["bundles"] if b.get("status") == "available"}
    cards = sum(p["contents"]["cards"] for p in packs)
    lo, hi = min(p["price_usd"] for p in packs), max(p["price_usd"] for p in packs)
    full = bundles.get("bundle-complete-mcat")
    sec_prices = sorted({b["price"] for s, b in bundles.items() if s != "bundle-complete-mcat"})
    other = '<p class="meta">Also see: {}</p>'

    # ---------------- decks ----------------
    slug = "mcat-anki-decks-anking-miledown-pankow"
    url = f"{base}/compare/{slug}.html"
    title = "AnKing vs MileDown vs Pankow vs StudyStore: MCAT Anki Decks Compared"
    desc = "A dated, sourced comparison of the main free MCAT Anki decks (AnKing, MileDown, Pankow P/S) and StudyStore's paid packs: size, price, coverage and where each lives."
    rows = []
    for r in d["decks"]:
        size = E(r["size"]) + (" (approximate)" if r.get("approximate") else "")
        rows.append([f'<strong>{E(r["name"])}</strong>', size, E(r["price"]), E(r["covers"]), E(r["host"]), src(r) + ("; " + src(r["also"]) if r.get("also") else "")])
    rows.append(["<strong>StudyStore packs</strong> (our own product)", f"{cards:,} cards across {len(packs)} packs, one per AAMC content category (exact count from our catalog)",
                 f'${lo} to ${hi} per pack; section bundles {E(" or ".join(sec_prices))}; all {len(packs)} for {E(full["price"]) if full else "n/a"}',
                 "All sections plus CARS strategy; each pack adds a study guide, cheat sheet and practice questions",
                 "Download after purchase", f'<a href="../products/index.html">studystore.co packs</a> (our own catalog, {E(day)})'])
    body = f"""<article class="note wrap compare">
<p class="eyebrow">Comparison guide</p>
<h1>{E(title)}</h1>
<p class="meta">By StudyStore &middot; Checked {E(day)} &middot; StudyStore sells one of the products compared here</p>
<div class="prose">
<p><strong>Disclosure:</strong> StudyStore wrote this page and sells MCAT study packs. Numbers for other decks come only from the maker's own page or a dated third-party page, linked in each row. Where a number is a note count, an estimate, or differs between sources, the row says so. Corrections are welcome through the report link at the bottom.</p>
<h2>The short version</h2>
<ul>
<li><strong>AnKing, MileDown and Pankow are free.</strong> If you want one big community deck and are happy to unsuspend cards as you go, start there. AnKing is the largest; third-party guides describe it as merged from earlier decks including MileDown and Pankow.</li>
<li><strong>Pankow covers Psych/Soc only.</strong> People often pair it with a science deck.</li>
<li><strong>StudyStore packs are paid and split by AAMC content category.</strong> Each pack is a deck plus a study guide, a cheat sheet and practice questions for one category, so they suit someone patching a few weak categories rather than replacing a free deck.</li>
</ul>
<h2>Side by side</h2>
{table(["Deck", "Size", "Price", "Covers", "Where it lives", "Source"], rows, wide=True, label="MCAT Anki decks compared")}
<h2>Reading the numbers</h2>
<p><strong>Notes are not cards.</strong> AnkiWeb counts notes. One cloze note with three blanks makes three cards, so a deck's card count is usually higher than its note count. That is why the AnkiWeb note counts and the third-party card counts above do not match, and why we list both where we have them.</p>
<p><strong>Decks change.</strong> Shared decks get re-uploaded and merged. The MileDown deck exists on AnkiWeb in more than one upload with slightly different note counts, and the AnKing deck is maintained on AnkiHub, whose pages need a login, so we could not read a count from the maker directly. Check the source link before relying on any number.</p>
<p><strong>Price.</strong> The three community decks are free to download. Third-party guides note an optional AnkiHub subscription for syncing updates to the AnKing deck; see the AnKing row's source for the listed price.</p>
<h2>Which one fits</h2>
<ul>
<li>Starting content review with months to go and no budget: a free community deck plus <a href="../notes/index.html">free notes</a> and <a href="../practice/index.html">free practice sets</a> for the topics the deck covers thinly.</li>
<li>Psych/Soc is your weak section: Pankow's deck is the dedicated free option.</li>
<li>A few specific weak categories after a practice test: use free practice sets to confirm them, then decide whether you want a ready-made guide and cheat sheet for just those categories. The <a href="../tools/mcat-study-schedule.html">schedule generator</a> plans the weeks either way.</li>
</ul>
<p>None of these decks is affiliated with AAMC. MCAT is a registered trademark of the AAMC, which does not endorse StudyStore or any deck listed here.</p>
</div>
{other.format('<a href="mcat-prep-cost-courses-vs-diy.html">MCAT prep cost: courses vs DIY</a> &middot; <a href="../tools/index.html">Free MCAT tools</a>')}
{{{{waitlist}}}}
<p class="meta"><a class="reportlink" href="{{{{root}}}}report.html" data-report>Spotted an outdated number? Report a problem or suggest something</a></p>
</article>"""
    emit(f"compare/{slug}.html", title + " | StudyStore", desc, body,
         head_extra=ld_json(article_ld(base, url, title, desc, day), breadcrumbs((title, url))), lastmod=day)

    # ---------------- cost ----------------
    slug2 = "mcat-prep-cost-courses-vs-diy"
    url2 = f"{base}/compare/{slug2}.html"
    title2 = "MCAT Prep Cost in 2027: Courses vs DIY, With Official AAMC Prices"
    desc2 = "What the MCAT costs in 2027 from AAMC's own fee pages, what official prep costs, and listed prices for major prep courses, with sources and dates. Estimate, not advice."
    A = {r["id"]: r for r in d["aamc"]}
    fee_rows = [[E(A[k]["item"]), money(A[k]["price_usd"]), src(A[k])] for k in ("reg_standard", "reg_fap", "intl_fee")]
    chg = [[E(r["window"]), money(r["std_reschedule"]), money(r["std_refund"]), money(r["fap_reschedule"]), money(r["fap_refund"])] for r in d["aamc_changes"]]
    prep_rows = [[E(A[k]["item"]), money(A[k]["price_usd"]), src(A[k])] for k in ("pe1", "pe", "sb", "carsqb", "qp", "iqb", "bundle")]
    course_rows = [[f'<strong>{E(r["company"])}</strong>', E(r["plan"]), ("from " if r.get("from") else "") + money(r["price_usd"]) + (" (approximate)" if r.get("approximate") else ""), E(r["access"]), src(r)] for r in d["courses"]]
    reg, bundle_p, pe1 = A["reg_standard"]["price_usd"], A["bundle"]["price_usd"], A["pe1"]["price_usd"]
    uq = next(r for r in d["courses"] if r["id"] == "uworld_qbank_90")
    course_lo = min(r["price_usd"] for r in d["courses"] if r.get("full_course"))
    lo_from = any(r.get("from") and r["price_usd"] == course_lo for r in d["courses"] if r.get("full_course"))
    hi_from = any(r.get("from") for r in d["courses"] if r.get("full_course") and r["price_usd"] == max(x["price_usd"] for x in d["courses"] if x.get("full_course")))
    pre = lambda f: "from " if f else ""
    course_hi = max(r["price_usd"] for r in d["courses"] if r.get("full_course"))
    scen = [
        ["Free-resources route", f"Registration {money(reg)} + free AAMC Practice Exam 1 and sample test ({money(pe1)})", money(reg + pe1)],
        ["DIY with all AAMC official prep", f"Registration {money(reg)} + Official Prep Online-Only Bundle {money(bundle_p)}", money(reg + bundle_p)],
        ["DIY plus a third-party question bank", f"The row above + UWorld MCAT QBank, 90 days, {money(uq['price_usd'])}", money(reg + bundle_p + uq["price_usd"])],
        ["Full prep course", f"Registration {money(reg)} + a full course listed here: {pre(lo_from)}{money(course_lo)} to {pre(hi_from)}{money(course_hi)}", f"{pre(lo_from)}{money(reg + course_lo)} to {pre(hi_from)}{money(reg + course_hi)}"],
    ]
    body2 = f"""<article class="note wrap compare">
<p class="eyebrow">Comparison guide &middot; Estimate, not advice</p>
<h1>{E(title2)}</h1>
<p class="meta">By StudyStore &middot; Prices checked {E(day)} &middot; StudyStore sells MCAT study packs</p>
<div class="prose">
<p><strong>Estimate, not advice.</strong> Prices change, sales come and go, and your total depends on choices only you can make. Every price below links to the page it came from, with the date we checked it. AAMC fees come from AAMC's own pages; course prices come from each company's own pricing page where it would load, otherwise from a dated third-party page, marked as such.</p>
<h2>What AAMC charges</h2>
{table(["Fee", "Price", "Source"], fee_rows, (1,), label="AAMC MCAT fees")}
<p>AAMC's Fee Assistance Program lowers the registration fee to the amount above for people who qualify; apply before you register.</p>
<h3>Rescheduling and cancelling (2027 test dates)</h3>
{table(["When", "Reschedule", "Cancel: refund", "Fee Assistance: reschedule", "Fee Assistance: refund"], chg, (1, 2, 3, 4), wide=True, label="AAMC reschedule and cancellation fees")}
<p class="meta">Source: {src(d["aamc_changes_source"])}. AAMC does not allow changes fewer than 10 days before the exam.</p>
<h2>AAMC official prep</h2>
{table(["Product (1 year access)", "Price", "Source"], prep_rows, (1,), label="AAMC official prep prices")}
<p class="meta">{E(d["bundle_note"])}</p>
<h2>Prep course list prices</h2>
{table(["Company", "Plan", "Price", "Access", "Source"], course_rows, (2,), wide=True, label="Prep course list prices")}
<p class="meta">Course pages often show sale prices and change plans; treat these as list prices on the check date. We could not load some companies' own pages, so those rows use third-party pages and are marked approximate.</p>
<h2>Four ways the total can add up</h2>
<p>Illustrative totals, computed from the prices above. Estimate, not advice.</p>
{table(["Route", "What is included", "Total"], scen, (2,), label="Example totals")}
<p>Free help that costs nothing extra: <a href="../notes/index.html">StudyStore's free notes</a>, <a href="../practice/index.html">free practice sets</a> and the <a href="../tools/mcat-study-schedule.html">2027 study schedule generator</a>. StudyStore also sells per-category study packs (${lo} to ${hi}); they are a supplement to any route above, not a course.</p>
<p>MCAT is a registered trademark of the AAMC, which does not endorse StudyStore or any company listed here.</p>
</div>
{other.format('<a href="mcat-anki-decks-anking-miledown-pankow.html">MCAT Anki decks compared</a> &middot; <a href="../tools/index.html">Free MCAT tools</a>')}
{{{{waitlist}}}}
<p class="meta"><a class="reportlink" href="{{{{root}}}}report.html" data-report>Spotted an outdated price? Report a problem or suggest something</a></p>
</article>"""
    emit(f"compare/{slug2}.html", title2 + " | StudyStore", desc2, body2,
         head_extra=ld_json(article_ld(base, url2, title2, desc2, day), breadcrumbs((title2, url2))), lastmod=day)
    return [(slug, title), (slug2, title2)]

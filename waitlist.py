"""Email list box ("free MCAT sampler" opt-in). Rendered by build.py for {{waitlist}} (whole catalog) and
{{waitlist:<slug>}} (product and bundle pages).

Double opt-in through the income-brain subscribe contract (marketing/SPEC-shared.md section 2):
  POST https://income-brain.premed-toolkit.workers.dev/api/subscribe
  {email, list_id: "studystore-mcat", consent_text, source_url, utm: {source, medium, campaign}, website}
assets/js/waitlist.js sends that JSON straight to the brain (CORS allows www.studystore.co). Without JS the
form is a plain post to the same-origin /api/subscribe (functions/api/subscribe.js), which forwards the same
contract server side. Nothing is emailed until the visitor clicks the link in the confirm email.

The consent text is shown verbatim next to the button and sent as consent_text; CONSENT_TEXT is the single
source of truth (subscribe.js keeps an allowlist that must contain it; tests/subscribe_test.mjs checks).

The headline offer is the free sampler: the free notes, practice sets and the study schedule tool, all
already free on the site with no signup. STATS holds the live counts (set by build.py before rendering), so
the box never states a number the site does not have.
"""
import html

BRAIN_SUBSCRIBE_URL = "https://income-brain.premed-toolkit.workers.dev/api/subscribe"
LIST_ID = "studystore-mcat"
CONSENT_TEXT = ("Email me free MCAT notes, practice sets and new packs from StudyStore. "
                "Double opt-in, unsubscribe in one click.")
STATS = {"notes": 0, "practice": 0, "questions": 0}  # filled by build.py


def _sampler_line(root):
    n, p, q = STATS["notes"], STATS["practice"], STATS["questions"]
    parts = []
    if n:
        parts.append(f'<a href="{root}notes/index.html" data-track="sampler">{n} study notes</a> with original diagrams and 5-question quizzes')
    if p:
        parts.append(f'<a href="{root}practice/index.html" data-track="sampler">{p} practice sets</a> ({q} questions with full explanations)')
    parts.append(f'the <a href="{root}tools/mcat-study-schedule.html">2027 study schedule generator</a>')
    if len(parts) == 1:
        return parts[0]
    return ", ".join(parts[:-1]) + " and " + parts[-1]


SAMPLE_PDF = "assets/free/studystore-mcat-sample-cheat-sheet.pdf"
SAMPLE_NAME = "3-page Amino Acids, Proteins and Enzymes cheat sheet (PDF)"
SIGNUP_HEADLINE = "Free sample: a 3-page MCAT cheat sheet (PDF), plus 6 short high-yield lessons by email"


def _done(root):
    return f"""<div class="wldone" hidden tabindex="-1">
<p class="wldone-h">Check your email</p>
<p class="wldone-msg">We sent a link to confirm your address. Nothing else is sent until you click it.</p>
<p><a class="btn" href="{root}{SAMPLE_PDF}" download data-track="sample-pdf">Download your free sample: {SAMPLE_NAME}</a></p>
<p>Meanwhile, <a href="{root}notes/index.html" data-track="sampler">start with the free notes</a>.</p>
</div>"""


def signup(root):
    """Compact opt-in block for the top of every note page and the home page. Same form contract as box() with
    unique ids, so it can sit on a page next to the full box. The sampler stays linked without signup."""
    consent = html.escape(CONSENT_TEXT)
    return f"""<section class="waitlist waitlist-inline" id="signup" aria-labelledby="signup-h">
<div class="wlcopy">
<p class="eyebrow mono"><span class="dot"></span>Free MCAT sampler</p>
<h2 id="signup-h">{SIGNUP_HEADLINE}</h2>
<p>Enter your email and download a real page set from a paid pack: the {SAMPLE_NAME}. Confirm your email and short MCAT lessons follow. Free, no card.</p>
<p>Prefer not to sign up? The sampler is open to everyone: <a href="{root}notes/index.html" data-track="sampler">free notes</a>, <a href="{root}practice/index.html" data-track="sampler">practice sets</a> and the <a href="{root}tools/mcat-study-schedule.html">study schedule generator</a>.</p>
</div>
<form class="wlform" method="post" action="/api/subscribe" data-waitlist data-endpoint="{BRAIN_SUBSCRIBE_URL}">
<label for="su-email">Email</label>
<input id="su-email" name="email" type="email" required maxlength="254" autocomplete="email" inputmode="email" spellcheck="false" placeholder="you@example.com">
<div class="rhp" aria-hidden="true"><label>Leave this empty <input name="website" tabindex="-1" autocomplete="off"></label></div>
<input type="hidden" name="list_id" value="{LIST_ID}"><input type="hidden" name="consent_text" value="{consent}">
<input type="hidden" name="source_url" value=""><input type="hidden" name="utm_source" value=""><input type="hidden" name="utm_medium" value=""><input type="hidden" name="utm_campaign" value="">
<button type="submit" class="btn">Get the free cheat sheet</button>
<p class="wlnote"><span class="wlconsent">{consent}</span> Every email has an unsubscribe link. <a href="{root}privacy.html">Privacy</a></p>
<p class="wlstatus" role="status" aria-live="polite"></p>
</form>
{_done(root)}
</section>"""


def capture(root):
    """One-field capture shown right under the inline checkout CTA (arm studystore-email-capture-a). Same contract and
    handlers as signup(); ids are prefixed cc- so it can sit on a page next to signup() or box()."""
    consent = html.escape(CONSENT_TEXT)
    return f"""<section class="waitlist waitlist-cta" aria-label="Free sample pack by email">
<form class="wlform" method="post" action="/api/subscribe" data-waitlist data-endpoint="{BRAIN_SUBSCRIBE_URL}">
<label for="cc-email">Not ready to buy? Get a free sample pack by email.</label>
<input id="cc-email" name="email" type="email" required maxlength="254" autocomplete="email" inputmode="email" spellcheck="false" placeholder="you@example.com">
<div class="rhp" aria-hidden="true"><label>Leave this empty <input name="website" tabindex="-1" autocomplete="off"></label></div>
<input type="hidden" name="list_id" value="{LIST_ID}"><input type="hidden" name="consent_text" value="{consent}">
<input type="hidden" name="source_url" value=""><input type="hidden" name="utm_source" value=""><input type="hidden" name="utm_medium" value=""><input type="hidden" name="utm_campaign" value="">
<button type="submit" class="btn small">Send the free sample</button>
<p class="wlnote"><span class="wlconsent">{consent}</span> <a href="{root}privacy.html">Privacy</a></p>
<p class="wlstatus" role="status" aria-live="polite"></p>
</form>
{_done(root)}
</section>"""


def box(root, launch=True):
    """launch=True: checkout is not open yet (product pages for packs that are not buyable)."""
    lead = (f"Join the list and download a free sample from a paid pack: the {SAMPLE_NAME}. "
            "We also email free MCAT notes and practice sets.")
    consent = html.escape(CONSENT_TEXT)
    return f"""<section class="waitlist" id="waitlist" aria-labelledby="waitlist-h">
<div class="wlcopy">
<p class="eyebrow mono"><span class="dot"></span>Free MCAT sampler</p>
<h2 id="waitlist-h">Free sample: MCAT cheat sheet (PDF)</h2>
<p>{lead}</p>
<p>Free sampler, no signup needed: {_sampler_line(root)}.</p>
</div>
<form class="wlform" method="post" action="/api/subscribe" data-waitlist data-endpoint="{BRAIN_SUBSCRIBE_URL}">
<label for="wl-email">Email</label>
<input id="wl-email" name="email" type="email" required maxlength="254" autocomplete="email" inputmode="email" spellcheck="false" placeholder="you@example.com">
<div class="rhp" aria-hidden="true"><label>Leave this empty <input name="website" tabindex="-1" autocomplete="off"></label></div>
<input type="hidden" name="list_id" value="{LIST_ID}"><input type="hidden" name="consent_text" value="{consent}">
<input type="hidden" name="source_url" value=""><input type="hidden" name="utm_source" value=""><input type="hidden" name="utm_medium" value=""><input type="hidden" name="utm_campaign" value="">
<button type="submit" class="btn">Get the free cheat sheet</button>
<p class="wlnote"><span class="wlconsent">{consent}</span> <a href="{root}privacy.html">Privacy</a></p>
<p class="wlstatus" role="status" aria-live="polite"></p>
</form>
{_done(root)}
</section>"""

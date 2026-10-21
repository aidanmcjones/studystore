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


def box(root, launch=True):
    """launch=True: checkout is not open yet (product pages for packs that are not buyable)."""
    if launch:
        lead = ("Packs are not on sale yet. Join for the free sampler now, and we email you when checkout opens.")
    else:
        lead = ("One email with the free sampler, then a few short free mini-lessons, and a note when a new pack or free note goes up.")
    consent = html.escape(CONSENT_TEXT)
    return f"""<section class="waitlist" id="waitlist" aria-labelledby="waitlist-h">
<div class="wlcopy">
<p class="eyebrow mono"><span class="dot"></span>Free MCAT sampler</p>
<h2 id="waitlist-h">Get the free MCAT sampler by email</h2>
<p>{lead}</p>
<p>The sampler: {_sampler_line(root)}. All of it is free on this site with no signup; the email just puts it in one place.</p>
</div>
<form class="wlform" method="post" action="/api/subscribe" data-waitlist data-endpoint="{BRAIN_SUBSCRIBE_URL}">
<label for="wl-email">Email</label>
<input id="wl-email" name="email" type="email" required maxlength="254" autocomplete="email" inputmode="email" spellcheck="false" placeholder="you@example.com">
<div class="rhp" aria-hidden="true"><label>Leave this empty <input name="website" tabindex="-1" autocomplete="off"></label></div>
<input type="hidden" name="list_id" value="{LIST_ID}"><input type="hidden" name="consent_text" value="{consent}">
<input type="hidden" name="source_url" value=""><input type="hidden" name="utm_source" value=""><input type="hidden" name="utm_medium" value=""><input type="hidden" name="utm_campaign" value="">
<button type="submit" class="btn">Send me the sampler</button>
<p class="wlnote"><span class="wlconsent">{consent}</span> <a href="{root}privacy.html">Privacy</a></p>
<p class="wlstatus" role="status" aria-live="polite"></p>
</form>
<div class="wldone" hidden tabindex="-1">
<p class="wldone-h">Check your email</p>
<p class="wldone-msg">We sent a link to confirm your address. Nothing else is sent until you click it.</p>
<p>Meanwhile, <a href="{root}notes/index.html" data-track="sampler">start with the free notes</a>.</p>
</div>
</section>"""

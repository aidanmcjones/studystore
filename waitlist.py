"""Email list box. Rendered by build.py for {{waitlist}} (whole catalog) and {{waitlist:<slug>}}
(product and bundle pages).

Two honest versions, picked by whether checkout is actually open (products_build.buyable, which respects
site.json checkout_provider and each item's checkout link):
  launch=True   "Get launch day access": checkout is not open yet; one email the day it opens.
  launch=False  "Get new packs and free notes": packs are for sale; email when new packs or free notes go up.
One box per page (fixed element ids). Posts to /api/subscribe (functions/api/subscribe.js): with JS,
assets/js/waitlist.js sends JSON and fires the 'subscribe' analytics event; without JS it is a plain
form post. Never "buy now" in this box.
"""
import calendar

MONTHS = [(f"2027-{m:02d}", f"{calendar.month_name[m]} 2027") for m in range(1, 10)]


def box(root, launch=True):
    opts = '<option value="">Not sure</option>' + "".join(f'<option value="{v}">{t}</option>' for v, t in MONTHS)
    if launch:
        eyebrow, h, lead = ("Launch list", "Get launch day access",
                            "StudyStore packs are available soon; checkout is not open yet. Join the list and we send you one email the day it opens.")
        button, note = "Get launch day access", "One launch email, then only if you opt in. Unsubscribe anytime."
        done = "We will send one email when checkout opens."
    else:
        eyebrow, h, lead = ("Email list", "Get new packs and free notes",
                            "Packs are for sale now. Join the list and we email you when a new pack or free note goes up.")
        button, note = "Join the list", "Only emails about new packs and free notes. Unsubscribe anytime."
        done = "We will email you when a new pack or free note goes up."
    return f"""<section class="waitlist" id="waitlist" aria-labelledby="waitlist-h">
<div class="wlcopy">
<p class="eyebrow mono"><span class="dot"></span>{eyebrow}</p>
<h2 id="waitlist-h">{h}</h2>
<p>{lead}</p>
<p>Free right now: the <a href="{root}notes/index.html" data-track="sampler">free sampler of study notes</a> and <a href="{root}practice/index.html">practice questions</a>.</p>
</div>
<form class="wlform" method="post" action="/api/subscribe" data-waitlist>
<label for="wl-email">Email</label>
<input id="wl-email" name="email" type="email" required maxlength="254" autocomplete="email" inputmode="email" spellcheck="false" placeholder="you@example.com">
<label for="wl-month">When do you test? <span class="wlopt">(optional)</span></label>
<select id="wl-month" name="exam_month">{opts}</select>
<div class="rhp" aria-hidden="true"><label>Leave this empty <input name="hp" tabindex="-1" autocomplete="off"></label></div>
<input type="hidden" name="source_page" value=""><input type="hidden" name="utm_source" value=""><input type="hidden" name="utm_campaign" value="">
<button type="submit" class="btn">{button}</button>
<p class="wlnote">{note} <a href="{root}privacy.html">Privacy</a></p>
<p class="wlstatus" role="status" aria-live="polite"></p>
</form>
<div class="wldone" hidden tabindex="-1">
<p class="wldone-h">You are on the list.</p>
<p>{done} Meanwhile, <a href="{root}notes/index.html" data-track="sampler">start with the free sampler notes</a>.</p>
</div>
</section>"""

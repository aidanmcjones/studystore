"""Launch waitlist box ("Get launch day access"). Rendered by build.py for the {{waitlist}} placeholder.

One box per page (fixed element ids). Posts to /api/subscribe (functions/api/subscribe.js): with JS,
assets/js/waitlist.js sends JSON and fires the 'subscribe' analytics event; without JS it is a plain
form post. Copy rules: packs are "available soon" until checkout is live; never "buy now".
"""
import calendar

MONTHS = [(f"2027-{m:02d}", f"{calendar.month_name[m]} 2027") for m in range(1, 10)]


def box(root):
    opts = '<option value="">Not sure</option>' + "".join(f'<option value="{v}">{t}</option>' for v, t in MONTHS)
    return f"""<section class="waitlist" id="waitlist" aria-labelledby="waitlist-h">
<div class="wlcopy">
<p class="eyebrow mono"><span class="dot"></span>Launch list</p>
<h2 id="waitlist-h">Get launch day access</h2>
<p>StudyStore packs are available soon; checkout is not open yet. Join the list and we send you one email the day it opens.</p>
<p>Free right now: the <a href="{root}notes/index.html" data-track="sampler">free sampler of study notes</a> and <a href="{root}practice/index.html">practice questions</a>.</p>
</div>
<form class="wlform" method="post" action="/api/subscribe" data-waitlist>
<label for="wl-email">Email</label>
<input id="wl-email" name="email" type="email" required maxlength="254" autocomplete="email" inputmode="email" spellcheck="false" placeholder="you@example.com">
<label for="wl-month">When do you test? <span class="wlopt">(optional)</span></label>
<select id="wl-month" name="exam_month">{opts}</select>
<div class="rhp" aria-hidden="true"><label>Leave this empty <input name="hp" tabindex="-1" autocomplete="off"></label></div>
<input type="hidden" name="source_page" value=""><input type="hidden" name="utm_source" value=""><input type="hidden" name="utm_campaign" value="">
<button type="submit" class="btn">Get launch day access</button>
<p class="wlnote">One launch email, then only if you opt in. Unsubscribe anytime. <a href="{root}privacy.html">Privacy</a></p>
<p class="wlstatus" role="status" aria-live="polite"></p>
</form>
<div class="wldone" hidden tabindex="-1">
<p class="wldone-h">You are on the list.</p>
<p>We will send one email when checkout opens. While you wait, <a href="{root}notes/index.html" data-track="sampler">start with the free sampler notes</a>.</p>
</div>
</section>"""

"""Binder screenshot figures: a dark and a light <picture> per screen; CSS shows the one matching the site theme.

Phones (max-width 640px) get the 840px-wide shot, re-shot narrow rather than downscaled. A screen without an
840 file falls back to the 1200 one.
"""
import html

# key: (width, height, width_840 or None, height_840, alt, caption, max_width_px or None)
SHOTS = {
    "home": (1200, 800, 840, 800,
             "Binder home screen with due, new and learning counts, a deck list, today's activity and a study heatmap",
             "The whole app is one window. Demo decks shown.", 1100),
    "study": (1200, 440, 840, 430,
              "Binder study screen with the answer shown and four interval buttons: under 10 minutes, 2.2 months, 2.7 months and 3.6 months",
              "Studying. The buttons show when the card comes back: minutes if you miss it, months if you know it.", None),
    "stats": (1200, 1000, None, None,
              "Binder statistics page with today's totals and a Future Due forecast chart",
              "Stats, inside the main window.", None),
    "settings": (1200, 800, 840, 800,
                 "Binder Settings page with the Appearance section open: accent color wheel and swatches, theme choice and backdrop choice",
                 "One Settings page for deck limits, FSRS, exam deadline and appearance. Pick an accent with the wheel, and System, Light or Dark.", None),
    "palette": (1200, 800, 840, 800,
                "Binder command palette open over the home screen, listing Study, Add Card, Decks, Open Stats, Settings, Import File and Export for iPhone",
                "The command palette.", None),
}


def _pic(key, theme, eager):
    w, h, w2, h2, alt, _cap, _mx = SHOTS[key]
    base = f"{{{{root}}}}assets/img/binder-{key}-{theme}"
    src = f'<source media="(max-width: 640px)" srcset="{base}-840.webp" width="{w2}" height="{h2}">' if w2 else ""
    load = 'loading="eager" fetchpriority="high"' if eager else 'loading="lazy" decoding="async"'
    return (f'<picture class="shot-{theme}">{src}'
            f'<img src="{base}-1200.webp" width="{w}" height="{h}" alt="{html.escape(alt)}" {load}></picture>')


def figure(key, eager=False):
    cap = SHOTS[key][5]
    mx = SHOTS[key][6]
    style = f' style="max-width:{mx}px"' if mx else ""
    return (f'<figure class="shot"{style}>{_pic(key, "dark", eager)}{_pic(key, "light", eager)}'
            f'<figcaption class="meta">{html.escape(cap)}</figcaption></figure>')


def tokens():
    return {f"qb_shot_{k}": figure(k, eager=(k == "home")) for k in SHOTS}

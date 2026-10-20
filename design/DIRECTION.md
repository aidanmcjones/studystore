# StudyStore design direction: "Bench Notes"

StudyStore should look like the lab notebook of the sharpest person in your MCAT cohort: graph paper, plotted data, mono labels, and one indicator color that changes with pH. Every motif comes from the content we sell. Nothing here is generic study imagery (no books, lightbulbs, mortarboards, emoji or stock students).

## Motifs (all drawn from the packs)

| Motif | Where | Why it fits |
|---|---|---|
| Alpha helix, ball and stick, CPK colors | Hero canvas | Protein structure is Pack 1. It turns toward the cursor and **denatures** (uncoils into an extended strand) as you scroll away. |
| Michaelis-Menten and Lineweaver-Burk plots | Pinned kinetics section, product page | The plot draws itself, then competitive, noncompetitive and uncompetitive inhibitors shift Km and Vmax as you scroll. |
| Bromothymol blue indicator ramp | Scroll progress "pH meter" in the header, accents | The page titrates from acid yellow to base blue as you read. The readout shows pH in mono. |
| Graph paper grid with a cursor spotlight | Page background | Lab notebook. The spotlight is a quiet cursor-reactive detail. |
| Anki card flip | Hero, quiz | The product itself. Real cards from the deck. |
| Element-tile topic grid | Product page | Topics laid out like periodic table cells: a short symbol and the topic name. |
| Figure captions "Fig. 1" in mono | Every diagram | Textbook convention, signals rigor. |

## Type

- **Display: Bricolage Grotesque** (Google Fonts, variable opsz and wght). A grotesk with ink traps and a slightly hand-cut feel at large optical sizes: confident but not corporate, and not the default AI-site Inter or Space Grotesk.
- **Body: IBM Plex Sans.** Designed for technical documentation; excellent small-size legibility for prose notes.
- **Data and labels: IBM Plex Mono.** Axes, pH readout, eyebrows, prices, file names, figure numbers.

Scale (fluid, clamp): display 3.2 to 7.2 rem, h2 2 to 3.6 rem, h3 1.25 rem, body 1.0625 rem / 1.65, mono labels 0.75 rem with 0.08 em tracking.

## Color tokens

Named after the indicator, so the palette has a reason.

| Token | Light | Dark | Use |
|---|---|---|---|
| `--bg` | `#f3f5f0` (cool lab white, not cream) | `#0a0f0d` | page |
| `--surface` | `#ffffff` | `#111815` | cards, panels |
| `--ink` | `#0d1512` | `#e8eee9` | text |
| `--muted` | `#4c5853` | `#9aa8a1` | secondary text (AA on both) |
| `--line` | `#d5dbd4` | `#24302b` | rules, borders |
| `--grid` | ink at 5 percent | white at 4 percent | graph paper |
| `--acid` | `#f2b705` | `#ffd23f` | indicator yellow: highlights, CTA hover in light, CTA fill in dark |
| `--neutral` | `#13804a` | `#3ddc84` | indicator green: links, correct state |
| `--base` | `#1c5bd0` | `#6aa2ff` | indicator blue: data lines, focus ring |
| `--alert` | `#c8323c` | `#ff6b72` | inhibitor lines, incorrect state |

No purple-blue gradients, no cream and terracotta, no glassmorphism. The only gradient is the indicator ramp (yellow to green to blue), used as a thin data bar, never as a background wash.

## Layout

- Asymmetric 12-column grid, left-weighted text, wide gutters. Sections alternate between full-bleed stages (sticky plot, helix) and narrow reading columns.
- Hard 1 px rules and square-ish corners (4 to 8 px). Cards only where something is actually a card (the Anki card, the pack).
- Mobile first: single column, sticky stages become stacked figures, 16 px gutters minimum.

## Motion system

Principle: **motion explains a mechanism.** Large motion is reserved for real biochemistry (denaturation, curve drawing, inhibitor shifts, titration color). Everything else is small and fast.

| Token | Value | Use |
|---|---|---|
| `--ease-out` | `cubic-bezier(.16,1,.3,1)` | reveals, hovers |
| `--ease-io` | `cubic-bezier(.65,0,.35,1)` | flips, morphs |
| `--t-fast` | 160 ms | hover, press |
| `--t-med` | 420 ms | reveals |
| `--t-slow` | 900 ms | card flip, split text |

- **Reveals:** CSS scroll-driven animations (`animation-timeline: view()`) where supported, IntersectionObserver class toggles otherwise.
- **Split text:** headline words rise from a mask, 40 ms stagger.
- **Pinned scrub:** CSS `position: sticky` stages with a requestAnimationFrame progress loop (0 to 1 per section) driving SVG paths and the canvas. No dependency needed for pinning.
- **Smooth scroll:** Lenis (pinned 1.1.13) on fine-pointer desktop only; native scroll on touch.
- **Micro-interactions:** magnetic primary buttons, card tilt, cheat sheet loupe, velocity marquee, FAQ height animation.
- **Reduced motion:** `prefers-reduced-motion: reduce` disables Lenis, auto-flip, marquee and scrubbing. Plots render in their final, fully annotated state, the helix is a still frame, and all content is visible without scrolling tricks.
- **Budget:** no WebGL library. The helix is a 3 KB canvas 2D renderer with cached sphere sprites, capped at 2x DPR, paused off screen and in hidden tabs, still frame on low-power devices (Save-Data or 2 cores or fewer).

## Voice

Short, direct, a little wry. Facts we can verify. Never invent proof. Never use em dashes.

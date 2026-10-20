# StudyStore redesign: research

Goal: learn what makes celebrated product and learning sites convert and feel crafted, then adapt the approach (not the code, copy, imagery or marks) to a small store that sells original MCAT biochemistry packs.

Method: a pattern review of sites I know well from repeated study (hero structure, scroll storytelling, motion language, type, social proof, pricing, CTA rhythm). No assets, copy or code were taken from any of them. Each entry ends with the takeaway StudyStore actually uses.

---

## 1. Linear (linear.app)

- **Hero:** one short declarative headline, one muted sub line, two buttons (primary filled, secondary quiet). The product UI itself is the hero image, slightly tilted in perspective and lit from above, so the first thing you see is the real thing.
- **Scroll storytelling:** each section is one idea with one large UI crop. Sections enter with a soft blur-to-sharp and a small rise; nothing bounces.
- **Motion language:** fast, short, ease-out curves (roughly 200 to 400 ms). Motion confirms; it never decorates.
- **Type:** tight-tracked grotesk display at very large sizes with a mono or small caps for labels.
- **Social proof:** customer logos, but the strongest proof is the screenshots: they show density and finish.
- **CTA rhythm:** the same primary CTA returns every two or three sections.
- **Takeaway:** show the real artifact (a real Anki card, a real cheat sheet) as the hero, not an illustration of studying.

## 2. Stripe (stripe.com)

- **Hero:** animated gradient field behind a big headline; the field is ambient and cheap to render.
- **Scroll storytelling:** code samples and diagrams that build up line by line; documentation-grade precision as a brand trait.
- **Motion language:** layered parallax, cards that slide in staggered, diagrams with paths that draw.
- **Type:** confident sans, careful numerals, generous line height.
- **Pricing:** "starts at" pricing stated plainly with what is included next to it.
- **Takeaway:** draw diagrams with paths that trace themselves. For us the diagrams are the content (Michaelis-Menten, Lineweaver-Burk), so the motion teaches.

## 3. Vercel (vercel.com)

- **Hero:** stark black and white, a single geometric motif (the triangle, a globe of points) that reacts to the cursor.
- **Motion language:** grid lines, dotted guides, crosshair markers: an "engineering drawing" look that signals precision.
- **Type:** Geist sans plus Geist mono; mono is used for every number, path and label.
- **Takeaway:** a measured, instrument-like frame (grid paper, axis ticks, mono labels) can carry a brand by itself. Ours becomes lab graph paper with plotted data.

## 4. Arc browser (arc.net)

- **Hero:** playful, personality-heavy type and color, with product demos that run themselves.
- **Scroll storytelling:** long-form pages where features are revealed as a narrative, with copy written in a human, slightly irreverent voice.
- **Micro-interactions:** buttons and stickers respond to hover with springy, physical motion.
- **Takeaway:** a self-running demo in the hero (our card flips through real cards on its own) plus warm, direct copy. Personality comes from voice and from one bold color, not from decoration.

## 5. Duolingo (duolingo.com)

- **Hero:** the promise in one line ("free, fun, effective") and a single giant CTA.
- **Learning loop:** you start doing the thing almost immediately; the product sells itself through a first lesson.
- **Feedback design:** instant correct and incorrect states with color, sound and short explanations; progress dots.
- **Takeaway:** put a working mini-quiz on the homepage with real questions from the deck, instant feedback and a short explanation. Trying beats reading about.

## 6. Notion (notion.so)

- **Hero:** headline, two CTAs, then a product canvas; hand-drawn spot illustrations give a recognizable voice.
- **Social proof:** logos and template galleries. The template gallery is itself content marketing that ranks in search.
- **Takeaway:** the free notes are our template gallery: useful on their own, linked from the homepage, each one leading to the pack.

## 7. Brilliant (brilliant.org)

- **Hero:** "learn by doing" with an interactive visual problem embedded on the page.
- **Interactivity:** draggable diagrams, sliders that change a graph, puzzles that reveal the principle.
- **Visual language:** clean geometric illustrations, strong single accent per subject.
- **Takeaway:** a scroll-scrubbed kinetics plot where adding an inhibitor visibly moves Km or Vmax. The user learns the inhibition table in ten seconds of scrolling, which is the best possible proof the pack teaches well.

## 8. Anki-adjacent tools (RemNote, Mochi, AnkiHub landing pages)

- **Hero:** a card mock in the hero, usually front and back side by side.
- **Proof:** deck counts, card examples, screenshots of the review screen.
- **Weakness:** most show static screenshots and dense feature lists; few let you actually flip a card.
- **Takeaway:** a live, flippable card in the hero is both familiar to Anki users and better than the category norm.

## 9. Top Gumroad creator pages (design, notion-template and study-asset sellers)

- **Structure:** big cover, one-line promise, price on the button, "what you get" list with file names, previews, FAQ, refund line.
- **Conversion detail:** the price is visible next to the CTA, file names make the product concrete, a refund policy removes risk.
- **Takeaway:** keep the honest commerce basics front and center: price, file list (deck.apkg, cheatsheet.pdf, README.txt), refund window, merchant of record.

## 10. Awwwards education and portfolio winners (pattern set)

Recurring patterns in recent Site of the Day winners:

- **Split-text reveals:** headlines that rise word by word from a mask.
- **Pinned sections:** a sticky stage while copy steps past, the stage scrubbed by scroll progress.
- **Smooth scrolling:** Lenis-style inertial scrolling, with motion synced to the scroll position.
- **Cursor-reactive details:** magnetic buttons, spotlight grids, objects that turn toward the pointer.
- **Velocity marquee:** a ticker whose speed follows scroll velocity.
- **Big footer wordmark** as a signature close.
- **Risk:** many winners are slow on phones and fail reduced-motion. We take the patterns but budget them: no heavy 3D library, a hand-rolled canvas renderer, everything paused off screen, and all content readable with motion off.

## 11. Apple product pages (apple.com/iphone, AirPods)

- **Scroll storytelling:** the canonical pinned, scroll-scrubbed product reveal, where a product assembles or rotates as you scroll.
- **Type:** huge display sizes for one phrase, tiny captions for specs.
- **Takeaway:** "pack contents assemble as you scroll": the three files of the pack fly into one pack, and spec numbers count up.

---

## Patterns we adopt, in order

1. Hero shows the real product working (a live Anki card cycling through real cards), framed by a cursor-reactive 3D alpha helix.
2. One bold, content-derived motion per section, each explaining a real mechanism: denaturation, Michaelis-Menten drawing, inhibitors shifting curves, pH indicator color change.
3. A try-it-now mini-quiz with real deck questions (the Duolingo and Brilliant lesson).
4. Commerce basics stay plain and visible: price on the CTA, file list, refund window, merchant of record.
5. Honest proof only: what is inside, counts we can verify from the deck, "every card rendered and checked", "original diagrams". No testimonials, ratings or user counts.
6. CTA every two to three sections, with the same wording.
7. Motion budget: no-dependency canvas instead of a WebGL library, lazy start, paused off screen, reduced-motion shows the final state.

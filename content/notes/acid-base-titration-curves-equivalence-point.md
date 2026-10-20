---
title: Acid-Base Titration Curves: Equivalence and Half-Equivalence Points
description: Read any acid-base titration curve: the pH at the start, half-equivalence and equivalence points, indicator choice, and a full weak acid worked example.
product: 5a-solutions-acids-bases
published: 2026-10-20
related: henderson-hasselbalch-for-the-mcat, amino-acid-pka-charge-ph-7-4
---

A titration curve plots pH against the volume of titrant added. The equivalence point is where moles of added base equal moles of acid originally present (or the reverse), and its pH depends on what is left in the flask: exactly 7 for a strong acid with a strong base, above 7 for a weak acid with a strong base, and below 7 for a weak base with a strong acid. Halfway to the equivalence point, a weak acid is half converted to its conjugate base, so pH = pK<sub>a</sub>. Those two landmarks let you read almost any curve.

## The four regions of a weak acid curve

Picture a weak acid HA in the flask with NaOH dripping in from the buret.

1. **Starting point.** Only weak acid is present. It is partly ionized, so the pH is low but higher than for a strong acid at the same concentration.
2. **Buffer region.** Each OH<sup>-</sup> added converts one HA to A<sup>-</sup>. Now both forms are present, the solution is a buffer, and the curve is fairly flat. The Henderson-Hasselbalch equation, pH = pK<sub>a</sub> + log([A<sup>-</sup>]/[HA]), describes this part. Its center is the half-equivalence point, where [A<sup>-</sup>] = [HA] and pH = pK<sub>a</sub>.
3. **Equivalence point.** All HA has become A<sup>-</sup>. The flask now holds the conjugate base, which is a weak base, so the pH is above 7. The curve is steepest here.
4. **Past equivalence.** Extra NaOH has nothing left to react with, and the excess hydroxide sets the pH. The curve flattens again at high pH.

For a strong acid such as HCl, region 2 has no buffer plateau. The pH rises slowly only because the H<sup>+</sup> is being used up, then shoots through 7 at the equivalence point.

![Titration curves of 0.100 M HCl and 0.100 M acetic acid with 0.100 M NaOH, with equivalence and half-equivalence points marked](assets/notes/acid-base-titration-curves-equivalence-point.png "Both acids need 25.0 mL of base, but the weak acid starts higher, has a buffer plateau centered on pH 4.76, and reaches equivalence near pH 8.7.")

## Why the equivalence pH is not always 7

At the equivalence point, the acid and base have neutralized each other, but "neutralized" means the moles match, not that the solution is neutral. What matters is the salt left behind.

| Titration | Species at equivalence | Equivalence pH |
|---|---|---|
| Strong acid + strong base (HCl + NaOH) | Na<sup>+</sup> and Cl<sup>-</sup>, neither reacts with water | 7 at 25 C |
| Weak acid + strong base (acetic acid + NaOH) | Acetate, a weak base | Above 7 |
| Weak base + strong acid (NH<sub>3</sub> + HCl) | NH<sub>4</sub><sup>+</sup>, a weak acid | Below 7 |

One way to remember it: at equivalence the pH leans toward the stronger partner. A strong base beating a weak acid leaves a basic solution.

For a weak base titrated with strong acid, the curve runs downhill. The half-equivalence point gives pH = pK<sub>a</sub> of the conjugate acid (for ammonia, NH<sub>4</sub><sup>+</sup> has pK<sub>a</sub> of about 9.25), which is the same as saying pOH = pK<sub>b</sub> of the base.

## Worked example: acetic acid with NaOH

Titrate 25.0 mL of 0.100 M acetic acid (pK<sub>a</sub> 4.76, so K<sub>a</sub> is about 1.74 &times; 10<sup>-5</sup>) with 0.100 M NaOH. The flask starts with 25.0 &times; 0.100 = 2.50 mmol of acid. Equivalence needs 2.50 mmol of NaOH, which is 25.0 mL.

**0 mL (start).** Only the weak acid. Solve K<sub>a</sub> = x<sup>2</sup>/(0.100 - x) with the small-x shortcut: x = &radic;(1.74 &times; 10<sup>-5</sup> &times; 0.100) = 1.32 &times; 10<sup>-3</sup> M. pH = **2.88**. Compare 0.100 M HCl, which starts at pH 1.00.

**10.0 mL.** Do the stoichiometry first. 1.00 mmol OH<sup>-</sup> converts 1.00 mmol HA to A<sup>-</sup>, leaving 1.50 mmol HA and 1.00 mmol A<sup>-</sup>. pH = 4.76 + log(1.00/1.50) = **4.58**. You can use millimoles in the ratio because both species share the same volume.

**12.5 mL (half-equivalence).** 1.25 mmol of each form. pH = pK<sub>a</sub> = **4.76**.

**20.0 mL.** 0.50 mmol HA, 2.00 mmol A<sup>-</sup>. pH = 4.76 + log 4 = **5.36**.

**25.0 mL (equivalence).** All 2.50 mmol is now acetate in 50.0 mL, so [A<sup>-</sup>] = 0.0500 M. Acetate is a weak base with K<sub>b</sub> = K<sub>w</sub>/K<sub>a</sub> = 10<sup>-14</sup>/(1.74 &times; 10<sup>-5</sup>) = 5.75 &times; 10<sup>-10</sup>. Then [OH<sup>-</sup>] = &radic;(5.75 &times; 10<sup>-10</sup> &times; 0.0500) = 5.36 &times; 10<sup>-6</sup> M, pOH = 5.27, and pH = **8.73**. Note the dilution: the volume doubled, so the acetate concentration is half the starting acid concentration.

**30.0 mL.** 0.50 mmol of excess OH<sup>-</sup> in 55.0 mL gives [OH<sup>-</sup>] = 9.09 &times; 10<sup>-3</sup> M, pOH = 2.04, pH = **11.96**. Past equivalence, the weak acid no longer matters, and the curve lies on top of the strong acid curve.

| NaOH added (mL) | Weak acid pH | Strong acid (0.100 M HCl) pH |
|---|---|---|
| 0 | 2.88 | 1.00 |
| 10.0 | 4.58 | 1.37 |
| 12.5 | 4.76 | 1.48 |
| 20.0 | 5.36 | 1.95 |
| 25.0 | 8.73 | 7.00 |
| 30.0 | 11.96 | 11.96 |

The strong acid values are just the leftover H<sup>+</sup> divided by the total volume. At 20.0 mL, for example, 0.50 mmol H<sup>+</sup> remains in 45.0 mL, so [H<sup>+</sup>] = 0.0111 M and pH = 1.95.

## Choosing an indicator

An indicator is itself a weak acid whose two forms have different colors. It changes color over roughly its pK<sub>a</sub> plus or minus 1. Pick one whose color change falls on the steep part of the curve, as close as possible to the equivalence pH.

| Indicator | Approximate color change range | Good for |
|---|---|---|
| Methyl red | pH 4.4 to 6.2 | Weak base with strong acid (equivalence below 7) |
| Bromothymol blue | pH 6.0 to 7.6 | Strong acid with strong base |
| Phenolphthalein | pH 8.2 to 10.0 | Weak acid with strong base (equivalence above 7) |

For a strong acid with a strong base at these concentrations, the jump is so steep that the choice barely matters. In the HCl titration above, the pH goes from 3.70 at 24.9 mL to 10.30 at 25.1 mL, so a change of two drops crosses the ranges of all three indicators. For a weak acid, the jump is shorter and starts higher, so methyl red would change color well before the true equivalence point.

## Polyprotic acids

An acid with two ionizable protons, such as fully protonated glycine, shows two buffer regions and two equivalence points, as long as its pK<sub>a</sub> values are far enough apart. The second equivalence point needs twice the volume of the first, because each proton takes one equivalent of base. The first half-equivalence point gives pK<sub>a1</sub>, and the point midway between the first and second equivalence points gives pK<sub>a2</sub>. The amino acid version of this curve, with its isoelectric point, is worked through in the [amino acid pKa note](amino-acid-pka-charge-ph-7-4.html).

## Common traps

- **Assuming equivalence means pH 7.** Only for strong with strong. Check what species remain.
- **Confusing equivalence with the end point.** The equivalence point is the stoichiometric point. The end point is where the indicator changes color. A good indicator makes them nearly the same.
- **Skipping stoichiometry before Henderson-Hasselbalch.** Convert moles first, then use the ratio.
- **Forgetting dilution at equivalence.** Total volume grows as titrant is added, which matters when you need a concentration (at the start, at equivalence, and past it), but not for the buffer ratio.
- **Thinking a weaker acid needs more base.** The volume to reach equivalence depends only on moles of acid, not on its strength. Strength changes the shape of the curve, not where equivalence falls.
- **Mixing up the half-equivalence point.** It is half the equivalence volume (12.5 mL here), not the point where the pH is half of something.

## One-minute recap

A titration curve has a starting pH, a buffer region centered on the half-equivalence point where pH = pK<sub>a</sub>, a steep jump through the equivalence point, and a flat region set by excess titrant. Equivalence pH is 7 for strong with strong, above 7 for a weak acid with strong base, and below 7 for a weak base with strong acid. Pick an indicator whose range sits on the steep part near the equivalence pH. Volume to equivalence depends on moles, not acid strength. Polyprotic acids show one equivalence point per proton.

:::quiz
Q: Why is the pH above 7 at the equivalence point when acetic acid is titrated with NaOH?
A: All the acid has become acetate, its conjugate base, which reacts with water to make OH-. The Na+ ion has no effect on pH.
Q: On a weak acid titration curve, the equivalence point is at 40.0 mL of NaOH. At what volume does pH equal pKa?
A: At 20.0 mL, the half-equivalence point, where half the acid has been converted to its conjugate base so [A-] = [HA].
Q: Equal 25.0 mL samples of two 0.10 M monoprotic acids, one strong and one weak, are titrated with the same NaOH. Which needs more base to reach equivalence?
A: Neither. Equal volumes of equal-concentration monoprotic acids contain equal moles of acid, so both need the same volume of base. Only the curve shape differs.
Q: Which indicator best suits a titration of aqueous ammonia with HCl: methyl red, bromothymol blue, or phenolphthalein?
A: Methyl red, because the equivalence point is acidic (NH4+ is a weak acid) and methyl red changes color at roughly pH 4.4 to 6.2.
Q: A diprotic acid reaches its first equivalence point at 15.0 mL of NaOH. Where is its second equivalence point?
A: At 30.0 mL. Removing the second proton takes another full equivalent of base, the same 15.0 mL again.
:::

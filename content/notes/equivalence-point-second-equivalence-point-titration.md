---
title: Equivalence Point vs End Point, and the Second Equivalence Point
description: What the equivalence point is, how it differs from the end point, how to find the second equivalence point of a polyprotic acid, and what trial 1 of a titration is for.
product: 5a-solutions-acids-bases
published: 2026-10-26
related: acid-base-titration-curves-equivalence-point, henderson-hasselbalch-for-the-mcat, amino-acid-pka-charge-ph-7-4
---

The **equivalence point** is the moment in a titration when the moles of titrant added exactly equal the moles of analyte that can react with it. A **polyprotic acid** has one equivalence point per ionizable proton, so a diprotic acid has a first and a second equivalence point, and the second falls at exactly twice the titrant volume of the first. The **end point** is different: it is where the indicator changes color, which is chosen to land close to the equivalence point.

## Equivalence point vs end point

| | Equivalence point | End point |
|---|---|---|
| Definition | Moles of titrant = moles of analyte (by the reaction stoichiometry) | The observed signal, such as an indicator color change |
| How you find it | Calculated, or read from the steepest part of a pH curve | Seen in the flask |
| Depends on | Stoichiometry only | Indicator choice |
| Ideal relationship | The target | Within a drop or two of the equivalence point |

The gap between the two is the titration error. A good indicator has a color-change range that falls on the steep part of the curve, so the error is a fraction of a drop.

## Finding the equivalence point

For a monoprotic acid and a monobasic titrant, the equivalence point occurs when **M<sub>acid</sub> &times; V<sub>acid</sub> = M<sub>base</sub> &times; V<sub>base</sub>**. If 25.0 mL of 0.100 M acid is titrated with 0.100 M NaOH, equivalence is at 25.0 mL. On a curve it is the midpoint of the steepest vertical section. Its pH depends on the species left in the flask: 7 for a strong acid with a strong base, above 7 for a weak acid with a strong base (the conjugate base makes OH<sup>-</sup>), and below 7 for a weak base with a strong acid.

## The second equivalence point of a polyprotic acid

Each proton takes one equivalent of base. For a diprotic acid H<sub>2</sub>A:

1. **First equivalence point:** H<sub>2</sub>A has all become HA<sup>-</sup>. The volume is V<sub>1</sub> = moles of H<sub>2</sub>A / M<sub>base</sub>.
2. **Second equivalence point:** HA<sup>-</sup> has all become A<sup>2-</sup>. The volume is V<sub>2</sub> = 2 &times; V<sub>1</sub>.
3. **First half-equivalence point (V<sub>1</sub>/2):** [H<sub>2</sub>A] = [HA<sup>-</sup>], so pH = pK<sub>a1</sub>.
4. **Second half-equivalence point (1.5 &times; V<sub>1</sub>):** [HA<sup>-</sup>] = [A<sup>2-</sup>], so pH = pK<sub>a2</sub>.
5. **At the first equivalence point,** the species is amphoteric, and pH is about (pK<sub>a1</sub> + pK<sub>a2</sub>) / 2. For an amino acid with no ionizable side chain, this is the isoelectric point.
6. **At the second equivalence point,** the species is the fully deprotonated base A<sup>2-</sup>, so the pH is basic and set by its hydrolysis.

### Worked example: glycine

Titrate 25.0 mL of 0.100 M fully protonated glycine (pK<sub>a1</sub> = 2.34, pK<sub>a2</sub> = 9.60) with 0.100 M NaOH.

- Moles of glycine: 0.100 M &times; 0.0250 L = 2.50 mmol. Each equivalence point needs 2.50 mmol of NaOH per proton.
- **First equivalence point:** 25.0 mL. pH is about (2.34 + 9.60) / 2 = **5.97**.
- **Second equivalence point:** 50.0 mL.
- Half-equivalence points: pH = 2.34 at 12.5 mL and pH = 9.60 at 37.5 mL.

At 50.0 mL, the total volume is 75.0 mL, so [glycinate] = 2.50 mmol / 75.0 mL = 0.0333 M. Glycinate is a weak base with K<sub>b</sub> = 10<sup>-14</sup> / 10<sup>-9.60</sup> = 10<sup>-4.40</sup> = 4.0 &times; 10<sup>-5</sup>. Then [OH<sup>-</sup>] = &radic;(K<sub>b</sub> &times; C) = &radic;(4.0 &times; 10<sup>-5</sup> &times; 0.0333) = 1.15 &times; 10<sup>-3</sup> M, so pOH = 2.94 and **pH = 11.06**.

## What "trial 1" means in a lab titration

In a lab, trial 1 is usually a rough run. You add titrant fairly quickly to find approximately where the color changes, so you know when to slow down. Later trials add titrant dropwise near that volume. The accepted result is the average of trials that agree closely (commonly within 0.1 mL), and the rough trial 1 is often left out of the average. A trial that overshoots the end point is discarded, not corrected.

## Common traps

- **Assuming the second equivalence point is at the same pH as the first.** It is at twice the volume, and a very different pH.
- **Using the wrong pK<sub>a</sub> at a half-equivalence point.** The first half-equivalence point gives pK<sub>a1</sub> and the second gives pK<sub>a2</sub>.
- **Forgetting dilution at the second equivalence point.** Total volume has doubled, which matters when you compute a concentration.
- **Treating the end point as exact.** It is the indicator's color change, and only approximates the equivalence point.
- **Expecting two clear jumps when the pK<sub>a</sub> values are close.** The two steps blur together unless the values differ by several units.

## One-minute recap

Equivalence is stoichiometric and calculated, and the end point is observed. A diprotic acid has equivalence points at V<sub>1</sub> and 2V<sub>1</sub>, with pK<sub>a1</sub> at V<sub>1</sub>/2 and pK<sub>a2</sub> at 1.5V<sub>1</sub>. The first equivalence pH is the average of the two pK<sub>a</sub> values, and the second is set by the fully deprotonated base.

:::quiz
Q: What is the difference between the equivalence point and the end point of a titration?
A: The equivalence point is where moles of titrant equal moles of analyte by stoichiometry. The end point is where the indicator visibly changes color. A well-chosen indicator makes them nearly identical.
Q: A diprotic acid reaches its first equivalence point at 20.0 mL of NaOH. Where is the second equivalence point?
A: At 40.0 mL. Removing the second proton takes another full equivalent of base.
Q: For the same diprotic acid, at what volume is pH equal to pKa2?
A: At 30.0 mL, the midpoint between the first and second equivalence points, where [HA-] = [A2-].
Q: What is the approximate pH at the first equivalence point of a diprotic acid with pKa1 = 4.0 and pKa2 = 8.0?
A: About 6.0, the average of the two pKa values, because the amphoteric species HA- dominates.
Q: Why is the pH above 7 at the second equivalence point?
A: All the acid has become the fully deprotonated conjugate base A2-, which is a weak base and reacts with water to make hydroxide.
:::

---
title: The Henderson-Hasselbalch Equation for the MCAT
description: Derive the Henderson-Hasselbalch equation, then use it for buffers, the bicarbonate system in blood, amino acids, and drug ionization, with worked examples.
product: 1a-amino-acids-proteins
published: 2026-10-20
related: amino-acid-pka-charge-ph-7-4, michaelis-menten-and-lineweaver-burk, protein-structure-levels-and-denaturation
---

The Henderson-Hasselbalch equation links the pH of a solution to the ratio of a weak acid and its conjugate base. It looks like a formula to memorize, but it is really a shortcut for one idea, and once you see the idea you can use the equation fast and without a calculator.

## Where it comes from

A weak acid HA partly dissociates in water:

HA &#8652; H<sup>+</sup> + A<sup>-</sup>

Its acid dissociation constant is K<sub>a</sub> = [H<sup>+</sup>][A<sup>-</sup>] / [HA]. Solve for [H<sup>+</sup>] to get [H<sup>+</sup>] = K<sub>a</sub> [HA]/[A<sup>-</sup>]. Take the negative logarithm of both sides. Since pH = -log[H<sup>+</sup>] and pK<sub>a</sub> = -log K<sub>a</sub>, you get:

**pH = pK<sub>a</sub> + log([A<sup>-</sup>] / [HA])**

In words: the pH equals the pK<sub>a</sub> plus the log of the ratio of base form to acid form. The equation is just the dissociation constant rearranged, so it holds for any weak acid, including the ionizable groups on amino acids.

## Three facts that carry most of the exam

1. **When [A<sup>-</sup>] = [HA], the log term is log 1 = 0, so pH = pK<sub>a</sub>.** The pK<sub>a</sub> is the pH at which a group is half protonated. This is also the half-equivalence point of a titration.
2. **Every pH unit shifts the ratio by a factor of 10.** At pH = pK<sub>a</sub> + 1 the base form outnumbers the acid form 10 to 1. At pH = pK<sub>a</sub> - 1 the acid form outnumbers the base form 10 to 1. At plus or minus 2 units the ratio is 100 to 1.
3. **A buffer works best at pH = pK<sub>a</sub>, and is useful within about one pH unit of it.** In that window, both the acid and base forms are present in meaningful amounts, so the solution can neutralize added acid or base.

![Fraction of acetic acid and acetate versus pH, with the buffer region shaded](assets/notes/henderson-hasselbalch-for-the-mcat.png "Acetic acid (pKa 4.76). The curves cross at the pKa, where the buffer is strongest. The shaded band is the useful range, pKa plus or minus 1.")

Log values worth knowing: log 1 = 0, log 2 is about 0.3, log 3 is about 0.48, log 5 is about 0.7, log 10 = 1. They let you estimate answers by hand. For example, a 2-to-1 ratio shifts the pH by about 0.3 units from the pK<sub>a</sub>.

## Worked example 1: making a buffer

You mix 0.10 mol of acetic acid (pK<sub>a</sub> 4.76) and 0.10 mol of sodium acetate in 1 L of water. The ratio is 1, so pH = 4.76.

Now add 0.02 mol of HCl, a strong acid. The added H<sup>+</sup> reacts completely with the acetate base: A<sup>-</sup> + H<sup>+</sup> gives HA. So acetate drops from 0.10 to 0.08 mol and acetic acid rises from 0.10 to 0.12 mol. Then:

pH = 4.76 + log(0.08 / 0.12) = 4.76 + log(0.667) = 4.76 - 0.18 = 4.58

The pH fell by only 0.18 units. The same amount of HCl added to 1 L of pure water would take the pH from 7 to 1.7. That contrast is what a buffer does. The procedure to remember is: **do the stoichiometry first** (strong acid converts base to acid, strong base converts acid to base), then plug the new amounts into the equation.

Diluting a buffer with water leaves the ratio unchanged, so the calculated pH barely changes, though the buffer capacity drops.

## Worked example 2: the blood bicarbonate buffer

Blood's main buffer is the carbonic acid-bicarbonate system. Carbon dioxide dissolves in water and equilibrates with carbonic acid, so the acid component is effectively dissolved CO<sub>2</sub>, which is 0.03 mM per mmHg of P<sub>CO2</sub>. The apparent pK<sub>a</sub> for this combined system is 6.1:

pH = 6.1 + log([HCO<sub>3</sub><sup>-</sup>] / (0.03 &times; P<sub>CO2</sub>))

With a normal bicarbonate of 24 mM and P<sub>CO2</sub> of 40 mmHg, the dissolved CO<sub>2</sub> is 0.03 &times; 40 = 1.2 mM. The ratio is 24/1.2 = 20, and log 20 = 1.3, so the pH is 6.1 + 1.3 = **7.4**.

This equation explains acid-base physiology directly. If someone hyperventilates and P<sub>CO2</sub> drops to 20 mmHg, the CO<sub>2</sub> term halves to 0.6 mM. The ratio doubles to 40, log 40 = 1.6, and the pH rises to about 7.7. That is respiratory alkalosis. If bicarbonate falls instead (as in metabolic acidosis), the ratio and the pH both fall. The lungs control the denominator and the kidneys control the numerator.

Note that 7.4 is a full 1.3 units above the pK<sub>a</sub> of 6.1. By the "within one unit" rule, this buffer is not at its optimum. It works well in blood because it is an open system: the lungs remove CO<sub>2</sub> and the kidneys adjust bicarbonate, so the system is constantly restored.

## Worked example 3: drug ionization

Weak acid drugs and weak base drugs cross membranes mainly in their uncharged form, so ionization affects absorption. Aspirin is a weak acid with pK<sub>a</sub> about 3.5.

- In the stomach at pH 2: log(A<sup>-</sup>/HA) = 2 - 3.5 = -1.5, so the ratio A<sup>-</sup>/HA is 10<sup>-1.5</sup>, about 0.03. Roughly 3 percent is ionized and nearly all is in the uncharged HA form that crosses membranes easily.
- In blood at pH 7.4: log ratio = 7.4 - 3.5 = 3.9, a ratio near 8000 to 1. Over 99.9 percent is ionized.

The same math applies to a weak base, using the pK<sub>a</sub> of its conjugate acid: pH = pK<sub>a</sub> + log([B] / [BH<sup>+</sup>]). Ammonia's conjugate acid NH<sub>4</sub><sup>+</sup> has pK<sub>a</sub> about 9.25, so at pH 7.4 most ammonia is in the ammonium form.

## Using it on amino acids

Each ionizable group on an amino acid obeys the same equation with its own pK<sub>a</sub>. A group is more than 90 percent in its base form once pH exceeds the pK<sub>a</sub> by one unit, and more than 90 percent in its acid form when pH is a unit below. That is the logic behind the charge-at-pH method in the [amino acid note](amino-acid-pka-charge-ph-7-4.html).

## Titration curves and the equation

On a titration curve of a weak acid with strong base, the Henderson-Hasselbalch equation describes the region in the middle. At the half-equivalence point, half the acid has been converted to its base, the ratio is 1, and pH = pK<sub>a</sub>. At the equivalence point all the acid has become conjugate base. The pH there is above 7 for a weak acid titrated with a strong base, because the conjugate base reacts with water to make hydroxide. The equation does not apply at the equivalence point itself because the HA term is nearly zero.

## Limits of the equation

- It assumes concentrations approximate activities, which holds for dilute solutions.
- It breaks down when the acid is very dilute or very strong, or at the extreme ends of a titration, where the water term and the [H<sup>+</sup>] you are solving for are not negligible.
- It assumes you used the correct pK<sub>a</sub> for the correct group. A polyprotic acid has several, and you pick the one nearest the pH of interest.

## Common traps

- **Flipping the ratio.** It is [base]/[acid], not the reverse. A quick check: if pH is above pK<sub>a</sub>, the base form should dominate.
- **Skipping stoichiometry.** When strong acid or base is added, first convert moles, then use the equation.
- **Using concentrations after dilution inconsistently.** Because both terms are in the same total volume, you can use moles directly in the ratio.
- **Using the weak base's own pK<sub>b</sub> in the pH form.** Convert to the conjugate acid's pK<sub>a</sub> (pK<sub>a</sub> + pK<sub>b</sub> = 14 at 25 C).

## One-minute recap

pH = pK<sub>a</sub> + log([A<sup>-</sup>]/[HA]). At pH = pK<sub>a</sub> the two forms are equal. Each pH unit changes the ratio tenfold. Buffers work best within one unit of the pK<sub>a</sub>. For added strong acid or base, do the mole bookkeeping first. In blood, pH = 6.1 + log([HCO<sub>3</sub><sup>-</sup>]/(0.03 &times; P<sub>CO2</sub>)).

:::quiz
Q: A buffer contains acetate and acetic acid (pKa 4.76) in a 10:1 ratio of acetate to acid. What is the pH?
A: pH = 4.76 + log(10) = 5.76.
Q: What is the ratio of HPO4(2-) to H2PO4(-) at pH 7.2 if the relevant pKa is 7.2?
A: The ratio is 1. When pH equals pKa, the log term is zero, so the base and acid forms are present in equal amounts.
Q: A 1 L buffer has 0.20 mol of weak acid HA and 0.20 mol of A- (pKa 5.0). You add 0.05 mol of NaOH. What is the new pH?
A: The base converts HA to A-. HA becomes 0.15 mol and A- becomes 0.25 mol. pH = 5.0 + log(0.25/0.15) = 5.0 + log(1.67) = 5.0 + 0.22, so about 5.22.
Q: Using pH = 6.1 + log([HCO3-]/(0.03 x PCO2)), what happens to blood pH if PCO2 rises from 40 to 80 mmHg with bicarbonate held at 24 mM?
A: The CO2 term doubles from 1.2 to 2.4 mM, so the ratio drops from 20 to 10. log 10 = 1, and pH = 6.1 + 1 = 7.1. This is respiratory acidosis.
Q: Why is a buffer most effective when pH is near its pKa?
A: At pH = pKa the acid and base forms are equal, so the solution has the maximum capacity to neutralize added acid (using the base form) or added base (using the acid form) without a large change in the ratio.
:::

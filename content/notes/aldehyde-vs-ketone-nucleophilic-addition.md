---
title: Aldehyde vs Ketone Reactivity in Nucleophilic Addition
description: Learn why aldehydes react faster than ketones in nucleophilic addition, using sterics, electronics, hydration data and a worked example, plus MCAT traps.
product: 5d-biological-molecules-orgo
published: 2026-11-10
related: carboxylic-acid-derivatives-reactivity-nucleophilic-acyl-substitution, anomers-vs-epimers-carbohydrates
---

Aldehydes are more reactive than ketones toward nucleophilic addition. Two effects stack up: an aldehyde's carbonyl carbon carries only one alkyl group, so it is less crowded when the nucleophile arrives, and it receives less electron donation, so it stays more electron poor. The overall order is formaldehyde, then other aldehydes, then ketones.

## What happens in nucleophilic addition

The carbon of a C=O group is electrophilic because oxygen pulls electron density toward itself, leaving a partial positive charge on carbon. A nucleophile attacks that carbon and pushes the pi electrons onto oxygen. The result is a tetrahedral alkoxide intermediate, which picks up a proton to give the addition product.

1. The nucleophile attacks the carbonyl carbon from above or below the flat carbonyl plane.
2. The carbon changes from sp<sup>2</sup> (trigonal planar, bond angles near 120&deg;) to sp<sup>3</sup> (tetrahedral, near 109.5&deg;).
3. The oxygen, now negatively charged, is protonated by solvent or added acid.

With weak nucleophiles such as water or alcohols, acid helps: protonating the carbonyl oxygen makes the carbon far more electrophilic. Strong nucleophiles such as hydride or Grignard reagents attack directly and the alkoxide is protonated in a later workup step.

Aldehydes and ketones stop at addition because neither has a good leaving group on the carbonyl carbon. Acid chlorides, anhydrides, esters and amides do have one, so they undergo [nucleophilic acyl substitution](carboxylic-acid-derivatives-reactivity-nucleophilic-acyl-substitution.html) instead.

## Why aldehydes win: two reasons

### Steric crowding

Going from a flat carbonyl to a tetrahedral product squeezes the groups on that carbon closer together. In an aldehyde, one of those groups is a tiny hydrogen atom. In a ketone, both are carbon groups, so the tetrahedral product is more crowded and higher in energy. The nucleophile also has a more open path to an aldehyde carbon as it approaches. Bulky ketones such as di-tert-butyl ketone are very sluggish for this reason.

### Electronic donation

Alkyl groups donate electron density to the carbonyl carbon through induction and hyperconjugation. This spreads out the partial positive charge and makes the carbon a weaker electrophile. A ketone has two donating groups, an aldehyde has one, and formaldehyde has none, which is why formaldehyde is the most reactive of all.

Conjugation lowers reactivity too. In benzaldehyde, the aromatic ring shares electron density with the carbonyl through resonance, so benzaldehyde is less reactive than a simple aliphatic aldehyde like propanal.

| Compound | Groups on C=O carbon | Relative reactivity |
|---|---|---|
| Formaldehyde | H, H | Highest |
| Acetaldehyde | H, CH<sub>3</sub> | High |
| Benzaldehyde | H, phenyl (conjugated) | Lower than aliphatic aldehydes |
| Acetone | CH<sub>3</sub>, CH<sub>3</sub> | Lower |
| Di-tert-butyl ketone | two bulky groups | Very low |

## Worked example: hydration equilibria

Water adds to a carbonyl to form a gem-diol (hydrate). The equilibrium constant K<sub>hyd</sub> = [hydrate] / [carbonyl] is a clean measure of how favorable addition is, because the nucleophile is the same for every compound. Reported values vary by source; this example uses approximate values of 2000 for formaldehyde, 1.0 for acetaldehyde and 0.0014 for acetone.

The fraction present as hydrate is K / (1 + K).

1. Formaldehyde: 2000 / 2001 = 0.9995, so about 99.95% hydrate.
2. Acetaldehyde: 1.0 / 2.0 = 0.50, so about 50% hydrate.
3. Acetone: 0.0014 / 1.0014 = 0.0014, so about 0.14% hydrate.

Adding a single methyl group (formaldehyde to acetaldehyde) drops K about 2000-fold, and adding a second (acetaldehyde to acetone) drops it roughly another 700-fold. Each carbon group, through sterics and donation, pushes the equilibrium back toward the carbonyl.

![Bar chart on a log scale of the percent of each compound present as hydrate in water: formaldehyde about 99.95 percent, acetaldehyde about 50 percent, acetone about 0.14 percent](assets/notes/aldehyde-vs-ketone-nucleophilic-addition.png "Percent hydrate at equilibrium, computed from approximate K values")

## The addition reactions to know

| Nucleophile | Aldehyde gives | Ketone gives |
|---|---|---|
| Water | Hydrate (gem-diol) | Hydrate, usually minor |
| One alcohol (acid) | Hemiacetal | Hemiketal |
| Two alcohols or a diol (acid, water removed) | Acetal | Ketal (also called an acetal) |
| Primary amine | Imine | Imine |
| Secondary amine | Enamine | Enamine |
| Cyanide (HCN with a little base) | Cyanohydrin | Cyanohydrin |
| NaBH<sub>4</sub> then workup | Primary alcohol | Secondary alcohol |
| Grignard reagent then acid workup | Secondary alcohol (formaldehyde gives primary) | Tertiary alcohol |

Ring forms of sugars are an internal version of hemiacetal formation: a hydroxyl group on the same chain adds to the aldehyde or ketone carbonyl, which is why glucose forms a cyclic hemiacetal and fructose a cyclic hemiketal. See [anomers vs epimers](anomers-vs-epimers-carbohydrates.html) for what that new stereocenter means.

A related difference is not an addition at all: aldehydes are easily oxidized to carboxylic acids because they have an H on the carbonyl carbon, while ketones resist oxidation under the same mild conditions.

## Common traps

- **More alkyl groups do not mean more reactive.** Alkyl groups donate electrons and add bulk, so they lower reactivity toward nucleophiles.
- **Addition, not substitution.** Aldehydes and ketones have no leaving group on the carbonyl carbon, so the tetrahedral intermediate is protonated, not collapsed.
- **Conjugation slows addition.** Aromatic aldehydes and ketones are less reactive than their aliphatic relatives.
- **Acetals are stable in base, not in aqueous acid.** That is why acetals protect carbonyls during base-driven steps and are removed with aqueous acid afterward.
- **Grignard and hydride products differ by carbonyl type.** Count the carbon groups on the carbonyl carbon after addition to name the alcohol class.

The [5D Biological Molecules and Organic Reactivity pack](../products/5d-biological-molecules-orgo.html) adds flashcards and practice questions on carbonyl chemistry, carbohydrates, lipids and amino acids, and you can try a [free sampler](/#sampler) first.

## One-minute recap

- Nucleophiles attack the electrophilic carbonyl carbon, forming a tetrahedral alkoxide that is then protonated.
- Aldehydes beat ketones: less steric crowding in the tetrahedral product and less electron donation to the carbonyl carbon.
- Order: formaldehyde, then aliphatic aldehydes, then ketones. Conjugation with a ring and bulky groups each slow addition further.
- Hydration data show it: about 99.95% hydrate for formaldehyde, 50% for acetaldehyde, 0.14% for acetone.
- No leaving group means addition, not acyl substitution.

:::quiz
Q: Which is more reactive toward nucleophilic addition, butanal or 2-butanone, and why?
A: Butanal. Its carbonyl carbon has one hydrogen instead of a second carbon group, so it is less crowded and receives less electron donation.
Q: A carbonyl compound has K<sub>hyd</sub> = 4.0 in water. What fraction is present as the hydrate at equilibrium?
A: K / (1 + K) = 4.0 / 5.0 = 0.80, so 80% is hydrate.
Q: Why is benzaldehyde less reactive toward nucleophiles than propanal?
A: The aromatic ring donates electron density to the carbonyl by resonance, which lowers the partial positive charge on the carbonyl carbon.
Q: What class of alcohol forms when a Grignard reagent adds to a ketone, followed by acid workup?
A: A tertiary alcohol, because the carbonyl carbon ends up bonded to three carbon groups.
Q: Why do aldehydes and ketones undergo addition rather than nucleophilic acyl substitution?
A: Neither has a good leaving group on the carbonyl carbon, so the tetrahedral intermediate is protonated instead of expelling a group.
:::

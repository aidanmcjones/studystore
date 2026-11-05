---
title: CAP and cAMP in the Lac Operon: Catabolite Repression Explained
description: How cAMP and the catabolite activator protein (CAP) switch the lac operon up when glucose is low, and how that combines with the repressor to give four conditions.
product: 1b-dna-gene-expression
published: 2026-11-04
related: lac-operon-regulation-lactose-glucose, lac-operon-partial-diploids-merodiploid-problems
seo_title: CAP and cAMP in the Lac Operon: Catabolite Repression
seo_description: What CAP and cAMP do in the lac operon, why low glucose raises cAMP, and the four lactose and glucose conditions with their expression levels.
---

The lac operon has two controls. The **lac repressor** turns it off when lactose is absent. **CAP (catabolite activator protein, also called CRP)** turns it up when glucose is scarce. **CAP only activates when it is bound to cAMP, and cAMP is high only when glucose is low.** That is the whole mechanism of catabolite repression.

## The two signals

- **Lactose signal (negative control).** Allolactose, made from lactose, binds the repressor so it leaves the operator. Without lactose, the repressor sits on the operator and blocks RNA polymerase.
- **Glucose signal (positive control).** When glucose is low, cAMP rises. cAMP binds CAP. The CAP-cAMP complex binds a site upstream of the promoter and helps RNA polymerase bind, increasing transcription.

When glucose is high, cAMP is low, so CAP does not bind DNA and transcription stays low even if the repressor is off.

## The four conditions

| Glucose | Lactose | Repressor | CAP-cAMP | Expression |
|---|---|---|---|---|
| High | Absent | On operator | Not bound | Off |
| High | Present | Off operator | Not bound | Low |
| Low | Absent | On operator | Bound | Off |
| Low | Present | Off operator | Bound | High |

Only the last row gives strong transcription. The repressor must be off **and** CAP-cAMP must be bound.

## Why this is useful to the cell

If both glucose and lactose are present, the cell uses glucose first and does not need to make the enzymes for lactose. Only when glucose runs out and lactose is present does it pay to make them. This is a form of **diauxic growth**: glucose is used first, then there is a pause, then lactose is used.

## What cAMP is and is not

- cAMP is a **signal of low glucose**, not an inducer of the operon. The inducer is allolactose.
- cAMP is made by adenylate cyclase. In E. coli, glucose uptake lowers adenylate cyclase activity, so cAMP falls.
- Here cAMP works as a nutrient signal inside bacteria, binding CAP rather than acting through a receptor cascade.

## Mutation logic

- **CAP site mutated so CAP cannot bind:** expression stays low even with lactose and low glucose.
- **lacI mutated so the repressor cannot bind the operator:** expression is constitutive but still reduced when glucose is high, because CAP is not helping.
- **lacI mutated so the repressor cannot bind allolactose:** the operon stays off in all conditions.

## Common traps

- **Saying CAP represses.** CAP activates; the name catabolite repression refers to glucose's effect.
- **Saying high cAMP means high glucose.** It means low glucose.
- **Forgetting the repressor.** Low glucose alone does not turn the operon on.

## One-minute recap

- Repressor off needs lactose. CAP active needs low glucose.
- Strong expression needs both.
- cAMP signals low glucose; allolactose is the inducer.

:::quiz
Q: When is the lac operon expressed at the highest level?
A: When lactose is present and glucose is low.
Q: What does cAMP do in this system?
A: It binds CAP so CAP can bind DNA and help RNA polymerase.
Q: Is cAMP high or low when glucose is abundant?
A: Low.
Q: What is the inducer of the lac operon?
A: Allolactose, not cAMP.
Q: What is the lac operon expression with glucose and lactose both present?
A: Low, because the repressor is off but CAP-cAMP is not bound.
:::

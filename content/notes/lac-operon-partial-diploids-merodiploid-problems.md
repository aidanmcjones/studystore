---
title: Lac Operon Partial Diploids: How to Solve Merodiploid Problems
description: A step-by-step method for lac operon partial diploid (merodiploid) questions: which mutations act in cis, which act in trans, and what each genotype does with and without lactose.
product: 1b-dna-gene-expression
published: 2026-11-04
related: lac-operon-regulation-lactose-glucose, hardy-weinberg-equation-practice-problems
seo_title: Lac Operon Partial Diploids: Solve Merodiploid Problems
seo_description: Solve lac operon partial diploid questions: cis vs trans mutations, lacI, lacO(c), lacI(s), cAMP-CAP and glucose, with worked genotypes and a quiz.
---

A **partial diploid** (merodiploid) is a bacterium with its normal chromosome plus a second copy of part of the lac operon on a plasmid, written with a slash, for example I<sup>+</sup> O<sup>+</sup> Z<sup>-</sup> / I<sup>-</sup> O<sup>+</sup> Z<sup>+</sup>. These questions look intimidating, but they reduce to one question per gene: **does the mutation act only on its own DNA (cis) or on both copies (trans)?**

## The parts and what each one does

- **lacI** encodes the repressor, a diffusible protein. It binds the operator and blocks transcription until allolactose binds it.
- **lacO** is the operator, a DNA site. It only controls the genes on the **same** DNA molecule.
- **lacP** is the promoter. Like the operator, it works only on its own DNA.
- **lacZ** encodes beta-galactosidase and **lacY** encodes the permease.
- **CAP-cAMP** is a positive activator. cAMP is high only when glucose is low, so the operon is strongly on only when **lactose is present and glucose is absent**.

## Cis versus trans: the whole trick

A product that diffuses (repressor, enzyme) can work on either copy, so a good copy of that gene can **rescue** a bad one in trans. A DNA site (operator, promoter) cannot, so its defect stays on its own molecule.

| Mutation | Effect | Acts in |
|---|---|---|
| I<sup>-</sup> (no repressor) | Constitutive expression | Recessive; a second I<sup>+</sup> restores control (trans) |
| I<sup>s</sup> (super-repressor, cannot bind allolactose) | Never induced | Dominant over I<sup>+</sup> (trans) |
| O<sup>c</sup> (operator cannot bind repressor) | Constitutive expression of genes **on the same DNA** | Cis only |
| P<sup>-</sup> (promoter broken) | No transcription of genes on that DNA | Cis only |
| Z<sup>-</sup> or Y<sup>-</sup> | Missing enzyme or permease | Recessive; a good copy supplies it (trans) |

## A four-step method

1. Write each chromosome on its own row so you can see which genes share a molecule.
2. Ask whether a working repressor exists anywhere. If any I<sup>+</sup> is present, repressor is made for both copies (unless I<sup>s</sup> is also there).
3. For each copy, ask whether its own operator and promoter are intact. Only then can that copy's Z and Y be transcribed.
4. Add lactose and glucose conditions. Without lactose, only a copy with a mutant operator (or no working repressor) is on. With lactose, a copy is on if it has an intact promoter and, for high levels, glucose is low.

## Worked examples

**Example 1: I<sup>+</sup> O<sup>+</sup> Z<sup>+</sup> / I<sup>-</sup> O<sup>+</sup> Z<sup>-</sup>.** One good repressor is made and acts on both operators. Without lactose, both operons are off; with lactose, the Z<sup>+</sup> copy is on. Regulation is normal.

**Example 2: I<sup>+</sup> O<sup>c</sup> Z<sup>-</sup> / I<sup>+</sup> O<sup>+</sup> Z<sup>+</sup>.** Repressor is plentiful, but the O<sup>c</sup> copy ignores it. That copy is on constitutively, yet it carries Z<sup>-</sup>, so it makes no working enzyme. The Z<sup>+</sup> copy has a normal operator and stays repressed without lactose. Result: no beta-galactosidase without lactose, because the constitutive operator is **cis to the broken gene**.

**Example 3: I<sup>+</sup> O<sup>c</sup> Z<sup>+</sup> / I<sup>+</sup> O<sup>+</sup> Z<sup>-</sup>.** Now the constitutive operator sits cis to a good Z. Beta-galactosidase is made even with no lactose.

**Example 4: I<sup>s</sup> / I<sup>+</sup>.** The super-repressor cannot bind allolactose and stays on the operator, so the operon cannot be induced even with lactose.

## Low but detectable expression with glucose only

With glucose as the only carbon source and no lactose, a normal operon (I<sup>+</sup> O<sup>+</sup> P<sup>+</sup>) shows a **low, detectable basal** level of transcription because repression is not perfect. Genotypes that are constitutive (I<sup>-</sup> or O<sup>c</sup> with working Z) give higher mRNA, but glucose still keeps cAMP low, so even they are below their maximum. Pick the genotype with a working repressor and operator when the question describes low-but-detectable levels.

## Common traps

- **Treating the operator as diffusible.** O<sup>c</sup> is cis-acting only.
- **Forgetting glucose.** Without CAP-cAMP, expression stays low even with lactose.
- **Reading I<sup>s</sup> as recessive.** It is dominant.
- **Ignoring which copy carries the good Z.** Constitutive does not help if the constitutive copy has the broken enzyme gene.

## One-minute recap

- Diffusible products (repressor, enzymes) act in trans; DNA sites (operator, promoter) act in cis.
- O<sup>c</sup> is constitutive only for genes on its own DNA; I<sup>s</sup> is dominant and uninducible.
- Maximal expression needs lactose present and glucose low.

:::quiz
Q: Does a mutant operator (O^c) affect genes on the other DNA molecule in a partial diploid?
A: No, an operator acts only in cis on the genes on its own molecule.
Q: Why does an I^- mutation become normal when an I^+ gene is added on a plasmid?
A: The repressor protein diffuses, so the I^+ copy supplies repressor to both operators (trans).
Q: What is the effect of the I^s super-repressor?
A: It cannot bind allolactose, stays on the operator, and blocks induction; it is dominant.
Q: What conditions give the highest lac operon expression?
A: Lactose present and glucose absent, so the repressor is released and CAP-cAMP is active.
Q: In I+ Oc Z- / I+ O+ Z+, is beta-galactosidase made without lactose?
A: No. The constitutive operator is cis to the Z- gene, and the Z+ copy is repressed.
:::

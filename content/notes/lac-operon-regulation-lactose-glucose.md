---
title: The Lac Operon Explained: Lactose, Glucose, cAMP and CAP
description: How the lac repressor and CAP-cAMP combine to set lac operon output, a four-condition table, mutant and partial diploid logic, and the traps that cost points.
seo_title: Lac Operon Explained for the MCAT | Free Notes
seo_description: Free MCAT lac operon notes: how the repressor and CAP-cAMP control expression, a four-condition table, mutants and a 5-question quiz.
product: 1b-dna-gene-expression
published: 2026-10-20
related: glycolysis-steps-enzymes-net-atp, anomers-vs-epimers-carbohydrates, passive-vs-active-transport
---

The lac operon is turned on strongly only when two conditions hold at once: **lactose is present** (so the repressor lets go of the operator) and **glucose is scarce** (so cAMP is high and the activator CAP helps RNA polymerase bind). Lactose alone removes the brake; low glucose presses the accelerator. Every lac question, including the mutant and partial diploid ones, is a matter of checking those two switches.

## Why E. coli bothers to regulate lactose genes

E. coli prefers glucose. Lactose is a disaccharide (galactose joined by a beta 1-4 bond to glucose) that the cell can use only after importing it and splitting it. Making the import and splitting proteins costs energy, so the cell builds them only when lactose is available and glucose, the better fuel, is not. The lac operon is the textbook case of a **catabolic, inducible** system: off by default, switched on by the arrival of the nutrient it breaks down.

## The parts, in order

An operon is a set of bacterial genes transcribed from one promoter into one **polycistronic mRNA**, so the genes are switched on and off together. Reading along the DNA:

| Element | What it is | Job |
|---|---|---|
| lacI | Separate gene with its own promoter | Makes the lac repressor protein, all the time |
| CAP site | DNA sequence just upstream of the promoter | Binding spot for the CAP-cAMP activator |
| Promoter (P) | Where RNA polymerase binds | Start of transcription |
| Operator (O) | Short sequence overlapping the start of transcription | Binding spot for the repressor |
| lacZ | Structural gene | Beta-galactosidase: splits lactose into glucose and galactose |
| lacY | Structural gene | Lactose permease: brings lactose into the cell |
| lacA | Structural gene | Thiogalactoside transacetylase (its role is minor) |

Two kinds of element appear in the table. **Genes** (lacI, lacZ, lacY, lacA) code for proteins that can float around the cell. **Sites** (CAP site, promoter, operator) are stretches of DNA that only control the genes physically attached to them. That difference becomes the whole game in mutant questions.

![Lac operon map with the repressor and CAP-cAMP state under four conditions](assets/notes/lac-operon-regulation-lactose-glucose.png "The repressor blocks transcription unless inducer is present; CAP-cAMP boosts it only when glucose is low. High output needs both.")

## Switch 1: the repressor and the inducer (is lactose here?)

The lacI gene is expressed constitutively, so the cell always holds a small pool of **lac repressor**. With no lactose around, the repressor sits on the operator and physically gets in the way of RNA polymerase. Transcription is close to off.

When lactose enters, some of it is rearranged by beta-galactosidase into **allolactose**, an isomer with a beta 1-6 bond. Allolactose is the true **inducer**. It binds the repressor, changes its shape (an allosteric change), and lowers its grip on the operator. The repressor falls off and the polymerase can proceed.

This raises a fair question: if lactose is needed to make the inducer, and the enzymes are off, how does lactose get in at all? Repression is leaky. A few copies of permease and beta-galactosidase exist even in the off state, enough to bring in some lactose and start the process.

Researchers often use IPTG, a synthetic molecule that binds the repressor like allolactose but is not broken down by beta-galactosidase, so it keeps the operon induced at a steady level.

## Switch 2: CAP and cAMP (is glucose scarce?)

Even with the repressor gone, the lac promoter is weak on its own, and RNA polymerase binds it poorly. It needs an activator. That activator is the **catabolite activator protein (CAP)**, also called CRP.

- When glucose is **low**, the cell's adenylyl cyclase is more active, **cAMP rises**, cAMP binds CAP, and the CAP-cAMP complex binds the CAP site just upstream of the promoter. It bends the DNA and contacts RNA polymerase, which raises transcription substantially.
- When glucose is **high**, cAMP stays low, CAP is mostly empty, and it does not bind well. Expression stays low even if lactose is present.

The glucose effect is called **catabolite repression**. A further part of it in real cells is inducer exclusion: active glucose uptake inhibits the lactose permease, so less lactose gets in to make allolactose. For exam purposes, the cAMP and CAP logic is the core you need.

Notice the opposite logic of the two proteins. The repressor is **negative control** (a protein that stops transcription when bound). CAP is **positive control** (a protein that boosts transcription when bound).

## The four-condition table

| Lactose | Glucose | Repressor on operator? | CAP-cAMP bound? | lac output |
|---|---|---|---|---|
| Absent | Present | Yes | No | Off (basal trace) |
| Absent | Absent | Yes | Yes | Off (basal trace): the repressor still blocks |
| Present | Present | No | No | Low |
| Present | Absent | No | Yes | **High** |

The second row is the one students miss. Low glucose and high cAMP do nothing if the repressor is still parked on the operator. The activator cannot override a blocked operator.

## Mutants: cis versus trans

A mutation in a **gene** changes a diffusible protein, so its effect can reach any copy of the operon in the cell (it acts **in trans**). A mutation in a **site** changes only the DNA it is part of, so it affects only the genes on the same piece of DNA (it acts **in cis**).

- **lacI<sup>-</sup>** (no working repressor): the operon is on whether or not lactose is present. This is **constitutive** expression.
- **lacO<sup>c</sup>** (operator that the repressor cannot bind): also constitutive, but only for the genes attached to that operator.
- **lacI<sup>s</sup>** (super-repressor that cannot bind inducer): the repressor never lets go, so the operon stays off even with lactose. Expression is **uninducible**.
- **Promoter mutation** that RNA polymerase cannot use: no expression of the attached genes under any condition.
- **CAP or adenylyl cyclase defect:** output stays low even with lactose and no glucose, because the activator never helps.

### Worked example: partial diploids

Geneticists put a second copy of the lac region into the cell on a small plasmid (written after "F'") and ask whether beta-galactosidase is made without lactose (uninduced) and with lactose (induced). Treat each copy of the operon separately, then ask which proteins can reach it.

**Strain 1: lacI<sup>-</sup> lacZ<sup>+</sup> / F' lacI<sup>+</sup> lacZ<sup>-</sup>**

1. The plasmid's lacI<sup>+</sup> makes working repressor. It diffuses, so it can bind the chromosome's normal operator too.
2. The chromosome's lacZ<sup>+</sup> is therefore repressed without lactose and released with lactose.
3. The plasmid's lacZ<sup>-</sup> makes no working enzyme either way.
4. Result: beta-galactosidase is **inducible**. A working repressor gene is dominant over a broken one, because its product acts in trans.

**Strain 2: lacO<sup>c</sup> lacZ<sup>-</sup> / F' lacO<sup>+</sup> lacZ<sup>+</sup>** (both copies have normal lacI)

1. The chromosome copy is always transcribed because its operator cannot be blocked, but its lacZ is broken, so the constant transcription yields no working enzyme.
2. The plasmid copy has a normal operator and a working lacZ, so it behaves normally.
3. Result: beta-galactosidase is **inducible**, not constitutive. An operator mutation helps only the genes on its own DNA, which is what "cis-acting" means.

Swap the plasmid in strain 2 to lacO<sup>c</sup> lacZ<sup>+</sup> and the answer flips to constitutive, because the broken operator now sits next to the working gene.

## Lac versus trp: inducible versus repressible

The trp operon encodes the enzymes that **build** tryptophan, so the logic runs the other way. It is **repressible**: on by default, and shut off when the product piles up. Tryptophan acts as a **corepressor**. It binds the trp repressor, which only then attaches to the trp operator. A second layer, **attenuation**, uses the speed of ribosomes on a short leader sequence to decide whether a terminator hairpin forms in the mRNA, which ends transcription early when tryptophan is plentiful.

| Feature | lac | trp |
|---|---|---|
| Pathway type | Breaks a nutrient down (catabolic) | Builds a product (anabolic) |
| Default state | Off | On |
| Small molecule | Allolactose, an inducer, removes the repressor | Tryptophan, a corepressor, activates the repressor |
| Extra control | CAP-cAMP activation | Attenuation |

A useful way to remember it: a pathway that **uses up** a molecule is switched on by that molecule, and a pathway that **makes** a molecule is switched off by it. Both choices stop the cell from wasting effort.

## Common traps

- **Lactose present does not mean high expression.** If glucose is also present, cAMP is low and output stays low.
- **Low glucose alone does nothing.** Without inducer, the repressor still blocks the operator.
- **The inducer is allolactose,** not lactose itself, in the standard model.
- **The repressor binds the operator, not the promoter,** and CAP binds the CAP site, not the operator.
- **lacI is not part of the polycistronic lac mRNA.** It has its own promoter and is always on.
- **Operons are a bacterial feature.** Eukaryotic genes are usually transcribed one per mRNA and controlled by enhancers, transcription factors, and chromatin.
- **Cis versus trans:** gene mutations (lacI) can be rescued by a second working copy; operator mutations cannot be rescued by a second copy, because they only affect their own DNA.

## One-minute recap

The lac operon (CAP site, promoter, operator, lacZ, lacY, lacA) makes one mRNA for the lactose genes. The repressor, made constantly from lacI, blocks the operator until allolactose binds it. CAP-cAMP, present when glucose is low, activates the weak promoter. High output needs lactose present and glucose low. lacI<sup>-</sup> and lacO<sup>c</sup> give constitutive expression; lacI<sup>s</sup> makes it uninducible. Repressor genes act in trans, operators act in cis. The trp operon is the repressible mirror image, with tryptophan as corepressor and attenuation on top.

:::quiz
Q: E. coli is grown with both glucose and lactose. Is the repressor on the operator, is CAP-cAMP bound, and what is the lac output?
A: The repressor is off (allolactose binds it) but cAMP is low, so CAP-cAMP is not bound. Output is low until the glucose runs out.
Q: A strain cannot make cAMP. What happens to lac expression when lactose is present and glucose is absent?
A: Expression stays low, because CAP needs cAMP to bind the CAP site and activate the weak lac promoter, even though the repressor has been removed.
Q: A strain carries a repressor that binds the operator normally but cannot bind allolactose. What is its phenotype?
A: Uninducible: the repressor never leaves the operator, so the operon stays off even with lactose present. This is the lacI-s super-repressor.
Q: In the partial diploid lacI- lacZ+ / F' lacI+ lacZ-, is beta-galactosidase constitutive or inducible, and why?
A: Inducible. The repressor made from the plasmid diffuses and acts in trans on the chromosome's normal operator, so the working lacZ+ copy is repressed until lactose arrives.
Q: Why is the trp operon called repressible while the lac operon is called inducible?
A: The trp operon is on by default and is switched off when tryptophan, acting as a corepressor, activates its repressor. The lac operon is off by default and is switched on when the inducer allolactose removes its repressor.
:::

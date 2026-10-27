---
title: Glycolysis Steps, Enzymes and Net ATP Yield for the MCAT
description: The ten steps of glycolysis grouped into investment and payoff, the three regulated enzymes, a step-by-step ATP and NADH ledger, and trap questions.
seo_title: MCAT Glycolysis Steps, Enzymes and Net ATP (Free Notes)
seo_description: Free MCAT glycolysis notes: all 10 steps, the 3 regulated enzymes, net ATP and NADH, plus a 5-question quiz. Investment vs payoff phase explained.
product: 1d-metabolism-bioenergetics
published: 2026-10-20
related: michaelis-menten-and-lineweaver-burk, enzyme-classes-ec-1-to-7, passive-vs-active-transport
---

Glycolysis turns one glucose (6 carbons) into two pyruvate (3 carbons each) in the cytosol, without needing oxygen. It spends 2 ATP early, makes 4 ATP and 2 NADH later, and so **nets 2 ATP, 2 NADH and 2 pyruvate per glucose**. Three steps are effectively one-way and serve as the control points: **hexokinase, phosphofructokinase-1 (PFK-1) and pyruvate kinase**. If you can place those three and keep a running ATP tally, most glycolysis questions fall out.

## The big picture in two phases

Think of glycolysis as a small business. The first half is the **investment phase**: the cell spends 2 ATP to tag glucose with phosphates and split it into two three-carbon pieces. The second half is the **payoff phase**: each three-carbon piece is oxidized once (making NADH) and gives up two phosphates to ADP (making ATP). Because the split produces two pieces, every payoff step happens twice per glucose.

![Running ATP and NADH totals across the ten steps of glycolysis](assets/notes/glycolysis-steps-enzymes-net-atp.png "Net ATP per glucose dips to -2 after the investment phase, returns to 0 at phosphoglycerate kinase, and finishes at +2 after pyruvate kinase. NADH appears once, at GAPDH.")

## The ten steps

| Step | Enzyme | Reaction | Energy bookkeeping (per glucose) |
|---|---|---|---|
| 1 | Hexokinase (glucokinase in liver and pancreatic beta cells) | Glucose &rarr; glucose 6-phosphate | -1 ATP, one-way, regulated |
| 2 | Phosphoglucose isomerase | Glucose 6-phosphate &rarr; fructose 6-phosphate | Reversible |
| 3 | **PFK-1** | Fructose 6-phosphate &rarr; fructose 1,6-bisphosphate | -1 ATP, one-way, committed and rate-limiting |
| 4 | Aldolase | Fructose 1,6-bisphosphate &rarr; DHAP + glyceraldehyde 3-phosphate | Reversible; the 6-carbon split |
| 5 | Triose phosphate isomerase | DHAP &rarr; glyceraldehyde 3-phosphate | Reversible; now 2 G3P per glucose |
| 6 | Glyceraldehyde 3-phosphate dehydrogenase (GAPDH) | G3P + NAD<sup>+</sup> + P<sub>i</sub> &rarr; 1,3-bisphosphoglycerate + NADH | +2 NADH; the only oxidation |
| 7 | Phosphoglycerate kinase | 1,3-bisphosphoglycerate &rarr; 3-phosphoglycerate | +2 ATP, reversible |
| 8 | Phosphoglycerate mutase | 3-phosphoglycerate &rarr; 2-phosphoglycerate | Reversible; phosphate moves |
| 9 | Enolase | 2-phosphoglycerate &rarr; phosphoenolpyruvate (PEP) + H<sub>2</sub>O | Reversible; a dehydration |
| 10 | **Pyruvate kinase** | PEP &rarr; pyruvate | +2 ATP, one-way, regulated |

A memory hook of my own for the order of the enzymes: "**H**ungry **P**eople **P**refer **A** **T**asty **G**rilled **P**otato, **P**lus **E**xtra **P**epper" (Hexokinase, Phosphoglucose isomerase, PFK-1, Aldolase, Triose phosphate isomerase, GAPDH, Phosphoglycerate kinase, Phosphoglycerate mutase, Enolase, Pyruvate kinase).

### What the enzyme names tell you

The names carry the chemistry, which helps when you forget a step.

- A **kinase** moves a phosphate between ATP and another molecule. Note that phosphoglycerate kinase and pyruvate kinase are named for the reverse direction, but in glycolysis they **make** ATP.
- An **isomerase** rearranges a molecule without adding or removing atoms (aldose to ketose at step 2, ketose to aldose at step 5).
- A **mutase** shifts a group to a new position on the same molecule.
- A **dehydrogenase** oxidizes its substrate and hands the electrons to a carrier such as NAD<sup>+</sup>.
- **Aldolase** runs an aldol reaction in reverse to split the sugar, and **enolase** removes water to form an enol phosphate.

Making ATP by passing a phosphate directly from a high-energy substrate (1,3-bisphosphoglycerate or PEP) to ADP is called **substrate-level phosphorylation**. It is different from oxidative phosphorylation, which uses ATP synthase and a proton gradient.

## Regulation at the three one-way steps

Steps 1, 3 and 10 have large negative free energy changes in the cell, so they run essentially one way. Those are the steps the cell controls, and they are also the steps gluconeogenesis must go around with different enzymes.

| Enzyme | Turned up by | Turned down by | Why it makes sense |
|---|---|---|---|
| Hexokinase | (substrate availability) | Glucose 6-phosphate, its own product | Stops trapping glucose when the product piles up |
| Glucokinase (liver) | Insulin raises its amount; high blood glucose | Not inhibited by glucose 6-phosphate | Liver takes up glucose in proportion to blood levels after a meal |
| PFK-1 | AMP, fructose 2,6-bisphosphate | ATP, citrate | Speeds up when energy is low, slows when energy or downstream fuel is ample |
| Pyruvate kinase | Fructose 1,6-bisphosphate (feed-forward) | ATP, alanine; in liver, phosphorylation driven by glucagon | Matches output to supply and shuts down in the fasting liver |

Two points deserve a second look.

- **Hexokinase versus glucokinase is a K<sub>m</sub> story.** Hexokinase has a low K<sub>m</sub> for glucose, so it runs near full speed even at fasting glucose levels. Glucokinase has a much higher K<sub>m</sub> (roughly 10 mM; quoted values vary by source), so its rate rises and falls with blood glucose. If K<sub>m</sub> is fuzzy, the [Michaelis-Menten note](michaelis-menten-and-lineweaver-burk.html) covers it.
- **Fructose 2,6-bisphosphate is not a glycolytic intermediate.** It is a signal made by a separate enzyme (PFK-2). In the liver, insulin raises it and glucagon lowers it, which is how hormones reach PFK-1.

## Worked example: keep a ledger

Write a running total per glucose, step by step.

1. Hexokinase: net ATP = -1.
2. PFK-1: net ATP = -2. The investment phase is done.
3. Aldolase and triose phosphate isomerase: 2 G3P. Every step after this counts twice.
4. GAPDH: NADH = 2.
5. Phosphoglycerate kinase: +2 ATP, so net ATP = 0.
6. Pyruvate kinase: +2 ATP, so net ATP = +2.

Totals: 4 ATP made, 2 ATP spent, **net 2 ATP**, plus **2 NADH** and **2 pyruvate**. The overall equation is:

Glucose + 2 NAD<sup>+</sup> + 2 ADP + 2 P<sub>i</sub> &rarr; 2 pyruvate + 2 NADH + 2 H<sup>+</sup> + 2 ATP + 2 H<sub>2</sub>O

### Variation 1: glucose from glycogen

Glycogen breakdown releases glucose 1-phosphate, which phosphoglucomutase converts to glucose 6-phosphate. The phosphate came from inorganic phosphate, not ATP, so the hexokinase step is skipped. The ledger becomes -1 (PFK-1 only) + 4 = **net 3 ATP** per glucose unit.

### Variation 2: arsenate poisoning

Arsenate looks enough like phosphate that GAPDH uses it instead, making an unstable arsenate compound that falls apart in water before phosphoglycerate kinase can use it. Each three-carbon piece then skips the ATP-making step 7, so the ledger reads -2 + 0 + 2 = **net 0 ATP**, even though NADH is still made. The pathway keeps running and the cell starves for ATP.

### Variation 3: what happens to the NADH

GAPDH needs NAD<sup>+</sup>. If oxygen is present, NADH electrons are passed into the mitochondria and on to the electron transport chain. If it is absent, or in red blood cells with no mitochondria, **lactate dehydrogenase** reduces pyruvate to lactate and regenerates NAD<sup>+</sup>. That fermentation step makes no ATP itself; it just keeps glycolysis running at its net 2 ATP.

## Common traps

- **"Glycolysis makes 4 ATP."** It makes 4 but spends 2. The net is 2.
- **"Glycolysis needs oxygen."** It does not. It needs NAD<sup>+</sup>, which fermentation can regenerate.
- **The rate-limiting, committed step is PFK-1,** not hexokinase. Glucose 6-phosphate can still go to glycogen or the pentose phosphate pathway, so phosphorylating glucose does not commit it to glycolysis.
- **ATP is both a substrate and an inhibitor of PFK-1.** High ATP binds a separate regulatory site and slows the enzyme.
- **Citrate signals plenty,** so it inhibits PFK-1. AMP signals scarcity, so it activates it.
- **Location:** glycolysis is cytosolic. Pyruvate oxidation and the citric acid cycle happen in the mitochondria.
- **Glucose transporters are not part of glycolysis.** GLUT proteins move glucose in by facilitated diffusion, covered in the [membrane transport note](passive-vs-active-transport.html).

## One-minute recap

Ten cytosolic steps convert glucose to 2 pyruvate. Investment phase: hexokinase and PFK-1 each spend 1 ATP, and aldolase plus triose phosphate isomerase give 2 G3P. Payoff phase, twice per glucose: GAPDH makes NADH, phosphoglycerate kinase and pyruvate kinase each make ATP. Net 2 ATP, 2 NADH, 2 pyruvate. Control sits at the three one-way steps, with PFK-1 as the committed, rate-limiting step (on with AMP and fructose 2,6-bisphosphate, off with ATP and citrate). Without oxygen, lactate dehydrogenase regenerates NAD<sup>+</sup>.

:::quiz
Q: Which two glycolytic enzymes use ATP, and which two make ATP?
A: Hexokinase (or glucokinase) and PFK-1 use ATP. Phosphoglycerate kinase and pyruvate kinase make ATP, by substrate-level phosphorylation.
Q: What is the net ATP yield of glycolysis for a glucose unit released from glycogen as glucose 1-phosphate?
A: 3 ATP. The unit enters as glucose 6-phosphate without spending ATP at hexokinase, so only PFK-1 costs 1 ATP against the 4 made.
Q: Which step of glycolysis produces NADH, and why does glycolysis stop if NAD+ runs out?
A: Glyceraldehyde 3-phosphate dehydrogenase (GAPDH) produces NADH. It needs NAD+ as the electron acceptor, so without NAD+ that step and everything after it halts.
Q: A liver cell has high citrate and high ATP. What happens to PFK-1 activity?
A: It falls. Both ATP and citrate inhibit PFK-1, signaling that the cell already has enough energy and fuel.
Q: Why does arsenate cut the net ATP yield of glycolysis to zero?
A: GAPDH incorporates arsenate instead of phosphate, and the product breaks down in water before phosphoglycerate kinase can make ATP from it, so the 2 ATP from step 7 are lost.
:::

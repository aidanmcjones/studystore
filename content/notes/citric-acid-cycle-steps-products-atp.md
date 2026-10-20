---
title: Citric Acid (Krebs) Cycle Steps, Enzymes, and Products
description: Walk the eight citric acid cycle steps, the products of each turn, the three regulated enzymes, and how to count ATP from acetyl-CoA to glucose.
product: 1d-metabolism-bioenergetics
published: 2026-10-20
related: glycolysis-steps-enzymes-net-atp, gibbs-free-energy-delta-g-spontaneity, enzyme-classes-ec-1-to-7
---

The citric acid cycle (also called the Krebs cycle or TCA cycle) runs in the mitochondrial matrix and oxidizes the equivalent of the two-carbon acetyl group of acetyl-CoA to two CO<sub>2</sub>. **Each turn makes 3 NADH, 1 FADH<sub>2</sub>, 1 GTP (or ATP) and 2 CO<sub>2</sub>**, and regenerates the oxaloacetate it started with. One glucose gives two pyruvate and therefore two acetyl-CoA, so the cycle turns twice per glucose. The cycle itself makes very little ATP directly; its real job is loading electron carriers for the electron transport chain.

## Before the cycle: pyruvate dehydrogenase

Pyruvate from glycolysis is carried into the matrix and converted by the **pyruvate dehydrogenase complex (PDH)**:

pyruvate + CoA + NAD<sup>+</sup> &rarr; acetyl-CoA + CO<sub>2</sub> + NADH

This step is not part of the cycle, but it is where the first CO<sub>2</sub> per pyruvate is lost, and it is effectively irreversible. Humans cannot turn acetyl-CoA back into pyruvate, which is why even-chain fatty acids (broken down to acetyl-CoA) cannot supply carbon for net glucose synthesis.

PDH needs five cofactors: thiamine pyrophosphate (from vitamin B1), lipoic acid, coenzyme A (from B5), FAD (from B2) and NAD<sup>+</sup> (from B3). The alpha-ketoglutarate dehydrogenase complex inside the cycle uses the same set, so thiamine deficiency hits both enzymes.

## The eight steps

Track carbon counts as you go. The cycle starts by adding 2 carbons to a 4-carbon acceptor, then loses 2 carbons as CO<sub>2</sub>, then spends four steps rearranging a 4-carbon molecule back into the acceptor.

| Step | Enzyme | Reaction | Made here |
|---|---|---|---|
| 1 | Citrate synthase | Acetyl-CoA (2C) + oxaloacetate (4C) &rarr; citrate (6C) | Releases CoA |
| 2 | Aconitase | Citrate &rarr; isocitrate (6C), via cis-aconitate | Nothing; an isomerization |
| 3 | Isocitrate dehydrogenase | Isocitrate &rarr; alpha-ketoglutarate (5C) | NADH, CO<sub>2</sub> |
| 4 | Alpha-ketoglutarate dehydrogenase complex | Alpha-ketoglutarate &rarr; succinyl-CoA (4C) | NADH, CO<sub>2</sub> |
| 5 | Succinyl-CoA synthetase | Succinyl-CoA &rarr; succinate (4C) | GTP or ATP |
| 6 | Succinate dehydrogenase | Succinate &rarr; fumarate (4C) | FADH<sub>2</sub> |
| 7 | Fumarase | Fumarate + H<sub>2</sub>O &rarr; malate (4C) | Nothing; a hydration |
| 8 | Malate dehydrogenase | Malate &rarr; oxaloacetate (4C) | NADH |

A memory sentence for the order of intermediates, starting from citrate: **"Curious Iguanas Keep Swiping Seven Fat Mint Olives"** (citrate, isocitrate, alpha-Ketoglutarate, Succinyl-CoA, Succinate, Fumarate, Malate, Oxaloacetate). The carbon counts run 6, 6, 5, 4, 4, 4, 4, 4.

![The citric acid cycle drawn as a ring of eight intermediates with carbon counts, showing where NADH, FADH2, GTP and CO2 leave each turn](assets/notes/citric-acid-cycle-steps-products-atp.png "Two carbons enter as acetyl-CoA at citrate synthase. Two CO2 leave at isocitrate dehydrogenase and alpha-ketoglutarate dehydrogenase. Three NADH, one FADH2 and one GTP come off per turn.")

### Three details worth knowing for each step

- **Step 1 (citrate synthase)** is strongly exergonic, is the cycle's first committed step, and is one of its three regulated steps.
- **Steps 3 and 4** are both oxidative decarboxylations: each removes one carbon as CO<sub>2</sub> and passes electrons to NAD<sup>+</sup>. They are the only two CO<sub>2</sub>-releasing steps inside the cycle.
- **Step 5** is the only substrate-level phosphorylation in the cycle. The energy of the thioester bond in succinyl-CoA drives formation of GTP or ATP (mammals have isoforms that use each). GTP and ATP are energetically equivalent, since a nucleoside diphosphate kinase can swap the phosphate between them.
- **Step 6** is unique. Succinate dehydrogenase is embedded in the inner mitochondrial membrane, uses covalently bound FAD, and doubles as **Complex II** of the electron transport chain. Its electrons go to ubiquinone without passing through Complex I.
- **Step 8** has a positive standard free energy change. It runs forward in the cell because oxaloacetate is kept at a very low concentration and is immediately consumed by citrate synthase. This is a good example of a reaction pulled forward by the next step.

## Regulation: three control points

The cycle speeds up when the cell needs energy and slows when energy is plentiful. The three regulated enzymes are the ones with large negative free energy changes:

| Enzyme | Inhibited by | Activated by |
|---|---|---|
| Citrate synthase | ATP, NADH, succinyl-CoA, citrate | ADP |
| Isocitrate dehydrogenase (main rate-limiting step) | ATP, NADH | ADP, Ca<sup>2+</sup> |
| Alpha-ketoglutarate dehydrogenase | Succinyl-CoA, NADH | Ca<sup>2+</sup> |

The theme is simple: **high ATP and NADH say "stop," high ADP and Ca<sup>2+</sup> say "go."** Calcium matters in muscle, where the same Ca<sup>2+</sup> signal that triggers contraction also speeds up the enzymes that will refuel it. Outside the cycle, PDH is shut off by its products (acetyl-CoA and NADH) and by phosphorylation.

## Worked example: counting ATP

Modern estimates use about **2.5 ATP per NADH** and **1.5 ATP per FADH<sub>2</sub>** oxidized by the electron transport chain. Older textbooks use 3 and 2, which gives larger totals. Use whichever convention a question states; the counting method is the same.

**Per acetyl-CoA (one turn):**

- 3 NADH &times; 2.5 = 7.5
- 1 FADH<sub>2</sub> &times; 1.5 = 1.5
- 1 GTP = 1
- Total: **10 ATP per acetyl-CoA**

**Per pyruvate:** add the NADH from PDH: 10 + 2.5 = **12.5 ATP**.

**Per glucose, step by step:**

1. Glycolysis: 2 ATP directly, plus 2 cytosolic NADH.
2. PDH, twice: 2 NADH.
3. Citric acid cycle, twice: 6 NADH, 2 FADH<sub>2</sub>, 2 GTP.
4. Mitochondrial NADH: 8 &times; 2.5 = 20 ATP.
5. FADH<sub>2</sub>: 2 &times; 1.5 = 3 ATP.
6. Direct: 2 (glycolysis) + 2 (GTP) = 4 ATP.
7. Cytosolic NADH: cannot cross the inner membrane directly. If its electrons enter through the malate-aspartate shuttle they are worth about 2.5 each (5 total). If they enter through the glycerol 3-phosphate shuttle, the electrons are handed to an FAD-linked enzyme on the inner membrane, enter at ubiquinone like those of FADH<sub>2</sub>, and are worth about 1.5 each (3 total).

Total: 20 + 3 + 4 + 5 = **32 ATP** with the malate-aspartate shuttle, or 20 + 3 + 4 + 3 = **30 ATP** with the glycerol 3-phosphate shuttle. The same bookkeeping with the older 3 and 2 values gives 38 and 36. Notice that the cycle's direct contribution is only 2 ATP out of roughly 30; almost everything comes from the carriers.

### A carbon-tracking twist

If you label the two acetyl carbons and follow them through one turn, the two CO<sub>2</sub> released in that turn do **not** come from the acetyl group that just entered. They come from carbons that were already part of oxaloacetate. The labeled carbons stay in the cycle and are lost in later turns. Questions occasionally test this to see if you understand the cycle as a loop rather than a straight line.

## The cycle is amphibolic

The cycle is not only catabolic. Several intermediates leave to build other molecules:

- Citrate is exported to the cytosol as a carrier of acetyl groups for fatty acid synthesis.
- Alpha-ketoglutarate and oxaloacetate are transaminated to make glutamate and aspartate.
- Succinyl-CoA is a starting material for heme synthesis.
- Oxaloacetate (via malate) feeds gluconeogenesis.

Every time an intermediate is drawn off, the cycle loses capacity, so cells refill it with **anaplerotic** reactions. The main one is **pyruvate carboxylase**, which turns pyruvate into oxaloacetate and is activated by acetyl-CoA. That makes sense: a buildup of acetyl-CoA signals that there is not enough oxaloacetate to accept it.

## Common traps

- **The cycle does not use O<sub>2</sub> directly, but it stops without it.** With no oxygen, the electron transport chain cannot reoxidize NADH and FADH<sub>2</sub>, NAD<sup>+</sup> and FAD run out, and the dehydrogenases halt.
- **Count per glucose, not per turn, when asked about glucose.** Double the per-turn numbers: 6 NADH, 2 FADH<sub>2</sub>, 2 GTP, 4 CO<sub>2</sub>. Add 2 NADH and 2 CO<sub>2</sub> from PDH if the question includes pyruvate oxidation.
- **FADH<sub>2</sub> comes from succinate dehydrogenase only.** Every other oxidation in the cycle uses NAD<sup>+</sup>. (PDH and alpha-ketoglutarate dehydrogenase use FAD internally but pass the electrons on to NAD<sup>+</sup>, so their net product is NADH.)
- **PDH is not a cycle enzyme.** It links glycolysis to the cycle. Its CO<sub>2</sub> and NADH are counted separately.
- **Location:** the cycle runs in the matrix, with succinate dehydrogenase bound to the inner membrane. Glycolysis is cytosolic.
- **"Rate-limiting" usually means isocitrate dehydrogenase.** Citrate synthase and alpha-ketoglutarate dehydrogenase are also regulated, but isocitrate dehydrogenase is the classic answer.

## One-minute recap

Pyruvate dehydrogenase converts pyruvate to acetyl-CoA, CO<sub>2</sub> and NADH in the matrix. Acetyl-CoA joins oxaloacetate to form citrate, which is isomerized to isocitrate, then oxidatively decarboxylated twice (to alpha-ketoglutarate and then succinyl-CoA), each time releasing CO<sub>2</sub> and NADH. Succinyl-CoA gives GTP by substrate-level phosphorylation, succinate gives FADH<sub>2</sub> through Complex II, fumarate is hydrated to malate, and malate is oxidized to oxaloacetate with one more NADH. Per turn: 3 NADH, 1 FADH<sub>2</sub>, 1 GTP, 2 CO<sub>2</sub>, worth about 10 ATP. Per glucose, the whole pathway yields roughly 30 to 32 ATP. ATP and NADH inhibit; ADP and Ca<sup>2+</sup> activate.

:::quiz
Q: How many NADH, FADH2, GTP and CO2 are produced per turn of the citric acid cycle?
A: Three NADH, one FADH2, one GTP (or ATP) and two CO2. The two CO2 come from isocitrate dehydrogenase and alpha-ketoglutarate dehydrogenase.
Q: Which citric acid cycle enzyme is also part of the electron transport chain?
A: Succinate dehydrogenase, which is Complex II. It sits in the inner mitochondrial membrane and passes electrons from succinate through FADH2 to ubiquinone.
Q: Using 2.5 ATP per NADH and 1.5 per FADH2, how many ATP does one pyruvate yield after full oxidation?
A: About 12.5 ATP: 2.5 from the PDH NADH plus 10 from one turn of the cycle (7.5 from 3 NADH, 1.5 from FADH2, 1 from GTP).
Q: Which step of the citric acid cycle is a substrate-level phosphorylation?
A: Succinyl-CoA synthetase, which uses the energy of the thioester bond in succinyl-CoA to make GTP or ATP as succinyl-CoA becomes succinate.
Q: The citric acid cycle uses no O2 as a reactant. Why does it stop when a cell runs out of oxygen?
A: Without O2 the electron transport chain cannot reoxidize NADH and FADH2, so NAD+ and FAD run out and the cycle's dehydrogenases cannot continue.
:::

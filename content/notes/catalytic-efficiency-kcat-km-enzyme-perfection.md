---
title: kcat, Km and Catalytic Efficiency (kcat/Km): Comparing Enzymes
description: What turnover number kcat and catalytic efficiency kcat/Km tell you, how to get kcat from Vmax and enzyme concentration, and how to compare two enzymes.
product: 1a-amino-acids-proteins
published: 2026-11-09
related: michaelis-menten-and-lineweaver-burk, enzyme-inhibition-types-compared, uncompetitive-inhibition-lineweaver-burk-parallel-lines
seo_title: kcat, Km and Catalytic Efficiency | MCAT
seo_description: kcat is turnover number, kcat/Km is catalytic efficiency. How to calculate both from Vmax, compare enzymes, and avoid MCAT traps, with a quiz.
---

**k<sub>cat</sub>** (turnover number) is how many substrate molecules one enzyme active site converts to product per second when saturated: **k<sub>cat</sub> = V<sub>max</sub> / [E]<sub>total</sub>**. **Catalytic efficiency** is **k<sub>cat</sub>/K<sub>m</sub>**, which combines speed (k<sub>cat</sub>) with how well the enzyme grabs substrate (low K<sub>m</sub> means high apparent affinity). Bigger is better for both.

## Reading the pieces

| Term | Meaning | Where it comes from |
|---|---|---|
| V<sub>max</sub> | Maximum rate at saturating substrate | Plateau of the curve; 1/y-intercept on Lineweaver-Burk |
| K<sub>m</sub> | [S] at half V<sub>max</sub> | Lower K<sub>m</sub> means tighter apparent binding |
| k<sub>cat</sub> | Turnover per active site per second | V<sub>max</sub> divided by enzyme concentration |
| k<sub>cat</sub>/K<sub>m</sub> | Catalytic efficiency | Rate at low [S] per unit enzyme |

At low substrate, v &asymp; (k<sub>cat</sub>/K<sub>m</sub>)[E][S]. That is why k<sub>cat</sub>/K<sub>m</sub> is the number to compare when substrate is scarce, as it often is in cells. The theoretical ceiling is diffusion, roughly 10<sup>8</sup> to 10<sup>9</sup> M<sup>-1</sup>s<sup>-1</sup>, and enzymes near that limit (such as carbonic anhydrase) are called catalytically perfect.

*Want this topic as spaced-repetition cards? The [matching StudyStore MCAT pack](../products/1a-amino-acids-proteins.html?utm_source=site-cta) has original Anki cards, a study guide and practice questions for it.*

## Worked example 1: finding k<sub>cat</sub>

An assay with 2.0 nM enzyme reaches V<sub>max</sub> = 6.0 &mu;M/s.

k<sub>cat</sub> = (6.0 &times; 10<sup>-6</sup> M/s) / (2.0 &times; 10<sup>-9</sup> M) = **3,000 s<sup>-1</sup>**.

## Worked example 2: comparing two enzymes

| Enzyme | k<sub>cat</sub> (s<sup>-1</sup>) | K<sub>m</sub> (mM) | k<sub>cat</sub>/K<sub>m</sub> (M<sup>-1</sup>s<sup>-1</sup>) |
|---|---|---|---|
| A | 100 | 0.5 | 2 &times; 10<sup>5</sup> |
| B | 400 | 8 | 5 &times; 10<sup>4</sup> |

B turns over four times faster when saturated, but A is four times more efficient at low substrate because its K<sub>m</sub> is 16 times lower. At [S] well above both K<sub>m</sub> values, B wins. At low [S], A wins.

## Effect of inhibitors

- **Competitive:** K<sub>m</sub> rises, V<sub>max</sub> and k<sub>cat</sub> unchanged, so apparent efficiency falls.
- **Noncompetitive:** V<sub>max</sub> falls, K<sub>m</sub> unchanged.
- **Uncompetitive:** both V<sub>max</sub> and K<sub>m</sub> fall.

## Common traps

- **Equating low K<sub>m</sub> with fast.** K<sub>m</sub> is about affinity, not speed.
- **Forgetting units.** k<sub>cat</sub> is s<sup>-1</sup>, k<sub>cat</sub>/K<sub>m</sub> is M<sup>-1</sup>s<sup>-1</sup>.
- **Using total enzyme mass.** k<sub>cat</sub> needs the concentration of active sites.
- **Treating K<sub>m</sub> as a true K<sub>d</sub>.** They match only when product release is slow relative to binding.

## One-minute recap

k<sub>cat</sub> = V<sub>max</sub>/[E]<sub>total</sub> is turnover per active site. k<sub>cat</sub>/K<sub>m</sub> is catalytic efficiency, the best single number for comparing enzymes at low substrate, and diffusion caps it near 10<sup>8</sup> to 10<sup>9</sup> M<sup>-1</sup>s<sup>-1</sup>.

:::quiz
Q: How do you calculate kcat?
A: Divide Vmax by the total concentration of enzyme active sites.
Q: An enzyme at 5 nM gives Vmax = 10 uM/s. What is kcat?
A: (10 x 10^-6) / (5 x 10^-9) = 2,000 per second.
Q: Which quantity best compares two enzymes at low substrate concentration?
A: Catalytic efficiency, kcat/Km.
Q: What are the units of kcat/Km?
A: M^-1 s^-1.
Q: A competitive inhibitor changes which parameters?
A: It raises apparent Km and leaves Vmax (and kcat) unchanged.
:::

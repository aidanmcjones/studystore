---
title: Uncompetitive Inhibition: Why Km and Vmax Both Fall
description: Uncompetitive inhibition binds only the enzyme-substrate complex, lowering Vmax and Km together and giving parallel Lineweaver-Burk lines, with a worked example.
product: 1a-amino-acids-proteins
published: 2026-11-04
related: enzyme-inhibition-types-compared, pure-vs-mixed-noncompetitive-inhibition, michaelis-menten-and-lineweaver-burk
seo_title: Uncompetitive Inhibition: Km, Vmax and Parallel Lines
seo_description: Uncompetitive inhibition for the MCAT: it binds only the ES complex, so Vmax and Km both decrease and Lineweaver-Burk lines are parallel. Worked example and quiz.
---

An **uncompetitive inhibitor** binds only the enzyme-substrate (ES) complex, never the free enzyme. It locks substrate into a complex that cannot make product, so **Vmax decreases**. It also pulls the E + S equilibrium toward ES, so the enzyme looks like it binds substrate more tightly and **apparent Km decreases**. On a Lineweaver-Burk plot the lines are **parallel**.

## Effect on the constants

Both constants shrink by the same factor, alpha' = 1 + [I]/Ki'.

- Vmax(app) = Vmax / alpha'
- Km(app) = Km / alpha'
- Vmax/Km is unchanged, so the slope of the double-reciprocal line is unchanged. That is why the lines are parallel.

## Why more substrate makes it worse

Inhibitor needs ES to bind. More substrate means more ES, so more inhibitor binds. This is the opposite of competitive inhibition, where more substrate overcomes the block.

## Side by side

| Type | Binds | Vmax | Km | Lineweaver-Burk |
|---|---|---|---|---|
| Competitive | E | Same | Up | Same y-intercept |
| Uncompetitive | ES | Down | Down | Parallel lines |
| Pure noncompetitive | E and ES equally | Down | Same | Same x-intercept |

## Worked example

Without inhibitor: Vmax = 100 umol/min, Km = 20 uM. With an inhibitor that gives alpha' = 2:

- Vmax(app) = 100 / 2 = **50 umol/min**
- Km(app) = 20 / 2 = **10 uM**
- 1/Vmax goes from 0.010 to 0.020 (y-intercept doubles). -1/Km goes from -0.05 to -0.10 (x-intercept doubles in magnitude).
- Slope Km/Vmax = 0.20 before and after.

## Common traps

- **Saying Km increases.** That is competitive. Uncompetitive lowers Km.
- **Expecting the lines to cross.** Same slope means parallel.
- **Thinking substrate rescues the enzyme.** It does the reverse.

## One-minute recap

- Binds ES only.
- Vmax down, Km down, slope unchanged.
- Parallel Lineweaver-Burk lines.

:::quiz
Q: What does an uncompetitive inhibitor bind?
A: Only the enzyme-substrate complex.
Q: What happens to Vmax and Km?
A: Both decrease by the same factor.
Q: What does the Lineweaver-Burk plot look like?
A: Parallel lines, because the slope Km/Vmax is unchanged.
Q: Does adding more substrate overcome uncompetitive inhibition?
A: No. More substrate forms more ES, which gives the inhibitor more to bind.
Q: Vmax = 80 and Km = 12 with alpha' = 4. What are the apparent values?
A: Vmax(app) = 20 and Km(app) = 3.
:::

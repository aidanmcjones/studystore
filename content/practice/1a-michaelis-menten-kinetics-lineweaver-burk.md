---
title: MCAT Michaelis-Menten Kinetics and Lineweaver-Burk Practice Questions
description: Eight free MCAT-style practice questions on Km, Vmax, kcat, catalytic efficiency and Lineweaver-Burk plots, with worked calculations and full explanations.
aamc: 1A
category: 1a-amino-acids-proteins
cluster: Michaelis-Menten kinetics, Km, Vmax, kcat, catalytic efficiency, Lineweaver-Burk plots
product: 1a-amino-acids-proteins
published: 2026-10-20
notes: michaelis-menten-and-lineweaver-burk, enzyme-inhibition-types-compared
---

The Michaelis-Menten equation, v = Vmax[S] / (Km + [S]), describes a hyperbola. Vmax is the plateau reached when every enzyme is occupied, so it scales with the amount of enzyme: Vmax = kcat[E]total. Km is the substrate concentration at which v is half of Vmax, and for many simple enzymes a lower Km means tighter substrate binding. The ratio kcat/Km is the best single measure of how well an enzyme turns over substrate at low concentration, and its upper limit is set by diffusion.

A Lineweaver-Burk plot graphs 1/v against 1/[S] to give a straight line: slope Km/Vmax, y-intercept 1/Vmax and x-intercept -1/Km. Read intercepts first and slope second.

Traps: confusing kcat with Vmax (one is per enzyme, the other is for the whole sample), reading an x-intercept as Km instead of -1/Km, and forgetting that Km does not change when you add more enzyme.

@@QUESTIONS

### Q1
An enzyme has Vmax = 100 micromol/min and Km = 2 mM. What is the initial velocity at [S] = 6 mM?
A) 67 micromol/min
B) 50 micromol/min
C) 75 micromol/min
D) 33 micromol/min
ANSWER: C
WHY: Substitute into v = Vmax[S] / (Km + [S]): v = 100 x 6 / (2 + 6) = 600 / 8 = 75 micromol/min. A quick check: [S] is three times Km, so the enzyme is three-quarters saturated, and 0.75 x 100 = 75. Choice B is the velocity at [S] = Km.

### Q2
Enzyme X has a Km of 10 micromolar for substrate P, and Enzyme Y has a Km of 400 micromolar for substrate Q. Assuming both follow simple Michaelis-Menten behavior with similar kcat values, which conclusion is most reasonable?
A) X is a competitive inhibitor of Y
B) X is saturated at a lower substrate concentration than Y
C) Y binds its substrate more tightly than X
D) X has the higher Vmax
ANSWER: B
WHY: Km is the substrate concentration at half-maximal velocity, so a smaller Km means half-saturation occurs at lower [S], which commonly reflects higher affinity. X reaches saturation sooner. Km says nothing about Vmax, which depends on kcat and enzyme amount, and the two enzymes act on different substrates so inhibition is not part of the question.

### Q3
A student measures initial velocity at several substrate concentrations and builds a double-reciprocal table.

| 1/[S] (1/mM) | 1/v (min per micromol) |
|---|---|
| 0 | 0.020 |
| 1 | 0.030 |
| 2 | 0.040 |
| 4 | 0.060 |

What are Vmax and Km?
A) Vmax = 50 micromol/min, Km = 0.5 mM
B) Vmax = 50 micromol/min, Km = 2 mM
C) Vmax = 100 micromol/min, Km = 1 mM
D) Vmax = 0.02 micromol/min, Km = 0.5 mM
ANSWER: A
WHY: The y-intercept (1/[S] = 0) is 1/Vmax = 0.020, so Vmax = 50 micromol/min. The slope is (0.060 - 0.020) / 4 = 0.010, and slope = Km/Vmax, so Km = 0.010 x 50 = 0.5 mM. As a check, the x-intercept occurs where 1/v = 0, at 1/[S] = -2 mM^-1, and -1/Km = -2 gives Km = 0.5 mM. Choice B misreads the x-intercept as +2 and inverts incorrectly.

### Q4
A reaction contains 2.0 nM enzyme (2.0 x 10^-9 M) and reaches a maximal velocity of 4.0 x 10^-6 M/s at saturating substrate. What is kcat?
A) 0.5 x 10^-3 s^-1
B) 2.0 x 10^3 s^-1
C) 8.0 x 10^3 s^-1
D) 2.0 x 10^-3 s^-1
ANSWER: B
WHY: Vmax = kcat[E]total, so kcat = Vmax / [E]total = (4.0 x 10^-6 M/s) / (2.0 x 10^-9 M) = 2.0 x 10^3 s^-1. Each enzyme molecule converts about 2000 substrate molecules per second at saturation. Choice D flips the sign of the exponent.

### Q5
Enzyme A has kcat = 100 s^-1 and Km = 1 mM. Enzyme B has kcat = 10 s^-1 and Km = 10 micromolar. Which statement is correct?
A) The two have identical efficiency because kcat and Km both differ by a factor of ten
B) Efficiency cannot be compared without Vmax
C) B is more catalytically efficient, because its kcat/Km is ten times that of A
D) A is more catalytically efficient because its kcat is larger
ANSWER: C
WHY: Compare kcat/Km in consistent units. A: 100 s^-1 / 10^-3 M = 1 x 10^5 M^-1 s^-1. B: 10 s^-1 / 10^-5 M = 1 x 10^6 M^-1 s^-1. B is tenfold more efficient at low substrate concentration despite turning over more slowly at saturation. The numbers differ by a factor of ten in opposite directions for the two parameters, so they do not cancel.

### Q6
A researcher doubles the concentration of an enzyme in a reaction mixture while keeping everything else the same. What happens to Vmax and Km?
A) Vmax doubles; Km is unchanged
B) Both double
C) Vmax is unchanged; Km doubles
D) Both are unchanged
ANSWER: A
WHY: Vmax = kcat[E]total, so it is proportional to enzyme concentration. Km is a ratio of rate constants, (k-1 + kcat)/k1, which does not depend on how much enzyme is present. This is why Km, kcat and kcat/Km are called intrinsic properties while Vmax is not.

### Q7
For an enzyme with Km = 5 mM, how does the initial velocity change when [S] is raised from 50 mM to 100 mM?
A) It does not change at all
B) It decreases because of substrate depletion
C) It roughly doubles
D) It increases by about 5 percent
ANSWER: D
WHY: At 50 mM, v/Vmax = 50/55 = 0.909. At 100 mM, v/Vmax = 100/105 = 0.952. That is an increase of about 5 percent. Far above Km the curve is almost flat, so the reaction behaves close to zero order in substrate. The velocity is not exactly unchanged, because the hyperbola only approaches Vmax asymptotically.

### Q8
Which of the following is NOT a feature of the standard Michaelis-Menten model?
A) The concentration of ES is approximately constant during the measured interval (steady state)
B) The enzyme is consumed in the reaction
C) The enzyme-substrate complex is formed and then yields product plus free enzyme
D) Initial velocities are measured early, when the reverse reaction from product is negligible
ANSWER: B
WHY: A catalyst is regenerated at the end of each cycle, so enzyme is not consumed; the model depends on this recycling. The model assumes steady-state ES, uses initial velocity measurements so that product has not accumulated enough to drive the reverse reaction, and typically requires substrate in large excess over enzyme.

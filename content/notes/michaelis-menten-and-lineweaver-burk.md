---
title: Michaelis-Menten Kinetics and Lineweaver-Burk Plots Explained
description: What Km, Vmax, and kcat mean, how to read a Michaelis-Menten curve, and how to pull the numbers out of a Lineweaver-Burk plot, with a worked example.
seo_title: Michaelis-Menten and Lineweaver-Burk Plots | MCAT
seo_description: Free MCAT notes on Michaelis-Menten kinetics: Km, Vmax and kcat, reading the curve and Lineweaver-Burk plot, with a worked example and quiz.
product: 1a-amino-acids-proteins
published: 2026-10-20
related: enzyme-inhibition-types-compared, enzyme-classes-ec-1-to-7, henderson-hasselbalch-for-the-mcat
---

Enzyme kinetics questions on the MCAT look intimidating because they come wrapped in graphs, but nearly all of them reduce to two equations and one idea. This note builds that idea from scratch, then shows how the same data looks on a Michaelis-Menten plot and on a Lineweaver-Burk plot.

## The idea: enzymes saturate

Imagine a fixed amount of enzyme and a growing amount of substrate. At low substrate concentration, most enzyme molecules are empty, so every extra bit of substrate finds a free enzyme and the reaction speeds up almost in proportion. At high substrate concentration, nearly every enzyme is busy. Adding more substrate cannot speed things up, because the enzymes are working as fast as they can. The rate levels off. That plateau is the **maximum velocity, V<sub>max</sub>**.

The simplest model of this behavior treats catalysis as two steps: the enzyme (E) and substrate (S) bind reversibly to form the enzyme-substrate complex (ES), and ES converts to product (P) and releases free enzyme.

E + S &#8652; ES &rarr; E + P

The first step is fast and reversible. The second step, with rate constant k<sub>cat</sub>, is the chemical step. The model assumes you measure the **initial velocity**, early in the reaction, before product builds up and before much substrate is used up, so the reverse reaction from product can be ignored.

## The Michaelis-Menten equation

Under the steady-state assumption (the concentration of ES stays roughly constant during the measurement) and with substrate in large excess over enzyme, the initial velocity is:

v = V<sub>max</sub> [S] / (K<sub>m</sub> + [S])

Two constants define the curve.

- **V<sub>max</sub>** is the velocity when all of the enzyme is saturated. It equals k<sub>cat</sub> times the total enzyme concentration: V<sub>max</sub> = k<sub>cat</sub>[E]<sub>total</sub>. Doubling the enzyme doubles V<sub>max</sub>.
- **K<sub>m</sub>**, the Michaelis constant, is the substrate concentration at which the velocity is exactly half of V<sub>max</sub>. It has units of concentration and does not change when you add more enzyme.

![Michaelis-Menten curve and matching Lineweaver-Burk line with labeled intercepts](assets/notes/michaelis-menten-and-lineweaver-burk.png "Left: velocity against substrate concentration. Right: the same data as reciprocals. The y-intercept is 1/Vmax, the x-intercept is -1/Km, and the slope is Km/Vmax.")

### Check the half-Vmax claim yourself

Put [S] = K<sub>m</sub> into the equation. You get v = V<sub>max</sub> K<sub>m</sub> / (K<sub>m</sub> + K<sub>m</sub>) = V<sub>max</sub> / 2. That is the definition of K<sub>m</sub> in action, and it is how you read K<sub>m</sub> off the left-hand graph: find half of the plateau on the y-axis and drop down to the x-axis.

The curve approaches V<sub>max</sub> only gradually. At [S] = 9 K<sub>m</sub> the velocity is 90 percent of V<sub>max</sub>, and at [S] = 99 K<sub>m</sub> it is 99 percent. You never actually reach V<sub>max</sub> on the graph, which is why you cannot just read it off the highest data point.

### Two limiting regimes

- **[S] much smaller than K<sub>m</sub>:** the denominator is about K<sub>m</sub>, so v is about (V<sub>max</sub>/K<sub>m</sub>)[S]. The rate is proportional to substrate (first order in S).
- **[S] much larger than K<sub>m</sub>:** the denominator is about [S], so v is about V<sub>max</sub>. The rate does not depend on substrate (zero order in S).

## What K<sub>m</sub> does and does not tell you

A low K<sub>m</sub> means the enzyme reaches half of its top speed at a low substrate concentration. In the common case where the chemical step is slow compared with substrate unbinding, a low K<sub>m</sub> goes along with tight substrate binding, so students are taught to read **low K<sub>m</sub> as high affinity** and **high K<sub>m</sub> as low affinity**. That is a good working rule for the exam.

It is a rule of thumb rather than a law. In the full model, K<sub>m</sub> = (k<sub>-1</sub> + k<sub>cat</sub>) / k<sub>1</sub>, where k<sub>1</sub> and k<sub>-1</sub> are the binding and unbinding rates. K<sub>m</sub> equals the true dissociation constant of ES only when k<sub>cat</sub> is much smaller than k<sub>-1</sub>. If a passage emphasizes a very fast catalytic step, be cautious about equating K<sub>m</sub> with affinity.

## k<sub>cat</sub> and catalytic efficiency

**k<sub>cat</sub>**, the turnover number, is the number of substrate molecules one enzyme active site converts to product per second when saturated. Calculate it as V<sub>max</sub> divided by the total enzyme concentration. For example, if V<sub>max</sub> is 5 &micro;M per second and the enzyme concentration is 0.01 &micro;M, then k<sub>cat</sub> is 500 per second.

To compare enzymes or substrates, use **k<sub>cat</sub>/K<sub>m</sub>**, the catalytic efficiency. It combines speed (k<sub>cat</sub>) and how well the enzyme grabs substrate at low concentrations (K<sub>m</sub>). A higher ratio means a better enzyme for that substrate. Its upper limit is set by how often enzyme and substrate collide in solution, roughly 10<sup>8</sup> to 10<sup>9</sup> M<sup>-1</sup> s<sup>-1</sup>. An enzyme near that ceiling is called catalytically perfect.

## Linearizing the curve: Lineweaver-Burk

A hyperbola is hard to analyze by eye, because you can never read V<sub>max</sub> from the plateau with confidence. Taking the reciprocal of both sides of the Michaelis-Menten equation turns the curve into a straight line:

1/v = (K<sub>m</sub> / V<sub>max</sub>) (1/[S]) + 1/V<sub>max</sub>

This has the form y = mx + b, with 1/v on the y-axis and 1/[S] on the x-axis. So:

- **y-intercept** = 1/V<sub>max</sub> (the point where 1/[S] is zero, which is infinite substrate)
- **slope** = K<sub>m</sub>/V<sub>max</sub>
- **x-intercept** = -1/K<sub>m</sub> (set 1/v to zero and solve)

A quick way to remember the x-intercept: it is negative, so it sits to the left of the y-axis, and a larger K<sub>m</sub> puts it closer to zero.

### Worked example

An enzyme has V<sub>max</sub> = 50 &micro;mol/min and K<sub>m</sub> = 2 mM.

1. Velocity at [S] = 6 mM: v = 50 &times; 6 / (2 + 6) = 37.5 &micro;mol/min.
2. Lineweaver-Burk y-intercept: 1/50 = 0.020 min/&micro;mol.
3. Slope: K<sub>m</sub>/V<sub>max</sub> = 2/50 = 0.040.
4. x-intercept: -1/K<sub>m</sub> = -0.5 mM<sup>-1</sup>.
5. Check at [S] = 6 mM, so 1/[S] = 0.1667: 1/v = 0.040 &times; 0.1667 + 0.020 = 0.0267, and 1/0.0267 = 37.5. The two methods agree.

## Reading changes on a Lineweaver-Burk plot

Questions often show two lines, one with and one without some treatment, and ask what changed. Use the intercepts.

- **Line crosses the y-axis higher** than the control: 1/V<sub>max</sub> is larger, so V<sub>max</sub> is lower.
- **Line crosses the x-axis closer to zero** than the control: -1/K<sub>m</sub> is smaller in magnitude, so K<sub>m</sub> is larger.
- **Steeper slope:** the ratio K<sub>m</sub>/V<sub>max</sub> is larger. Either K<sub>m</sub> rose, V<sub>max</sub> fell, or both.
- **Parallel lines:** the slope K<sub>m</sub>/V<sub>max</sub> is unchanged, so K<sub>m</sub> and V<sub>max</sub> changed by the same factor.

The next note, on the [four inhibition types](enzyme-inhibition-types-compared.html), applies exactly this skill.

## Why Lineweaver-Burk is for reading, not for fitting

The reciprocal transformation stretches small velocities into huge numbers. Measurements taken at low substrate concentrations, which are the least precise, end up dominating the line, while precise data at high [S] get squeezed together near the y-axis. That is why researchers fit the hyperbola directly with software today. For the MCAT, the double-reciprocal plot remains the standard way to show and compare kinetic parameters because the intercepts are so easy to read.

## Assumptions behind the equation

- You measure initial velocity, so product is negligible.
- Substrate is in large excess over enzyme, so binding does not noticeably deplete the free substrate.
- The ES complex is in a steady state.
- The enzyme follows simple hyperbolic behavior. **Allosteric, cooperative enzymes do not.** They produce a sigmoidal (S-shaped) velocity curve and need a different treatment, so a sigmoidal curve in a passage is a clue that the Michaelis-Menten equation does not apply.

## Common traps

- **Mixing up reciprocals.** A bigger K<sub>m</sub> on the Lineweaver-Burk plot means the x-intercept moves *toward* zero, not away from it.
- **Reading V<sub>max</sub> from the top of the data.** V<sub>max</sub> is the asymptote of the hyperbola, or the reciprocal of the y-intercept.
- **Thinking V<sub>max</sub> is a property of the substrate.** It depends on how much enzyme is present. K<sub>m</sub> and k<sub>cat</sub> are the properties of the enzyme-substrate pair.
- **Forgetting units.** K<sub>m</sub> is in concentration units, V<sub>max</sub> is in rate units, and k<sub>cat</sub> is in inverse time.

## One-minute recap

v = V<sub>max</sub>[S]/(K<sub>m</sub> + [S]). K<sub>m</sub> is the substrate concentration giving half of V<sub>max</sub>. Low K<sub>m</sub> usually means high affinity. V<sub>max</sub> = k<sub>cat</sub>[E]<sub>total</sub>. On a Lineweaver-Burk plot the y-intercept is 1/V<sub>max</sub>, the x-intercept is -1/K<sub>m</sub>, and the slope is K<sub>m</sub>/V<sub>max</sub>.

:::quiz
Q: An enzyme has Vmax = 80 units/min and Km = 4 mM. What is the velocity at [S] = 4 mM, and at [S] = 12 mM?
A: At [S] = Km the velocity is half of Vmax, so 40 units/min. At 12 mM: 80 x 12 / (4 + 12) = 60 units/min.
Q: On a Lineweaver-Burk plot, the x-intercept is -0.25 per mM. What is Km?
A: The x-intercept equals -1/Km, so Km = 1/0.25 = 4 mM.
Q: Doubling the enzyme concentration (with the same substrate) changes which kinetic constants?
A: Vmax doubles because Vmax = kcat[E]total. Km and kcat do not change, because they are properties of the enzyme-substrate pair rather than of how much enzyme is present.
Q: A Lineweaver-Burk line for a treated enzyme crosses the y-axis at a higher value than the control and crosses the x-axis at the same point. What happened to Vmax and Km?
A: Vmax decreased (a higher y-intercept means 1/Vmax is larger, so Vmax is smaller) and Km is unchanged (same x-intercept).
Q: Why is a sigmoidal velocity curve a warning sign for a Michaelis-Menten analysis?
A: Michaelis-Menten kinetics predict a hyperbola. A sigmoidal curve points to cooperativity between subunits (allosteric behavior), which the simple equation does not describe.
:::

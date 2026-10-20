---
title: How to Find a Rate Law from Initial Rates (Method of Initial Rates)
description: Find reaction orders, the rate law, and k from an initial rates table, with ratio and log shortcuts, k units by order, and worked MCAT-style examples.
product: 5e-thermo-kinetics
published: 2026-10-20
related: gibbs-free-energy-delta-g-spontaneity, radioactive-decay-half-life-calculations, michaelis-menten-and-lineweaver-burk
---

To find a rate law from initial rates, pick two experiments in which only one reactant concentration changes, divide the two rates, and ask what power of the concentration ratio gives that rate ratio. That power is the order in that reactant. Repeat for each reactant, write rate = k[A]<sup>m</sup>[B]<sup>n</sup>, then plug any single experiment back in to solve for k. The orders come from the data, never from the coefficients in the balanced equation.

## What a rate law says

A rate law links the rate of a reaction to the concentrations of its reactants at a fixed temperature:

**rate = k[A]<sup>m</sup>[B]<sup>n</sup>**

- **k** is the rate constant. It depends on temperature (and on a catalyst, if one is present) but not on concentration.
- **m** and **n** are the orders with respect to A and B. They are usually 0, 1, or 2 in problems, though fractional and negative orders exist for multistep mechanisms.
- The **overall order** is m + n.

The orders describe how sensitive the rate is to each reactant. A zero-order reactant can be doubled with no effect on the rate. A first-order reactant doubles the rate when it doubles. A second-order reactant quadruples the rate when it doubles.

## Why "initial" rates

The rate of a reaction changes as it runs, because reactants are used up. Measuring the rate right at the start, while concentrations are still essentially the values you mixed, solves three problems at once:

1. You know the concentrations exactly, since they are the starting ones.
2. Almost no product exists yet, so the reverse reaction contributes nothing.
3. Products or side reactions have not had time to interfere.

Graphically, the initial rate is the slope of the tangent to the concentration versus time curve at t = 0. A higher starting concentration gives a steeper starting slope for any reactant with order above zero.

![Left: concentration of a second-order reactant over time from two starting concentrations, with dashed tangent lines at time zero. Right: log of rate against log of concentration for zero, first and second order, where the slope equals the order.](assets/notes/rate-law-method-of-initial-rates.png "Left: the initial rate is the slope at t = 0, and doubling [A] makes it four times steeper for a second-order reactant. Right: on log axes, the slope of rate versus concentration is the order.")

## The ratio method, step by step

1. **Find a pair of runs where only reactant A changes.** Every other concentration (and the temperature) must be the same.
2. **Compute two ratios:** the concentration ratio [A]<sub>2</sub>/[A]<sub>1</sub> and the rate ratio rate<sub>2</sub>/rate<sub>1</sub>.
3. **Solve (concentration ratio)<sup>m</sup> = rate ratio for m.** Common patterns:

| Concentration multiplied by | Rate multiplied by | Order |
|---|---|---|
| 2 | 1 | 0 |
| 2 | 2 | 1 |
| 2 | 4 | 2 |
| 3 | 3 | 1 |
| 3 | 9 | 2 |
| 4 | 2 | 1/2 |

4. **Repeat for every other reactant** with a different pair of runs.
5. **Solve for k** by substituting one run's rate and concentrations into the rate law.
6. **Check** by predicting the rate of a run you did not use.

When the ratio is not a clean number, use logs: m = log(rate ratio) / log(concentration ratio). For example, if raising [A] by a factor of 1.5 raises the rate by a factor of 2.25, then m = log 2.25 / log 1.5 = 2.

## Worked example 1: a clean table

Consider a reaction 2X + Y &rarr; products at constant temperature.

| Run | [X] (M) | [Y] (M) | Initial rate (M/s) |
|---|---|---|---|
| 1 | 0.020 | 0.050 | 3.6 &times; 10<sup>-5</sup> |
| 2 | 0.060 | 0.050 | 3.24 &times; 10<sup>-4</sup> |
| 3 | 0.020 | 0.100 | 3.6 &times; 10<sup>-5</sup> |

**Order in X.** Runs 1 and 2 hold [Y] fixed. [X] triples (0.060 / 0.020 = 3), and the rate rises by 3.24 &times; 10<sup>-4</sup> / 3.6 &times; 10<sup>-5</sup> = 9. Since 3<sup>2</sup> = 9, the reaction is **second order in X**.

**Order in Y.** Runs 1 and 3 hold [X] fixed. [Y] doubles, and the rate does not change. Since 2<sup>0</sup> = 1, the reaction is **zero order in Y**.

**Rate law:** rate = k[X]<sup>2</sup>. Overall order 2. Y is still consumed by the reaction, but it does not take part in the slow step, so its concentration does not control the rate.

**Rate constant.** From run 1: k = 3.6 &times; 10<sup>-5</sup> / (0.020)<sup>2</sup> = 3.6 &times; 10<sup>-5</sup> / 4.0 &times; 10<sup>-4</sup> = **0.090 M<sup>-1</sup> s<sup>-1</sup>**.

**Prediction check.** For [X] = 0.040 M and [Y] = 0.200 M, rate = 0.090 &times; (0.040)<sup>2</sup> = 1.44 &times; 10<sup>-4</sup> M/s. The fourfold change in [Y] is irrelevant.

Notice that the coefficient 2 in front of X happens to match its order here, while the coefficient 1 in front of Y does not match its order of zero. Coincidences like the first are why students wrongly trust the balanced equation.

## Worked example 2: no clean pair for one reactant

Sometimes the table never changes a reactant alone. Then cancel what you already know.

| Run | [A] (M) | [B] (M) | Initial rate (M/s) |
|---|---|---|---|
| 1 | 0.10 | 0.10 | 4.0 &times; 10<sup>-3</sup> |
| 2 | 0.20 | 0.10 | 8.0 &times; 10<sup>-3</sup> |
| 3 | 0.30 | 0.20 | 4.8 &times; 10<sup>-2</sup> |

1. Runs 1 and 2: [A] doubles with [B] fixed, and the rate doubles, so the order in A is 1.
2. Runs 1 and 3: both concentrations change. Write the full ratio: rate<sub>3</sub>/rate<sub>1</sub> = (0.30/0.10)<sup>1</sup> &times; (0.20/0.10)<sup>n</sup>.
3. The rate ratio is 4.8 &times; 10<sup>-2</sup> / 4.0 &times; 10<sup>-3</sup> = 12. So 12 = 3 &times; 2<sup>n</sup>, which gives 2<sup>n</sup> = 4 and **n = 2**.
4. Rate law: rate = k[A][B]<sup>2</sup>, third order overall.
5. From run 1: k = 4.0 &times; 10<sup>-3</sup> / (0.10 &times; 0.010) = **4.0 M<sup>-2</sup> s<sup>-1</sup>**.

The trick is to divide out the part of the rate change you can already explain, then read the leftover factor.

## Units of k by overall order

Rate always has units of M/s. The units of k adjust so the rate law comes out in M/s. A shortcut: k has units of M<sup>1 - (overall order)</sup> s<sup>-1</sup>.

| Overall order | Rate law example | Units of k |
|---|---|---|
| 0 | rate = k | M s<sup>-1</sup> |
| 1 | rate = k[A] | s<sup>-1</sup> |
| 2 | rate = k[A]<sup>2</sup> or k[A][B] | M<sup>-1</sup> s<sup>-1</sup> |
| 3 | rate = k[A][B]<sup>2</sup> | M<sup>-2</sup> s<sup>-1</sup> |

This works backward too. If a problem gives k in M<sup>-1</sup> s<sup>-1</sup>, the reaction is second order overall even before you see any data.

## Where the orders come from

Orders are experimental because most reactions happen in several elementary steps, and the slowest step (the rate-determining step) sets the rate. For a single elementary step, and only then, the order of each reactant equals its coefficient in that step, because the step's rate depends on how often those exact particles collide. For an overall reaction, the coefficients summarize all the steps, so they say nothing reliable about the rate law. A reactant that enters only after the slow step, like Y in the first example, can end up zero order.

If a rate law you measured matches the one a proposed mechanism predicts, the mechanism is consistent with the data. It is not proven, since other mechanisms might predict the same rate law.

## Flooding: making one reactant look first order

When a reaction has several reactants, chemists sometimes add one reactant in a large excess. Its concentration barely changes during the run, so it folds into a constant, and the reaction behaves as if it depends only on the other reactant. This is called a **pseudo-first-order** (or pseudo-order) condition. The observed constant then equals k times the excess concentration raised to its order. Reactions in water often look this way because water, the solvent, is present in huge excess.

## Common traps

- **Reading orders from the balanced equation.** Only elementary steps allow that. Use the data.
- **Comparing two runs where two things changed** without dividing out the known effect. Either find a cleaner pair or cancel the known factor first.
- **Flipping the ratio.** Put the same run on top in both ratios. If run 2 is on top for concentration, run 2 is on top for rate.
- **Forgetting that order zero still means the reactant is used up.** It just does not appear in the rate law.
- **Using a run at a different temperature.** k changes with temperature, so the comparison breaks. Only concentrations may differ between the runs you compare.
- **Giving k units of M/s for every order.** Rate is M/s. k changes with the overall order.
- **Thinking a bigger k means a more favorable reaction.** k measures speed. Whether a reaction is favorable is a thermodynamic question, covered in the [Gibbs free energy note](gibbs-free-energy-delta-g-spontaneity.html).

## One-minute recap

Hold every concentration but one constant, compare two runs, and solve (concentration ratio)<sup>order</sup> = rate ratio. Doubling with no change means zero order, doubling means first, quadrupling means second, and logs handle awkward numbers. If no clean pair exists, divide out the reactant you already solved. Write rate = k[A]<sup>m</sup>[B]<sup>n</sup>, solve k from one run, and give k units of M<sup>1 - overall order</sup> s<sup>-1</sup>. Coefficients equal orders only for elementary steps. First-order kinetics also give a constant half-life, which links this topic to [radioactive decay](radioactive-decay-half-life-calculations.html).

:::quiz
Q: Tripling [A] with every other concentration fixed multiplies the initial rate by 9. What is the order in A?
A: Second order, because 3 raised to the power 2 equals 9.
Q: Doubling [B] while all else is fixed leaves the initial rate unchanged. Does B still get consumed by the reaction?
A: Yes. Zero order only means B is not in the rate-determining step, so its concentration does not affect the rate, but it is still a reactant.
Q: A rate law is rate = k[A][B]^2. What are the units of k if concentrations are in M and time in seconds?
A: The reaction is third order overall, so k has units of M^-2 s^-1, which makes k times M^3 come out as M/s.
Q: Runs 1 and 3 differ by doubling [A] and doubling [B], and the rate rises by a factor of 8. The reaction is known to be first order in A. What is the order in B?
A: Second order. Dividing out the factor of 2 from A leaves a factor of 4 from B, and 2 squared is 4.
Q: For the elementary step 2NO2 → NO3 + NO, what is the rate law?
A: Rate = k[NO2]^2. For an elementary step, the order of each reactant equals its coefficient, which is not true for an overall multistep reaction.
:::

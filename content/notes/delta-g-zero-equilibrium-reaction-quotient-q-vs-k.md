---
title: What Delta G = 0 Means: Equilibrium, Q vs K and Delta G Standard
description: What delta G equal to zero means, how Q compared with K sets the sign of delta G, and why delta G standard is not the same as delta G, with worked numbers.
product: 5e-thermo-kinetics
published: 2026-11-06
related: gibbs-free-energy-delta-g-spontaneity, delta-g-delta-h-t-delta-s-sign-table, le-chateliers-principle-equilibrium-shifts-mcat, positive-delta-g-nonspontaneous-endergonic-reaction-coupling
seo_title: Delta G = 0 Means Equilibrium: Q vs K (MCAT)
seo_description: Delta G = 0 means the reaction is at equilibrium, so Q = K. Learn how Q vs K sets the sign of delta G and how delta G standard differs, with examples.
---

**&Delta;G = 0 means the system is at equilibrium.** There is no net driving force in either direction, the forward and reverse rates are equal, and the reaction quotient **Q equals the equilibrium constant K**.

## The master equation

&Delta;G = &Delta;G&deg; + RT ln Q

At equilibrium, &Delta;G = 0 and Q = K, so &Delta;G&deg; = -RT ln K. That is the link between standard free energy and K.

## Q vs K tells you the direction

| Comparison | ln(Q/K) | &Delta;G | Net direction |
|---|---|---|---|
| Q < K | Negative | Negative | Forward, toward products |
| Q = K | Zero | Zero | None, at equilibrium |
| Q > K | Positive | Positive | Reverse, toward reactants |

You can rewrite the master equation as &Delta;G = RT ln(Q/K). It makes the table easy to rebuild: if there are fewer products than equilibrium needs, Q is smaller than K and the reaction runs forward.

## &Delta;G vs &Delta;G&deg;

- **&Delta;G&deg;** is fixed for a reaction at given conditions and tells you K. It is the value at 1 M and standard state, not at equilibrium.
- **&Delta;G** depends on the current mixture through Q and is the quantity that predicts the real direction.
- A reaction with positive &Delta;G&deg; (K less than 1) can still run forward if Q is small enough that &Delta;G is negative. This is how cells drive unfavorable steps by keeping product concentrations low.

*Want this topic as spaced-repetition cards? The [matching StudyStore MCAT pack](../products/5e-thermo-kinetics.html?utm_source=site-cta) has original Anki cards, a study guide and practice questions for it.*

## Worked example

A reaction has K = 10 and Q = 0.1 at 298 K. Q is 100 times smaller than K, so ln(Q/K) = ln(0.01), about -4.6. With RT near 2.5 kJ/mol, &Delta;G is about -11.5 kJ/mol. It is negative, so the reaction proceeds forward until Q rises to 10.

## Common traps

- **Saying a reaction with &Delta;G&deg; = 0 is at equilibrium.** That means K = 1, not that Q = K.
- **Using &Delta;G&deg; to predict direction in a cell.** Use &Delta;G with the real concentrations.
- **Linking &Delta;G = 0 to no reaction.** The reaction continues in both directions at equal rates.

## One-minute recap

&Delta;G = 0 means equilibrium and Q = K. If Q is below K, &Delta;G is negative and the reaction goes forward. If Q is above K, &Delta;G is positive and it goes in reverse. &Delta;G&deg; sets K; &Delta;G sets the direction now. The broader picture is in the [Gibbs free energy note](gibbs-free-energy-delta-g-spontaneity.html).

:::quiz
Q: What does delta G = 0 tell you?
A: The system is at equilibrium, with Q = K and equal forward and reverse rates.
Q: If Q is less than K, what is the sign of delta G and the net direction?
A: Delta G is negative and the reaction runs forward.
Q: What does delta G standard = 0 mean for K?
A: K = 1, since delta G standard = -RT ln K.
Q: Can a reaction with positive delta G standard run forward in a cell?
A: Yes, if the real Q is low enough that delta G is negative.
Q: Write delta G in terms of Q and K.
A: Delta G = RT ln(Q/K).
:::

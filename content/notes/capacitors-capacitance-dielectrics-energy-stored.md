---
title: Capacitors: Capacitance, Dielectrics, Energy Stored and Series vs Parallel
description: Capacitor formulas for the MCAT: C = Q/V, parallel plate capacitance, dielectric effects, energy stored, and series vs parallel combinations with a worked example.
seo_title: Capacitors and Dielectrics | MCAT Free Notes
seo_description: Free MCAT notes on capacitors: C = Q/V, plate area and separation, dielectrics, energy stored, series vs parallel, worked example and quiz.
product: 4c-electricity-electrochem
published: 2026-11-05
related: ohms-law-series-vs-parallel-circuits-equivalent-resistance, coulombs-law-electric-field-potential-energy, work-energy-theorem-conservation-of-energy
---

A capacitor stores charge and energy in the electric field between two conductors. Capacitance C is how much charge it holds per volt. The MCAT checks three things: what C depends on, what happens when a dielectric is added, and that series and parallel rules are the reverse of resistors.

## Core formulas

| Quantity | Formula |
|---|---|
| Capacitance | C = Q / V |
| Parallel plate capacitance | C = &epsilon;<sub>0</sub>A / d (times &kappa; with a dielectric) |
| Energy stored | U = &frac12;CV<sup>2</sup> = &frac12;QV = Q<sup>2</sup>/2C |
| Field between plates | E = V / d |
| Parallel | C<sub>eq</sub> = C<sub>1</sub> + C<sub>2</sub> + ... |
| Series | 1/C<sub>eq</sub> = 1/C<sub>1</sub> + 1/C<sub>2</sub> + ... |

C grows with plate area A and shrinks as separation d grows. It depends only on geometry and the material between plates, not on Q or V.

## Dielectrics

A dielectric is an insulator placed between the plates. It multiplies capacitance by its dielectric constant &kappa; (greater than 1). What else changes depends on whether the battery is attached.

| Condition | V | Q | E | C | U |
|---|---|---|---|---|---|
| Battery connected, dielectric added | Same | Rises by &kappa; | Same | Rises by &kappa; | Rises by &kappa; |
| Battery disconnected, dielectric added | Falls by &kappa; | Same | Falls by &kappa; | Rises by &kappa; | Falls by &kappa; |

Connected means V is fixed. Isolated means Q is fixed. Decide which is held constant before reasoning.

## Series vs parallel

Capacitors in parallel share the same V and their charges add, so C adds. In series they share the same Q and their voltages add, so reciprocals add. Series always gives a C smaller than the smallest one.

## Worked example

Two capacitors of 4 uF and 12 uF are placed in series across 12 V.

- C<sub>eq</sub> = 1/(1/4 + 1/12) = 1/(4/12) = 3 uF.
- Total charge: Q = CV = 3 x 12 = 36 uC, the same on each capacitor.
- Voltages: 36/4 = 9 V and 36/12 = 3 V, which add to 12 V.
- Energy: &frac12;(3 uF)(12 V)<sup>2</sup> = 216 uJ.

## Common traps

- **Using resistor rules.** For capacitors, parallel adds.
- **Thinking C depends on Q or V.** It depends on A, d and &kappa;.
- **Ignoring whether the battery is connected** when a dielectric or the plate separation changes.
- **Forgetting the one-half in U.**

## One-minute recap

C = Q/V = &kappa;&epsilon;<sub>0</sub>A/d. U = &frac12;CV<sup>2</sup>. Parallel adds, series reciprocal. Dielectric raises C by &kappa;. Battery on: V fixed. Battery off: Q fixed.

:::quiz
Q: The plate separation of an isolated, charged capacitor doubles. What happens to its capacitance?
A: It halves, because C is proportional to 1/d.
Q: Two 6 uF capacitors are connected in series. What is the equivalent capacitance?
A: 3 uF.
Q: A dielectric is inserted while the battery stays connected. What stays the same?
A: The voltage across the plates, while charge and stored energy rise by the factor kappa.
Q: What are the voltages across series capacitors of 4 uF and 12 uF with 12 V applied?
A: 9 V across the 4 uF and 3 V across the 12 uF, since they hold equal charge.
Q: How much energy does a 2 uF capacitor store at 10 V?
A: 100 uJ, from one-half times 2 uF times 100 V squared.
:::

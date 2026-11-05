---
title: Coulomb's Law, Electric Field and Electric Potential: What Changes With Distance
description: Coulomb's law, electric field, electric potential and potential energy for the MCAT, with the 1/r versus 1/r squared scaling, sign rules and a worked example.
seo_title: Coulomb's Law and Electric Field | MCAT Free Notes
seo_description: Free MCAT notes on Coulomb's law, electric field, potential and potential energy: scaling with distance, sign conventions, worked example and quiz.
product: 4c-electricity-electrochem
published: 2026-11-05
related: ohms-law-series-vs-parallel-circuits-equivalent-resistance, galvanic-vs-electrolytic-cells, work-energy-theorem-conservation-of-energy, magnetic-force-lorentz-right-hand-rule
---

Four quantities describe point charges, and the MCAT tests which one scales with which power of distance. Force and field go as 1/r<sup>2</sup>. Potential and potential energy go as 1/r. Force and field are vectors, potential and energy are scalars.

## The four formulas

| Quantity | Formula (point charge) | Scaling | Type |
|---|---|---|---|
| Force between two charges | F = k q<sub>1</sub>q<sub>2</sub> / r<sup>2</sup> | 1/r<sup>2</sup> | Vector |
| Electric field | E = kq / r<sup>2</sup> (also E = F/q) | 1/r<sup>2</sup> | Vector |
| Electric potential | V = kq / r | 1/r | Scalar |
| Potential energy | U = k q<sub>1</sub>q<sub>2</sub> / r (also U = qV) | 1/r | Scalar |

The constant k is about 9 x 10<sup>9</sup> N m<sup>2</sup>/C<sup>2</sup>.

## Sign rules

- Like charges repel, opposite charges attract.
- The field points away from positive charge and toward negative charge. A positive test charge feels force along E, a negative one feels force against E.
- In U = k q<sub>1</sub>q<sub>2</sub>/r, keep the signs. Positive U means repulsive pair, negative U means bound (attractive) pair.
- Positive charges move to lower potential on their own. Negative charges move to higher potential on their own. Either way, a free charge lowers its potential energy.

## Scalars add simply, vectors need components

For several charges, total V is the plain sum of kq/r with signs. Total E needs vector addition. At the midpoint between two equal positive charges, E is zero (the fields cancel) but V is not zero (it is twice the single value). That contrast is a standard MCAT question.

## Uniform field between plates

Between parallel plates, E = V/d is constant, and a charge moves with constant force F = qE. Equipotential lines are perpendicular to field lines, and no work is done moving a charge along an equipotential.

## Worked example

Two charges, +2 uC and +3 uC, sit 0.30 m apart.

- Force: F = (9 x 10<sup>9</sup>)(2 x 10<sup>-6</sup>)(3 x 10<sup>-6</sup>) / 0.30<sup>2</sup> = 0.054 / 0.09 = 0.60 N, repulsive.
- Potential energy: U = 0.054 / 0.30 = 0.18 J.
- If the distance doubles to 0.60 m, F falls to 0.15 N (one fourth) and U falls to 0.09 J (one half).

## Common traps

- **Using 1/r<sup>2</sup> for potential.** Potential and U go as 1/r.
- **Adding field magnitudes without direction.** E is a vector.
- **Dropping signs in U.** The sign tells repulsion or attraction.
- **Assuming zero field means zero potential.** They are independent at a point.

## One-minute recap

F and E: 1/r<sup>2</sup>, vectors. V and U: 1/r, scalars. E = F/q, U = qV, E = V/d between plates. Positive charges fall toward lower V, negative toward higher V. No work along equipotentials.

:::quiz
Q: The distance between two point charges triples. By what factor does the force change?
A: It falls to 1/9, because force scales as 1/r squared.
Q: The distance between two point charges triples. By what factor does the potential energy change?
A: It falls to 1/3, because U scales as 1/r.
Q: At the midpoint between two equal positive charges, what are E and V?
A: E is zero because the fields cancel, but V is nonzero because potentials are scalars that add.
Q: A negative charge is released in an electric field. Does it move toward higher or lower potential?
A: Higher potential, which lowers its potential energy.
Q: A charge moves along an equipotential line. How much work does the field do?
A: Zero, because the potential difference is zero.
:::

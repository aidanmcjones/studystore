---
title: MCAT Thermodynamics Practice Questions
description: Nine free MCAT-style thermodynamics practice questions on Hess's law, bond energies, entropy, Gibbs free energy, temperature and spontaneity, and K, with full explanations.
aamc: 5E
category: 5e-thermo-kinetics
cluster: Enthalpy and Hess's law, Bond dissociation energy, Entropy and the second law, Gibbs free energy and spontaneity, Temperature dependence of spontaneity, Free energy and the equilibrium constant, Coupled reactions in biology
product: 5e-thermo-kinetics
published: 2026-10-30
notes:
---

Enthalpy is a state function, so the &Delta;H of a reaction depends only on its start and end points. That is why Hess's law works: reverse a step and flip the sign of its &Delta;H, scale a step and scale its &Delta;H by the same factor, then add. Bond dissociation energies give an estimate of the same quantity: energy spent breaking reactant bonds minus energy released forming product bonds.

Spontaneity is decided by &Delta;G = &Delta;H &minus; T&Delta;S, not by &Delta;H alone. When &Delta;H and &Delta;S share a sign, temperature decides, and the crossover sits at T = &Delta;H/&Delta;S. At standard conditions &Delta;G&deg; = &minus;RT ln K, so a negative &Delta;G&deg; means K is greater than 1. Away from standard conditions, &Delta;G = &Delta;G&deg; + RT ln Q tells you which way a mixture will shift. Cells exploit additivity too: an unfavorable step runs when it shares an intermediate with a strongly favorable one, such as ATP hydrolysis.

Traps: thermodynamics says nothing about rate, so a negative &Delta;G does not mean a fast reaction; convert &Delta;S from J to kJ before combining it with &Delta;H; and the second law concerns the entropy of the universe, not of the system alone. The [5E Thermodynamics and Kinetics pack](../products/5e-thermo-kinetics.html) adds flashcards and more practice across the whole category, and you can try a [free sampler](/#sampler) first.

@@QUESTIONS

### Q1
A chemist measures two steps at constant pressure:

| Step | Reaction | &Delta;H, kJ/mol |
|---|---|---|
| 1 | A + 2B &#8594; C | &minus;210 |
| 2 | C &#8594; 2D | +80 |

What is &Delta;H for the reaction 2D &#8594; A + 2B?
A) &minus;130 kJ/mol
B) +130 kJ/mol
C) &minus;290 kJ/mol
D) +290 kJ/mol
ANSWER: B
WHY: Adding steps 1 and 2 gives A + 2B &#8594; 2D with &Delta;H = &minus;210 + 80 = &minus;130 kJ/mol. The requested reaction is the reverse, so its sign flips to +130 kJ/mol. Choice A forgets to reverse, and choices C and D subtract 80 instead of adding it.

### Q2
Use these average bond energies for a hypothetical gas-phase reaction X<sub>2</sub> + Y<sub>2</sub> &#8594; 2XY: X-X 440 kJ/mol, Y-Y 240 kJ/mol, X-Y 430 kJ/mol. What is the estimated &Delta;H of the reaction?
A) &minus;180 kJ/mol
B) +180 kJ/mol
C) +250 kJ/mol
D) &minus;250 kJ/mol
ANSWER: A
WHY: &Delta;H is bonds broken minus bonds formed: (440 + 240) &minus; 2(430) = 680 &minus; 860 = &minus;180 kJ/mol. Choice B reverses the subtraction, and choices C and D count only one X-Y bond formed even though two form.

### Q3
A phase change has &Delta;H = +36 kJ/mol and &Delta;S = +120 J/(mol K), both roughly constant with temperature. Which statement about spontaneity is correct?
A) It is spontaneous at every temperature
B) It is spontaneous only below 300 K
C) It is spontaneous only above 300 K
D) It is spontaneous only above about 3.3 K
ANSWER: C
WHY: With &Delta;H and &Delta;S both positive, &Delta;G = &Delta;H &minus; T&Delta;S becomes negative only when T&Delta;S exceeds &Delta;H, above T = 36,000 J/mol &divide; 120 J/(mol K) = 300 K. Choice B reverses the direction, and choice D inverts the ratio and drops the unit conversion.

### Q4
A reaction has an equilibrium constant of 1.0 &times; 10<sup>3</sup> at 298 K. Using R = 8.314 J/(mol K), what is &Delta;G&deg; for the reaction?
A) +17.1 kJ/mol
B) &minus;7.4 kJ/mol
C) &minus;1.7 kJ/mol
D) &minus;17.1 kJ/mol
ANSWER: D
WHY: &Delta;G&deg; = &minus;RT ln K = &minus;(8.314)(298)(ln 1000) = &minus;(8.314)(298)(6.91) &asymp; &minus;17,100 J/mol, or &minus;17.1 kJ/mol. The negative sign matches K greater than 1. Choice B uses log base 10 instead of the natural log, and choice A has the wrong sign.

### Q5
Which process has a negative entropy change for the system?
A) 2SO<sub>2</sub>(g) + O<sub>2</sub>(g) &#8594; 2SO<sub>3</sub>(g)
B) N<sub>2</sub>O<sub>4</sub>(g) &#8594; 2NO<sub>2</sub>(g)
C) Ice melting at 0 &deg;C
D) Solid CO<sub>2</sub> subliming at 1 atm
ANSWER: A
WHY: Three moles of gas become two moles of gas, so the number of ways to arrange the particles drops and &Delta;S is negative. Choice B doubles the moles of gas, and choices C and D move from a solid to a less ordered phase, all of which raise entropy.

### Q6
A reaction has &Delta;G&deg; &lt; 0 at 298 K. All of the following must be true EXCEPT:
A) K at 298 K is greater than 1
B) The reverse reaction has &Delta;G&deg; &gt; 0 at 298 K
C) The reaction reaches equilibrium within seconds
D) ln K at 298 K is positive
ANSWER: C
WHY: &Delta;G&deg; is a thermodynamic quantity and carries no information about activation energy or rate, so a favorable reaction can still be very slow. A negative &Delta;G&deg; does force K above 1 and ln K above zero, and reversing a reaction flips the sign of &Delta;G&deg;.

### Q7
A student tabulates approximate values for four reactions, assuming each value stays constant with temperature:

| Reaction | &Delta;H, kJ/mol | &Delta;S, J/(mol K) |
|---|---|---|
| P | &minus;50 | &minus;100 |
| R | &minus;30 | +15 |
| S | +20 | +60 |
| T | +10 | &minus;5 |

Which reaction is spontaneous at every temperature?
A) P
B) R
C) S
D) T
ANSWER: B
WHY: Only reaction R has negative &Delta;H and positive &Delta;S, so both terms of &Delta;G = &Delta;H &minus; T&Delta;S are negative at any temperature. Reaction P is spontaneous only at low temperature, S only at high temperature, and T, with &Delta;H positive and &Delta;S negative, never.

### Q8
In a cell, phosphorylating a sugar with inorganic phosphate has &Delta;G&deg;&prime; of about +13.8 kJ/mol, and ATP hydrolysis to ADP and phosphate has &Delta;G&deg;&prime; of about &minus;30.5 kJ/mol. Using these values, what is &Delta;G&deg;&prime; for the coupled reaction sugar + ATP &#8594; sugar phosphate + ADP?
A) +44.3 kJ/mol
B) &minus;44.3 kJ/mol
C) +16.7 kJ/mol
D) &minus;16.7 kJ/mol
ANSWER: D
WHY: Coupled reactions add, and so do their free energies: +13.8 + (&minus;30.5) = &minus;16.7 kJ/mol, so the overall reaction is favorable. Choices A and B subtract the values instead of adding them, and choice C has the wrong sign.

### Q9
At 300 K, a process occurs spontaneously in a closed system while the system's entropy falls by 20 J/K. Which statement must be true?
A) The process violates the second law of thermodynamics
B) The system absorbed at least 6.0 kJ of heat
C) The entropy of the universe stays exactly constant
D) The system released more than 6.0 kJ of heat to the surroundings
ANSWER: D
WHY: A spontaneous process requires the total entropy change to be positive, so the surroundings must gain more than 20 J/K. At 300 K that means more than (20 J/K)(300 K) = 6000 J of heat flowed into the surroundings. Choice A ignores the surroundings, choice B gets the heat direction backward, and choice C describes a reversible process.

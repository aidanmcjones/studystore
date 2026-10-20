---
title: MCAT Chemical Kinetics Practice Questions
description: Ten free MCAT-style kinetics practice questions on rate laws from data, rate constants and units, mechanisms, the Arrhenius equation, half-life, catalysts and reaction coordinate diagrams, with full explanations.
aamc: 5E
category: 5e-thermo-kinetics
cluster: Reaction rates and rate laws, Reaction order from data, Rate-determining step and mechanisms, Activation energy and the Arrhenius equation, Reaction coordinate diagrams, Catalysts, Kinetic versus thermodynamic control
product: 5e-thermo-kinetics
published: 2026-10-20
notes:
---

A rate law, rate = k[A]<sup>m</sup>[B]<sup>n</sup>, must be found from experiment, not read from the balanced equation. Compare two trials in which only one concentration changes: if doubling [A] doubles the rate, m = 1; if it quadruples the rate, m = 2; if nothing changes, m = 0. The units of k follow from the overall order, and for a first-order reaction the half-life, 0.693/k, does not depend on concentration.

For a multistep mechanism, the slowest step limits the overall rate, and the rate law matches that step's molecularity once intermediates are accounted for. On a reaction coordinate diagram, transition states are energy maxima and intermediates are local minima; the step with the highest transition state relative to the starting point is rate-determining. The Arrhenius equation, k = Ae<sup>-Ea/RT</sup>, shows that raising the temperature or lowering the activation energy increases k exponentially. A catalyst lowers Ea for the forward and reverse reactions equally, so it speeds the approach to equilibrium without changing &Delta;G, &Delta;H or K.

Traps: stoichiometric coefficients equal reaction orders only for elementary steps, and the product that forms fastest (kinetic control) is not always the most stable one (thermodynamic control).

@@QUESTIONS

### Q1
A student studies the reaction 2A + B &#8594; C in three experiments at the same temperature and records the starting rate of each:

| Experiment | Starting [A], mol/L | Starting [B], mol/L | Starting rate, mol/(L s) |
|---|---|---|---|
| Run 1 | 0.050 | 0.020 | 1.5 &times; 10<sup>-5</sup> |
| Run 2 | 0.100 | 0.020 | 6.0 &times; 10<sup>-5</sup> |
| Run 3 | 0.050 | 0.060 | 4.5 &times; 10<sup>-5</sup> |

Which rate law fits these data?
A) rate = k[A][B]
B) rate = k[A]<sup>2</sup>
C) rate = k[A]<sup>2</sup>[B]
D) rate = k[A][B]<sup>2</sup>
ANSWER: C
WHY: From run 1 to run 2, [A] doubles with [B] fixed and the rate rises fourfold, so the order in A is 2. From run 1 to run 3, [B] triples with [A] fixed and the rate triples, so the order in B is 1. The rate law is k[A]<sup>2</sup>[B]. Choice B omits B even though changing [B] changed the rate.

### Q2
A reaction obeys rate = k[X]<sup>2</sup>[Y]. When [X] = 0.10 M and [Y] = 0.10 M, the initial rate is 2.0 &times; 10<sup>-4</sup> M/s. What is the rate constant?
A) 0.20 M<sup>-2</sup> s<sup>-1</sup>
B) 0.020 M<sup>-1</sup> s<sup>-1</sup>
C) 2.0 &times; 10<sup>-3</sup> M<sup>-2</sup> s<sup>-1</sup>
D) 20 M<sup>-2</sup> s<sup>-1</sup>
ANSWER: A
WHY: Rearranging, k = rate / ([X]<sup>2</sup>[Y]) = 2.0 &times; 10<sup>-4</sup> / (0.010 &times; 0.10) = 0.20. For a third-order rate law, k has units of M<sup>-2</sup> s<sup>-1</sup> so that k times M<sup>3</sup> gives M/s. Choice B forgets to square [X] and gives second-order units, and choices C and D are off by a factor of 100.

### Q3
A proposed mechanism for NO<sub>2</sub> + CO &#8594; NO + CO<sub>2</sub> is:

Step 1 (slow): NO<sub>2</sub> + NO<sub>2</sub> &#8594; NO<sub>3</sub> + NO

Step 2 (fast): NO<sub>3</sub> + CO &#8594; NO<sub>2</sub> + CO<sub>2</sub>

Which statement is consistent with this mechanism?
A) rate = k[NO<sub>2</sub>][CO], and NO<sub>3</sub> is a catalyst
B) rate = k[NO<sub>2</sub>]<sup>2</sup>, and NO<sub>3</sub> is an intermediate
C) rate = k[NO<sub>2</sub>][CO], and NO<sub>3</sub> is an intermediate
D) rate = k[NO<sub>2</sub>]<sup>2</sup>[CO], and NO is a catalyst
ANSWER: B
WHY: The slow first step is elementary and bimolecular in NO<sub>2</sub>, so it sets rate = k[NO<sub>2</sub>]<sup>2</sup>, and CO does not appear because it reacts only after the bottleneck. NO<sub>3</sub> is made in step 1 and used in step 2, so it is an intermediate. A catalyst would be consumed first and regenerated later, and NO is simply a product.

### Q4
A reaction has an activation energy of 50 kJ/mol. Assuming the pre-exponential factor stays constant, about how many times faster is it at 310 K than at 300 K? (R = 8.314 J/(mol K))
A) 1.03 times
B) 1.2 times
C) 10 times
D) 1.9 times
ANSWER: D
WHY: From the Arrhenius equation, k<sub>2</sub>/k<sub>1</sub> = exp[(Ea/R)(1/T<sub>1</sub> - 1/T<sub>2</sub>)] = exp[(50,000/8.314)(1/300 - 1/310)] = exp(0.647), which is about 1.9. Choice A assumes the rate scales linearly with absolute temperature, which ignores the exponential dependence. A tenfold increase would require a much larger activation energy or temperature change.

### Q5
All of the following are true of a catalyst added to a reversible reaction EXCEPT:
A) It increases the equilibrium constant, shifting the equilibrium toward products
B) It lowers the activation energy of the forward and reverse reactions by the same amount
C) It does not change the overall &Delta;G or &Delta;H of the reaction
D) It is regenerated at the end of the reaction cycle
ANSWER: A
WHY: A catalyst provides a lower-energy pathway that speeds the forward and reverse reactions equally, so equilibrium is reached sooner but at the same position. K depends on &Delta;G&deg;, which is a difference between reactant and product energies that the catalyst does not alter. Being regenerated is what distinguishes a catalyst from a reactant.

### Q6
A two-step reaction has the energies below, relative to the reactants.

| Point on the pathway | Energy (kJ/mol) |
|---|---|
| Reactants | 0 |
| Transition state 1 | +80 |
| Intermediate | +30 |
| Transition state 2 | +60 |
| Products | -20 |

Which statement is correct?
A) Step 2 is rate-determining, and the reaction is endothermic
B) Step 1 is rate-determining, and the reaction is endothermic
C) Step 1 is rate-determining, and the reaction is exothermic by 20 kJ/mol
D) Step 2 is rate-determining, and the reaction is exothermic by 20 kJ/mol
ANSWER: C
WHY: The highest point on the pathway is transition state 1 at +80 kJ/mol, and step 1 also has the larger individual barrier (80 versus 60 - 30 = 30 kJ/mol), so step 1 is rate-determining. Products lie 20 kJ/mol below reactants, so the reaction is exothermic. Treating the intermediate energy as the products' energy would wrongly suggest an endothermic reaction.

### Q7
A drug is eliminated by first-order kinetics with a rate constant of 0.0231 min<sup>-1</sup>. About what percentage of the initial amount remains after 90 minutes?
A) 25 percent
B) 12.5 percent
C) 6.25 percent
D) 33 percent
ANSWER: B
WHY: The half-life is 0.693/k = 0.693/0.0231 = 30 minutes. Ninety minutes is three half-lives, so the fraction remaining is (1/2)<sup>3</sup> = 1/8, or 12.5 percent. Choice A stops after two half-lives, choice C counts four, and choice D treats the decay as linear.

### Q8
A starting material R can form either of two products. The pathways are reversible when heated, but at low temperature the reverse reactions are negligibly slow.

| Product | Activation energy from R (kJ/mol) | Energy relative to R (kJ/mol) |
|---|---|---|
| X | 55 | -15 |
| Y | 70 | -45 |

Which outcome is expected?
A) Y dominates under both conditions, because it is more stable
B) X dominates under both conditions, because it forms faster
C) Y dominates at low temperature and short times, and X dominates at high temperature and long times
D) X dominates at low temperature and short times, and Y dominates at high temperature and long times
ANSWER: D
WHY: When the reactions cannot reverse, the product ratio reflects relative rates, and X has the lower barrier, so X accumulates (kinetic control). When heating makes both pathways reversible, the system equilibrates and the lower-energy product, Y, dominates (thermodynamic control). Choices A and B each ignore one of the two regimes, and choice C reverses them.

### Q9
The rate constant for a reaction with a single reactant has units of M<sup>-1</sup> s<sup>-1</sup>. If the reactant's concentration is doubled, what happens to the initial rate?
A) It quadruples
B) It doubles
C) It does not change
D) It is halved
ANSWER: A
WHY: For rate in M/s, k must have units of M<sup>1-n</sup> s<sup>-1</sup>, where n is the overall order. M<sup>-1</sup> s<sup>-1</sup> means n = 2, so the rate law is rate = k[A]<sup>2</sup> and doubling [A] multiplies the rate by 2<sup>2</sup> = 4. Doubling would match first order (k in s<sup>-1</sup>), and no change would match zero order (k in M/s).

### Q10
Which statement correctly distinguishes a reaction intermediate from a transition state?
A) Both are energy maxima, but an intermediate lasts longer
B) An intermediate sits in a local energy minimum and can sometimes be detected or trapped, while a transition state is an energy maximum with partially formed bonds that cannot be isolated
C) A transition state appears in the rate law, while an intermediate never affects the rate
D) An intermediate appears in the overall balanced equation, while a transition state does not
ANSWER: B
WHY: On a reaction coordinate diagram an intermediate occupies a valley between two transition states, so it has a finite lifetime and is sometimes observable. A transition state is the peak of an energy barrier, a fleeting arrangement with partial bonds. Intermediates are formed and consumed, so they cancel out of the overall equation, and their formation often controls the rate.

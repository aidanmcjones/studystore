---
title: Three-Point Cross: Gene Order and Double Crossovers
description: How to read a three-point test cross, find the middle gene from the rarest classes, and compute map distances, with a worked example.
product: 1c-heredity-evolution
published: 2026-11-05
related: recombination-frequency-gene-mapping-map-units, mendelian-genetics-practice-problems-mcat
seo_title: Three-Point Cross: Gene Order and Map Distance (MCAT)
seo_description: Find gene order from a three-point test cross: parentals are most common, double crossovers are rarest, and the gene that switched is in the middle. Worked example.
---

A three-point cross follows three linked genes at once. It gives the **gene order** and the **map distances** in one experiment, and it catches double crossovers that a two-point cross undercounts.

## The three rules

1. **The two most common classes are the parentals** (no crossover).
2. **The two rarest classes are the double crossovers.**
3. **Compare a double crossover class to a parental class. The one gene that switched is the middle gene.**

## Worked example

A heterozygote A B C / a b c is test-crossed to a b c / a b c. The 1080 offspring:

| Phenotype | Count | Class |
|---|---|---|
| A B C | 430 | Parental |
| a b c | 440 | Parental |
| a B C | 62 | Single crossover |
| A b c | 58 | Single crossover |
| A B c | 38 | Single crossover |
| a b C | 42 | Single crossover |
| A b C | 5 | Double crossover |
| a B c | 5 | Double crossover |

**Gene order.** A b C differs from the parental A B C only at B, so **B is in the middle**. The order is A, B, C. (If the order is not given in the problem, the order you started with may be wrong; the double crossover test fixes it.)

**Distance A to B.** Count every offspring with a crossover between A and B, including double crossovers: 62 + 58 + 5 + 5 = 130. 130/1080 = 12.0%, so 12.0 map units.

**Distance B to C.** 38 + 42 + 5 + 5 = 90. 90/1080 = 8.3 map units.

**Distance A to C.** 12.0 + 8.3 = 20.4 map units. Counting only the offspring that look recombinant for A and C gives 200/1080 = 18.5%, which is too low, because a double crossover swaps the middle gene and leaves A and C in their parental combination. Add each double crossover twice (2 x 10 = 20) to get 220/1080 = 20.4%.

## Coefficient of coincidence and interference

- Expected double crossovers = 0.120 x 0.083 x 1080, about 10.8.
- Observed = 10.
- **Coefficient of coincidence** = observed/expected, about 0.92.
- **Interference** = 1 - coincidence, about 0.08.

Positive interference means one crossover makes a nearby second crossover less likely, which is the usual case.

## Why double crossovers are the rarest

A double crossover needs two independent events, so its frequency is roughly the product of the two single-crossover frequencies. Here that is about 1 percent, versus 8 to 12 percent for the single classes.

## Common traps

- **Picking the middle gene as the one that is most different from the parentals.** It is the one that switched in the double crossover class.
- **Leaving out the double crossovers when computing each interval.** Each interval must include them.
- **Using the three-point order you were given without checking.** The data decide.
- **Expecting distances to add exactly after a rough count.** They add once double crossovers are counted in every interval they span.

## One-minute recap

Parentals are most common, double crossovers are rarest, and the gene that flips in a double crossover is in the middle. Each interval counts its single crossovers plus all double crossovers. Distances then add, and coincidence compares observed to expected doubles. For the two-point basics, see the [recombination frequency note](recombination-frequency-gene-mapping-map-units.html).

:::quiz
Q: In a three-point test cross, which classes are the double crossovers?
A: The two rarest phenotype classes, since two independent crossovers are needed.
Q: A double crossover class is A b C and the parental class is A B C. Which gene is in the middle?
A: B, because it is the only gene that switched.
Q: Why must double crossovers be counted in both intervals?
A: A double crossover has a crossover in each interval, so it is a recombinant for each pair of neighbors, and leaving it out underestimates the distances.
Q: Distances of 12 and 8 map units are found for A to B and B to C. What is A to C?
A: 20 map units, if double crossovers are counted correctly.
Q: Observed doubles are 10 and expected are 10.8. What is interference?
A: Coincidence is 10/10.8, about 0.92, so interference is about 0.08.
:::

---
title: Probability That Two Carriers Have an Affected Child (Hardy-Weinberg)
description: Worked method for the classic question: a recessive disorder affects 1 in N births, two unrelated people pick each other, what is the chance of an affected child? Includes the full calculation.
product: 1c-heredity-evolution
published: 2026-11-04
related: hardy-weinberg-equation-practice-problems, recombination-frequency-gene-mapping-map-units
seo_title: Carrier Probability and Affected Child: Hardy-Weinberg Steps
seo_description: If a recessive disorder affects 1 in 650 births, what is the chance two unrelated people have an affected child? Full Hardy-Weinberg worked solution and quiz.
---

A common genetics question reads: *an autosomal recessive disorder affects 1 in 650 births; what is the probability that two unrelated people who choose each other as partners have an affected child?* The answer chains three steps: **allele frequency, carrier frequency, then Punnett probability**. Each step is a single line of arithmetic.

## The three steps

1. **q<sup>2</sup> is the disease frequency.** Here q<sup>2</sup> = 1/650, so q = the square root of 1/650, about 1/25.5, or roughly 0.0392.
2. **Carrier frequency is 2pq.** With p = 1 - q, about 0.9608, 2pq = 2 x 0.9608 x 0.0392, about 0.0753, or roughly 1 in 13.3.
3. **Combine.** For a child to be affected, both partners must be carriers, and then both must pass the allele.

## The full calculation

- Chance partner 1 is a carrier: about 0.0753.
- Chance partner 2 is a carrier: about 0.0753.
- Chance two carriers have an affected child: 1/4.
- Product: 0.0753 x 0.0753 x 0.25, about 0.00142, or roughly **1 in 705**.

Because answer choices are usually spread widely, this lands closest to the choice near **1/700** in a list such as 1/3,650, 1/78,500, 1/120 and 1/700.

## A shortcut check

For a rare recessive disease, p is close to 1, so carriers are about 2q. Then the probability is about (2q)(2q)(1/4) = q<sup>2</sup>, which is the same as the population frequency of 1/650. That makes sense: if people mate at random, a random child is affected with probability q<sup>2</sup>. The small difference from 1/650 comes from using p = 1 - q instead of p = 1. So the shortcut gives about 1/650, and the exact answer about 1/705. Both point to the same answer choice.

## When the question changes

- **Partners are not random (they are siblings or cousins).** The carrier probability for the second partner is no longer 2pq; use the pedigree relationship instead.
- **One partner is a known carrier.** Skip his term: chance = 2pq x 1/4.
- **One partner is unaffected with an affected sibling and unaffected parents.** That person is a carrier with probability 2/3, not 2pq.
- **Both are known carriers.** The answer is 1/4.

## Common traps

- **Taking q = 1/650.** That is q<sup>2</sup>. Take the square root first.
- **Using q instead of 2pq for carriers.** The carrier class is heterozygotes.
- **Forgetting the 1/4.** Two carriers do not always have an affected child.
- **Assuming Hardy-Weinberg when the question states otherwise.** Random mating, no selection and no migration are required.

## One-minute recap

- q<sup>2</sup> is disease frequency; q is its square root.
- Carrier frequency is 2pq, about 2q for rare alleles.
- Probability of an affected child from random partners is (2pq)(2pq)(1/4).

:::quiz
Q: A recessive disease affects 1 in 10,000. What is q?
A: q = 1/100 = 0.01.
Q: What is the carrier frequency when q = 0.01?
A: 2pq = 2 x 0.99 x 0.01, about 0.0198 (roughly 1 in 50).
Q: What is the chance two known carriers have an affected child?
A: 1/4.
Q: Why is the chance of an affected child to random partners about q squared?
A: (2q)(2q)(1/4) = q squared when p is near 1.
Q: What is the chance an unaffected person with an affected sibling and unaffected parents is a carrier?
A: 2/3.
:::

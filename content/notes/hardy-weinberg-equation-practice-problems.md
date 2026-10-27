---
title: Hardy-Weinberg Equation: How to Solve Every MCAT Problem Type
description: Solve Hardy-Weinberg problems from any starting point: recessive or dominant phenotypes, genotype counts, carriers, X-linked traits, and equilibrium tests.
seo_title: Hardy-Weinberg Practice Problems for the MCAT
seo_description: Free Hardy-Weinberg practice for the MCAT: solve recessive, carrier, genotype count and X-linked problems step by step, with a quiz.
product: 1c-heredity-evolution
published: 2026-10-20
related: lac-operon-regulation-lactose-glucose
---

The Hardy-Weinberg equations are **p + q = 1** for allele frequencies and **p<sup>2</sup> + 2pq + q<sup>2</sup> = 1** for genotype frequencies, where p is the frequency of one allele (usually the dominant one) and q is the frequency of the other. The single most useful move in any problem is to find **q<sup>2</sup>**, because the homozygous recessive class is the only genotype you can usually see directly from a phenotype. Take its square root, get q, then everything else follows.

## Where the equations come from

Picture every gamete in a population as a random draw from a big pool of alleles. If a fraction p of the pool carries allele A and a fraction q carries allele a, then two random draws give:

- AA with probability p &times; p = p<sup>2</sup>
- aa with probability q &times; q = q<sup>2</sup>
- Aa with probability 2pq, because a heterozygote can form two ways (A from the mother and a from the father, or the reverse)

Because the three outcomes cover every possibility, they add to 1. That is all the second equation says: it is (p + q)<sup>2</sup> expanded.

## The five conditions

The genotype frequencies above hold, and allele frequencies stay put generation after generation, only in an idealized population with:

1. No mutation
2. No migration (no gene flow)
3. No natural selection on the locus
4. Random mating with respect to the locus
5. A very large population, so chance (genetic drift) is negligible

No real population meets all five perfectly. That is the point. Hardy-Weinberg is a **null model**: it tells you what to expect if nothing is changing allele frequencies, so a measurable departure is evidence that something is. One useful nuance: inbreeding and assortative mating shift **genotype** frequencies (more homozygotes, fewer heterozygotes) without by themselves changing **allele** frequencies.

![Genotype frequencies across allele frequency, and carriers versus affected individuals for rare recessive alleles](assets/notes/hardy-weinberg-equation-practice-problems.png "Left: p squared, 2pq and q squared as q varies; heterozygotes peak at 0.5 when p = q = 0.5. Right: for a rare recessive allele, carriers outnumber affected people by roughly 2/q.")

## The method: always start from what you can see

| You are given | First step | Then |
|---|---|---|
| Frequency of the recessive phenotype | Set it equal to q<sup>2</sup> | q = &radic;(q<sup>2</sup>), p = 1 - q |
| Frequency of the dominant phenotype | Subtract from 1 to get q<sup>2</sup> | Same as above |
| Counts of all three genotypes | Count alleles directly | p = (2 &times; AA + Aa) / (2N) |
| Frequency of affected males (X-linked recessive) | That frequency is q | Affected females = q<sup>2</sup>, carrier females = 2pq |

The dominant phenotype is a trap because it lumps together two genotypes, p<sup>2</sup> + 2pq. You cannot square-root it to get p. Go through q<sup>2</sup> instead.

## Worked examples

### 1. Carrier frequency from a rare recessive disease

A recessive condition affects 1 in 10,000 people. How common are carriers?

1. q<sup>2</sup> = 1/10,000 = 0.0001
2. q = 0.01, so p = 0.99
3. Carriers = 2pq = 2 &times; 0.99 &times; 0.01 = 0.0198, about 2 percent or roughly 1 in 51

Compare the two numbers: about 198 carriers for every affected person. For rare alleles p is close to 1, so 2pq is about 2q, and the ratio of carriers to affected is about 2q/q<sup>2</sup> = 2/q. Most copies of a rare recessive allele hide in healthy heterozygotes, which is why selection against affected people removes such alleles very slowly.

### 2. Starting from a dominant phenotype

In a plant population, 84 percent of individuals show the dominant flower color. What fraction of the dominant-looking plants are heterozygous?

1. Recessive phenotype = 1 - 0.84 = 0.16 = q<sup>2</sup>
2. q = 0.4, p = 0.6
3. AA = p<sup>2</sup> = 0.36 and Aa = 2pq = 0.48 (check: 0.36 + 0.48 = 0.84)
4. Among dominant-looking plants: 0.48 / 0.84 = 0.571, so about 57 percent are heterozygous

Step 4 is a conditional probability. The question restricted the group to dominant-looking plants, so you divide by 0.84, not by 1.

### 3. Genotype counts and an equilibrium test

A sample of 500 animals has 300 AA, 150 Aa and 50 aa. Is the population in Hardy-Weinberg equilibrium?

1. Count alleles. There are 1,000 alleles in total. A alleles: 2 &times; 300 + 150 = 750, so p = 0.75 and q = 0.25.
2. Expected counts at equilibrium: AA = 0.75<sup>2</sup> &times; 500 = 281.25; Aa = 2 &times; 0.75 &times; 0.25 &times; 500 = 187.5; aa = 0.25<sup>2</sup> &times; 500 = 31.25.
3. Observed versus expected: too few heterozygotes (150 against 187.5) and too many of both homozygotes.
4. Chi-square = (300 - 281.25)<sup>2</sup>/281.25 + (150 - 187.5)<sup>2</sup>/187.5 + (50 - 31.25)<sup>2</sup>/31.25 = 1.25 + 7.5 + 11.25 = 20.0

With two alleles there is 1 degree of freedom (three genotype classes, minus one for the total, minus one for the allele frequency estimated from the data). The critical value at the 0.05 level is 3.84, and 20.0 is far above it, so the population is not in equilibrium. A heterozygote deficit like this points toward inbreeding, assortative mating, or a sample that mixes two populations with different allele frequencies.

Notice that you must calculate p from the counts, not from the aa class alone. Square-rooting 50/500 = 0.10 would give q = 0.316, which is wrong here precisely because the population is not at equilibrium.

### 4. An X-linked recessive trait

In a population, 1 in 20 males has an X-linked recessive trait.

1. Males have one X, so the male frequency is q itself: q = 0.05, p = 0.95.
2. Affected females need two copies: q<sup>2</sup> = 0.0025, or 1 in 400.
3. Carrier females: 2pq = 2 &times; 0.95 &times; 0.05 = 0.095, about 1 in 10.5.

This is why X-linked recessive traits show up far more in males: q versus q<sup>2</sup> is a twentyfold gap at q = 0.05.

### 5. Two unaffected parents

Using the disease from example 1 (q = 0.01), what is the chance that two unrelated, unaffected people have an affected child?

1. An unaffected person is AA or Aa. The chance they are a carrier, given that they are unaffected, is 2pq / (p<sup>2</sup> + 2pq), which simplifies to 2q/(1 + q) = 0.0198.
2. Both must be carriers: 0.0198<sup>2</sup>.
3. Two carriers have an affected child with probability 1/4.
4. Total: 0.0198<sup>2</sup> &times; 1/4 = 0.000098, about 1 in 10,200.

If a passage tells you one parent is a known carrier (for example, through a previous affected child), replace that parent's term with 1.

## Common traps

- **Square root gives q, not q<sup>2</sup>.** Read the question for which one it wants.
- **Do not square-root the dominant phenotype.** Convert to q<sup>2</sup> first.
- **The heterozygote term is 2pq, not pq.** The 2 counts both ways of forming Aa.
- **"Dominant" does not mean "common."** Allele frequency depends on history and selection, not on dominance. A dominant allele does not spread just because it is dominant.
- **Use allele counting when genotype counts are given.** Square-rooting the recessive class only works if you are told, or may assume, the population is at equilibrium.
- **X-linked males use q, females use q<sup>2</sup>.**
- **Unaffected is not the same as "random person."** For carrier risk in a person known to be unaffected, divide by p<sup>2</sup> + 2pq.

## One-minute recap

p + q = 1 and p<sup>2</sup> + 2pq + q<sup>2</sup> = 1. Equilibrium assumes no mutation, no migration, no selection, random mating and a large population, and serves as a null model for evolution. Start from q<sup>2</sup> (the recessive phenotype, or 1 minus the dominant phenotype), take the square root, then find p and 2pq. With genotype counts, count alleles. For X-linked recessive traits, affected males = q and affected females = q<sup>2</sup>. For rare alleles, carriers outnumber affected individuals by about 2/q.

:::quiz
Q: A recessive trait appears in 4 percent of a population at Hardy-Weinberg equilibrium. What fraction of the population is heterozygous?
A: q squared = 0.04, so q = 0.2 and p = 0.8. Heterozygotes are 2pq = 2 x 0.8 x 0.2 = 0.32, or 32 percent.
Q: In a sample of 200 people, 98 are MM, 84 are MN and 18 are NN. What is the frequency of the M allele?
A: Count alleles: (2 x 98 + 84) / 400 = 280/400 = 0.70. So p(M) = 0.70 and q(N) = 0.30.
Q: An X-linked recessive trait affects 1 in 50 males. About what fraction of females are affected?
A: q = 1/50 = 0.02, so affected females are q squared = 0.0004, or 1 in 2,500.
Q: Why can you not take the square root of the dominant phenotype frequency to find p?
A: The dominant phenotype includes both AA and Aa individuals, so its frequency is p squared + 2pq, not p squared. Subtract it from 1 to get q squared instead.
Q: An isolated island holds only 40 breeding lizards. Which Hardy-Weinberg condition does this population most clearly violate, and what force results?
A: It violates the large population condition, so genetic drift (random sampling change in allele frequencies) can shift allele frequencies from one generation to the next.
:::

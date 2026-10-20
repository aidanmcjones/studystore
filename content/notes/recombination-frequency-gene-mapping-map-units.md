---
title: Recombination Frequency and Gene Mapping: Map Units Explained
description: Calculate recombination frequency from a test cross, convert it to map units, order three linked genes, and see why distances cap at 50 percent.
product: 1c-heredity-evolution
published: 2026-10-20
related: hardy-weinberg-equation-practice-problems, mitosis-vs-meiosis-differences
---

Recombination frequency is the fraction of offspring that carry a new combination of alleles not seen in either parental chromosome. **Recombination frequency (percent) = recombinant offspring / total offspring &times; 100, and 1 percent recombination = 1 map unit = 1 centimorgan (cM).** Genes that are close together on a chromosome rarely have a crossover between them, so they recombine rarely; genes far apart recombine more often. The expected observed value never goes above 50 percent, which is what unlinked genes show.

## Why distance predicts recombination

During prophase I of meiosis, homologous chromosomes pair up (synapsis) and non-sister chromatids can exchange segments by **crossing over**. The points of exchange show up as chiasmata. A crossover that happens anywhere in the stretch between two genes swaps which alleles travel together.

The logic of mapping rests on one assumption: crossovers occur at roughly random positions. If so, a longer stretch of chromosome between two genes is a bigger target, and the chance of a crossover landing in that stretch rises with distance. Recombination frequency therefore works as a ruler, with one important limit covered below.

Two facts about a single crossover explain the 50 percent ceiling:

- A crossover involves only **two of the four chromatids** in a tetrad. Even if a crossover happens between two genes in every meiosis, half the resulting gametes are still parental.
- When two crossovers fall between the same two genes on the same pair of chromatids, the original alleles are put back together, so that gamete looks parental even though two exchanges happened. Averaged over all the ways multiple crossovers can involve the four chromatids, no more than half the gametes end up recombinant.

So as distance grows, observed recombination climbs toward 50 percent and flattens. At that point linked genes look exactly like genes on different chromosomes assorting independently.

![A genetic map of three linked genes from the worked example, and a curve showing observed recombination frequency flattening at 50 percent as true map distance grows](assets/notes/recombination-frequency-gene-mapping-map-units.png "Left: the map built from the three-point cross below. Right: under a simple model with no interference, observed recombination tracks distance for short intervals, then levels off at 50 percent.")

## How to set up a mapping cross

The standard tool is a **test cross**: cross an individual heterozygous at the genes of interest to an individual that is homozygous recessive at all of them. The tester contributes only recessive alleles, so each offspring's phenotype directly shows which alleles came in the gamete from the heterozygous parent. Phenotype counts become gamete counts.

Then:

1. **Find the parental classes.** They are the two most common offspring classes. They tell you which alleles were together on each chromosome in the heterozygote.
2. **Find the recombinant classes.** These are the less common classes, carrying new combinations.
3. **Divide recombinants by the total and multiply by 100.** That is the distance in cM.

The arrangement of alleles in the heterozygote matters. If both dominant alleles sit on one chromosome (AB/ab) the genes are in **coupling** (cis). If each chromosome carries one dominant and one recessive (Ab/aB) they are in **repulsion** (trans). You do not need to know the phase in advance: the most frequent offspring classes reveal it.

## Worked example 1: two genes

A heterozygous plant is test crossed to an aabb plant. The 1,000 offspring are:

| Offspring phenotype | Count |
|---|---|
| A B | 420 |
| a b | 410 |
| A b | 88 |
| a B | 82 |

1. The two big classes, A B and a b, are parental. So the heterozygote was AB/ab (coupling).
2. Recombinants: A b + a B = 88 + 82 = 170.
3. Recombination frequency = 170 / 1,000 = 0.17, or **17 percent**, so the genes are **17 cM apart**.

Sanity check: if the genes were unlinked, all four classes would be close to 250 each. Here the parental classes greatly outnumber the recombinants, which is the signature of linkage.

If the same counts had come out with A b and a B as the big classes, the heterozygote would have been in repulsion (Ab/aB), and A B plus a b would be the recombinants. The distance would still be 17 cM. Always decide which classes are parental from the counts, not from which alleles are dominant.

## Worked example 2: three genes and gene order

A fly heterozygous for three linked genes, P, Q and R, is test crossed to a pqr/pqr fly. The 1,000 offspring sort into eight classes. Here they are written in the order P, Q, R, which is not necessarily their order on the chromosome:

| Phenotype | Count | Class |
|---|---|---|
| P Q R | 355 | Parental |
| p q r | 345 | Parental |
| P q r | 62 | Single crossover |
| p Q R | 58 | Single crossover |
| P q R | 78 | Single crossover |
| p Q r | 82 | Single crossover |
| P Q r | 11 | Double crossover |
| p q R | 9 | Double crossover |

**Step 1: identify the classes.** The two largest (355 and 345) are parental: PQR and pqr. The two smallest (11 and 9) are double crossovers, because two crossovers at once are the least likely event, so they form the rarest classes.

**Step 2: find the middle gene.** Compare a double crossover with the parental class it most resembles. P Q r differs from P Q R only at R. A double crossover swaps just the middle gene relative to its neighbors, so **R is in the middle**. The order is P, R, Q.

**Step 3: rewrite the classes in the true order** if it helps you see each interval. For example, P q r becomes P r q (one crossover between P and R), and P q R becomes P R q (one crossover between R and Q).

**Step 4: distance P to R.** Count every class with a crossover in that interval. Those are the singles that switch P relative to R (62 + 58 = 120) plus the doubles (11 + 9 = 20), because each double includes a crossover in this interval.
(120 + 20) / 1,000 = 0.14, so **14 cM**.

**Step 5: distance R to Q.** Singles that switch R relative to Q (78 + 82 = 160) plus the doubles (20).
(160 + 20) / 1,000 = 0.18, so **18 cM**.

**Step 6: distance P to Q.** Add the intervals: 14 + 18 = **32 cM**.

Now look at what a two-gene analysis of P and Q alone would have given. Scoring only P and Q, the doubles look parental (P Q r and p q R still have P with Q and p with q). Only the 280 singles would count, for an observed frequency of 28 percent. That 4-point gap is exactly the double crossovers going uncounted, twice: each double hides two recombination events. This is why long distances are measured by adding short intervals.

### Interference (optional extension)

If crossovers in the two intervals were independent, the expected double crossover rate would be 0.14 &times; 0.18 = 0.0252, or about 25 of 1,000 offspring. Only 20 were observed.

- **Coefficient of coincidence** = observed doubles / expected doubles = 20 / 25.2 = about 0.79
- **Interference** = 1 minus the coefficient of coincidence = about 0.21

Positive interference means one crossover makes another nearby crossover less likely. An interference value of 0 would mean the two intervals behave independently.

## Common traps

- **Parental classes are the most common, not the dominant ones.** Read phase from the counts.
- **Include the double crossovers in each interval.** Each double has a crossover in both intervals, so it adds to both distances. Leaving them out underestimates both.
- **The middle gene is the one that switches.** Pair each double crossover class with the parental class it most resembles (they share two alleles) and find the single gene that differs.
- **The ceiling is 50 percent, not 100 percent.** A recombination frequency near 50 percent cannot tell you whether genes are on different chromosomes or simply far apart on the same one.
- **Map units are not base pairs.** Crossover rates vary along chromosomes and between the sexes, so 1 cM corresponds to different physical lengths in different regions. A map gives order and relative spacing, not exact physical distance.
- **Short intervals add more accurately than long ones.** Distances are close to additive for short intervals and drift low for long ones because of hidden double crossovers.
- **Crossing over happens between non-sister chromatids in prophase I.** Exchanges between sister chromatids swap identical copies and produce no recombinants.

## One-minute recap

Recombination frequency = recombinants / total &times; 100, and 1 percent equals 1 map unit (1 cM). Use a test cross so offspring phenotypes reveal the heterozygote's gametes. The most common classes are parental and show coupling or repulsion. In a three-point cross the rarest classes are double crossovers, and the one gene that differs between a double crossover class and the parental class it most resembles is the middle gene. Add the doubles into each interval, then add intervals to get long distances. Expected recombination cannot exceed 50 percent, because one crossover affects only two of four chromatids and some double crossovers restore parental combinations.

:::quiz
Q: A test cross gives 1,000 offspring, of which 46 + 54 have recombinant phenotypes. How far apart are the two genes?
A: Recombination frequency = 100 / 1,000 = 10 percent, so the genes are 10 map units (10 cM) apart.
Q: In a three-point test cross, the parental class is D E F and the rarest class is D e F. Which gene is in the middle?
A: E is in the middle. A double crossover swaps only the middle gene relative to the parental arrangement, and E is the only gene that differs.
Q: Why can observed recombination frequency between two genes never exceed 50 percent?
A: Each crossover involves only two of the four chromatids, so at most half the gametes are recombinant, and double crossovers between the same chromatids restore parental combinations, so even very distant genes give no more than about 50 percent recombinants.
Q: Genes A and B are 12 cM apart, and genes B and C are 9 cM apart, with B in the middle. If there is no interference, what fraction of test cross offspring should be double crossovers?
A: 0.12 x 0.09 = 0.0108, so about 1.1 percent of offspring are expected to be double crossovers.
Q: A heterozygote's test cross gives A b and a B as the two most common classes. What was the arrangement of alleles in the heterozygote?
A: Repulsion (trans), Ab/aB. The most common classes are parental, so A was on the same chromosome as b, and a was with B.
:::

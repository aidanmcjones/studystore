---
title: MCAT Population Genetics Practice Questions: Hardy-Weinberg, Drift and Selection
description: Ten free MCAT-style population genetics questions on Hardy-Weinberg calculations, equilibrium tests, genetic drift, founder effects, gene flow and modes of natural selection, with full explanations.
aamc: 1C
category: 1c-heredity-evolution
cluster: Hardy-Weinberg equilibrium, Hardy-Weinberg calculations, Genetic drift, bottleneck and founder effect, Gene flow, Natural selection modes: directional, stabilizing, disruptive
product: 1c-heredity-evolution
published: 2026-10-20
notes: hardy-weinberg-equation-practice-problems
---

Population genetics tracks allele frequencies rather than individuals. For a gene with two alleles, p + q = 1, and if the population is in Hardy-Weinberg equilibrium the genotype frequencies are p<sup>2</sup>, 2pq and q<sup>2</sup>. Equilibrium holds only when five conditions are met: a very large population, random mating, no mutation, no migration and no natural selection on that gene. Under those conditions allele and genotype frequencies stay constant from one generation to the next.

Each broken condition is a force of evolution. Genetic drift is random change in allele frequency, strongest in small populations; a bottleneck shrinks an existing population, and the founder effect occurs when a few individuals start a new one. Gene flow moves alleles between populations and makes them more alike. Natural selection can be directional (the mean shifts toward one extreme), stabilizing (the mean holds and variation shrinks) or disruptive (both extremes are favored and variation grows).

Traps: start Hardy-Weinberg problems from q<sup>2</sup>, never from the dominant phenotype. When given genotype counts, count alleles directly. Inbreeding changes genotype frequencies without changing allele frequencies by itself.

@@QUESTIONS

### Q1
In a meadow of 2,000 plants, flower color is controlled by one gene with two alleles, and white flowers are recessive. A survey counts 180 white-flowered plants. Assuming Hardy-Weinberg equilibrium, about how many plants in the meadow are heterozygous?
A) 180
B) 420
C) 840
D) 980
ANSWER: C
WHY: White plants are homozygous recessive, so q<sup>2</sup> = 180/2000 = 0.09, giving q = 0.3 and p = 0.7. Heterozygotes are 2pq = 2 x 0.7 x 0.3 = 0.42 of the population, or 0.42 x 2000 = 840 plants. The 980 choice is p<sup>2</sup> (homozygous dominant), and 420 forgets the factor of 2 in 2pq.

### Q2
Researchers genotype 1,000 beetles at a locus with alleles A and a.

| Genotype | Count |
|---|---|
| AA | 500 |
| Aa | 200 |
| aa | 300 |

What is the frequency of allele a, and does the sample fit Hardy-Weinberg expectations?
A) 0.40; no, there are far fewer heterozygotes than expected
B) 0.30; yes, because the genotype counts add to 1,000
C) 0.55; no, there are more heterozygotes than expected
D) 0.40; yes, because p and q add to 1
ANSWER: A
WHY: Counting alleles gives a = (2 x 300 + 200)/2000 = 800/2000 = 0.40, so A = 0.60. At equilibrium, heterozygotes should be 2 x 0.6 x 0.4 = 0.48, or 480 beetles, but only 200 are observed, a strong heterozygote deficit. That pattern suggests inbreeding or a mixed sample. Choices B and D treat bookkeeping that is always true as proof of equilibrium.

### Q3
An autosomal recessive metabolic disorder affects about 1 in 3,600 newborns in a large, randomly mating population. About what fraction of people are unaffected carriers of the disease allele?
A) 1 in 60
B) 1 in 120
C) 1 in 1,800
D) 1 in 30
ANSWER: D
WHY: Affected people are q<sup>2</sup> = 1/3600, so q = 1/60 and p = 59/60. Carriers are 2pq = 2 x (59/60) x (1/60), about 0.033, or roughly 1 in 30. The 1 in 60 choice is the allele frequency q, not the carrier frequency, and 1 in 120 forgets the factor of 2 for the two ways to be heterozygous.

### Q4
Two isolated populations of a snail species both start with a frequency of 0.5 for a neutral allele that affects shell banding. Population X has 15 breeding adults each generation and population Y has 15,000. After 50 generations, which outcome is most likely?
A) Both populations still have an allele frequency of exactly 0.5, because the allele is neutral
B) Population X is more likely than Y to have lost or fixed the allele
C) Population Y is more likely than X to have lost or fixed the allele
D) Both populations change by about the same amount, because they experience the same environment
ANSWER: B
WHY: Genetic drift is random sampling error between generations, and its size grows as population size shrinks. With only 15 breeders, chance swings are large and the allele can drift to 0 or 1 within tens of generations. Neutrality removes selection, not drift, so choice A is wrong, and drift does not depend on the environment.

### Q5
A volcanic island was settled about 300 years ago by roughly 30 people from a mainland population. A recessive allele that causes an unusual eye color has a frequency of 0.2 percent on the mainland and 5 percent on the island today. There is no evidence that the allele affects survival or reproduction. What best explains the difference?
A) Gene flow from the mainland to the island
B) Stabilizing selection on eye color
C) The founder effect
D) A high rate of new mutation on the island
ANSWER: C
WHY: A small group of settlers carries only a sample of the mainland gene pool, and by chance that sample can hold a rare allele at a much higher frequency. That is the founder effect, a form of genetic drift. Gene flow from the mainland would pull the island frequency toward 0.2 percent, not away from it, and selection is ruled out because the allele does not affect fitness.

### Q6
Biologists measure beak depth in four finch populations before and after a dry season.

| Population | Mean before (mm) | Mean after (mm) | Standard deviation before (mm) | Standard deviation after (mm) |
|---|---|---|---|---|
| 1 | 9.0 | 9.0 | 1.0 | 0.5 |
| 2 | 9.0 | 9.0 | 1.0 | 1.8 |
| 3 | 9.0 | 10.4 | 1.0 | 1.0 |
| 4 | 9.0 | 9.1 | 1.0 | 1.0 |

Which population most likely experienced disruptive selection?
A) Population 1
B) Population 2
C) Population 3
D) Population 4
ANSWER: B
WHY: Disruptive selection favors both extremes and removes intermediates, so the mean can stay put while variation increases, as in population 2 (standard deviation 1.0 to 1.8). Population 1 shows stabilizing selection, with the same mean and less variation. Population 3 shows directional selection, since the mean shifted. Population 4 shows little change.

### Q7
Wind regularly carries pollen between two meadows of the same wildflower species that were once genetically distinct. If this exchange continues for many generations, what is the most likely effect?
A) Mutation rates rise in both meadows
B) Allele frequencies in the two meadows diverge further
C) The two meadows become separate species
D) Allele frequencies in the two meadows become more similar
ANSWER: D
WHY: Pollen transfer is gene flow, which moves alleles between populations and homogenizes their allele frequencies over time. Ongoing gene flow works against divergence and speciation, so choices B and C are reversed. Gene flow introduces alleles that already exist in the other population; it does not change the mutation rate.

### Q8
In a population with allele frequencies p = q = 0.5 at birth, the aa genotype is lethal before reproductive age, while AA and Aa individuals survive and reproduce equally well. Assuming genotypes at birth are in Hardy-Weinberg proportions, what is the frequency of allele a among the adults who reproduce?
A) 0.33
B) 0.25
C) 0.50
D) 0.67
ANSWER: A
WHY: At birth the genotypes are 0.25 AA, 0.50 Aa and 0.25 aa. Removing aa leaves 0.75 of the population. Among survivors, a alleles come only from heterozygotes: (0.5 x 1/2)/0.75 = 0.25/0.75 = 1/3, about 0.33. The 0.25 choice forgets to renormalize to the survivors, and 0.67 is the frequency of allele A.

### Q9
A recessive X-linked trait appears in 8 percent of males in a large, randomly mating population at equilibrium. About what percentage of females would be expected to show the trait?
A) 0.64 percent
B) 4 percent
C) 8 percent
D) 16 percent
ANSWER: A
WHY: Males have one X chromosome, so the fraction of affected males equals the allele frequency: q = 0.08. Females need two copies, so affected females are q<sup>2</sup> = 0.0064, or 0.64 percent. The 8 percent choice treats females like males, and 16 percent doubles q, which approximates the frequency of carrier females, not affected ones.

### Q10
Each of the following, acting alone on a single gene, can change allele frequencies in a population EXCEPT:
A) Genetic drift in a small population
B) Migration of individuals from a population with different allele frequencies
C) Higher survival of one genotype than the others
D) Inbreeding, with no selection on the gene
ANSWER: D
WHY: Inbreeding raises the proportion of homozygotes and lowers heterozygotes, but it only rearranges existing alleles into different genotypes, so p and q stay the same. Drift changes frequencies by chance, migration adds or removes alleles through gene flow, and differential survival is natural selection, so all three can shift allele frequencies.

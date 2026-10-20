---
title: Mitosis vs Meiosis: Differences, Chromosome Counts and Errors
description: Compare mitosis and meiosis stage by stage, track chromosome, chromatid and DNA counts through each division, and see how nondisjunction causes aneuploidy.
product: 2c-cell-division-development
published: 2026-10-20
related: bacteria-vs-viruses-differences
---

Mitosis is one division that turns one cell into two genetically identical daughters with the same chromosome number as the parent. Meiosis is two divisions after a single round of DNA replication, turning one diploid cell into four haploid cells that are genetically different from the parent and from each other. Mitosis builds and repairs the body; meiosis makes gametes. Almost every exam question on the topic comes down to one thing: in which division do homologous chromosomes separate, and in which do sister chromatids separate?

## The differences at a glance

| Feature | Mitosis | Meiosis |
|---|---|---|
| Purpose | Growth, repair, asexual reproduction | Gametes for sexual reproduction |
| Where in humans | Somatic cells throughout the body | Testes and ovaries |
| DNA replication | Once, before the division | Once, before meiosis I only |
| Number of divisions | 1 | 2 |
| Products | 2 cells | 4 cells (in females, 1 egg plus polar bodies) |
| Ploidy of products | Same as parent (2n to 2n in humans) | Half of parent (2n to n) |
| Genetic identity | Identical to parent and each other | Different from parent and each other |
| Homologous pairing | None | Synapsis in prophase I, forming tetrads |
| Crossing over | Not a normal step | Yes, prophase I |
| What lines up at metaphase | Individual chromosomes | Homolog pairs (metaphase I), then individual chromosomes (metaphase II) |
| What separates at anaphase | Sister chromatids | Homologs (anaphase I), then sister chromatids (anaphase II) |

One useful way to hold this: meiosis II is basically a mitosis performed by a haploid cell. The unique part of meiosis is meiosis I, where the pairs of homologs find each other, swap segments, and get pulled apart.

## Homologs versus sister chromatids

The vocabulary is where most errors start, so pin it down first.

- **Sister chromatids** are the two identical copies of one chromosome made during S phase, held together by cohesin at the centromere. They are copies of each other, apart from rare replication errors.
- **Homologous chromosomes** are the two versions of a chromosome you inherited, one from each parent. They carry the same genes in the same order but can carry different alleles.

A memory hook: sisters are twins, so meiosis II, the second division, splits the twins. Meiosis I splits the parents' contributions, sending the maternal and paternal versions of each chromosome to different cells. That is why meiosis I is called **reductional** (it halves the chromosome number) and meiosis II is **equational** (chromosome number stays the same while chromatids separate).

## Walking through the stages

### Mitosis

Before mitosis, the cell copies its DNA in S phase. In prophase the chromatin condenses and the spindle starts to form. In prometaphase the nuclear envelope breaks down and kinetochore microtubules attach to each chromosome. In metaphase every chromosome sits on the metaphase plate, each sister attached to the opposite pole. In anaphase cohesin is cut and the sisters move apart. In telophase new nuclear envelopes form around each set, and cytokinesis splits the cytoplasm. Each daughter ends with the same chromosomes the parent started with.

### Meiosis I

Prophase I is long and is where meiosis earns its reputation. Homologous chromosomes pair along their length (synapsis), forming a **tetrad**, also called a bivalent: two homologs, four chromatids. Non-sister chromatids exchange segments at **chiasmata**, which is crossing over. At metaphase I the homolog pairs line up on the plate, and whether the maternal or paternal member faces a given pole is random for each pair. That is **independent assortment**. At anaphase I the homologs separate while sister chromatids stay joined. Each daughter cell is now haploid in chromosome number, but every chromosome still has two chromatids.

### Meiosis II

There is no S phase between the two divisions. Each haploid cell goes straight into meiosis II, which looks like a mitosis: chromosomes line up singly, cohesin at the centromeres is cut, and sister chromatids separate. Because of crossing over, the sisters are no longer identical, so even this step contributes to variety in the four products.

## Counting chromosomes, chromatids and DNA

Counting questions are simple once you use three separate counters:

- **Chromosomes:** count centromeres.
- **Chromatids:** count DNA double helices.
- **DNA content (C):** amount of DNA relative to one haploid set. A haploid gamete is 1C.

![Step plots of chromosome number and DNA content through mitosis and meiosis](assets/notes/mitosis-vs-meiosis-differences.png "Counts for a cell with 2n = 8. Replication doubles DNA content but not chromosome number. Mitotic anaphase briefly doubles the chromosome count. Meiosis I halves the chromosome count; meiosis II halves the DNA again.")

### Worked example: a fruit fly cell with 2n = 8

The fruit fly *Drosophila melanogaster* has 2n = 8, which keeps the arithmetic small.

| Stage | Chromosomes | Chromatids | DNA content |
|---|---|---|---|
| G1 | 8 | 8 | 2C |
| G2 (after S phase) | 8 | 16 | 4C |
| Mitotic metaphase | 8 | 16 | 4C |
| Mitotic anaphase (whole cell) | 16 | 16 | 4C |
| Each mitotic daughter | 8 | 8 | 2C |
| Each cell after meiosis I | 4 | 8 | 2C |
| Each cell after meiosis II | 4 | 4 | 1C |

The mitotic anaphase row is the classic trap. Once the sisters separate, each one has its own centromere and counts as a chromosome, so for a moment the cell holds 16. Nothing was copied; the counting rule simply changed what each piece is called.

For a human cell (2n = 46), scale the same pattern: 46 chromosomes and 92 chromatids in G2, 23 chromosomes with 46 chromatids after meiosis I, and 23 single-chromatid chromosomes in each gamete.

### Worked example: how much variety does independent assortment give?

Each homolog pair orients independently at metaphase I, with two possible orientations. With n pairs, one individual can make 2<sup>n</sup> chromosome combinations in its gametes before any crossing over.

- Fruit fly, n = 4: 2<sup>4</sup> = **16** combinations per parent, and 16 &times; 16 = **256** possible chromosome sets in a zygote.
- Human, n = 23: 2<sup>23</sup> = **8,388,608**, about 8.4 million per parent, and about 7 &times; 10<sup>13</sup> zygote combinations from two parents.

Crossing over multiplies this further, since it creates chromosomes that neither parent carried.

## When it goes wrong: nondisjunction

**Nondisjunction** is a failure of chromosomes to separate. The stage where it happens changes how many gametes are affected, which makes it a favorite reasoning question.

| Error in | What fails to separate | Gametes affected | Result |
|---|---|---|---|
| Meiosis I | A homolog pair | All 4 | 2 gametes with an extra chromosome (n + 1), 2 missing one (n - 1) |
| Meiosis II | Sister chromatids in one of the two cells | 2 of 4 | 1 gamete n + 1, 1 gamete n - 1, 2 normal |

A further clue separates them. After a meiosis I error, the n + 1 gamete carries both homologs, the one inherited from each parent (apart from segments swapped by crossing over). After a meiosis II error, it carries two copies of the same sister chromatid, which are identical apart from any crossover exchange. Fertilization of an n + 1 gamete gives a trisomy; trisomy 21 is the best-known example in humans. Nondisjunction in mitosis is also possible, but it affects only the descendants of that one cell, producing a mosaic rather than a whole-body aneuploidy.

## Common traps

- **Pairing homologs in mitosis.** Homologs do not synapse in normal mitosis. Pairing, tetrads and crossing over belong to prophase I.
- **Thinking DNA is copied before meiosis II.** It is copied once, before meiosis I. Skipping a second S phase is how meiosis halves the DNA twice.
- **Calling a cell diploid after meiosis I because it has two chromatids per chromosome.** Ploidy follows chromosome sets, not chromatids. After meiosis I a human cell has 23 chromosomes, so it is haploid.
- **Assuming S phase doubles chromosome number.** S phase doubles chromatids and DNA content. Chromosome number stays at 46 in a human cell.
- **Believing mitosis requires a diploid cell.** Mitosis keeps whatever ploidy the cell has. Haploid cells, for example in many fungi and in plant gametophytes, divide by mitosis.
- **Counting four equal products in oogenesis.** Meiosis in females gives one large egg and smaller polar bodies, because cytokinesis is unequal.

## One-minute recap

Mitosis: one division, two identical daughters, same ploidy, sisters separate at anaphase. Meiosis: one replication, two divisions, four different haploid cells. Meiosis I separates homologs (reductional) after synapsis, crossing over and independent assortment. Meiosis II separates sister chromatids (equational) and looks like mitosis. Count chromosomes by centromeres, chromatids by DNA molecules, and DNA content in C units. Nondisjunction in meiosis I affects all four gametes; in meiosis II, two of four.

:::quiz
Q: In which division do homologous chromosomes separate, and in which do sister chromatids separate?
A: Homologs separate in anaphase I of meiosis. Sister chromatids separate in anaphase of mitosis and in anaphase II of meiosis.
Q: A cell from an organism with 2n = 12 has just completed meiosis I. How many chromosomes and chromatids does it contain?
A: 6 chromosomes and 12 chromatids. Meiosis I halves the chromosome number, but each chromosome still has two sister chromatids until meiosis II.
Q: How many chromosomes are in a human cell during mitotic anaphase, before cytokinesis?
A: 92. Once sister chromatids separate, each one has its own centromere and counts as a separate chromosome.
Q: Nondisjunction occurs in meiosis II in one of the two cells. What fraction of the resulting gametes have an abnormal chromosome number?
A: Half. One gamete gets an extra chromosome, one is missing it, and the two gametes from the other meiosis II cell are normal.
Q: Ignoring crossing over, how many chromosome combinations can independent assortment produce in the gametes of an organism with 2n = 10?
A: 32. With n = 5 homolog pairs, each orienting two ways at metaphase I, there are 2 to the 5th power, or 32, combinations.
:::

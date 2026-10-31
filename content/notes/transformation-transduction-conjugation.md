---
title: Transformation vs Transduction vs Conjugation in Bacteria
description: How transformation, transduction and conjugation move DNA between bacteria, how to tell them apart in an experiment, and the traps that cost points.
product: 2b-prokaryotes-viruses
published: 2026-10-31
related: bacteria-vs-viruses-differences, mitosis-vs-meiosis-differences
---

Transformation, transduction and conjugation are the three classic ways a bacterium gains DNA from outside itself. The quickest way to separate them is to ask how the DNA travels: in transformation it is naked DNA picked up from the surroundings, in transduction it rides inside a bacteriophage, and in conjugation it passes directly from a living donor cell through a physical connection. None of the three makes a new cell. They are forms of horizontal gene transfer, which is why bacteria can share traits such as antibiotic resistance without dividing.

## The three routes at a glance

| Feature | Transformation | Transduction | Conjugation |
|---|---|---|---|
| Source of DNA | Free DNA in the environment | A previous host cell | A living donor cell |
| Carrier | None | Bacteriophage | Sex pilus and mating bridge |
| Cell to cell contact | Not needed | Not needed | Required |
| Destroyed by added DNase | Yes | No, DNA is inside the capsid | No, DNA stays protected between cells |
| Typical DNA moved | Chromosome fragments or plasmids | A fragment that fits in a phage head | A plasmid, sometimes chromosomal genes |

![Three columns comparing the DNA source, carrier, contact requirement and DNase sensitivity of transformation, transduction and conjugation](assets/notes/transformation-transduction-conjugation.png "Ask how the DNA travels and the mechanism follows")

## Transformation: DNA taken up from the surroundings

When a bacterium dies and lyses, pieces of its DNA are released. A cell that is **competent**, meaning able to bind and import DNA, can take some of that DNA in. Some species become competent naturally under certain conditions; others, such as the E. coli used in labs, are made competent artificially with calcium chloride and a heat shock or with a brief electric pulse (electroporation). That artificial version is how plasmids are put into bacteria in cloning work.

Imported DNA has two possible fates. A plasmid that carries its own origin of replication can be copied and kept. A chromosome fragment must be built into the recipient chromosome by homologous recombination; otherwise it is degraded and the cell gains nothing lasting.

Historically, transformation is the process behind Griffith's pneumococcus experiment in 1928, in which a harmless strain became virulent after exposure to heat-killed virulent cells. In 1944 Avery, MacLeod and McCarty showed that the transforming material was DNA, because destroying the DNA, and not the protein or RNA, blocked the effect.

## Transduction: DNA carried by a virus

A bacteriophage normally packages its own genome. Sometimes it packages bacterial DNA instead, and when that particle infects the next cell it delivers a piece of the old host's genome. There are two forms.

- **Generalized transduction.** During the lytic cycle the host chromosome is broken into pieces, and occasionally a host fragment is packed into a phage head by mistake. Any gene can be moved this way, one fragment at a time.
- **Specialized transduction.** A temperate phage that has integrated at a fixed site (a prophage) sometimes cuts itself out imprecisely and takes neighboring host genes with it. Only genes next to the integration site can be moved.

Because the DNA is enclosed in a protein capsid, DNase added to the medium does not stop transduction. Donor and recipient never need to touch.

## Conjugation: DNA passed from a donor through contact

Conjugation is the closest thing bacteria have to mating, although no gametes form and no new cell results. A donor cell carries a fertility plasmid, the F plasmid, and is called F+. The F plasmid encodes a sex pilus that attaches to a recipient (F&minus;) cell and pulls the two together. One strand of the plasmid is nicked and threaded into the recipient while each cell builds the complementary strand. When transfer finishes, both cells are F+.

Two variations show up often:

- **Hfr cells.** If the F plasmid integrates into the chromosome, the cell is called Hfr (high frequency of recombination). It starts transferring at the F origin and drags chromosomal genes along in a fixed order. The connection usually breaks before the whole chromosome passes, so the recipient gains donor genes but generally stays F&minus;.
- **R plasmids.** Many plasmids that carry antibiotic resistance genes can transfer themselves by conjugation, which helps resistance spread through a population, sometimes across species.

## Worked example: mapping genes by interrupted mating

An Hfr strain is mixed with an F&minus; strain, and samples are taken out and shaken apart at set times to break the connections. Recipients are then tested for three donor genes (the times below are illustrative).

| Gene | First minute it appears in recipients |
|---|---|
| tonA | 6 |
| lac | 14 |
| gal | 25 |

Genes enter in order of their distance from the F origin, so the order is tonA, lac, gal. The map distance between lac and gal is 25 &minus; 14 = 11 minutes, and between tonA and gal it is 25 &minus; 6 = 19 minutes. If shaking at 10 minutes, a recipient could carry tonA but not lac. This is the logic behind time-of-entry maps: distance is measured in minutes of transfer, not in base pairs.

## How to tell them apart in an experiment

Two simple tests settle most data questions.

1. **Add DNase to the medium.** If gene transfer stops, the DNA was naked, so the route is transformation. If it continues, the route is transduction or conjugation.
2. **Separate the strains with a filter** whose pores pass fluid and phages but not whole cells (the U-tube design). If transfer stops, cell contact was needed, so the route is conjugation. If it continues and DNase has no effect, a phage is carrying the DNA: transduction.

## Common traps

- **Calling conjugation reproduction.** No new cell is produced. Binary fission is how bacteria reproduce; all three routes here only change the genes of an existing cell.
- **Assuming the Hfr recipient becomes F+.** In an F+ by F&minus; cross the recipient becomes F+. In an Hfr cross it usually does not, because the last part of the F sequence would be transferred only at the very end.
- **Thinking DNase blocks transduction.** The capsid protects the DNA. DNase only rules out transformation.
- **Mixing up the phage forms.** Generalized transduction moves any gene and comes from lytic packaging errors; specialized transduction moves only genes beside the prophage site and comes from faulty prophage excision.
- **Forgetting recombination.** A chromosome fragment brought in by transformation or transduction is only kept if it recombines into the chromosome.

## One-minute recap

- Transformation: naked DNA, needs a competent recipient, blocked by DNase.
- Transduction: a phage delivers host DNA, resistant to DNase, no contact needed; generalized versus specialized.
- Conjugation: direct transfer through a sex pilus from an F+ or Hfr donor; contact required.
- All three are horizontal gene transfer and all three can spread antibiotic resistance.

The [2B Prokaryotes, Viruses and Microbial Genetics pack](https://buy.polar.sh/polar_cl_IARNm19EeApd4tfhkPt63AtU0yOe6ao3t9GyQ3jBufw) adds flashcards and practice questions on bacterial genetics, plasmids and viral life cycles, or start with the [free sampler](/#sampler).

:::quiz
Q: Gene transfer between two strains continues when DNase is added but stops when a filter keeps the cells apart. Which mechanism is it?
A: Conjugation. DNase resistance rules out transformation, and the need for contact rules out transduction, which phages can carry through the filter.
Q: Which form of transduction can move any gene of the host?
A: Generalized transduction, because a lytic phage packages random host fragments by mistake; specialized transduction moves only genes beside the prophage site.
Q: After an F+ by F&minus; conjugation, what is the F status of the recipient?
A: It becomes F+, since the whole F plasmid is transferred and the complementary strand is made in both cells.
Q: In an interrupted mating, gene X enters at 8 minutes and gene Y at 20 minutes. What is the map distance between them?
A: 12 minutes, because time-of-entry maps measure distance as minutes of transfer from the Hfr origin.
Q: Why must a chromosome fragment taken up by transformation undergo homologous recombination?
A: A linear fragment usually lacks a working origin and is broken down by nucleases, so it is lost unless it is built into the recipient chromosome.
:::

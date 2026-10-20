---
title: Bacteria vs Viruses: Structure, Replication and Treatment
description: Learn how bacteria and viruses differ in size, structure, genome, replication and drug targets, why antibiotics fail on viruses, and the exceptions that test you.
product: 2b-prokaryotes-viruses
published: 2026-10-20
related: mitosis-vs-meiosis-differences, passive-vs-active-transport
---

Bacteria are cells: single-celled prokaryotes with their own membrane, ribosomes and metabolism, able to grow and divide on their own by binary fission. Viruses are not cells: they are a nucleic acid genome wrapped in a protein coat, with no ribosomes and no metabolism, and they can only be copied inside a living host cell. Nearly every practical difference, from size to how each is treated, follows from that one split. Antibiotics work by hitting machinery that bacteria have and human cells lack, and a virus has none of that machinery of its own.

## The differences at a glance

| Feature | Bacteria | Viruses |
|---|---|---|
| Cell? | Yes, prokaryotic cell | No, a particle (virion) |
| Typical size | About 1 to 5 &micro;m | About 20 to 300 nm |
| Outer layers | Plasma membrane, usually a peptidoglycan wall, sometimes a capsule | Protein capsid, sometimes a lipid envelope taken from a host membrane |
| Genome | Double-stranded DNA: one circular chromosome, often plasmids too | DNA or RNA (never both), single or double stranded, linear, circular or segmented |
| Ribosomes | Yes, 70S | None |
| Metabolism | Own ATP production and biosynthesis | None; uses the host's |
| Reproduction | Binary fission, one cell into two | Assembly from parts made inside a host cell |
| Grows on lab media? | Most species, yes | No; needs living cells |
| Treated with | Antibiotics | Antivirals aimed at viral enzymes or steps; prevented by vaccines |

## Structure: a cell versus a package

A bacterium has everything a cell needs. Its single circular chromosome sits in the nucleoid with no nuclear envelope around it, so ribosomes can begin translating an mRNA while it is still being made. Its 70S ribosomes (built from 30S and 50S subunits) differ from our 80S ribosomes. Its plasma membrane does double duty: it holds the electron transport chain and ATP synthase, the jobs mitochondria do in our cells. Outside the membrane, most bacteria have a peptidoglycan wall. Gram-positive species have a thick wall; Gram-negative species have a thin wall plus an outer membrane whose lipopolysaccharide contains the endotoxin lipid A.

A virus is much simpler. A **virion** is a genome inside a protein **capsid**, which may be helical, icosahedral, or more complex, as in the tailed phages that infect bacteria. Some viruses add an **envelope**: a lipid membrane they pick up when budding out of a host cell, studded with viral glycoproteins that bind host receptors. The envelope matters in practice. Because it is lipid, soap and alcohol destroy it, so enveloped viruses are relatively fragile. Naked (non-enveloped) viruses tend to survive longer on surfaces and in the environment.

![Size ranges of viruses, bacteria and eukaryotic cells on a log scale, beside a feature checklist](assets/notes/bacteria-vs-viruses-differences.png "Left: typical size ranges on a logarithmic axis, with the approximate resolution limit of a light microscope. Right: which cellular features each group has.")

## Genomes: how much variety is allowed

Bacterial genomes all follow the same rule as ours: double-stranded DNA is copied by DNA polymerase, transcribed into RNA and translated on ribosomes. Extra genes can travel on plasmids and move between cells by transformation, conjugation or transduction.

Viral genomes break that uniformity. A virus may carry single-stranded or double-stranded DNA, or RNA of either strand sense. The Baltimore scheme groups viruses by how they get to mRNA:

- A **positive-sense RNA** genome already reads like mRNA and can be translated as soon as it enters the cell.
- A **negative-sense RNA** genome is the complement of mRNA, so the virion must bring its own RNA-dependent RNA polymerase to copy it into readable form.
- A **retrovirus** such as HIV carries reverse transcriptase, makes a DNA copy of its RNA genome, and integrates that DNA into a host chromosome.

The host cell will not copy an RNA genome into RNA, or an RNA genome into DNA, for the virus, which is exactly why these viruses carry their own enzymes, and why those viral enzymes make good drug targets.

## Replication: division versus assembly

Bacteria reproduce by **binary fission**. The chromosome is copied from a single origin, the cell elongates, and a ring of FtsZ protein (a relative of tubulin) pinches it into two identical daughters. There is no spindle and no mitosis, which is one reason the [mitosis vs meiosis note](mitosis-vs-meiosis-differences.html) applies only to eukaryotes. Population growth is a doubling series: N = N<sub>0</sub> &times; 2<sup>n</sup>, where n is the number of generations.

Viruses do not divide. A virion attaches to a specific host receptor, gets its genome inside, and hijacks the host's ribosomes, nucleotides and energy to make viral parts. The parts then self-assemble into many new virions, which leave by lysing the cell or by budding. Receptor matching explains **host range**: a virus can only infect cells displaying the receptor its attachment proteins recognize. HIV, for instance, binds CD4 on helper T cells.

Bacteriophages show the two classic strategies. In the **lytic cycle** the phage makes new virions and bursts the cell. In the **lysogenic cycle** a temperate phage inserts its genome into the bacterial chromosome as a prophage and is copied along with it at every division, until stress such as UV light triggers induction into the lytic cycle.

## Worked examples

### Example 1: why you need an electron microscope

A rod-shaped bacterium is 2 &micro;m long, and a spherical virus is 100 nm across. Convert to the same unit: 2 &micro;m = 2000 nm. So 2000 / 100 = **20 virions** would fit end to end along the bacterium. A light microscope can resolve objects down to roughly 200 nm, so the bacterium is easily visible, while the virus sits below the limit and needs an electron microscope.

### Example 2: two kinds of growth curve

A bacterium with a 30 minute generation time starts dividing in fresh medium. After 4 hours, n = 240 / 30 = 8 generations, so one cell becomes 2<sup>8</sup> = **256 cells**, rising smoothly by doubling.

Now take a virus that, for the sake of the example, releases 100 new virions from each infected cell. If every new virion infects a fresh cell, one virion gives 100 after one round and 100 &times; 100 = **10,000** after two. Viral numbers rise in steps rather than smoothly: during the early part of an infection, no complete virions can be found inside the cell at all, because the parts have not been assembled yet. Then a burst releases many at once. Real burst sizes vary widely by virus and host, so treat 100 as an illustration, not a constant.

### Example 3: matching a drug to a target

A patient has a viral throat infection and asks for penicillin. Penicillin blocks the transpeptidases that cross-link peptidoglycan. A virus has no peptidoglycan, no wall and no transpeptidase, so the drug has nothing to act on. Compare drugs that do work on viruses: AZT blocks HIV reverse transcriptase, oseltamivir blocks influenza neuraminidase so new virions cannot be released, and acyclovir is activated by a herpesvirus thymidine kinase. Each targets something the virus brings that the host lacks, the same selective-toxicity principle antibiotics use against bacteria.

## Exceptions that make good questions

- **Some bacteria are also obligate intracellular.** *Chlamydia* and *Rickettsia* grow only inside host cells, yet they are still bacteria: they have ribosomes, membranes and their own metabolic enzymes.
- **Some bacteria have no wall.** *Mycoplasma* lacks peptidoglycan, so beta-lactams such as penicillin do nothing to it, but it is still a cell.
- **Some viruses are huge.** Giant viruses such as mimivirus have particles several hundred nanometers across, larger than the smallest bacteria. Size alone does not define a virus.
- **Some infectious agents are even simpler than viruses.** Prions are misfolded proteins with no nucleic acid. Viroids are small naked circular RNAs that infect plants and have no capsid.
- **Viruses infect bacteria too.** Bacteriophages are viruses whose hosts are bacteria, and lysogenic conversion can give a bacterium new genes, including toxin genes, as with diphtheria and cholera toxins.

## Common traps

- **Treating viruses with antibiotics.** Antibiotics target bacterial walls, ribosomes and enzymes. Viruses have none of these of their own.
- **Calling a virus a prokaryote.** Prokaryote describes a type of cell. Viruses are not cells at all.
- **Assuming all viruses carry DNA.** Many carry RNA, and a few RNA viruses integrate DNA copies through reverse transcription.
- **Saying viruses have a genome of both DNA and RNA.** A virion carries one kind of nucleic acid, never both.
- **Mixing up envelope and wall.** A viral envelope is a lipid membrane borrowed from the host. A bacterial wall is peptidoglycan made by the bacterium.
- **Thinking binary fission is mitosis.** Fission uses no spindle and no condensed chromosomes.

## One-minute recap

Bacteria: prokaryotic cells, about 1 to 5 &micro;m, dsDNA circular chromosome plus plasmids, 70S ribosomes, own metabolism, usually a peptidoglycan wall, divide by binary fission, killed by antibiotics. Viruses: non-cellular particles, about 20 to 300 nm, DNA or RNA genome in a capsid, sometimes an envelope, no ribosomes or metabolism, copied only inside host cells, treated with antivirals that hit viral enzymes and prevented by vaccines. Watch the exceptions: intracellular bacteria, wall-less *Mycoplasma*, giant viruses, prions and viroids.

:::quiz
Q: Why does penicillin have no effect on an influenza infection?
A: Penicillin blocks the transpeptidases that cross-link bacterial peptidoglycan. Influenza is a virus with no cell wall and no transpeptidase, so the drug has no target.
Q: A pathogen grows only inside host cells, but it has 70S ribosomes and its own metabolic enzymes. Is it a bacterium or a virus?
A: A bacterium, such as Chlamydia. Ribosomes and metabolism mark it as a cell; viruses have neither, even though both groups can be obligate intracellular.
Q: Why must a negative-sense RNA virus carry its own RNA-dependent RNA polymerase inside the virion?
A: Its genome cannot be translated directly, and host cells do not supply an enzyme that copies RNA from an RNA template, so the virus must bring one to make readable mRNA.
Q: Hand sanitizer containing alcohol inactivates which kind of virus more easily, enveloped or naked, and why?
A: Enveloped viruses. Their outer envelope is a lipid membrane, which alcohol and detergents disrupt, while naked viruses have only a protein capsid.
Q: A bacterium has a 20 minute generation time. Starting from one cell, how many cells are present after 2 hours of steady growth?
A: 64 cells. Two hours is 120 / 20 = 6 generations, and 2 to the 6th power is 64.
:::

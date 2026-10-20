---
title: MCAT Bacteria, Gene Transfer and Viral Life Cycles Practice Questions
description: Nine free MCAT-style microbiology practice questions on Gram stains, bacterial growth curves, transformation, conjugation, transduction, lytic and lysogenic cycles and retroviruses, with full explanations.
aamc: 2B
category: 2b-prokaryotes-viruses
cluster: Prokaryote cell structure, Gram stain and cell walls, bacterial growth curve, binary fission, transformation, conjugation and F factor, transduction, virus structure and classification, lytic and lysogenic cycles, retroviruses
product: 2b-prokaryotes-viruses
published: 2026-10-20
notes:
---

Bacteria are prokaryotes: no nucleus or membrane-bound organelles, a circular chromosome in the nucleoid, 70S ribosomes, and often extra plasmids. Gram-positive cells have a thick peptidoglycan wall with teichoic acids that holds the crystal violet stain. Gram-negative cells have a thin wall plus an outer membrane carrying lipopolysaccharide, so they lose the violet stain and pick up the pink counterstain. Bacteria divide by binary fission, and a culture moves through lag, exponential (log), stationary and death phases. In log phase the count doubles once per generation time, so N = N0 x 2^n.

Bacteria swap genes without sex. Transformation is uptake of naked DNA from the environment, conjugation moves DNA through a pilus from an F+ or Hfr donor, and transduction uses a bacteriophage as the carrier. Viruses are obligate parasites with a DNA or RNA genome in a capsid, sometimes inside an envelope. Lytic phages replicate and burst the cell; temperate phages can instead integrate as a prophage and be copied with the host chromosome until induced. Retroviruses such as HIV copy their RNA into DNA with reverse transcriptase and integrate it.

Traps: DNase blocks transformation but not conjugation or transduction, and negative-sense RNA viruses must bring their own RNA polymerase.

@@QUESTIONS

### Q1
A bacterial culture in exponential phase has a generation time of 20 minutes. If the culture contains 1000 cells now, how many cells are expected after 2 hours, assuming it stays in exponential phase?
A) 6000
B) 12,000
C) 128,000
D) 64,000
ANSWER: D
WHY: Two hours is 120 minutes, which is 120 / 20 = 6 generations. Each generation doubles the population, so the count is 1000 x 2^6 = 64,000. The value 6000 adds 1000 cells per generation instead of doubling, and 128,000 counts seven generations.

### Q2
Viable counts in a bacterial culture were recorded each hour after inoculation into fresh medium.

| Time (h) | log10 of cells per mL |
|---|---|
| 0 | 5.0 |
| 1 | 5.0 |
| 2 | 5.6 |
| 3 | 6.2 |
| 4 | 6.8 |
| 5 | 7.4 |
| 6 | 7.6 |
| 7 | 7.6 |

What is the approximate generation time during the exponential phase?
A) 30 minutes
B) 15 minutes
C) 60 minutes
D) 100 minutes
ANSWER: A
WHY: From 2 to 5 hours the log10 count rises by 0.6 each hour, so the population grows by a factor of 10^0.6, about 4, every hour. A fourfold increase is two doublings, so each doubling takes about 30 minutes. The flat values from 0 to 1 hour are the lag phase and the plateau after 6 hours is the stationary phase, so neither should be used.

### Q3
Which structure is found in Gram-negative bacteria but not in Gram-positive bacteria?
A) A plasma membrane
B) An outer membrane containing lipopolysaccharide
C) Teichoic acids in a thick peptidoglycan layer
D) 70S ribosomes
ANSWER: B
WHY: Gram-negative cells have a thin peptidoglycan layer surrounded by an outer membrane whose outer leaflet contains lipopolysaccharide, the endotoxin that can trigger septic shock. Teichoic acids within a thick peptidoglycan wall are features of Gram-positive cells. Both groups have a plasma membrane and 70S ribosomes.

### Q4
Two bacterial strains are placed on opposite sides of a filter whose pores block bacterial cells but let much smaller particles pass. A gene from the donor strain still appears in the recipient strain, and adding DNase to the medium does not prevent the transfer. Which mechanism is most likely?
A) Transformation
B) Conjugation
C) Transduction
D) Binary fission
ANSWER: C
WHY: The filter stops cell to cell contact, which rules out conjugation through a pilus. DNase would destroy free DNA, so resistance to DNase rules out transformation. A phage can carry a fragment of donor DNA inside its capsid, protected from DNase, and pass through the filter, which is transduction. Binary fission is cell division, not gene transfer between strains.

### Q5
An Hfr strain of E. coli is mated with an F- strain, and mating is interrupted after a short time. Which outcome is most likely for the recipient?
A) It receives some donor chromosomal genes but remains F-
B) It becomes F+ because it receives the complete F plasmid
C) It becomes an Hfr strain
D) It receives no DNA because Hfr cells cannot form a pilus
ANSWER: A
WHY: In an Hfr cell the F factor is integrated into the chromosome, so transfer starts partway into the F sequence, drags chromosomal genes behind it, and almost never finishes before mating breaks off. The recipient gains donor chromosomal genes but rarely the rest of the F factor, so it stays F-. An F+ donor, by contrast, transfers the whole small plasmid and converts the recipient.

### Q6
Which statement correctly describes a temperate bacteriophage in the lysogenic state?
A) It immediately lyses the host cell to release new phages
B) It requires reverse transcriptase to copy its genome
C) Its genome, as a prophage, is replicated along with the host chromosome at each cell division
D) It can never switch to the lytic cycle once integrated
ANSWER: C
WHY: In lysogeny the phage genome integrates into the bacterial chromosome as a prophage and is copied passively whenever the host divides, without making new virions. Stress such as DNA damage from UV light can induce the prophage to excise and enter the lytic cycle, so the switch is not permanent. Lysis belongs to the lytic cycle, and reverse transcriptase is a feature of retroviruses.

### Q7
Which virus must package its own RNA-dependent RNA polymerase inside the virion in order to begin an infection?
A) A positive-sense single-stranded RNA virus
B) A double-stranded DNA virus that replicates in the host nucleus
C) A retrovirus
D) A negative-sense single-stranded RNA virus
ANSWER: D
WHY: A negative-sense genome is complementary to mRNA, and host cells have no enzyme that copies RNA into RNA, so the virus must bring its own RNA-dependent RNA polymerase to make mRNA. A positive-sense genome can be translated directly to make the polymerase. DNA viruses in the nucleus use host RNA polymerase, and retroviruses carry reverse transcriptase, an RNA-dependent DNA polymerase.

### Q8
A drug that inhibits reverse transcriptase would most directly block which step of an HIV infection?
A) Attachment of the virus to CD4 on the host cell
B) Synthesis of a DNA copy of the viral RNA genome
C) Translation of viral mRNA by host ribosomes
D) Budding of new virions from the plasma membrane
ANSWER: B
WHY: Reverse transcriptase uses the viral RNA genome as a template to make DNA, which integrase then inserts into the host genome. Blocking it stops infection before integration. Attachment depends on envelope glycoproteins binding CD4, translation uses host ribosomes, and budding is a late assembly step, none of which require reverse transcriptase.

### Q9
Each of the following is typically found in a bacterial cell EXCEPT:
A) Plasmids
B) A circular chromosome in the nucleoid
C) Mitochondria
D) 70S ribosomes
ANSWER: C
WHY: Bacteria lack membrane-bound organelles, so they have no mitochondria; electron transport and ATP synthesis occur on the plasma membrane instead. Plasmids, a circular chromosome in the nucleoid region, and 70S ribosomes are standard prokaryotic features, and the 70S ribosome is the target of several antibiotics.

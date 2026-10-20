---
title: MCAT Gene Regulation, PCR and Molecular Techniques Practice Questions
description: Eight free MCAT-style practice questions on the lac operon, epigenetics, PCR, blotting, Sanger sequencing, restriction enzymes and CRISPR, with calculations and full explanations.
aamc: 1B
category: 1b-dna-gene-expression
cluster: Operon regulation, epigenetics, PCR, restriction enzymes, blotting, sequencing, CRISPR
product: 1b-dna-gene-expression
published: 2026-10-20
notes:
---

Gene regulation questions ask which factor sits where. In the lac operon the repressor blocks transcription by binding the operator; allolactose releases it, and the cAMP-CAP complex boosts transcription when glucose is low. In eukaryotes, DNA methylation at promoter CpG islands and histone deacetylation compact chromatin and silence genes, while histone acetylation and open euchromatin favor expression.

Laboratory methods are tested by their logic. PCR doubles a target each cycle (denature near 95 degrees C, anneal primers, extend at about 72 degrees C with a heat-stable polymerase). Southern blots detect DNA, Northern blots RNA and Western blots protein with antibodies. Sanger sequencing uses dideoxynucleotides that lack a 3' hydroxyl and terminate the chain. Restriction enzymes cut palindromic sites, and CRISPR-Cas9 makes a targeted double-strand break guided by an RNA.

Traps: a Western blot does not detect RNA, and PCR of RNA requires reverse transcription first.

@@QUESTIONS

### Q1
Expression of lacZ was measured in E. coli under four conditions.

| Condition | Lactose | Glucose |
|---|---|---|
| 1 | absent | present |
| 2 | present | present |
| 3 | present | absent |
| 4 | absent | absent |

In which condition is lacZ expression expected to be highest?
A) Condition 2
B) Condition 4
C) Condition 1
D) Condition 3
ANSWER: D
WHY: With lactose present, allolactose binds the repressor and releases it from the operator. With glucose absent, cAMP levels rise and the cAMP-CAP complex binds near the promoter and strongly activates transcription. Condition 2 has the repressor removed but low cAMP, so only low-level expression. Conditions 1 and 4 lack lactose, so the repressor stays bound.

### Q2
A cell is treated with a histone deacetylase (HDAC) inhibitor. Which effect is expected?
A) No change in chromatin
B) Increased histone acetylation, a more open chromatin structure and increased transcription of many genes
C) Decreased histone acetylation and gene silencing
D) Increased DNA methylation at all promoters
ANSWER: B
WHY: Acetylation of lysine residues on histone tails neutralizes their positive charge and weakens the interaction with the negatively charged DNA, loosening chromatin. HDACs remove acetyl groups, so inhibiting them leaves histones hyperacetylated and favors a more open, transcriptionally active state. This is why HDAC inhibitors are studied as cancer drugs.

### Q3
A PCR reaction starts with 100 copies of a double-stranded template. Assuming perfect efficiency, approximately how many copies of the target exist after 6 cycles?
A) 64
B) 600
C) 3,600
D) 6,400
ANSWER: D
WHY: Each cycle doubles the number of target copies, so after n cycles the count is 100 x 2^n. For n = 6, 2^6 = 64 and 100 x 64 = 6,400. Choices B and C treat the growth as linear or polynomial instead of exponential.

### Q4
A researcher wants to amplify a specific mRNA from liver tissue by PCR. What must be done before PCR?
A) Use reverse transcriptase to make cDNA from the mRNA
B) Treat the sample with restriction enzymes
C) Add dideoxynucleotides
D) Run the RNA on a Western blot
ANSWER: A
WHY: DNA polymerases used in PCR require a DNA template. Reverse transcriptase uses RNA as a template to make complementary DNA, which then serves as template for PCR. This combined method (RT-PCR) also reveals whether a gene is expressed in a particular tissue, since a gene must be transcribed for its mRNA to be present.

### Q5
Which method would be most appropriate to determine whether a specific protein is present in a tissue extract?
A) Western blot
B) Southern blot
C) Sanger sequencing
D) Northern blot
ANSWER: A
WHY: A Western blot separates proteins by electrophoresis, transfers them to a membrane and uses an antibody against the target protein. Southern blots detect DNA fragments and Northern blots detect RNA, both by hybridization to a labeled probe. Sanger sequencing reads DNA sequence.

### Q6
In a Sanger sequencing reaction, the shortest labeled fragment ends in ddC, followed in increasing size by ddA, ddT, ddG and ddG. What is the sequence of the TEMPLATE strand, written 5' to 3'?
A) 5'-GTACC-3'
B) 5'-CCATG-3'
C) 5'-GGTAC-3'
D) 5'-CATGG-3'
ANSWER: B
WHY: Fragments are read from shortest to longest to give the newly synthesized strand 5' to 3': 5'-CATGG-3'. The template is complementary and antiparallel, so it is 3'-GTACC-5', which written 5' to 3' is 5'-CCATG-3'. Choice D is the new strand, not the template, and choice A is the complement written in the wrong direction.

### Q7
A guide RNA directs Cas9 to cut within the coding sequence of a gene in cultured cells. No donor template is provided. What is the most common outcome at the cut site?
A) Precise insertion of a new gene
B) Small insertions or deletions introduced by non-homologous end joining, often causing frameshifts and loss of function
C) Methylation of the target gene
D) Complete restoration of the original sequence in every case
ANSWER: B
WHY: Without a repair template, the cell repairs the double-strand break mainly by non-homologous end joining, which is error-prone and tends to add or remove a few nucleotides. In a coding region this commonly shifts the reading frame and knocks out the gene. Precise changes require a donor template and homology-directed repair.

### Q8
A restriction enzyme recognizes a six-base-pair palindromic site. In a long random DNA sequence with equal base composition, how often is the site expected to occur on average?
A) About once every 256 bp
B) About once every 64 bp
C) About once every 4,096 bp
D) About once every 1,024 bp
ANSWER: C
WHY: The probability of a given six-base sequence at a position is (1/4)^6 = 1/4096, so on average the site occurs once per 4096 bp. A five-base site would occur about every 1,024 bp, a four-cutter about every 256 bp and a three-base site about every 64. Real genomes deviate from this estimate because base composition is not uniform.

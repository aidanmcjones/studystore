---
title: MCAT Spectroscopy Practice Questions (IR, NMR, Mass Spec, UV-Vis)
description: Ten free MCAT-style spectroscopy practice questions on IR peaks, 1H NMR splitting and integration, 13C signal counts, mass spec isotope patterns and Beer-Lambert calculations, with full explanations.
aamc: 5C
category: 5c-separations-spectroscopy
cluster: Infrared spectroscopy, UV-Vis spectroscopy and Beer-Lambert law, 1H NMR: shift integration splitting, 13C NMR basics, Mass spectrometry
product: 5c-separations-spectroscopy
published: 2026-10-20
notes:
---

Each technique answers a different question. Infrared spectroscopy identifies functional groups from bond vibrations: a strong, sharp peak near 1700 cm<sup>-1</sup> means C=O, a broad band from about 3200 to 3600 cm<sup>-1</sup> means an alcohol O-H, and a very broad band from about 2500 to 3300 cm<sup>-1</sup> overlapping the C-H region means a carboxylic acid. Mass spectrometry gives molecular mass from the molecular ion, and isotope patterns reveal halogens.

Proton NMR maps the hydrogen skeleton. Chemical shift tells the environment (electronegative neighbors move signals downfield, to higher ppm), integration gives the relative number of hydrogens, and splitting follows the n + 1 rule, where n is the number of equivalent neighboring hydrogens. Carbon-13 NMR shows one line per unique carbon environment, so symmetry reduces the count. UV-Vis absorption grows with conjugation, and the Beer-Lambert law, A = &epsilon;bc, turns absorbance into concentration; absorbance is also -log of the transmittance.

Traps: integration gives ratios, not absolute counts, so scale to the molecular formula; and the coupling constant J in hertz does not change with the strength of the magnet, even though the spread of the spectrum in hertz does.

@@QUESTIONS

### Q1
An unknown with molecular formula C<sub>5</sub>H<sub>10</sub>O shows a strong, sharp IR peak at 1715 cm<sup>-1</sup>, no absorption between 3200 and 3600 cm<sup>-1</sup>, and no weak peaks near 2720 or 2820 cm<sup>-1</sup>. Which compound fits best?
A) Pentanal
B) Pentan-2-one
C) Pent-4-en-1-ol
D) Tetrahydropyran
ANSWER: B
WHY: A strong peak near 1715 cm<sup>-1</sup> is a carbonyl, which rules out the alcohol (it would show a broad O-H band and no C=O) and the cyclic ether tetrahydropyran (no C=O). Aldehydes show a slightly higher C=O stretch and a characteristic pair of weak aldehyde C-H peaks near 2720 and 2820 cm<sup>-1</sup>, which are absent. The ketone pentan-2-one fits all the data.

### Q2
Cyclohexanol is oxidized with a chromium(VI) reagent to cyclohexanone. How would IR spectroscopy confirm the reaction went to completion?
A) A broad band near 2500 to 3300 cm<sup>-1</sup> appears and the C-H stretches disappear
B) A sharp peak near 2250 cm<sup>-1</sup> appears
C) The sp<sup>3</sup> C-H stretches near 2900 cm<sup>-1</sup> disappear
D) The broad band near 3200 to 3600 cm<sup>-1</sup> disappears and a strong peak near 1715 cm<sup>-1</sup> appears
ANSWER: D
WHY: The starting alcohol shows a broad O-H stretch from hydrogen bonding, and the ketone product has no O-H but a strong C=O stretch. Loss of the O-H band together with a new carbonyl peak shows complete conversion. Choice A describes a carboxylic acid, choice B describes a nitrile, and the ring C-H bonds are still present in the product.

### Q3
Which pattern is expected in the <sup>1</sup>H NMR spectrum of 2-chloropropane, (CH<sub>3</sub>)<sub>2</sub>CHCl?
A) A 6H doublet near 1.5 ppm and a 1H septet near 4.1 ppm
B) A 6H triplet near 1.5 ppm and a 1H quartet near 4.1 ppm
C) A 6H septet near 4.1 ppm and a 1H doublet near 1.5 ppm
D) A single 7H singlet near 2 ppm
ANSWER: A
WHY: The six methyl hydrogens are equivalent and each methyl carbon has one neighboring hydrogen (the CH), so they appear as a doublet integrating to 6. The CH hydrogen has six equivalent neighbors and appears as a septet (6 + 1), shifted downfield near 4 ppm by the attached chlorine. Choice C swaps the multiplicities and shifts, and the triplet and quartet in choice B belong to an ethyl group.

### Q4
A fruity-smelling ester with five carbons and two oxygens gives the <sup>1</sup>H NMR data below. Which compound is it?

| Shift (ppm) | Integration | Splitting |
|---|---|---|
| 0.94 | 3H | triplet |
| 1.64 | 2H | sextet |
| 2.05 | 3H | singlet |
| 4.03 | 2H | triplet |

A) Ethyl propanoate, CH<sub>3</sub>CH<sub>2</sub>COOCH<sub>2</sub>CH<sub>3</sub>
B) Isopropyl acetate, CH<sub>3</sub>COOCH(CH<sub>3</sub>)<sub>2</sub>
C) Propyl acetate, CH<sub>3</sub>COOCH<sub>2</sub>CH<sub>2</sub>CH<sub>3</sub>
D) Methyl butanoate, CH<sub>3</sub>CH<sub>2</sub>CH<sub>2</sub>COOCH<sub>3</sub>
ANSWER: C
WHY: The 3H singlet at 2.05 ppm is a methyl on the carbonyl, so the ester is an acetate. The 2H triplet at 4.03 ppm is a CH<sub>2</sub> on the ester oxygen with two neighbors, the 2H sextet has five neighbors (CH<sub>3</sub> plus CH<sub>2</sub>), and the 3H triplet is the terminal methyl: a straight propyl group. Isopropyl acetate would show a 6H doublet and a 1H septet, ethyl propanoate has no singlet, and methyl butanoate would show its singlet near 3.7 ppm for O-CH<sub>3</sub>.

### Q5
How many signals appear in the proton-decoupled <sup>13</sup>C NMR spectrum of ethylbenzene, C<sub>6</sub>H<sub>5</sub>CH<sub>2</sub>CH<sub>3</sub>?
A) 4
B) 6
C) 8
D) 3
ANSWER: B
WHY: A mirror plane through the ring and the ethyl group makes the two ortho carbons equivalent and the two meta carbons equivalent. The ring therefore gives four signals (ipso, ortho, meta, para), and the CH<sub>2</sub> and CH<sub>3</sub> give one each, for six in total. Counting all eight carbons ignores symmetry, and four counts only the ring.

### Q6
NADH absorbs at 340 nm with a molar absorptivity of about 6.22 &times; 10<sup>3</sup> L/(mol cm), and NAD<sup>+</sup> does not absorb there. An enzyme assay mixture with a path length of 1.00 cm gives an absorbance of 0.311 at 340 nm. What is the NADH concentration?
A) 50 micromolar
B) 5.0 micromolar
C) 0.50 millimolar
D) 5.0 millimolar
ANSWER: A
WHY: From A = &epsilon;bc, c = 0.311 / (6220 M<sup>-1</sup> cm<sup>-1</sup> &times; 1.00 cm) = 5.0 &times; 10<sup>-5</sup> M, which is 50 micromolar. Choices B, C and D are off by powers of ten, the usual slip when converting molar to micromolar or millimolar; 1 micromolar is 10<sup>-6</sup> M and 1 millimolar is 10<sup>-3</sup> M.

### Q7
A sample has an absorbance of 0.70 at its wavelength of maximum absorption. About what percentage of the incident light is transmitted?
A) 70 percent
B) 50 percent
C) 20 percent
D) 5 percent
ANSWER: C
WHY: Absorbance is -log(T), so T = 10<sup>-0.70</sup>, which is about 0.20, or 20 percent transmitted. As a check, A = 1 transmits 10 percent and A = 0.30 transmits about 50 percent, so 0.70 must fall between them. Choice A confuses absorbance with transmittance.

### Q8
The mass spectrum of an unknown shows a molecular ion peak at m/z 136 and a second peak at m/z 138 of nearly equal height. Which element is most likely present?
A) Chlorine
B) Nitrogen
C) Sulfur
D) Bromine
ANSWER: D
WHY: Bromine has two common isotopes, <sup>79</sup>Br and <sup>81</sup>Br, in nearly equal abundance, so a molecule with one bromine shows M and M+2 peaks of about equal height. Chlorine also gives an M+2 peak, but about one third the height of M, because <sup>35</sup>Cl is about three times as abundant as <sup>37</sup>Cl. Sulfur gives only a small M+2 peak, and nitrogen shows up as an odd molecular mass, not an M+2 pattern.

### Q9
Which compound has the longest wavelength of maximum UV absorption?
A) Ethene
B) 1,3,5-Hexatriene
C) 1,3-Butadiene
D) 1,4-Pentadiene
ANSWER: B
WHY: Each added conjugated double bond narrows the gap between the highest occupied and lowest unoccupied pi orbitals, so less energy (a longer wavelength) is needed for excitation. Hexatriene has three conjugated double bonds, the most here. 1,4-Pentadiene has two double bonds separated by a CH<sub>2</sub>, so they are not conjugated and it absorbs like a simple alkene.

### Q10
All of the following statements about <sup>1</sup>H NMR spectroscopy are true EXCEPT:
A) The coupling constant J between two hydrogens, in hertz, doubles when the spectrometer field strength is doubled
B) Tetramethylsilane is used as the 0 ppm reference
C) Hydrogens near electronegative atoms are deshielded and appear at higher ppm
D) Integrating a signal reveals how many hydrogens give rise to it, relative to the other signals
ANSWER: A
WHY: J reflects coupling through bonds within the molecule and is independent of the external field, which is why it is reported in hertz and stays the same on different instruments. What changes with field strength is the separation of signals in hertz, which is why shifts are reported in ppm. Statements B, C and D are standard and true.

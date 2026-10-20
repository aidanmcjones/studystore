---
title: How to Read IR and NMR Spectra for the MCAT
description: Read IR peaks and 1H NMR shift, integration and splitting step by step, then combine them with degrees of unsaturation to solve a structure.
product: 5c-separations-spectroscopy
published: 2026-10-20
related: amino-acid-pka-charge-ph-7-4, acid-base-titration-curves-equivalence-point
---

IR and NMR answer different questions. Infrared spectroscopy tells you which functional groups are present, mostly by looking for a carbonyl near 1700 cm<sup>-1</sup> and an O-H or N-H stretch above 3000 cm<sup>-1</sup>. Proton NMR tells you how the hydrogens are arranged: how many kinds there are (number of signals), what they sit next to (chemical shift), how many of each there are (integration), and how many hydrogens are on the neighboring carbons (splitting). Use IR to name the group, then NMR to build the skeleton around it.

## Infrared: what a peak means

A bond absorbs infrared light when its stretching or bending changes the molecule's dipole moment. Two consequences follow. Polar bonds such as C=O and O-H give strong peaks, and a perfectly symmetric bond, such as the C&equiv;C in an alkyne with identical groups on both ends, can be nearly invisible.

Position is reported as wavenumber in cm<sup>-1</sup>, which is 1/wavelength, so a higher wavenumber means higher energy. A bond behaves roughly like a spring: a stiffer bond and lighter atoms vibrate faster. That one idea explains the layout of the whole spectrum.

- Bonds to hydrogen (O-H, N-H, C-H) involve the lightest atom, so they sit at the high end, about 2700 to 3650 cm<sup>-1</sup>.
- Triple bonds are stiffer than double bonds, so C&equiv;N and C&equiv;C (about 2100 to 2260) come above C=O and C=C (about 1600 to 1800).
- Single bonds between heavy atoms, such as C-O, sit lower, about 1000 to 1300.

IR charts are printed with wavenumber decreasing from left to right and transmittance on the y-axis, so absorptions point down as valleys. Everything below about 1500 cm<sup>-1</sup> is the fingerprint region: unique to each compound and useful for matching against a reference, but not something you assign peak by peak.

### The peaks worth memorizing

| Bond | Approximate position (cm<sup>-1</sup>) | What it looks like |
|---|---|---|
| Alcohol O-H | 3200 to 3650 | Strong and broad, a rounded trough |
| Carboxylic acid O-H | 2500 to 3300 | Very broad, runs into the C-H peaks |
| Amine N-H | 3300 to 3500 | Medium, sharper than O-H; a primary amine shows two spikes, a secondary amine one |
| sp<sup>3</sup> C-H | 2850 to 3000 | Present in almost every organic compound |
| sp<sup>2</sup> C-H | 3000 to 3100 | Just above 3000, signals an alkene or aromatic ring |
| Aldehyde C-H | about 2720 and 2820 | Two weak peaks, easy to miss |
| C&equiv;N | 2200 to 2260 | Sharp, medium |
| C=O | about 1650 to 1800 | Strong and sharp, the tallest valley in most spectra |
| C-O | 1000 to 1300 | Strong, look for it in esters, ethers and alcohols |

### Telling carbonyls apart

The exact C=O position shifts with what is attached. Approximate values: acyl chloride near 1800, ester near 1740, aldehyde near 1730, ketone near 1715, carboxylic acid near 1710, amide around 1630 to 1690. An amide sits lowest because the nitrogen's lone pair donates into the carbonyl, giving the C=O partial single-bond character. Conjugation with a C=C or an aromatic ring does the same thing more mildly and lowers the stretch by roughly 30 cm<sup>-1</sup>. Hydrogen bonding broadens O-H peaks and pushes them lower, which is why a neat alcohol gives a wide trough rather than a spike.

![Left: IR positions of common bonds on a reversed wavenumber axis. Right: a simulated proton NMR spectrum of 2-butanone with its singlet, quartet and triplet](assets/notes/how-to-read-ir-and-nmr-spectra.png "IR finds the carbonyl; NMR shows the CH3, CH2 and CH3 pieces around it.")

## Proton NMR: four readings from one spectrum

In a strong magnetic field, each hydrogen nucleus soaks up radio waves at a slightly different frequency, depending on how much electron density surrounds it. Electrons shield the nucleus. Pull electron density away with an electronegative atom or a nearby pi system and the hydrogen is deshielded, so its signal moves **downfield**, to higher ppm, on the left of the chart.

### 1. Number of signals

Chemically equivalent hydrogens give a single signal. Count the signals and you have counted the hydrogen environments. Symmetry cuts the count: the six hydrogens of acetone, (CH<sub>3</sub>)<sub>2</sub>C=O, are all equivalent and give one signal.

### 2. Chemical shift

Shifts are reported in ppm relative to tetramethylsilane (TMS), set at 0. Because ppm divides the frequency offset by the spectrometer frequency, a shift in ppm is the same on any magnet.

| Hydrogen type | Approximate shift (ppm) |
|---|---|
| Plain alkyl C-H | 0.8 to 1.8 |
| Next to C=O, a C=C, or a benzene ring | 2.0 to 3.0 |
| On a carbon bonded to O or a halogen | 3.3 to 4.5 |
| Vinyl (on a C=C) | 4.5 to 6.5 |
| Aromatic | 6.5 to 8.5 |
| Aldehyde | 9 to 10 |
| Carboxylic acid O-H | 10 to 13 |
| Alcohol O-H or amine N-H | about 1 to 5, broad and variable |

A practical summary: the more electronegative the neighbor, and the closer it is, the farther left the signal.

### 3. Integration

A bigger signal area means more hydrogens behind it: the areas scale with hydrogen count. Integrals give ratios, not absolute counts, so scale them to the molecular formula. Ratios of 1 : 1.5 : 1 in a compound with 7 hydrogens become 2 : 3 : 2.

### 4. Splitting and the n + 1 rule

A signal is split by nonequivalent hydrogens on adjacent carbons. With n equivalent neighbors, the signal appears as n + 1 lines: singlet, doublet, triplet, quartet, and so on. Line intensities follow Pascal's triangle, so a triplet is 1 : 2 : 1 and a quartet is 1 : 3 : 3 : 1. The gap between neighboring lines, measured in Hz, is called J, and two groups that split each other share the same J.

Three patterns are worth recognizing on sight:

- **Ethyl group**: a 3H triplet and a 2H quartet. The CH<sub>3</sub> sees two neighbors, the CH<sub>2</sub> sees three.
- **Isopropyl group**: a 6H doublet and a 1H septet.
- **tert-Butyl group**: a 9H singlet, since the attached carbon has no hydrogens.

Hydrogens on O or N usually exchange quickly, so they appear as broad singlets and do not split their neighbors in a typical sample. Shaking the sample with D<sub>2</sub>O replaces them with deuterium, and the signal vanishes, a quick test for an O-H or N-H.

## Carbon-13 NMR in one paragraph

A proton-decoupled <sup>13</sup>C spectrum shows one line per unique carbon environment, with no splitting and unreliable integration. Its main use is counting environments to judge symmetry. Approximate regions: alkyl carbons 0 to 50 ppm, carbons bonded to O or N 50 to 90, alkene and aromatic carbons 100 to 160, ester and acid carbonyls 160 to 185, ketone and aldehyde carbonyls 190 to 220.

## Worked example 1: C<sub>4</sub>H<sub>8</sub>O

A compound with formula C<sub>4</sub>H<sub>8</sub>O shows a strong IR peak near 1715 cm<sup>-1</sup>, nothing broad above 3000, and no pair of weak peaks near 2720 and 2820. Its proton NMR shows approximately: 1.05 ppm (triplet, 3H), 2.15 ppm (singlet, 3H), 2.45 ppm (quartet, 2H).

1. **Degrees of unsaturation.** DBE = (2C + 2 + N - H - X)/2 = (8 + 2 - 8)/2 = 1. One ring or one pi bond.
2. **IR.** A strong peak at 1715 is a C=O, which uses up the single degree of unsaturation. No O-H rules out an acid or alcohol. No aldehyde C-H peaks points to a ketone.
3. **Integration.** 3 + 3 + 2 = 8 hydrogens, matching the formula.
4. **Splitting.** A 3H triplet with a 2H quartet is an ethyl group. The 3H singlet is a methyl with no hydrogen-bearing neighbors.
5. **Shift.** The CH<sub>2</sub> at 2.45 and the CH<sub>3</sub> at 2.15 both sit in the 2 to 3 ppm range for hydrogens next to a carbonyl.

The structure is CH<sub>3</sub>C(=O)CH<sub>2</sub>CH<sub>3</sub>, 2-butanone. A <sup>13</sup>C spectrum would show four lines, one of them above 200 ppm for the ketone carbon.

## Worked example 2: three isomers of C<sub>3</sub>H<sub>6</sub>O<sub>2</sub>

Propanoic acid, methyl acetate and ethyl formate share the formula C<sub>3</sub>H<sub>6</sub>O<sub>2</sub>. How would you tell them apart?

- **IR first.** Propanoic acid shows the very broad O-H band from about 2500 to 3300 plus a C=O near 1710. Both esters lack any O-H, show a C=O at a higher wavenumber, and have a strong C-O stretch between 1000 and 1300. IR separates the acid from the esters but struggles to separate the two esters.
- **NMR settles it.** Propanoic acid gives a triplet (3H), a quartet (2H) near 2.4 ppm, and a broad 1H singlet far downfield, above 10 ppm. Methyl acetate gives just two singlets of 3H each: one near 2.0 ppm (methyl on the carbonyl) and one near 3.7 ppm (methyl on oxygen). Ethyl formate gives a triplet (3H), a quartet (2H) near 4.2 ppm, because that CH<sub>2</sub> is bonded to oxygen, and a 1H singlet near 8 ppm from the H on the carbonyl carbon.

Notice the trap in ethyl formate: its formyl hydrogen sits near 8 ppm rather than in the 9 to 10 ppm aldehyde range, because the neighboring oxygen donates electron density into the carbonyl. Ranges are guides, not walls.

## A routine for any structure problem

1. Compute degrees of unsaturation from the formula. Four or more suggests a benzene ring.
2. Scan the IR for C=O (1650 to 1800), O-H or N-H (above 3200), C&equiv;N or C&equiv;C (2100 to 2260), and sp<sup>2</sup> C-H just above 3000.
3. Count <sup>13</sup>C lines to judge symmetry, if that spectrum is given.
4. In the <sup>1</sup>H spectrum, scale the integrals to the formula, read each splitting pattern as a neighbor count, and let each shift tell you whether an oxygen, halogen, carbonyl or ring sits nearby.
5. Assemble the pieces and check that every atom in the formula is used exactly once.

## Common traps

- **Counting the group's own hydrogens for splitting.** The n in n + 1 counts hydrogens on the neighboring carbons, not on the carbon producing the signal.
- **Calling any 1700 peak a ketone.** Check for the aldehyde C-H pair, a broad acid O-H, or a strong C-O band first.
- **Putting an ester carbonyl below a ketone.** In IR, an ester C=O (about 1740) is higher than a ketone (about 1715). In <sup>13</sup>C NMR it is the opposite: the ester carbonyl carbon (about 170 ppm) is upfield of the ketone carbonyl carbon (above 200 ppm).
- **Reading integration as absolute.** Integrals are ratios. Scale them to the formula.
- **Expecting every bond to show in IR.** A bond whose vibration does not change the dipole moment absorbs weakly or not at all.
- **Mixing up downfield and upfield.** Downfield is higher ppm, to the left, and means deshielded.

## One-minute recap

IR detects bond vibrations that change the dipole. Bonds to H sit high (above 2700), triple bonds near 2100 to 2260, C=O near 1650 to 1800, and C-O near 1000 to 1300. A broad trough above 3200 is O-H; an acid's O-H is broader and lower. Proton NMR gives four readings: number of signals (environments), shift (electronic surroundings, downfield means deshielded), integration (relative H count), and splitting (n neighbors give n + 1 lines). Combine both with degrees of unsaturation and check that the pieces add up to the formula.

:::quiz
Q: Why does an N-H or O-H stretch appear at a higher wavenumber than a C-O stretch?
A: Hydrogen is very light, and a bond to a light atom vibrates at a higher frequency. Higher frequency means higher wavenumber, so X-H stretches sit above 2700 cm-1 while C-O sits near 1000 to 1300.
Q: A compound shows a very broad IR band from about 2500 to 3300 cm-1 and a strong peak near 1710 cm-1. Which functional group is most likely?
A: A carboxylic acid. The extremely broad, low O-H band from hydrogen-bonded acid dimers together with a C=O near 1710 is its signature.
Q: In a 1H NMR spectrum, a CH2 group is bonded to a CH3 group on one side and a carbonyl carbon on the other. How is the CH2 signal split?
A: It is a quartet. The CH2 has three equivalent neighboring hydrogens on the CH3, and the carbonyl carbon has none, so n + 1 = 4 lines.
Q: Methyl acetate shows only two 1H NMR signals. What are they and why are both singlets?
A: A 3H singlet near 2.0 ppm (methyl on the carbonyl) and a 3H singlet near 3.7 ppm (methyl on oxygen). Each methyl is attached to an atom with no hydrogens, so neither is split.
Q: A broad 1H NMR singlet near 2.5 ppm disappears after the sample is shaken with D2O. What does that tell you?
A: The signal came from an exchangeable hydrogen, most likely an O-H or N-H. Deuterium replaces it, and deuterium does not appear in a proton spectrum.
:::

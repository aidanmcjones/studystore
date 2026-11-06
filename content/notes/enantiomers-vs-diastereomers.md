---
title: Enantiomers vs Diastereomers: How to Tell Them Apart
description: Classify any pair of stereoisomers as enantiomers, diastereomers, meso or identical, and see why only diastereomers separate by ordinary methods.
seo_title: Enantiomers vs Diastereomers: How to Tell Them Apart
seo_description: Tell enantiomers, diastereomers, meso and identical pairs apart, and why only diastereomers separate by ordinary methods.
product: 5b-molecules-bonding-stereo
published: 2026-11-01
related: r-and-s-configuration-cip-priority-rules, anomers-vs-epimers-carbohydrates, sn1-vs-sn2-vs-e1-vs-e2-mechanisms
---

**Enantiomers** are stereoisomers that are non-superimposable mirror images: every stereocenter has the opposite configuration. **Diastereomers** are stereoisomers that are not mirror images: at least one stereocenter matches and at least one differs (or, for alkenes, the cis and trans arrangement differs). Enantiomers share every physical property except the sign of optical rotation and behavior toward other chiral things; diastereomers are different compounds with different melting points, boiling points and solubilities.

## The one-line test

Assign R or S to every stereocenter in both molecules, then line the labels up center by center.

| Comparison of the labels | Relationship |
|---|---|
| Every center the same | Same compound |
| Every center flipped | Enantiomers (unless the molecule is meso) |
| Some flipped, some the same | Diastereomers |
| Different connectivity | Not stereoisomers at all: constitutional isomers |

This test only works if both molecules have the same connectivity, so check that first. Two molecules with the formula C<sub>4</sub>H<sub>10</sub>O but the OH on different carbons are constitutional isomers, and the R/S comparison is meaningless.

![Decision flowchart for classifying two isomers, and the four stereoisomers of a two-center molecule with their pair relationships](assets/notes/enantiomers-vs-diastereomers.png "Left: walk down the questions in order. Right: for a molecule with two stereocenters, each isomer has exactly one enantiomer; every other stereoisomer is a diastereomer.")

## Counting stereoisomers

A molecule with n stereocenters has at most 2<sup>n</sup> stereoisomers. When none of them is meso, those isomers come in enantiomer pairs, so each one has exactly one enantiomer, and every other stereoisomer is its diastereomer.

With three stereocenters there are up to 2<sup>3</sup> = 8 stereoisomers. Pick any one of them, say (R,R,S). Its enantiomer is (S,S,R), the only label set with all three flipped. The remaining 8 &minus; 2 = 6 stereoisomers are all diastereomers of (R,R,S).

The "at most" matters. If the molecule has an internal mirror plane in one of its forms, that form is **meso**: it has stereocenters but is achiral, because it is superimposable on its own mirror image. A molecule built from two identical halves, such as 2,3-dichlorobutane, has two stereocenters but only three stereoisomers: the (R,R) and (S,S) enantiomer pair, plus a single meso form in which (R,S) and (S,R) describe the same molecule. The meso form is a diastereomer of both members of the chiral pair.

## Diastereomers without stereocenters

Cis and trans (or E and Z) alkenes are diastereomers. They are stereoisomers, since the connectivity is identical, and they are not mirror images of each other. The same holds for cis and trans disubstituted rings: cis-1,2-dimethylcyclohexane and trans-1,2-dimethylcyclohexane are diastereomers. This is why "diastereomer" is the broad catch-all category: any stereoisomer pair that fails the mirror-image test lands here.

Conformers are a different matter. Two chair forms of the same cyclohexane, or the staggered and eclipsed forms of butane, interconvert by bond rotation at room temperature. They are usually treated as conformations of one compound, not as separate stereoisomers.

## Why the difference matters in the lab

Enantiomers have identical melting points, boiling points, densities, solubilities in ordinary solvents, and IR and NMR spectra. Their only measurable difference in an achiral setting is the direction they rotate plane-polarized light: equal magnitude, opposite sign. A 50:50 mixture, a **racemic mixture**, shows no net rotation.

Diastereomers generally differ in those properties because their atoms sit at different distances from one another. That means a mixture of diastereomers can be separated by ordinary distillation, recrystallization or standard chromatography, while a mixture of enantiomers cannot.

**Resolution** uses this. React a racemic acid with a single enantiomer of a chiral base. The (R)-acid and (S)-acid now form two salts, (R)-acid with (S)-base and (S)-acid with (S)-base, which are diastereomers. Separate the salts by crystallization, then release each acid. The trick turns an enantiomer problem into a diastereomer problem.

Chiral environments also tell enantiomers apart. Enzymes and receptors are built from L-amino acids, so they are chiral, and two enantiomers of a drug can bind them with very different strength. That is why many drugs are sold as a single enantiomer.

## Worked example: enantiomeric excess from rotation

Pure (S)-compound X has a specific rotation of +40.0&deg; under fixed conditions, so pure (R)-X is &minus;40.0&deg;. A sample of X measured under the same conditions reads +24.0&deg;.

1. Enantiomeric excess (ee) = observed / pure = 24.0 / 40.0 = 0.60, so ee = 60 percent.
2. The sign is positive, so S is in excess.
3. The 60 percent excess is pure S; the other 40 percent is racemic, half S and half R. S = 60 + 20 = 80 percent, R = 20 percent. Equivalently, S fraction = (1 + 0.60) / 2 = 0.80.

Check in the other direction: a mixture of 75 percent R and 25 percent S has ee = 50 percent in favor of R, so it should read 0.50 &times; (&minus;40.0&deg;) = &minus;20.0&deg;.

## Common traps

- **R/S does not predict + or &minus;.** The sign of rotation is measured. An (S) compound can be dextrorotatory or levorotatory.
- **Flipping every label of a meso compound gives the same compound,** not an enantiomer. Check for an internal mirror plane before calling a pair enantiomers.
- **Epimers and anomers are diastereomers,** not a separate category. An epimer differs at exactly one of several stereocenters.
- **Cis and trans alkenes are diastereomers** even though they have no stereocenter.
- **"Same physical properties" applies only to enantiomers.** If an answer choice says two diastereomers have the same boiling point, it is wrong in general.
- **A racemic mixture is optically inactive, but so is a meso compound.** The racemate is a mixture of chiral molecules; the meso compound is a single achiral molecule.

## Practice this further

The 5B Bonding, Molecular Structure and Stereochemistry pack adds flashcards and practice questions on chirality, isomer classification, optical activity and molecular geometry: [get the 5B pack](../products/5b-molecules-bonding-stereo.html). To see the format first, try the [free sampler](/#sampler).

## One-minute recap

Compare R/S labels center by center: all flipped means enantiomers, some flipped means diastereomers, none flipped means the same compound. Cis/trans isomers, epimers and anomers are all diastereomers. A molecule with n stereocenters has at most 2<sup>n</sup> stereoisomers; meso forms reduce the count. Enantiomers match in every physical property except the sign of rotation, so they need a chiral agent to separate; diastereomers separate by ordinary means. Enantiomeric excess equals observed rotation divided by the pure enantiomer's rotation.

Related: see the [VSEPR geometry and polarity note](vsepr-molecular-geometry-bond-angles-polarity.html).

:::quiz
Q: Compound A is (2R,3S) and compound B is (2S,3S). Both have the same connectivity and no internal mirror plane. What is their relationship?
A: Diastereomers. Only C2 differs while C3 matches, so they are stereoisomers but not mirror images.
Q: How many stereoisomers can a molecule with four stereocenters have, at most, and how many diastereomers does each have if none are meso?
A: At most 2<sup>4</sup> = 16. Each has one enantiomer, so it has 16 &minus; 2 = 14 diastereomers.
Q: Why can a racemic mixture not be separated by simple distillation, while a pair of diastereomers often can?
A: Enantiomers have identical boiling points, so distillation cannot tell them apart. Diastereomers have different boiling points and other physical properties.
Q: Pure (R)-Y has a specific rotation of &minus;50.0&deg;. A sample reads &minus;30.0&deg;. What percent of the sample is R?
A: 80 percent. The ee is 30.0 / 50.0 = 60 percent in favor of R, so R = (1 + 0.60) / 2 = 80 percent and S = 20 percent.
Q: Are cis-2-butene and trans-2-butene enantiomers or diastereomers?
A: Diastereomers. They have the same connectivity but are not mirror images of each other, and neither is chiral.
:::

---
title: Acid-Base Extraction for the MCAT: Which Layer and Why
description: How acid-base extraction separates carboxylic acids, phenols, amines and neutral compounds: which wash to use, which layer each ends up in, and why.
product: 5c-separations-spectroscopy
published: 2026-11-11
related: strong-vs-weak-acids-ka-pka-conjugate-base-strength, henderson-hasselbalch-for-the-mcat, how-to-read-ir-and-nmr-spectra
---

Acid-base extraction separates organic compounds by switching one of them into its charged form, so that it leaves the organic solvent and moves into the water layer. Dilute HCl pulls out amines, sodium bicarbonate pulls out carboxylic acids, and sodium hydroxide pulls out phenols as well. Neutral compounds stay in the organic layer the whole time.

## The one idea: charge decides the layer

A separatory funnel holds two liquids that do not mix: water and an organic solvent such as diethyl ether or dichloromethane. Neutral organic molecules prefer the organic solvent. Ions prefer water, where ion-dipole interactions stabilize them. An acid-base reaction is the switch that turns a neutral molecule into an ion and back again.

- An acid HA becomes A<sup>-</sup> when a strong enough base is in the water layer.
- An amine B becomes BH<sup>+</sup> when acid is in the water layer.
- A compound with no acidic or basic group has no switch, so it never moves.

## Which wash moves which compound

A base removes a proton effectively only when its own conjugate acid is weaker (has a higher pK<sub>a</sub>) than the acid it is attacking.

| Aqueous wash | Approximate pH | Moves into the water layer | Stays in the organic layer |
|---|---|---|---|
| 1 M HCl | 0 | Amines, as ammonium salts | Carboxylic acids, phenols, neutrals |
| Saturated NaHCO<sub>3</sub> | 8.3 | Carboxylic acids, as carboxylates | Phenols, neutrals |
| 1 M NaOH | 14 | Carboxylic acids and phenols | Neutrals |

Bicarbonate is selective because of where carbonic acid sits. Its pK<sub>a</sub> is about 6.4. A carboxylic acid (pK<sub>a</sub> about 4 to 5) is a stronger acid than carbonic acid, so bicarbonate deprotonates it. A phenol (pK<sub>a</sub> about 10) is a weaker acid than carbonic acid, so it keeps its proton and stays put. Hydroxide is different: its conjugate acid is water, a far weaker acid than any phenol, so NaOH deprotonates carboxylic acids and phenols alike.

Ordinary alcohols (pK<sub>a</sub> about 16 or higher) are not deprotonated to a meaningful extent by aqueous NaOH. In an extraction they behave as neutral compounds.

## Checking the table with Henderson-Hasselbalch

For an acid, the ratio of charged to neutral form is [A<sup>-</sup>]/[HA] = 10<sup>(pH - pKa)</sup>. For an amine, the charged form is the protonated one, so [BH<sup>+</sup>]/[B] = 10<sup>(pKa - pH)</sup>, using the pK<sub>a</sub> of the conjugate acid.

- Benzoic acid (pK<sub>a</sub> about 4.2) in bicarbonate at pH 8.3: 10<sup>4.1</sup>, about 12,600 benzoate ions for every neutral acid.
- A phenol (pK<sub>a</sub> about 10.0) in the same wash: 10<sup>-1.7</sup>, about 0.02, so only about 2 percent is ionized.
- The same phenol in 1 M NaOH at pH 14: 10<sup>4</sup>, or 10,000 to 1 in favor of phenoxide.
- Aniline (conjugate acid pK<sub>a</sub> about 4.6) in 1 M HCl at pH 0: 10<sup>4.6</sup>, about 39,800 anilinium ions for every neutral amine.

![Percent of aniline, benzoic acid and phenol present in charged form from pH 0 to 14, with the pH of the three washes marked](assets/notes/acid-base-extraction.png "Each wash is chosen so that the compound you want is charged, and water soluble, at that pH.")

## Worked example: four compounds, one funnel

A mixture of aniline, benzoic acid, 4-methylphenol (pK<sub>a</sub> about 10) and naphthalene is dissolved in diethyl ether.

1. Shake with 1 M HCl. Aniline becomes anilinium chloride and moves to the water layer. Drain that layer into flask 1.
2. Shake the ether with saturated NaHCO<sub>3</sub>. Benzoic acid becomes sodium benzoate and moves to the water layer. Carbon dioxide forms, so the funnel must be vented. Drain into flask 2.
3. Shake the ether with 1 M NaOH. 4-Methylphenol becomes its phenoxide and moves to the water layer. Drain into flask 3.
4. The ether now holds only naphthalene. Dry it over anhydrous sodium sulfate and evaporate the solvent.

Each flask holds a salt, not the original compound. To recover the compound, reverse the switch. Add NaOH to flask 1 until it is basic and neutral aniline separates. Add HCl to flasks 2 and 3 until they are acidic: benzoic acid precipitates and can be filtered, and the phenol can be extracted back into fresh ether.

The order of the two basic washes matters. If NaOH goes in before bicarbonate, benzoate and phenoxide land in the same flask and the separation is lost.

### Which layer is on top?

Density decides, not the label "organic". Diethyl ether (about 0.71 g/mL) floats on water (1.00 g/mL), so the aqueous layer is the bottom one. Dichloromethane (about 1.33 g/mL) sinks, so the aqueous layer is on top. If you are unsure at the bench, add a few drops of water and watch which layer they join.

## Why several small extractions beat one large one

A neutral solute divides between the layers according to its partition coefficient, K = [solute in organic]/[solute in water]. After one extraction, the fraction left in the water is V<sub>aq</sub> / (V<sub>aq</sub> + K &times; V<sub>org</sub>). After n equal extractions, raise that fraction to the power n.

Take K = 4 and 60 mL of water. One 60 mL portion of ether leaves 60 / (60 + 240) = 0.20 behind, so 80 percent is recovered. Three 20 mL portions each leave 60 / (60 + 80) = 0.43 behind, and 0.43<sup>3</sup> is about 0.08, so 92 percent is recovered with the same total volume of solvent.

## Common traps

- Assuming the organic layer is on top. That holds only for solvents less dense than water.
- Reaching for NaOH when the task is to separate a carboxylic acid from a phenol. Hydroxide takes both.
- Using the wrong pK<sub>a</sub> for an amine. Compare the wash pH with the pK<sub>a</sub> of the ammonium ion, not with the very high pK<sub>a</sub> of the N-H bond in the neutral amine.
- Expecting an alcohol to follow a phenol into NaOH. It does not.
- Forgetting the return step. What sits in the water layer is a salt, and it must be neutralized to give back the original compound.
- Confusing the basis of separation. Extraction sorts by solubility and charge, distillation sorts by boiling point, and chromatography sorts by affinity for a stationary phase.

The [5C Separations, Purification and Spectroscopy pack](../products/5c-separations-spectroscopy.html) adds flashcards and more practice across the whole category, and you can try a [free sampler](/#sampler) first.

## One-minute recap

- Charged species go to water, neutral species stay in the organic solvent.
- HCl removes amines, NaHCO<sub>3</sub> removes carboxylic acids, NaOH removes carboxylic acids and phenols.
- Use bicarbonate before hydroxide when both an acid and a phenol are present.
- Neutralize each water layer to recover its compound.
- The denser liquid is the bottom layer: ether floats, dichloromethane sinks.
- Several small extractions recover more than one large one of the same total volume.

:::quiz
Q: Which aqueous wash separates a carboxylic acid from a phenol, and why does it work?
A: Saturated sodium bicarbonate. Carbonic acid (pKa about 6.4) is weaker than a carboxylic acid but stronger than a phenol, so bicarbonate deprotonates only the carboxylic acid.
Q: With dichloromethane as the organic solvent, is the aqueous layer on the top or the bottom?
A: On top. Dichloromethane (about 1.33 g/mL) is denser than water, so the organic layer sinks to the bottom of the funnel.
Q: Benzoic acid has a pKa of about 4.2. In a water layer at pH 6.2, what is the ratio of benzoate to benzoic acid?
A: About 100 to 1, because the ratio is 10 raised to (6.2 minus 4.2), which is 10 squared.
Q: An amine has been pulled into the water layer with HCl. How is the neutral amine recovered?
A: Add a base such as NaOH until the solution is basic, which converts the ammonium ion back to the neutral amine, then collect it or extract it into fresh organic solvent.
Q: A solute has K = 3 (organic over water). What fraction remains in 50 mL of water after one extraction with 50 mL of ether?
A: One quarter. The fraction left is 50 / (50 + 3 times 50) = 50 / 200 = 0.25, so 75 percent moves into the ether.
:::

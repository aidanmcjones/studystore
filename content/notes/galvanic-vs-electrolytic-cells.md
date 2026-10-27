---
title: Galvanic vs Electrolytic Cells: Signs, Electron Flow and Examples
description: Compare galvanic and electrolytic cells by spontaneity, electrode signs, electron flow, and sign of E and delta G, with worked Nernst and Faraday examples.
seo_title: Galvanic vs Electrolytic Cells | MCAT Free Notes
seo_description: Free MCAT notes comparing galvanic and electrolytic cells: electrode signs, electron flow, E and delta G, with Nernst and Faraday examples.
product: 4c-electricity-electrochem
published: 2026-10-20
related: action-potential-phases-ion-channels, acid-base-titration-curves-equivalence-point
---

A galvanic (voltaic) cell runs a spontaneous redox reaction and turns chemical energy into electrical work, so its cell potential is positive and delta G is negative. An electrolytic cell uses an outside power source to force a nonspontaneous reaction, so the reaction it drives has a negative cell potential and a positive delta G. In both, oxidation happens at the anode, reduction happens at the cathode, and electrons travel through the wire from anode to cathode. What changes between the two is the sign printed on each electrode.

## The comparison table

| Feature | Galvanic (voltaic) | Electrolytic |
|---|---|---|
| Reaction | Spontaneous | Nonspontaneous, driven by a power supply |
| Energy conversion | Chemical to electrical | Electrical to chemical |
| E<sub>cell</sub> of the reaction | Positive | Negative |
| &Delta;G | Negative | Positive |
| Anode | Oxidation, labeled negative (-) | Oxidation, labeled positive (+) |
| Cathode | Reduction, labeled positive (+) | Reduction, labeled negative (-) |
| Electron flow in the wire | Anode to cathode | Anode to cathode (pushed by the supply) |
| Typical setup | Two half-cells joined by a salt bridge | Often one container, two electrodes in one electrolyte |
| Everyday example | A battery while it powers a device | Charging a battery, electroplating, electrolysis of molten NaCl |

The rows that never change are the useful anchors: anode means oxidation and cathode means reduction in every cell. A quick check: the two words that start with a vowel go together, and the two that start with a consonant go together.

![Side-by-side schematic of a galvanic cell and an electrolytic cell showing electrode signs and electron flow](assets/notes/galvanic-vs-electrolytic-cells.png "Electrons always leave the anode. Only the electrode sign labels flip between the two cell types.")

## Why the electrode signs flip

The sign labels confuse more students than anything else here, so think about where electrons pile up.

In a galvanic cell, the anode is where the reactant gives up electrons on its own. Those electrons collect on the anode metal before they flow away, so the anode is the electron-rich, negative terminal. The cathode is being drained of electrons by the species that is reduced there, so it is the positive terminal. That is why the flat end of a battery, which feeds electrons into your device, is the negative end.

In an electrolytic cell, the power supply decides. Its negative terminal pumps electrons into one electrode, and reduction happens there, so that electrode is the cathode and it is negative. The supply's positive terminal pulls electrons out of the other electrode, forcing oxidation, so the anode is positive. The definitions of anode and cathode did not change. Only the source of the push did.

## Where the ions go

Inside the cell, the circuit is completed by ions, not electrons. Cations drift toward the cathode and anions drift toward the anode. In a galvanic cell, the salt bridge exists to keep each half-cell electrically neutral: as the anode compartment fills with new cations, anions from the bridge move in, and as the cathode compartment loses cations to reduction, cations from the bridge move in. Remove the salt bridge and charge builds up within moments, and the current stops.

## Linking E, delta G and K

Three quantities tell you the same thing about spontaneity:

**&Delta;G&deg; = -nFE&deg;<sub>cell</sub>** and **&Delta;G&deg; = -RT ln K**

Here n is the moles of electrons transferred per mole of reaction and F is the Faraday constant, about 96,485 C per mole of electrons.

| E&deg;<sub>cell</sub> | &Delta;G&deg; | K | Direction under standard conditions |
|---|---|---|---|
| Positive | Negative | Greater than 1 | Forward, galvanic |
| Zero | Zero | Equal to 1 | At equilibrium |
| Negative | Positive | Less than 1 | Needs outside energy, electrolytic |

To find E&deg;<sub>cell</sub>, use E&deg;<sub>cell</sub> = E&deg;<sub>cathode</sub> - E&deg;<sub>anode</sub>, with both values written as standard reduction potentials. Do not multiply a potential by the coefficients in a balanced equation. Potential is energy per unit charge, an intensive property, so doubling the reaction doubles n and &Delta;G but leaves E unchanged.

## Worked example 1: a zinc and copper galvanic cell

Approximate standard reduction potentials: Cu<sup>2+</sup> + 2e<sup>-</sup> &rarr; Cu, E&deg; = +0.34 V. Zn<sup>2+</sup> + 2e<sup>-</sup> &rarr; Zn, E&deg; = -0.76 V.

1. The half-reaction with the higher reduction potential is reduced. Copper ions are reduced at the cathode, and zinc metal is oxidized at the anode.
2. E&deg;<sub>cell</sub> = 0.34 - (-0.76) = **+1.10 V**. Positive, so the cell is galvanic as written.
3. Two electrons move per zinc atom, so n = 2. &Delta;G&deg; = -(2)(96,485)(1.10) = about -212,000 J, or **-212 kJ per mole of reaction**.
4. The equilibrium constant is huge. At 25 C, log K = nE&deg;/0.0592 = (2)(1.10)/0.0592, about 37, so K is near 10<sup>37</sup>. The reaction goes essentially to completion.

Now move away from standard conditions with the Nernst equation at 25 C:

E = E&deg; - (0.0592/n) log Q

For Zn + Cu<sup>2+</sup> &rarr; Zn<sup>2+</sup> + Cu, Q = [Zn<sup>2+</sup>]/[Cu<sup>2+</sup>]. Suppose [Zn<sup>2+</sup>] = 1.0 M and [Cu<sup>2+</sup>] = 0.010 M. Then Q = 100 and log Q = 2:

E = 1.10 - (0.0592/2)(2) = 1.10 - 0.059 = **1.04 V**

Starving the cathode of its reactant lowers the voltage a little. As the cell discharges, Q rises, E falls, and when E reaches zero the cell is at equilibrium and the battery is dead.

## Worked example 2: electrolysis of molten sodium chloride

Sodium metal is made by passing current through molten NaCl. There is no water present, so only Na<sup>+</sup> and Cl<sup>-</sup> can react.

- Cathode (negative, reduction): Na<sup>+</sup> + e<sup>-</sup> &rarr; Na
- Anode (positive, oxidation): 2Cl<sup>-</sup> &rarr; Cl<sub>2</sub> + 2e<sup>-</sup>

Using standard reduction potentials as a rough guide (Na<sup>+</sup>/Na about -2.71 V, Cl<sub>2</sub>/Cl<sup>-</sup> about +1.36 V), E&deg; for the overall reaction is -2.71 - 1.36 = about -4.07 V. The negative value is the signature of an electrolytic process: the supply must provide at least about 4 V, and in practice more, to make the reaction run. (Molten salt at high temperature does not have exactly these standard aqueous values, so treat 4.07 V as an estimate.)

How much sodium forms? Faraday's law ties charge to moles. Run 2.0 A for 965 s:

1. Charge q = It = 2.0 &times; 965 = 1930 C.
2. Moles of electrons = 1930 / 96,485 = 0.0200 mol.
3. One electron per Na<sup>+</sup>, so 0.0200 mol Na forms, which is 0.0200 &times; 23.0 = **0.46 g of sodium**.
4. Two electrons per Cl<sub>2</sub>, so only 0.0100 mol of chlorine gas forms at the anode.

The general chain is current and time, to coulombs, to moles of electrons, to moles of product (divide by the electrons per product), to grams.

## Rechargeable batteries are both

A rechargeable battery is a galvanic cell while it discharges and an electrolytic cell while it charges. Charging pushes current backward through the cell and reverses the chemistry. Because anode and cathode are defined by the reaction, the physical electrode that was the anode during discharge becomes the cathode during charging. In a lead-acid car battery, for example, the lead electrode is oxidized during discharge and its lead sulfate is reduced back to lead during charging.

## Concentration cells

A concentration cell uses the same half-reaction on both sides, so E&deg;<sub>cell</sub> = 0. It still produces a voltage when the concentrations differ, because Q is not 1. Electrons flow so as to even out the concentrations: the dilute side is oxidized (making more ions) and the concentrated side is reduced (removing ions). The voltage reaches zero when the two sides match. A neuron's resting membrane potential follows the same Nernst logic, as covered in the [action potential note](action-potential-phases-ion-channels.html).

## Common traps

- **Assuming the anode is always negative.** True only for galvanic cells. In an electrolytic cell the anode is positive. Anchor on oxidation and reduction, not on signs.
- **Reversing electron flow in electrolysis.** Electrons go from anode to cathode through the external circuit in both cell types.
- **Multiplying E&deg; by stoichiometric coefficients.** Never. Scale n and &Delta;G, not E.
- **Subtracting in the wrong order.** E&deg;<sub>cell</sub> = E&deg;<sub>cathode</sub> - E&deg;<sub>anode</sub>, both as reduction potentials. If you flip the anode half-reaction to an oxidation, add instead, but do not do both.
- **Forgetting n in Faraday problems.** Two electrons per Cu<sup>2+</sup> or Cl<sub>2</sub>, three per Al<sup>3+</sup>. The same charge makes fewer moles of a product that needs more electrons.
- **Treating a positive E as fast.** E and &Delta;G describe whether a reaction can run, not how quickly.

## One-minute recap

Galvanic: spontaneous, E positive, &Delta;G negative, anode negative, cathode positive. Electrolytic: driven by a supply, E negative, &Delta;G positive, anode positive, cathode negative. In both, oxidation at the anode, reduction at the cathode, electrons through the wire from anode to cathode, cations toward the cathode. Use E&deg;<sub>cell</sub> = E&deg;<sub>cathode</sub> - E&deg;<sub>anode</sub>, &Delta;G = -nFE, and E = E&deg; - (0.0592/n) log Q at 25 C. For electrolysis, go from It to coulombs to moles of electrons to moles of product.

:::quiz
Q: In an electrolytic cell, which electrode is positive and what happens there?
A: The anode is positive because the supply's positive terminal pulls electrons from it, and oxidation happens there, just as in every cell.
Q: A cell has E°cell = +0.50 V with n = 2. What is the sign of ΔG° and is K greater or less than 1?
A: ΔG° = -nFE° is negative (about -96 kJ/mol), so the reaction is spontaneous and K is greater than 1.
Q: Given Ag+ + e- → Ag at +0.80 V and Cu2+ + 2e- → Cu at +0.34 V, what is E°cell for the galvanic cell?
A: Silver is reduced at the cathode and copper is oxidized at the anode, so E°cell = 0.80 - 0.34 = +0.46 V. The silver potential is not doubled even though two Ag+ are needed.
Q: How many grams of copper plate onto a cathode from Cu2+ when 1.00 A flows for 1930 s? (Cu = 63.5 g/mol)
A: 1930 C divided by 96,485 C/mol gives 0.0200 mol of electrons. Each Cu2+ needs 2, so 0.0100 mol Cu forms, about 0.635 g.
Q: In a concentration cell with 0.10 M and 1.0 M Cu2+ half-cells, which side is the anode?
A: The dilute 0.10 M side is the anode. Oxidizing copper there raises its Cu2+ concentration, which moves the two sides toward equal concentration.
:::

---
title: Nernst Equation and Equilibrium Potential for the MCAT
description: The Nernst equation for equilibrium potential, the shortcut form at body temperature, worked K+ and Na+ examples, and how it differs from the resting potential.
product: 2a-cells-membranes
published: 2026-11-04
related: action-potential-phases-ion-channels, passive-vs-active-transport, galvanic-vs-electrolytic-cells, goldman-equation-resting-membrane-potential-mcat
seo_title: Nernst Equation and Equilibrium Potential Formula (MCAT)
seo_description: Equilibrium potential formula and the Nernst equation on the MCAT: shortcut form, worked K+ and Na+ examples, sign rules and common traps.
---

The **equilibrium potential** of an ion is the membrane voltage at which the electrical force on that ion exactly balances its concentration gradient, so there is no net movement. The **Nernst equation** calculates it for one ion at a time: E = (RT/zF) ln([ion]<sub>out</sub>/[ion]<sub>in</sub>). Yes, the Nernst equation is on the MCAT, usually as a membrane potential or electrochemistry passage, and the shortcut form below is the version you will actually use.

## The formula and its shortcut

- **Full form:** E<sub>ion</sub> = (RT/zF) ln([out]/[in])
- **Base-10 form at 37 C:** E<sub>ion</sub> = (61.5 mV / z) log<sub>10</sub>([out]/[in])
- **Rounded for exam math:** use about 60 mV, or 58 mV at 25 C.

Here z is the charge of the ion (+1 for Na<sup>+</sup> and K<sup>+</sup>, +2 for Ca<sup>2+</sup>, -1 for Cl<sup>-</sup>). Keep the ratio as **outside over inside** and let z carry the sign. Many people reverse the ratio for anions; that is unnecessary if z is -1.

## Worked example: potassium

Typical neuron: [K<sup>+</sup>]<sub>out</sub> = 5 mM, [K<sup>+</sup>]<sub>in</sub> = 150 mM.

E<sub>K</sub> = 61.5 log<sub>10</sub>(5/150) = 61.5 x log<sub>10</sub>(0.0333) = 61.5 x (-1.48) = about **-90 mV**.

Interpretation: K<sup>+</sup> is concentrated inside, so it tends to leak out, leaving the inside negative. At -90 mV the inward electrical pull exactly cancels the outward chemical push.

## Worked example: sodium

[Na<sup>+</sup>]<sub>out</sub> = 145 mM, [Na<sup>+</sup>]<sub>in</sub> = 15 mM.

E<sub>Na</sub> = 61.5 log<sub>10</sub>(145/15) = 61.5 x 0.985 = about **+60 mV**.

Na<sup>+</sup> is concentrated outside, so it wants to flow in, and the inside would have to be positive to hold it back.

## A quick way to estimate without a calculator

Each **tenfold** concentration ratio is worth about 60 mV for a monovalent ion. A ratio of 30 is a bit over one factor of ten, so roughly 60 to 90 mV. Always decide the **sign** first (cation concentrated outside means positive, cation concentrated inside means negative), then estimate the size.

## Equilibrium potential vs resting membrane potential

| | Equilibrium (Nernst) potential | Resting membrane potential |
|---|---|---|
| Applies to | One ion | All ions together |
| Equation | Nernst | Goldman-Hodgkin-Katz |
| Depends on | Concentration ratio and charge | Ratios weighted by each ion's permeability |
| Neuron value | K<sup>+</sup> about -90 mV, Na<sup>+</sup> about +60 mV | About -70 mV |

The resting potential sits near E<sub>K</sub> because the resting membrane is far more permeable to K<sup>+</sup> than to Na<sup>+</sup>. It is a little less negative than E<sub>K</sub> because of the small Na<sup>+</sup> leak. During the action potential, Na<sup>+</sup> permeability surges, and the membrane voltage moves toward E<sub>Na</sub>.

## Driving force

**Driving force = V<sub>m</sub> - E<sub>ion</sub>.** It tells you the direction and strength of net ion flow when channels open.

At V<sub>m</sub> = -70 mV and E<sub>Na</sub> = +60 mV, the driving force on Na<sup>+</sup> is -130 mV, a large inward push. For K<sup>+</sup> it is -70 - (-90) = +20 mV, a small outward push. This is why opening Na<sup>+</sup> channels produces a big, fast current and opening K<sup>+</sup> channels a smaller one.

## Link to electrochemistry

The same logic appears in galvanic cells. The cell version is E = E&deg; - (RT/nF) ln Q, which at equilibrium (E = 0) gives the relationship between E&deg; and K. A membrane is a concentration cell: the same ion on both sides, with the "cell potential" set only by the concentration ratio.

## Common traps

- **Using Nernst for the resting potential.** Nernst is for one ion. Several permeable ions need Goldman.
- **Flipping the ratio.** Use outside over inside, with the sign of z.
- **Ignoring z.** Ca<sup>2+</sup> has half the slope of a monovalent ion.
- **Forgetting the pump.** The Na<sup>+</sup>/K<sup>+</sup> ATPase builds the gradients; the Nernst potential is set by them, not by the pump's electrogenic contribution.
- **Mixing up direction and sign.** A negative equilibrium potential means the inside is negative at equilibrium, not that ions flow out.

## One-minute recap

- E = (61.5 mV / z) log([out]/[in]) at 37 C.
- E<sub>K</sub> is about -90 mV, E<sub>Na</sub> about +60 mV in a typical neuron.
- Resting potential (about -70 mV) is closest to E<sub>K</sub> because of K<sup>+</sup> permeability.
- Driving force = V<sub>m</sub> - E<sub>ion</sub>.

:::quiz
Q: What is the equilibrium potential for a monovalent cation with a 10-to-1 outside-to-inside concentration ratio at 37 C?
A: About +61 mV, since log(10) = 1 and the slope is 61.5 mV per tenfold ratio.
Q: Why is the resting membrane potential closer to E_K than to E_Na?
A: The resting membrane is much more permeable to K+ than to Na+, so K+ dominates the Goldman equation.
Q: If V_m is -70 mV and E_Cl is -70 mV, what is the net movement of Cl-?
A: None. The driving force is zero, so Cl- is at equilibrium.
Q: Which equation handles more than one permeant ion?
A: The Goldman-Hodgkin-Katz equation, which weights each ion by its permeability.
Q: What is the driving force on Na+ at V_m = -70 mV when E_Na is +60 mV?
A: -130 mV (V_m minus E_Na), a large inward push.
:::

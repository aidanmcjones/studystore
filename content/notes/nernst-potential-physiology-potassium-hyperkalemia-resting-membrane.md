---
title: Nernst Potential in Physiology: Why K+ Sets the Resting Membrane Potential
description: Apply the Nernst equation to K+, Na+, Cl- and Ca2+ in real cells, see why resting potential sits near E(K), and predict what hyperkalemia does to excitability.
product: 3a-nervous-endocrine
published: 2026-11-09
related: nernst-equation-equilibrium-potential-mcat, goldman-equation-resting-membrane-potential-mcat, action-potential-phases-ion-channels
seo_title: Nernst Potential in Physiology: K+ and Resting Membrane Potential
seo_description: How equilibrium potentials for K+, Na+, Cl- and Ca2+ drive the resting membrane potential, and what happens to excitability in hyperkalemia.
---

The Nernst potential for an ion is the membrane voltage at which its electrical and chemical driving forces cancel. In physiology, that single number tells you which way an ion will move when its channels open, and it explains why a neuron at rest sits close to the potassium equilibrium potential. At body temperature the equation simplifies to **E<sub>ion</sub> = (61.5 / z) log([ion]<sub>out</sub> / [ion]<sub>in</sub>) mV**, where z is the ion's charge. The core derivation is in the <a href="nernst-equation-equilibrium-potential-mcat.html">Nernst equation note</a>. This note applies it.

## Typical mammalian values

| Ion | Inside (mM) | Outside (mM) | E (mV) |
|---|---|---|---|
| K<sup>+</sup> | 140 | 5 | about -90 |
| Na<sup>+</sup> | 15 | 145 | about +60 |
| Cl<sup>-</sup> | 10 | 110 | about -64 |
| Ca<sup>2+</sup> | 0.0001 | 2 | about +130 |

Check the sign pattern: cations that are more concentrated outside have positive E, and cations that are more concentrated inside have negative E. Anions flip the sign through z.

## Why the resting potential is near E(K)

At rest the membrane has many open K<sup>+</sup> leak channels and few open Na<sup>+</sup> channels. Each ion pulls the membrane toward its own equilibrium potential in proportion to its permeability, which is the idea behind the <a href="goldman-equation-resting-membrane-potential-mcat.html">Goldman equation</a>. K<sup>+</sup> dominates, so the resting potential is around -70 mV, near E<sub>K</sub> = -90 mV but nudged upward by a small Na<sup>+</sup> leak. The Na<sup>+</sup>/K<sup>+</sup> ATPase does not create the resting voltage directly. It maintains the concentration gradients that the Nernst potentials depend on.

## Driving force and direction of flow

The driving force on an ion is **V<sub>m</sub> - E<sub>ion</sub>**. Positive driving force on a cation means it exits, and negative means it enters.

At V<sub>m</sub> = -70 mV:

- Na<sup>+</sup>: -70 - 60 = -130 mV, a large inward push when channels open, which depolarizes the cell.
- K<sup>+</sup>: -70 - (-90) = +20 mV, a small outward push.
- Cl<sup>-</sup>: depends on the sign convention, but E<sub>Cl</sub> is close to rest, so there is little net movement.

An action potential upstroke is Na<sup>+</sup> entry pushing V<sub>m</sub> toward E<sub>Na</sub>. The downstroke is K<sup>+</sup> exit pushing it back toward E<sub>K</sub>. See <a href="action-potential-phases-ion-channels.html">action potential phases</a> for the sequence.

## Worked example 1: hyperkalemia

Serum K<sup>+</sup> rises from 5 to 8 mM, while intracellular K<sup>+</sup> stays 140 mM. The new E<sub>K</sub> is 61.5 log(8/140) = 61.5 &times; (-1.24) = about **-76 mV**. The resting potential moves from near -70 mV (set by a balance with Na<sup>+</sup>) to a less negative value, so it is closer to threshold. Initially, cells become more excitable. With prolonged depolarization, voltage-gated Na<sup>+</sup> channels inactivate and cells become harder to excite, which is why severe hyperkalemia causes muscle weakness and cardiac arrhythmias.

## Worked example 2: hypokalemia

Serum K<sup>+</sup> falls to 3 mM. E<sub>K</sub> = 61.5 log(3/140) = 61.5 &times; (-1.67) = about **-103 mV**. The membrane hyperpolarizes, so it is farther from threshold and harder to excite, which fits the cramping and weakness of hypokalemia.

## Worked example 3: a tenfold gradient

If a cation with z = +1 is 10 times more concentrated outside, E = 61.5 log 10 = +61.5 mV. For a divalent cation (z = +2) with the same ratio, E is half as large, about +31 mV. Each tenfold change in the concentration ratio shifts E by 61.5/z mV.

## When Nernst does not apply

The Nernst equation describes one ion at equilibrium. A real cell at rest is not at equilibrium for Na<sup>+</sup> or K<sup>+</sup>, because ions keep leaking and the pump keeps restoring them. Use Goldman when more than one ion contributes, and Nernst when asked about a single ion or a driving force.

## Common traps

- **Using ln instead of log.** The 61.5 mV form uses log<sub>10</sub> (at 37 &deg;C).
- **Flipping the ratio.** Use outside over inside for the sign convention above.
- **Ignoring z.** Divalent ions such as Ca<sup>2+</sup> have half the slope.
- **Saying the pump sets the resting voltage.** The leak channels set it, and the pump maintains the gradients.
- **Assuming any rise in extracellular K<sup>+</sup> raises excitability forever.** Prolonged depolarization inactivates Na<sup>+</sup> channels.

## One-minute recap

E<sub>ion</sub> = (61.5/z) log(out/in). K<sup>+</sup> is about -90 mV, Na<sup>+</sup> about +60 mV, Cl<sup>-</sup> about -64 mV, and Ca<sup>2+</sup> about +130 mV. Resting potential sits near E<sub>K</sub> because K<sup>+</sup> leak channels dominate. Driving force is V<sub>m</sub> - E<sub>ion</sub>. Raising extracellular K<sup>+</sup> depolarizes the cell, and lowering it hyperpolarizes it.

*Want this topic as spaced-repetition cards? The [matching StudyStore MCAT pack](../products/3a-nervous-endocrine.html?utm_source=site-cta) has original Anki cards, a study guide and practice questions for it.*

:::quiz
Q: Why does the resting membrane potential sit close to E(K) rather than E(Na)?
A: The resting membrane is far more permeable to K+ through leak channels than to Na+, so K+ dominates the potential.
Q: If extracellular K+ rises while intracellular K+ stays constant, what happens to E(K)?
A: E(K) becomes less negative, which depolarizes the cell and moves it toward threshold.
Q: What is E for a monovalent cation that is 10 times more concentrated outside the cell than inside?
A: E = 61.5 log(10) = +61.5 mV.
Q: Does the Na+/K+ ATPase directly create the resting membrane potential?
A: Not mainly. Its role is to maintain the Na+ and K+ gradients, and the leak currents set the voltage.
Q: Severe, prolonged hyperkalemia causes muscle weakness. Why, if depolarization moves cells toward threshold?
A: Sustained depolarization inactivates voltage-gated Na+ channels, so the cells cannot fire action potentials.
:::

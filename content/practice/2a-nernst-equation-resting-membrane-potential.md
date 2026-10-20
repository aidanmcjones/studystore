---
title: MCAT Nernst Equation and Resting Membrane Potential Practice Questions
description: Eight free MCAT-style practice questions with worked calculations on equilibrium potentials, the Nernst and Goldman equations, ion driving forces and what sets the resting membrane potential.
aamc: 2A
category: 2a-cells-membranes
cluster: Membrane potential, Nernst equation, Goldman equation, driving force
product: 2a-cells-membranes
published: 2026-10-20
notes:
---

The Nernst equation gives the voltage at which an ion's concentration gradient is exactly balanced by the electrical gradient. At 37 degrees C and with base-10 logs it simplifies to E = (61.5 mV / z) x log([ion]out / [ion]in), where z is the ion's charge. Typical mammalian neuron concentrations (mM) are K+ about 5 out and 140 in, Na+ about 145 out and 15 in, Cl- about 110 out and 10 in, and Ca2+ about 2 out and 0.0001 in.

The resting membrane potential is not set by one ion but by the relative permeabilities, as captured by the Goldman-Hodgkin-Katz equation. At rest the membrane is far more permeable to K+ than to Na+, so the resting potential (about -70 mV) sits close to E(K) and far from E(Na). When a channel opens, the ion moves in the direction that pushes the membrane potential toward that ion's equilibrium potential; the driving force is Vm minus E(ion).

Traps: remember the sign of z for anions, the factor of 2 for Ca2+, and that the Na+/K+ pump contributes only a few millivolts directly.

@@QUESTIONS

### Q1
Using E = 61.5 log([out]/[in]) mV for a monovalent cation, what is the equilibrium potential for K+ when [K+]out = 5 mM and [K+]in = 140 mM?
A) -89 mV
B) -61 mV
C) +89 mV
D) -173 mV
ANSWER: A
WHY: The ratio out/in is 5/140 = 0.0357, and log(0.0357) = -1.447. Multiplying by 61.5 gives -89 mV. The negative sign makes sense: K+ tends to leave the cell down its concentration gradient, which makes the inside negative until the electrical force balances it.

### Q2
With [Na+]out = 145 mM and [Na+]in = 15 mM, what is the approximate equilibrium potential for Na+?
A) -61 mV
B) +61 mV
C) +145 mV
D) 0 mV
ANSWER: B
WHY: The ratio is 145/15 = 9.67, log(9.67) = 0.985, and 61.5 x 0.985 is about +61 mV. Na+ is more concentrated outside, so it tends to enter the cell and make the inside positive until the positive interior repels further entry.

### Q3
For Cl-, which has z = -1, [Cl-]out = 110 mM and [Cl-]in = 10 mM. What is E(Cl)?
A) -64 mV
B) -640 mV
C) +64 mV
D) +6.4 mV
ANSWER: A
WHY: For an anion, use E = (61.5 / -1) x log(110/10) = -61.5 x log(11) = -61.5 x 1.041 = -64 mV. Chloride is more concentrated outside, so it tends to enter and make the inside more negative. Forgetting the negative charge would give the wrong sign (choice C).

### Q4
Intracellular free Ca2+ is about 100 nM (0.0001 mM) and extracellular Ca2+ is about 2 mM. What is the approximate equilibrium potential for Ca2+ (z = +2)?
A) +132 mV
B) +264 mV
C) +66 mV
D) -132 mV
ANSWER: A
WHY: The concentration ratio out/in is 2 / 0.0001 = 20,000, and log(20,000) = 4.30. With z = 2, E = (61.5 / 2) x 4.30 = 30.75 x 4.30 = +132 mV. Dividing by z = 2 halves the result compared with a monovalent ion. Ca2+ equilibrium is strongly positive, so the large inward gradient is why Ca2+ channels open to produce a large influx.

### Q5
In a neuron with a resting potential of about -70 mV, the extracellular K+ rises from 5 mM to 10 mM (intracellular K+ stays 140 mM). What is the most likely effect on the resting membrane potential?
A) Depolarization, because E(K) rises from about -89 mV to about -70 mV
B) Hyperpolarization to about -89 mV
C) No change, because K+ does not affect the resting potential
D) Hyperpolarization, because more K+ outside drives more K+ into the cell
ANSWER: A
WHY: E(K) = 61.5 log(10/140) = 61.5 x (-1.146) = -70 mV, less negative than the original -89 mV. Because the resting potential is largely determined by K+, the membrane potential moves toward the new E(K) and the cell depolarizes. This is why hyperkalemia affects excitable tissues such as the heart.

### Q6
At the peak of an action potential in a neuron where E(Na) = +61 mV and E(K) = -89 mV, which statement is correct?
A) The membrane potential reaches about +120 mV
B) The membrane potential approaches E(K)
C) The membrane potential approaches E(Na) but cannot exceed it
D) The membrane potential is 0 mV in all neurons
ANSWER: C
WHY: During the rising phase, Na+ permeability becomes much greater than K+ permeability, so the Goldman equation approaches E(Na). The membrane potential approaches +61 mV but typically peaks somewhat below it (around +30 to +40 mV) because Na+ channels inactivate and K+ channels begin opening. It cannot exceed E(Na) because at that voltage there is no net driving force for Na+ entry.

### Q7
The Na+/K+ ATPase is electrogenic (3 Na+ out, 2 K+ in). If the pump is acutely inhibited with ouabain for a few seconds, what happens to the resting potential?
A) It depolarizes slightly, by a few millivolts, because the main contribution to resting potential is the K+ gradient and leak channels
B) It collapses to 0 mV immediately
C) It hyperpolarizes substantially
D) It becomes equal to E(Na)
ANSWER: A
WHY: The pump's direct electrical contribution is small, a few millivolts, because it moves only one net charge per cycle. Its major role is maintaining the ion gradients that determine the Nernst potentials. Over many minutes without the pump the gradients run down and the potential collapses, but acutely the change is small.

### Q8
At a membrane potential of -70 mV, with E(K) = -89 mV and E(Na) = +61 mV, what is the direction of net ion movement when voltage-insensitive K+ and Na+ channels are both open?
A) Both flow outward
B) Both flow inward
C) K+ flows outward and Na+ flows inward
D) K+ flows inward and Na+ flows outward
ANSWER: C
WHY: The driving force for an ion is Vm - E(ion). For K+: -70 - (-89) = +19 mV, a positive value, so K+ flows out. For Na+: -70 - 61 = -131 mV, a negative value, so Na+ flows in. The much larger driving force on Na+ explains why even a small Na+ permeability produces a big depolarizing current.

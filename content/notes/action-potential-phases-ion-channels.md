---
title: Action Potential Phases and Ion Channels, Step by Step
description: Walk through each action potential phase, which voltage-gated channel opens or closes, why refractory periods exist, and how Nernst potentials set the limits.
product: 3a-nervous-endocrine
published: 2026-10-20
related: passive-vs-active-transport, galvanic-vs-electrolytic-cells
---

An action potential is a brief, all-or-none reversal of a neuron's membrane voltage. It runs in five phases: the cell rests near -70 mV, a stimulus depolarizes it to threshold (roughly -55 mV), voltage-gated Na<sup>+</sup> channels open and Na<sup>+</sup> rushes in to push the voltage toward +30 mV or so, the Na<sup>+</sup> channels inactivate while voltage-gated K<sup>+</sup> channels open and K<sup>+</sup> leaves to repolarize the cell, and the slow-closing K<sup>+</sup> channels briefly overshoot the resting value (hyperpolarization). The exact millivolt values vary between cell types, so learn the sequence and the reasons rather than the decimals.

## Phase by phase

| Phase | Approximate voltage | What the channels are doing | Ion movement |
|---|---|---|---|
| Resting | About -70 mV | K<sup>+</sup> leak channels open; voltage-gated Na<sup>+</sup> and K<sup>+</sup> channels closed | Small K<sup>+</sup> leak out, smaller Na<sup>+</sup> leak in |
| Depolarization to threshold | -70 to about -55 mV | Stimulus (synaptic input or a neighboring patch of membrane) opens some Na<sup>+</sup> channels | Na<sup>+</sup> in |
| Rising phase | -55 up to about +30 mV | Voltage-gated Na<sup>+</sup> channels open fast, a positive feedback loop | Large Na<sup>+</sup> influx |
| Falling phase (repolarization) | Peak back down toward rest | Na<sup>+</sup> channels inactivate; voltage-gated K<sup>+</sup> channels, which open slowly, are now open | K<sup>+</sup> efflux |
| Hyperpolarization (undershoot) | Briefly below rest, toward -80 to -90 mV | Voltage-gated K<sup>+</sup> channels are slow to close | Extra K<sup>+</sup> efflux, then return to rest |

The rising phase is self-reinforcing. Opening some Na<sup>+</sup> channels lets Na<sup>+</sup> in, which depolarizes the membrane further, which opens more Na<sup>+</sup> channels. Threshold is simply the voltage at which this loop beats the outward K<sup>+</sup> leak and becomes unstoppable. Below threshold, the leak wins and the membrane drifts back to rest. That is the reason the response is all or none.

![Simulated action potential with the voltage trace and the sodium and potassium conductances below it](assets/notes/action-potential-phases-ion-channels.png "Computed from the Hodgkin-Huxley model with squid axon parameters, which rests near -65 mV. Sodium conductance rises and falls first; potassium conductance rises later and lingers, causing the undershoot.")

## The sodium channel has two gates

The voltage-gated Na<sup>+</sup> channel is the key to the whole shape. Think of it as having an activation gate and an inactivation gate, and it passes ions only when the activation gate is open and the inactivation gate has not yet closed.

- **Closed (at rest):** activation gate shut, inactivation gate open. Ready to fire.
- **Open (rising phase):** depolarization flips the activation gate open within a fraction of a millisecond.
- **Inactivated (peak and falling phase):** the inactivation gate plugs the pore about a millisecond after opening. The channel cannot reopen in this state, no matter how depolarized the membrane is.
- **Reset:** only after the membrane repolarizes does the inactivation gate reopen and the activation gate close, returning the channel to the closed, ready state.

The voltage-gated K<sup>+</sup> channel is simpler: one gate that opens slowly in response to depolarization and closes slowly after repolarization. Its delay is what lets Na<sup>+</sup> dominate first and K<sup>+</sup> dominate second.

## Refractory periods

- **Absolute refractory period:** from the rising phase until most Na<sup>+</sup> channels have reset. Too many channels are inactivated, so no stimulus of any size can trigger a second spike.
- **Relative refractory period:** during the undershoot. Enough Na<sup>+</sup> channels have reset, but extra K<sup>+</sup> channels are still open and the membrane sits further from threshold. A stronger than normal stimulus can fire the cell.

Refractoriness has two consequences. It caps how fast a neuron can fire, and it makes conduction one-way along the axon: the patch just behind the spike is refractory, so the impulse can only spread forward into fresh membrane.

Because every spike in a given neuron is the same size, a stronger stimulus is not encoded by a bigger spike. It is encoded by a higher firing frequency, and by recruiting more neurons.

## Why the limits are the Nernst potentials

Each ion pulls the membrane toward its own equilibrium potential, the voltage at which its concentration gradient and the electrical force on it balance. At body temperature (37 C), the Nernst equation is about:

E<sub>ion</sub> = (61.5 mV / z) &times; log([ion]<sub>outside</sub> / [ion]<sub>inside</sub>)

Using typical mammalian values (they vary by cell type):

- **K<sup>+</sup>:** 5 mM outside, 140 mM inside. E<sub>K</sub> = 61.5 &times; log(5/140) = 61.5 &times; (-1.45), about **-89 mV**.
- **Na<sup>+</sup>:** 145 mM outside, 15 mM inside. E<sub>Na</sub> = 61.5 &times; log(145/15) = 61.5 &times; 0.985, about **+61 mV**.

The resting potential of about -70 mV sits close to E<sub>K</sub> because at rest the membrane is far more permeable to K<sup>+</sup> than to Na<sup>+</sup>. It is not exactly E<sub>K</sub> because the small Na<sup>+</sup> leak drags it upward. During the rising phase, Na<sup>+</sup> permeability jumps far above K<sup>+</sup> permeability, so the voltage heads toward E<sub>Na</sub>. It peaks short of +61 mV because Na<sup>+</sup> channels inactivate and K<sup>+</sup> channels open before it gets there. The undershoot approaches E<sub>K</sub> because K<sup>+</sup> permeability is temporarily even higher than at rest. The whole spike lives between these two limits. The Goldman equation makes this weighting quantitative, but the qualitative rule is enough for most questions: the membrane potential lies closest to the equilibrium potential of the ion it is most permeable to.

### Worked example: raising extracellular potassium

If blood K<sup>+</sup> rises from 5 to 8 mM (hyperkalemia), E<sub>K</sub> becomes 61.5 &times; log(8/140), about -76 mV. The resting potential depolarizes along with it, moving closer to threshold. A small rise makes cells easier to fire. A sustained, larger depolarization does the opposite: it holds Na<sup>+</sup> channels in the inactivated state, so fewer are available, and excitability falls. This is why potassium disturbances are dangerous for heart rhythm.

### Worked example: how many ions actually move?

Membrane capacitance is about 1 &micro;F per cm<sup>2</sup>. Changing the voltage by 100 mV moves a charge of 1 &times; 10<sup>-6</sup> F &times; 0.1 V = 1 &times; 10<sup>-7</sup> C per cm<sup>2</sup>, which is about 1 &times; 10<sup>-12</sup> mol of monovalent ions (divide by 96,485 C/mol). For a spherical cell 20 &micro;m across with 15 mM Na<sup>+</sup> inside, that is a rise of only about 0.02 percent in internal Na<sup>+</sup>. A single action potential barely touches the concentration gradients. The Na<sup>+</sup>/K<sup>+</sup> ATPase maintains those gradients over the long run, but it is not what repolarizes each spike. Repolarization comes from K<sup>+</sup> channels.

## Conduction speed

Two features speed an action potential along an axon:

1. **Larger diameter** lowers internal resistance, so current spreads farther ahead of the spike.
2. **Myelin** insulates the axon and lowers its capacitance, so charge is not wasted on the internodes. Voltage-gated Na<sup>+</sup> channels cluster at the nodes of Ranvier, and the spike is regenerated only there. It appears to jump from node to node, which is called saltatory conduction. Oligodendrocytes make myelin in the central nervous system and Schwann cells make it in the peripheral nervous system.

Losing myelin, as in multiple sclerosis, slows or blocks conduction because current leaks out of the bare stretches before it reaches the next node.

## Drugs and toxins that make sense once you know the channels

- **Tetrodotoxin** (from pufferfish) blocks voltage-gated Na<sup>+</sup> channels, so no rising phase can occur.
- **Local anesthetics** such as lidocaine also block voltage-gated Na<sup>+</sup> channels, stopping pain fibers from conducting.
- Blocking voltage-gated K<sup>+</sup> channels slows repolarization and widens the spike.

## Common traps

- **Saying the Na<sup>+</sup>/K<sup>+</sup> pump repolarizes the cell.** It does not. Voltage-gated K<sup>+</sup> channels do. The pump sustains gradients over time.
- **Saying the peak equals E<sub>Na</sub>.** The peak approaches E<sub>Na</sub> but stops short.
- **Thinking stronger stimuli make bigger spikes.** Intensity is coded by frequency.
- **Mixing up inactivated and closed.** An inactivated Na<sup>+</sup> channel cannot open. A closed one can.
- **Getting ion directions backward.** Na<sup>+</sup> moves in, K<sup>+</sup> moves out, because Na<sup>+</sup> is concentrated outside and K<sup>+</sup> inside.
- **Assuming myelin covers the nodes.** The nodes are the gaps where the channels are.

## One-minute recap

Rest near -70 mV (close to E<sub>K</sub>, set by K<sup>+</sup> leak). Threshold near -55 mV starts a positive feedback loop of Na<sup>+</sup> channel opening. Na<sup>+</sup> rushes in, the voltage heads toward E<sub>Na</sub> (+61 mV) but peaks lower. Na<sup>+</sup> channels inactivate and slow K<sup>+</sup> channels open, so K<sup>+</sup> leaves and the cell repolarizes, then undershoots toward E<sub>K</sub>. Inactivated Na<sup>+</sup> channels cause the absolute refractory period; lingering K<sup>+</sup> current causes the relative one. Myelin and wide axons speed conduction.

:::quiz
Q: What causes the absolute refractory period?
A: Voltage-gated Na+ channels are inactivated, and they cannot reopen until the membrane repolarizes and they reset, so no stimulus can fire a second spike.
Q: Which channels are mainly responsible for the falling phase of the action potential?
A: Voltage-gated K+ channels, which open slowly after depolarization and let K+ flow out, while Na+ channels inactivate.
Q: Why is the resting membrane potential closer to EK than to ENa?
A: At rest the membrane is much more permeable to K+ (through leak channels) than to Na+, and the potential lies closest to the equilibrium potential of the most permeant ion.
Q: Using 61.5 mV per tenfold ratio, what is ENa if extracellular Na+ is 140 mM and intracellular Na+ is 14 mM?
A: The ratio is 10, so ENa = 61.5 x log(10) = +61.5 mV.
Q: Why does the hyperpolarization (undershoot) occur after an action potential?
A: Voltage-gated K+ channels close slowly, so for a short time K+ permeability is higher than at rest and the membrane moves closer to EK, about -89 mV.
:::

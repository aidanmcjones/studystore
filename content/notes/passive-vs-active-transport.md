---
title: Passive vs Active Transport: Types, Examples and Energy Math
description: Sort simple diffusion, facilitated diffusion, primary and secondary active transport by energy source, direction and kinetics, with a worked sodium-glucose example.
product: 2a-cells-membranes
published: 2026-10-20
related: action-potential-phases-ion-channels, michaelis-menten-and-lineweaver-burk, glycolysis-steps-enzymes-net-atp
---

Passive transport moves a substance down its electrochemical gradient and needs no energy input from the cell. Active transport moves a substance up (against) its gradient and must be paid for, either directly by ATP hydrolysis (primary active transport) or by letting another ion, usually Na<sup>+</sup>, run down its own gradient (secondary active transport). The question that sorts every case is the same: which way is the substance going relative to its gradient, and what pays for it?

## The four categories at a glance

| Type | Direction | Energy source | Protein needed? | Saturable? | Examples |
|---|---|---|---|---|---|
| Simple diffusion | Down the gradient | None (the gradient itself) | No | No | O<sub>2</sub>, CO<sub>2</sub>, steroid hormones crossing the bilayer |
| Facilitated diffusion | Down the gradient | None | Yes, a channel or a carrier | Yes | GLUT transporters for glucose, K<sup>+</sup> leak channels, aquaporins for water |
| Primary active transport | Up the gradient | ATP hydrolysis by the transporter itself | Yes, an ATPase pump | Yes | Na<sup>+</sup>/K<sup>+</sup> ATPase, Ca<sup>2+</sup> ATPases, H<sup>+</sup>/K<sup>+</sup> ATPase of stomach parietal cells |
| Secondary active transport | One solute up, its partner down | A pre-existing ion gradient (built by a primary pump) | Yes, a cotransporter | Yes | SGLT1 (Na<sup>+</sup> with glucose), Na<sup>+</sup>/Ca<sup>2+</sup> exchanger, Na<sup>+</sup>/H<sup>+</sup> exchanger |

Osmosis, the movement of water across a membrane toward the side with more solute particles, is a special case of passive transport. Water diffuses through the bilayer slowly and through aquaporins quickly, but either way no energy is spent.

## Passive transport: simple versus facilitated

**Simple diffusion** works for molecules that can dissolve in the hydrophobic core of the membrane: small, nonpolar, uncharged ones such as oxygen, carbon dioxide, and lipid-soluble hormones. The rate is proportional to the concentration difference across the membrane, so doubling the gradient doubles the flux, with no ceiling.

**Facilitated diffusion** helps polar molecules and ions that the bilayer blocks. The protein lowers the barrier, but the direction is still set by the gradient, and the protein never pushes anything uphill.

- **Channels** form a pore. Ion channels are often selective and gated (opened by voltage, a ligand, or mechanical force). They pass ions very fast.
- **Carriers** bind the solute, change shape, and release it on the other side. GLUT1 on red blood cells and GLUT4 in muscle and fat (moved to the surface in response to insulin) are carriers for glucose.

Because carriers have a limited number of binding sites, facilitated diffusion saturates. At high solute concentration, every carrier is busy, and the rate levels off at a maximum. The curve looks just like enzyme kinetics, and you can read it the same way as in the [Michaelis-Menten note](michaelis-menten-and-lineweaver-burk.html): a maximum rate, and a concentration that gives half of it.

![Transport rate versus solute concentration for simple diffusion and carrier-mediated transport](assets/notes/passive-vs-active-transport.png "Simple diffusion rises in a straight line. Carrier transport saturates at Jmax, and reaches half of it at the carrier's K value. Values are illustrative.")

## Primary active transport

A primary active transporter hydrolyzes ATP itself and uses that energy to move ions against their gradients. The most important one is the **Na<sup>+</sup>/K<sup>+</sup> ATPase**:

- Each cycle moves 3 Na<sup>+</sup> out of the cell and 2 K<sup>+</sup> into it, for one ATP.
- It is electrogenic: one net positive charge leaves per cycle, which makes a small direct contribution to the negative resting potential.
- Its main job is building and keeping the gradients: high Na<sup>+</sup> outside, high K<sup>+</sup> inside. Those gradients power secondary transport, set the resting potential through K<sup>+</sup> leak, and help control cell volume.
- Inhibiting it (the cardiac glycoside digoxin does this) lets the gradients run down over time.

Other primary pumps include the Ca<sup>2+</sup> ATPases that keep cytosolic calcium very low (in the plasma membrane and in the sarcoplasmic reticulum of muscle) and the H<sup>+</sup>/K<sup>+</sup> ATPase that acidifies the stomach.

## Secondary active transport

A secondary active transporter uses no ATP directly. It couples the downhill movement of one ion to the uphill movement of another solute. The energy was stored earlier, when a primary pump built the ion gradient.

- **Symport (cotransport):** both move the same direction. SGLT1 in the small intestine carries 2 Na<sup>+</sup> and 1 glucose into the cell together, pulling glucose in even when the cell already holds more glucose than the gut lumen.
- **Antiport (exchange):** they move in opposite directions. The Na<sup>+</sup>/Ca<sup>2+</sup> exchanger lets 3 Na<sup>+</sup> in while pushing 1 Ca<sup>2+</sup> out.

If the Na<sup>+</sup>/K<sup>+</sup> ATPase stops, secondary transport fails too, because its power source drains away. That link is a favorite reasoning question.

### How intestinal cells absorb glucose

Glucose absorption uses three transport types in one cell. SGLT1 on the gut-facing membrane brings glucose in by secondary active transport. GLUT2 on the blood-facing membrane lets glucose leave by facilitated diffusion, down the gradient SGLT1 created. The Na<sup>+</sup>/K<sup>+</sup> ATPase on the blood-facing side pumps the incoming Na<sup>+</sup> back out by primary active transport, keeping the Na<sup>+</sup> gradient that drives the whole system.

## Worked example: how far can sodium push glucose?

The free energy change for moving one mole of a solute into a cell is:

&Delta;G = RT ln([inside]/[outside]) + zF&Delta;V

where &Delta;V is the membrane potential (inside relative to outside). At body temperature, RT is about 2.58 kJ/mol, and RT ln 10 is about 5.9 kJ/mol.

**Step 1: the cost of concentrating glucose.** Glucose is uncharged, so only the concentration term counts. Moving it into a cell that already has 10 times more inside than outside costs about +5.9 kJ/mol. Each further tenfold costs another 5.9 kJ/mol.

**Step 2: the energy released by Na<sup>+</sup> entry.** Take 145 mM Na<sup>+</sup> outside, 15 mM inside, and a membrane potential of -70 mV.

- Concentration term: RT ln(15/145) = 2.58 &times; (-2.27), about -5.8 kJ/mol.
- Electrical term: zF&Delta;V = (+1)(96,485)(-0.070), about -6.8 kJ/mol.
- Total: about **-12.6 kJ per mole of Na<sup>+</sup>** entering. Both terms favor entry: Na<sup>+</sup> is pushed in by its concentration gradient and pulled in by the negative interior.

**Step 3: couple them.** SGLT1 moves 2 Na<sup>+</sup> per glucose, releasing about 25 kJ/mol. That could, in principle, support a glucose gradient as large as the one where its cost equals 25 kJ/mol: e<sup>25,200/2,580</sup>, about 18,000 to one. Real cells never get near this ceiling, but the arithmetic shows why a 2:1 stoichiometry is powerful. With only one Na<sup>+</sup> per glucose, the maximum would be about 130 to one.

The same sum also explains why charge matters. For an ion, a gradient can be uphill in concentration but downhill overall if the voltage pulls hard enough. Always add both terms before deciding whether a movement is passive or active.

## Bulk transport

Large particles and fluid cross by vesicles: endocytosis (phagocytosis of particles, pinocytosis of fluid, and receptor-mediated uptake such as LDL particles through clathrin-coated pits) and exocytosis (for example, neurotransmitter or hormone release). Both require energy, but they are usually grouped separately from the carrier-based active transport above.

## Common traps

- **Calling facilitated diffusion active because it uses a protein.** A protein does not make transport active. Direction and energy source do.
- **Saying secondary active transport uses ATP.** Not directly. It spends an ion gradient that a primary pump built with ATP.
- **Ignoring the voltage term for ions.** Judge the electrochemical gradient, not the concentration gradient alone.
- **Getting the pump stoichiometry backward.** 3 Na<sup>+</sup> out, 2 K<sup>+</sup> in.
- **Assuming simple diffusion saturates.** It does not. Saturation points to a carrier.
- **Thinking water moves toward lower solute.** Water moves toward the side with more solute particles (higher osmolarity).

## One-minute recap

Passive: down the gradient, no energy. Simple diffusion for small nonpolar molecules, linear and unsaturable. Facilitated diffusion through channels or carriers, saturable but still downhill. Active: up the gradient. Primary pumps hydrolyze ATP directly (Na<sup>+</sup>/K<sup>+</sup> ATPase: 3 Na<sup>+</sup> out, 2 K<sup>+</sup> in). Secondary transporters spend the Na<sup>+</sup> gradient (symport such as SGLT1, antiport such as the Na<sup>+</sup>/Ca<sup>2+</sup> exchanger). Use &Delta;G = RT ln(C<sub>in</sub>/C<sub>out</sub>) + zF&Delta;V to decide which way a solute wants to go.

:::quiz
Q: A drug blocks the Na+/K+ ATPase. Why does glucose uptake by SGLT1 eventually fall?
A: SGLT1 is powered by the Na+ gradient. Without the pump, Na+ leaks in, the gradient runs down, and there is no longer enough energy to drive glucose uphill.
Q: Transport of a solute levels off at high concentrations and is blocked by a structural analog. Simple diffusion or carrier-mediated transport?
A: Carrier-mediated. Saturation and competition both show that a limited number of binding sites are involved, which simple diffusion lacks.
Q: GLUT2 releases glucose from intestinal cells into the blood. What type of transport is this?
A: Facilitated diffusion. Glucose moves down its concentration gradient through a carrier protein, with no energy spent.
Q: For each ATP hydrolyzed, how many Na+ and K+ ions does the Na+/K+ ATPase move, and in which directions?
A: 3 Na+ out of the cell and 2 K+ into the cell, for a net loss of one positive charge per cycle.
Q: Why do both terms of the electrochemical gradient favor Na+ entering a typical cell?
A: Na+ is more concentrated outside than inside, and the cell interior is negative, so both the concentration gradient and the electrical force push the positive ion inward.
:::

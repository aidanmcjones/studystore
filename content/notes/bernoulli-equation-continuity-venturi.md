---
title: Bernoulli's Equation and the Venturi Effect for the MCAT
description: Use the continuity equation and Bernoulli's equation to find flow speed and pressure in a pipe, with worked Venturi, height and Torricelli examples.
product: 4b-fluids-gases
published: 2026-10-20
related: work-energy-theorem-conservation-of-energy
---

Bernoulli's equation, P + &frac12;&rho;v<sup>2</sup> + &rho;gh = constant along a streamline, is conservation of energy for a moving ideal fluid, with every term written as energy per unit volume. Pair it with the continuity equation, A<sub>1</sub>v<sub>1</sub> = A<sub>2</sub>v<sub>2</sub>, and most flow problems fall out: a narrower section forces faster flow, and at the same height faster flow means lower pressure. That pressure drop at a constriction is the Venturi effect.

## Step one: continuity sets the speed

For an incompressible fluid in steady flow, no volume can pile up or vanish between two points in a pipe. The volume flow rate Q must be the same everywhere:

**Q = Av = constant, so A<sub>1</sub>v<sub>1</sub> = A<sub>2</sub>v<sub>2</sub>**

Q is in m<sup>3</sup>/s. A is the cross-sectional area, and for a round pipe A = &pi;r<sup>2</sup>. The radius enters squared, which is where most errors start:

| Change to the pipe | Change in area | Change in speed |
|---|---|---|
| Radius halved | Area &times; 1/4 | Speed &times; 4 |
| Radius doubled | Area &times; 4 | Speed &times; 1/4 |
| Diameter cut to 1/3 | Area &times; 1/9 | Speed &times; 9 |

When a pipe splits into branches, the rule applies to the total area: whatever volume per second enters the junction must leave through all the branches combined. This explains why blood moves slowly through capillaries even though each capillary is tiny: there are so many of them that their combined cross-sectional area is far larger than the aorta's, so the average speed there is far lower.

## Step two: Bernoulli sets the pressure

Bernoulli's equation compares two points on the same streamline:

**P<sub>1</sub> + &frac12;&rho;v<sub>1</sub><sup>2</sup> + &rho;gh<sub>1</sub> = P<sub>2</sub> + &frac12;&rho;v<sub>2</sub><sup>2</sup> + &rho;gh<sub>2</sub>**

Read each term as an energy density in J/m<sup>3</sup>, which is the same unit as pascals:

- P is the static pressure, the push the fluid exerts on the pipe wall.
- &frac12;&rho;v<sup>2</sup> is kinetic energy per unit volume, sometimes called dynamic pressure. Compare it with &frac12;mv<sup>2</sup>: the mass has been replaced by density.
- &rho;gh is gravitational potential energy per unit volume. Compare it with mgh.

The sum stays constant, so if one term rises another must fall. In a horizontal pipe the &rho;gh terms cancel, and the trade is purely between pressure and speed. If the fluid is not moving at all, the speed terms vanish and the equation reduces to the hydrostatic result, P<sub>deep</sub> = P<sub>shallow</sub> + &rho;g&Delta;h.

Why does pressure fall where flow speeds up? A fluid parcel entering a constriction must accelerate, and something must push it forward. The only push available is a pressure difference, higher behind the parcel than ahead of it. So the pressure has to be lower in the fast, narrow section.

![Venturi tube profile above a plot of flow speed and pressure change along the tube, computed from continuity and Bernoulli for water](assets/notes/bernoulli-equation-continuity-venturi.png "When the radius halves, speed rises fourfold and static pressure drops by 4.8 kPa. Both recover in the wide section downstream.")

### The assumptions behind it

Bernoulli's equation as written assumes an ideal fluid:

1. Incompressible (constant density). Good for liquids and for slow gas flows.
2. Nonviscous, so no energy is lost to internal friction.
3. Steady flow, with velocity at each point not changing in time.
4. Laminar flow along a streamline, without turbulence.

Real fluids in long, narrow tubes violate assumption 2. In that case pressure also falls steadily along the tube even where the area is constant, and Poiseuille's law describes the drop instead: Q = &Delta;P&pi;r<sup>4</sup>/(8&eta;L). Halving the radius in that regime raises resistance 16-fold. Keep the two laws separate. Bernoulli tracks energy trades in an ideal fluid; Poiseuille tracks energy lost to viscosity.

## Worked example 1: a horizontal Venturi

Water (&rho; = 1000 kg/m<sup>3</sup>) flows at 0.80 m/s through a horizontal pipe of radius 3.0 cm, which narrows to a radius of 1.5 cm. Find the speed in the narrow section and the pressure difference.

1. The radius ratio is 2, so the area ratio is 2<sup>2</sup> = 4 and v<sub>2</sub> = 4 &times; 0.80 = **3.2 m/s**.
2. The pipe is horizontal, so P<sub>1</sub> - P<sub>2</sub> = &frac12;&rho;(v<sub>2</sub><sup>2</sup> - v<sub>1</sub><sup>2</sup>).
3. P<sub>1</sub> - P<sub>2</sub> = 0.5 &times; 1000 &times; (10.24 - 0.64) = 0.5 &times; 1000 &times; 9.6 = **4800 Pa, about 4.8 kPa**.

The flow rate is Q = &pi;(0.030)<sup>2</sup>(0.80), about 2.3 &times; 10<sup>-3</sup> m<sup>3</sup>/s, or 2.3 liters per second, in both sections. A Venturi meter uses exactly this logic in reverse: measure the pressure difference with two vertical tubes, then solve for the speed and the flow rate.

## Worked example 2: pushing water uphill

Water flows through a pipe of constant diameter from a basement up to a faucet 4.0 m higher. How much lower is the pressure at the faucet while the water is flowing?

1. Same diameter means same area, so continuity gives v<sub>1</sub> = v<sub>2</sub>. The speed terms cancel.
2. Bernoulli leaves P<sub>1</sub> - P<sub>2</sub> = &rho;g(h<sub>2</sub> - h<sub>1</sub>) = 1000 &times; 9.8 &times; 4.0 = **39,200 Pa, about 39 kPa**.

The water is not slowing down. The pressure, not the speed, pays for the climb. This is the case students miss when they memorize "faster means lower pressure" without the words "at the same height."

## Worked example 3: Torricelli's theorem

An open water tank has a small hole 0.45 m below the water surface. The tank is wide, so the surface drops so slowly that its speed is close to zero. How fast does water leave the hole?

Apply Bernoulli between the surface (point 1) and the hole (point 2). Both are open to the atmosphere, so P<sub>1</sub> = P<sub>2</sub>, and v<sub>1</sub> is about 0. What remains is &rho;gh = &frac12;&rho;v<sub>2</sub><sup>2</sup>, so

v = &radic;(2gh) = &radic;(2 &times; 9.8 &times; 0.45) = **about 3.0 m/s**

That is the same speed an object would reach falling 0.45 m, and density cancels, so oil would leave at the same speed. If the hole has an area of 2.0 cm<sup>2</sup> (2.0 &times; 10<sup>-4</sup> m<sup>2</sup>), the outflow is Q = Av, about 5.9 &times; 10<sup>-4</sup> m<sup>3</sup>/s, or 0.59 L/s, ignoring the slight narrowing of a real jet.

## Blood vessels: the classic applications

Two clinical setups show up again and again in physiology-flavored physics questions.

- **Narrowed artery (stenosis).** Continuity says blood speeds up through the narrow segment. In the ideal Bernoulli picture, the faster flow comes with lower static pressure on the wall at that spot. Real blood is viscous, so the narrowing also raises resistance sharply, following the r<sup>4</sup> dependence in Poiseuille's law.
- **Widened artery (aneurysm).** The opposite trade. The wide section has slower flow, and by Bernoulli its static pressure is higher than in the normal segments nearby, which pushes outward on an already weakened wall.

A careful answer names both principles: continuity for the speed, Bernoulli for the pressure at a given height.

## Common traps

- **Holding v constant instead of Q.** Flow rate is what is conserved. Speed changes with area.
- **Using radius ratios as area ratios.** Area goes as r<sup>2</sup>. A pipe with one third the diameter has one ninth the area and nine times the speed.
- **Dropping the height term.** "Faster flow means lower pressure" is only true at the same height. In a vertical or sloped pipe, include &rho;gh.
- **Using &rho; = 1 for water.** In SI units, water is 1000 kg/m<sup>3</sup>. Using 1 g/cm<sup>3</sup> with meters per second gives an answer a thousand times too small.
- **Thinking density matters for Torricelli.** Exit speed depends only on the depth of the hole below the surface.
- **Applying Bernoulli to long viscous flow.** If friction matters, pressure falls along a uniform tube, and Poiseuille's law is the right tool.
- **Confusing static pressure with total energy.** The pressure on the wall drops in a constriction, but the fluid has not lost energy. It has converted pressure energy into kinetic energy, and it converts it back downstream.

## One-minute recap

Continuity: Q = Av is constant, so narrowing a pipe speeds the flow, and speed scales with 1/r<sup>2</sup>. Bernoulli: P + &frac12;&rho;v<sup>2</sup> + &rho;gh is constant along a streamline for an ideal fluid, each term an energy per volume in pascals. At constant height, faster flow means lower static pressure (Venturi effect). At constant speed, higher means lower pressure by &rho;g&Delta;h. With the fluid at rest it becomes the hydrostatic equation, and for a hole in an open tank it gives Torricelli's v = &radic;(2gh). Viscous losses in long tubes belong to Poiseuille's law.

:::quiz
Q: A pipe carrying water at 1.2 m/s narrows to one third of its original diameter. What is the speed in the narrow section?
A: One third the diameter means one ninth the area, so the speed is 9 × 1.2 = 10.8 m/s.
Q: Water in a level pipe accelerates from 2.0 m/s to 4.0 m/s as the pipe narrows. By how much does the static pressure fall? (ρ = 1000 kg/m³)
A: ΔP = ½ρ(v₂² - v₁²) = 0.5 × 1000 × (16 - 4) = 6000 Pa, so the pressure falls by 6.0 kPa.
Q: An open tank holds glycerin, which is denser than water, with a small hole 0.80 m beneath the liquid level. How fast does glycerin leave the hole compared with water from the same depth?
A: At the same speed, about 4.0 m/s from v = √(2gh). Density cancels in Torricelli's theorem.
Q: Water rises through a vertical pipe of constant diameter by 2.0 m while flowing. How does the pressure at the top compare with the bottom? (ρ = 1000 kg/m³, g = 9.8 m/s²)
A: Speed is unchanged because the area is unchanged, so the top pressure is lower by ρgh = 19,600 Pa, about 20 kPa.
Q: Which assumption of Bernoulli's equation fails most clearly for blood flowing through a long narrow arteriole?
A: The nonviscous assumption. Viscous friction makes pressure fall steadily along the vessel, which Poiseuille's law describes.
:::

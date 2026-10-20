---
title: MCAT Fluids Practice Questions: Pressure, Buoyancy, Bernoulli and Flow
description: Ten free MCAT-style fluids practice questions on hydrostatic pressure, hydraulics, buoyancy, continuity, Bernoulli and Poiseuille flow in blood vessels, with full explanations.
aamc: 4B
category: 4b-fluids-gases
cluster: Hydrostatic pressure, Pascal's principle and hydraulics, Buoyancy and Archimedes' principle, Continuity equation, Bernoulli's equation and Venturi effect, Viscosity and Poiseuille's law, Circulatory system as a fluid system
product: 4b-fluids-gases
published: 2026-10-20
notes:
---

In a fluid at rest, pressure increases with depth: P = P<sub>0</sub> + &rho;gh, where &rho;gh alone is the gauge pressure. Pascal's principle says a pressure change applied to an enclosed fluid reaches every point, which lets a hydraulic lift multiply force by the ratio of piston areas. Archimedes' principle sets the buoyant force equal to the weight of displaced fluid, F<sub>b</sub> = &rho;<sub>fluid</sub>V<sub>submerged</sub>g. A floating object sinks until the displaced fluid weighs as much as the object, so the fraction submerged equals &rho;<sub>object</sub>/&rho;<sub>fluid</sub>.

For flowing incompressible fluids, the continuity equation A<sub>1</sub>v<sub>1</sub> = A<sub>2</sub>v<sub>2</sub> says flow rate is conserved, so fluid speeds up where the tube narrows. Bernoulli's equation, P + &frac12;&rho;v<sup>2</sup> + &rho;gh = constant, then says pressure drops where speed rises (the Venturi effect). Real fluids are viscous: Poiseuille's law gives flow Q = &pi;r<sup>4</sup>&Delta;P/(8&eta;L), so resistance scales with L/r<sup>4</sup>, which is why small changes in arteriole radius control blood flow so strongly.

Traps: buoyant force does not depend on depth or on the object's own density once it is fully submerged, continuity compares total cross-sectional areas, and Bernoulli ignores viscosity while Poiseuille is all about it. These questions use g = 10 m/s<sup>2</sup>.

@@QUESTIONS

### Q1
A diver swims at a depth of 15 m in a freshwater lake (density 1000 kg/m<sup>3</sup>). Atmospheric pressure is 100 kPa and g = 10 m/s<sup>2</sup>. What is the absolute pressure on the diver?
A) 100 kPa
B) 150 kPa
C) 250 kPa
D) 300 kPa
ANSWER: C
WHY: The gauge pressure is &rho;gh = 1000 x 10 x 15 = 150,000 Pa = 150 kPa. Absolute pressure adds the atmosphere on top: 100 + 150 = 250 kPa, about 2.5 atm. The 150 kPa choice is only the gauge pressure, a common slip when a question asks for absolute pressure.

### Q2
A hydraulic jack has a small piston of area 2.0 cm<sup>2</sup> and a large piston of area 80 cm<sup>2</sup>. What force on the small piston will slowly lift a 1200 kg car resting on the large piston (g = 10 m/s<sup>2</sup>)?
A) 30 N
B) 300 N
C) 3000 N
D) 480,000 N
ANSWER: B
WHY: The car weighs 1200 x 10 = 12,000 N. Equal pressure on both pistons means F<sub>small</sub> = F<sub>large</sub> x (A<sub>small</sub>/A<sub>large</sub>) = 12,000 x (2.0/80) = 300 N. The 480,000 N choice multiplies by the area ratio instead of dividing. The small piston must move 40 times farther than the car rises, so the work is unchanged.

### Q3
A plastic block floats in fresh water with 80 percent of its volume submerged. The same block is then placed in a salt solution with a specific gravity of 1.25. What percentage of its volume is now submerged?
A) 36 percent
B) 64 percent
C) 80 percent
D) 100 percent
ANSWER: B
WHY: Floating in water with 80 percent submerged means the block's density is 0.80 x 1000 = 800 kg/m<sup>3</sup>. In the denser solution the fraction submerged is 800 / 1250 = 0.64, or 64 percent. A denser fluid supplies the same buoyant force with less displaced volume, so the block rides higher. The 36 percent choice is the fraction above the surface.

### Q4
A 3.0 kg metal sculpture with a volume of 400 cm<sup>3</sup> hangs from a spring scale while fully submerged in water (density 1000 kg/m<sup>3</sup>, g = 10 m/s<sup>2</sup>). What does the scale read?
A) 26 N
B) 4 N
C) 30 N
D) 34 N
ANSWER: A
WHY: The sculpture's weight is 3.0 x 10 = 30 N. The volume is 400 cm<sup>3</sup> = 0.0004 m<sup>3</sup>, so the buoyant force is &rho;Vg = 1000 x 0.0004 x 10 = 4 N upward, so the scale supports 30 &minus; 4 = 26 N. The 4 N choice is the buoyant force itself, and 34 N adds the buoyant force instead of subtracting it.

### Q5
Blood flows through a vessel of radius 1.0 cm at an average speed of 30 cm/s and then enters a single narrower segment of radius 0.50 cm. Treating blood as incompressible, what is its average speed in the narrow segment?
A) 7.5 cm/s
B) 60 cm/s
C) 120 cm/s
D) 240 cm/s
ANSWER: C
WHY: Continuity gives A<sub>1</sub>v<sub>1</sub> = A<sub>2</sub>v<sub>2</sub>, and area scales with r<sup>2</sup>. Halving the radius cuts the area to one quarter, so the speed rises fourfold: 30 x 4 = 120 cm/s. The 60 cm/s choice scales with radius instead of area, and 7.5 cm/s moves the factor in the wrong direction.

### Q6
Each capillary is far narrower than the aorta, yet blood moves much more slowly in the capillaries than in the aorta. What best explains this?
A) The combined cross-sectional area of all capillaries is much larger than the area of the aorta
B) Blood viscosity is lower in capillaries than in the aorta
C) Bernoulli's equation requires speed to fall wherever pressure falls
D) Capillaries are farther from the heart, so flow rate is lost along the way
ANSWER: A
WHY: Continuity applies to the total flow, which is the same through each level of the circulation. Because the capillary beds together have a total cross-sectional area hundreds of times larger than the aorta, the average speed there is far lower. Flow rate is not lost along the way (D), and Bernoulli actually links lower pressure with higher speed, not lower speed (C).

### Q7
Water flows through a horizontal pipe at 2.0 m/s in a wide section and then at 4.0 m/s in a narrow section. Ignoring viscosity, by how much is the pressure in the narrow section lower than in the wide section (density 1000 kg/m<sup>3</sup>)?
A) 1000 Pa
B) 2000 Pa
C) 4000 Pa
D) 6000 Pa
ANSWER: D
WHY: For a horizontal pipe, Bernoulli gives &Delta;P = &frac12;&rho;(v<sub>2</sub><sup>2</sup> &minus; v<sub>1</sub><sup>2</sup>) = &frac12; x 1000 x (16 &minus; 4) = 6000 Pa. The speeds must be squared before subtracting; using the speed difference of 2.0 m/s gives the 1000 Pa and 2000 Pa distractors. This pressure drop in a constriction is the Venturi effect.

### Q8
The same liquid flows through four rigid tubes, each with the same pressure difference between its ends. Flow is laminar and obeys Poiseuille's law.

| Tube | Radius (mm) | Length (cm) |
|---|---|---|
| 1 | 2.0 | 10 |
| 2 | 1.0 | 2 |
| 3 | 3.0 | 40 |
| 4 | 1.5 | 5 |

Which tube carries the greatest volume flow rate?
A) Tube 1
B) Tube 2
C) Tube 3
D) Tube 4
ANSWER: C
WHY: Flow is proportional to r<sup>4</sup>/L. Tube 1: 16/10 = 1.6. Tube 2: 1/2 = 0.5. Tube 3: 81/40 = 2.0. Tube 4: 5.06/5 = 1.0. Tube 3 is the longest, but its radius to the fourth power outweighs the length, so it has the lowest resistance and the highest flow. Tube 2 is shortest yet carries the least.

### Q9
A blood vessel's radius decreases by 20 percent because of plaque, while its length and the blood's viscosity stay the same. By about what factor must the pressure difference across the vessel increase to keep the flow rate unchanged?
A) 1.25
B) 1.6
C) 2.0
D) 2.4
ANSWER: D
WHY: Poiseuille flow is proportional to r<sup>4</sup>&Delta;P. The new radius is 0.80 of the original, and 0.80<sup>4</sup> = 0.41, so resistance rises by 1 / 0.41, about 2.4. The pressure difference must rise by the same factor to hold flow constant. The 1.25 choice treats flow as proportional to r instead of r<sup>4</sup>.

### Q10
A sealed, rigid, air-filled plastic ball is tied by a string to the floor of a water tank. The ball stays completely underwater and pulls the string taut. Treating water as incompressible, each of the following would change the tension in the string EXCEPT:
A) Lengthening the string so the ball floats nearer the surface while still fully underwater
B) Dissolving a large amount of salt in the water
C) Taping a small lead weight to the ball
D) Swapping in a larger rigid ball of the same mass
ANSWER: A
WHY: The string tension equals the upward push of the water minus the ball's weight, T = &rho;Vg &minus; mg. Moving the ball up or down does not change &rho;, V or m, because the pressure rises equally on its upper and lower surfaces, so the tension stays the same. Salt raises &rho; (B), the lead raises the weight (C), and a larger ball displaces more water (D).

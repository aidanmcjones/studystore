---
title: Colligative Properties: Freezing Point Depression Calculations
description: Calculate freezing point depression, boiling point elevation, vapor pressure lowering and osmotic pressure, with the van't Hoff factor and worked examples.
product: 5a-solutions-acids-bases
published: 2026-10-20
related: passive-vs-active-transport, henderson-hasselbalch-for-the-mcat, acid-base-titration-curves-equivalence-point
---

Colligative properties are the solution properties that depend on how many solute particles are dissolved, not on what those particles are. There are four: vapor pressure lowering, boiling point elevation, freezing point depression, and osmotic pressure. Freezing point depression is calculated with **&Delta;T<sub>f</sub> = i K<sub>f</sub> m**, where i is the van't Hoff factor, K<sub>f</sub> is a constant for the solvent (about 1.86 &deg;C kg/mol for water), and m is the molality. Boiling point elevation uses the same form with K<sub>b</sub> (about 0.512 &deg;C kg/mol for water).

## The four equations

| Property | Equation | Concentration unit | Effect of more solute |
|---|---|---|---|
| Vapor pressure lowering | P<sub>solution</sub> = X<sub>solvent</sub> P&deg;<sub>solvent</sub> (Raoult's law) | Mole fraction | Vapor pressure goes down |
| Boiling point elevation | &Delta;T<sub>b</sub> = i K<sub>b</sub> m | Molality (mol solute per kg solvent) | Boiling point goes up |
| Freezing point depression | &Delta;T<sub>f</sub> = i K<sub>f</sub> m | Molality | Freezing point goes down |
| Osmotic pressure | &Pi; = i M R T | Molarity (mol per L of solution) | Osmotic pressure goes up |

Here R = 0.0821 L atm/(mol K) and T must be in kelvin. &Delta;T<sub>f</sub> and &Delta;T<sub>b</sub> are written as positive sizes of the shift; you then subtract from the normal freezing point or add to the normal boiling point.

Why molality for the temperature changes? Molality is moles per kilogram of solvent, and mass does not change with temperature. Molarity uses volume, which expands and contracts as the solution is heated or cooled, so it is a poor choice for a property measured by changing the temperature.

## The van't Hoff factor i

Because the effect depends on particle count, you need the number of particles each formula unit releases in solution.

| Solute | Dissociation | Ideal i |
|---|---|---|
| Glucose, sucrose, urea, ethylene glycol | Do not dissociate | 1 |
| NaCl, KBr | Na<sup>+</sup> + Cl<sup>-</sup> | 2 |
| CaCl<sub>2</sub>, K<sub>2</sub>SO<sub>4</sub> | Three ions | 3 |
| AlCl<sub>3</sub> | Al<sup>3+</sup> + 3Cl<sup>-</sup> | 4 |

Treat the ideal value as a best case. In real dilute solutions some cations and anions travel together as ion pairs, so the measured i is usually a little lower, and the gap tends to be larger for ions with higher charge. For a weak acid, i is typically just above 1 because most molecules stay intact. Unless a problem says otherwise, use the ideal i.

A useful habit: multiply i by the concentration first. The product i &times; m is the **particle molality**, and it is the only thing that sets the size of any colligative effect.

## Why a solute shifts boiling and freezing points

Start with vapor pressure. Mixing a solute into a solvent increases the disorder (entropy) of the liquid, which makes the liquid state more stable for the solvent. With less to gain by escaping into the vapor, fewer solvent molecules leave at a given temperature, and the vapor pressure drops in proportion to the solvent's mole fraction. That is Raoult's law. (You may see the picture of solute particles "blocking" the surface. It is a handy image, but the entropy argument is the real reason.)

A liquid boils when its vapor pressure equals the pressure above it. If the solution's vapor pressure is lower at every temperature, it has to be heated further before it reaches 1 atm. The boiling point rises.

Freezing works through a related idea. When a dilute solution freezes, the crystals that form are nearly pure solvent, so the solute stays behind in the liquid. Dissolved particles make the liquid more disordered and more stable relative to the solid, so the solvent molecules need a lower temperature before they settle into the crystal. The freezing point falls. This is why the sea freezes at a lower temperature than a pond, and why road salt melts ice.

![Left: vapor pressure of pure water and of a solution with water mole fraction 0.95, near 100 degrees C, showing the solution reaching 760 mmHg at a higher temperature. Right: predicted freezing points for four solutions with different particle molality.](assets/notes/colligative-properties-freezing-point-depression.png "Left: lower vapor pressure means a higher boiling point. Right: freezing point tracks i times m, not the identity of the solute.")

## Worked example 1: antifreeze

Dissolve 250 g of ethylene glycol (C<sub>2</sub>H<sub>6</sub>O<sub>2</sub>, molar mass about 62.07 g/mol) in 1.00 kg of water. Ethylene glycol does not ionize, so i = 1.

1. Moles of solute = 250 / 62.07 = 4.03 mol.
2. Molality = 4.03 mol / 1.00 kg = 4.03 m.
3. &Delta;T<sub>f</sub> = (1)(1.86)(4.03) = 7.49 &deg;C, so the predicted freezing point is about **-7.5 &deg;C**.
4. &Delta;T<sub>b</sub> = (1)(0.512)(4.03) = 2.06 &deg;C, so the predicted boiling point is about **102.1 &deg;C** at 1 atm.

The same solute both lowers the freezing point and raises the boiling point, which is why a coolant protects an engine in both winter and summer. The freezing point shift is larger because K<sub>f</sub> for water is bigger than K<sub>b</sub>. One caution: these equations are derived for dilute solutions, so at a concentration this high the answers are estimates.

## Worked example 2: rank the freezing points

Which of these has the lowest freezing point? 0.20 m CaCl<sub>2</sub>, 0.18 m K<sub>2</sub>SO<sub>4</sub>, 0.25 m NaCl, 0.40 m glucose.

Multiply i by m for each:

| Solution | i | i &times; m | Predicted freezing point |
|---|---|---|---|
| 0.20 m CaCl<sub>2</sub> | 3 | 0.60 | -1.12 &deg;C |
| 0.18 m K<sub>2</sub>SO<sub>4</sub> | 3 | 0.54 | -1.00 &deg;C |
| 0.25 m NaCl | 2 | 0.50 | -0.93 &deg;C |
| 0.40 m glucose | 1 | 0.40 | -0.74 &deg;C |

The CaCl<sub>2</sub> solution freezes lowest even though glucose has the largest molality. The ranking question never needs K<sub>f</sub>: compare i &times; m and you are done.

## Worked example 3: find a molar mass

A student dissolves 3.00 g of an unknown nonelectrolyte in 50.0 g of water. The solution freezes at -0.62 &deg;C. What is the molar mass?

1. &Delta;T<sub>f</sub> = 0.62 &deg;C, and i = 1.
2. m = &Delta;T<sub>f</sub> / K<sub>f</sub> = 0.62 / 1.86 = 0.333 mol/kg.
3. Moles of solute = 0.333 mol/kg &times; 0.0500 kg = 0.0167 mol.
4. Molar mass = 3.00 g / 0.0167 mol = **180 g/mol**, which is consistent with a simple sugar such as glucose.

Watch the units in step 3. The solvent mass must be in kilograms.

## Worked example 4: vapor pressure and osmotic pressure

**Vapor pressure.** Pure water at 100 &deg;C has a vapor pressure of 760 mmHg. In a solution where X<sub>water</sub> = 0.95, the vapor pressure at 100 &deg;C is 0.95 &times; 760 = **722 mmHg**. That is below atmospheric pressure, so the solution does not boil at 100 &deg;C. It has to be heated a little more, which is boiling point elevation seen from the vapor pressure side.

**Osmotic pressure.** A 0.050 M CaCl<sub>2</sub> solution at 25 &deg;C (298 K):

&Pi; = i M R T = (3)(0.050)(0.0821)(298) = **3.67 atm**

That is a large pressure from a fairly dilute solution, which is why osmosis is such a strong force on cells. Osmotic pressure is the most sensitive of the four properties, so it is the one used to measure molar masses of large molecules such as proteins, where the temperature shifts would be too small to read.

## The biology connection: osmolarity

Physiology uses **osmolarity**, i &times; M, often in milliosmoles per liter. Normal saline (0.9 percent NaCl) is about 9.0 g per liter, or 0.154 M, so its ideal osmolarity is about 2 &times; 154 = **308 mOsm/L**. Measured values come in slightly lower because of ion pairing, which puts saline close to the measured osmolality of blood plasma (roughly 285 to 295 mOsm per kg of water). That near match is why it can be infused without shrinking or swelling red blood cells. Water always moves by osmosis toward the side with the higher particle concentration, a passive process discussed in the [passive vs active transport note](passive-vs-active-transport.html).

## Common traps

- **Forgetting i.** 0.10 m NaCl has the same particle molality as 0.20 m glucose, not 0.10 m glucose.
- **Using molarity in &Delta;T = i K m.** Boiling and freezing point changes use molality. Osmotic pressure uses molarity.
- **Using Celsius in &Pi; = iMRT.** Convert to kelvin, or the answer is badly off.
- **Getting the direction wrong.** Solutes lower vapor pressure, lower the freezing point, and raise the boiling point and osmotic pressure. All four changes point the same way: the solvent becomes "less eager" to leave the liquid.
- **Counting covalent molecules as ions.** Sugars, urea, and alcohols such as ethylene glycol have i = 1.
- **Applying Raoult's law to the solute as if it were volatile.** In these problems the solute is nonvolatile, so only the solvent contributes to the vapor pressure.
- **Thinking the solute's identity matters.** For ideal dilute solutions, only the particle count matters. That is the definition of colligative.

## One-minute recap

Colligative properties depend on particle count. Raoult's law: P = X<sub>solvent</sub>P&deg;. Boiling point rises by i K<sub>b</sub> m, freezing point falls by i K<sub>f</sub> m, with K<sub>b</sub> about 0.512 and K<sub>f</sub> about 1.86 &deg;C kg/mol for water and m in mol per kg of solvent. Osmotic pressure &Pi; = iMRT uses molarity and kelvin. The van't Hoff factor is 1 for nonelectrolytes, 2 for NaCl, 3 for CaCl<sub>2</sub>, and real values run slightly lower. To rank solutions, compare i &times; m.

:::quiz
Q: Which has the higher boiling point: 0.15 m MgCl2 or 0.20 m KCl?
A: 0.15 m MgCl2. Its particle molality is 3 × 0.15 = 0.45 m, compared with 2 × 0.20 = 0.40 m for KCl.
Q: What is the predicted freezing point of a 0.10 m MgCl2 solution in water (Kf = 1.86 °C kg/mol)?
A: ΔTf = 3 × 1.86 × 0.10 = 0.56 °C, so it freezes at about -0.56 °C.
Q: Why do freezing and boiling point calculations use molality instead of molarity?
A: Molality is based on the mass of solvent, which does not change with temperature, while molarity is based on volume, which does.
Q: Pure water has a vapor pressure of 760 mmHg at 100 °C. What is the vapor pressure of a solution with X(water) = 0.90 at that temperature?
A: By Raoult's law, P = 0.90 × 760 = 684 mmHg, so the solution does not boil at 100 °C under 1 atm.
Q: What is the osmotic pressure of 0.020 M glucose at 300 K (R = 0.0821 L atm/mol K)?
A: Π = iMRT = 1 × 0.020 × 0.0821 × 300 = about 0.49 atm. Glucose does not ionize, so i = 1.
:::

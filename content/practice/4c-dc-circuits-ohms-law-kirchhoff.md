---
title: MCAT Circuits Practice Questions: Ohm's Law, Resistors and Kirchhoff
description: Ten free MCAT-style circuits practice questions on current, resistivity, Ohm's law, series and parallel resistors, Kirchhoff's rules, power and meters, with full explanations.
aamc: 4C
category: 4c-electricity-electrochem
cluster: Current, resistance and resistivity, Ohm's law, Series and parallel resistors, Kirchhoff's laws, Power in circuits, Meters: ammeter and voltmeter
product: 4c-electricity-electrochem
published: 2026-10-20
notes:
---

Current is the rate at which charge passes a point, I = &Delta;Q/&Delta;t, measured in amperes (coulombs per second). A conductor's resistance depends on its material and shape, R = &rho;L/A: longer wires resist more and thicker wires resist less. Ohm's law, V = IR, links the voltage across a resistor to the current through it. Power dissipated in a resistor is P = IV = I<sup>2</sup>R = V<sup>2</sup>/R.

Resistors in series carry the same current and their resistances add, so they divide the voltage in proportion to resistance. Resistors in parallel share the same voltage, their reciprocals add (1/R<sub>eq</sub> = 1/R<sub>1</sub> + 1/R<sub>2</sub> + ...), and the equivalent resistance is always smaller than the smallest branch. Kirchhoff's junction rule (current in equals current out) expresses conservation of charge, and the loop rule (the voltage changes around any closed loop sum to zero) expresses conservation of energy. A real battery has internal resistance r, so its terminal voltage is &epsilon; &minus; Ir while current flows.

Traps: adding a parallel branch lowers total resistance and raises total current, an ideal voltmeter has very high resistance and goes in parallel while an ideal ammeter has very low resistance and goes in series, and a bulb's brightness tracks the power it dissipates, not the current alone.

@@QUESTIONS

### Q1
A steady current of 4.0 mA runs through a heating element for 20 s. Roughly how many electrons pass a given point during that time? Use e = 1.6 &times; 10<sup>&minus;19</sup> C.
A) 1.3 &times; 10<sup>&minus;20</sup>
B) 5.0 &times; 10<sup>14</sup>
C) 5.0 &times; 10<sup>17</sup>
D) 8.0 &times; 10<sup>17</sup>
ANSWER: C
WHY: The charge is Q = It = (0.0040 A)(20 s) = 0.080 C. Dividing by the charge on one electron gives 0.080 / (1.6 &times; 10<sup>&minus;19</sup>) = 5.0 &times; 10<sup>17</sup> electrons. The 5.0 &times; 10<sup>14</sup> choice forgets to convert milliamperes to amperes, 1.3 &times; 10<sup>&minus;20</sup> multiplies by e instead of dividing, and 8.0 &times; 10<sup>17</sup> drops the 1.6.

### Q2
An ideal 12 V battery drives current through a 4.0 ohm resistor in series with a parallel pair made of a 3.0 ohm resistor and a 6.0 ohm resistor. What is the current through the 3.0 ohm resistor?
A) 1.33 A
B) 0.67 A
C) 2.0 A
D) 4.0 A
ANSWER: A
WHY: The parallel pair is (3 x 6)/(3 + 6) = 2.0 ohms, so the total is 6.0 ohms and the battery current is 12/6.0 = 2.0 A. The parallel pair has 2.0 A x 2.0 ohms = 4.0 V across it, so the 3.0 ohm branch carries 4.0/3.0 = 1.33 A and the 6.0 ohm branch carries 0.67 A. The 2.0 A choice is the total current, which splits between the branches.

### Q3
Two identical lamps, each rated 60 W at 120 V, are connected in series across a 120 V supply. Assuming each lamp's resistance stays constant, what total power do the two lamps dissipate?
A) 120 W
B) 60 W
C) 30 W
D) 15 W
ANSWER: C
WHY: Each lamp's resistance is V<sup>2</sup>/P = 120<sup>2</sup>/60 = 240 ohms. In series the total is 480 ohms, so P = V<sup>2</sup>/R = 120<sup>2</sup>/480 = 30 W in total, 15 W per lamp. The 15 W choice is the power of only one lamp, and 120 W is what two lamps would draw if wired in parallel.

### Q4
A battery has an emf of 9.0 V and an internal resistance of 0.50 ohm. It is connected to a 4.0 ohm external resistor. What voltage would an ideal voltmeter read across the battery terminals?
A) 9.0 V
B) 8.0 V
C) 8.5 V
D) 1.0 V
ANSWER: B
WHY: The current is I = &epsilon;/(R + r) = 9.0/4.5 = 2.0 A. The terminal voltage is &epsilon; &minus; Ir = 9.0 &minus; (2.0)(0.50) = 8.0 V, which also equals IR = 2.0 x 4.0 across the external resistor. The 9.0 V choice ignores the internal voltage drop, and 1.0 V is the drop inside the battery.

### Q5
Four wires meet at a single junction in a circuit. Three of the currents are known.

| Wire | Current | Direction relative to junction |
|---|---|---|
| 1 | 3.0 A | into |
| 2 | 1.2 A | out of |
| 3 | unknown | out of |
| 4 | 0.5 A | into |

What is the current in wire 3?
A) 4.7 A
B) 3.7 A
C) 1.3 A
D) 2.3 A
ANSWER: D
WHY: Kirchhoff's junction rule says total current in equals total current out because charge cannot accumulate at a junction. In: 3.0 + 0.5 = 3.5 A. Out: 1.2 A + I<sub>3</sub>. So I<sub>3</sub> = 3.5 &minus; 1.2 = 2.3 A. The 4.7 A choice adds every current regardless of direction, and 1.3 A ignores wire 4.

### Q6
A single loop contains a 12 V battery and a 3.0 V battery connected so that their emfs oppose each other, plus a 2.0 ohm resistor and a 1.0 ohm resistor in series. Treating both batteries as ideal, what current flows in the loop?
A) 3.0 A
B) 5.0 A
C) 1.0 A
D) 4.0 A
ANSWER: A
WHY: Applying the loop rule, the opposing emfs give a net emf of 12 &minus; 3.0 = 9.0 V, driven around the loop in the direction of the 12 V battery. The total resistance is 2.0 + 1.0 = 3.0 ohms, so I = 9.0/3.0 = 3.0 A. Adding the emfs as if they were aligned gives 15/3.0 = 5.0 A.

### Q7
All of the following describe a well-designed meter used to measure a circuit without disturbing it EXCEPT:
A) An ammeter is placed in series with the element being measured
B) An ammeter has a resistance close to zero
C) A voltmeter has a resistance close to zero
D) A voltmeter is placed in parallel with the element being measured
ANSWER: C
WHY: A voltmeter sits in parallel, so it must have a very high resistance to avoid drawing current away from the element; a near-zero resistance voltmeter would short the element out. An ammeter sits in series and must have nearly zero resistance so it does not reduce the current it measures. Choices A, B and D are all correct descriptions.

### Q8
Two identical bulbs are connected in parallel across an ideal battery. A third identical bulb is then added in parallel with the first two. What happens?
A) The original bulbs stay equally bright and the battery current increases
B) The original bulbs dim and the battery current stays the same
C) The original bulbs brighten and the battery current increases
D) The original bulbs stay equally bright and the battery current stays the same
ANSWER: A
WHY: Each parallel branch has the full battery voltage across it, so the original bulbs keep the same voltage, current and power and do not change in brightness. The new branch lowers the equivalent resistance, so the battery supplies more total current: one extra branch current. Dimming would occur for bulbs added in series, or with a battery that has significant internal resistance.

### Q9
A 10 ohm resistor and a 30 ohm resistor are connected in series across a 24 V ideal battery. What is the voltage across the 30 ohm resistor?
A) 6.0 V
B) 8.0 V
C) 12 V
D) 18 V
ANSWER: D
WHY: The series current is 24/(10 + 30) = 0.60 A, so the voltage across the 30 ohm resistor is 0.60 x 30 = 18 V and across the 10 ohm resistor 6.0 V. In a series voltage divider the larger resistance takes the larger share of the voltage, here 30/40 of 24 V. The 6.0 V choice is the voltage across the smaller resistor.

### Q10
Wire A is a copper wire of length L and diameter d. Wire B is made of the same copper at the same temperature, with length 2L and diameter 2d. What is the ratio of the resistance of wire B to that of wire A?
A) 1/4
B) 1/2
C) 1
D) 2
ANSWER: B
WHY: Resistance is R = &rho;L/A, and cross-sectional area scales with the square of the diameter. Doubling the length doubles R, while doubling the diameter quadruples the area and divides R by 4. The net factor is 2/4 = 1/2. Treating area as proportional to diameter, instead of diameter squared, would wrongly give a ratio of 1.

---
title: Work-Energy Theorem and Conservation of Energy for the MCAT
description: Learn when to use W = Fd cos θ, the work-energy theorem, and conservation of mechanical energy, with worked examples on friction, springs and power.
product: 4a-motion-forces-energy
published: 2026-10-20
related: bernoulli-equation-continuity-venturi
---

The work-energy theorem states that the total work all forces do on an object equals how much its kinetic energy changes: W<sub>net</sub> = &Delta;KE. Conservation of mechanical energy is a special case that applies when only conservative forces such as gravity and ideal springs do work, so KE + PE stays constant. When friction or another nonconservative force acts, mechanical energy is not conserved, and the missing amount equals the work that force did. Pick the tool by asking which forces do work and whether you know them.

## Work: the definition that drives everything

For a force that stays constant, work is

**W = Fd cos &theta;**

where F is the size of the force, d is the size of the displacement, and &theta; is the angle between the two vectors. Work is a scalar measured in joules (1 J = 1 N&middot;m). Three cases cover almost every problem:

| Angle between F and d | cos &theta; | Work | Example |
|---|---|---|---|
| 0&deg; (same direction) | 1 | Positive, W = Fd | Gravity on a falling object |
| 90&deg; (perpendicular) | 0 | Zero | Normal force on a level floor, tension in a string swinging a ball in a circle |
| 180&deg; (opposite) | -1 | Negative, W = -Fd | Kinetic friction on a sliding box |

Positive work adds energy to the object, and negative work removes it. A force can be large and still do zero work: a waiter carrying a tray across a room at constant height does no work on the tray with the upward force of their hand, because that force is perpendicular to the motion.

When the force changes with position, work is the area under a force versus position graph. For an ideal spring the force grows linearly with stretch (F = kx in size), so the area is a triangle and the work to stretch or compress it by x from its natural length is &frac12;kx<sup>2</sup>.

## The work-energy theorem

Kinetic energy is KE = &frac12;mv<sup>2</sup>. The theorem links forces to speeds without needing time:

**W<sub>net</sub> = KE<sub>f</sub> - KE<sub>i</sub>**

The key word is net. Add the work done by every force on the object, including friction, applied pushes, gravity and normal forces. The theorem holds whether or not the forces are conservative, which makes it the most general energy tool in mechanics.

Because KE depends on v<sup>2</sup>, speed changes have outsized effects. Doubling speed multiplies kinetic energy by 4. Tripling it multiplies kinetic energy by 9. If the same braking force stops a car, the stopping distance scales the same way, because the work needed to remove the energy is force times distance.

## Potential energy and conservative forces

A force is conservative if the work it does depends only on the start and end points, not the path. Gravity and ideal springs are conservative. Friction and air drag are not: sliding a box along a longer route makes friction remove more energy.

Each conservative force has a potential energy:

- Gravity near Earth's surface: PE = mgh, where h is height above any reference level you choose.
- Ideal spring: PE = &frac12;kx<sup>2</sup>, where x is the stretch or compression from the natural length.

Only changes in potential energy matter physically, so the choice of h = 0 is free. Pick the lowest point in the problem to keep numbers positive.

## Conservation of mechanical energy

Mechanical energy is E = KE + PE. If only conservative forces do work (other forces may act, but they must do zero work, like a normal force perpendicular to a frictionless track), then

**KE<sub>i</sub> + PE<sub>i</sub> = KE<sub>f</sub> + PE<sub>f</sub>**

When friction or an applied force does work, add that work as a separate term:

**KE<sub>i</sub> + PE<sub>i</sub> + W<sub>nc</sub> = KE<sub>f</sub> + PE<sub>f</sub>**

W<sub>nc</sub> is the work of nonconservative forces. Kinetic friction always makes it negative for a sliding object, and the mechanical energy that disappears reappears as heat in the box and the floor. Total energy, counting heat, is still conserved. Only the mechanical part shrinks.

A fast way to see that mass cancels: for an object starting at rest and dropping height h with no friction, mgh = &frac12;mv<sup>2</sup>, so v = &radic;(2gh). A heavy cart and a light cart released from the same height on the same frictionless track reach the bottom with the same speed, whatever the shape of the track.

![Bar and line plot of kinetic, potential and total energy of a 2.0 kg cart as it descends a 5.0 m ramp, with and without friction](assets/notes/work-energy-theorem-conservation-of-energy.png "Without friction the total stays at 98 J while PE turns into KE. With friction removing 17 J along the way, the cart arrives with 81 J of kinetic energy.")

## Worked example 1: work by an angled force

A student drags a sled 12 m across level snow by pulling a rope with 40 N of tension at 30&deg; above the horizontal. How much work does the rope do?

1. The displacement is horizontal, and the rope makes 30&deg; with it.
2. W = Fd cos &theta; = (40)(12)(cos 30&deg;) = (40)(12)(0.866) = **about 416 J**.

Only the horizontal part of the pull, 40 cos 30&deg; = 34.6 N, does work. The vertical part lifts a little on the sled and reduces the normal force, but it does no work because the sled does not move vertically.

## Worked example 2: stopping distance from the work-energy theorem

A 4.0 kg box slides across a floor at 6.0 m/s. The coefficient of kinetic friction is 0.25. Take g as 9.8 m/s<sup>2</sup>. Find the sliding distance.

1. Friction is the only force doing work (gravity and the normal force are perpendicular to the motion). Its size is &mu;<sub>k</sub>mg = (0.25)(4.0)(9.8) = 9.8 N.
2. The box loses all of its kinetic energy: &Delta;KE = 0 - &frac12;(4.0)(6.0)<sup>2</sup> = -72 J.
3. W<sub>friction</sub> = -(9.8)d = -72 J, so d = **about 7.3 m**.

Notice that the mass cancels if you work it algebraically: d = v<sup>2</sup>/(2&mu;<sub>k</sub>g). A box twice as heavy slides the same distance at the same starting speed.

## Worked example 3: a ramp with and without friction

A 2.0 kg cart is released from rest at the top of a ramp 5.0 m high. Use g = 9.8 m/s<sup>2</sup> and set h = 0 at the bottom.

**Frictionless.** PE at the top is mgh = (2.0)(9.8)(5.0) = 98 J and KE is zero. At the bottom all 98 J is kinetic, so &frac12;(2.0)v<sup>2</sup> = 98 and v = **9.9 m/s**. Partway down, at 1.8 m above the bottom, the cart has dropped 3.2 m, so v = &radic;(2 &times; 9.8 &times; 3.2) = 7.9 m/s.

**With friction.** Suppose a sensor at the bottom reads 9.0 m/s instead. Then KE<sub>f</sub> = &frac12;(2.0)(9.0)<sup>2</sup> = 81 J. Using E<sub>i</sub> + W<sub>nc</sub> = E<sub>f</sub>: 98 + W<sub>nc</sub> = 81, so W<sub>nc</sub> = **-17 J**. Friction turned 17 J of mechanical energy into heat on the way down.

## Worked example 4: a spring launcher

A horizontal spring with k = 250 N/m is compressed 0.12 m and released, launching a 0.15 kg ball across a frictionless table.

1. Stored energy: &frac12;kx<sup>2</sup> = &frac12;(250)(0.12)<sup>2</sup> = 1.8 J.
2. All of it becomes kinetic: &frac12;(0.15)v<sup>2</sup> = 1.8, so v<sup>2</sup> = 24 and v = **about 4.9 m/s**.

If the compression doubled to 0.24 m, the stored energy would quadruple to 7.2 J, and the launch speed would double to about 9.8 m/s. Energy goes as x<sup>2</sup>, speed goes as x.

## Power: how fast work happens

Power is work per unit time, P = W/t, measured in watts (1 W = 1 J/s). For a force pushing an object at steady speed v in the direction of motion, P = Fv.

Example: a freight elevator lifts a 600 kg load 15 m at constant speed in 20 s. At constant speed the motor's upward force equals the weight, so the work is mgh = (600)(9.8)(15) = 88,200 J, and P = 88,200/20 = **about 4.4 kW**. Lifting the same load in 10 s takes the same work but twice the power.

A kilowatt-hour is power multiplied by time, so it is a unit of energy: 1 kWh = 1000 W &times; 3600 s = 3.6 &times; 10<sup>6</sup> J.

## Which tool should you reach for?

1. **Speeds and positions given, time not asked?** Use energy, not kinematics. Energy methods ignore the shape of the path for conservative forces.
2. **Only gravity and springs doing work?** Use conservation of mechanical energy, KE + PE = constant.
3. **Friction or an applied force doing work?** Add W<sub>nc</sub> to the energy balance, or use the work-energy theorem with W<sub>net</sub>.
4. **Asked how fast energy is delivered?** That is power, P = W/t or P = Fv.

## Common traps

- **Giving the normal force work on a flat surface.** It is perpendicular to the motion, so it does zero work. Centripetal forces in uniform circular motion also do zero work, which is why the speed stays constant.
- **Forgetting that work can be negative.** Friction on a sliding object and gravity on a rising object both do negative work.
- **Using W<sub>net</sub> = &Delta;E.** The theorem uses kinetic energy only. If you include potential energy on the right side, leave gravity's work out of the left side, or you will count it twice.
- **Thinking mass changes the speed after a drop.** Without friction, v = &radic;(2gh) for any mass and any track shape.
- **Measuring spring x from the wrong point.** x is the change from the natural length, not the total length of the spring.
- **Calling a kilowatt-hour a unit of power.** It is energy.
- **Assuming energy disappears with friction.** Mechanical energy decreases, but it becomes thermal energy. Total energy is conserved.

## One-minute recap

Work is W = Fd cos &theta;: positive when the force helps the motion, negative when it opposes it, zero when it is perpendicular. The work-energy theorem, W<sub>net</sub> = &Delta;KE, always works if you include every force. When only gravity and springs do work, KE + PE is constant, so v = &radic;(2gh) after a drop of h, independent of mass and path. With friction, E<sub>i</sub> + W<sub>nc</sub> = E<sub>f</sub>, and W<sub>nc</sub> is negative. Gravity PE is mgh, spring PE is &frac12;kx<sup>2</sup>, KE is &frac12;mv<sup>2</sup>. Power is W/t or Fv, in watts, and a kilowatt-hour is energy.

:::quiz
Q: A 70 N force pulls a crate 5.0 m along a level floor at 60° above the horizontal. How much work does the force do?
A: W = Fd cos θ = (70)(5.0)(0.50) = 175 J. Only the horizontal component of the pull does work on the horizontal displacement.
Q: A car's speed increases from 10 m/s to 30 m/s. By what factor does its kinetic energy change?
A: Kinetic energy goes as v squared, so tripling the speed multiplies KE by 9.
Q: Two balls, 1 kg and 3 kg, slide from rest down the same frictionless slide of height 2.0 m. Which reaches the bottom faster, and how fast? (g = 9.8 m/s²)
A: They arrive with the same speed, v = √(2gh) = √(39.2), about 6.3 m/s, because mass cancels in mgh = ½mv².
Q: A 1.0 kg block released from rest 4.0 m above the ground on a rough ramp reaches the bottom at 8.0 m/s. How much work did friction do? (g = 9.8 m/s²)
A: Starting energy is mgh = 39.2 J and final KE is ½(1.0)(8.0)² = 32 J, so friction did about -7.2 J of work.
Q: A motor lifts a 50 kg mass 6.0 m at constant speed in 3.0 s. What is its power output? (g = 9.8 m/s²)
A: The work is mgh = (50)(9.8)(6.0) = 2940 J, and dividing by 3.0 s gives about 980 W.
:::

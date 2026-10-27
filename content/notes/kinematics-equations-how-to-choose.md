---
title: Kinematics Equations for the MCAT: How to Choose the Right One
description: The four constant-acceleration kinematics equations, how to pick one by the variable you lack, and worked braking, free fall and projectile examples.
product: 4a-motion-forces-energy
published: 2026-10-27
related: work-energy-theorem-conservation-of-energy, bernoulli-equation-continuity-venturi
---

There are four kinematics equations for motion with constant acceleration, and each one leaves out exactly one of the five variables: displacement &Delta;x, initial velocity v<sub>0</sub>, final velocity v, acceleration a, and time t. To choose, list the three values the problem gives you and the one it asks for. The variable that is neither given nor asked for is the one you do not care about, so pick the equation that does not contain it.

## The four equations and what each one skips

| Equation | Leaves out | Use it when |
|---|---|---|
| v = v<sub>0</sub> + at | &Delta;x | no distance is given or asked |
| &Delta;x = v<sub>0</sub>t + &frac12;at<sup>2</sup> | v | final speed is unknown and unwanted |
| v<sup>2</sup> = v<sub>0</sub><sup>2</sup> + 2a&Delta;x | t | no time is given or asked |
| &Delta;x = &frac12;(v<sub>0</sub> + v)t | a | acceleration is unknown and unwanted |

All four assume the acceleration is constant during the interval. If a problem has two stages with different accelerations, such as a sprinter speeding up and then coasting, treat each stage separately and pass the final velocity of the first stage forward as the initial velocity of the second.

## Where the equations come from

A velocity versus time graph makes all four equations visible. When acceleration is constant, the graph is a straight line whose slope is a. Rearranging slope = (v &minus; v<sub>0</sub>)/t gives the first equation.

Displacement is the area under the velocity line. That area is a trapezoid with parallel sides v<sub>0</sub> and v and width t, so &Delta;x = &frac12;(v<sub>0</sub> + v)t, which is the fourth equation. Splitting the same trapezoid into a rectangle (v<sub>0</sub>t) and a triangle (&frac12;t times at) gives the second equation. Eliminating t between the first and fourth equations gives the third.

![Velocity versus time line for constant acceleration with the shaded area showing displacement](assets/notes/kinematics-equations-how-to-choose.png "Slope of the v-t line is acceleration; the shaded area is displacement.")

In the diagram the object starts at 4 m/s and gains 2 m/s every second. After 5 s it moves at 14 m/s. The shaded trapezoid has area &frac12;(4 + 14)(5) = 45 m, and the rectangle plus triangle split gives 20 m + 25 m, the same 45 m.

## A four-step method

1. Pick a positive direction and keep it. For vertical motion, choosing up as positive makes g = &minus;9.8 m/s<sup>2</sup>, which many problems round to &minus;10 m/s<sup>2</sup>.
2. Write down all five variables and fill in what is known. Hidden values count: "starts from rest" means v<sub>0</sub> = 0, "comes to a stop" means v = 0, and "at the top of its flight" means the vertical velocity is 0.
3. Cross out the variable you neither know nor need. Use the equation that lacks it.
4. Solve with symbols first, then plug in numbers and check that the sign and size make sense.

## Worked examples

### Braking distance

A car moving at 24 m/s brakes to a stop in 36 m with constant deceleration. What is its acceleration, and how long does braking take?

Known: v<sub>0</sub> = 24 m/s, v = 0, &Delta;x = 36 m. Time is not given, so the first question calls for v<sup>2</sup> = v<sub>0</sub><sup>2</sup> + 2a&Delta;x:

0 = 576 + 2a(36), so a = &minus;576/72 = &minus;8.0 m/s<sup>2</sup>.

For time, the equation without a avoids reusing a computed value: 36 = &frac12;(24 + 0)t, so t = 3.0 s. As a check, v = v<sub>0</sub> + at gives 0 = 24 + (&minus;8.0)(3.0). The answers agree.

### Ball thrown straight up

A ball leaves a hand moving upward at 15 m/s. Take g = 10 m/s<sup>2</sup> and ignore air resistance. How high does it rise, and how long until it returns to the launch height?

At the top, v = 0. With up as positive, a = &minus;10 m/s<sup>2</sup>. Height has no time in it: 0 = 225 + 2(&minus;10)&Delta;y, so &Delta;y = 11.25 m. The time to the top is t = (0 &minus; 15)/(&minus;10) = 1.5 s. Without air resistance the trip down mirrors the trip up, so the total time is 3.0 s and the ball returns at 15 m/s downward.

### Horizontal launch

A ball rolls off a table edge 0.80 m above the floor at 3.0 m/s. How far from the table does it land?

Split the motion. Vertically, v<sub>0y</sub> = 0 and a = &minus;10 m/s<sup>2</sup>, so &minus;0.80 = &frac12;(&minus;10)t<sup>2</sup> and t = 0.40 s. Horizontally there is no acceleration, so &Delta;x = (3.0)(0.40) = 1.2 m. Time is the only quantity shared between the two directions.

## Common traps

- **Mixing signs.** If up is positive, a falling object has negative velocity and g is negative throughout, even at the top of its path, where velocity is zero but acceleration is still &minus;g.
- **Assuming zero acceleration at the peak.** The velocity is momentarily zero, not the acceleration. Gravity never switches off.
- **Using kinematics when acceleration changes.** A falling object near terminal velocity, or a spring launch, does not have constant acceleration, so these equations do not apply directly. Energy methods often work better.
- **Carrying horizontal speed into the vertical equations.** In projectile motion, the horizontal and vertical motions share only time.
- **Forgetting the square.** In v<sup>2</sup> = v<sub>0</sub><sup>2</sup> + 2a&Delta;x, doubling the initial speed quadruples the stopping distance at the same deceleration, it does not double it.
- **Speed versus velocity.** A ball that returns to its launch point has zero displacement, even though it traveled a distance of twice its maximum height.

## One-minute recap

- Five variables, four equations, each equation missing one variable.
- Choose the equation that leaves out the variable you neither have nor want.
- Slope of a v-t graph is acceleration, area under it is displacement.
- Translate words into values: "from rest", "stops", and "at the top" each give a zero.
- Projectiles: solve vertical and horizontal motion separately, linked by time.

If you want more drills on motion, forces and energy, the [4A motion, forces and energy pack](https://buy.polar.sh/polar_cl_JNk012arYDPoX8YBL5ur1qM7noCVz8Y1NNLGw22zgLo) adds flashcards and practice questions on these topics, and the [free sampler](/#sampler) lets you try sample cards first.

:::quiz
Q: A cart starts from rest and accelerates at 3.0 m/s<sup>2</sup> for 4.0 s. How far does it travel?
A: 24 m. Using &Delta;x = v<sub>0</sub>t + &frac12;at<sup>2</sup> with v<sub>0</sub> = 0 gives &frac12;(3.0)(16) = 24 m.
Q: Which kinematics equation do you use if a problem gives initial speed, final speed and distance, and asks for acceleration?
A: v<sup>2</sup> = v<sub>0</sub><sup>2</sup> + 2a&Delta;x, because time is neither given nor asked, and this is the equation without t.
Q: A runner speeds up from 2.0 m/s to 8.0 m/s in 3.0 s at constant acceleration. What is the displacement?
A: 15 m. The equation without a gives &Delta;x = &frac12;(2.0 + 8.0)(3.0) = 15 m.
Q: At the highest point of a vertical toss, what are the velocity and acceleration?
A: The velocity is zero, but the acceleration is still g downward, about 9.8 m/s<sup>2</sup>, because gravity acts the whole time.
Q: If a car's speed doubles, how does its stopping distance change at the same constant deceleration?
A: It becomes four times as large, because &Delta;x = v<sub>0</sub><sup>2</sup>/(2|a|) when the car comes to rest.
:::

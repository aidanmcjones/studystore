---
title: Radioactive Decay and Half-Life Calculations for the MCAT
description: Balance alpha, beta and gamma decay equations, then solve half-life problems for fraction left, elapsed time and activity, with worked examples.
product: 4e-atoms-nuclear-periodic
published: 2026-10-20
---

Radioactive decay is a first-order process: in each half-life, half of whatever parent nuclei remain will decay, no matter how many you start with. That single fact gives you the working formula N = N<sub>0</sub>(1/2)<sup>t/t<sub>1/2</sub></sup>, and most half-life questions reduce to counting how many half-lives fit into the elapsed time. The other half of the topic is bookkeeping: every decay equation must conserve mass number (A) and atomic number (Z), and each decay mode changes them in a fixed way.

## The decay modes and what they do to A and Z

Write a nuclide as <sup>A</sup><sub>Z</sub>X, where A is the number of protons plus neutrons and Z is the number of protons. A decay equation balances when the A values add up on both sides and the Z values add up on both sides.

| Mode | Particle emitted | Change in A | Change in Z | When it happens | Example |
|---|---|---|---|---|---|
| Alpha (&alpha;) | <sup>4</sup><sub>2</sub>He nucleus | -4 | -2 | Heavy nuclei, mostly Z above 83 | <sup>226</sup>Ra &rarr; <sup>222</sup>Rn + &alpha; |
| Beta-minus (&beta;<sup>-</sup>) | electron and antineutrino | 0 | +1 | Too many neutrons | <sup>32</sup>P &rarr; <sup>32</sup>S + &beta;<sup>-</sup> |
| Beta-plus (&beta;<sup>+</sup>, positron) | positron and neutrino | 0 | -1 | Too few neutrons | <sup>18</sup>F &rarr; <sup>18</sup>O + &beta;<sup>+</sup> |
| Electron capture | neutrino (an inner electron is absorbed) | 0 | -1 | Too few neutrons | <sup>7</sup>Be + e<sup>-</sup> &rarr; <sup>7</sup>Li |
| Gamma (&gamma;) | high-energy photon | 0 | 0 | Excited nucleus relaxing | <sup>99m</sup>Tc &rarr; <sup>99</sup>Tc + &gamma; |

The logic behind the beta modes is worth owning rather than memorizing. In beta-minus decay a neutron inside the nucleus turns into a proton, so Z goes up by one while A stays the same. The emitted electron is created in that conversion; it does not come from the electron cloud. Beta-plus decay and electron capture both turn a proton into a neutron, so Z goes down by one. Since stable heavy nuclei need more neutrons than protons (up to about 1.5 neutrons per proton), a nucleus that is neutron-rich fixes itself with beta-minus decay, and one that is neutron-poor uses positron emission or electron capture.

To balance an unknown, write the two conservation sums separately. Suppose <sup>210</sup><sub>84</sub>Po emits an alpha particle. Mass: 210 = 4 + A, so A = 206. Charge: 84 = 2 + Z, so Z = 82, which is lead. The product is <sup>206</sup><sub>82</sub>Pb.

### Penetration and ionization

The three classic emissions sort in opposite orders for penetration and ionization. Alpha particles are heavy and doubly charged, so they ionize strongly and are stopped by a sheet of paper or the outer layer of skin. Beta particles get through paper but are stopped by a few millimeters of aluminum. Gamma rays carry no charge and no mass, so they penetrate furthest and need thick lead or concrete for shielding. A useful consequence: an alpha emitter is relatively harmless outside the body but very damaging if swallowed or inhaled, because all of its energy is deposited in a small volume of tissue.

## Why decay follows half-lives

Each unstable nucleus has the same fixed probability of decaying per unit time, set by the decay constant k. With N nuclei present, the number decaying per second is proportional to N:

rate = kN, which integrates to N = N<sub>0</sub>e<sup>-kt</sup>

Setting N = N<sub>0</sub>/2 and solving gives the half-life:

t<sub>1/2</sub> = ln 2 / k = 0.693 / k

Because ln 2 is a constant, the half-life does not depend on how much material you have, on temperature, or on chemical form. A gram of iodine-131 and a kilogram of it both lose half their nuclei in about 8.0 days. Combining the two equations gives the version most problems use:

N / N<sub>0</sub> = (1/2)<sup>n</sup>, where n = t / t<sub>1/2</sub>

![Exponential decay plotted against time in half-lives on a linear axis and as the natural log of the fraction remaining](assets/notes/radioactive-decay-half-life-calculations.png "Left: each half-life cuts the remaining fraction in half (50, 25, 12.5, 6.25 percent). Right: the natural log of the fraction falls in a straight line with slope -k.")

Two related quantities show up in harder questions:

- **Activity** A = kN, the number of decays per second, measured in becquerels (1 Bq = 1 decay per second). Older problems use curies, 1 Ci = 3.7 &times; 10<sup>10</sup> Bq. Since activity is proportional to N, it falls with the same half-life as the nuclei themselves.
- **Mean lifetime** &tau; = 1/k = t<sub>1/2</sub> / 0.693, about 1.44 half-lives. It is the average time a nucleus survives before decaying.

## A fraction table worth knowing cold

| Half-lives elapsed | Fraction remaining | Percent remaining | Percent decayed |
|---|---|---|---|
| 1 | 1/2 | 50% | 50% |
| 2 | 1/4 | 25% | 75% |
| 3 | 1/8 | 12.5% | 87.5% |
| 4 | 1/16 | 6.25% | 93.75% |
| 5 | 1/32 | about 3.1% | about 96.9% |
| 10 | 1/1024 | about 0.1% | about 99.9% |

The ten half-lives row is a handy anchor: 2<sup>10</sup> = 1024 is close to 1000, so after ten half-lives roughly one part in a thousand survives. Read questions carefully for "remaining" versus "decayed", since the two columns are easy to swap.

## Worked examples

### Example 1: whole numbers of half-lives

A hospital pharmacy measures 800 MBq of fluorine-18 (half-life about 110 minutes) at 8:00 a.m. What is the activity at 11:40 a.m.?

1. Elapsed time: 3 hours 40 minutes = 220 minutes.
2. Number of half-lives: n = 220 / 110 = 2.
3. Activity: 800 &times; (1/2)<sup>2</sup> = 800 / 4 = **200 MBq**.

### Example 2: a fractional number of half-lives

Technetium-99m has a half-life of about 6.0 hours. What fraction of a sample is left after 9.0 hours?

1. n = 9.0 / 6.0 = 1.5.
2. Fraction = (1/2)<sup>1.5</sup> = 1 / (2 &times; &radic;2) = 1 / 2.83, about **0.35, or 35%**.

You can sanity-check this without a calculator: after one half-life 50% remains and after two 25% remains, so 1.5 half-lives must land between them. Because the curve is exponential, the answer sits a little below the midpoint of 37.5%.

### Example 3: solving for time

How long until a sample of iodine-131 (half-life 8.0 days) falls to 10% of its starting amount?

1. Set (1/2)<sup>n</sup> = 0.10, so 2<sup>n</sup> = 10.
2. n = log 10 / log 2 = 1 / 0.301 = 3.32 half-lives.
3. t = 3.32 &times; 8.0 days, about **27 days**.

Bracket check: three half-lives leave 12.5% and four leave 6.25%, so 10% must fall between 24 and 32 days. On a multiple-choice question, the bracket alone usually picks the answer.

### Example 4: radiocarbon dating

A wood sample has 12.5% of the carbon-14 found in living wood. Carbon-14 has a half-life of about 5730 years. Since 12.5% = (1/2)<sup>3</sup>, three half-lives have passed, and the age is 3 &times; 5730 = **about 17,200 years**. Living organisms keep exchanging carbon with the environment, so the clock starts at death, when uptake stops.

### Example 5: comparing activities

Two samples contain the same number of nuclei: one of technetium-99m (half-life 6 hours) and one of iodine-131 (half-life 8.0 days, which is 192 hours). Which is more active, and by how much? Activity is kN and k = 0.693 / t<sub>1/2</sub>, so at equal N the activity ratio is the inverse of the half-life ratio: 192 / 6 = **32 times more active for Tc-99m**. A short half-life means a hotter sample, not a weaker one.

## Common traps

- **Thinking a sample is gone after two half-lives.** Two half-lives leave 25%, not zero. Decay approaches zero but never jumps to it.
- **Subtracting half the original amount each time.** Each half-life removes half of what is left, not half of the starting amount. The amounts go 100, 50, 25, 12.5, not 100, 50, 0.
- **Expecting half-life to change with sample size, temperature or pressure.** It does not. Nuclear decay is insensitive to ordinary chemical conditions.
- **Getting the beta direction backward.** Beta-minus raises Z (neutron becomes proton). Beta-plus and electron capture lower Z.
- **Placing the beta electron in the electron cloud.** It is made in the nucleus during the neutron-to-proton conversion.
- **Forgetting that gamma changes nothing.** A and Z are unchanged. Only the energy state of the nucleus drops.
- **Linking "most penetrating" with "most ionizing".** They are opposite ends: alpha ionizes most and penetrates least, gamma the reverse.
- **Mixing time units.** Convert the elapsed time and the half-life into the same unit before dividing.

## One-minute recap

Balance every nuclear equation by conserving A and Z separately. Alpha: A drops 4, Z drops 2. Beta-minus: Z up 1. Beta-plus and electron capture: Z down 1. Gamma: no change. Decay is first order, so N = N<sub>0</sub>(1/2)<sup>t/t<sub>1/2</sub></sup> and t<sub>1/2</sub> = 0.693/k. Count half-lives first, then halve that many times. For non-integer cases, bracket between whole half-lives or use logs. Activity A = kN falls with the same half-life, and at equal N a shorter half-life means higher activity.

:::quiz
Q: Thorium-232 (Z = 90) emits an alpha particle. What are the mass number and atomic number of the product?
A: A = 228 and Z = 88, which is radium-228. Alpha emission removes 4 from the mass number and 2 from the atomic number.
Q: A nuclide with too many neutrons for stability most likely decays by which mode, and what happens to its atomic number?
A: Beta-minus decay. A neutron becomes a proton, so the atomic number rises by 1 while the mass number stays the same.
Q: A sample of 640 mg of a nuclide with a 3-day half-life is stored for 12 days. How much of the original nuclide remains?
A: 40 mg. Twelve days is four half-lives, and 640 divided by 2 four times (640 / 16) gives 40 mg.
Q: What is the decay constant k of a nuclide whose half-life is 10 minutes?
A: About 0.069 per minute, since k = 0.693 divided by the half-life, and 0.693 / 10 min = 0.0693 per minute.
Q: Doubling the amount of a radioactive sample does what to its half-life and to its activity?
A: The half-life stays the same, because it is a property of the nuclide. The activity doubles, because activity equals kN and N has doubled.
:::

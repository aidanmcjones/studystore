---
title: Photoelectric Effect: Work Function, Threshold Frequency and Stopping Potential
description: How light ejects electrons from a metal, why only frequency sets the electron energy, and how to use KE = hf - work function with worked numbers.
product: 4e-atoms-nuclear-periodic
published: 2026-11-05
related: types-of-radioactive-decay-alpha-beta-gamma-mcat, radioactive-decay-half-life-calculations, coulombs-law-electric-field-potential-energy, thin-lens-mirror-equation-sign-conventions
seo_title: Photoelectric Effect: Work Function and Stopping Potential (MCAT)
seo_description: KE max = hf - work function explained with threshold frequency, stopping potential, intensity vs frequency, and worked MCAT-style examples.
---

The photoelectric effect is the ejection of electrons from a metal surface when light shines on it. It matters because classical wave theory predicted the wrong behavior, and the correct explanation treats light as particles called **photons**, each carrying energy **E = hf**.

## The key equation

**KE<sub>max</sub> = hf - &phi;**

Here h is Planck's constant (6.63 &times; 10<sup>-34</sup> J&middot;s), f is the light frequency, and &phi; is the **work function**, the minimum energy needed to free an electron from that metal. One photon gives all its energy to one electron. If hf is less than &phi;, no electron escapes, no matter how many photons arrive.

The **threshold frequency** is f<sub>0</sub> = &phi;/h. Below it nothing is emitted. Above it, the extra energy becomes kinetic energy of the electron. Using wavelength, E = hc/&lambda;, with hc about 1240 eV&middot;nm.

## What the experiment showed

| Observation | Classical wave prediction | Photon explanation |
|---|---|---|
| A threshold frequency exists | Any frequency should work if bright enough | Each photon must individually supply at least &phi; |
| KE<sub>max</sub> rises with frequency | KE should rise with intensity | KE = hf - &phi; depends on f only |
| Higher intensity gives more electrons | Predicted | More photons means more ejected electrons, same KE<sub>max</sub> |
| Emission is nearly instant | Should need time to build up energy | One photon, one electron, no accumulation |

The most tested distinction: **intensity changes the number of electrons (the current); frequency changes their maximum kinetic energy.**

## Stopping potential

Reverse the voltage between the plates until the current drops to zero. That voltage is the **stopping potential**, V<sub>s</sub>, and it satisfies

**eV<sub>s</sub> = KE<sub>max</sub>**

A graph of KE<sub>max</sub> against frequency is a straight line. Its slope is h, its x-intercept is f<sub>0</sub>, and its y-intercept is -&phi;. The slope is the same for every metal, and only the intercept changes.

## Worked example

Sodium has a work function of about 2.3 eV. Light of wavelength 400 nm hits it.

1. Photon energy: 1240 / 400 = **3.1 eV**.
2. KE<sub>max</sub> = 3.1 - 2.3 = **0.8 eV**.
3. Stopping potential: **0.8 V**, since the electron charge is one elementary charge.
4. Threshold wavelength: 1240 / 2.3, about **540 nm**. Light of longer wavelength, such as red, ejects nothing.

If the intensity doubles, the current doubles but KE<sub>max</sub> and V<sub>s</sub> stay 0.8 eV and 0.8 V.

## Common traps

- **Thinking brighter light raises electron energy.** Only frequency does.
- **Mixing units.** Use eV with 1240 eV&middot;nm, or joules with h and f, but not both.
- **Forgetting that KE<sub>max</sub> is a maximum.** Electrons freed from below the surface lose extra energy.
- **Assuming a lower work function lowers the slope.** The slope is always h.

## One-minute recap

Photons carry E = hf. An electron leaves only if hf is at least &phi;, and then KE<sub>max</sub> = hf - &phi;. Frequency sets electron energy, intensity sets electron count, and eV<sub>s</sub> = KE<sub>max</sub>. The KE versus f line has slope h and x-intercept f<sub>0</sub>.

:::quiz
Q: Red light fails to eject electrons from a metal. Does making the red light much brighter help?
A: No. Each photon's energy hf is below the work function, so no single electron can be freed. Only a higher frequency helps.
Q: Light with photon energy 5.0 eV hits a metal with work function 3.2 eV. What is the stopping potential?
A: KE max = 5.0 - 3.2 = 1.8 eV, so the stopping potential is 1.8 V.
Q: What does the slope of a KE max versus frequency graph represent?
A: Planck's constant h, and it is the same for every metal.
Q: If light intensity doubles at fixed frequency above threshold, what happens to the photocurrent and KE max?
A: The photocurrent doubles because twice as many photons eject twice as many electrons, but KE max is unchanged.
Q: A metal has a work function of 2.0 eV. What is its threshold wavelength?
A: 1240 / 2.0 = 620 nm. Light of longer wavelength cannot eject electrons.
:::

---
title: Gibbs Free Energy: Delta G, Spontaneity and Temperature
description: Use delta G = delta H - T delta S to predict spontaneity, find the crossover temperature, and link delta G to K and Q, with worked numbers.
seo_title: Gibbs Free Energy and Spontaneity (Delta G) | MCAT
seo_description: Free MCAT notes on Gibbs free energy: use delta G = delta H - T delta S to predict spontaneity, with worked numbers and a 5-question quiz.
product: 5e-thermo-kinetics
published: 2026-10-20
related: galvanic-vs-electrolytic-cells, passive-vs-active-transport
---

Gibbs free energy tells you whether a process can happen on its own at constant temperature and pressure. The working equation is **&Delta;G = &Delta;H - T&Delta;S**. If &Delta;G is negative the process is spontaneous (exergonic), if it is positive the process is nonspontaneous as written (endergonic) and the reverse direction is favored, and if it is zero the system is at equilibrium. Spontaneous means thermodynamically allowed. It says nothing about speed.

## Where the equation comes from

The second law says a process is spontaneous when the total entropy of the universe rises: &Delta;S<sub>universe</sub> = &Delta;S<sub>system</sub> + &Delta;S<sub>surroundings</sub> &gt; 0. Measuring the surroundings directly is awkward, so chemists rewrite their entropy change in terms of the system.

At constant pressure, heat released by the system equals heat absorbed by the surroundings, so &Delta;S<sub>surroundings</sub> = -&Delta;H<sub>system</sub>/T. Substituting gives &Delta;S<sub>universe</sub> = &Delta;S - &Delta;H/T. Multiply through by -T and you get -T&Delta;S<sub>universe</sub> = &Delta;H - T&Delta;S, which is defined as &Delta;G. Because of that minus sign, a positive &Delta;S<sub>universe</sub> becomes a negative &Delta;G. So "&Delta;G less than zero" is just the second law written using only properties of the system.

This derivation also explains why an exothermic reaction can be spontaneous even when the system's entropy falls. The heat it releases raises the entropy of the surroundings, and at low enough temperature that gain outweighs the system's loss.

## The four sign combinations

&Delta;H and &Delta;S are each either positive or negative, so there are four cases. Temperature is always positive in kelvin, so the -T&Delta;S term always has the opposite sign of &Delta;S.

| &Delta;H | &Delta;S | Sign of &Delta;G | Spontaneous when |
|---|---|---|---|
| Negative | Positive | Always negative | At every temperature |
| Positive | Negative | Always positive | Never (the reverse is always spontaneous) |
| Positive | Positive | Negative only if T&Delta;S beats &Delta;H | Above the crossover temperature |
| Negative | Negative | Negative only if &Delta;H beats T&Delta;S | Below the crossover temperature |

A memory hook of my own: in the two mixed cases, temperature takes the side of entropy. When entropy helps (&Delta;S positive), heating helps. When entropy hurts (&Delta;S negative), heating hurts.

![Delta G plotted against temperature for the four sign combinations of delta H and delta S, with crossover temperatures marked](assets/notes/gibbs-free-energy-delta-g-spontaneity.png "Each line has intercept delta H and slope minus delta S. A line crosses zero only when delta H and delta S share a sign.")

## The crossover temperature

When &Delta;H and &Delta;S have the same sign, &Delta;G changes sign at one temperature. Set &Delta;G = 0 and solve:

**T = &Delta;H / &Delta;S**

This is the temperature where the system is at equilibrium under standard conditions. For a phase change, it is the melting or boiling point. The estimate assumes &Delta;H and &Delta;S stay roughly constant with temperature, which is a reasonable approximation over a modest range.

Graphically, &Delta;G = &Delta;H - T&Delta;S is a straight line in T with y-intercept &Delta;H and slope -&Delta;S. A positive &Delta;S gives a line that falls as temperature rises, and a negative &Delta;S gives a line that climbs.

## Worked example 1: melting ice

For H<sub>2</sub>O(s) &rarr; H<sub>2</sub>O(l), approximate values are &Delta;H = +6.01 kJ/mol and &Delta;S = +22.0 J/(mol&middot;K). Both are positive, so melting is favored only at high temperature.

1. Convert units so they match: 22.0 J/(mol&middot;K) = 0.0220 kJ/(mol&middot;K).
2. Crossover: T = 6.01 / 0.0220 = **273 K**, the normal melting point. The equation reproduces a number you already know, which is a good sanity check.
3. At 263 K (-10 C): &Delta;G = 6.01 - (263)(0.0220) = 6.01 - 5.79 = **+0.22 kJ/mol**. Positive, so ice does not melt, and the reverse, freezing, is spontaneous.
4. At 283 K (+10 C): &Delta;G = 6.01 - (283)(0.0220) = 6.01 - 6.23 = **-0.22 kJ/mol**. Negative, so ice melts.

## Worked example 2: decomposing limestone

Calcium carbonate breaks down to lime and carbon dioxide: CaCO<sub>3</sub>(s) &rarr; CaO(s) + CO<sub>2</sub>(g). Using approximate standard values &Delta;H&deg; = +178 kJ and &Delta;S&deg; = +161 J/K:

1. The reaction makes a mole of gas from a solid, so a large positive &Delta;S makes sense. Breaking the carbonate costs energy, so &Delta;H is positive.
2. At 298 K: &Delta;G&deg; = 178 - (298)(0.161) = 178 - 48 = **+130 kJ**. Strongly nonspontaneous at room temperature, which is why limestone buildings survive.
3. Crossover: T = 178 / 0.161, about **1106 K**, or roughly 830 C. Above that temperature the decomposition becomes favorable under standard conditions, which is why lime kilns run very hot.

Treat the 1106 K figure as an estimate, since &Delta;H and &Delta;S drift somewhat at high temperature.

## Standard versus actual free energy

The degree symbol matters. **&Delta;G&deg;** is the free energy change when every species is in its standard state: 1 M for solutes, 1 atm for gases, pure solids and liquids, at a stated temperature (often 298 K). **&Delta;G** is the free energy change under the conditions actually present. They are linked by the reaction quotient Q:

**&Delta;G = &Delta;G&deg; + RT ln Q**

At equilibrium, &Delta;G = 0 and Q = K, which gives the second key equation:

**&Delta;G&deg; = -RT ln K**

With R = 8.314 J/(mol&middot;K) and T = 298 K, RT ln 10 is about 5.7 kJ/mol. So at room temperature every factor of 10 in K shifts &Delta;G&deg; by about 5.7 kJ/mol, and the sign rules line up:

| K | &Delta;G&deg; | At standard conditions |
|---|---|---|
| Greater than 1 | Negative | Products favored |
| Equal to 1 | Zero | Neither side favored |
| Less than 1 | Positive | Reactants favored |

In biochemistry you will also see &Delta;G&deg;', the standard value adjusted to pH 7. Cells rarely sit at standard concentrations, so the actual &Delta;G inside a cell can differ a lot from either standard value.

## Worked example 3: from &Delta;G&deg; to K and Q

A reaction A &rarr; B has &Delta;G&deg; = -11.4 kJ/mol at 298 K.

1. **Find K.** log K = 11.4 / 5.7 = 2.0, so K is about **100**. Products are favored at equilibrium.
2. **Mixture with Q = 1000.** &Delta;G = -11.4 + (2.48)(ln 1000) = -11.4 + (2.48)(6.91) = -11.4 + 17.1 = **+5.7 kJ/mol**. (Here RT = 2.48 kJ/mol.) Even though &Delta;G&deg; is negative, this mixture has too much B, so the reaction runs in reverse toward A.
3. **Shortcut.** &Delta;G = RT ln(Q/K) = (2.48)(ln 10) = 5.7 kJ/mol. Q is ten times K, so the mixture sits one factor of 10 past equilibrium on the product side.

The lesson: the sign of &Delta;G&deg; tells you where equilibrium lies, but the sign of &Delta;G tells you which way a particular mixture will move.

## Free energy adds up

Because G is a state function, &Delta;G values for reactions that add together also add together. Cells exploit this by coupling an unfavorable step to a favorable one through a shared intermediate. If a step has &Delta;G&deg;' = +20 kJ/mol and it is coupled to ATP hydrolysis (about -30.5 kJ/mol under biochemical standard conditions), the combined process has &Delta;G&deg;' of about -10.5 kJ/mol and proceeds. The same bookkeeping shows up in membrane transport, where pumping a solute uphill is paid for by ATP, as worked through in the [transport note](passive-vs-active-transport.html).

Free energy also connects to electrochemistry through &Delta;G = -nFE. A positive cell potential corresponds to a negative &Delta;G, which is why a battery runs on its own. The [galvanic vs electrolytic note](galvanic-vs-electrolytic-cells.html) uses that link.

## Common traps

- **Mixing joules and kilojoules.** &Delta;S is usually tabulated in J/K and &Delta;H in kJ. Convert one before you combine them. Forgetting this makes T&Delta;S a thousand times too large.
- **Using Celsius.** T must be in kelvin. A negative Celsius temperature in the equation gives nonsense.
- **Equating exothermic with spontaneous.** A negative &Delta;H helps, but a large negative &Delta;S can still make &Delta;G positive at high temperature.
- **Equating spontaneous with fast.** &Delta;G says nothing about activation energy. Diamond turning into graphite is favorable at room conditions and essentially never observed. A catalyst speeds a reaction without changing &Delta;G or K.
- **Confusing &Delta;G with &Delta;G&deg;.** At equilibrium &Delta;G = 0, but &Delta;G&deg; is generally not zero. &Delta;G&deg; is zero only when K = 1.
- **Reading a positive &Delta;G&deg; as "cannot happen."** If Q is small enough, RT ln Q can make &Delta;G negative and the reaction will run forward.

## One-minute recap

&Delta;G = &Delta;H - T&Delta;S. Negative means spontaneous, positive means the reverse is favored, zero means equilibrium. With &Delta;H negative and &Delta;S positive the process is always spontaneous; with the opposite signs, never. When the signs match, the crossover temperature T = &Delta;H/&Delta;S divides the two regimes, and temperature sides with entropy. &Delta;G = &Delta;G&deg; + RT ln Q, &Delta;G&deg; = -RT ln K, and at 298 K each factor of 10 in K is about 5.7 kJ/mol. Convert J to kJ and use kelvin.

:::quiz
Q: A reaction has ΔH = -40 kJ/mol and ΔS = -0.080 kJ/(mol·K). Above what temperature is it nonspontaneous?
A: T = ΔH/ΔS = (-40)/(-0.080) = 500 K. Both signs are negative, so the reaction is spontaneous below 500 K and nonspontaneous above it.
Q: Why can an exothermic reaction with a negative ΔS still be spontaneous at low temperature?
A: The released heat raises the entropy of the surroundings by -ΔH/T, which is large when T is small. If that gain exceeds the system's loss, ΔS of the universe is positive and ΔG is negative.
Q: A reaction has K = 0.001 at 298 K. What is the sign and approximate size of ΔG°?
A: K is three factors of 10 below 1, so ΔG° is about +3 × 5.7 = +17 kJ/mol. Positive ΔG° matches K less than 1.
Q: A reaction has a negative ΔG°, but a particular mixture has Q greater than K. Which way does that mixture react?
A: In reverse, toward reactants. ΔG = RT ln(Q/K) is positive when Q exceeds K, regardless of the sign of ΔG°.
Q: Adding a catalyst lowers a reaction's activation energy. What happens to ΔG and K?
A: Neither changes. A catalyst speeds both directions equally, so the system reaches the same equilibrium faster.
:::

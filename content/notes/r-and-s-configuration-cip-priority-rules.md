---
title: How to Assign R and S Configuration: CIP Priority Rules
description: A step-by-step method to rank groups by CIP priority and assign R or S from wedge-dash drawings and Fischer projections, with tie-breaker practice.
product: 5b-molecules-bonding-stereo
published: 2026-10-20
related: amino-acid-pka-charge-ph-7-4, enzyme-classes-ec-1-to-7
---

To assign R or S to a stereocenter, rank its four groups by the Cahn-Ingold-Prelog (CIP) rules, point the lowest priority group away from you, and trace the path from priority 1 to 2 to 3. A clockwise path gives R (from the Latin rectus) and a counterclockwise path gives S (sinister). If the lowest priority group is pointing toward you instead, read the direction and then reverse it. Almost every error comes from ranking the groups wrong, so most of this note is about the priority rules.

## Step 1: confirm it is a stereocenter

A stereocenter (chiral center) here means a tetrahedral carbon carrying four different groups. Check before you start ranking. A carbon with two identical groups, such as two methyls or two hydrogens, gets no R or S label. Glycine carries two H atoms on its alpha carbon, which is why glycine is the one standard amino acid with no stereocenter.

"Different" is judged on the whole group, not just the first atom. In 3-methylhexane, carbon 3 holds H, a methyl, an ethyl and a propyl group. Three of those start with carbon, but the groups as a whole differ, so carbon 3 is a stereocenter.

## Step 2: rank the four groups

Work through these rules in order.

1. **Compare the atoms bonded directly to the stereocenter.** Higher atomic number wins. Typical order: I &gt; Br &gt; Cl &gt; S &gt; F &gt; O &gt; N &gt; C &gt; H. For isotopes, higher mass wins, so deuterium outranks ordinary hydrogen.
2. **If two first atoms tie, list what each one carries.** Write the three atoms attached to each tied atom as a set, sorted from highest to lowest, for example (O, H, H). Compare the sets one position at a time and stop at the first difference.
3. **Still tied? Move one bond further out**, following the highest ranked branch first, and repeat the comparison.
4. **Double and triple bonds count as duplicates.** A C=O carbon is treated as if it carries two oxygens; a C&equiv;N carbon is treated as carrying three nitrogens.

The phrase to keep in your head is **first point of difference**. The group with the single heaviest atom at the earliest difference wins, no matter how big the other group is overall.

### Tie-breaker practice

| Group A | Its set | Group B | Its set | Winner and why |
|---|---|---|---|---|
| -CH<sub>2</sub>OH | (O, H, H) | -CH(CH<sub>3</sub>)<sub>2</sub> | (C, C, H) | -CH<sub>2</sub>OH. O beats C in the first position, even though isopropyl is bigger. |
| -CH<sub>2</sub>CH<sub>2</sub>Cl | (C, H, H) | -CH(CH<sub>3</sub>)<sub>2</sub> | (C, C, H) | Isopropyl. The difference appears in the second position (C beats H), so the chlorine one bond further out never gets considered. |
| -COOH | (O, O, O) | -C&equiv;N | (N, N, N) | -COOH. O beats N. |
| -CH<sub>2</sub>SH | (S, H, H) | -COOH | (O, O, O) | -CH<sub>2</sub>SH. S beats O in the first position, so the three oxygens do not help. |
| propyl, -CH<sub>2</sub>CH<sub>2</sub>CH<sub>3</sub> | (C, H, H) | ethyl, -CH<sub>2</sub>CH<sub>3</sub> | (C, H, H) | Tie, so go one bond out: propyl's next carbon has (C, H, H) and ethyl's has (H, H, H). Propyl wins. |

The second row is the trap. Students see chlorine and rank that group first, but the comparison stops as soon as the sets differ, and that happens before the chlorine.

## Step 3: orient and read the direction

With priorities set, look at the molecule so that group 4 points directly away from you. Then follow 1 &rarr; 2 &rarr; 3, ignoring group 4.

- Clockwise: **R**.
- Counterclockwise: **S**.

In a wedge and dash drawing, group 4 is often already on the dashed bond, so you read the direction exactly as drawn. When group 4 is on a wedge, it points at you; read the direction as drawn and flip the answer. When group 4 sits on a plain in-plane bond, either rotate the molecule in your head or use the swap trick below.

**The swap trick.** Exchanging any two groups on a stereocenter inverts its configuration. So you can swap group 4 with whatever group occupies the dashed position, read the new drawing, and then reverse the result to undo the swap. One swap, one reversal. Two swaps cancel out.

![Two wedge-dash stereocenters with priorities numbered and the 1 to 2 to 3 direction drawn: (R)-2-butanol with H on a dash, and L-alanine with H on a wedge, read as clockwise then reversed to S](assets/notes/r-and-s-configuration-cip-priority-rules.png "Left: H points away, so the clockwise reading stands and the center is R. Right: H points toward the viewer, so the apparent clockwise reading flips to S.")

## Worked example 1: 2-butanol with H on a dash

Draw carbon 2 of 2-butanol with the methyl group on a plain bond to the lower left, the ethyl group on a plain bond to the lower right, the OH on a wedge toward the upper left, and the H on a dash toward the upper right.

1. Priorities: OH (O, first atom) = 1. Ethyl and methyl both start with C; ethyl's set is (C, H, H) and methyl's is (H, H, H), so ethyl = 2 and methyl = 3. H = 4.
2. H is on the dash, pointing away. Read as drawn.
3. From OH at the upper left, to ethyl at the lower right, to methyl at the lower left, the path turns clockwise.
4. The center is **R**. This drawing is (R)-2-butanol.

## Worked example 2: L-alanine with H on a wedge

Draw alanine's alpha carbon with CH<sub>3</sub> on a plain bond to the lower left, COOH on a plain bond to the lower right, NH<sub>2</sub> on a dash toward the upper right, and H on a wedge toward the upper left.

1. Priorities: NH<sub>2</sub> = 1 (N beats C). COOH (O, O, O) beats CH<sub>3</sub> (H, H, H), so COOH = 2 and CH<sub>3</sub> = 3. H = 4.
2. NH<sub>2</sub> at the upper right, to COOH at the lower right, to CH<sub>3</sub> at the lower left: that path looks clockwise.
3. H is on the wedge, pointing toward you, so reverse: the center is **S**.

This is L-alanine. The same pattern holds for nearly all the chiral standard amino acids: the L form is S. The exception is L-cysteine, which is R. Its side chain, -CH<sub>2</sub>SH, has sulfur in the first set, so it outranks COOH (fourth row of the table above) and the priority order changes even though the 3D arrangement is the same L arrangement. For more on amino acid structure and charge, see the [amino acid pKa note](amino-acid-pka-charge-ph-7-4.html).

## Worked example 3: a Fischer projection

In a Fischer projection the stereocenter is where the lines cross. Horizontal bonds point toward you, and vertical bonds point away.

Take glyceraldehyde drawn with CHO at the top, CH<sub>2</sub>OH at the bottom, OH on the right and H on the left (this is D-glyceraldehyde).

1. Priorities: OH = 1. CHO counts as (O, O, H) because of the duplicated C=O oxygen, and CH<sub>2</sub>OH is (O, H, H), so CHO = 2 and CH<sub>2</sub>OH = 3. H = 4.
2. From OH on the right, up to CHO at the top, then down the left side to CH<sub>2</sub>OH at the bottom: counterclockwise.
3. H is on a horizontal bond, so it points toward you. Reverse: the center is **R**.

D-glyceraldehyde is (R)-glyceraldehyde. Two Fischer rules worth knowing: rotating the whole projection 180&deg; in the plane of the page keeps the configuration, but rotating it 90&deg; inverts it. If you want group 4 on a vertical bond, swap it there and remember to reverse once.

## R and S are not D and L, and not + and -

Three labels get mixed up constantly:

| Label | What it describes | How you get it |
|---|---|---|
| R / S | Absolute configuration at one stereocenter | CIP priorities and the 3D arrangement |
| D / L | Configuration compared with glyceraldehyde, used for sugars and amino acids | Position of one key group in a Fischer projection |
| (+) / (-), or d / l | Direction a sample rotates plane-polarized light | Measured in a polarimeter |

None of these predicts another in general. An R compound can rotate light either way, and that has to be measured. The L-alanine and L-cysteine pair above shows that the same L arrangement can carry different R or S labels when priorities change.

## Molecules with more than one stereocenter

Assign each stereocenter separately and list them with locants, for example (2R,3S). The enantiomer of a compound inverts every center, so the enantiomer of (2R,3S) is (2S,3R). Changing only some of the centers gives a diastereomer. Racemases and epimerases, covered in the [enzyme classes note](enzyme-classes-ec-1-to-7.html), invert a single stereocenter: a racemase acting on a molecule with one center produces its enantiomer, while an epimerase that inverts one of several centers produces a diastereomer.

## Common traps

- **Ranking by group size or total mass.** Only the first point of difference matters.
- **Forgetting the duplicate atoms for double bonds.** A C=O carbon carries (O, O, X) in the comparison.
- **Not reversing when H is on a wedge** or on a horizontal Fischer bond.
- **Reversing twice.** If you swapped groups and the lowest priority was also toward you, count each change: each swap and each "toward you" reading flips the answer once.
- **Labeling a carbon with two identical groups.** It is not a stereocenter.
- **Assuming R means (+).** Configuration labels and optical rotation are independent.
- **Assuming every L amino acid is S.** Cysteine is the classic exception.

## One-minute recap

Check the carbon has four different groups. Rank by atomic number of the attached atoms; on a tie, compare the sets of attached atoms in order and stop at the first difference; double bonds duplicate atoms. Point group 4 away and trace 1 &rarr; 2 &rarr; 3: clockwise R, counterclockwise S. If group 4 points at you (wedge, or horizontal in a Fischer projection), reverse. Swapping two groups inverts the label. L amino acids are S except cysteine, which is R, and D-glyceraldehyde is R. R and S do not predict which way a sample rotates polarized light.

:::quiz
Q: Rank these groups by CIP priority: -CH2OH, -CH3, -OH, -H.
A: -OH (O) is first, -CH2OH (O, H, H) second, -CH3 (H, H, H) third, and -H last.
Q: Which has higher priority, -CH2Br or -C(CH3)3?
A: -CH2Br. Its set (Br, H, H) beats (C, C, C) at the first position, because bromine outranks carbon.
Q: With the lowest priority group on a wedge, the path 1 → 2 → 3 looks counterclockwise. What is the configuration?
A: R. The counterclockwise reading would mean S, but the lowest priority group points toward you, so the answer reverses.
Q: In a Fischer projection, H is on the right, and 1 → 2 → 3 traces clockwise. What is the configuration?
A: S. Horizontal bonds point toward the viewer, so the apparent R must be flipped.
Q: Why is L-cysteine R when most L amino acids are S?
A: Its -CH2SH side chain has sulfur in the first set, so it outranks -COOH. The priority order changes, not the spatial arrangement.
:::

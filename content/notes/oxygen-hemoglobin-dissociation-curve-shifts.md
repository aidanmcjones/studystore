---
title: Oxygen-Hemoglobin Dissociation Curve: Right vs Left Shifts
description: Read the oxygen-hemoglobin dissociation curve: why it is sigmoidal, what P50 means, what shifts it right or left, and how shifts change unloading.
seo_title: Oxygen-Hemoglobin Dissociation Curve Shifts | MCAT
seo_description: Free MCAT notes on the oxygen-hemoglobin dissociation curve: why it is sigmoidal, P50, what shifts it left or right, and a 5-question quiz.
product: 3b-organ-systems
published: 2026-10-20
related: protein-structure-levels-and-denaturation, henderson-hasselbalch-for-the-mcat, nephron-function-segments-reabsorption
---

The oxygen-hemoglobin dissociation curve plots percent hemoglobin saturation against the partial pressure of oxygen (PO<sub>2</sub>). It is **S-shaped (sigmoidal)** because the four subunits of hemoglobin bind oxygen cooperatively. A **right shift** means lower affinity and easier unloading, caused by more CO<sub>2</sub>, more H<sup>+</sup> (lower pH), higher temperature, or more 2,3-BPG. A **left shift** means higher affinity and tighter holding, as seen with fetal hemoglobin, carbon monoxide, and the opposite of each right-shift factor.

## Reading the axes and P50

The x-axis is PO<sub>2</sub> in mmHg. The y-axis is the fraction of heme sites carrying O<sub>2</sub>. Two landmarks are worth memorizing as approximate values:

- **Arterial blood:** PO<sub>2</sub> around 100 mmHg, saturation around 97 to 98 percent.
- **Mixed venous blood at rest:** PO<sub>2</sub> around 40 mmHg, saturation around 75 percent.

The single number that describes where a curve sits is **P50**, the PO<sub>2</sub> at which hemoglobin is 50 percent saturated. For normal adult hemoglobin it is approximately 26 to 27 mmHg (this note uses 26.8). P50 works as an inverse measure of affinity:

| Change | P50 | Affinity for O<sub>2</sub> | Curve moves |
|---|---|---|---|
| Right shift | Higher | Lower | Right |
| Left shift | Lower | Higher | Left |

If you remember only one rule, make it this one: **a higher P50 means it takes more oxygen pressure to fill half the sites, so hemoglobin is holding O<sub>2</sub> less tightly.**

## Why the curve is sigmoidal

Hemoglobin is a tetramer (two alpha and two beta chains in adults), and each subunit carries one heme that can bind one O<sub>2</sub>. The protein flips between two overall conformations:

- **T (tense) state:** low affinity. Favored when few oxygens are bound. Held together by extra salt bridges between subunits.
- **R (relaxed) state:** high affinity. Favored as more oxygens are bound.

Binding the first O<sub>2</sub> is relatively hard. Each oxygen that does bind makes the switch toward R more likely, which raises the affinity of the remaining empty sites. That positive cooperativity makes the curve steep in the middle and flat at both ends.

Myoglobin, the single-chain storage protein in muscle, has one heme and nothing to cooperate with. Its curve is a **hyperbola**, and its P50 is very low (roughly 1 to 3 mmHg). That shape suits its job: it holds oxygen inside muscle cells until PO<sub>2</sub> gets very low, then releases it.

A handy quantitative model is the Hill equation, S = PO<sub>2</sub><sup>n</sup> / (P50<sup>n</sup> + PO<sub>2</sub><sup>n</sup>), where n is the Hill coefficient. For hemoglobin n is about 2.7; for myoglobin n = 1. The Hill equation is an approximation that fits the middle of the curve well and the extremes less well, but it is good enough to see why shifts matter. The curves in the figure below are drawn from it.

![Hill-equation curves for myoglobin, fetal hemoglobin, normal adult hemoglobin and a right-shifted adult curve, with P50 marked on each hemoglobin curve](assets/notes/oxygen-hemoglobin-dissociation-curve-shifts.png "Myoglobin is hyperbolic with a tiny P50. Fetal hemoglobin sits left of adult hemoglobin. A right shift barely changes saturation at 100 mmHg but lowers it sharply at tissue PO2.")

## What shifts the curve to the right

Each right-shift factor is something an actively working tissue produces. A quick way to keep the list straight: **a busy muscle is warm, acidic, full of CO<sub>2</sub>, and (over time) rich in 2,3-BPG, and every one of those tells hemoglobin to let go.**

1. **Increased PCO<sub>2</sub>.** CO<sub>2</sub> lowers affinity in two ways. It forms carbonic acid, which raises H<sup>+</sup>. It also binds directly to the N-terminal amino groups of the globin chains as carbamino groups, which stabilizes the T state.
2. **Increased H<sup>+</sup> (lower pH).** Protons bind to specific histidine side chains and help form the salt bridges that hold the T state together. The effect of H<sup>+</sup> and CO<sub>2</sub> on O<sub>2</sub> affinity is usually grouped together as the **Bohr effect**.
3. **Increased temperature.** O<sub>2</sub> binding releases heat, so warming the blood pushes the equilibrium toward release, consistent with Le Chatelier.
4. **Increased 2,3-bisphosphoglycerate (2,3-BPG).** This red cell metabolite binds in the central cavity of deoxyhemoglobin, between the two beta chains, and stabilizes the T state. It rises over hours to days in chronic hypoxia, for example at high altitude.

Exercise is the classic real-world example because it raises the first three at once in the working muscle.

## What shifts the curve to the left

- **The reverse of each factor:** lower PCO<sub>2</sub>, higher pH (alkalosis), lower temperature, less 2,3-BPG.
- **Fetal hemoglobin (HbF).** HbF uses gamma chains in place of beta chains. Gamma chains bind 2,3-BPG more weakly, so HbF has a higher affinity (P50 approximately 19 to 20 mmHg). That lets fetal blood pull oxygen from maternal blood across the placenta.
- **Carbon monoxide.** CO binds heme with an affinity roughly 200 or more times that of O<sub>2</sub>. It does two kinds of damage at once. It occupies heme sites, so less oxygen can be carried. It also pushes the remaining hemoglobin toward the R state, so the oxygen that is still bound is held more tightly and is harder to unload. The curve shifts left and loses its sigmoidal shape.
- **Methemoglobin.** When heme iron is oxidized from Fe<sup>2+</sup> to Fe<sup>3+</sup>, that site cannot bind O<sub>2</sub>, and the remaining normal hemes in the tetramer hold oxygen more tightly.

## Worked example: why a right shift helps working muscle

Use the Hill equation with n = 2.7 and a hemoglobin concentration of 15 g/dL. Oxygen content is approximately 1.34 mL O<sub>2</sub> per gram of hemoglobin times saturation, plus 0.003 mL/dL per mmHg of dissolved O<sub>2</sub> (the 1.34 factor varies slightly by source).

**Step 1: arterial blood.** At PO<sub>2</sub> = 100 mmHg and P50 = 26.8 mmHg:
(100/26.8)<sup>2.7</sup> is about 35.0, so S = 35.0 / 36.0 = 0.972, or 97.2 percent.
Content = 1.34 &times; 15 &times; 0.972 + 0.003 &times; 100 = 19.5 + 0.3 = about 19.8 mL O<sub>2</sub> per dL.

**Step 2: resting tissue.** At PO<sub>2</sub> = 40 mmHg on the same curve, S is about 0.747. Hemoglobin gives up 97.2 minus 74.7, or about 22 percentage points. Most of the oxygen stays bound as a reserve.

**Step 3: exercising muscle, no shift.** Suppose muscle PO<sub>2</sub> falls to 20 mmHg. On the normal curve, S is about 0.312. Unloading = 97.2 minus 31.2 = 66 points, which is 1.34 &times; 15 &times; 0.660 = about 13.3 mL of hemoglobin-bound O<sub>2</sub> per dL of blood.

**Step 4: exercising muscle with a right shift.** Now suppose the local heat, acid and CO<sub>2</sub> raise P50 to an illustrative 36 mmHg. At PO<sub>2</sub> = 20, S drops to about 0.170. Unloading = 97.2 minus 17.0 = about 80 points, or roughly 16.1 mL of hemoglobin-bound O<sub>2</sub> per dL.

**Step 5: what about loading in the lungs?** Even if the shifted curve applied at the lungs, saturation at 100 mmHg would still be about 94 percent. Loading barely suffers because 100 mmHg sits on the flat plateau, while unloading gains a lot because 20 mmHg sits on the steep part. In reality the lungs blow off CO<sub>2</sub>, so blood there returns toward the unshifted curve anyway.

The takeaway: **the steep middle of the curve sits right at tissue PO<sub>2</sub> values, so small changes in P50 produce large changes in delivery, while the plateau protects loading.**

## Saturation is not content

Saturation and P50 describe the protein. Oxygen content also depends on how much hemoglobin there is.

| Situation | SaO<sub>2</sub> | P50 | O<sub>2</sub> content |
|---|---|---|---|
| Anemia (low hemoglobin) | Normal | Normal or slightly higher (2,3-BPG rises in chronic anemia) | Low |
| Carbon monoxide poisoning | Functional saturation low (standard pulse oximeters can read falsely normal) | Lower (left shift) | Low |
| High altitude, acclimatized | Lower than at sea level | Higher from 2,3-BPG, partly offset by respiratory alkalosis | Low to normal, helped by more red cells |

In anemia, each hemoglobin molecule still loads normally in the lungs, so arterial PO<sub>2</sub> and saturation look fine. The problem is that there are fewer molecules to load.

## Common traps

- **Right shift does not mean "more oxygen."** It means lower affinity and more release at a given PO<sub>2</sub>. At the tissues that helps; at the lungs it would slightly hurt.
- **Watch the P50 direction.** Higher P50 is lower affinity. Students often flip this because "higher" sounds like "stronger."
- **Acidosis shifts right, alkalosis shifts left.** Hyperventilation lowers PCO<sub>2</sub> and raises pH, which shifts left.
- **Fetal hemoglobin is left, not right.** It must take oxygen from maternal blood, so it needs the higher affinity.
- **Myoglobin is hyperbolic, not sigmoidal.** One heme, no cooperativity.
- **Carbon monoxide shifts left and lowers capacity.** It is worse than simply losing the same amount of hemoglobin, because the remaining sites also unload poorly.
- **Anemia lowers content, not saturation.** The main problem is less hemoglobin, not a curve shift (any rise in 2,3-BPG gives only a modest right shift).

## One-minute recap

The curve plots hemoglobin saturation against PO<sub>2</sub> and is sigmoidal because the four subunits bind O<sub>2</sub> cooperatively, flipping from the low-affinity T state to the high-affinity R state. P50 (about 26 to 27 mmHg in adults) is the PO<sub>2</sub> at half saturation, and a higher P50 means lower affinity. More CO<sub>2</sub>, more H<sup>+</sup>, higher temperature and more 2,3-BPG shift the curve right and boost unloading in working tissue. Fetal hemoglobin, carbon monoxide, alkalosis, cold and low 2,3-BPG shift it left. Myoglobin has a hyperbolic curve with a very low P50. Anemia lowers oxygen content mainly by reducing hemoglobin, not by shifting the curve.

:::quiz
Q: A patient's P50 rises from 27 mmHg to 33 mmHg. Has hemoglobin's affinity for oxygen gone up or down, and which way did the curve shift?
A: Affinity went down and the curve shifted right. A higher P50 means more oxygen pressure is needed to reach half saturation, so hemoglobin holds O2 less tightly.
Q: Why does increasing PCO2 shift the curve to the right?
A: CO2 raises H+ by forming carbonic acid and also binds globin N-termini as carbamino groups, and both stabilize the low-affinity T state (both grouped under the Bohr effect).
Q: Why is the myoglobin curve hyperbolic while the hemoglobin curve is sigmoidal?
A: Myoglobin has a single heme and cannot bind cooperatively. Hemoglobin's four subunits switch from the T to the R state as oxygen binds, which makes later binding easier and the curve S-shaped.
Q: How does carbon monoxide reduce oxygen delivery beyond simply occupying heme sites?
A: CO also shifts the curve of the remaining hemoglobin to the left, so the oxygen still bound is held more tightly and is released poorly in tissues.
Q: A patient has a hemoglobin of 8 g/dL with normal lungs. What happens to arterial saturation and to arterial oxygen content?
A: Saturation stays essentially normal because each hemoglobin molecule still loads fully, but oxygen content falls because there is less hemoglobin to carry oxygen.
:::

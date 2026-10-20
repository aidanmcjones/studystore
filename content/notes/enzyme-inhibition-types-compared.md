---
title: Enzyme Inhibition Types Compared: Competitive, Noncompetitive, Uncompetitive, Mixed
description: A side-by-side guide to the four reversible inhibition types, how each changes Km and Vmax, and how to recognize them on a Lineweaver-Burk plot.
product: 1a-amino-acids-proteins
published: 2026-10-20
related: michaelis-menten-and-lineweaver-burk, protein-structure-levels-and-denaturation, enzyme-classes-ec-1-to-7
---

Inhibition questions are some of the most predictable on the MCAT, and also some of the most commonly missed, because students memorize a table without understanding where the table came from. This note derives the table from one question: **which enzyme form does the inhibitor bind?** Once you can answer that, the effects on K<sub>m</sub> and V<sub>max</sub> follow.

## Setup: the three enzyme forms

During catalysis an enzyme exists in two main forms: free enzyme (E) and the enzyme-substrate complex (ES). A reversible inhibitor (I) can latch on to E, to ES, or to both. Its dissociation from each is described by an inhibition constant: K<sub>i</sub> for binding free enzyme and K<sub>i</sub>' for binding ES. A small K<sub>i</sub> means tight binding.

Because inhibitor binding is reversible, the inhibited enzyme can return to normal when the inhibitor lets go, which separates this topic from irreversible inhibitors that form covalent bonds (covered at the end).

For each type below, the effect shows up as an *apparent* change in K<sub>m</sub> and V<sub>max</sub>, meaning the values you measure in the presence of inhibitor. The true properties of the enzyme have not changed.

## Competitive inhibition

**Binds:** free enzyme only, at the active site, competing directly with substrate.

A competitive inhibitor often resembles the substrate, though it does not have to. Because inhibitor and substrate fight for the same site, you can overwhelm the inhibitor by adding more substrate. At very high [S], almost every enzyme ends up with substrate bound, so the top speed is the same as before.

- **V<sub>max</sub>:** unchanged.
- **K<sub>m</sub> (apparent):** increases. It takes more substrate to reach half of V<sub>max</sub>. The enzyme looks as if it has lower affinity for substrate.
- **Lineweaver-Burk:** the lines for different inhibitor concentrations cross at the same y-intercept. The inhibited line is steeper and its x-intercept moves toward zero.

Quantitatively, K<sub>m,app</sub> = K<sub>m</sub>(1 + [I]/K<sub>i</sub>). Doubling [I] at a [I]/K<sub>i</sub> of 1 raises the factor from 2 to 3.

## Uncompetitive inhibition

**Binds:** the ES complex only, at a site that exists or is revealed once substrate has bound.

Here the logic runs backward from competitive inhibition. Adding substrate makes more ES, which gives the inhibitor more to bind, so substrate does not rescue the enzyme. Trapping ES in a dead-end complex removes it from the cycle, and by Le Chatelier's principle that pulls more E toward ES. The apparent affinity for substrate goes up.

- **V<sub>max</sub> (apparent):** decreases, because inhibited ES cannot make product.
- **K<sub>m</sub> (apparent):** decreases, by the same factor as V<sub>max</sub>.
- **Lineweaver-Burk:** parallel lines. The slope K<sub>m</sub>/V<sub>max</sub> stays the same because both parameters shrink by the same factor, 1 + [I]/K<sub>i</sub>'.

Lower K<sub>m</sub> here does not mean the inhibitor improved the enzyme. It is a side effect of removing ES from the pool. Uncompetitive inhibitors are rare in nature, and the MCAT mostly asks you to recognize the parallel lines.

## Noncompetitive inhibition (pure)

**Binds:** free enzyme and ES with equal affinity (K<sub>i</sub> = K<sub>i</sub>'), at a site separate from the active site.

The inhibitor does not interfere with substrate binding, so the enzyme grabs substrate just as well with or without inhibitor. But an enzyme with inhibitor attached cannot catalyze. Effectively, some fraction of the enzyme molecules has been taken out of service, which is the same as having less enzyme.

- **V<sub>max</sub> (apparent):** decreases. It is as if you had a smaller concentration of enzyme.
- **K<sub>m</sub>:** unchanged. The enzyme that is still active binds substrate normally.
- **Lineweaver-Burk:** lines intersect on the x-axis at -1/K<sub>m</sub>, with the inhibited line having a higher y-intercept and a steeper slope.

Adding substrate cannot reverse this inhibition because substrate and inhibitor do not compete for a site.

## Mixed inhibition

**Binds:** both E and ES, but with different affinities (K<sub>i</sub> is not equal to K<sub>i</sub>').

Mixed inhibition is the general case, and the other three are special cases of it. Two numbers describe it: α = 1 + [I]/K<sub>i</sub> and α' = 1 + [I]/K<sub>i</sub>'. The apparent values are V<sub>max,app</sub> = V<sub>max</sub>/α' and K<sub>m,app</sub> = K<sub>m</sub> × α/α'.

- **V<sub>max</sub> (apparent):** decreases.
- **K<sub>m</sub> (apparent):** can go either way. If the inhibitor prefers free enzyme (K<sub>i</sub> smaller than K<sub>i</sub>'), α exceeds α' and K<sub>m</sub> rises. If it prefers ES, K<sub>m</sub> falls.
- **Lineweaver-Burk:** lines intersect somewhere off both axes, to the left of the y-axis. They cross above the x-axis if the inhibitor prefers E and below it if the inhibitor prefers ES.

Many MCAT sources call this "noncompetitive" loosely and say K<sub>m</sub> may change. If a passage says an inhibitor binds an allosteric site and changes K<sub>m</sub> as well as V<sub>max</sub>, think mixed.

![Four Lineweaver-Burk panels: competitive, uncompetitive, noncompetitive, mixed](assets/notes/enzyme-inhibition-types-compared.png "Lineweaver-Burk plots for each type. Grey is the uninhibited enzyme and the colored line has inhibitor. Watch where the lines meet: y-axis, x-axis, nowhere (parallel), or off-axis.")

## The comparison table

| Type | Binds | V<sub>max</sub> | K<sub>m</sub> | Overcome by more S? | L-B pattern |
|---|---|---|---|---|---|
| Competitive | E | same | up | yes | cross on y-axis |
| Uncompetitive | ES | down | down | no | parallel |
| Noncompetitive | E and ES equally | down | same | no | cross on x-axis |
| Mixed | E and ES unequally | down | up or down | no | cross off-axis |

## A fast way to keep them straight

1. **Where does it bind?** Free enzyme only means competitive. ES only means uncompetitive. Both equally means noncompetitive.
2. **Can substrate beat it?** Only competitive inhibition is overcome by flooding the system with substrate.
3. **What happens to V<sub>max</sub>?** If it is unchanged, the inhibitor is competitive. Otherwise V<sub>max</sub> falls.
4. **Where do the L-B lines meet?** On the y-axis means competitive, on the x-axis means noncompetitive, parallel means uncompetitive.

## Irreversible inhibition

Some inhibitors bond covalently to the enzyme and do not come off. Examples include aspirin acetylating a serine residue of cyclooxygenase, and penicillin forming a covalent bond with the transpeptidase that builds bacterial cell walls. Because the damaged enzyme molecules are permanently out of action, the effect looks like having less enzyme: V<sub>max</sub> falls and K<sub>m</sub> of the remaining enzyme is unchanged, similar to noncompetitive inhibition. The difference is that the effect does not reverse when you dilute or remove the free inhibitor. Only making new enzyme restores the activity.

## Real-world examples that fit the categories

- **Competitive:** methotrexate competing with dihydrofolate for dihydrofolate reductase; ethanol is used to treat methanol poisoning because it competes for alcohol dehydrogenase.
- **Allosteric inhibitors:** these bind outside the active site and often look noncompetitive or mixed in a simple analysis. Feedback inhibition of phosphofructokinase-1 by ATP is a regulatory example. Cooperative allosteric enzymes give sigmoidal curves, so the hyperbolic rules above are only an approximation for them.
- **Uncompetitive:** lithium inhibiting inositol monophosphatase is the classic textbook example.

## Common traps

- **"Noncompetitive means the inhibitor binds somewhere else, so K<sub>m</sub> must change."** In the pure case, it does not.
- **"Lower K<sub>m</sub> means a better enzyme."** In uncompetitive inhibition the lower K<sub>m</sub> comes with a lower V<sub>max</sub>, so the enzyme is worse overall.
- **Confusing the inhibitor's K<sub>i</sub> with the enzyme's K<sub>m</sub>.** K<sub>i</sub> describes the inhibitor, and K<sub>m</sub> describes substrate.
- **Forgetting that more substrate does nothing against anything except competitive inhibition.**

:::quiz
Q: A drug binds the active site of an enzyme and structurally resembles its substrate. Predict its effect on Km and Vmax.
A: It is competitive. Apparent Km increases and Vmax is unchanged, because enough substrate can outcompete the drug.
Q: Lineweaver-Burk lines for an enzyme with and without an inhibitor are parallel. Which type of inhibition is this, and what happened to Km and Vmax?
A: Uncompetitive inhibition. Both apparent Km and Vmax decreased by the same factor, so the slope Km/Vmax is unchanged and the lines are parallel.
Q: Increasing substrate concentration fails to restore full activity, and the measured Km is unchanged. What type of inhibitor is most consistent?
A: A pure noncompetitive inhibitor. Vmax drops (not rescued by substrate) while Km stays the same, since it binds E and ES equally at a site separate from the active site.
Q: In mixed inhibition, an inhibitor binds free enzyme much more tightly than ES. Does the apparent Km go up or down?
A: Up. With Ki smaller than Ki', alpha exceeds alpha', and Km,app = Km x alpha/alpha' is larger than Km. Vmax still decreases.
Q: Why does penicillin's effect not reverse when excess free penicillin is washed away?
A: Penicillin forms a covalent bond with its target enzyme, so it is an irreversible inhibitor. The affected enzyme molecules remain inactivated, and only newly synthesized enzyme restores activity.
:::

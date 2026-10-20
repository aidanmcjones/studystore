---
title: MCAT Enzyme Inhibition and Allosteric Regulation Practice Questions
description: Eight free MCAT-style practice questions on competitive, noncompetitive and uncompetitive inhibition, irreversible inhibitors, allostery, feedback and covalent regulation, with explanations.
aamc: 1A
category: 1a-amino-acids-proteins
cluster: Reversible and irreversible inhibition, allosteric regulation and cooperativity, covalent modification, feedback inhibition
product: 1a-amino-acids-proteins
published: 2026-10-20
notes: enzyme-inhibition-types-compared, michaelis-menten-and-lineweaver-burk
---

Predict inhibition by asking which enzyme form the inhibitor binds. A competitive inhibitor binds free enzyme at the active site: Vmax is unchanged, apparent Km rises, and the effect can be overcome with more substrate. A noncompetitive inhibitor binds E and ES equally at a separate site: Vmax falls, Km is unchanged. An uncompetitive inhibitor binds only ES: both Vmax and apparent Km fall by the same factor, giving parallel Lineweaver-Burk lines. Mixed inhibition binds both forms unequally.

Allosteric enzymes have multiple subunits and often show a sigmoidal curve rather than a hyperbola. A Hill coefficient above 1 signals positive cooperativity. Regulation also comes from covalent modification (phosphorylation, proteolytic activation of zymogens) and from feedback inhibition, where the end product of a pathway shuts off an early committed step.

Traps: allosteric does not mean noncompetitive, and irreversible inhibitors are not overcome by adding substrate or by dialysis.

@@QUESTIONS

### Q1
The following apparent kinetic constants were measured for an enzyme with and without three different inhibitors.

| Condition | Vmax (micromol/min) | Km (mM) |
|---|---|---|
| No inhibitor | 100 | 2.0 |
| Inhibitor X | 100 | 6.0 |
| Inhibitor Y | 40 | 2.0 |
| Inhibitor Z | 40 | 0.8 |

Which inhibitor is most likely competitive?
A) Inhibitor Y
B) Inhibitor Z
C) Inhibitor X
D) None of them
ANSWER: C
WHY: A competitive inhibitor increases apparent Km without changing Vmax, which is exactly what X does (Km tripled, Vmax unchanged). Y lowers Vmax with no change in Km, the signature of noncompetitive inhibition. Z lowers both Vmax and Km by the same factor (2.5), which indicates uncompetitive inhibition.

### Q2
Using the data in Q1, which statement correctly describes the Lineweaver-Burk plot for inhibitor Z compared with the uninhibited enzyme?
A) The lines are parallel
B) The lines intersect on the y-axis
C) The lines intersect on the x-axis
D) The inhibited line has the same slope and the same x-intercept
ANSWER: A
WHY: For uncompetitive inhibition both Km and Vmax fall by the same factor, so the slope Km/Vmax is unchanged: 2.0/100 = 0.020 and 0.8/40 = 0.020. Equal slopes with different intercepts give parallel lines. Intersection on the y-axis is the competitive pattern and intersection on the x-axis is the noncompetitive pattern.

### Q3
An enzyme has Km = 2 mM. A competitive inhibitor is present at 10 micromolar with Ki = 5 micromolar. What substrate concentration gives half of the (unchanged) Vmax in the presence of the inhibitor?
A) 6 mM
B) 4 mM
C) 12 mM
D) 2 mM
ANSWER: A
WHY: Apparent Km for a competitive inhibitor is Km(1 + [I]/Ki) = 2 mM x (1 + 10/5) = 2 x 3 = 6 mM. The substrate concentration giving half-maximal velocity is the apparent Km, so 6 mM. Choice B only uses a factor of 2 and forgets the 1 in the 1 + [I]/Ki term.

### Q4
Adding a 100-fold excess of substrate restores nearly full activity to an inhibited enzyme. The inhibitor is most likely
A) noncompetitive
B) uncompetitive
C) competitive
D) a suicide substrate
ANSWER: C
WHY: A competitive inhibitor occupies the active site reversibly, so a large excess of substrate wins the competition and the inhibition is overcome. A noncompetitive or uncompetitive inhibitor binds elsewhere or to ES, so extra substrate does not displace it, and for uncompetitive inhibition extra substrate actually makes more of the form the inhibitor binds. A suicide substrate acts irreversibly.

### Q5
A drug-treated enzyme remains inhibited after extensive dialysis, and adding more substrate does not help. Subsequent mass spectrometry shows an acetyl group on an active site serine. Which is the best interpretation?
A) The drug is an uncompetitive inhibitor that binds only ES
B) The drug is an irreversible inhibitor that covalently modifies the enzyme, effectively lowering the amount of active enzyme and Vmax
C) The drug is a reversible competitive inhibitor
D) The drug is an allosteric activator
ANSWER: B
WHY: Dialysis removes small molecules that are bound reversibly, so persistence of inhibition after dialysis points to a covalent bond. Covalent modification of the catalytic residue removes enzyme molecules from the active pool, which lowers Vmax (as if less enzyme were present) while Km of the remaining enzyme is unchanged. Activity returns only when the cell synthesizes new enzyme.

### Q6
A multisubunit enzyme shows a sigmoidal plot of velocity against [S] and a Hill coefficient of 2.8. An allosteric activator is then added. Which outcome is expected?
A) The curve shifts to the left, so the enzyme reaches half-maximal velocity at a lower substrate concentration
B) The Hill coefficient becomes negative
C) The curve becomes more hyperbolic, with a higher apparent Km
D) The curve shifts to the right, increasing K0.5
ANSWER: A
WHY: A Hill coefficient greater than 1 indicates positive cooperativity: binding of substrate to one subunit makes it easier for others to bind. An allosteric activator stabilizes the high-affinity (relaxed) state, so less substrate is needed for half-maximal activity and the sigmoidal curve moves left. An allosteric inhibitor does the reverse. The Hill coefficient is not negative for normal cooperative enzymes; values below 1 would indicate negative cooperativity.

### Q7
In a linear pathway A to B to C to D to E, the first committed step is catalyzed by enzyme 1 (A to B). Accumulation of E most commonly slows the pathway by
A) inhibiting enzyme 1, the first committed step, often allosterically
B) inhibiting only the final enzyme, so that intermediates build up
C) acting as a competitive inhibitor of the enzyme that makes E from D
D) increasing the transcription of enzyme 1
ANSWER: A
WHY: In feedback inhibition the end product binds an allosteric site on an early enzyme, typically the first committed step, so the cell does not waste substrate and energy building up intermediates that are not needed. Blocking only the last enzyme would cause intermediates to accumulate, which is inefficient. Choice C is possible in principle but is not the usual regulatory design.

### Q8
Each of the following is a covalent mechanism for regulating an enzyme EXCEPT
A) phosphorylation of a serine residue by a kinase
B) binding of an allosteric effector at a regulatory site
C) attachment of a phosphate group that is later removed by a phosphatase
D) proteolytic cleavage of a zymogen
ANSWER: B
WHY: Allosteric effectors bind through noncovalent interactions and can dissociate without any bond being broken. Phosphorylation (A and C) is a reversible covalent modification, and cleaving a zymogen (D) is an irreversible covalent change that converts an inactive precursor into the active enzyme.

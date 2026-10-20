---
title: Nephron Function: What Each Segment Reabsorbs and Secretes
description: Follow filtrate through the nephron segment by segment, see how the loop of Henle and ADH set urine concentration, and work GFR and clearance math.
product: 3b-organ-systems
published: 2026-10-20
related: passive-vs-active-transport, henderson-hasselbalch-for-the-mcat
---

The nephron makes urine in three moves: it filters plasma at the glomerulus, reabsorbs most of that filtrate back into the blood along the tubule, and secretes a few extra substances into the tubule. Each segment has one signature job. The proximal tubule reclaims the bulk of everything useful, the loop of Henle builds a salt gradient in the medulla, the distal tubule fine-tunes salt and calcium, and the collecting duct decides, under hormonal control, how concentrated the final urine will be. If you know what each segment does to water and to salt, you can predict the effect of almost any hormone or diuretic.

## Filtration at the glomerulus

Blood enters the glomerulus through the afferent arteriole and leaves through the efferent arteriole. Fluid is pushed out of the capillaries into Bowman's space across a three-layer barrier: fenestrated endothelium, a negatively charged basement membrane, and the slits between podocyte foot processes. Water, ions, glucose, amino acids and urea pass freely. Blood cells and large proteins such as albumin are held back.

The driving force is a Starling balance. Using typical textbook values:

- Glomerular capillary hydrostatic pressure pushes fluid out: about 50 mmHg.
- Hydrostatic pressure in Bowman's space pushes back: about 10 mmHg.
- Plasma oncotic pressure from retained proteins pulls fluid back in: about 30 mmHg.
- Net filtration pressure: 50 - 10 - 30 = about **10 mmHg**.

That modest pressure, spread over a very large and leaky capillary surface in both kidneys, gives a **glomerular filtration rate (GFR)** of about 125 mL/min.

The arterioles act as valves. Constricting the afferent arteriole lowers pressure in the glomerulus and lowers GFR. Constricting the efferent arteriole backs blood up into the glomerulus and raises GFR. Angiotensin II preferentially constricts the efferent arteriole, which helps hold GFR up when blood pressure falls.

## Segment by segment

| Segment | Main job | Water permeable? | Key transporters, hormones and drugs |
|---|---|---|---|
| Proximal tubule | Reabsorbs about 65% of filtered Na<sup>+</sup> and water, essentially all glucose and amino acids, most HCO<sub>3</sub><sup>-</sup>; secretes H<sup>+</sup> and many drugs | Yes; fluid stays isosmotic (about 300 mOsm/L) | SGLT2 and GLUT2 for glucose; Na<sup>+</sup>/H<sup>+</sup> exchange |
| Descending limb of the loop | Loses water to the salty medulla, so filtrate concentrates | Yes | Aquaporins always present |
| Thin ascending limb | NaCl leaves passively | No | |
| Thick ascending limb | Pumps NaCl out, so filtrate dilutes | No | NKCC2; blocked by loop diuretics |
| Distal convoluted tubule | Further NaCl reabsorption; regulated Ca<sup>2+</sup> reabsorption | No, largely | NCC, blocked by thiazides; PTH increases Ca<sup>2+</sup> uptake |
| Collecting duct | Final adjustment of water, Na<sup>+</sup>, K<sup>+</sup> and H<sup>+</sup> | Only when ADH is present | ADH inserts aquaporin-2; aldosterone drives Na<sup>+</sup> in and K<sup>+</sup> and H<sup>+</sup> out |

### Proximal tubule: the bulk reclaimer

Most reabsorption in the proximal tubule is powered, directly or indirectly, by the Na<sup>+</sup>/K<sup>+</sup> ATPase on the blood side of the cells, which keeps cell Na<sup>+</sup> low. Sodium then flows in from the tubule and drags glucose with it through SGLT2, a secondary active cotransporter; glucose leaves the other side of the cell by facilitated diffusion through GLUT2. The same pattern appears in the gut, as the [passive vs active transport note](passive-vs-active-transport.html) explains. Water follows the solutes by osmosis, so the fluid volume shrinks a lot while its osmolarity stays near plasma's.

### Loop of Henle: building the gradient

The two limbs of the loop are permeable to opposite things, and that difference is the whole trick. The descending limb lets water out but not much salt, so filtrate becomes more concentrated as it travels down into the hypertonic medulla. The thick ascending limb pumps NaCl out but is watertight, so the filtrate becomes more dilute on the way back up, while the salt it removes keeps the surrounding medulla concentrated. Because fluid flows in opposite directions in the two limbs, a small difference at each level (about 200 mOsm/L) multiplies into a gradient from about 300 mOsm/L at the cortex to about 1200 mOsm/L deep in the inner medulla. This is the **countercurrent multiplier**. The vasa recta capillaries loop alongside without washing the gradient away, and recycled urea adds to it.

Notice the counterintuitive result: fluid leaving the loop is more dilute than plasma, around 100 mOsm/L. The loop concentrates the medulla, not the urine.

### Distal tubule and collecting duct: the regulated finish

Whatever reaches the collecting duct is dilute. What happens next depends on hormones:

- **ADH** (antidiuretic hormone, released from the posterior pituitary when plasma osmolarity rises) inserts aquaporin-2 channels in collecting duct cells. Water then leaves the duct into the salty medulla, and urine can approach the medullary maximum of about 1200 mOsm/L.
- **Without ADH**, the duct stays watertight, salt reabsorption continues, and urine can be as dilute as roughly 50 to 100 mOsm/L.
- **Aldosterone**, a steroid from the adrenal cortex, increases Na<sup>+</sup> channels and Na<sup>+</sup>/K<sup>+</sup> ATPase activity in principal cells. Na<sup>+</sup> is reabsorbed (and water tends to follow), while K<sup>+</sup> and H<sup>+</sup> are lost into the urine.

![Tubular fluid osmolarity along the nephron with and without ADH](assets/notes/nephron-function-segments-reabsorption.png "Approximate osmolarity of tubular fluid in a long-looped nephron. The proximal tubule stays near 300, the loop rises to about 1200 then falls to about 100, and the collecting duct ends concentrated with ADH or dilute without it.")

The kidney also handles acid-base balance here and upstream. The proximal tubule reclaims filtered bicarbonate, and intercalated cells in the collecting duct secrete H<sup>+</sup>, which urinary phosphate and ammonia buffer. Those steps adjust the bicarbonate term in the blood buffer equation covered in the [Henderson-Hasselbalch note](henderson-hasselbalch-for-the-mcat.html).

## Worked example: the numbers behind urine

**Step 1: how much is filtered per day?** GFR of 125 mL/min &times; 1440 min/day = 180,000 mL, or **180 L/day**. Total plasma volume is only about 3 L, so the kidneys filter the entire plasma volume many times a day.

**Step 2: how much is reabsorbed?** If daily urine output is 1.5 L, then 1.5 / 180 = 0.8% of the filtered fluid is excreted and about **99.2% is reabsorbed**.

**Step 3: measure GFR by clearance.** Clearance is the volume of plasma completely cleared of a substance per minute: C = (U &times; V) / P, where U is urine concentration, V is urine flow rate, and P is plasma concentration. Inulin is filtered freely and neither reabsorbed nor secreted, so its clearance equals GFR. Suppose urine inulin is 50 mg/mL, urine flow is 1.25 mL/min, and plasma inulin is 0.5 mg/mL:

C = (50 &times; 1.25) / 0.5 = **125 mL/min**, which is the GFR.

**Step 4: interpret another substance.** A substance with urine concentration 10 mg/mL and plasma concentration 2 mg/mL, at the same 1.25 mL/min urine flow, has a clearance of (10 &times; 1.25) / 2 = 6.25 mL/min. That is far below the GFR of 125 mL/min, so the substance must be filtered and then mostly **reabsorbed**. A clearance above GFR would mean net **secretion**.

**Step 5: when does glucose spill into urine?** Filtered load = GFR &times; plasma concentration. At a normal plasma glucose of 100 mg/dL (1 mg/mL), the load is 125 &times; 1 = 125 mg/min, well under the transport maximum of about 375 mg/min, so all of it is reabsorbed. The load would reach 375 mg/min at a plasma glucose of 375 / 125 = 3 mg/mL, or 300 mg/dL. In practice glucose appears in urine starting near 180 mg/dL, because individual nephrons differ and the weakest ones saturate first.

## Common traps

- **Efferent constriction lowers GFR.** It raises GFR, by raising pressure inside the glomerulus. Afferent constriction lowers it.
- **The loop concentrates the urine.** The loop concentrates the medulla. Fluid leaving the thick ascending limb is dilute; the collecting duct, with ADH, makes the urine concentrated.
- **The thick ascending limb is water permeable.** It is not. The descending limb is the water-permeable one.
- **ADH acts on the proximal tubule.** ADH acts on the late distal tubule and collecting duct. Proximal water reabsorption is not hormone regulated in this way.
- **Clearance below GFR means the substance was not filtered.** A freely filtered substance with low clearance was filtered and then reabsorbed.
- **Aldosterone saves potassium.** It does the opposite: Na<sup>+</sup> in, K<sup>+</sup> and H<sup>+</sup> out.

## One-minute recap

Filtration: net pressure about 10 mmHg, GFR about 125 mL/min (180 L/day), proteins and cells stay in the blood. Proximal tubule: about 65% of Na<sup>+</sup> and water, all glucose and amino acids, isosmotic. Descending limb: water out. Thick ascending limb: NaCl out, watertight, filtrate dilutes, medulla concentrates to about 1200 mOsm/L. Distal tubule: NaCl (thiazides) and Ca<sup>2+</sup> (PTH). Collecting duct: ADH adds aquaporin-2 for concentrated urine; aldosterone saves Na<sup>+</sup> and spends K<sup>+</sup> and H<sup>+</sup>. Clearance C = UV/P; inulin clearance equals GFR.

:::quiz
Q: Which nephron segment reabsorbs the largest share of filtered sodium and water?
A: The proximal tubule, at about 65 percent of filtered Na+ and water. The fluid stays isosmotic because water follows the solutes.
Q: A drug blocks NKCC2 in the thick ascending limb. What happens to the medullary gradient and to urine volume?
A: The medullary gradient weakens because less NaCl is pumped into the interstitium, so the collecting duct cannot pull as much water out, and urine volume rises. This is how loop diuretics work.
Q: What happens to GFR when the efferent arteriole constricts?
A: GFR rises. Blood backs up in the glomerular capillaries, raising the hydrostatic pressure that drives filtration.
Q: Urine concentration of a substance is 30 mg/mL, urine flow is 2 mL/min, and plasma concentration is 0.4 mg/mL. What is its clearance, and with a GFR of 125 mL/min, is it net reabsorbed or secreted?
A: Clearance is (30 x 2) / 0.4 = 150 mL/min. That exceeds the GFR, so the substance is net secreted into the tubule.
Q: Why can a person without ADH still produce very dilute urine?
A: Fluid leaving the thick ascending limb is already dilute, and without ADH the collecting duct has no aquaporin-2, so water stays in the tubule while salt is still removed.
:::

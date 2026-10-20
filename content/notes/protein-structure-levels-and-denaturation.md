---
title: Protein Structure: Primary to Quaternary, and What Denaturation Destroys
description: The four levels of protein structure, the bonds that hold each level together, and how heat, pH, urea, and SDS unfold proteins, written for the MCAT.
product: aa-enzymes
published: 2026-10-20
related: amino-acid-pka-charge-ph-7-4, enzyme-inhibition-types-compared, enzyme-classes-ec-1-to-7
---

A protein's shape decides its job. The MCAT organizes that idea into four levels of structure and then tests whether you know which kinds of bonds hold each level together and which treatments break them. That pairing, level plus bond, is the key to the topic, and it is also the key to understanding denaturation.

## Level 1: primary structure

**Primary structure** is the linear sequence of amino acids in the chain, written from the N-terminus (free amino end) to the C-terminus (free carboxyl end). Neighboring residues are joined by **peptide bonds**, which are covalent amide bonds formed when the carboxyl group of one amino acid condenses with the amino group of the next, releasing water.

Peptide bonds have a feature that shapes everything above them. Resonance shares electrons between the C-N bond and the C=O bond, so the peptide bond has partial double-bond character. It is therefore planar and cannot rotate freely, and the groups around it usually sit in a trans arrangement (proline is the common exception, where cis is more accessible). Rotation is possible around the bonds on either side of the alpha carbon, and those two angles (phi and psi) determine which folds are allowed.

Primary structure is the only level held by covalent backbone bonds, so it survives almost every denaturing treatment. Breaking peptide bonds requires hydrolysis, for example by strong acid with heat or by protease enzymes.

## Level 2: secondary structure

**Secondary structure** is local, repeating folding of the backbone, stabilized by **hydrogen bonds between backbone atoms** (the C=O of one residue and the N-H of another). The side chains are not what holds it together.

- **Alpha helix.** A right-handed coil with about 3.6 residues per turn. The C=O of residue *i* bonds to the N-H of residue *i* + 4, so the hydrogen bonds run roughly parallel to the helix axis within a single stretch of chain. The side chains point outward.
- **Beta sheet.** Extended strands lined up side by side, with hydrogen bonds between the backbones of neighboring strands. Strands can run in the same direction (parallel) or opposite directions (antiparallel). Side chains alternate above and below the plane of the sheet.
- **Turns and loops.** Short segments that reverse chain direction and connect helices and sheets.

Some residues fit certain structures better than others. **Proline** lacks a backbone N-H to donate to a hydrogen bond and has a rigid ring, so it disrupts helices and often sits in turns. **Glycine**, with only a hydrogen as its side chain, is flexible and also common in turns.

![Four levels of protein structure shown side by side with the main stabilizing interactions](assets/notes/protein-structure-levels-and-denaturation.png "The four levels of protein structure and what holds each one together.")

## Level 3: tertiary structure

**Tertiary structure** is the overall three-dimensional fold of a single polypeptide chain, and here the **side chains** take over. The main forces, roughly in order of how often they drive the fold:

- **Hydrophobic effect.** Nonpolar side chains cluster in the interior, away from water, which is usually the dominant driving force of folding. Polar and charged residues end up on the surface in soluble proteins.
- **Hydrogen bonds** between polar side chains and between side chains and the backbone.
- **Ionic interactions (salt bridges)** between oppositely charged groups, such as lysine and aspartate.
- **Van der Waals (London dispersion) forces,** weak but numerous in the tightly packed core.
- **Disulfide bonds.** Two cysteine thiol groups oxidize to form a covalent S-S bond. They add stability, especially in proteins that are secreted into the oxidizing extracellular environment, and are rare in the reducing environment of the cytosol.

A **domain** is a compact, semi-independent folded region within a chain, and a **motif** is a common arrangement of a few secondary structure elements. Both are terms the MCAT uses at the tertiary level.

## Level 4: quaternary structure

**Quaternary structure** is the arrangement of two or more polypeptide chains (subunits) into a single functional complex. It is held together by the same kinds of interactions as tertiary structure: hydrophobic contacts, hydrogen bonds, ionic bonds, and sometimes disulfide bonds between chains. Hemoglobin is the classic example, a tetramer of two alpha and two beta subunits. Many proteins have no quaternary structure because they function as a single chain.

A frequent trap: **a protein that is a single chain has no quaternary structure**, however complicated its tertiary fold is. Quaternary structure requires more than one polypeptide.

## Summary table

| Level | What it describes | Main stabilizing forces |
|---|---|---|
| Primary | Amino acid sequence | Peptide (covalent) bonds |
| Secondary | Local helices, sheets, turns | Backbone hydrogen bonds |
| Tertiary | Fold of one chain | Hydrophobic effect, side chain H bonds, ionic, van der Waals, disulfides |
| Quaternary | Multiple subunits | Same as tertiary, between chains |

## Denaturation: what breaks and what stays

**Denaturation** is the loss of native three-dimensional structure and therefore of function. In denaturation, secondary, tertiary, and quaternary structure are lost while **primary structure stays intact**, because the peptide bonds are not broken.

The common denaturing agents and their mechanisms:

- **Heat** adds kinetic energy that disrupts weak noncovalent interactions.
- **Extreme pH** changes the charge on side chains, breaking salt bridges and hydrogen bonds. This is why the stomach's acid denatures dietary proteins.
- **Urea and guanidinium chloride** (chaotropic agents) interfere with hydrogen bonding and the hydrophobic effect, letting the chain unfold.
- **Detergents such as SDS** coat the protein in negatively charged detergent molecules and disrupt hydrophobic interactions.
- **Organic solvents** weaken the hydrophobic effect.
- **Reducing agents such as beta-mercaptoethanol or dithiothreitol (DTT)** reduce disulfide bonds back to free thiols. This is a chemical reduction of a covalent bond, which is why it is used together with urea when a protein contains disulfides.
- **Heavy metal ions** can bind side chains and disturb the fold.

### Is denaturation reversible?

Sometimes. In a classic series of experiments, Christian Anfinsen unfolded the enzyme ribonuclease A with urea and a reducing agent, then removed both and found that it refolded into an active enzyme. The conclusion: **the amino acid sequence contains the information needed to fold**, and the native fold is a thermodynamically favorable state. Many proteins refold spontaneously after gentle denaturation.

Others do not, especially after strong heating. Unfolded chains expose hydrophobic regions that stick to each other and form aggregates, and once clumped they cannot refold. Boiling an egg is the standard example. In cells, **chaperone proteins** help new and stressed proteins fold correctly and reduce aggregation.

## Techniques that use these ideas

- **SDS-PAGE** denatures proteins with SDS and often a reducing agent. SDS gives all proteins a similar negative charge per unit of mass, so they separate by size alone, with smaller proteins moving faster through the gel.
- **Native PAGE** keeps the protein folded, so separation depends on charge, size, and shape.
- **Isoelectric focusing** separates proteins by pI, discussed in the [amino acid charge note](amino-acid-pka-charge-ph-7-4.html).

## Common traps

- **Saying denaturation breaks peptide bonds.** It does not. Primary structure is retained.
- **Assigning side chains to secondary structure.** Secondary structure is backbone hydrogen bonding. Side chain interactions belong to tertiary.
- **Saying disulfide bonds are secondary structure.** They are covalent side chain bonds, part of tertiary or quaternary structure.
- **Assuming all denaturation is irreversible.** Anfinsen's work shows refolding is possible, though aggregation prevents it in many cases.
- **Calling a single-chain protein quaternary.** It needs two or more chains.

## One-minute recap

Primary: sequence, peptide bonds. Secondary: helices and sheets, backbone hydrogen bonds. Tertiary: whole-chain fold, driven by the hydrophobic effect plus side chain interactions and disulfides. Quaternary: multiple chains. Denaturation destroys levels 2 to 4 and leaves level 1 alone, and sequence alone can sometimes direct refolding.

:::quiz
Q: Which level of structure is lost first when a protein is gently denatured with urea, and which survives?
A: Secondary, tertiary, and quaternary structure are all disrupted, since they depend on noncovalent forces (and disulfides, if reduced). Primary structure survives because peptide bonds are covalent and urea does not break them.
Q: What kind of interaction stabilizes an alpha helix?
A: Hydrogen bonds between backbone atoms, specifically the C=O of residue i and the N-H of residue i + 4. Side chains point outward and do not form the stabilizing bonds.
Q: Why does proline often break alpha helices?
A: Proline has no backbone N-H to donate to a hydrogen bond, and its side chain is a ring fused to the backbone nitrogen, which restricts rotation.
Q: A researcher adds urea and beta-mercaptoethanol to a protein and then removes both, and the protein regains full activity. What does this say about protein folding?
A: The amino acid sequence contains the information needed for the native fold (Anfinsen's principle). Urea disrupted noncovalent interactions, beta-mercaptoethanol reduced the disulfides, and removing them let the protein refold spontaneously.
Q: Why does SDS-PAGE separate proteins by mass rather than by charge?
A: SDS binds along the chain and gives every protein a similar negative charge per unit of mass, while also unfolding it. Charge differences are masked, so the gel sieves proteins by size and smaller ones travel farther.
:::

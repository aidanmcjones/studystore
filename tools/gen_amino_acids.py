#!/usr/bin/env python3
"""Write data/amino_acids.json: 20 residues with codes, class, pKa values and a skeletal structure graph.

Structures are original drawings: atoms [label, x, y] in screen coordinates (y down, bond length 1) and
bonds [i, j, order]. Labels are "" for plain carbon vertices. The shared backbone (+H3N, alpha C, COO-) is
added by the renderer; "struct" holds the side chain only (plus the alpha carbon at index 0), except Pro,
which carries its own ring (flag "own_backbone").

pKa values: typical textbook values (alpha-COOH, alpha-NH3+, side chain). Sources differ by a few tenths;
side chain values match the StudyStore note on amino acid pKa values. Run: python3 tools/gen_amino_acids.py
"""
import json, math
from pathlib import Path

def rad(a): return math.radians(a)

class Mol:
    def __init__(self):
        self.atoms = []; self.bonds = []; self.names = {}
        self.add("CA", "", (0.0, 0.0))
    def add(self, name, label, xy):
        self.names[name] = len(self.atoms); self.atoms.append([label, round(xy[0], 3), round(xy[1], 3)])
    def pos(self, name): a = self.atoms[self.names[name]]; return (a[1], a[2])
    def bond(self, a, b, order=1): self.bonds.append([self.names[a], self.names[b], order])
    def a(self, name, label, parent, angle, order=1):
        px, py = self.pos(parent)
        self.add(name, label, (px + math.cos(rad(angle)), py + math.sin(rad(angle))))
        self.bond(parent, name, order)
    def ring(self, prefix, anchor_name, anchor_xy_from, direction, n, names, doubles, labels=None):
        """Regular n-gon whose first vertex is names[0] already placed at anchor; centre lies along direction."""
        labels = labels or {}
        ax, ay = self.pos(names[0])
        R = 1 / (2 * math.sin(math.pi / n))
        cx, cy = ax + R * math.cos(rad(direction)), ay + R * math.sin(rad(direction))
        for k in range(1, n):
            ang = direction + 180 + k * 360 / n
            self.add(names[k], labels.get(names[k], ""), (cx + R * math.cos(rad(ang)), cy + R * math.sin(rad(ang))))
        for k in range(n):
            self.bond(names[k], names[(k + 1) % n], 2 if (k, (k + 1) % n) in doubles else 1)
        return (cx, cy)
    def out(self): return {"atoms": self.atoms, "bonds": self.bonds}

def ZZ(m):  # CA -> CB straight down
    m.a("CB", "", "CA", 90)

def phe(m, tyr=False):
    ZZ(m); m.a("CG", "", "CB", 90)
    m.ring("r", "CG", None, 90, 6, ["CG", "CD1", "CE1", "CZ", "CE2", "CD2"], {(0, 1), (2, 3), (4, 5)})
    if tyr: m.a("OH", "OH", "CZ", 90)

def trp(m):
    ZZ(m)
    R5 = 1 / (2 * math.sin(math.pi / 5)); c = (0.0, 2.0 + R5)
    P = {}
    for nme, ang in (("CG", -90), ("CD1", -18), ("NE1", 54), ("CE2", 126), ("CD2", 198)):
        P[nme] = (c[0] + R5 * math.cos(rad(ang)), c[1] + R5 * math.sin(rad(ang)))
    mid = ((P["CD2"][0] + P["CE2"][0]) / 2, (P["CD2"][1] + P["CE2"][1]) / 2)
    d = (mid[0] - c[0], mid[1] - c[1]); dl = math.hypot(*d)
    hc = (mid[0] + d[0] / dl * math.sqrt(3) / 2, mid[1] + d[1] / dl * math.sqrt(3) / 2)
    ang_cd2 = math.degrees(math.atan2(P["CD2"][1] - hc[1], P["CD2"][0] - hc[0]))
    ang_ce2 = math.degrees(math.atan2(P["CE2"][1] - hc[1], P["CE2"][0] - hc[0]))
    diff = (ang_ce2 - ang_cd2 + 540) % 360 - 180  # +60 or -60
    step = -diff  # walk from CD2 away from CE2
    H = {}
    for k, nme in enumerate(["CD2", "CE3", "CZ3", "CH2", "CZ2", "CE2"]):
        a_ = ang_cd2 + k * (step if abs(abs(step) - 60) < 1 else 60)
        H[nme] = (hc[0] + math.cos(rad(a_)), hc[1] + math.sin(rad(a_)))
    for nme in ("CG", "CD1", "NE1", "CE2", "CD2"):
        m.add(nme, "NH" if nme == "NE1" else "", P[nme])
    for nme in ("CE3", "CZ3", "CH2", "CZ2"):
        m.add(nme, "", H[nme])
    for a_, b_, o in (("CB", "CG", 1), ("CG", "CD1", 2), ("CD1", "NE1", 1), ("NE1", "CE2", 1), ("CE2", "CD2", 1), ("CD2", "CG", 1),
                      ("CE2", "CZ2", 2), ("CZ2", "CH2", 1), ("CH2", "CZ3", 2), ("CZ3", "CE3", 1), ("CE3", "CD2", 2)):
        m.bond(a_, b_, o)

def his(m):
    ZZ(m); m.a("CG", "", "CB", 90)
    m.ring("r", "CG", None, 90, 5, ["CG", "ND1", "CE1", "NE2", "CD2"], {(0, 4), (2, 3)},
           {"ND1": "NH", "NE2": "N"})

def build(code):
    m = Mol()
    if code == "G": m.a("H", "H", "CA", 90)
    elif code == "A": ZZ(m)
    elif code == "V": ZZ(m); m.a("CG1", "", "CB", 150); m.a("CG2", "", "CB", 30)
    elif code == "L": ZZ(m); m.a("CG", "", "CB", 150); m.a("CD1", "", "CG", 90); m.a("CD2", "", "CG", 210)
    elif code == "I": ZZ(m); m.a("CG1", "", "CB", 150); m.a("CG2", "", "CB", 30); m.a("CD1", "", "CG1", 90)
    elif code == "M": ZZ(m); m.a("CG", "", "CB", 150); m.a("SD", "S", "CG", 90); m.a("CE", "", "SD", 30)
    elif code == "F": phe(m)
    elif code == "Y": phe(m, True)
    elif code == "W": trp(m)
    elif code == "S": ZZ(m); m.a("OG", "OH", "CB", 150)
    elif code == "T": ZZ(m); m.a("OG1", "OH", "CB", 150); m.a("CG2", "", "CB", 30)
    elif code == "C": ZZ(m); m.a("SG", "SH", "CB", 150)
    elif code == "N": ZZ(m); m.a("CG", "", "CB", 150); m.a("OD1", "O", "CG", 210, 2); m.a("ND2", "NH2", "CG", 90)
    elif code == "Q": ZZ(m); m.a("CG", "", "CB", 150); m.a("CD", "", "CG", 90); m.a("OE1", "O", "CD", 150, 2); m.a("NE2", "NH2", "CD", 30)
    elif code == "D": ZZ(m); m.a("CG", "", "CB", 150); m.a("OD1", "O", "CG", 210, 2); m.a("OD2", "O-", "CG", 90)
    elif code == "E": ZZ(m); m.a("CG", "", "CB", 150); m.a("CD", "", "CG", 90); m.a("OE1", "O", "CD", 150, 2); m.a("OE2", "O-", "CD", 30)
    elif code == "K": ZZ(m); m.a("CG", "", "CB", 150); m.a("CD", "", "CG", 90); m.a("CE", "", "CD", 150); m.a("NZ", "+H3N", "CE", 90)
    elif code == "R":
        ZZ(m); m.a("CG", "", "CB", 150); m.a("CD", "", "CG", 90); m.a("NE", "NH", "CD", 150); m.a("CZ", "", "NE", 90)
        m.a("NH1", "H2N+", "CZ", 150, 2); m.a("NH2", "NH2", "CZ", 30)
    elif code == "H": his(m)
    elif code == "P":
        m = Mol(); m.atoms = []; m.bonds = []; m.names = {}
        # pyrrolidine ring with N in ring; alpha C at origin, backbone carboxyl drawn by renderer from CA
        m.add("CA", "", (0.0, 0.0)); m.add("N", "H2N+", (-0.809, 0.588)); m.add("CD", "", (-0.309, 1.538))
        m.add("CG", "", (0.691, 1.538)); m.add("CB", "", (1.0, 0.588))
        # regular pentagon: place using centre
        R = 1 / (2 * math.sin(math.pi / 5)); cx, cy = -0.0 - 0.0, 0.0
        cx, cy = 0.0, R  # centre below CA
        pts = [(cx + R * math.cos(rad(-90 - 90 + 90 + k * 72 - 90 + 90)), 0) for k in range(5)]
        m.atoms = []; m.names = {}; m.bonds = []
        angs = [-90, -90 + 72, -90 + 144, -90 + 216, -90 + 288]  # CA at top: centre (0,R), CA at angle -90
        for nme, ang, lab in zip(["CA", "CB", "CG", "CD", "N"], angs, ["", "", "", "", "H2N+"]):
            m.add(nme, lab, (cx + R * math.cos(rad(ang)), cy + R * math.sin(rad(ang))))
        for a, b in (("CA", "CB"), ("CB", "CG"), ("CG", "CD"), ("CD", "N"), ("N", "CA")): m.bond(a, b)
    return m.out()

# code1, code3, name, class, alpha COOH pKa, alpha NH3+ pKa, side chain pKa (or None), side chain group, group type (acid/base), note
AA = [
 ("G","Gly","Glycine","nonpolar",2.34,9.60,None,None,None),
 ("A","Ala","Alanine","nonpolar",2.34,9.69,None,None,None),
 ("V","Val","Valine","nonpolar",2.32,9.62,None,None,None),
 ("L","Leu","Leucine","nonpolar",2.36,9.60,None,None,None),
 ("I","Ile","Isoleucine","nonpolar",2.36,9.68,None,None,None),
 ("M","Met","Methionine","nonpolar",2.28,9.21,None,None,None),
 ("P","Pro","Proline","nonpolar",1.99,10.96,None,None,None),
 ("F","Phe","Phenylalanine","aromatic",1.83,9.13,None,None,None),
 ("W","Trp","Tryptophan","aromatic",2.38,9.39,None,None,None),
 ("Y","Tyr","Tyrosine","aromatic",2.20,9.11,10.1,"phenol OH","acid"),
 ("S","Ser","Serine","polar",2.21,9.15,None,None,None),
 ("T","Thr","Threonine","polar",2.63,10.43,None,None,None),
 ("C","Cys","Cysteine","polar",1.71,10.78,8.3,"thiol SH","acid"),
 ("N","Asn","Asparagine","polar",2.02,8.80,None,None,None),
 ("Q","Gln","Glutamine","polar",2.17,9.13,None,None,None),
 ("D","Asp","Aspartate","acidic",2.09,9.82,3.9,"carboxyl","acid"),
 ("E","Glu","Glutamate","acidic",2.19,9.67,4.1,"carboxyl","acid"),
 ("K","Lys","Lysine","basic",2.18,8.95,10.5,"amino","base"),
 ("R","Arg","Arginine","basic",2.17,9.04,12.5,"guanidinium","base"),
 ("H","His","Histidine","basic",1.82,9.17,6.0,"imidazole","base"),
]
out = []
for c1, c3, name, cls, p1, p2, ps, grp, typ in AA:
    d = {"code1": c1, "code3": c3, "name": name, "class": cls, "pka_cooh": p1, "pka_nh3": p2,
         "pka_side": ps, "side_group": grp, "side_type": typ, "struct": build(c1)}
    if c1 == "P": d["own_backbone"] = True
    out.append(d)
doc = {"note": "Original StudyStore data from standard chemistry facts. pKa values are typical textbook values; sources differ by a few tenths.",
       "residues": out}
Path(__file__).resolve().parent.parent.joinpath("data/amino_acids.json").write_text(json.dumps(doc, separators=(",", ":")))
print("wrote", len(out))

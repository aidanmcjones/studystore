/* Shared helpers for the free StudyStore tools. No network calls, no cookies. */
(function (W) {
  "use strict";
  var SS = W.SS = W.SS || {};

  SS.store = function (k, v) {
    try { if (v === undefined) return W.localStorage.getItem("sst_" + k); W.localStorage.setItem("sst_" + k, v); } catch (e) { return null; }
    return null;
  };
  SS.data = function (id) {
    var el = document.getElementById(id);
    return el ? JSON.parse(el.textContent) : null;
  };
  SS.el = function (sel, root) { return (root || document).querySelector(sel); };
  SS.esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  SS.rand = function (n) { return Math.floor(Math.random() * n); };
  SS.shuffle = function (a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = SS.rand(i + 1), t = a[i]; a[i] = a[j]; a[j] = t; } return a; };
  SS.fmt = function (x, d) { return (Math.round(x * Math.pow(10, d)) / Math.pow(10, d)).toFixed(d).replace(/^-0(\.0+)?$/, "0$1"); };
  SS.copy = function (text, done) {
    function fallback() {
      var t = document.createElement("textarea"); t.value = text; t.style.position = "fixed"; t.style.opacity = "0";
      document.body.appendChild(t); t.select(); try { document.execCommand("copy"); } catch (e) {} document.body.removeChild(t); done && done();
    }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(function () { done && done(); }, fallback); else fallback();
  };

  /* ---- chemistry: every charge and pI is computed here from pKa values ---- */
  var C = SS.chem = {};
  // fraction of an acidic group that is deprotonated (charged -1), or of a basic group that is protonated (+1)
  C.fracIonized = function (g, pH) {
    return g.type === "acid" ? 1 / (1 + Math.pow(10, g.pKa - pH)) : 1 / (1 + Math.pow(10, pH - g.pKa));
  };
  C.groupCharge = function (g, pH) { return (g.type === "acid" ? -1 : 1) * C.fracIonized(g, pH); };
  C.netCharge = function (groups, pH) { return groups.reduce(function (s, g) { return s + C.groupCharge(g, pH); }, 0); };
  // free amino acid ionizable groups
  C.groupsOf = function (r) {
    var g = [{ name: "alpha-COOH", type: "acid", pKa: r.pka_cooh }, { name: "alpha-NH3+", type: "base", pKa: r.pka_nh3 }];
    if (r.pka_side != null) g.push({ name: r.name + " side chain (" + r.side_group + ")", type: r.side_type, pKa: r.pka_side });
    return g;
  };
  // isoelectric point: pH where the net charge crosses zero (bisection on a monotonic function)
  C.pI = function (groups) {
    var lo = -2, hi = 16;
    for (var i = 0; i < 80; i++) { var mid = (lo + hi) / 2; if (C.netCharge(groups, mid) > 0) lo = mid; else hi = mid; }
    return (lo + hi) / 2;
  };
  C.sign = function (n) { return n > 0 ? "+" + n : String(n); };

  /* ---- skeletal structure drawing (original data: data/amino_acids.json) ---- */
  SS.structSVG = function (r) {
    var atoms = [], bonds = [], S = r.struct, i, off = 0;
    S.atoms.forEach(function (a) { atoms.push({ l: a[0], x: a[1], y: a[2] }); });
    S.bonds.forEach(function (b) { bonds.push([b[0], b[1], b[2]]); });
    off = atoms.length;
    var addAtom = function (l, x, y) { atoms.push({ l: l, x: x, y: y }); return atoms.length - 1; };
    if (!r.own_backbone) { var n = addAtom("+H3N", -0.87, -0.5); bonds.push([0, n, 1]); }
    var c = addAtom("", 0.87, -0.5), o1 = addAtom("O", 0.87, -1.5), o2 = addAtom("O-", 1.73, 0);
    bonds.push([0, c, 1], [c, o1, 2], [c, o2, 1]);
    var minx = 1e9, maxx = -1e9, miny = 1e9, maxy = -1e9;
    atoms.forEach(function (a) { minx = Math.min(minx, a.x); maxx = Math.max(maxx, a.x); miny = Math.min(miny, a.y); maxy = Math.max(maxy, a.y); });
    var U = 40, pad = 46, w = (maxx - minx) * U + pad * 2, h = (maxy - miny) * U + pad * 2;
    var X = function (x) { return ((x - minx) * U + pad).toFixed(1); }, Y = function (y) { return ((y - miny) * U + pad).toFixed(1); };
    var s = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + w.toFixed(0) + " " + h.toFixed(0) + '" role="img" aria-label="Skeletal structure of the amino acid shown in the question"><g stroke="#17212b" stroke-width="2.2" stroke-linecap="round" fill="none">';
    bonds.forEach(function (b) {
      var a = atoms[b[0]], d = atoms[b[1]];
      if (b[2] === 2) {
        var dx = d.x - a.x, dy = d.y - a.y, L = Math.hypot(dx, dy), nx = -dy / L * 0.07, ny = dx / L * 0.07;
        [-1, 1].forEach(function (k) { s += '<line x1="' + X(a.x + nx * k) + '" y1="' + Y(a.y + ny * k) + '" x2="' + X(d.x + nx * k) + '" y2="' + Y(d.y + ny * k) + '"/>'; });
      } else s += '<line x1="' + X(a.x) + '" y1="' + Y(a.y) + '" x2="' + X(d.x) + '" y2="' + Y(d.y) + '"/>';
    });
    s += '</g><g font-family="Helvetica,Arial,sans-serif" font-size="17" font-weight="600" text-anchor="middle" dominant-baseline="central" fill="#17212b" stroke="#fffdf8" stroke-width="7" paint-order="stroke" stroke-linejoin="round">';
    atoms.forEach(function (a) { if (a.l) s += '<text x="' + X(a.x) + '" y="' + Y(a.y) + '">' + SS.esc(a.l) + "</text>"; });
    return s + "</g></svg>";
  };

  /* ---- shared page behavior: embed mode, copy-embed box ---- */
  SS.initEmbedBox = function (slug) {
    var ta = document.getElementById("embed-code"); if (!ta) return;
    var url = "https://www.studystore.co/tools/" + slug + ".html?embed=1";
    ta.value = '<iframe src="' + url + '" title="StudyStore free MCAT tool" width="100%" height="720" style="border:1px solid #ddd3c0;border-radius:8px" loading="lazy"></iframe>\n' +
      '<p style="font-size:13px">Free tool by <a href="https://www.studystore.co/tools/' + slug + '.html">StudyStore</a></p>';
    var b = document.getElementById("embed-copy");
    if (b) b.addEventListener("click", function () { SS.copy(ta.value, function () { b.textContent = "Copied"; setTimeout(function () { b.textContent = "Copy embed code"; }, 1800); }); });
  };
})(window);

/* pKa / charge-at-pH trainer. All numbers are computed from pKa values with the Henderson-Hasselbalch relation. */
(function () {
  "use strict";
  var SS = window.SS, chem = SS.chem;
  var R = SS.data("aa-data").residues;
  var TERM = { cooh: 2.0, nh3: 9.0 }; // teaching convention for peptide termini
  var $ = function (id) { return document.getElementById(id); };
  var MODES = { state: "Protonated or not?", peptide: "Peptide net charge", hh: "HH calculator", explore: "Charge explorer" };
  var mode = "state", cur = null, score = 0, total = 0, streak = 0;
  var ION = R.filter(function (r) { return r.pka_side != null; });
  var PH = [1, 2, 3, 4, 5, 6, 6.5, 7, 7.4, 8, 9, 10, 11, 12, 13];

  function pick(a) { return a[SS.rand(a.length)]; }
  function setScore() { $("score").textContent = "Score " + score + " of " + total + (streak > 1 ? " (streak " + streak + ")" : ""); }
  function record(ok) { total++; if (ok) { score++; streak++; } else streak = 0; setScore(); }

  /* ---------- mode 1: protonated or deprotonated ---------- */
  function stateQ() {
    var r = pick(ION), g = { name: r.name + " side chain (" + r.side_group + ")", type: r.side_type, pKa: r.pka_side }, pH, d, k = 0;
    do { pH = pick(PH); d = pH - g.pKa; k++; } while (Math.abs(d) < 0.5 && k < 50);
    cur = { g: g, pH: pH, d: d, r: r };
    var hide = $("hidepka").checked;
    $("stage").innerHTML = '<p class="qtext">At pH <b>' + pH + "</b>, is the " + SS.esc(g.name) + (hide ? "" : " (pKa " + g.pKa + ")") +
      ' mostly protonated or mostly deprotonated?</p><div class="opts"><button type="button" data-a="p">Mostly protonated (pH below pKa)</button><button type="button" data-a="d">Mostly deprotonated (pH above pKa)</button></div><div id="out" role="status" aria-live="polite"></div>';
  }
  function stateAnswer(a) {
    var g = cur.g, d = cur.d, prot = d < 0, ok = (a === "p") === prot;
    var ratio = Math.pow(10, d), fr = chem.fracIonized(g, cur.pH), ch = chem.groupCharge(g, cur.pH);
    var acid = g.type === "acid";
    var chargedForm = acid ? "deprotonated (A-)" : "protonated (BH+)";
    var out = '<p class="fb ' + (ok ? "ok" : "no") + '">' + (ok ? "Correct." : "Not quite.") + "</p>" +
      '<div class="panel work"><strong>Working</strong><br>pH = pKa + log([A-]/[HA])<br>log([A-]/[HA]) = ' + cur.pH + " - " + g.pKa + " = " + SS.fmt(d, 2) +
      "<br>[A-]/[HA] = 10^" + SS.fmt(d, 2) + " = " + (ratio >= 100 || ratio < 0.01 ? ratio.toExponential(2) : SS.fmt(ratio, 3)) +
      "<br>Deprotonated: " + SS.fmt(100 * ratio / (1 + ratio), 1) + " percent. Protonated: " + SS.fmt(100 / (1 + ratio), 1) + " percent.<br>" +
      (acid ? "Acidic group: neutral when protonated (HA), -1 when deprotonated." : "Basic group: +1 when protonated (BH+), neutral when deprotonated.") +
      " Expected charge on this group: " + SS.fmt(ch, 2) + ".</div>" +
      '<p class="meta">Rule of thumb: one unit away from the pKa is about 91 percent in one form; at the pKa it is 50 percent. The charged form here is ' + chargedForm + ".</p>" +
      '<button type="button" class="tbtn primary" id="nextq">Next</button>';
    $("out").innerHTML = out; record(ok);
    document.querySelectorAll("#stage .opts button").forEach(function (b) { b.disabled = true; });
    $("nextq").focus(); $("nextq").addEventListener("click", stateQ);
  }

  /* ---------- mode 2: peptide net charge ---------- */
  function peptideQ() {
    var seq, pH, net, g, k, neutral = R.filter(function (r) { return r.pka_side == null && r.code1 !== "P"; });
    for (k = 0; k < 500; k++) {
      var len = 3 + SS.rand(2); seq = [];
      for (var i = 0; i < len; i++) seq.push(Math.random() < 0.7 ? pick(ION) : pick(neutral));
      if (!seq.some(function (r) { return r.pka_side != null; })) continue;
      pH = pick(PH);
      g = [{ name: "N-terminus (alpha-NH3+)", type: "base", pKa: TERM.nh3 }, { name: "C-terminus (alpha-COOH)", type: "acid", pKa: TERM.cooh }];
      seq.forEach(function (r, i) { if (r.pka_side != null) g.push({ name: r.code3 + " (position " + (i + 1) + ") side chain", type: r.side_type, pKa: r.pka_side }); });
      net = chem.netCharge(g, pH);
      if (Math.abs(net - Math.round(net)) <= 0.3) break;
    }
    cur = { seq: seq, pH: pH, g: g, net: net };
    $("stage").innerHTML = '<p class="qtext">Peptide <b>' + seq.map(function (r) { return r.code3; }).join("-") + '</b> (N-terminus on the left), pH <b>' + pH +
      '</b>. What is the approximate net charge?</p><p class="meta">Termini use the teaching values pKa 2.0 (C-terminal COOH) and 9.0 (N-terminal NH3+). Side-chain pKa values are in the table below the answer.</p>' +
      '<form id="pf" class="fields" style="max-width:320px"><label>Net charge (whole number)<input id="pin" type="number" step="1" min="-6" max="6" inputmode="numeric" required></label><button class="tbtn primary" type="submit">Check</button></form><div id="out" role="status" aria-live="polite"></div>';
    $("pf").addEventListener("submit", function (e) { e.preventDefault(); peptideAnswer(parseInt($("pin").value, 10)); });
    $("pin").focus();
  }
  function peptideAnswer(v) {
    if (isNaN(v) || cur.done) return; cur.done = true;
    var ans = Math.round(cur.net), ok = v === ans;
    var rows = cur.g.map(function (x) {
      return "<tr><td>" + SS.esc(x.name) + "</td><td>" + x.pKa + "</td><td>" + SS.fmt(cur.pH - x.pKa, 2) + "</td><td>" + SS.fmt(100 * chem.fracIonized(x, cur.pH), 1) + "%</td><td>" + SS.fmt(chem.groupCharge(x, cur.pH), 2) + "</td></tr>";
    }).join("");
    $("out").innerHTML = '<p class="fb ' + (ok ? "ok" : "no") + '">' + (ok ? "Correct." : "Not quite. The answer is " + chem.sign(ans) + ".") + "</p>" +
      '<div class="tablewrap"><table class="work"><thead><tr><th>Group</th><th>pKa</th><th>pH - pKa</th><th>Charged form</th><th>Charge</th></tr></thead><tbody>' + rows +
      "<tr><th colspan=4>Net charge (sum)</th><th>" + SS.fmt(cur.net, 2) + "</th></tr></tbody></table></div>" +
      '<p class="meta">For each group: acids carry -1 when deprotonated, bases carry +1 when protonated. The fraction charged is 1 / (1 + 10^(pKa - pH)) for acids and 1 / (1 + 10^(pH - pKa)) for bases, which is Henderson-Hasselbalch rearranged.</p>' +
      '<button type="button" class="tbtn primary" id="nextq">Next peptide</button>';
    record(ok); $("pin").disabled = true; $("nextq").focus(); $("nextq").addEventListener("click", peptideQ);
  }

  /* ---------- mode 3: HH calculator ---------- */
  function hhView() {
    $("stage").innerHTML = '<div class="fields"><label>pKa<input id="h-pka" type="number" step="0.1" value="6.0" inputmode="decimal"></label><label>pH<input id="h-ph" type="number" step="0.1" value="7.4" inputmode="decimal"></label></div><div id="hh-out" role="status" aria-live="polite"></div>';
    var f = function () {
      var pka = parseFloat($("h-pka").value), ph = parseFloat($("h-ph").value);
      if (isNaN(pka) || isNaN(ph)) { $("hh-out").innerHTML = "<p>Enter both values.</p>"; return; }
      var d = ph - pka, ratio = Math.pow(10, d), pd = 100 * ratio / (1 + ratio);
      $("hh-out").innerHTML = '<div class="panel work"><strong>pH = pKa + log([A-]/[HA])</strong><br>log([A-]/[HA]) = ' + ph + " - " + pka + " = " + SS.fmt(d, 2) +
        "<br>[A-]/[HA] = " + (ratio >= 1000 || ratio < 0.001 ? ratio.toExponential(2) : SS.fmt(ratio, 3)) +
        "</div><p><span class=pct>" + SS.fmt(pd, 1) + '%</span> deprotonated (A-), ' + SS.fmt(100 - pd, 1) + '% protonated (HA)</p><div class="bar" aria-hidden="true"><i style="width:' + pd.toFixed(1) + '%"></i></div>' +
        '<p class="meta">For a base such as a lysine side chain, "protonated" is the charged form (BH+) and "deprotonated" is the neutral base (B).</p>';
    };
    $("h-pka").addEventListener("input", f); $("h-ph").addEventListener("input", f); f();
  }

  /* ---------- mode 4: charge explorer ---------- */
  function exploreView() {
    $("stage").innerHTML = '<div class="fields"><label>Amino acid<select id="x-res">' + R.map(function (r, i) { return '<option value="' + i + '">' + r.name + " (" + r.code3 + ")</option>"; }).join("") +
      '</select></label><label>pH: <output id="x-pho">7.4</output><input id="x-ph" type="range" min="0" max="14" step="0.1" value="7.4"></label></div><div id="x-out" role="status" aria-live="polite"></div>';
    var f = function () {
      var r = R[parseInt($("x-res").value, 10)], ph = parseFloat($("x-ph").value), g = chem.groupsOf(r); $("x-pho").textContent = ph;
      var net = chem.netCharge(g, ph), pi = chem.pI(g);
      var rows = g.map(function (x) { return "<tr><td>" + SS.esc(x.name) + "</td><td>" + x.pKa + "</td><td>" + SS.fmt(100 * chem.fracIonized(x, ph), 1) + "%</td><td>" + SS.fmt(chem.groupCharge(x, ph), 2) + "</td></tr>"; }).join("");
      var steps = "";
      for (var p = 1; p <= 13; p += 2) steps += "<tr><td>" + p + "</td><td>" + SS.fmt(chem.netCharge(g, p), 2) + "</td></tr>";
      $("x-out").innerHTML = '<p>Net charge at pH ' + ph + ': <span class="pct">' + SS.fmt(net, 2) + "</span> &nbsp; pI = " + SS.fmt(pi, 2) + '</p><div class="tablewrap"><table class="work"><thead><tr><th>Group</th><th>pKa</th><th>Charged form</th><th>Charge</th></tr></thead><tbody>' + rows +
        '</tbody></table></div><details><summary>Net charge at odd pH values</summary><div class="tablewrap"><table class="work"><thead><tr><th>pH</th><th>Net charge</th></tr></thead><tbody>' + steps + "</tbody></table></div></details>";
    };
    $("x-res").addEventListener("change", f); $("x-ph").addEventListener("input", f); f();
  }

  function show() {
    var m = $("modes");
    m.querySelectorAll("button").forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-mode") === mode)); });
    $("hidewrap").style.display = mode === "state" ? "" : "none";
    $("scorewrap").style.display = (mode === "state" || mode === "peptide") ? "" : "none";
    if (mode === "state") stateQ(); else if (mode === "peptide") peptideQ(); else if (mode === "hh") hhView(); else exploreView();
  }
  $("modes").innerHTML = Object.keys(MODES).map(function (k) { return '<button type="button" data-mode="' + k + '" aria-pressed="false">' + MODES[k] + "</button>"; }).join("");
  $("modes").addEventListener("click", function (e) { var b = e.target.closest("button[data-mode]"); if (b) { mode = b.getAttribute("data-mode"); show(); } });
  $("stage").addEventListener("click", function (e) { var b = e.target.closest("button[data-a]"); if (b && cur && !cur.done) { cur.done = true; stateAnswer(b.getAttribute("data-a")); } });
  $("hidepka").addEventListener("change", function () { if (mode === "state") stateQ(); });
  SS.initEmbedBox("pka-trainer");
  setScore(); show();
})();

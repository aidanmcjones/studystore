/* MCAT percentile lookup. Data: inline JSON #pct-data (data/aamc_percentiles_2026.json, AAMC published table). */
(function () {
  "use strict";
  var SS = window.SS, D = SS.data("pct-data"), $ = function (id) { return document.getElementById(id); };
  var SECS = [["chem_phys", "Chem/Phys"], ["cars", "CARS"], ["bio_biochem", "Bio/Biochem"], ["psych_soc", "Psych/Soc"]];
  function num(v) { return v === "<1" ? 0 : +v; }
  function pctText(v) { return v === "<1" ? "below 1" : String(v); }
  function ord(n) { var s = ["th", "st", "nd", "rd"], v = n % 100; return n + (s[(v - 20) % 10] || s[v] || s[0]); }

  function expired() { var t = new Date().toISOString().slice(0, 10); return t > D.valid_to; }
  if (expired()) $("expired").hidden = false;

  function totalView() {
    var v = parseInt($("t-score").value, 10), o = $("t-out");
    if (isNaN(v) || v < 472 || v > 528) { o.innerHTML = '<p class="meta">Enter a total score from 472 to 528.</p>'; return; }
    var p = D.total[String(v)];
    o.innerHTML = '<p><span class="pct">' + (p === "<1" ? "&lt;1" : p) + '</span> percentile rank</p><div class="bar" aria-hidden="true"><i style="width:' + num(p) + '%"></i></div><p>A total of ' + v + " means " + (p === "<1" ? "fewer than 1 percent" : p + " percent") + " of test takers in the 2023 to 2025 reference group scored at or below you.</p>";
  }
  function targetView() {
    var t = parseFloat($("g-pct").value), o = $("g-out");
    if (isNaN(t) || t < 1 || t > 99) { o.innerHTML = '<p class="meta">Enter a target percentile from 1 to 99.</p>'; return; }
    var best = null;
    for (var s = 472; s <= 528; s++) { if (num(D.total[s]) >= t) { best = s; break; } }
    var q = Math.floor(best / 4), rem = best - q * 4, parts = [];
    for (var i = 0; i < 4; i++) parts.push(q + (i < rem ? 1 : 0));
    parts.sort(function (a, b) { return b - a; });
    o.innerHTML = '<p>The lowest total score at or above the ' + ord(t) + ' percentile is <span class="pct">' + best + "</span> (percentile rank " + D.total[best] + ").</p><p>That total is the sum of four section scores, so one balanced way to reach it is " + parts.join(", ") + " (each section ranges from 118 to 132).</p>" +
      '<p class="meta">Percentile ranks are not evenly spaced across scores, so a one-point gain is worth more percentile points near the middle of the range than at the extremes.</p>';
  }
  function sectionsView() {
    var o = $("s-out"), tot = 0, rows = "", ok = true;
    SECS.forEach(function (s) {
      var v = parseInt($("s-" + s[0]).value, 10);
      if (isNaN(v) || v < 118 || v > 132) { ok = false; return; }
      tot += v; rows += "<tr><td>" + s[1] + "</td><td>" + v + "</td><td>" + D.sections[s[0]].scores[v] + "</td></tr>";
    });
    if (!ok) { o.innerHTML = '<p class="meta">Enter all four section scores (118 to 132).</p>'; return; }
    var p = D.total[tot];
    o.innerHTML = '<div class="tablewrap"><table><thead><tr><th>Section</th><th>Score</th><th>Percentile rank</th></tr></thead><tbody>' + rows + "<tr><th>Total</th><th>" + tot + "</th><th>" + pctText(p) + "</th></tr></tbody></table></div>" +
      "<p class=meta>The total is the sum of the four section scores. Section percentiles come from separate AAMC tables.</p>";
  }
  ["t-score"].forEach(function (id) { $(id).addEventListener("input", totalView); });
  $("g-pct").addEventListener("input", targetView);
  SECS.forEach(function (s) { $("s-" + s[0]).addEventListener("input", sectionsView); });
  // full table
  var rows = ""; for (var s = 528; s >= 472; s--) rows += "<tr><td>" + s + "</td><td>" + pctText(D.total[s]) + "</td></tr>";
  $("full-table").innerHTML = rows;
  SS.initEmbedBox("mcat-percentile");
  totalView(); targetView(); sectionsView();
})();

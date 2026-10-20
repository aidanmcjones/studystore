/* Amino acid quiz. Data: inline JSON #aa-data (data/amino_acids.json). Scores stay in this browser only. */
(function () {
  "use strict";
  var SS = window.SS, chem = SS.chem;
  var R = SS.data("aa-data").residues;
  var CLASSES = ["nonpolar", "aromatic", "polar", "acidic", "basic"];
  var CLASS_LABEL = { nonpolar: "Nonpolar (aliphatic)", aromatic: "Aromatic", polar: "Polar, uncharged", acidic: "Acidic (negative side chain)", basic: "Basic (positive side chain)" };
  var MODES = { mixed: "Mixed", code: "Code to name", name2code: "Name to code", structure: "Structure to name", cls: "Side-chain class", charge: "Charge at pH", pi: "pI estimate" };
  var ROUND = 10;
  var st = { mode: "mixed", n: 0, score: 0, q: null, answered: false, stats: {}, retry: [], recent: [], history: [] };

  var $ = function (id) { return document.getElementById(id); };

  function stat(i) { return st.stats[i] || (st.stats[i] = { wrong: 0, streak: 0 }); }
  function pickResidue(mode) {
    // spaced repetition inside the session: missed items return after 3 questions, weights favor weak items
    for (var k = 0; k < st.retry.length; k++) {
      if (st.retry[k].due <= st.n) { var it = st.retry.splice(k, 1)[0]; return it.i; }
    }
    var w = R.map(function (_, i) {
      var s = stat(i), x = 1 + 2 * s.wrong - 0.5 * s.streak;
      if (st.recent.indexOf(i) >= 0) x = 0.05;
      return Math.max(0.15, x);
    });
    var tot = w.reduce(function (a, b) { return a + b; }, 0), r = Math.random() * tot;
    for (var i = 0; i < w.length; i++) { r -= w[i]; if (r <= 0) return i; }
    return w.length - 1;
  }
  function distractors(i, n, same) {
    var pool = R.map(function (_, j) { return j; }).filter(function (j) { return j !== i; });
    if (same) { var sc = pool.filter(function (j) { return R[j].class === R[i].class; }); if (sc.length >= n) pool = sc; }
    return SS.shuffle(pool).slice(0, n);
  }
  function withAnswer(correct, wrongs, extra) {
    var opts = SS.shuffle([correct].concat(wrongs));
    var q = { options: opts, answer: opts.indexOf(correct) };
    for (var k in extra) q[k] = extra[k];
    return q;
  }
  function structFacts(r) {
    var g = chem.groupsOf(r);
    return g.map(function (x) { return x.name + " pKa " + x.pKa; }).join("; ");
  }

  function build(mode, i) {
    var r = R[i], q;
    if (mode === "code") {
      var one = Math.random() < 0.5, c = one ? r.code1 : r.code3;
      var ds = distractors(i, 3, false).map(function (j) { return R[j].name; });
      q = withAnswer(r.name, ds, { prompt: "Which amino acid has the " + (one ? "one-letter" : "three-letter") + " code <b>" + c + "</b>?" });
      q.explain = r.name + " is " + r.code3 + " / " + r.code1 + ".";
    } else if (mode === "name2code") {
      var ds2 = distractors(i, 3, false).map(function (j) { return R[j].code3 + " / " + R[j].code1; });
      q = withAnswer(r.code3 + " / " + r.code1, ds2, { prompt: "What are the three- and one-letter codes for <b>" + r.name + "</b>?" });
      q.explain = r.name + " is " + r.code3 + " / " + r.code1 + ".";
    } else if (mode === "structure") {
      var ds3 = distractors(i, 3, true).map(function (j) { return R[j].name; });
      q = withAnswer(r.name, ds3, { prompt: "Name this amino acid (drawn as a zwitterion at physiological pH).", figure: SS.structSVG(r) });
      q.explain = "This is " + r.name + " (" + r.code3 + ", " + r.code1 + "), class: " + CLASS_LABEL[r.class] + ".";
    } else if (mode === "cls") {
      q = withAnswer(CLASS_LABEL[r.class], CLASSES.filter(function (c) { return c !== r.class; }).map(function (c) { return CLASS_LABEL[c]; }),
        { prompt: "Which class is <b>" + r.name + "</b> (" + r.code3 + ")?", figure: "" });
      q.options = CLASSES.map(function (c) { return CLASS_LABEL[c]; }); q.answer = CLASSES.indexOf(r.class);
      q.explain = r.name + " is " + CLASS_LABEL[r.class].toLowerCase() + " in the five-group scheme used here. Textbooks differ for Tyr, His, Cys, and Gly, so follow your course's scheme.";
    } else if (mode === "charge") {
      var g = chem.groupsOf(r), pHs = [1, 2, 4, 5, 6, 7.4, 8, 9, 10, 11, 12, 13, 14], pH, net, tries = 0;
      do { pH = pHs[SS.rand(pHs.length)]; net = chem.netCharge(g, pH); tries++; } while (Math.abs(net - Math.round(net)) > 0.3 && tries < 60);
      var ans = Math.round(net), labels = ["-2", "-1", "0", "+1", "+2"];
      q = { prompt: "What is the approximate net charge of free <b>" + r.name + "</b> at pH <b>" + pH + "</b>?", options: labels, answer: ans + 2 };
      q.explain = "Computed net charge " + SS.fmt(net, 2) + " (rounds to " + chem.sign(ans) + "). " + g.map(function (x) {
        var f = chem.groupCharge(x, pH); return x.name + " (pKa " + x.pKa + "): " + SS.fmt(f, 2);
      }).join("; ") + ".";
    } else { // pi
      var gp = chem.groupsOf(r), pi = chem.pI(gp), vals = [pi], guard = 0, cand;
      while (vals.length < 4 && guard++ < 200) {
        cand = pi + (Math.random() < 0.5 ? -1 : 1) * (0.9 + Math.random() * 3);
        if (cand > 0.5 && cand < 13.5 && vals.every(function (v) { return Math.abs(v - cand) >= 0.8; })) vals.push(cand);
      }
      var s2 = vals.map(function (v) { return SS.fmt(v, 1); });
      var correct = SS.fmt(pi, 1);
      var srt = gp.map(function (x) { return x.pKa; }).sort(function (a, b) { return a - b; });
      var pair = r.side_type === "acid" ? [srt[0], srt[1]] : r.side_type === "base" ? [srt[1], srt[2]] : [srt[0], srt[1]];
      q = withAnswer(correct, s2.filter(function (v) { return v !== correct; }).slice(0, 3), { prompt: "Estimate the isoelectric point (pI) of <b>" + r.name + "</b>." });
      q.explain = "pI = pH where the net charge is zero = " + correct + ". Shortcut: average the two pKa values on either side of the neutral form: (" + pair[0] + " + " + pair[1] + ") / 2 = " + SS.fmt((pair[0] + pair[1]) / 2, 2) + ". Groups: " + structFacts(r) + ". Tables that use slightly different pKa values give pI values that differ by a few tenths.";
    }
    q.mode = mode; q.i = i; q.figure = q.figure || "";
    return q;
  }

  function nextQ() {
    var mode = st.mode === "mixed" ? ["code", "name2code", "structure", "cls", "charge", "pi"][SS.rand(6)] : st.mode;
    var i = pickResidue(mode);
    st.recent.push(i); if (st.recent.length > 4) st.recent.shift();
    st.q = build(mode, i); st.answered = false; render();
  }

  function render() {
    var q = st.q, box = $("qbox");
    var html = '<p class="progress"><span>Question ' + (st.n + 1) + " of " + ROUND + "</span><span>Score " + st.score + "</span></p>" +
      '<p class="qtext" id="qtext">' + q.prompt + "</p>" + (q.figure ? '<div class="structure">' + q.figure + "</div>" : "") +
      '<div class="opts" role="group" aria-labelledby="qtext">' +
      q.options.map(function (o, k) { return '<button type="button" data-k="' + k + '"><span class="sr">Option ' + (k + 1) + ": </span>" + SS.esc(o) + "</button>"; }).join("") +
      '</div><p class="fb" id="fb" role="status" aria-live="polite"></p><div id="nextrow"></div>';
    box.innerHTML = html;
    var first = box.querySelector("button"); if (first && document.activeElement && document.activeElement.id !== "mode-btn") { /* keep focus stable on mobile */ }
  }

  function answer(k) {
    if (st.answered) return; st.answered = true;
    var q = st.q, ok = k === q.answer, s = stat(q.i);
    var btns = document.querySelectorAll("#qbox .opts button");
    btns.forEach(function (b, j) { b.disabled = true; if (j === q.answer) b.classList.add("right"); else if (j === k) b.classList.add("wrong"); });
    if (ok) { st.score++; s.streak++; } else { s.wrong++; s.streak = 0; st.retry.push({ i: q.i, due: st.n + 4 }); }
    st.history.push({ mode: q.mode, ok: ok });
    var fb = $("fb"); fb.className = "fb " + (ok ? "ok" : "no");
    fb.innerHTML = (ok ? "Correct. " : "Not quite. ") + '<span style="font-weight:400">' + q.explain + "</span>";
    var r = R[q.i];
    if (q.mode !== "structure") fb.insertAdjacentHTML("afterend", '<div class="structure" style="margin:10px 0">' + SS.structSVG(r) + "</div>");
    $("nextrow").innerHTML = '<button type="button" class="tbtn primary" id="next">' + (st.n + 1 >= ROUND ? "See result" : "Next question") + "</button>";
    $("next").focus();
    $("next").addEventListener("click", advance);
  }
  function advance() { st.n++; if (st.n >= ROUND) finish(); else nextQ(); }

  function finish() {
    var best = parseInt(SS.store("aa_best_" + st.mode) || "0", 10);
    if (st.score > best) SS.store("aa_best_" + st.mode, String(st.score));
    var text = "I scored " + st.score + "/" + ROUND + " on the free StudyStore Amino Acid Quiz (" + MODES[st.mode] + "). Try it: https://www.studystore.co/tools/amino-acid-quiz.html";
    $("qbox").innerHTML = '<div class="card-share" id="rcard"><h3>Amino Acid Quiz</h3><p style="font-size:2.2rem;font-family:Georgia,serif;font-weight:700;margin:0">' +
      st.score + " / " + ROUND + "</p><p>" + MODES[st.mode] + ' mode</p><p style="font-size:.85rem">studystore.co/tools/amino-acid-quiz.html</p></div>' +
      '<p class="meta">Your best in this mode on this device: ' + Math.max(best, st.score) + "/" + ROUND + ". Nothing is sent anywhere; scores live in this browser only.</p>" +
      '<p><button type="button" class="tbtn primary" id="again">Play another round</button> <button type="button" class="tbtn" id="share">Copy result text</button></p>';
    $("again").addEventListener("click", reset);
    $("share").addEventListener("click", function () { SS.copy(text, function () { $("share").textContent = "Copied"; }); });
  }
  function reset() { st.n = 0; st.score = 0; st.history = []; nextQ(); }

  function init() {
    var m = $("modes");
    m.innerHTML = Object.keys(MODES).map(function (k) { return '<button type="button" data-mode="' + k + '" aria-pressed="' + (k === st.mode) + '">' + MODES[k] + "</button>"; }).join("");
    m.addEventListener("click", function (e) {
      var b = e.target.closest("button[data-mode]"); if (!b) return;
      st.mode = b.getAttribute("data-mode");
      m.querySelectorAll("button").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
      reset();
    });
    $("qbox").addEventListener("click", function (e) { var b = e.target.closest(".opts button"); if (b) answer(parseInt(b.getAttribute("data-k"), 10)); });
    document.addEventListener("keydown", function (e) {
      if (e.target && /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
      var n = parseInt(e.key, 10);
      if (n >= 1 && n <= 5 && st.q && !st.answered && n <= st.q.options.length) answer(n - 1);
    });
    SS.initEmbedBox("amino-acid-quiz");
    nextQ();
  }
  init();
})();

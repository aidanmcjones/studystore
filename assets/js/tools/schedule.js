/* MCAT study schedule generator. Client-side only. Data: inline JSON #sched-data
   (catalog_public.json categories, live packs, free notes by category code, 2027 test dates). */
(function () {
  "use strict";
  var SS = window.SS, D = SS.data("sched-data"), $ = function (id) { return document.getElementById(id); };
  var SEC = { bio_biochem: "Bio/Biochem", chem_phys: "Chem/Phys", psych_soc: "Psych/Soc", cars: "CARS" };
  var MS = 86400000;

  function parse(s) { var p = s.split("-"); return Date.UTC(+p[0], +p[1] - 1, +p[2]); }
  function iso(t) { var d = new Date(t); return d.getUTCFullYear() + "-" + ("0" + (d.getUTCMonth() + 1)).slice(-2) + "-" + ("0" + d.getUTCDate()).slice(-2); }
  var MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  function nice(t) { var d = new Date(t); return MON[d.getUTCMonth()] + " " + d.getUTCDate(); }
  function nice2(t) { return nice(t) + ", " + new Date(t).getUTCFullYear(); }
  function todayIso() { var d = new Date(); return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2); }
  function r1(x) { return Math.round(x * 2) / 2; } // half-hour granularity

  var cats = D.categories.filter(function (c) { return c.section !== "cars"; });
  var carsCat = D.categories.filter(function (c) { return c.section === "cars"; })[0];

  function order(weak) {
    // interleave sections so each stretch of weeks mixes biology, chemistry and psychology
    var by = {}; cats.forEach(function (c) { (by[c.section] = by[c.section] || []).push(c); });
    var keys = ["bio_biochem", "chem_phys", "psych_soc"].sort(function (a, b) { return (weak[b] ? 1 : 0) - (weak[a] ? 1 : 0); });
    var out = [], more = true;
    for (var i = 0; more; i++) { more = false; keys.forEach(function (k) { if (by[k] && by[k][i]) { out.push(by[k][i]); more = true; } }); }
    return out;
  }

  function plan(inp) {
    var start = parse(inp.start), test = parse(inp.test);
    var days = Math.round((test - start) / MS);
    if (days < 1) return { error: "Choose a test date after your start date." };
    var n = Math.max(1, Math.ceil(days / 7)), H = inp.hours;
    var finalW = 1, r = n - 1, practiceW = r >= 3 ? Math.round(0.3 * r) : (r >= 2 ? 1 : 0), contentW = r - practiceW;
    var weeks = [];
    for (var i = 0; i < n; i++) {
      var ws = start + i * 7 * MS, we = Math.min(ws + 6 * MS, test);
      var phase = i < contentW ? "content" : (i < contentW + practiceW ? "practice" : "final");
      var cars = H * (inp.weak.cars ? 0.25 : 0.15), rest = H - cars;
      var split = phase === "content" ? [0.75, 0.25] : phase === "practice" ? [0.35, 0.65] : [0.3, 0.7];
      weeks.push({ n: i + 1, start: ws, end: we, phase: phase, hours: H, cars: r1(cars), content: r1(rest * split[0]), practice: r1(rest * split[1]), cats: [], review: [] });
    }
    var contentBudget = weeks.filter(function (w) { return w.phase === "content"; }).reduce(function (s, w) { return s + w.content; }, 0);
    var seq = order(inp.weak);
    var wt = seq.map(function (c) { return c.subtopic_count * (inp.weak[c.section] ? 1.5 : 1); });
    var wsum = wt.reduce(function (a, b) { return a + b; }, 0);
    var need = seq.map(function (c, i) { return contentBudget * wt[i] / wsum; });
    var wi = 0, cap = weeks.length ? weeks[0].content : 0;
    var contentWeeks = weeks.filter(function (w) { return w.phase === "content"; });
    var ci = 0; cap = contentWeeks.length ? contentWeeks[0].content : 0;
    seq.forEach(function (c, i) {
      var left = need[i];
      while (left > 0.01 && ci < contentWeeks.length) {
        var take = Math.min(left, cap);
        if (take > 0.01) contentWeeks[ci].cats.push({ c: c, h: take, part: left > cap + 0.01 || (contentWeeks[ci].cats.some(function (x) { return x.c === c; })) });
        left -= take; cap -= take;
        if (cap <= 0.01) { ci++; cap = ci < contentWeeks.length ? contentWeeks[ci].content : 0; }
      }
    });
    // fold slivers (under 0.75 h) into the largest other block of the same week so the plan stays readable
    contentWeeks.forEach(function (w) {
      if (w.cats.length < 2) return;
      var big = w.cats.slice().sort(function (a, b) { return b.h - a.h; })[0];
      w.cats = w.cats.filter(function (x) { if (x !== big && x.h < 0.75) { big.h += x.h; return false; } return true; });
    });
    // practice and final weeks: targeted review of the heaviest categories in weak sections, then the rest by weight
    var ranked = seq.map(function (c, i) { return { c: c, w: wt[i] }; }).sort(function (a, b) { return b.w - a.w; });
    var rv = 0;
    weeks.forEach(function (w) {
      if (w.phase === "content") return;
      var k = w.phase === "practice" ? 3 : 2;
      for (var j = 0; j < k; j++) w.review.push(ranked[(rv++) % ranked.length].c);
    });
    var avg = contentBudget / seq.length;
    return { weeks: weeks, days: days, n: n, contentBudget: contentBudget, avgPerCat: avg, total: H * n, seq: seq };
  }

  function linksFor(c) {
    var out = [], notes = D.notes[c.aamc] || [], pack = D.packs[c.aamc];
    if (notes.length) out.push("Free notes: " + notes.map(function (x) { return '<a href="../notes/' + x.slug + '.html">' + SS.esc(x.title) + "</a>"; }).join("; "));
    if (pack) out.push('StudyStore pack: <a href="../' + pack.href + '" data-track="cta">' + SS.esc(pack.title) + "</a> (" + SS.esc(pack.price) + (pack.buyable ? "" : ", available soon") + ")");
    return out;
  }

  function render(p, inp) {
    var o = $("result");
    if (p.error) { o.innerHTML = '<p class="warn" role="alert">' + p.error + "</p>"; return; }
    var weakList = Object.keys(inp.weak).filter(function (k) { return inp.weak[k]; }).map(function (k) { return SEC[k]; });
    var h = '<div class="panel"><h2>Your plan: ' + p.n + " week" + (p.n > 1 ? "s" : "") + " to " + nice2(parse(inp.test)) + "</h2><p>" + inp.hours + " hours a week, about " + Math.round(p.total) + " hours in total." +
      (weakList.length ? " Extra weight on: " + weakList.join(", ") + "." : "") + "</p>";
    if (p.n < 4) h += '<p class="warn">That is a short runway. The plan below compresses to the highest-value work; consider a later test date if you are starting content review from scratch.</p>';
    else if (p.avgPerCat < 3 && p.contentBudget > 0) h += '<p class="warn">About ' + SS.fmt(p.avgPerCat, 1) + " hours of content review per topic area is thin for a first pass. More weekly hours or a later date would help; the plan weights larger and weaker areas first.</p>";
    h += '<p class="noprint"><button class="tbtn primary" id="ics" type="button">Download calendar (.ics)</button> <button class="tbtn" id="print" type="button">Print or save as PDF</button></p>' +
      '<p class="meta noprint">Print opens your browser print dialog, where you can choose "Save as PDF". Nothing leaves your device.</p></div>';
    h += '<div class="weeks">';
    p.weeks.forEach(function (w) {
      var ph = { content: "Content review", practice: "Practice and targeted review", final: "Final stretch" }[w.phase];
      h += '<article class="week"><div class="ph">' + ph + "</div><h3>Week " + w.n + ": " + nice(w.start) + (w.end > w.start ? " to " + nice(w.end) : "") + '<span class="pill">' + w.hours + " h</span></h3><ul>";
      if (w.phase === "content") {
        w.cats.forEach(function (x) {
          h += "<li><strong>" + SS.esc(x.c.aamc) + " " + SS.esc(x.c.title) + "</strong> <span class=pill>" + SS.fmt(x.h, 1) + " h</span> <span class=pill>" + SEC[x.c.section] + "</span>";
          var l = linksFor(x.c); if (l.length) h += '<br><span class="meta">' + l.join("<br>") + "</span>";
          h += "</li>";
        });
        if (!w.cats.length) h += "<li>Content review is complete. Use this time for extra practice.</li>";
        h += "<li>Practice: " + SS.fmt(w.practice, 1) + " h of timed passages on topics already covered. Review every miss and note why.</li>";
      } else {
        h += "<li>Targeted review: " + SS.fmt(w.content, 1) + " h re-drilling " + w.review.map(function (c) { return SS.esc(c.aamc) + " " + SS.esc(c.title); }).join("; ") + "</li>";
        w.review.forEach(function (c) { var l = linksFor(c); if (l.length) h += '<li class="meta">' + SS.esc(c.aamc) + ": " + l.join(" | ") + "</li>"; });
        h += "<li>Practice: " + SS.fmt(w.practice, 1) + " h. " + (w.phase === "practice" ? (w.hours >= 12 ? "Include one full-length practice exam (about 7.5 hours with breaks) and review it the next day." : "Do section-length blocks; a full-length exam needs a long free day.") : "One last full-length early in the week if you have not done one in 10 days, then lighter sets. No new content in the final two days; sleep and logistics.") + "</li>";
      }
      h += "<li>CARS: " + SS.fmt(w.cars, 1) + " h, a few passages most days (steady beats cramming).</li></ul></article>";
    });
    h += "</div>";
    var live = Object.keys(D.packs);
    h += '<p class="meta">Honest note about packs: StudyStore currently offers a pack for ' + live.map(function (k) { return k + " (" + D.packs[k].title + ")"; }).join(", ") +
      ". Other topic areas are still in development, so this plan does not recommend them yet. It makes no promise about your score.</p>";
    o.innerHTML = h; o.scrollIntoView && o.scrollIntoView({ behavior: "smooth", block: "start" });
    $("ics").addEventListener("click", function () { download(p, inp); });
    $("print").addEventListener("click", function () { window.print(); });
  }

  function esc(s) { return s.replace(/\\/g, "\\\\").replace(/;/g, "\;").replace(/,/g, "\\,").replace(/\n/g, "\\n"); }
  function dt(t) { return iso(t).replace(/-/g, ""); }
  function download(p, inp) {
    var L = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//StudyStore//MCAT Study Schedule//EN", "CALSCALE:GREGORIAN"];
    var stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+/, "");
    p.weeks.forEach(function (w) {
      var focus = w.phase === "content" ? w.cats.map(function (x) { return x.c.aamc; }).filter(function (v, i, a) { return a.indexOf(v) === i; }).join(", ") : (w.phase === "practice" ? "practice and targeted review" : "final stretch");
      var desc = (w.phase === "content" ? w.cats.map(function (x) { return x.c.aamc + " " + x.c.title + " (" + SS.fmt(x.h, 1) + " h)"; }) : w.review.map(function (c) { return "Review " + c.aamc + " " + c.title; })).concat(["Practice " + SS.fmt(w.practice, 1) + " h", "CARS " + SS.fmt(w.cars, 1) + " h"]).join("\n");
      L.push("BEGIN:VEVENT", "UID:week" + w.n + "-" + inp.start + "-" + inp.test + "@studystore.co", "DTSTAMP:" + stamp, "DTSTART;VALUE=DATE:" + dt(w.start), "DTEND;VALUE=DATE:" + dt(w.end + MS),
        "SUMMARY:" + esc("MCAT week " + w.n + ": " + focus), "DESCRIPTION:" + esc(desc + "\nPlan from studystore.co/tools/mcat-study-schedule.html"), "END:VEVENT");
    });
    L.push("BEGIN:VEVENT", "UID:test-" + inp.test + "@studystore.co", "DTSTAMP:" + stamp, "DTSTART;VALUE=DATE:" + dt(parse(inp.test)), "DTEND;VALUE=DATE:" + dt(parse(inp.test) + MS), "SUMMARY:MCAT test day", "END:VEVENT", "END:VCALENDAR");
    var blob = new Blob([L.join("\r\n") + "\r\n"], { type: "text/calendar" }), a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = "mcat-study-plan.ics"; document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }

  function init() {
    var sel = $("f-test"), t0 = parse(todayIso());
    D.dates.forEach(function (d) { if (parse(d) > t0 + 7 * MS) { var o = document.createElement("option"); o.value = d; o.textContent = nice2(parse(d)); sel.appendChild(o); } });
    $("f-start").value = todayIso(); $("f-start").min = todayIso();
    try { var s = JSON.parse(SS.store("sched") || "{}"); if (s.hours) $("f-hours").value = s.hours; if (s.test && sel.querySelector('option[value="' + s.test + '"]')) sel.value = s.test;
      (s.weak || []).forEach(function (k) { var c = $("w-" + k); if (c) c.checked = true; }); } catch (e) {}
    $("sf").addEventListener("submit", function (e) {
      e.preventDefault();
      var inp = { start: $("f-start").value, test: sel.value, hours: Math.max(3, Math.min(80, parseFloat($("f-hours").value) || 20)), weak: {} };
      ["bio_biochem", "chem_phys", "psych_soc", "cars"].forEach(function (k) { inp.weak[k] = $("w-" + k).checked; });
      SS.store("sched", JSON.stringify({ hours: inp.hours, test: inp.test, weak: Object.keys(inp.weak).filter(function (k) { return inp.weak[k]; }) }));
      if (!inp.test) { $("result").innerHTML = '<p class="warn" role="alert">Pick a test date.</p>'; return; }
      render(plan(inp), inp);
    });
    window.__sched = { plan: plan, parse: parse };
  }
  init();
})();

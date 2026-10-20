/* StudyStore site motion and interaction. No dependencies; Lenis is loaded lazily on desktop.
 * Everything degrades: no JS shows all content, reduced motion shows final states. */
(function () {
  "use strict";
  var D = document, H = D.documentElement, W = window;
  var RM = W.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var FINE = W.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var LOWPOWER = (navigator.hardwareConcurrency || 4) <= 2 || (navigator.connection && navigator.connection.saveData);
  var $ = function (s, r) { return (r || D).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || D).querySelectorAll(s)); };
  var clamp = function (x, a, b) { return x < a ? a : x > b ? b : x; };
  var lerp = function (a, b, t) { return a + (b - a) * t; };
  var smooth = function (a, b, x) { var t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
  var vh = W.innerHeight, vw = W.innerWidth;
  var scenes = [];  // section scroll scenes, driven by update() like the kinetics plot

  /* ---------- one section scene per visit ----------
   * The page carries a scene for each MCAT section (data-pickscene). Show ONE at random and never
   * the same one as the previous visit; the others leave the DOM before any scene initialises. */
  (function pickScene() {
    var all = $$("[data-pickscene]"); if (all.length < 2) return;
    var last = ""; try { last = W.localStorage.getItem("ss_scene") || ""; } catch (e) {}
    var pool = all.filter(function (s) { return s.id !== last; });
    if (!pool.length) pool = all;
    var pick = pool[Math.floor(Math.random() * pool.length)];
    all.forEach(function (s) { if (s !== pick) s.parentNode.removeChild(s); });
    try { W.localStorage.setItem("ss_scene", pick.id); } catch (e) {}
    var cue = $(".scrollcue"); if (cue) cue.setAttribute("href", "#" + pick.id);
  })();
  // continuous step position for a pinned scene: which step block crosses the reference line, and how far
  function stepPos(steps, narrow) {
    var L = vh * (narrow ? 0.78 : 0.55), s = 0;
    for (var j = 0; j < steps.length; j++) {
      var r = steps[j].getBoundingClientRect();
      if (r.top <= L) s = j + clamp((L - r.top) / Math.max(1, r.height), 0, 1) * (j === steps.length - 1 ? 1 : 0.999);
    }
    return s;
  }
  W.addEventListener("resize", function () { vh = W.innerHeight; vw = W.innerWidth; resizeAll(); }, { passive: true });

  /* ---------- theme ---------- */
  var tbtn = $(".themetoggle");
  function isDark() {
    var t = H.getAttribute("data-theme");
    return t ? t === "dark" : W.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  if (tbtn) {
    tbtn.setAttribute("aria-pressed", String(isDark()));
    tbtn.addEventListener("click", function () {
      var next = isDark() ? "light" : "dark";
      H.setAttribute("data-theme", next);
      try { localStorage.setItem("ss-theme", next); } catch (e) {}
      tbtn.setAttribute("aria-pressed", String(next === "dark"));
      if (helix) helix.palette();
    });
  }

  /* ---------- wait for experiments to settle, then split text ---------- */
  function whenExpReady(fn) {
    if (!H.classList.contains("exp-wait")) return fn();
    var done = false, go = function () { if (!done) { done = true; mo.disconnect(); fn(); } };
    var mo = new MutationObserver(function () { if (!H.classList.contains("exp-wait")) go(); });
    mo.observe(H, { attributes: true, attributeFilter: ["class"] });
    setTimeout(go, 1600);
  }
  function splitWords(el) {
    if (el.getAttribute("data-split")) return;
    el.setAttribute("data-split", "1");
    var text = el.textContent.replace(/\s+/g, " ").trim();
    el.setAttribute("aria-label", text);
    var i = 0, out = [];
    text.split(" ").forEach(function (w) {
      out.push('<span class="w" aria-hidden="true"><span style="--i:' + (i++) + '">' + w.replace(/&/g, "&amp;").replace(/</g, "&lt;") + "</span></span>");
    });
    el.innerHTML = out.join(" ");
  }
  function longPrice() {
    $$('[data-exp="price_frame"]').forEach(function (el) { el.classList.toggle("long", el.textContent.trim().length > 5); });
  }

  /* ---------- reveals ---------- */
  var io = "IntersectionObserver" in W ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { rootMargin: "0px 0px -12% 0px", threshold: 0.05 }) : null;
  var cssScroll = W.CSS && CSS.supports && CSS.supports("animation-timeline: view()");
  function observeReveals() {
    $$(".reveal").forEach(function (el) {
      if (RM || !io) { el.classList.add("in"); return; }
      if (cssScroll && !el.closest(".hero")) el.classList.add("cssd"); else io.observe(el);
    });
    $$(".split").forEach(function (el) {
      if (!el.hasAttribute("data-exp")) splitWords(el);
    });
    $$(".titrfig").forEach(function (el) { if (RM || !io) el.classList.add("in"); else io.observe(el); });
    whenExpReady(function () {
      longPrice();
      $$(".split[data-exp]").forEach(splitWords);
      $$(".split").forEach(function (el) {
        if (RM || !io) el.classList.add("in"); else io.observe(el);
      });
      $$('.exp-ready-hide').forEach(function (el) { el.classList.remove("exp-ready-hide"); });
    });
  }

  /* ---------- Lenis smooth scroll (desktop, motion OK) ---------- */
  var lenis = null;
  function loadLenis() {
    if (RM || !FINE || LOWPOWER) return;
    var s = D.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.min.js";
    s.async = true;
    s.onload = function () {
      try {
        lenis = new W.Lenis({ lerp: 0.11, wheelMultiplier: 1, smoothWheel: true });
        H.classList.add("lenis");
        lenis.on("scroll", onScroll);
        var raf = function (t) { lenis.raf(t); requestAnimationFrame(raf); };
        requestAnimationFrame(raf);
      } catch (e) { lenis = null; }
    };
    D.head.appendChild(s);
  }
  D.addEventListener("click", function (ev) {
    var a = ev.target.closest && ev.target.closest('a[href*="#"]');
    if (!a || !lenis) return;
    var u = new URL(a.href, location.href);
    if (u.pathname !== location.pathname || !u.hash) return;
    var t = D.getElementById(decodeURIComponent(u.hash.slice(1)));
    if (!t) return;
    ev.preventDefault();
    lenis.scrollTo(t, { offset: -76, duration: 1.2 });
    history.pushState(null, "", u.hash);
  });

  /* ---------- scroll-driven state ---------- */
  var phbar = $(".phbar i"), phread = $(".phread b"), phdot = $(".phread");
  var heroEl = $("section.hero"), lastY = W.scrollY, vel = 0, ticking = false;
  function indicator(ph) {
    // bromothymol blue: yellow below 6.0, green at 7, blue above 7.6
    var stops = [[1, [242, 183, 5]], [6, [214, 196, 30]], [7, [63, 174, 90]], [7.6, [31, 143, 138]], [14, [28, 91, 208]]];
    for (var i = 1; i < stops.length; i++) if (ph <= stops[i][0]) {
      var a = stops[i - 1], b = stops[i], t = (ph - a[0]) / (b[0] - a[0]);
      return "rgb(" + [0, 1, 2].map(function (k) { return Math.round(lerp(a[1][k], b[1][k], t)); }).join(",") + ")";
    }
    return "rgb(28,91,208)";
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
  function update() {
    ticking = false;
    var y = W.scrollY, max = Math.max(1, D.documentElement.scrollHeight - vh);
    vel = lerp(vel, y - lastY, 0.3); lastY = y;
    var p = clamp(y / max, 0, 1), ph = 1 + p * 13;
    if (phbar) phbar.style.setProperty("--p", p.toFixed(4));
    if (phread) { phread.textContent = ph.toFixed(1); H.style.setProperty("--ph", indicator(ph)); }
    if (heroEl) {
      var d = clamp(y / (heroEl.offsetHeight * 0.85), 0, 1);
      if (helix) helix.denature(d);
      heroEl.classList.toggle("denat", d > 0.55);
    }
    if (kin) kin.scroll();
    for (var si = 0; si < scenes.length; si++) scenes[si].scroll();
    if (pack) pack.scroll();
  }
  W.addEventListener("scroll", function () { if (!lenis) onScroll(); }, { passive: true });

  /* ---------- cursor: grid spotlight + magnetic buttons ---------- */
  if (FINE && !RM) {
    var grid = $(".gridbg"), mx = 0, my = 0, mt = false;
    W.addEventListener("pointermove", function (e) {
      mx = e.clientX; my = e.clientY;
      if (!mt) { mt = true; requestAnimationFrame(function () { mt = false; if (grid) { grid.style.setProperty("--mx", mx + "px"); grid.style.setProperty("--my", my + "px"); } if (helix) helix.pointer(mx / vw, my / vh); }); }
    }, { passive: true });
    $$(".magnetic, .btn").forEach(function (b) {
      b.addEventListener("pointermove", function (e) {
        var r = b.getBoundingClientRect();
        b.style.setProperty("--bx", ((e.clientX - r.left - r.width / 2) * 0.22).toFixed(1) + "px");
        b.style.setProperty("--by", ((e.clientY - r.top - r.height / 2) * 0.32).toFixed(1) + "px");
      });
      b.addEventListener("pointerleave", function () { b.style.setProperty("--bx", "0px"); b.style.setProperty("--by", "0px"); });
    });
  }

  /* ---------- Anki card demo ---------- */
  (function anki() {
    var box = $("[data-anki]"); if (!box) return;
    var cards = $$(".ankicard", box), tag = $(".ankitag", box);
    if (box.hasAttribute("data-pick")) {
      // one random card per MCAT section, in random order; the rest leave the DOM
      var bySec = {}, secs = [];
      cards.forEach(function (c) { var s = c.getAttribute("data-sec"); if (!bySec[s]) { bySec[s] = []; secs.push(s); } bySec[s].push(c); });
      var picked = secs.map(function (s) { var a = bySec[s]; return a[Math.floor(Math.random() * a.length)]; });
      for (var k = picked.length - 1; k > 0; k--) { var j = Math.floor(Math.random() * (k + 1)), t = picked[k]; picked[k] = picked[j]; picked[j] = t; }
      cards.forEach(function (c) { if (picked.indexOf(c) < 0) c.remove(); });
      picked.forEach(function (c) { c.parentNode.appendChild(c); });
      cards = picked;
    }
    var i = 0, flipBtn = $("[data-flip]", box), nextBtn = $("[data-next]", box), count = $(".ankicount", box);
    var auto = !RM, timer = null, hover = false, visible = true;
    function show(n) {
      cards.forEach(function (c, k) { c.classList.toggle("cur", k === n); c.classList.remove("flipped"); c.setAttribute("aria-hidden", k === n ? "false" : "true"); });
      i = n; count.textContent = (n + 1) + " / " + cards.length; flipBtn.textContent = "Show answer";
      if (tag && cards[n].getAttribute("data-tag")) tag.textContent = cards[n].getAttribute("data-tag");
    }
    function flip() {
      var c = cards[i], f = !c.classList.contains("flipped");
      c.classList.toggle("flipped", f); flipBtn.textContent = f ? "Show question" : "Show answer";
    }
    function next() { show((i + 1) % cards.length); }
    function tick() {
      if (!auto || hover || !visible || D.hidden) return;
      if (cards[i].classList.contains("flipped")) next(); else flip();
    }
    flipBtn.addEventListener("click", function () { auto = false; flip(); });
    nextBtn.addEventListener("click", function () { auto = false; next(); });
    cards.forEach(function (c) { c.addEventListener("click", function () { auto = false; flip(); }); });
    box.addEventListener("pointerenter", function () { hover = true; });
    box.addEventListener("pointerleave", function () { hover = false; box.style.setProperty("--rx", "0deg"); box.style.setProperty("--ry", "0deg"); });
    if (FINE && !RM) box.addEventListener("pointermove", function (e) {
      var r = box.getBoundingClientRect();
      box.style.setProperty("--ry", (((e.clientX - r.left) / r.width - 0.5) * 8).toFixed(2) + "deg");
      box.style.setProperty("--rx", (((e.clientY - r.top) / r.height - 0.5) * -8).toFixed(2) + "deg");
    });
    if (io) new IntersectionObserver(function (es) { visible = es[0].isIntersecting; }).observe(box);
    show(0);
    if (auto) timer = setInterval(tick, 3200);
  })();

  /* ---------- quiz bank: 3 questions per visit ----------
   * The home quiz carries every standalone sample question (data-pickq). Keep 3 from 3 different
   * sections, skipping ones this browser saw recently; the rest leave the DOM before quiz() runs. */
  (function pickQuiz() {
    var box = $("[data-pickq]"); if (!box) return;
    var want = +box.getAttribute("data-pickq") || 3, all = $$(".qitem", box);
    if (all.length <= want) return;
    var seen = []; try { seen = JSON.parse(W.localStorage.getItem("ss_qseen") || "[]"); } catch (e) {}
    var fresh = all.filter(function (q) { return seen.indexOf(q.getAttribute("data-qid")) < 0; });
    if (fresh.length < want) { seen = []; fresh = all; }
    var bySec = {}, secs = [];
    fresh.forEach(function (q) { var s = q.getAttribute("data-sec"); if (!bySec[s]) { bySec[s] = []; secs.push(s); } bySec[s].push(q); });
    var rnd = function (a) { return a[Math.floor(Math.random() * a.length)]; };
    for (var i = secs.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = secs[i]; secs[i] = secs[j]; secs[j] = t; }
    var picked = secs.slice(0, want).map(function (s) { return rnd(bySec[s]); });
    while (picked.length < want) { var q = rnd(fresh); if (picked.indexOf(q) < 0) picked.push(q); }
    all.forEach(function (q) { if (picked.indexOf(q) < 0) q.parentNode.removeChild(q); });
    var done = $(".qdone", box);
    picked.forEach(function (q, k) { q.classList.remove("qx"); var n = $(".qn", q); if (n) n.textContent = "Q" + (k + 1); box.insertBefore(q, done); });
    seen = seen.concat(picked.map(function (q) { return q.getAttribute("data-qid"); })).slice(-150);
    try { W.localStorage.setItem("ss_qseen", JSON.stringify(seen)); } catch (e) {}
  })();

  /* ---------- quiz ---------- */
  (function quiz() {
    var box = $("[data-quiz]"); if (!box) return;
    var items = $$(".qitem", box), bars = $$(".qprog i", box), score = $(".qscore", box), done = $(".qdone", box), right = 0, n = 0;
    function go(k) {
      items.forEach(function (it, j) { it.classList.toggle("cur", j === k); });
      bars.forEach(function (b, j) { if (j === k) b.classList.add("cur"); });
      if (k >= items.length) { done.classList.add("cur"); var f = $(".qfinal", done); f.textContent = "You got " + right + " of " + items.length + ". " + f.textContent; }
    }
    items.forEach(function (it, k) {
      var ans = it.getAttribute("data-answer");
      var btns = $$(".qopts button", it);
      btns.forEach(function (b) {
        b.addEventListener("click", function () {
          if (it.classList.contains("done")) return;
          it.classList.add("done"); n++;
          var ok = b.getAttribute("data-o") === ans; if (ok) right++;
          btns.forEach(function (x) { x.disabled = true; if (x.getAttribute("data-o") === ans) x.classList.add("right"); });
          if (!ok) b.classList.add("wrong");
          bars[k].classList.remove("cur"); bars[k].classList.add(ok ? "ok" : "no");
          score.textContent = right + " correct, " + n + " of " + items.length + " answered";
          var nx = D.createElement("button"); nx.type = "button"; nx.className = "btn small qnext";
          nx.textContent = k + 1 < items.length ? "Next question" : "See result";
          nx.addEventListener("click", function () { go(k + 1); var t = items[k + 1] || done; var f = t.querySelector("button, a"); if (f) f.focus({ preventScroll: true }); });
          it.appendChild(nx);
          nx.focus({ preventScroll: true });
        });
      });
    });
    go(0);
  })();

  /* ---------- FAQ height animation ---------- */
  if (!RM) $$(".faq details").forEach(function (d) {
    var s = $("summary", d), body = s.nextElementSibling; if (!body || !body.animate) return;
    s.addEventListener("click", function (e) {
      e.preventDefault();
      if (d.open) {
        var h = body.offsetHeight;
        body.animate([{ height: h + "px", opacity: 1 }, { height: "0px", opacity: 0 }], { duration: 320, easing: "cubic-bezier(.65,0,.35,1)" }).onfinish = function () { d.open = false; };
      } else {
        d.open = true; var h2 = body.offsetHeight;
        body.animate([{ height: "0px", opacity: 0 }, { height: h2 + "px", opacity: 1 }], { duration: 420, easing: "cubic-bezier(.16,1,.3,1)" });
      }
    });
  });

  /* ---------- cheat sheet loupe ---------- */
  (function loupe() {
    var f = $("[data-loupe]"); if (!f) return;
    var img = $("img", f), lens = $(".lens", f), Z = 2.4, loaded = false;
    function load() { if (!loaded) { loaded = true; lens.style.backgroundImage = "url(" + (img.currentSrc || img.src) + ")"; } }
    f.addEventListener("pointerenter", load);
    function place(cx, cy) {
      var r = img.getBoundingClientRect(), fr = f.getBoundingClientRect();
      var x = clamp(cx - r.left, 0, r.width), y = clamp(cy - r.top, 0, r.height);
      lens.style.left = (x + r.left - fr.left) + "px"; lens.style.top = (y + r.top - fr.top) + "px";
      lens.style.backgroundSize = (r.width * Z) + "px " + (r.height * Z) + "px";
      var lw = lens.offsetWidth / 2;
      lens.style.backgroundPosition = (-(x * Z - lw)) + "px " + (-(y * Z - lw)) + "px";
    }
    f.addEventListener("pointermove", function (e) { if (e.pointerType === "mouse") { f.classList.add("zoom"); place(e.clientX, e.clientY); } });
    f.addEventListener("pointerleave", function () { f.classList.remove("zoom"); });
    f.addEventListener("click", function (e) { load(); if (e.pointerType !== "mouse") { f.classList.toggle("zoom"); place(e.clientX, e.clientY); } });
  })();

  /* ---------- lightbox (product gallery) ---------- */
  (function lightbox() {
    var dlg = $("dialog.lightbox"); if (!dlg || !dlg.showModal) return;
    var im = $("img", dlg);
    $$("[data-zoom]").forEach(function (b) {
      b.addEventListener("click", function () { im.src = b.getAttribute("data-zoom"); im.alt = $("img", b).alt; dlg.showModal(); });
    });
    $("button", dlg).addEventListener("click", function () { dlg.close(); });
    dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });
  })();

  /* ---------- marquee (scroll velocity) ---------- */
  (function marquee() {
    var tr = $(".marquee .track"); if (!tr || RM) return;
    $$("span", tr).forEach(function (s) { var c = s.cloneNode(true); c.setAttribute("aria-hidden", "true"); tr.appendChild(c); });
    var x = 0, dir = -1, on = true;
    if (io) new IntersectionObserver(function (es) { on = es[0].isIntersecting; }).observe(tr);
    (function step() {
      if (on && !D.hidden) {
        if (Math.abs(vel) > 0.5) dir = vel > 0 ? -1 : 1;
        x += dir * (0.45 + Math.min(Math.abs(vel) * 0.25, 14));
        var half = tr.scrollWidth / 2;
        if (x <= -half) x += half; if (x > 0) x -= half;
        tr.style.transform = "translate3d(" + x.toFixed(1) + "px,0,0)";
        vel *= 0.94;
      }
      requestAnimationFrame(step);
    })();
  })();

  /* ---------- kinetics plot ---------- */
  var kin = (function () {
    var sec = $(".kinetics"); if (!sec) return null;
    var svg = $(".mmplot", sec), steps = $$(".kstep", sec), wrap = $(".ksteps", sec);
    var base = $(".curve.base", svg), inh = $(".curve.inh", svg), inhT = $(".inh-t", svg), cap = $(".kcap", sec);
    var vmaxL = $(".vmax-line", svg), vmaxT = $(".vmax-t", svg), kmV = $(".km-v", svg), kmH = $(".km-h", svg), kmT = $(".km-t", svg);
    var lbBase = $(".lbline.base", svg), lbInh = $(".lbline.inh", svg), lbG = $(".lb", svg);
    var X = function (s) { return 60 + s * 52; }, Y = function (v) { return 380 - v * 300; };
    function mm(K, V) {
      var d = "";
      for (var k = 0; k <= 90; k++) { var s = 10 * Math.pow(k / 90, 1.6), v = V * s / (K + s); d += (k ? "L" : "M") + X(s).toFixed(1) + " " + Y(v).toFixed(1); }
      return d;
    }
    // LB inset: origin x=80 is 1/[S]=0, 32 px per unit; y=150 is 1/v=0, 26 px per unit
    function lb(K, V) {
      var x0 = -1 / K, slope = K / V, ymax = 5.6, xend = Math.min(4.3, (ymax - 1 / V) / slope);
      var px = function (u) { return (80 + u * 32).toFixed(1); }, py = function (w) { return (150 - w * 26).toFixed(1); };
      return "M" + px(x0) + " " + py(0) + "L" + px(xend) + " " + py(slope * xend + 1 / V);
    }
    base.setAttribute("d", mm(1, 1)); lbBase.setAttribute("d", lb(1, 1));
    var len = base.getTotalLength ? base.getTotalLength() : 900;
    base.style.strokeDasharray = len;
    var caps = ["Fig. 1. No inhibitor.", "Fig. 1. Km is [S] at half of Vmax.", "Fig. 1. Competitive: Km up, Vmax same.", "Fig. 1. Noncompetitive: Vmax down, Km same.", "Fig. 1. Uncompetitive: both down, lines parallel."];
    var labels = ["", "", "Km app 2.5x", "Vmax halved", "Km and Vmax halved"];
    // inhibitor parameter keyframes along step position s (0..5)
    var keys = [[0, 1, 1], [2, 1, 1], [2.6, 2.5, 1], [3, 2.5, 1], [3.6, 1, 0.5], [4, 1, 0.5], [4.6, 0.5, 0.5], [5, 0.5, 0.5]];
    function params(s) {
      for (var j = 1; j < keys.length; j++) if (s <= keys[j][0]) {
        var a = keys[j - 1], b = keys[j], t = smooth(a[0], b[0], s);
        return [lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
      }
      return [0.5, 0.5];
    }
    var lastIdx = -1, narrow = false;
    function layout() {
      narrow = vw < 760;
      svg.setAttribute("viewBox", narrow ? "0 0 600 420" : "0 0 600 640");
      lbG.style.display = narrow ? "none" : "";
    }
    function draw(s) {
      var drawT = clamp(s / 0.85, 0, 1);
      base.style.strokeDashoffset = (len * (1 - drawT)).toFixed(1);
      var mk = smooth(0.9, 1.4, s);
      [vmaxL, vmaxT, kmV, kmH, kmT].forEach(function (el) { el.style.opacity = mk; });
      lbG.style.opacity = smooth(0.4, 1.2, s);
      var pr = params(s), K = pr[0], V = pr[1], io2 = smooth(1.9, 2.2, s);
      inh.setAttribute("d", mm(K, V)); inh.style.opacity = io2;
      lbInh.setAttribute("d", lb(K, V)); lbInh.style.opacity = io2;
      // apparent Km marker follows the inhibited curve once present
      var kmShow = io2 > 0.5 ? K : 1, vShow = io2 > 0.5 ? V : 1;
      kmV.setAttribute("d", "M" + X(kmShow).toFixed(1) + " 380V" + Y(vShow / 2).toFixed(1));
      kmH.setAttribute("d", "M60 " + Y(vShow / 2).toFixed(1) + "H" + X(kmShow).toFixed(1));
      kmT.setAttribute("x", X(kmShow).toFixed(1)); kmT.textContent = io2 > 0.5 && Math.abs(K - 1) > 0.05 ? "Km app" : "Km";
      vmaxL.setAttribute("d", "M60 " + Y(vShow).toFixed(1) + "H580"); vmaxT.setAttribute("y", (Y(vShow) - 8).toFixed(1));
      vmaxT.textContent = io2 > 0.5 && V < 0.95 ? "Vmax app" : "Vmax";
      var idx = clamp(Math.floor(s), 0, 4);
      inhT.setAttribute("y", (Y(V * 10 / (K + 10)) + 22).toFixed(1)); inhT.style.opacity = io2;
      if (idx !== lastIdx) {
        lastIdx = idx; cap.textContent = caps[idx]; inhT.textContent = labels[idx];
        steps.forEach(function (st, j) { st.classList.toggle("on", j === idx); });
      }
    }
    function drawAll() {
      // reduced motion: all three inhibitors at once, labelled
      base.style.strokeDasharray = "none";
      [vmaxL, vmaxT, kmV, kmH, kmT].forEach(function (el) { el.style.opacity = 1; });
      var g = inh.parentNode, sets = [[2.5, 1, "competitive"], [1, 0.5, "noncompetitive"], [0.5, 0.5, "uncompetitive"]];
      inh.style.display = "none"; inhT.style.display = "none"; lbInh.style.display = "none";
      sets.forEach(function (p, j) {
        var c = D.createElementNS("http://www.w3.org/2000/svg", "path"); c.setAttribute("class", "curve inh"); c.setAttribute("d", mm(p[0], p[1])); c.style.opacity = 1 - j * 0.2; g.insertBefore(c, inhT);
        var t = D.createElementNS("http://www.w3.org/2000/svg", "text"); t.setAttribute("class", "lbl mono inh-t"); t.setAttribute("x", "575"); t.setAttribute("text-anchor", "end");
        t.setAttribute("y", (Y(p[1] * 10 / (p[0] + 10)) + (j === 2 ? -8 : 20)).toFixed(1)); t.textContent = p[2]; g.insertBefore(t, inhT);
        var l = D.createElementNS("http://www.w3.org/2000/svg", "path"); l.setAttribute("class", "lbline inh"); l.setAttribute("d", lb(p[0], p[1])); lbInh.parentNode.appendChild(l);
      });
      cap.textContent = "Fig. 1. All three reversible inhibitors compared.";
      steps.forEach(function (st) { st.classList.add("on"); });
    }
    layout();
    if (RM) { drawAll(); return { scroll: function () {}, resize: layout }; }
    function scroll() { draw(clamp(stepPos(steps, narrow), 0, 5)); }
    draw(0);
    return { scroll: scroll, resize: layout };
  })();

  /* ---------- section scenes (Fig. 2 to 4): one per MCAT section, pinned like the kinetics plot ----------
   * Each scene reads a continuous step position from stepPos() inside update(); no extra scroll listeners.
   * Every plotted value is computed from its formula. Reduced motion draws the final labeled state once. */
  function keyed(keys, s) {
    // keys: [[s, a, b, ...], ...]; smoothstep between neighbouring keyframes
    for (var j = 1; j < keys.length; j++) if (s <= keys[j][0]) {
      var a = keys[j - 1], b = keys[j], t = smooth(a[0], b[0], s), out = [];
      for (var k = 1; k < a.length; k++) out.push(lerp(a[k], b[k], t));
      return out;
    }
    return keys[keys.length - 1].slice(1);
  }
  var f1 = function (x) { return x.toFixed(1); };
  var capY = function (y) { return clamp(y, -4000, 4000); };
  function scene(sel, build) {
    var sec = $(sel); if (!sec) return;
    var steps = $$(".kstep", sec), cap = $(".kcap", sec), narrow = false, last = -1;
    var api = {
      sec: sec,
      step: function (idx, text) {
        if (cap && text) cap.textContent = text;
        if (idx === last) return; last = idx;
        steps.forEach(function (st, j) { st.classList.toggle("on", j === idx); });
      }
    };
    function layout() { narrow = vw < 760; }
    layout();
    var draw = build(api);
    if (RM) { draw(steps.length, true); steps.forEach(function (st) { st.classList.add("on"); }); return; }
    draw(0, false);
    scenes.push({
      scroll: function () {
        var r = sec.getBoundingClientRect();
        if (r.bottom < -vh || r.top > vh * 2) return;  // far off screen: skip the work
        draw(clamp(stepPos(steps, narrow), 0, steps.length), false);
      },
      resize: layout
    });
  }

  /* Fig. 2, Chem/Phys: thin converging lens. 1/f = 1/do + 1/di, m = -di/do (distances in units of f). */
  scene(".scene.optscene", function (api) {
    var svg = $(".lensplot", api.sec), q = function (c) { return $(c, svg); };
    var rays = [q(".r1"), q(".r2"), q(".r3")], vx = q(".vext"), ob = q(".arrow.obj"), im = q(".arrow.img");
    var obT = q(".obj-t"), imT = q(".img-t"), rd = q(".lread"), kd = q(".lkind");
    var F = 70, X0 = 300, Y0 = 210, H = 56, XR = 590;  // px per f, lens x, axis y, object height
    var caps = ["Fig. 1. Object beyond 2F.", "Fig. 1. Object at 2F.", "Fig. 1. Object between F and 2F.", "Fig. 1. Object at F.", "Fig. 1. Object inside F."];
    var keys = [[0, 3], [0.7, 3], [1.3, 2], [1.7, 2], [2.3, 1.5], [2.7, 1.5], [3.3, 1], [3.7, 1], [4.3, 0.5], [5, 0.5]];
    rays.forEach(function (r) { r.setAttribute("pathLength", "1"); r.style.strokeDasharray = "1 1"; });
    function arrow(x, ytip) {
      var d = ytip < Y0 ? 1 : -1;
      return "M" + f1(x) + " " + Y0 + "V" + f1(ytip) + "M" + f1(x - 7) + " " + f1(ytip + d * 11) + "L" + f1(x) + " " + f1(ytip) + "L" + f1(x + 7) + " " + f1(ytip + d * 11);
    }
    return function (s, still) {
      var dO = still ? 0.5 : keyed(keys, s)[0];
      var inf = Math.abs(dO - 1) < 0.004;
      var dI = inf ? Infinity : 1 / (1 - 1 / dO);          // 1/di = 1/f - 1/do
      var m = inf ? Infinity : -dI / dO;
      var xo = X0 - dO * F, yt = Y0 - H;
      ob.setAttribute("d", arrow(xo, yt));
      obT.setAttribute("x", f1(xo)); obT.setAttribute("y", f1(yt - 14));
      // ray 1: parallel to the axis, refracts through the far focal point
      rays[0].setAttribute("d", "M" + f1(xo) + " " + yt + "H" + X0 + "L" + XR + " " + f1(capY(yt + H / F * (XR - X0))));
      // ray 2: through the optical center, undeviated
      rays[1].setAttribute("d", "M" + f1(xo) + " " + yt + "L" + XR + " " + f1(capY(Y0 + H / (X0 - xo) * (XR - X0))));
      // ray 3: on the line through the near focal point, leaves parallel at the image height
      var yl = inf ? 0 : Y0 + H / (dO - 1);
      rays[2].setAttribute("d", inf ? "" : "M" + f1(xo) + " " + yt + "L" + X0 + " " + f1(capY(yl)) + "H" + XR);
      var drawT = still ? 1 : smooth(0.05, 0.6, s);
      rays.forEach(function (r) { r.style.strokeDashoffset = (1 - drawT).toFixed(3); });
      var imgO = still ? 1 : smooth(0.45, 0.85, s);
      var kind;
      if (inf) {
        im.setAttribute("d", ""); vx.setAttribute("d", ""); imT.style.opacity = 0;
        rd.textContent = "do = 1.00f \u00b7 di = infinity"; kind = "rays parallel: no image";
      } else {
        var xi = X0 + dI * F, yi = Y0 - m * H, virt = dI < 0;
        im.setAttribute("d", arrow(xi, capY(yi))); im.classList.toggle("virt", virt); im.style.opacity = imgO;
        vx.setAttribute("d", virt ? "M" + X0 + " " + yt + "L" + f1(xi) + " " + f1(capY(yi)) + "M" + f1(xo) + " " + yt + "L" + f1(xi) + " " + f1(capY(yi)) + "M" + X0 + " " + f1(capY(yl)) + "H" + f1(xi) : "");
        vx.style.opacity = imgO;
        var onScreen = xi > 24 && xi < 576 && yi > 30 && yi < 352;
        imT.setAttribute("x", f1(xi)); imT.setAttribute("y", f1(m < 0 ? Math.min(yi + 24, 356) : Math.max(yi - 14, 26)));
        imT.textContent = virt ? "virtual image" : "real image";
        imT.style.opacity = onScreen ? imgO : 0;
        var a = Math.abs(m), size = a > 1.02 ? "enlarged" : a < 0.98 ? "reduced" : "same size";
        rd.textContent = "do = " + dO.toFixed(2) + "f \u00b7 di = " + dI.toFixed(2) + "f \u00b7 m = " + (m > 0 ? "+" : "") + m.toFixed(2);
        kind = (virt ? "virtual, upright, " : "real, inverted, ") + size + (onScreen ? "" : " (off frame)");
      }
      kd.textContent = kind; kd.style.opacity = imgO;
      var idx = still ? 4 : clamp(Math.floor(s), 0, 4);
      api.step(idx, still ? "Fig. 1. Object inside F: virtual, upright, enlarged image." : caps[idx]);
    };
  });

  /* Fig. 3, Psych/Soc: equal-variance signal detection. Hit = 1 - Phi(c - d'), false alarm = 1 - Phi(c). Illustrative values. */
  scene(".scene.sdt", function (api) {
    var svg = $(".sdtplot", api.sec), q = function (c) { return $(c, svg); };
    var noise = q(".noise"), sig = q(".sig"), hit = q(".hit"), fa = q(".fa"), crit = q(".crit"), critT = q(".crit-t");
    var dp = q(".dp"), dpT = q(".dp-t"), nT = q(".noise-t"), sT = q(".sig-t"), no = q(".say-no"), yes = q(".say-yes"), rd = q(".sread");
    var Z0 = -3.2, Z1 = 5.6, X = function (z) { return 30 + (z - Z0) * 62.5; }, Y = function (p) { return 340 - p * 600; };
    var pdf = function (z) { return Math.exp(-z * z / 2) / Math.sqrt(2 * Math.PI); };
    function erf(x) {  // Abramowitz and Stegun 7.1.26, |error| < 1.5e-7
      var t = 1 / (1 + 0.3275911 * Math.abs(x));
      var y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x);
      return x < 0 ? -y : y;
    }
    var Phi = function (z) { return 0.5 * (1 + erf(z / Math.SQRT2)); };
    function curve(mu) {
      var d = "";
      for (var z = Z0, k = 0; z <= Z1 + 1e-9; z += 0.08, k++) d += (k ? "L" : "M") + f1(X(z)) + " " + f1(Y(pdf(z - mu)));
      return d;
    }
    function area(mu, c) {
      var d = "M" + f1(X(c)) + " 340";
      for (var z = c; z < Z1; z += 0.08) d += "L" + f1(X(z)) + " " + f1(Y(pdf(z - mu)));
      return d + "L" + f1(X(Z1)) + " " + f1(Y(pdf(Z1 - mu))) + "L" + f1(X(Z1)) + " 340Z";
    }
    var pct = function (p) { return (p * 100).toFixed(1) + "%"; };
    var caps = ["Fig. 1. Heavy overlap, d' = 0.5.", "Fig. 1. The curves separate as d' grows.", "Fig. 1. Hits and false alarms, neutral criterion.", "Fig. 1. Liberal criterion.", "Fig. 1. Conservative criterion."];
    // [s, d', criterion c on the noise scale]
    var keys = [[0, 0.5, 0.25], [1.1, 0.5, 0.25], [1.7, 2, 1], [3.1, 2, 1], [3.6, 2, 0.3], [4.1, 2, 0.3], [4.6, 2, 1.7], [5, 2, 1.7]];
    noise.setAttribute("d", curve(0));
    [noise, sig].forEach(function (p) { p.setAttribute("pathLength", "1"); p.style.strokeDasharray = "1 1"; });
    return function (s, still) {
      var v = keyed(keys, still ? 5 : s), d = v[0], c = v[1];
      sig.setAttribute("d", curve(d));
      var drawT = still ? 1 : smooth(0.05, 0.6, s);
      noise.style.strokeDashoffset = sig.style.strokeDashoffset = (1 - drawT).toFixed(3);
      var lab = still ? 1 : smooth(0.4, 0.8, s);
      nT.setAttribute("x", f1(X(-1.3))); nT.setAttribute("y", f1(Y(pdf(1.3)) - 12)); nT.setAttribute("text-anchor", "end");
      sT.setAttribute("x", f1(X(d + 1.3))); sT.setAttribute("y", f1(Y(pdf(1.3)) - 12)); sT.setAttribute("text-anchor", "start");
      nT.style.opacity = sT.style.opacity = lab;
      dp.setAttribute("d", "M" + f1(X(0)) + " 50V64M" + f1(X(0)) + " 57H" + f1(X(d)) + "M" + f1(X(d)) + " 50V64");
      dpT.setAttribute("x", f1(X(d / 2))); dpT.setAttribute("y", "44"); dpT.textContent = "d' = " + d.toFixed(2);
      dp.style.opacity = dpT.style.opacity = lab;
      var sh = still ? 1 : smooth(1.9, 2.3, s);
      hit.setAttribute("d", area(d, c)); fa.setAttribute("d", area(0, c));
      hit.style.opacity = (0.2 * sh).toFixed(3); fa.style.opacity = (0.28 * sh).toFixed(3);
      crit.setAttribute("d", "M" + f1(X(c)) + " 90V340"); critT.setAttribute("x", f1(X(c)));
      no.setAttribute("x", f1(X(c) - 8)); yes.setAttribute("x", f1(X(c) + 8));
      [crit, critT, no, yes].forEach(function (el) { el.style.opacity = sh; });
      var H = 1 - Phi(c - d), FA = 1 - Phi(c);
      rd.textContent = sh > 0.5 ? "d' = " + d.toFixed(2) + " \u00b7 hit " + pct(H) + " \u00b7 false alarm " + pct(FA) : "d' = " + d.toFixed(2);
      var idx = still ? 4 : clamp(Math.floor(s), 0, 4);
      api.step(idx, still ? "Fig. 1. Conservative criterion, d' = 2." : caps[idx]);
    };
  });

  /* Fig. 4, CARS: claim, pivot, tone and evidence highlighted in turn while the passage map builds. */
  scene(".carsscene", function (api) {
    var marks = $$("mark.hl", api.sec), lis = $$(".pmap li", api.sec);
    var caps = ["Fig. 1. Main claim.", "Fig. 1. Pivot word: But.", "Fig. 1. Tone word: shortsighted.", "Fig. 1. Evidence, noted in a few words.", "Fig. 1. Passage map complete."];
    return function (s, still) {
      marks.forEach(function (el) {
        var k = +el.getAttribute("data-k");
        el.style.setProperty("--t", (still ? 1 : clamp((s - k - 0.08) / 0.5, 0, 1)).toFixed(3));
      });
      lis.forEach(function (li) { li.classList.toggle("on", still || s >= +li.getAttribute("data-k") + 0.45); });
      var idx = still ? 4 : clamp(Math.floor(s), 0, 4);
      api.step(idx, still ? "Fig. 1. Original passage, fully mapped." : caps[idx]);
    };
  });

  /* ---------- pack assembly ---------- */
  var pack = (function () {
    var sec = $(".inside"); if (!sec) return null;
    var el = $(".pack", sec), mix = $(".mixbar", sec), bars = mix ? $$("i", mix) : [];
    if (RM) { el.style.setProperty("--p", 1); return null; }
    bars.forEach(function (b) { b.style.setProperty("--mx", 0); });
    if (io && mix) new IntersectionObserver(function (es) {
      if (es[0].isIntersecting) bars.forEach(function (b, k) { setTimeout(function () { b.style.setProperty("--mx", 1); }, k * 140); });
    }, { threshold: 0.6 }).observe(mix);
    function scroll() {
      var p;
      if (vw >= 980) { var r = sec.getBoundingClientRect(); p = clamp((-r.top + vh * 0.35) / (r.height - vh) / 0.75, 0, 1); }
      else { var s = $(".istage", sec).getBoundingClientRect(); p = clamp((vh * 0.95 - s.top) / (vh * 0.65), 0, 1); }
      el.style.setProperty("--p", smooth(0, 1, p).toFixed(3));
    }
    scroll();
    return { scroll: scroll };
  })();

  /* ---------- alpha helix canvas (hand-rolled, no WebGL library) ---------- */
  var helix = (function () {
    var cv = $("canvas.helix"); if (!cv || !cv.getContext) return null;
    var ctx = cv.getContext("2d"), dpr = Math.min(W.devicePixelRatio || 1, vw < 760 ? 1.5 : 2);
    var N = 16, atoms = [], bonds = [], hb = [];
    // approximate alpha-helix backbone in cylindrical coordinates (radius A, angle deg, rise A)
    var BB = [["N", 1.55, 0, 0], ["CA", 2.3, 28, 0.85], ["C", 1.65, 62, 1.6], ["O", 2.05, 70, 2.75]];
    var rnd = function (k) { var x = Math.sin(k * 127.1) * 43758.5453; return x - Math.floor(x); };
    for (var r = 0; r < N; r++) {
      BB.forEach(function (b) { atoms.push({ el: b[0], r: r, rad: b[1], ang: b[2], z: b[3] }); });
      atoms.push({ el: "R", r: r, rad: 3.6, ang: 22, z: 0.4 });
    }
    for (var r2 = 0; r2 < N; r2++) {
      var o = r2 * 5;
      bonds.push([o, o + 1], [o + 1, o + 2], [o + 2, o + 3], [o + 1, o + 4]);
      if (r2 < N - 1) bonds.push([o + 2, o + 5]);
      if (r2 + 4 < N) hb.push([o + 3, (r2 + 4) * 5]);
    }
    var cols = {}, sprites = {}, rot = 0, tx = 0, ty = 0, px = 0, py = 0, den = 0, denT = 0, running = false, visible = true, W2 = 0, H2 = 0, anchorX = 0;
    function palette() {
      var dark = isDark();
      cols = { N: dark ? "#6aa2ff" : "#2b62d9", CA: dark ? "#cfd8d2" : "#26302c", C: dark ? "#9fb0a8" : "#4a5752", O: dark ? "#ff6b72" : "#d23c45", R: dark ? "#ffd23f" : "#f2b705",
        bond: dark ? "rgba(232,238,233,.55)" : "rgba(13,21,18,.55)", hb: dark ? "#3ddc84" : "#13804a" };
      Object.keys(cols).forEach(function (k) { if (k !== "bond" && k !== "hb") sprites[k] = sprite(cols[k]); });
      if (!running) frame();
    }
    function sprite(c) {
      var s = D.createElement("canvas"); s.width = s.height = 96; var g = s.getContext("2d");
      var gr = g.createRadialGradient(34, 32, 4, 48, 48, 48);
      gr.addColorStop(0, "rgba(255,255,255,.95)"); gr.addColorStop(0.18, c); gr.addColorStop(0.85, c); gr.addColorStop(1, "rgba(0,0,0,.55)");
      g.fillStyle = gr; g.beginPath(); g.arc(48, 48, 47, 0, Math.PI * 2); g.fill();
      g.globalCompositeOperation = "source-atop"; g.fillStyle = "rgba(0,0,0,.18)"; g.beginPath(); g.arc(60, 64, 40, 0, Math.PI * 2); g.fill();
      return s;
    }
    function size() {
      var b = cv.getBoundingClientRect(); W2 = b.width; H2 = b.height;
      var card = $(".anki"); anchorX = W2 * 0.8;
      if (card) { var cr = card.getBoundingClientRect(); anchorX = Math.min(cr.right - b.left + 10, W2 - 200); }
      cv.width = Math.round(W2 * dpr); cv.height = Math.round(H2 * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!running) frame();
    }
    function frame() {
      if (!W2 || !sprites.N) return;
      ctx.clearRect(0, 0, W2, H2);
      den = lerp(den, denT, 0.08);
      var d = den, twist = lerp(100, 178, d) * Math.PI / 180, rise = lerp(1.5, 2.7, d), rs = lerp(1, 0.32, d);
      var mob = vw < 980, len = (N - 1) * rise, scale = mob ? W2 / 16 : H2 / 25;
      var tilt = -0.42 + py * 0.3, yaw = px * 0.45, roll = (mob ? 10 : 14) * Math.PI / 180;
      var ct = Math.cos(tilt), st = Math.sin(tilt), cy = Math.cos(yaw), sy = Math.sin(yaw), cr = Math.cos(roll), sr = Math.sin(roll);
      var cx0 = mob ? W2 * 1.02 : anchorX, cy0 = mob ? 330 : H2 * 0.5;
      var P = atoms.map(function (a, k) {
        var ang = a.ang * Math.PI / 180 + a.r * twist + rot, rad = a.rad * rs;
        var wob = d * 1.6;
        var x = rad * Math.cos(ang) + wob * (rnd(k) - 0.5), z = rad * Math.sin(ang) + wob * (rnd(k + 9) - 0.5), y = a.r * rise + a.z * lerp(1, 1.4, d) - len / 2;
        // helix axis is model y. tilt about X, yaw about Y, then roll in the screen plane
        var y1 = y * ct - z * st, z1 = y * st + z * ct;
        var x2 = x * cy + z1 * sy, z2 = -x * sy + z1 * cy;
        var xs = x2 * cr - y1 * sr, ys = x2 * sr + y1 * cr;
        var f = 40 / (40 + z2);
        return { x: cx0 + xs * scale * f, y: cy0 + ys * scale * f, z: z2, f: f, a: a };
      });
      var items = [];
      bonds.forEach(function (b) { items.push({ t: 0, z: (P[b[0]].z + P[b[1]].z) / 2 + 0.01, a: P[b[0]], b: P[b[1]] }); });
      if (d < 0.95) hb.forEach(function (b) { items.push({ t: 1, z: (P[b[0]].z + P[b[1]].z) / 2, a: P[b[0]], b: P[b[1]] }); });
      P.forEach(function (p) { items.push({ t: 2, z: p.z, p: p }); });
      items.sort(function (m, n) { return n.z - m.z; });
      var R = { N: 0.46, CA: 0.52, C: 0.46, O: 0.5, R: 0.72 };
      ctx.lineCap = "round";
      for (var i = 0; i < items.length; i++) {
        var it = items[i], fog = clamp(0.55 + (4 - it.z) / 10, 0.3, 1);
        ctx.globalAlpha = fog;
        if (it.t === 0) {
          ctx.strokeStyle = cols.bond; ctx.lineWidth = 0.2 * scale * it.a.f; ctx.setLineDash([]);
          ctx.beginPath(); ctx.moveTo(it.a.x, it.a.y); ctx.lineTo(it.b.x, it.b.y); ctx.stroke();
        } else if (it.t === 1) {
          ctx.globalAlpha = fog * (1 - d) * 0.9; ctx.strokeStyle = cols.hb; ctx.lineWidth = 1.6; ctx.setLineDash([3, 5]);
          ctx.beginPath(); ctx.moveTo(it.a.x, it.a.y); ctx.lineTo(it.b.x, it.b.y); ctx.stroke();
        } else {
          var p = it.p, s = R[p.a.el] * scale * p.f;
          ctx.drawImage(sprites[p.a.el], p.x - s, p.y - s, s * 2, s * 2);
        }
      }
      ctx.globalAlpha = 1; ctx.setLineDash([]);
    }
    function loop() {
      if (!running) return;
      if (visible && !D.hidden) {
        rot += 0.0045 * (1 - den * 0.7);
        px = lerp(px, tx, 0.05); py = lerp(py, ty, 0.05);
        frame();
      }
      requestAnimationFrame(loop);
    }
    function start() {
      size(); palette();
      cv.classList.add("on");
      if (RM || LOWPOWER) { frame(); return; }
      running = true; requestAnimationFrame(loop);
      if (io) new IntersectionObserver(function (es) { visible = es[0].isIntersecting; }).observe(cv);
    }
    // lazy init after first paint and idle time
    var idle = W.requestIdleCallback || function (f) { return setTimeout(f, 200); };
    if (D.readyState === "complete") idle(start); else W.addEventListener("load", function () { idle(start); });
    return {
      palette: palette, resize: size,
      pointer: function (x, y) { tx = x - 0.5; ty = y - 0.5; },
      denature: function (d) { denT = d; if (!running) { den = d; frame(); } }
    };
  })();

  function resizeAll() { if (helix) helix.resize(); if (kin && kin.resize) kin.resize(); scenes.forEach(function (sc) { if (sc.resize) sc.resize(); }); update(); }

  W.matchMedia("(prefers-color-scheme: dark)").addEventListener && W.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function () { if (helix) helix.palette(); });

  observeReveals();
  update();
  loadLenis();
})();

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
    var cards = $$(".ankicard", box), i = 0, flipBtn = $("[data-flip]", box), nextBtn = $("[data-next]", box), count = $(".ankicount", box);
    var auto = !RM, timer = null, hover = false, visible = true;
    function show(n) {
      cards.forEach(function (c, k) { c.classList.toggle("cur", k === n); c.classList.remove("flipped"); c.setAttribute("aria-hidden", k === n ? "false" : "true"); });
      i = n; count.textContent = (n + 1) + " / " + cards.length; flipBtn.textContent = "Show answer";
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
    function scroll() {
      // continuous step position: which step block crosses the reference line, and how far
      var L = vh * (narrow ? 0.78 : 0.55), s = 0;
      for (var j = 0; j < steps.length; j++) {
        var r = steps[j].getBoundingClientRect();
        if (r.top <= L) s = j + clamp((L - r.top) / Math.max(1, r.height), 0, 1) * (j === steps.length - 1 ? 1 : 0.999);
      }
      draw(clamp(s, 0, 5));
    }
    draw(0);
    return { scroll: scroll, resize: layout };
  })();

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

  function resizeAll() { if (helix) helix.resize(); if (kin && kin.resize) kin.resize(); update(); }

  W.matchMedia("(prefers-color-scheme: dark)").addEventListener && W.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function () { if (helix) helix.palette(); });

  observeReveals();
  update();
  loadLenis();
})();

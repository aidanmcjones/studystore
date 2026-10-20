/* StudyStore owner marketing outbox (/admin/marketing.html).
 * The owner works through ready-to-paste posts from a phone: copy the text or link, open the target,
 * download the asset, then Mark posted (with the optional post URL) or Skip. Every request carries the
 * owner key saved on /owner.html (X-Owner-Key). All item text is rendered with textContent only. */
(function () {
  "use strict";
  var D = document, root = D.getElementById("admin-root");
  if (!root) return;
  var key = ""; try { key = localStorage.getItem("ss-owner-key") || ""; } catch (e) {}
  var status = D.getElementById("admin-status");
  var chips = D.getElementById("mk-chips");
  var tabs = D.querySelectorAll(".mk-tabs [data-status]");
  var todayBox = D.getElementById("mk-today"), todayList = D.getElementById("mk-today-list");
  var cur = "ready", chan = "", data = null, focusId = "";
  try { cur = sessionStorage.getItem("mk-tab") || "ready"; } catch (e) {}

  function el(tag, cls, text) { var n = D.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = String(text); return n; }
  function clear(n) { while (n.firstChild) n.removeChild(n.firstChild); }
  function when(ts) { return ts ? new Date(ts * 1000).toISOString().slice(0, 16).replace("T", " ") : ""; }
  function safeHttps(u) { return typeof u === "string" && /^https:\/\/[^\s]+$/.test(u) ? u : ""; }
  function safeAsset(u) { return typeof u === "string" && (/^\/[^\s/][^\s]*$/.test(u) || /^https:\/\/[^\s]+$/.test(u)) ? u : ""; }
  if (!key) { status.textContent = "Owner mode is off in this browser. Sign in on the owner page first."; return; }

  function api(path, opts) {
    opts = opts || {}; opts.headers = opts.headers || {}; opts.headers["X-Owner-Key"] = key; opts.credentials = "omit";
    return fetch(path, opts).then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { j._status = r.status; return j; }); });
  }

  function copy(text, btn) {
    var done = function () { var t = btn.textContent; btn.textContent = "Copied"; setTimeout(function () { btn.textContent = t; }, 1400); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, function () { fallback(); });
    } else fallback();
    function fallback() {
      var ta = el("textarea"); ta.value = text; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
      D.body.appendChild(ta); ta.select(); ta.setSelectionRange(0, text.length);
      try { D.execCommand("copy"); done(); } catch (e) { status.textContent = "Copy failed; select the text by hand."; }
      D.body.removeChild(ta);
    }
  }

  function btn(label, cls, fn) { var b = el("button", cls || "btn small", label); b.type = "button"; b.addEventListener("click", function () { fn(b); }); return b; }

  function setStatus(it, s, url, b) {
    b.disabled = true;
    api("/api/outbox/" + encodeURIComponent(it.id), { method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: s, posted_url: url || null }) }).then(function (j) {
      if (j.ok) { status.textContent = it.id + " marked " + s + "."; load(); }
      else { b.disabled = false; status.textContent = "Could not mark " + it.id + " " + s + ": " + (j.error || j._status); }
    }).catch(function () { b.disabled = false; status.textContent = "Could not reach the server."; });
  }

  function assetBlock(u) {
    var box = el("div", "mk-asset");
    var path = u.split("?")[0].toLowerCase();
    if (/\.(mp4|webm|mov|m4v)$/.test(path)) {
      var v = el("video"); v.controls = true; v.preload = "none"; v.playsInline = true; v.setAttribute("playsinline", ""); v.src = u; box.appendChild(v);
    } else if (/\.(png|jpe?g|gif|webp|avif|svg)$/.test(path)) {
      var im = el("img"); im.loading = "lazy"; im.decoding = "async"; im.alt = "Post asset preview"; im.src = u; box.appendChild(im);
    }
    return box;
  }

  function card(it) {
    var li = el("li", "mk-card"); li.id = "mk-" + it.id;
    var head = el("p", "mk-head");
    head.appendChild(el("span", "mk-badge", it.channel));
    head.appendChild(el("span", "mk-target", it.target || ""));
    li.appendChild(head);
    li.appendChild(el("p", "meta mono", it.id + "  " + (it.campaign || "") + "  gate " + it.gate + "  " + when(it.created)));
    if (it.title) li.appendChild(el("p", "mk-title", it.title));
    li.appendChild(el("div", "rmsg", it.body || ""));
    if (it.link) li.appendChild(el("p", "meta mono", "Link: " + it.link));
    if (it.notes) li.appendChild(el("p", "meta", "Before posting: " + it.notes));
    var asset = safeAsset(it.asset_url);
    if (asset) li.appendChild(assetBlock(asset));

    var row = el("div", "ractions");
    row.appendChild(btn("Copy text", "btn small", function (b) { copy((it.title ? it.title + "\n\n" : "") + (it.body || ""), b); }));
    if (it.link) row.appendChild(btn("Copy link", "btn small ghost", function (b) { copy(it.link, b); }));
    var tu = safeHttps(it.target_url);
    if (tu) { var a = el("a", "btn small ghost", "Open target"); a.href = tu; a.target = "_blank"; a.rel = "noopener noreferrer"; row.appendChild(a); }
    if (asset) { var dl = el("a", "btn small ghost", "Download asset"); dl.href = asset; dl.setAttribute("download", ""); row.appendChild(dl); }
    li.appendChild(row);

    if (it.status === "ready" || it.status === "held") {
      var f = el("div", "mk-posted");
      var inp = el("input"); inp.type = "url"; inp.inputMode = "url"; inp.placeholder = "Post URL (optional)"; inp.maxLength = 1000;
      inp.setAttribute("aria-label", "Post URL for " + it.id);
      f.appendChild(inp);
      f.appendChild(btn("Mark posted", "btn small", function (b) {
        var u = inp.value.trim();
        if (u && !safeHttps(u)) { status.textContent = "The post URL must start with https://"; return; }
        setStatus(it, "posted", u, b);
      }));
      f.appendChild(btn("Skip", "btn small ghost", function (b) { setStatus(it, "skipped", "", b); }));
      if (it.status === "held") f.appendChild(btn("Release now", "btn small ghost", function (b) { setStatus(it, "ready", "", b); }));
      li.appendChild(f);
    } else {
      var p = el("div", "mk-posted");
      var pu = safeHttps(it.posted_url);
      if (pu) { var pa = el("a", null, "View post"); pa.href = pu; pa.target = "_blank"; pa.rel = "noopener noreferrer"; p.appendChild(pa); }
      p.appendChild(el("span", "meta", it.status + " " + when(it.updated)));
      p.appendChild(btn("Back to ready", "btn small ghost", function (b) { setStatus(it, "ready", "", b); }));
      li.appendChild(p);
    }
    return li;
  }

  function renderToday(list) {
    clear(todayList);
    todayBox.hidden = !list || !list.length;
    (list || []).forEach(function (t) {
      var li = el("li"); var a = el("a", null, t.channel + ": " + (t.title || t.target || t.id)); a.href = "#mk-" + t.id;
      a.addEventListener("click", function (ev) {
        ev.preventDefault(); focusId = t.id;
        if (cur !== "ready" || chan) { cur = "ready"; chan = ""; load(); } else jump();
      });
      li.appendChild(a); todayList.appendChild(li);
    });
  }

  function jump() {
    if (!focusId) return;
    var n = D.getElementById("mk-" + focusId); focusId = "";
    if (!n) return;
    n.classList.add("mk-hl"); n.scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(function () { n.classList.remove("mk-hl"); }, 2500);
  }

  function renderChips() {
    clear(chips);
    var total = 0, names = Object.keys(data.channels || {}).sort();
    names.forEach(function (c) { total += data.channels[c]; });
    if (chan && names.indexOf(chan) < 0) chan = "";
    [""].concat(names).forEach(function (c) {
      var b = el("button"); b.type = "button"; b.setAttribute("aria-pressed", String(c === chan));
      b.appendChild(D.createTextNode(c || "All")); b.appendChild(el("span", null, c ? data.channels[c] : total));
      b.addEventListener("click", function () { chan = c; render(); });
      chips.appendChild(b);
    });
  }

  function render() {
    tabs.forEach(function (t) {
      var s = t.getAttribute("data-status");
      t.setAttribute("aria-selected", String(s === cur));
      t.querySelector("span").textContent = data && data.counts ? (data.counts[s] || 0) : "";
    });
    if (!data) return;
    renderChips();
    clear(root);
    var items = (data.items || []).filter(function (i) { return !chan || i.channel === chan; });
    if (!items.length) { root.appendChild(el("p", "meta", cur === "ready" ? "Nothing ready to post." : "Nothing here.")); return; }
    var ul = el("ul", "rlist"); items.forEach(function (i) { ul.appendChild(card(i)); }); root.appendChild(ul);
    jump();
  }

  function load() {
    status.textContent = "Loading...";
    try { sessionStorage.setItem("mk-tab", cur); } catch (e) {}
    api("/api/outbox?status=" + encodeURIComponent(cur)).then(function (j) {
      if (j._status === 401) { status.textContent = "Owner key not accepted. Sign in again on the owner page."; return; }
      if (!j.ok) { status.textContent = "Could not load the outbox (" + (j.error || j._status) + ")."; return; }
      data = j;
      status.textContent = "Updated " + new Date().toLocaleTimeString() + ".";
      renderToday(j.today);
      render();
    }).catch(function () { status.textContent = "Could not reach the server."; });
  }

  tabs.forEach(function (t) {
    t.addEventListener("click", function () { cur = t.getAttribute("data-status"); chan = ""; render(); load(); });
  });
  var rl = D.getElementById("admin-reload"); if (rl) rl.addEventListener("click", load);
  load();
})();

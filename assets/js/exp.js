/* StudyStore experiments + anonymous event beacon.
 * - Anonymous random session id in localStorage (key ss_sid). No cookies, no PII.
 * - Assigns one variant per experiment per session by weight (sticky), swaps text in
 *   elements marked data-exp="<id>" data-exp-field="<field>" (textContent only).
 * - Sends view, cta_click, checkout_click, sampler_click to /api/e via sendBeacon, plus
 *   subscribe (launch list signup) through window.ssTrack("subscribe") from waitlist.js.
 * - Tags checkout links: Polar (buy.polar.sh) links get the first-touch utm_* tags and
 *   reference_id=<id>.<variant>~... (shown experiments); Lemon Squeezy links (dormant provider)
 *   get checkout[custom][exp_<id>]=<variant> and utm tags.
 * - Sends nothing when Do Not Track or Global Privacy Control is on.
 */
(function () {
  "use strict";
  var D = document, H = D.documentElement, W = window;
  var ENDPOINT = "/api/e", CONFIG = "/experiments.json";
  function done() { H.classList.remove("exp-wait"); }
  var noTrack = navigator.doNotTrack === "1" || W.doNotTrack === "1" || navigator.globalPrivacyControl === true;

  function store(k, v) {
    try { if (v === undefined) return W.localStorage.getItem(k); W.localStorage.setItem(k, v); } catch (e) { return null; }
  }
  function sid() {
    var s = store("ss_sid");
    if (!s || !/^[a-f0-9]{24}$/.test(s)) {
      var a = new Uint8Array(12); (W.crypto || W.msCrypto).getRandomValues(a);
      s = Array.prototype.map.call(a, function (b) { return ("0" + b.toString(16)).slice(-2); }).join("");
      store("ss_sid", s);
    }
    return s;
  }
  function loadAssign() { try { return JSON.parse(store("ss_exp") || "{}") || {}; } catch (e) { return {}; } }
  var assign = loadAssign();

  var path = location.pathname;
  var q = new URLSearchParams(location.search);
  // Remember the first-touch utm tags for this session (sessionStorage).
  function utm(k) {
    var v = q.get(k);
    try { if (v) W.sessionStorage.setItem("ss_" + k, v); else v = W.sessionStorage.getItem("ss_" + k); } catch (e) {}
    return (v || "").slice(0, 60);
  }
  var utmSource = utm("utm_source"), utmCampaign = utm("utm_campaign");
  var utmExtra = { utm_medium: utm("utm_medium"), utm_content: utm("utm_content"), utm_term: utm("utm_term") };
  var refDomain = "";
  try { if (D.referrer) { var r = new URL(D.referrer).hostname; if (r !== location.hostname) refDomain = r; } } catch (e) {}

  function send(event, exps) {
    if (noTrack) return;
    var body = JSON.stringify({ sid: sid(), page: path, event: event, exps: exps || {},
      ref_domain: refDomain, utm_source: utmSource, utm_campaign: utmCampaign });
    try {
      if (navigator.sendBeacon && navigator.sendBeacon(ENDPOINT, new Blob([body], { type: "text/plain" }))) return;
    } catch (e) {}
    try { fetch(ENDPOINT, { method: "POST", body: body, keepalive: true, headers: { "Content-Type": "text/plain" } }); } catch (e) {}
  }

  function pick(variants) {
    var active = variants.filter(function (v) { return v.status === "active" && v.weight > 0; });
    if (!active.length) return null;
    var total = active.reduce(function (s, v) { return s + v.weight; }, 0), x = Math.random() * total;
    for (var i = 0; i < active.length; i++) { x -= active[i].weight; if (x <= 0) return active[i]; }
    return active[active.length - 1];
  }

  var applied = {}; // exp id -> variant id shown on this page

  function applyText(exp, v) {
    var els = D.querySelectorAll('[data-exp="' + exp.id + '"]');
    for (var i = 0; i < els.length; i++) {
      var el = els[i], f = el.getAttribute("data-exp-field") || "text";
      if (!v.fields || typeof v.fields[f] !== "string") continue;
      if (!el.hasAttribute("data-exp-orig")) el.setAttribute("data-exp-orig", el.textContent.trim());
      el.textContent = v.fields[f].replace(/\{orig\}/g, el.getAttribute("data-exp-orig"));
    }
    return els.length > 0;
  }

  function applyNoteLayout(v) {
    var art = D.querySelector("article.note"); if (!art) return false;
    var ctas = art.querySelectorAll("aside.cta"); if (!ctas.length) return false;
    if (v.layout === "end_only" && ctas.length > 1) ctas[0].style.display = "none";
    if (v.layout === "early") {
      var paras = art.querySelectorAll(".prose > p");
      var anchor = paras[Math.min(2, paras.length - 1)];
      if (anchor && ctas.length > 1) { anchor.parentNode.insertBefore(ctas[0], anchor.nextSibling); ctas[0].classList.add("cta-compact"); }
    }
    return true;
  }

  function run(cfg) {
    var changed = false;
    (cfg.experiments || []).forEach(function (exp) {
      if (exp.status !== "running") return;
      try { if (!new RegExp(exp.pages).test(path)) return; } catch (e) { return; }
      var cur = assign[exp.id], v = null;
      if (cur) v = exp.variants.filter(function (x) { return x.id === cur && x.status === "active"; })[0] || null;
      if (!v) { v = pick(exp.variants); if (!v) return; assign[exp.id] = v.id; changed = true; }
      var shown = exp.id === "note_cta" ? applyNoteLayout(v) : applyText(exp, v);
      if (shown) applied[exp.id] = v.id;
    });
    if (changed) store("ss_exp", JSON.stringify(assign));
    // Seen set: experiments this session has actually been shown (for click attribution).
    var seen; try { seen = JSON.parse(store("ss_seen") || "{}") || {}; } catch (e) { seen = {}; }
    Object.keys(applied).forEach(function (k) { seen[k] = applied[k]; });
    Object.keys(seen).forEach(function (k) { if (assign[k] !== seen[k]) delete seen[k]; });
    store("ss_seen", JSON.stringify(seen));
    W.__ssSeen = seen;
    tagCheckoutLinks(seen);
    done();
    send("view", applied);
  }

  function checkoutHost(a) {
    try {
      var h = new URL(a.href, location.href).hostname;
      if (h === "buy.polar.sh") return "polar";
      if (/(^|\.)lemonsqueezy\.com$/.test(h)) return "ls";
    } catch (e) {}
    return null;
  }
  function isCheckout(a) { return !!checkoutHost(a); }
  // Polar checkout links copy utm_* and reference_id into the checkout session metadata.
  function tagPolar(u, seen) {
    var ref = Object.keys(seen).sort().map(function (k) { return k + "." + seen[k]; }).join("~");
    if (ref) u.searchParams.set("reference_id", ("ss~" + ref).slice(0, 100)); else u.searchParams.delete("reference_id");
    if (utmSource) u.searchParams.set("utm_source", utmSource);
    if (utmCampaign) u.searchParams.set("utm_campaign", utmCampaign);
    Object.keys(utmExtra).forEach(function (k) { if (utmExtra[k]) u.searchParams.set(k, utmExtra[k]); });
  }
  function tagCheckoutLinks(seen) {
    var links = D.querySelectorAll("a[href]");
    for (var i = 0; i < links.length; i++) {
      var a = links[i], host = checkoutHost(a); if (!host) continue;
      try {
        var u = new URL(a.href);
        if (host === "polar") { tagPolar(u, seen); a.href = u.toString(); continue; }
        Object.keys(seen).forEach(function (k) { u.searchParams.set("checkout[custom][exp_" + k + "]", seen[k]); });
        if (utmSource) u.searchParams.set("checkout[custom][utm_source]", utmSource);
        if (utmCampaign) u.searchParams.set("checkout[custom][utm_campaign]", utmCampaign);
        a.href = u.toString();
      } catch (e) {}
    }
  }

  // Named events from other scripts (waitlist.js). Only known names; the email is never sent here.
  W.ssTrack = function (event) { if (event === "subscribe") send(event, W.__ssSeen || {}); };

  D.addEventListener("click", function (ev) {
    var a = ev.target && ev.target.closest ? ev.target.closest("a") : null; if (!a) return;
    var t = a.getAttribute("data-track"), kind = null;
    if (isCheckout(a) || (a.hasAttribute("data-buy") && !a.classList.contains("off"))) kind = "checkout_click";
    else if (t === "sampler") kind = "sampler_click";
    else if (t === "cta" || a.closest("aside.cta") || a.closest(".product .row")) kind = "cta_click";
    if (kind) send(kind, W.__ssSeen || {});
  }, true);

  function start() {
    fetch(CONFIG, { cache: "no-cache" }).then(function (r) { return r.ok ? r.json() : { experiments: [] }; })
      .then(run).catch(function () { try { tagCheckoutLinks({}); } catch (e) {} done(); send("view", {}); });
  }
  if (D.readyState === "loading") D.addEventListener("DOMContentLoaded", start); else start();
  setTimeout(done, 1200);
})();

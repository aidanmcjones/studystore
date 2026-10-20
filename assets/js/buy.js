/* StudyStore buy buttons. Elements with data-buy="<slug>" create a Lemon Squeezy checkout through
 * /api/checkout (with the visitor's shown experiment variants and first-touch utm tags as
 * checkout[custom]) and redirect to it. If the API is not configured yet (no LS keys), buttons
 * without a static fallback URL turn into a disabled "Available soon". No cookies, no PII.
 * On thanks.html it fills the #upgrade hook only if /api/upgrade answers 200 (G02, not built yet).
 */
(function () {
  "use strict";
  var D = document, W = window;
  function btns() { return D.querySelectorAll("[data-buy]"); }
  function soon(a) {
    if (a.getAttribute("data-fallback")) return;
    a.classList.add("off"); a.setAttribute("aria-disabled", "true"); a.setAttribute("tabindex", "-1");
    a.removeAttribute("href"); a.textContent = "Available soon";
  }
  function custom() {
    var c = {}, seen = W.__ssSeen || {};
    try { if (!Object.keys(seen).length) seen = JSON.parse(W.localStorage.getItem("ss_seen") || "{}") || {}; } catch (e) {}
    Object.keys(seen).forEach(function (k) { c["exp_" + k] = String(seen[k]); });
    ["utm_source", "utm_campaign"].forEach(function (k) {
      var v = new URLSearchParams(location.search).get(k);
      try { v = v || W.sessionStorage.getItem("ss_" + k); } catch (e) {}
      if (v) c[k] = v.slice(0, 60);
    });
    return c;
  }
  function go(a) {
    var label = a.textContent, fb = a.getAttribute("data-fallback");
    a.textContent = "Opening checkout..."; a.setAttribute("aria-busy", "true");
    fetch("/api/checkout", { method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: a.getAttribute("data-buy"), custom: custom() }) })
      .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, status: r.status, d: d }; }); })
      .then(function (x) {
        if (x.ok && x.d.url) { location.href = x.d.url; return; }
        if (fb) { location.href = fb; return; }
        a.removeAttribute("aria-busy"); if (x.status === 503 || x.status === 404) soon(a); else a.textContent = label;
      })
      .catch(function () { if (fb) location.href = fb; else { a.removeAttribute("aria-busy"); a.textContent = label; } });
  }
  function init() {
    var list = btns();
    if (list.length) {
      fetch("/api/checkout", { cache: "no-store" }).then(function (r) { return r.ok ? r.json() : { enabled: false }; })
        .catch(function () { return { enabled: false }; })
        .then(function (s) {
          var ok = {}; (s.sellable || []).forEach(function (k) { ok[k] = 1; });
          for (var i = 0; i < list.length; i++) if (!s.enabled || !ok[list[i].getAttribute("data-buy")]) soon(list[i]);
        });
    }
    D.addEventListener("click", function (ev) {
      var a = ev.target && ev.target.closest ? ev.target.closest("[data-buy]") : null;
      if (!a || a.classList.contains("off")) return;
      ev.preventDefault(); go(a);
    });
    var up = D.getElementById("upgrade");
    if (up) {
      var p = new URLSearchParams(location.search).get("p") || "";
      if (/^[a-z0-9-]{1,60}$/.test(p)) {
        fetch("/api/upgrade?p=" + encodeURIComponent(p), { cache: "no-store" })
          .then(function (r) { return r.status === 200 ? r.json() : null; })
          .then(function (d) { if (d && typeof d.html === "string") { up.innerHTML = d.html; up.hidden = false; } })
          .catch(function () {});
      }
    }
  }
  if (D.readyState === "loading") D.addEventListener("DOMContentLoaded", init); else init();
})();

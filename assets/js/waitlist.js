/* StudyStore free sampler opt-in (built by waitlist.py). Double opt-in via the income-brain subscribe contract.
 * Enhances form[data-waitlist]: POSTs JSON {email, list_id, consent_text, source_url, utm:{source,medium,campaign},
 * website} to the form's data-endpoint (the brain Worker; CORS allows www.studystore.co). 202 means a confirm
 * email is on its way. If the brain is unreachable or not live yet (network error, 404, 5xx, 501) the same JSON
 * goes to the same-origin /api/subscribe, which forwards it or keeps it pending for a later confirm email.
 * On success it shows the message in place, moves focus to it, and records an anonymous 'subscribe' event through
 * exp.js (window.ssTrack). The email itself is never sent to analytics. Without JS the form is a plain HTML post
 * to /api/subscribe. Exposed for tests: window.ssWaitlist = {payload, classify}. */
(function () {
  "use strict";
  var D = document, W = window;
  var EMAIL = /^[^\s@]{1,64}@[^\s@]+\.[A-Za-z]{2,24}$/;
  var MSG = {
    bad_email: "That email address does not look right. Please check it.",
    rate_limited: "Too many tries from this connection. Please wait a few minutes and try again.",
    failed: "Could not reach the server. Please try again."
  };
  var PENDING = "You are on the list. Before we send anything else, we will email you a link to confirm your address.";

  function firstTouch(k) {
    var v = ""; try { v = new URLSearchParams(location.search).get(k) || W.sessionStorage.getItem("ss_" + k) || ""; } catch (e) {}
    return /^[A-Za-z0-9_.\-]{1,60}$/.test(v) ? v : "";
  }
  function val(f, name) { var i = f.querySelector("[name=" + name + "]"); return i ? String(i.value || "") : ""; }

  // The exact contract body (marketing/SPEC-shared.md section 2). source_url has no query string or hash.
  function payload(f, href) {
    var u = href || location.href, cut = u.search(/[?#]/);
    return { email: val(f, "email").trim(), list_id: val(f, "list_id"), consent_text: val(f, "consent_text"),
      source_url: cut < 0 ? u : u.slice(0, cut),
      utm: { source: firstTouch("utm_source"), medium: firstTouch("utm_medium"), campaign: firstTouch("utm_campaign") },
      website: val(f, "website") };
  }

  // Brain response -> what to do. "ok" confirm email sent, "pending" stored for a later confirm,
  // "bad_email" / "rate_limited" user-facing errors, "fallback" try the same-origin endpoint.
  function classify(status, j) {
    j = j || {};
    if ((status === 202 || status === 200) && j.ok) return j.status === "pending" ? "pending" : "ok";
    if (status === 400) return "bad_email";
    if (status === 429) return "rate_limited";
    return "fallback";
  }

  function post(url, body) {
    return fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
      credentials: "omit", mode: "cors" })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { s: r.status, j: j }; }); });
  }

  function setup(f) {
    var box = f.closest(".waitlist"), done = box && box.querySelector(".wldone"), msg = done && done.querySelector(".wldone-msg");
    var st = f.querySelector(".wlstatus"), btn = f.querySelector("button[type=submit]");
    var email = f.querySelector("input[name=email]");
    var endpoint = f.getAttribute("data-endpoint") || "/api/subscribe";
    function set(name, v) { var i = f.querySelector("input[name=" + name + "]"); if (i) i.value = v; }
    var p0 = payload(f);
    set("source_url", p0.source_url); set("utm_source", p0.utm.source); set("utm_medium", p0.utm.medium); set("utm_campaign", p0.utm.campaign);
    function say(m, err) { st.textContent = m; st.classList.toggle("err", !!err); }
    function finish(kind) {
      btn.disabled = false;
      if (kind === "bad_email") { email.setAttribute("aria-invalid", "true"); say(MSG.bad_email, true); email.focus(); return; }
      if (kind !== "ok" && kind !== "pending") { say(MSG[kind] || MSG.failed, true); return; }
      try { if (W.ssTrack) W.ssTrack("subscribe"); } catch (e) {}
      if (kind === "pending" && msg) { done.querySelector(".wldone-h").textContent = "You are on the list"; msg.textContent = PENDING; }
      f.hidden = true;
      if (done) { done.hidden = false; done.focus(); } else say(kind === "pending" ? PENDING : "Check your email to confirm.");
    }
    f.setAttribute("novalidate", "");
    f.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var body = payload(f), v = body.email;
      if (!v || v.length > 254 || !EMAIL.test(v)) { finish("bad_email"); return; }
      email.removeAttribute("aria-invalid");
      btn.disabled = true; say("Sending...");
      function local() {
        return post("/api/subscribe", body).then(function (r) {
          var k = classify(r.s, r.j); finish(k === "fallback" ? "failed" : k);
        });
      }
      var first = endpoint === "/api/subscribe" ? local() : post(endpoint, body).then(function (r) {
        var k = classify(r.s, r.j);
        return k === "fallback" ? local() : finish(k);
      }, local);
      first.catch(function () { finish("failed"); });
    });
  }
  W.ssWaitlist = { payload: payload, classify: classify };
  function start() { var fs = D.querySelectorAll("form[data-waitlist]"); for (var i = 0; i < fs.length; i++) setup(fs[i]); }
  if (D.readyState === "loading") D.addEventListener("DOMContentLoaded", start); else start();
})();

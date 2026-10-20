/* StudyStore launch waitlist ("Get launch day access", built by waitlist.py).
 * Enhances form[data-waitlist]: posts JSON {email, exam_month, source_page, utm_source, utm_campaign, hp}
 * to /api/subscribe, shows the confirmation in place, moves focus to it, and records an anonymous
 * 'subscribe' event through exp.js (window.ssTrack). The email itself is never sent to analytics.
 * Without JS the form is a plain HTML post to the same endpoint. */
(function () {
  "use strict";
  var D = document, W = window;
  var ERRORS = { bad_email: "That email address does not look right. Please check it.",
    too_large: "Something went wrong. Please try again.", bad_json: "Something went wrong. Please try again." };
  var EMAIL = /^[^\s@]{1,64}@[^\s@]+\.[A-Za-z]{2,24}$/;
  function firstTouch(k) {
    var v = ""; try { v = new URLSearchParams(location.search).get(k) || W.sessionStorage.getItem("ss_" + k) || ""; } catch (e) {}
    return /^[A-Za-z0-9_.\-]{1,60}$/.test(v) ? v : "";
  }
  function setup(f) {
    var box = f.closest(".waitlist"), done = box && box.querySelector(".wldone");
    var st = f.querySelector(".wlstatus"), btn = f.querySelector("button[type=submit]");
    var email = f.querySelector("input[name=email]");
    function set(name, v) { var i = f.querySelector("input[name=" + name + "]"); if (i) i.value = v; }
    set("source_page", location.pathname);
    set("utm_source", firstTouch("utm_source"));
    set("utm_campaign", firstTouch("utm_campaign"));
    function say(msg, err) { st.textContent = msg; st.classList.toggle("err", !!err); }
    f.setAttribute("novalidate", "");
    f.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var v = (email.value || "").trim();
      if (!v || v.length > 254 || !EMAIL.test(v)) {
        email.setAttribute("aria-invalid", "true"); say(ERRORS.bad_email, true); email.focus(); return;
      }
      email.removeAttribute("aria-invalid");
      var body = { email: v, exam_month: f.querySelector("select[name=exam_month]").value,
        source_page: location.pathname, utm_source: firstTouch("utm_source"), utm_campaign: firstTouch("utm_campaign"),
        hp: (f.querySelector("input[name=hp]") || {}).value || "" };
      btn.disabled = true; say("Sending...");
      fetch("/api/subscribe", { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body), credentials: "omit" })
        .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { j._status = r.status; return j; }); })
        .then(function (j) {
          btn.disabled = false;
          if (!j.ok) { say(ERRORS[j.error] || "Could not join the list just now. Please try again later.", true); return; }
          try { if (W.ssTrack) W.ssTrack("subscribe"); } catch (e) {}
          f.hidden = true;
          if (done) { done.hidden = false; done.focus(); } else say("You are on the list.");
        })
        .catch(function () { btn.disabled = false; say("Could not reach the server. Please try again.", true); });
    });
  }
  function start() { var fs = D.querySelectorAll("form[data-waitlist]"); for (var i = 0; i < fs.length; i++) setup(fs[i]); }
  if (D.readyState === "loading") D.addEventListener("DOMContentLoaded", start); else start();
})();

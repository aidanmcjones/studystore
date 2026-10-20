/* StudyStore "Report a problem or suggest something".
 * Links marked [data-report] open a native <dialog> form that posts JSON to /api/report with the
 * current path. Without JS (or without <dialog> support) the link simply goes to /report.html,
 * which has the same form as a plain HTML post.
 * Owner mode: if the owner key was saved on /owner.html (localStorage, this browser only), reports
 * carry it in the X-Owner-Key header and are fixed automatically without an approval step.
 * Also enhances /report.html (#report-form) and runs the /owner.html key form (#owner-form). */
(function () {
  "use strict";
  var D = document, KEY = "ss-owner-key";
  function getKey() { try { return localStorage.getItem(KEY) || ""; } catch (e) { return ""; } }
  function setKey(v) { try { if (v) localStorage.setItem(KEY, v); else localStorage.removeItem(KEY); return true; } catch (e) { return false; } }
  function el(tag, attrs, text) {
    var n = D.createElement(tag);
    for (var k in attrs || {}) if (Object.prototype.hasOwnProperty.call(attrs, k)) n.setAttribute(k, attrs[k]);
    if (text != null) n.textContent = text;
    return n;
  }
  var KINDS = [
    ["Problem", [["broken_link", "A link or image is broken"], ["wrong_content", "Something is wrong (a fact, answer or number)"],
                 ["typo", "Typo or unclear wording"], ["display", "The page displays badly"], ["other", "Other problem"]]],
    ["Suggestion", [["feature_content", "Suggest a topic, note or practice page"], ["feature_other", "Another idea for the site"]]]
  ];
  var ERRORS = {
    message_too_short: "Please add a little more detail (at least 10 characters).",
    message_too_long: "Please keep it under 1500 characters.",
    bad_kind: "Please pick a category.", bad_page: "That page address does not look right.",
    bad_ref: "The card or question field accepts letters, numbers, spaces, dots, dashes and underscores (max 40).",
    rate_limited: "Too many reports from here just now. Please try again later.",
    bad_owner_key: "Owner key not accepted. Open /owner.html to sign in again, or sign out to send as a visitor."
  };

  function buildForm(withRef, refLabel) {
    var f = el("form", { "class": "rform", novalidate: "" });
    var kl = el("label", null, "What is it about?");
    var sel = el("select", { name: "kind", required: "" });
    KINDS.forEach(function (g) {
      var og = el("optgroup", { label: g[0] });
      g[1].forEach(function (o) { og.appendChild(el("option", { value: o[0] }, o[1])); });
      sel.appendChild(og);
    });
    kl.appendChild(sel); f.appendChild(kl);
    var ml = el("label", null, "Details");
    ml.appendChild(el("textarea", { name: "message", rows: "5", minlength: "10", maxlength: "1500", required: "",
      placeholder: "What did you notice, or what would you like to see?" }));
    f.appendChild(ml);
    if (withRef) {
      var rl = el("label", null, refLabel || "Card or question number (optional)");
      rl.appendChild(el("input", { name: "ref", maxlength: "40", autocomplete: "off" }));
      f.appendChild(rl);
    }
    var hp = el("div", { "class": "rhp", "aria-hidden": "true" });
    var hpl = el("label", null, "Leave this empty");
    hpl.appendChild(el("input", { name: "hp", tabindex: "-1", autocomplete: "off" }));
    hp.appendChild(hpl); f.appendChild(hp);
    f.appendChild(el("p", { "class": "meta" }, "We store only this page's address, the category and what you type. No email, IP address or cookies."));
    var act = el("div", { "class": "ractions" });
    act.appendChild(el("button", { type: "submit", "class": "btn small" }, "Send"));
    act.appendChild(el("button", { type: "button", "class": "btn small ghost", "data-close": "" }, "Close"));
    f.appendChild(act);
    f.appendChild(el("p", { "class": "rstatus", role: "status", "aria-live": "polite" }));
    return f;
  }

  function wire(form, pageFn, onDone) {
    var status = form.querySelector(".rstatus");
    function show(msg, err) { status.textContent = msg; status.className = "rstatus" + (err ? " err" : ""); }
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var v = function (n) { var x = form.elements[n]; return x ? String(x.value || "") : ""; };
      var msg = v("message").trim();
      if (msg.length < 10) { show(ERRORS.message_too_short, true); form.elements.message.focus(); return; }
      var btn = form.querySelector("button[type=submit]"); btn.disabled = true; show("Sending...");
      var headers = { "Content-Type": "application/json" }, key = getKey();
      if (key) headers["X-Owner-Key"] = key;
      fetch("/api/report", { method: "POST", headers: headers, credentials: "omit",
        body: JSON.stringify({ page: pageFn(), kind: v("kind"), message: msg, ref: v("ref").trim(), hp: v("hp") }) })
        .then(function (r) {
          if (r.ok) {
            show(key ? "Thanks. Owner report saved: it will be fixed automatically." :
              "Thanks, your report was sent. We review every one before anything changes.");
            form.elements.message.value = ""; if (form.elements.ref) form.elements.ref.value = "";
            if (onDone) onDone();
            return;
          }
          return r.json().catch(function () { return {}; }).then(function (j) {
            show(ERRORS[j && j.error] || "Sorry, that did not send. Please try again in a moment.", true);
          });
        })
        .catch(function () { show("Sorry, that did not send. Check your connection and try again.", true); })
        .then(function () { btn.disabled = false; });
    });
  }

  function ownerBadge(container) {
    var p = container.querySelector(".rowner");
    if (!p) { p = el("p", { "class": "rowner mono" }); container.insertBefore(p, container.firstChild.nextSibling); }
    p.textContent = getKey() ? "Owner: will be fixed automatically" : "";
    p.hidden = !getKey();
  }

  var dlg = null;
  function openDialog(link) {
    var withRef = link.hasAttribute("data-report-ref");
    if (dlg) dlg.remove();
    dlg = el("dialog", { "class": "rdialog", "aria-labelledby": "rd-title" });
    dlg.appendChild(el("h2", { id: "rd-title" }, "Report a problem or suggest something"));
    var f = buildForm(withRef, link.getAttribute("data-report-ref"));
    dlg.appendChild(f);
    D.body.appendChild(dlg);
    ownerBadge(dlg);
    wire(f, function () { return location.pathname; });
    f.querySelector("[data-close]").addEventListener("click", function () { dlg.close(); });
    dlg.addEventListener("close", function () { link.focus(); });
    dlg.showModal();
    f.elements.kind.focus();
  }

  D.addEventListener("click", function (ev) {
    var a = ev.target.closest && ev.target.closest("a[data-report]");
    if (!a || ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.button) return;
    if (typeof HTMLDialogElement !== "function" || !window.fetch) return; // fall back to /report.html
    ev.preventDefault();
    openDialog(a);
  });

  // /report.html: same form as a plain post; with JS it sends JSON and prefills the page field.
  var rf = D.getElementById("report-form");
  if (rf) {
    var pg = rf.elements.page, q = /[?&]page=([^&#]*)/.exec(location.search);
    if (pg && !pg.value) {
      if (q) pg.value = decodeURIComponent(q[1]);
      else if (D.referrer && D.referrer.indexOf(location.origin + "/") === 0) pg.value = D.referrer.slice(location.origin.length).split(/[?#]/)[0];
    }
    ownerBadge(rf.parentNode);
    wire(rf, function () { return pg ? pg.value.trim() : "/"; });
    var c = rf.querySelector("[data-close]"); if (c) c.hidden = true;
  }

  // /owner.html: save or remove the owner key in this browser after the server accepts it.
  var of = D.getElementById("owner-form");
  if (of) {
    var st = D.getElementById("owner-status"), out = D.getElementById("owner-signout");
    var paint = function (msg) {
      var on = !!getKey();
      st.textContent = msg || (on ? "Owner mode on in this browser." : "Owner mode off.");
      out.hidden = !on; of.hidden = on;
    };
    of.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var k = String(of.elements.key.value || "").trim();
      if (k.length < 32) { st.textContent = "That does not look like the owner key."; return; }
      st.textContent = "Checking...";
      fetch("/api/reports", { headers: { "X-Owner-Key": k }, credentials: "omit" }).then(function (r) {
        of.elements.key.value = "";
        if (r.status === 200) paint(setKey(k) ? "Owner mode on in this browser." : "Key accepted, but this browser blocks storage, so owner mode cannot stay on.");
        else paint(r.status === 401 ? "Key not accepted." : "Could not check the key (HTTP " + r.status + ").");
      }).catch(function () { st.textContent = "Could not reach the server."; });
    });
    out.addEventListener("click", function () { setKey(""); paint("Signed out. Owner mode off."); });
    paint();
  }
})();

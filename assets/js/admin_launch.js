/* StudyStore launch switch (/admin/launch.html).
 * One GO button with an inline confirm (second click), the preflight checklist written by ops/launch.py,
 * and live step progress polled every 5 s while the launch is requested or running.
 * Every request carries the owner key saved on /owner.html (X-Owner-Key). DB text uses textContent only. */
(function () {
  "use strict";
  var D = document, go = D.getElementById("launch-go");
  if (!go) return;
  var key = ""; try { key = localStorage.getItem("ss-owner-key") || ""; } catch (e) {}
  var status = D.getElementById("admin-status"), note = D.getElementById("launch-confirm-note"),
      cancel = D.getElementById("launch-cancel"), reset = D.getElementById("launch-reset"),
      pre = D.getElementById("launch-preflight"), steps = D.getElementById("launch-steps"),
      log = D.getElementById("launch-log"), preWhen = D.getElementById("launch-preflight-when");
  var armed = false, timer = null, state = "idle";
  function el(tag, cls, text) { var n = D.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = String(text); return n; }
  function clear(n) { while (n.firstChild) n.removeChild(n.firstChild); }
  function when(ts) { return ts ? new Date(ts * 1000).toLocaleString() : ""; }
  if (!key) { status.textContent = "Owner mode is off in this browser. Sign in on the owner page first."; return; }

  function api(opts) {
    opts = opts || {}; opts.headers = opts.headers || {}; opts.headers["X-Owner-Key"] = key; opts.credentials = "omit";
    return fetch("/api/launch", opts).then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { j._status = r.status; return j; }); });
  }
  function row(list, label, cls, name, detail) {
    var li = el("li"); li.appendChild(el("span", "lk " + cls, label)); var b = el("span");
    b.appendChild(el("strong", null, name)); if (detail) b.appendChild(el("span", "meta", "  " + detail)); li.appendChild(b); list.appendChild(li);
  }
  function disarm() { armed = false; go.classList.remove("confirm"); go.textContent = "GO"; note.hidden = true; cancel.hidden = true; }

  function render(j) {
    var v = j.value || {}; state = j.state || v.state || "idle";
    var label = { idle: "Ready. Nothing launched yet.", requested: "GO received. Waiting for the launcher (up to 5 minutes).",
      running: "Launching now.", done: "Launch done.", failed: "Launch failed. See the failing step below, fix it, then press GO again." }[state] || state;
    status.textContent = label + (j.note ? " (" + j.note + ")" : "") + "  Updated " + new Date().toLocaleTimeString() + ".";
    go.disabled = !(state === "idle" || state === "failed");
    if (go.disabled) disarm();
    reset.hidden = !(state === "failed" || state === "done" || state === "requested");
    clear(pre);
    var pf = v.preflight || [];
    if (!pf.length) pre.appendChild(el("li", "meta", "No preflight yet. Run python3 ops/launch.py preflight on the Mac."));
    pf.forEach(function (c) { row(pre, c.ok ? "ok" : "not yet", c.ok ? "ok" : "bad", c.name, c.detail); });
    preWhen.textContent = v.preflight_ts ? "Checked " + when(v.preflight_ts) + " by the launcher." : "Written by the launcher (ops/launch.py preflight).";
    clear(steps);
    var st = v.steps || [];
    if (!st.length) steps.appendChild(el("li", "meta", "No steps yet."));
    st.forEach(function (s) {
      var cls = s.status === "done" ? "ok" : (s.status === "failed" ? "bad" : "wait");
      row(steps, s.status || "todo", cls, s.name, s.detail);
    });
    log.hidden = !v.log; log.textContent = v.log || "";
    clearTimeout(timer);
    if (state === "requested" || state === "running") timer = setTimeout(load, 5000);
  }
  function load() {
    api().then(function (j) {
      if (j._status === 401) { status.textContent = "Owner key not accepted. Sign in again on the owner page."; return; }
      if (!j.ok) { status.textContent = "Could not load launch state (" + (j.error || j._status) + ")."; return; }
      render(j);
    }).catch(function () { status.textContent = "Could not reach the server."; clearTimeout(timer); timer = setTimeout(load, 5000); });
  }
  function post(action) {
    return api({ method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: action }) })
      .then(function (j) { if (j.value) render(j); else status.textContent = "Could not " + action + " (" + (j.error || j._status) + ")."; });
  }
  go.addEventListener("click", function () {
    if (go.disabled) return;
    if (!armed) { armed = true; go.classList.add("confirm"); go.textContent = "Confirm GO"; note.hidden = false; cancel.hidden = false; return; }
    disarm(); go.disabled = true; status.textContent = "Sending GO...";
    post("go");
  });
  cancel.addEventListener("click", disarm);
  reset.addEventListener("click", function () { post("reset"); });
  D.getElementById("admin-reload").addEventListener("click", load);
  load();
})();

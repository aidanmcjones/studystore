/* StudyStore owner approval page (/admin/reports.html).
 * Lists pending public reports with Approve / Reject, the approved work queue, and recent
 * resolutions. Every request carries the owner key saved on /owner.html (X-Owner-Key).
 * Report text is untrusted visitor input: it is only ever rendered with textContent. */
(function () {
  "use strict";
  var D = document, root = D.getElementById("admin-root");
  if (!root) return;
  var key = ""; try { key = localStorage.getItem("ss-owner-key") || ""; } catch (e) {}
  var status = D.getElementById("admin-status");
  function el(tag, cls, text) { var n = D.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = String(text); return n; }
  function when(ts) { return ts ? new Date(ts * 1000).toISOString().slice(0, 16).replace("T", " ") : ""; }
  if (!key) { status.textContent = "Owner mode is off in this browser. Sign in on the owner page first."; return; }

  function api(path, opts) {
    opts = opts || {}; opts.headers = opts.headers || {}; opts.headers["X-Owner-Key"] = key; opts.credentials = "omit";
    return fetch(path, opts).then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { j._status = r.status; return j; }); });
  }

  function item(r, actions) {
    var li = el("li");
    var head = el("p", "meta mono", "#" + r.id + "  " + r.type + " / " + r.kind + "  " + r.source + "  " + when(r.ts) +
      (r.requests > 1 ? "  x" + r.requests : "") + "  status: " + r.status);
    li.appendChild(head);
    var pg = el("p", "meta"); pg.appendChild(el("span", null, "Page: ")); var a = el("a", null, r.page);
    a.href = r.page; a.rel = "nofollow noopener"; a.target = "_blank"; pg.appendChild(a);
    if (r.ref) pg.appendChild(el("span", null, "  Ref: " + r.ref));
    li.appendChild(pg);
    li.appendChild(el("p", "rmsg", r.message));
    if (r.approval_note) li.appendChild(el("p", "meta", "Approval note: " + r.approval_note));
    if (r.resolution) li.appendChild(el("p", "meta", "Resolution: " + r.resolution));
    if (actions) {
      var note = el("input"); note.type = "text"; note.maxLength = 200; note.placeholder = "Optional note (write build to allow a code feature)";
      note.setAttribute("aria-label", "Note for report " + r.id);
      var row = el("div", "ractions");
      [["approve", "Approve", "btn small"], ["reject", "Reject", "btn small ghost"]].forEach(function (b) {
        var btn = el("button", b[2], b[1]); btn.type = "button";
        btn.addEventListener("click", function () {
          btn.disabled = true;
          api("/api/reports/" + r.id, { method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: b[0], note: note.value }) }).then(function (j) {
            if (j.ok) load(); else { btn.disabled = false; status.textContent = "Could not " + b[0] + " #" + r.id + ": " + (j.error || j._status); }
          });
        });
        row.appendChild(btn);
      });
      var f = el("div", "rform"); f.appendChild(note); li.appendChild(f); li.appendChild(row);
    }
    return li;
  }

  function section(title, rows, actions, empty) {
    var s = el("section"); s.appendChild(el("h2", null, title + " (" + rows.length + ")"));
    if (!rows.length) { s.appendChild(el("p", "meta", empty)); return s; }
    var ul = el("ul", "rlist"); rows.forEach(function (r) { ul.appendChild(item(r, actions)); }); s.appendChild(ul);
    return s;
  }

  function load() {
    status.textContent = "Loading...";
    api("/api/reports").then(function (j) {
      if (j._status === 401) { status.textContent = "Owner key not accepted. Sign in again on the owner page."; return; }
      if (!j.ok) { status.textContent = "Could not load reports (" + (j.error || j._status) + ")."; return; }
      status.textContent = "Updated " + new Date().toLocaleTimeString() + ".";
      while (root.firstChild) root.removeChild(root.firstChild);
      root.appendChild(section("Waiting for approval", j.pending, true, "Nothing waiting."));
      root.appendChild(section("Approved, in the fix queue", j.queue, false, "Queue is empty."));
      root.appendChild(section("Recently resolved", j.recent, false, "Nothing resolved yet."));
    }).catch(function () { status.textContent = "Could not reach the server."; });
  }
  var rl = D.getElementById("admin-reload"); if (rl) rl.addEventListener("click", load);
  load();
})();

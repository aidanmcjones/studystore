/* StudyStore owner launch-list stats (/admin/subscribers.html).
 * GET /api/subscribers with the owner key saved on /owner.html (X-Owner-Key): totals, last 14 days,
 * by source page, by utm_source and by test month. Export CSV downloads the active list.
 * All DB text is rendered with textContent only. */
(function () {
  "use strict";
  var D = document, root = D.getElementById("subs-root");
  if (!root) return;
  var key = ""; try { key = localStorage.getItem("ss-owner-key") || ""; } catch (e) {}
  var status = D.getElementById("admin-status");
  function el(tag, cls, text) { var n = D.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = String(text); return n; }
  if (!key) { status.textContent = "Owner mode is off in this browser. Sign in on the owner page first."; return; }
  function get(path) { return fetch(path, { headers: { "X-Owner-Key": key }, credentials: "omit", cache: "no-store" }); }

  function table(title, label, rows) {
    var s = el("section"); s.appendChild(el("h2", null, title));
    if (!rows.length) { s.appendChild(el("p", "meta", "No signups yet.")); return s; }
    var max = Math.max.apply(null, rows.map(function (r) { return r.n; })) || 1;
    var t = el("table", "stable"), hr = el("tr");
    hr.appendChild(el("th", null, label)); hr.appendChild(el("th", "n", "Signups"));
    var th = el("thead"); th.appendChild(hr); t.appendChild(th);
    var tb = el("tbody");
    rows.forEach(function (r) {
      var tr = el("tr"), k = el("td"), bar = el("span", "sbar");
      bar.style.width = Math.max(2, Math.round(80 * r.n / max)) + "px"; bar.setAttribute("aria-hidden", "true");
      k.appendChild(bar); k.appendChild(D.createTextNode(String(r.k != null ? r.k : r.d)));
      tr.appendChild(k); tr.appendChild(el("td", "n", r.n)); tb.appendChild(tr);
    });
    t.appendChild(tb); s.appendChild(t); return s;
  }

  function load() {
    status.textContent = "Loading...";
    get("/api/subscribers").then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { j._status = r.status; return j; }); })
      .then(function (j) {
        if (j._status === 401) { status.textContent = "Owner key not accepted. Sign in again on the owner page."; return; }
        if (!j.ok) { status.textContent = "Could not load subscribers (" + (j.error || j._status) + ")."; return; }
        status.textContent = "Updated " + new Date().toLocaleTimeString() + ".";
        while (root.firstChild) root.removeChild(root.firstChild);
        var tiles = el("div", "stile");
        var last14 = j.by_day.reduce(function (s, x) { return s + x.n; }, 0);
        [["Active", j.totals.active], ["Last 14 days", last14], ["Unsubscribed", j.totals.unsubscribed], ["All time", j.totals.total]].forEach(function (t) {
          var d = el("div"); d.appendChild(el("b", null, t[1])); d.appendChild(el("span", "meta", t[0])); tiles.appendChild(d);
        });
        root.appendChild(tiles);
        root.appendChild(table("Last 14 days (UTC, all signups)", "Day", j.by_day.slice().reverse().map(function (x) { return { k: x.d, n: x.n }; })));
        root.appendChild(table("By source page (active)", "Page", j.by_source_page));
        root.appendChild(table("By utm_source (active)", "utm_source", j.by_utm_source));
        root.appendChild(table("By test month (active)", "Month", j.by_exam_month));
      }).catch(function () { status.textContent = "Could not reach the server."; });
  }

  function exportCsv() {
    status.textContent = "Preparing CSV...";
    get("/api/subscribers?export=csv").then(function (r) {
      if (!r.ok) { status.textContent = "Export failed (" + r.status + ")."; return null; }
      return r.blob();
    }).then(function (b) {
      if (!b) return;
      var a = el("a"); a.href = URL.createObjectURL(b);
      a.download = "studystore-subscribers-" + new Date().toISOString().slice(0, 10) + ".csv";
      D.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000);
      status.textContent = "CSV downloaded.";
    }).catch(function () { status.textContent = "Could not reach the server."; });
  }
  var rl = D.getElementById("admin-reload"); if (rl) rl.addEventListener("click", load);
  var ex = D.getElementById("admin-export"); if (ex) ex.addEventListener("click", exportCsv);
  load();
})();

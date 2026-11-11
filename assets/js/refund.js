/* /refund/?c=<code>: one-time refund confirmation. The code is read from the URL, but nothing is sent on page load:
   only a click on the button POSTs a refund_confirm event to /api/e (the existing anonymous beacon). Link scanners and
   unfurlers load the page without running a click, so they cannot confirm. */
(function () {
  var code = (new URLSearchParams(location.search).get("c") || "").toLowerCase();
  var $ = function (id) { return document.getElementById(id); };
  var go = $("rc-go");
  if (!go) return;
  if (!/^[a-f0-9]{32}$/.test(code)) {
    $("rc-bad").hidden = false;
    $("rc-actions").hidden = true;
    return;
  }
  go.disabled = false;
  go.addEventListener("click", function () {
    go.disabled = true;
    var sid = "";
    try { var a = new Uint8Array(12); crypto.getRandomValues(a); a.forEach(function (b) { sid += ("0" + b.toString(16)).slice(-2); }); } catch (e) {}
    if (sid.length !== 24) sid = Date.now().toString(16).padStart(24, "0").slice(-24);
    fetch("/api/e", { method: "POST", headers: { "Content-Type": "application/json" }, keepalive: true,
      body: JSON.stringify({ sid: sid, event: "refund_confirm", page: "/refund/" + code }) })
      .then(function (r) {
        if (r.status === 204) { $("rc-done").hidden = false; $("rc-fail").hidden = true; $("rc-actions").hidden = true; return; }
        throw new Error("status " + r.status);
      })
      .catch(function () { $("rc-fail").hidden = false; go.disabled = false; });
  });
})();

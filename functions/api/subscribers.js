// GET /api/subscribers : owner-only launch-list stats for /admin/subscribers.html.
// Requires X-Owner-Key (requireOwner). Returns totals and signup counts by day (last 14 days, UTC),
// by source page, by utm_source and by test month. With ?export=csv returns the active subscribers
// as a CSV download (email, exam_month, source_page, utm_source, utm_campaign, signed_up_utc).
import { requireOwner, json, empty, NO_STORE } from "../_lib/owner.js";

const DAYS = 14;

// CSV cell: quote always, double inner quotes, and neutralize spreadsheet formulas.
export function csvCell(v) {
  let s = v == null ? "" : String(v);
  if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
  return '"' + s.replace(/"/g, '""') + '"';
}

export async function onRequestGet({ request, env }) {
  const deny = await requireOwner(request, env);
  if (deny) return deny;
  const url = new URL(request.url);

  if (url.searchParams.get("export") === "csv") {
    const r = await env.DB.prepare(
      "SELECT email, exam_month, source_page, utm_source, utm_campaign, ts FROM subscribers WHERE status = 'active' ORDER BY ts ASC, id ASC").all();
    const lines = ["email,exam_month,source_page,utm_source,utm_campaign,signed_up_utc"];
    for (const x of r.results || []) {
      const when = x.ts ? new Date(x.ts * 1000).toISOString().slice(0, 19).replace("T", " ") : "";
      lines.push([x.email, x.exam_month, x.source_page, x.utm_source, x.utm_campaign, when].map(csvCell).join(","));
    }
    const day = new Date().toISOString().slice(0, 10);
    return new Response(lines.join("\r\n") + "\r\n", { status: 200, headers: { ...NO_STORE,
      "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="studystore-subscribers-${day}.csv"` } });
  }

  const since = Math.floor(Date.now() / 1000 / 86400 - (DAYS - 1)) * 86400;  // start of the UTC day 13 days ago
  const grp = (col) => env.DB.prepare(
    `SELECT COALESCE(NULLIF(${col}, ''), '(none)') AS k, COUNT(*) AS n FROM subscribers WHERE status = 'active' GROUP BY k ORDER BY n DESC, k ASC LIMIT 100`).all();
  const [tot, days, pages, sources, months] = await Promise.all([
    env.DB.prepare("SELECT COUNT(*) AS total, SUM(status = 'active') AS active, SUM(status = 'unsubscribed') AS unsubscribed, SUM(status = 'pending') AS pending FROM subscribers").first(),
    env.DB.prepare("SELECT date(ts, 'unixepoch') AS d, COUNT(*) AS n FROM subscribers WHERE ts >= ? GROUP BY d ORDER BY d ASC").bind(since).all(),
    grp("source_page"), grp("utm_source"), grp("exam_month"),
  ]);
  const got = Object.fromEntries((days.results || []).map((x) => [x.d, x.n]));
  const by_day = [];
  for (let i = 0; i < DAYS; i++) {
    const d = new Date((since + i * 86400) * 1000).toISOString().slice(0, 10);
    by_day.push({ d, n: got[d] || 0 });
  }
  const rows = (r) => (r.results || []).map((x) => ({ k: x.k, n: x.n }));
  return json(200, {
    ok: true,
    totals: { total: (tot && tot.total) || 0, active: (tot && tot.active) || 0, unsubscribed: (tot && tot.unsubscribed) || 0, pending: (tot && tot.pending) || 0 },
    by_day, by_source_page: rows(pages), by_utm_source: rows(sources), by_exam_month: rows(months),
  });
}

export async function onRequest({ request }) {
  if (request.method === "OPTIONS") return empty(204);
  return new Response("GET only", { status: 405, headers: { Allow: "GET" } });
}

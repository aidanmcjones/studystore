// POST /api/e : anonymous event collector for StudyStore experiments.
// Stores only: server timestamp, random session id, page path, experiment/variant,
// event name, referrer domain, utm_source, utm_campaign. Never stores IPs, user
// agents, cookies, or anything typed by the visitor.
const EVENTS = new Set(["view", "cta_click", "checkout_click", "sampler_click", "subscribe"]);
const MAX_BODY = 2048;
const IP_LIMIT = 60;        // requests per minute per IP, held in memory only
const SID_LIMIT = 200;      // rows per session id per hour (checked in D1)
const BOT = /bot|crawl|spider|slurp|preview|headless|lighthouse|facebookexternalhit/i;

const ipHits = new Map();   // per-isolate, never persisted
let cfgCache = null, cfgAt = 0;

function rateLimited(ip) {
  const now = Date.now(), win = Math.floor(now / 60000);
  const k = ip + "|" + win;
  const n = (ipHits.get(k) || 0) + 1;
  ipHits.set(k, n);
  if (ipHits.size > 5000) for (const key of ipHits.keys()) if (!key.endsWith("|" + win)) ipHits.delete(key);
  return n > IP_LIMIT;
}

async function experiments(env, url) {
  if (cfgCache && Date.now() - cfgAt < 300000) return cfgCache;
  const m = new Map();
  try {
    const r = await env.ASSETS.fetch(new URL("/experiments.json", url));
    const d = await r.json();
    for (const e of d.experiments || []) m.set(e.id, new Set((e.variants || []).map((v) => v.id)));
  } catch (e) {}
  cfgCache = m; cfgAt = Date.now();
  return m;
}

const clean = (s, re, max) => (typeof s === "string" && s.length <= max && re.test(s) ? s : "");
const ok = (status = 204) => new Response(null, { status, headers: { "Cache-Control": "no-store" } });

// Cross-isolate limit: a counter in this data center's edge cache, keyed by a one-way
// hash of IP + minute. It expires after about a minute and is never written to D1.
async function edgeLimited(ip) {
  try {
    const win = Math.floor(Date.now() / 60000);
    const h = await crypto.subtle.digest("SHA-256", new TextEncoder().encode("ss-rl|" + ip + "|" + win));
    const key = "https://rl.studystore.internal/" + [...new Uint8Array(h)].slice(0, 16).map((b) => b.toString(16).padStart(2, "0")).join("");
    const cache = caches.default;
    const hit = await cache.match(key);
    const n = (hit ? Number(await hit.text()) : 0) + 1;
    await cache.put(key, new Response(String(n), { headers: { "Cache-Control": "max-age=90" } }));
    return n > IP_LIMIT;
  } catch (e) { return false; }
}

export async function onRequestPost({ request, env }) {
  const ip = request.headers.get("CF-Connecting-IP") || "";
  if (rateLimited(ip) || (await edgeLimited(ip))) return ok(429);
  if (BOT.test(request.headers.get("User-Agent") || "")) return ok(204);
  const len = Number(request.headers.get("Content-Length") || 0);
  if (len > MAX_BODY) return ok(413);
  const raw = await request.text();
  if (raw.length > MAX_BODY) return ok(413);
  let b;
  try { b = JSON.parse(raw); } catch (e) { return ok(400); }
  if (!b || typeof b !== "object") return ok(400);

  const sid = clean(b.sid, /^[a-f0-9]{24}$/, 24);
  const event = EVENTS.has(b.event) ? b.event : "";
  const page = clean(b.page, /^\/[A-Za-z0-9._\-\/]*$/, 200);
  if (!sid || !event || !page) return ok(400);
  const ref = clean((b.ref_domain || "").toLowerCase(), /^[a-z0-9.\-]+$/, 100);
  const src = clean(b.utm_source || "", /^[A-Za-z0-9_.\-]+$/, 60);
  const camp = clean(b.utm_campaign || "", /^[A-Za-z0-9_.\-]+$/, 60);

  const known = await experiments(env, request.url);
  const rows = [];
  const exps = b.exps && typeof b.exps === "object" ? b.exps : {};
  for (const [id, v] of Object.entries(exps).slice(0, 10)) {
    if (known.has(id) && typeof v === "string" && known.get(id).has(v)) rows.push([id, v]);
  }
  if (!rows.length) rows.push(["", ""]);

  const ts = Math.floor(Date.now() / 1000);
  const recent = await env.DB.prepare("SELECT COUNT(*) AS n FROM events WHERE sid = ? AND ts > ?")
    .bind(sid, ts - 3600).first();
  if (recent && recent.n >= SID_LIMIT) return ok(429);

  const stmt = env.DB.prepare(
    "INSERT INTO events (ts, sid, page, exp, variant, event, ref_domain, utm_source, utm_campaign) VALUES (?,?,?,?,?,?,?,?,?)");
  await env.DB.batch(rows.map(([id, v]) => stmt.bind(ts, sid, page, id, v, event, ref, src, camp)));
  return ok(204);
}

export async function onRequest({ request }) {
  if (request.method === "OPTIONS") return ok(204);
  return new Response("POST only", { status: 405, headers: { Allow: "POST" } });
}

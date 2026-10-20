// POST /api/ls-webhook : Lemon Squeezy order_created webhook -> purchases table.
// Inactive (503) until the LS_WEBHOOK_SECRET secret is set on the Pages project:
//   npx wrangler@3.114.0 pages secret put LS_WEBHOOK_SECRET --project-name studystore
// Stores only order id, time, total, test flag and the exp_* / utm_* custom data keys.
// No names, emails or addresses are stored.
async function hmacHex(secret, body) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(body));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
function safeEqual(a, b) {
  if (a.length !== b.length) return false;
  let r = 0; for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}
export async function onRequestPost({ request, env }) {
  if (!env.LS_WEBHOOK_SECRET) return new Response("not configured", { status: 503 });
  const raw = await request.text();
  if (raw.length > 200000) return new Response("too large", { status: 413 });
  const sig = (request.headers.get("X-Signature") || "").toLowerCase();
  if (!sig || !safeEqual(await hmacHex(env.LS_WEBHOOK_SECRET, raw), sig)) return new Response("bad signature", { status: 401 });
  let d; try { d = JSON.parse(raw); } catch (e) { return new Response("bad json", { status: 400 }); }
  const meta = d.meta || {};
  if (meta.event_name !== "order_created" || !d.data) return new Response("ignored", { status: 200 });
  const custom = {};
  for (const [k, v] of Object.entries(meta.custom_data || {})) {
    if (/^(exp_[a-z0-9_]{1,40}|utm_source|utm_campaign)$/.test(k) && typeof v === "string" && v.length <= 60) custom[k] = v;
  }
  const a = d.data.attributes || {};
  await env.DB.prepare("INSERT OR IGNORE INTO purchases (order_id, ts, custom, total, test_mode) VALUES (?,?,?,?,?)")
    .bind(String(d.data.id), Math.floor(Date.now() / 1000), JSON.stringify(custom), Number(a.total) || 0, a.test_mode ? 1 : 0)
    .run();
  return new Response("ok", { status: 200 });
}

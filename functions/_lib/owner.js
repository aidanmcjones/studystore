// Shared helpers for the report intake and the owner-only approval API.
// Not a route: it exports no onRequest handlers.
//
// Owner identity: the owner holds a high-entropy key (in the macOS Keychain, set by ops/owner_key.sh
// in the private repo). Only its sha256 hex digest is stored, as the Pages secret OWNER_KEY_SHA256.
// Requests carry the key in the X-Owner-Key header; we hash it and compare in constant time.

export async function sha256hex(s) {
  const h = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return [...new Uint8Array(h)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Constant-time comparison of two equal-length lowercase hex strings.
export function safeEqualHex(a, b) {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const n = Math.max(a.length, b.length, 64);
  let diff = a.length ^ b.length;
  for (let i = 0; i < n; i++) diff |= (a.charCodeAt(i) | 0) ^ (b.charCodeAt(i) | 0);
  return diff === 0;
}

// "owner" when the header key hashes to OWNER_KEY_SHA256, "bad" when a key was sent but does not
// match (or the secret is not configured), "none" when no key header was sent.
export async function ownerStatus(request, env) {
  const key = request.headers.get("X-Owner-Key");
  if (key == null || key === "") return "none";
  const want = String((env && env.OWNER_KEY_SHA256) || "").trim().toLowerCase();
  if (!/^[0-9a-f]{64}$/.test(want) || key.length < 32 || key.length > 256) {
    await sha256hex(key || "x"); // keep timing similar
    return "bad";
  }
  return safeEqualHex(await sha256hex(key), want) ? "owner" : "bad";
}

// Fixed-window counters: in memory per isolate, plus this data center's edge cache keyed by a
// one-way hash (so counts survive isolate churn). Never written to D1; they expire on their own.
const mem = new Map();
export function _resetCounters() { mem.clear(); }

export async function overLimit(id, label, windowSecs, limit) {
  const win = Math.floor(Date.now() / 1000 / windowSecs);
  const k = label + "|" + id + "|" + win;
  const n = (mem.get(k) || 0) + 1;
  mem.set(k, n);
  if (mem.size > 5000) for (const key of mem.keys()) if (!key.endsWith("|" + win)) mem.delete(key);
  if (n > limit) return true;
  try {
    if (typeof caches === "undefined" || !caches.default) return false;
    const url = "https://rl.studystore.internal/fb/" + (await sha256hex("ss-fb|" + k)).slice(0, 32);
    const hit = await caches.default.match(url);
    const e = (hit ? Number(await hit.text()) : 0) + 1;
    await caches.default.put(url, new Response(String(e), { headers: { "Cache-Control": "max-age=" + (windowSecs + 30) } }));
    return e > limit;
  } catch (e) { return false; }
}

// Remove control and invisible formatting characters (keep newline and tab), collapse blank runs, trim.
export function stripControl(s) {
  return String(s).replace(/\r\n?/g, "\n")
    .replace(/[\u0000-\u0008\u000B-\u001F\u007F-\u009F\u200B-\u200F\u2028-\u202E\u2060-\u206F\uFEFF]/g, "")
    .replace(/\n{3,}/g, "\n\n").trim();
}

export const NO_STORE = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" };
export const empty = (status) => new Response(null, { status, headers: NO_STORE });
export const json = (status, obj) =>
  new Response(JSON.stringify(obj), { status, headers: { ...NO_STORE, "Content-Type": "application/json" } });

// Gate for owner-only routes: null when the request carries the owner key, else a 401/429 response.
export async function requireOwner(request, env) {
  const ip = request.headers.get("CF-Connecting-IP") || "";
  if (await overLimit(ip, "adm-m", 60, 30)) return json(429, { ok: false, error: "rate_limited" });
  const who = await ownerStatus(request, env);
  if (who !== "owner") return json(401, { ok: false, error: "owner_key_required" });
  return null;
}

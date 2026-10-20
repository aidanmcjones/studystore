// GET /api/unsubscribe?t=<token> : one-click unsubscribe from the launch list (link in every email).
// Sets status 'unsubscribed' for the row with that random token and answers a small HTML page.
// POST is accepted too (RFC 8058 List-Unsubscribe-Post one-click). Reveals nothing about the address.
const TOKEN_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

const page = (title, msg, status = 200) => new Response(
  `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex"><title>${title} | StudyStore</title><link rel="stylesheet" href="/assets/style.css"></head>
<body><main class="wrap narrow legal"><h1>${title}</h1><p>${msg}</p><p><a href="/">Back to StudyStore</a> &middot; <a href="/privacy.html">Privacy policy</a></p></main></body></html>`,
  { status, headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex", "Content-Type": "text/html; charset=utf-8" } });

async function unsubscribe(request, env) {
  const t = (new URL(request.url).searchParams.get("t") || "").trim().toLowerCase();
  if (!TOKEN_RE.test(t)) return page("Link not recognized", "This unsubscribe link is incomplete. Copy the whole link from the email, or email support and we will remove you by hand.", 400);
  const res = await env.DB.prepare("UPDATE subscribers SET status = 'unsubscribed' WHERE unsub_token = ?").bind(t).run();
  if (!(res && res.meta && res.meta.changes)) {
    return page("Link not recognized", "We could not find this link. If you still get emails from us, reply to one or email support and we will remove you by hand.", 404);
  }
  return page("You are unsubscribed", "You will not get any more StudyStore emails. If you change your mind, you can join the launch list again on any page.");
}

export const onRequestGet = ({ request, env }) => unsubscribe(request, env);
export const onRequestPost = ({ request, env }) => unsubscribe(request, env);

export async function onRequest({ request }) {
  return new Response("GET or POST only", { status: 405, headers: { Allow: "GET, POST" } });
}

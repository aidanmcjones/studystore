// Pages middleware: one indexable URL per page.
// - apex studystore.co -> https://www.studystore.co (301 GET/HEAD, 308 other methods so POST bodies survive)
// - /x.html -> /x and /d/index.html -> /d/ in the SAME hop (Pages alone answers these with a 308, and an apex
//   .html URL took two hops: apex -> www/x.html -> www/x). Query strings are kept.
// - retired URLs (functions/_lib/redirects.js, generated with _redirects) go to their final page in the same hop.
// - *.pages.dev (production alias and branch previews) is served as-is but marked noindex, so the Pages host
//   never competes with www in search.
import { REDIRECTS } from "./_lib/redirects.js";

const CANON = "https://www.studystore.co";

export function cleanPath(p) {
  if (p.startsWith("/api/") || p.startsWith("/cdn-cgi/")) return p;
  if (p === "/index.html") return "/";
  if (p.endsWith("/index.html")) return p.slice(0, -"index.html".length);
  if (p.endsWith(".html")) return p.slice(0, -".html".length);
  return p;
}

export async function onRequest(context) {
  const url = new URL(context.request.url);
  const host = url.hostname;
  const method = context.request.method;
  const read = method === "GET" || method === "HEAD";
  if (host === "studystore.co" || host === "www.studystore.co") {
    let path = read ? cleanPath(url.pathname) : url.pathname;
    if (read && REDIRECTS[path]) path = REDIRECTS[path]; // retired product or merged note: straight to the final page
    if (host === "studystore.co" || path !== url.pathname) {
      return Response.redirect(CANON + path + url.search, read ? 301 : 308);
    }
    return context.next();
  }
  const res = await context.next();
  if (host.endsWith(".pages.dev")) {
    const out = new Response(res.body, res);
    out.headers.set("X-Robots-Tag", "noindex");
    return out;
  }
  return res;
}

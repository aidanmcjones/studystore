// Pages middleware: redirect the apex host (studystore.co) to www so there is one canonical host.
// www and every other host pass straight through to the next handler untouched.
export async function onRequest(context) {
  const url = new URL(context.request.url);
  if (url.hostname === "studystore.co") {
    const method = context.request.method;
    const status = method === "GET" || method === "HEAD" ? 301 : 308;
    return Response.redirect("https://www.studystore.co" + url.pathname + url.search, status);
  }
  return context.next();
}

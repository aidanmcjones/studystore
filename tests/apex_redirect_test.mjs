// Unit tests for the apex-to-www redirect (functions/_middleware.js).
// Run: node tests/apex_redirect_test.mjs   (Node 22+, no dependencies)
import { onRequest } from "../functions/_middleware.js";

let pass = 0, fail = 0;
const ok = (cond, name) => { if (cond) pass++; else { fail++; console.log("FAIL:", name); } };

async function run(url, method = "GET") {
  let nexted = 0;
  const res = await onRequest({
    request: new Request(url, { method, body: method === "POST" ? "{}" : undefined }),
    next: async () => { nexted++; return new Response("next", { status: 200 }); },
  });
  return { res, nexted };
}

let r = await run("https://studystore.co/notes/x?a=1&b=2");
ok(r.res.status === 301, "apex GET is 301");
ok(r.res.headers.get("location") === "https://www.studystore.co/notes/x?a=1&b=2", "path and query kept");
ok(r.nexted === 0, "apex does not call next");

r = await run("https://studystore.co/");
ok(r.res.headers.get("location") === "https://www.studystore.co/", "apex root");

r = await run("https://studystore.co/x", "HEAD");
ok(r.res.status === 301, "apex HEAD is 301");

r = await run("https://studystore.co/api/e", "POST");
ok(r.res.status === 308, "apex POST is 308");
ok(r.res.headers.get("location") === "https://www.studystore.co/api/e", "POST location");

r = await run("https://www.studystore.co/api/e", "POST");
ok(r.res.status === 200 && r.nexted === 1, "www POST passes through");

r = await run("https://www.studystore.co/notes/x?a=1");
ok(r.res.status === 200 && r.nexted === 1, "www GET passes through");

r = await run("https://studystore.pages.dev/");
ok(r.nexted === 1, "other hosts pass through");
ok(r.res.headers.get("x-robots-tag") === "noindex", "pages.dev is noindex");

r = await run("https://abc123.studystore.pages.dev/notes/x");
ok(r.nexted === 1 && r.res.headers.get("x-robots-tag") === "noindex", "preview host is noindex");

// One hop from every duplicate form to the clean www URL.
for (const [from, to] of [
  ["https://www.studystore.co/notes/x.html", "https://www.studystore.co/notes/x"],
  ["https://www.studystore.co/notes/x.html?utm_source=a", "https://www.studystore.co/notes/x?utm_source=a"],
  ["https://studystore.co/notes/x.html", "https://www.studystore.co/notes/x"],
  ["https://www.studystore.co/index.html", "https://www.studystore.co/"],
  ["https://studystore.co/index.html", "https://www.studystore.co/"],
  ["https://www.studystore.co/practice/1c/index.html", "https://www.studystore.co/practice/1c/"],
  ["https://studystore.co/practice/1c/", "https://www.studystore.co/practice/1c/"],
]) {
  r = await run(from);
  ok(r.res.status === 301 && r.res.headers.get("location") === to && r.nexted === 0, `${from} -> ${to} in one 301`);
}

r = await run("https://www.studystore.co/notes/x");
ok(r.nexted === 1 && !r.res.headers.get("x-robots-tag"), "clean www URL is served, indexable");

r = await run("https://www.studystore.co/report.html", "POST");
ok(r.nexted === 1, "www POST to an .html path is not redirected");

r = await run("https://www.studystore.co/api/x.html");
ok(r.nexted === 1, "/api/ paths are never rewritten");

console.log(`${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);

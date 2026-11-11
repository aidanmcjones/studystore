// The sampler opt-in block must be on the home page and every note page, and post the brain contract.
// Run after `python3 build.py`: node tests/signup_test.mjs
import { readFileSync, readdirSync } from "node:fs";
import { CONSENT_TEXTS, LIST_ID, BRAIN_SUBSCRIBE_URL } from "../functions/api/subscribe.js";

let pass = 0, fail = 0;
const ok = (c, n) => { if (c) pass++; else { fail++; console.log("FAIL:", n); } };
const rd = (p) => readFileSync(new URL("../" + p, import.meta.url), "utf8");
const HEAD = "Free sample: a 3-page MCAT cheat sheet (PDF), plus 6 short high-yield lessons by email";
const esc = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;");

// Home keeps the full signup block. Notes carry the free cheat-sheet capture inside the end-of-page topic offer
// (build.py offer_block): same form contract, no separate headline.
function check(name, h, offer = false) {
  const m = offer ? h.match(/<aside class="offerblk[^"]*"[^>]*data-offer="end"[\s\S]*?<\/aside>/)
                  : h.match(/<section class="waitlist waitlist-inline" id="signup"[\s\S]*?<\/section>/);
  ok(!!m, name + (offer ? ": end offer with capture present" : ": signup block present"));
  if (!m) return;
  const b = m[0];
  if (!offer) ok(b.includes(HEAD), name + ": headline");
  ok(b.includes(`name="list_id" value="${LIST_ID}"`), name + ": list id");
  ok(b.includes(`data-endpoint="${BRAIN_SUBSCRIBE_URL}"`), name + ": brain endpoint");
  ok(b.includes(`name="consent_text" value="${esc(CONSENT_TEXTS[0])}"`), name + ": consent text is allowlisted");
  ok(/type="email"[^>]*required|required[^>]*type="email"/.test(b), name + ": email input");
  ok(/name="website"/.test(b), name + ": honeypot");
  ok(/unsubscribe/i.test(b) && /privacy(?:\.html)?\b/.test(b), name + ": unsubscribe and privacy note");
  ok(/assets\/free\/studystore-mcat-sample-cheat-sheet\.pdf/.test(b), name + ": sample PDF link");
  ok(/href="[^"]*notes\/(?:index\.html)?"/.test(offer ? h : b) || /href="index\.html"/.test(h), name + ": sampler still reachable without signup");
  ok((h.match(/data-waitlist/g) || []).length === (h.match(/id="(su|wl|cc2?|hero|go|of-mid|of-end)-email"/g) || []).length, name + ": one id per form");
}

check("home", rd("index.html"));
const notes = readdirSync(new URL("../notes/", import.meta.url)).filter((f) => f.endsWith(".html") && f !== "index.html");
ok(notes.length > 0, "notes built");
for (const f of notes) check("notes/" + f, rd("notes/" + f), true);
const ids = (rd("index.html").match(/ id="(su|wl|cc|hero)-email"/g) || []);
ok(new Set(ids).size === ids.length, "home: unique email input ids");

console.log(`signup_test: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);

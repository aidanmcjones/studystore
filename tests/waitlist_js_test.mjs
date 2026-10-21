// Tests for the free sampler opt-in in the browser (assets/js/waitlist.js) against a BUILT page's box.
// Run after `python3 build.py`:  node tests/waitlist_js_test.mjs   (Node 18+, no dependencies; a tiny fake DOM
// and a fake fetch run the real script in a vm context.)
import { readFileSync } from "node:fs";
import vm from "node:vm";

let pass = 0, fail = 0;
const ok = (cond, name) => { if (cond) pass++; else { fail++; console.log("FAIL:", name); } };
const root = new URL("../", import.meta.url);
const CONSENT = "Email me free MCAT notes, practice sets and new packs from StudyStore. Double opt-in, unsubscribe in one click.";
const BRAIN = "https://income-brain.premed-toolkit.workers.dev/api/subscribe";

// ---- the built box (home page): contract fields, verbatim consent, honeypot, privacy, no-JS action
const home = readFileSync(new URL("index.html", root), "utf8");
const box = home.slice(home.indexOf('<section class="waitlist"'), home.indexOf("</section>", home.indexOf('<section class="waitlist"')));
ok(box.includes(`data-endpoint="${BRAIN}"`), "form posts to the brain endpoint with JS");
ok(/<form class="wlform" method="post" action="\/api\/subscribe"/.test(box), "no-JS fallback posts same-origin");
ok(box.includes('name="list_id" value="studystore-mcat"'), "list_id studystore-mcat");
ok(box.includes(`name="consent_text" value="${CONSENT}"`), "consent_text field is the verbatim text");
ok(box.includes(`<span class="wlconsent">${CONSENT}</span> <a href="privacy.html">Privacy</a>`), "consent shown verbatim next to the button with the privacy link");
ok(box.indexOf('class="wlconsent"') > box.indexOf('<button type="submit"'), "consent sits right after the button");
ok(/<div class="rhp" aria-hidden="true"><label>Leave this empty <input name="website" tabindex="-1" autocomplete="off"><\/label><\/div>/.test(box), "hidden website honeypot");
ok(!/name="exam_month"|name="hp"/.test(box), "legacy fields gone");
ok(/Free MCAT sampler/.test(box) && /\d+ study notes/.test(box) && /\d+ practice sets/.test(box), "free sampler is the headline offer, with live counts");
const notesCount = (readFileSync(new URL("notes/index.html", root), "utf8").match(/<article class="notecard">/g) || []).length;
ok(box.includes(`>${notesCount} study notes</a>`), "note count in the box equals the notes index");

// ---- run waitlist.js in a fake DOM
function make(search = "?utm_source=reddit&utm_medium=post&utm_campaign=c-1&x=<b>") {
  const inputs = {};
  const mk = (name, value = "") => (inputs[name] = { name, value, attrs: {}, setAttribute(k, v) { this.attrs[k] = v; }, removeAttribute(k) { delete this.attrs[k]; }, focus() { this.focused = true; } });
  mk("email"); mk("list_id", "studystore-mcat"); mk("consent_text", CONSENT); mk("website"); mk("source_url"); mk("utm_source"); mk("utm_medium"); mk("utm_campaign");
  const status = { textContent: "", classList: { on: false, toggle(_, v) { this.on = v; } } };
  const btn = { disabled: false };
  const h = { textContent: "Check your email" }, msg = { textContent: "We sent a link" };
  const done = { hidden: true, focus() { this.focused = true; }, querySelector: (s) => (s === ".wldone-h" ? h : msg) };
  const form = { hidden: false, attrs: { "data-endpoint": BRAIN }, listeners: {},
    getAttribute(k) { return this.attrs[k]; }, setAttribute(k, v) { this.attrs[k] = v; },
    addEventListener(t, f) { this.listeners[t] = f; },
    closest: () => ({ querySelector: () => done }),
    querySelector(sel) {
      if (sel === ".wlstatus") return status;
      if (sel === "button[type=submit]") return btn;
      const m = sel.match(/name=([a-z_]+)/); return m ? inputs[m[1]] || null : null;
    } };
  const calls = [], tracked = [];
  let responder = () => ({ status: 202, body: { ok: true, status: "check_email" } });
  const fetch = async (url, init) => {
    calls.push({ url, init, body: JSON.parse(init.body) });
    const r = responder(url);
    if (r === "throw") throw new Error("network");
    return { status: r.status, json: async () => r.body };
  };
  const window = { sessionStorage: { getItem: () => null }, ssTrack: (e) => tracked.push(e) };
  const document = { readyState: "complete", querySelectorAll: () => [form], addEventListener() {} };
  const ctx = vm.createContext({ window, document, location: { search, href: "https://www.studystore.co/notes/x.html" + search + "#quiz", pathname: "/notes/x.html" },
    fetch, URLSearchParams, JSON, setTimeout, console });
  vm.runInContext(readFileSync(new URL("assets/js/waitlist.js", root), "utf8"), ctx);
  const submit = async (email) => { inputs.email.value = email; form.listeners.submit({ preventDefault() {} }); for (let i = 0; i < 10; i++) await new Promise((r) => setTimeout(r, 0)); };
  return { window, inputs, form, done, status, btn, calls, tracked, h, msg, submit, set: (f) => { responder = f; } };
}

let t = make();
ok(t.inputs.source_url.value === "https://www.studystore.co/notes/x.html", "source_url filled without query or hash");
ok(t.inputs.utm_source.value === "reddit" && t.inputs.utm_medium.value === "post" && t.inputs.utm_campaign.value === "c-1", "utm filled from the URL");
await t.submit(" Student@Example.com ");
const b = t.calls[0] && t.calls[0].body;
ok(t.calls.length === 1 && t.calls[0].url === BRAIN && t.calls[0].init.method === "POST", "202 path: one POST to the brain");
ok(t.calls[0].init.headers["Content-Type"] === "application/json" && t.calls[0].init.credentials === "omit", "JSON, no credentials");
ok(b && Object.keys(b).sort().join() === "consent_text,email,list_id,source_url,utm,website", "body has exactly the contract fields");
ok(b.email === "Student@Example.com" && b.list_id === "studystore-mcat" && b.consent_text === CONSENT && b.website === "", "body values");
ok(JSON.stringify(b.utm) === JSON.stringify({ source: "reddit", medium: "post", campaign: "c-1" }) && b.source_url === "https://www.studystore.co/notes/x.html", "utm object and source_url");
ok(t.form.hidden && !t.done.hidden && t.h.textContent === "Check your email", "check-your-email message shown");
ok(t.tracked.join() === "subscribe", "anonymous subscribe event, once");
ok(!JSON.stringify(t.tracked).includes("@"), "email never sent to analytics");

t = make(); t.set((u) => (u === BRAIN ? { status: 501, body: { error: { code: "not_implemented" } } } : { status: 202, body: { ok: true, status: "pending" } }));
await t.submit("a@b.co");
ok(t.calls.length === 2 && t.calls[1].url === "/api/subscribe" && JSON.stringify(t.calls[1].body) === JSON.stringify(t.calls[0].body), "brain 501: same body retried same-origin");
ok(!t.done.hidden && t.h.textContent === "You are on the list" && /email you a link to confirm/.test(t.msg.textContent), "pending message is honest about the later confirm email");

t = make(); t.set((u) => (u === BRAIN ? "throw" : { status: 202, body: { ok: true, status: "check_email" } }));
await t.submit("a@b.co");
ok(t.calls.length === 2 && !t.done.hidden && t.h.textContent === "Check your email", "brain unreachable: same-origin forward, check-your-email");

t = make(); t.set(() => ({ status: 400, body: { error: { code: "bad_email" } } }));
await t.submit("a@b.co");
ok(t.calls.length === 1 && t.done.hidden && /does not look right/.test(t.status.textContent) && t.inputs.email.attrs["aria-invalid"] === "true", "brain 400 bad_email: inline error, no fallback");
t = make(); t.set((u) => (u === BRAIN ? { status: 400, body: { error: { code: "turnstile_required" } } } : { status: 202, body: { ok: true, status: "pending" } }));
await t.submit("a@b.co");
ok(t.calls.length === 2 && t.calls[1].url === "/api/subscribe" && !t.done.hidden, "brain 400 for another reason: same-origin fallback, not a bad-email error");

t = make(); t.set(() => ({ status: 429, body: {} }));
await t.submit("a@b.co");
ok(t.calls.length === 1 && /Too many tries/.test(t.status.textContent) && !t.btn.disabled, "429: rate-limit message, button re-enabled");

t = make(); t.set(() => "throw");
await t.submit("a@b.co");
ok(t.calls.length === 2 && t.done.hidden && /Could not reach the server/.test(t.status.textContent) && !t.btn.disabled, "both endpoints down: error, button re-enabled");

t = make(); await t.submit("not-an-email");
ok(t.calls.length === 0 && /does not look right/.test(t.status.textContent), "client-side email check, nothing sent");

t = make(); t.inputs.website.value = "bot-filled";
await t.submit("a@b.co");
ok(t.calls[0].body.website === "bot-filled", "honeypot value passed through for the server to drop");

ok(t.window.ssWaitlist.classify(202, { ok: true, status: "check_email" }) === "ok" && t.window.ssWaitlist.classify(503, {}) === "fallback", "classify");
const js = readFileSync(new URL("assets/js/waitlist.js", root), "utf8");
ok(!/[\u2013\u2014]/.test(js + box), "no em or en dashes");

console.log(`${pass} passed, ${fail} failed`);
if (fail) process.exit(1);

// Tests for the LAUNCH50 buy-button script in a BUILT page (templates/base.html, the discount_code script).
// Run after `python3 build.py`:  node tests/launch_price_js_test.mjs   (Node 18+, no dependencies; a tiny fake DOM
// runs the real inline script in a vm context with a fixed clock.)
import { readFileSync } from "node:fs";
import vm from "node:vm";

let pass = 0, fail = 0;
const ok = (cond, name) => { if (cond) pass++; else { fail++; console.log("FAIL:", name); } };
const root = new URL("../", import.meta.url);
const site = JSON.parse(readFileSync(new URL("site.json", root), "utf8"));
const END = Date.parse(site.launch_end);

const page = readFileSync(new URL("products/1b-dna-gene-expression.html", root), "utf8");
// build.py injects templates/launchbar.html only before launch_end, so test the script from the template itself.
const bar = readFileSync(new URL("templates/launchbar.html", root), "utf8");
const src = bar.match(/<script>(\(function\(\)\{var b=document\.getElementById\("launchbar"\),c=b\.dataset\.code[\s\S]*?)<\/script>/)[1];

// A build after launch_end must leave no offer text in any page.
if (Date.now() > END) {
  const pages = ["index.html", "products/1b-dna-gene-expression.html", "practice/index.html", "terms.html"];
  ok(pages.every(p => { const h = readFileSync(new URL(p, root), "utf8"); return !/launchbar|LAUNCH50|Launch week/.test(h); }), "after launch_end: built pages contain no launchbar/LAUNCH50 text");
}

function el(text, href) {
  const e = { href, attrs: {}, kids: [], set textContent(v) { this.kids = [{ text: v }]; },
    get textContent() { return this.kids.map(k => k.text ?? k.textContent).join(""); },
    appendChild(k) { this.kids.push(k); }, setAttribute(k, v) { this.attrs[k] = v; } };
  e.textContent = text;
  return e;
}
function run(now, buttons) {
  let ready = null;
  const document = {
    getElementById: () => ({ dataset: { code: site.launch_code, end: site.launch_end } }),
    addEventListener: (ev, fn) => { if (ev === "DOMContentLoaded") ready = fn; },
    querySelectorAll: (sel) => sel === "a[data-checkout=polar]" ? buttons : [],
    createElement: (tag) => { const e = el("", null); e.tag = tag; return e; },
    createTextNode: (t) => ({ text: t }),
  };
  const RealDate = Date;
  const FakeDate = class extends RealDate { static now() { return now; } };
  vm.runInNewContext(src, { document, URL, Date: FakeDate });
  if (ready) ready();
}
const html = (b) => b.kids.map(k => k.tag ? `<${k.tag}>${k.textContent}</${k.tag}>` : k.text).join("");
const btns = () => [el("Buy now, $15", "https://buy.polar.sh/polar_cl_a"), el("Buy now, $17", "https://buy.polar.sh/polar_cl_b"),
                    el("Buy now, $119", "https://buy.polar.sh/polar_cl_c"), el("Get the bundle", "https://buy.polar.sh/polar_cl_d")];

ok(page.includes('data-checkout="polar"') && />Buy now, \$\d+<\/a>/.test(page), "built product page has a Buy now, $N polar button");

let b = btns();
run(END - 3600e3, b);
ok(b.every(x => new URL(x.href).searchParams.get("discount_code") === site.launch_code), "before end: every polar link gets discount_code");
ok(html(b[0]) === "Buy now, <s>$15</s> $7.50", "before end: $15 shows as $7.50 with $15 struck: " + html(b[0]));
ok(html(b[1]) === "Buy now, <s>$17</s> $8.50", "before end: $17 shows $8.50");
ok(html(b[2]) === "Buy now, <s>$119</s> $59.50", "before end: $119 shows $59.50");
ok(b[0].attrs["aria-label"] === `Buy now, $7.50 with ${site.launch_code}, was $15`, "before end: aria-label states the price and code");
ok(html(b[3]) === "Get the bundle" && !b[3].attrs["aria-label"], "before end: buttons without a $N price keep their text");

b = btns();
run(END, b);
ok(b.every(x => !x.href.includes("discount_code")), "at end: no discount_code");
ok(html(b[0]) === "Buy now, $15" && html(b[2]) === "Buy now, $119", "at end: full prices unchanged");

b = btns();
run(END + 86400e3, b);
ok(html(b[1]) === "Buy now, $17" && !b[1].attrs["aria-label"], "after end: full price, no aria-label");

console.log(`launch_price_js_test: ${pass} passed, ${fail} failed`);
if (fail) process.exit(1);

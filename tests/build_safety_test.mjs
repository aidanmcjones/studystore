// Build-safety test: hostile content must fail the build or come out inert. The checks live in
// build_safety_check.py (unit cases for mdlite/safeurl/JSON-in-script, plus full builds of a temp copy with one
// hostile input each). This wrapper lets the CI loop (tests/*_test.mjs) run it.
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const r = spawnSync("python3", ["tests/build_safety_check.py"], { cwd: root, encoding: "utf8", timeout: 280000 });
process.stdout.write(r.stdout || "");
process.stderr.write(r.stderr || "");
if (r.status !== 0) {
  console.error("build safety test FAILED");
  process.exit(1);
}
console.log("build safety test passed");

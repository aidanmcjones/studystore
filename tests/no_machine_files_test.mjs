// Public repo guard: fail if any tracked file is local tooling state. `wrangler pages dev` writes
// node_modules/.mf/cf.json (the dev machine's approximate location and network) and .wrangler/ state.
// Run: node tests/no_machine_files_test.mjs
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const files = execFileSync("git", ["ls-files", "-z"], { cwd: ROOT, encoding: "utf8" }).split("\0").filter(Boolean);
const bad = files.filter((f) => /(^|\/)(node_modules|\.wrangler|\.mf)\//.test(f));
console.log(`${files.length} tracked files checked`);
if (bad.length) {
  console.log("Tracked local tooling files (remove them and keep them in .gitignore):\n" + bad.slice(0, 20).join("\n"));
  process.exit(1);
}
console.log("no node_modules/, .wrangler/ or .mf/ files tracked");

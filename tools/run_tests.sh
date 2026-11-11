#!/bin/bash
# The one test runner: tools/deploy_pages.sh and CI (.github/workflows/ci.yml, ci-local.sh) both call this, so a PR
# that is green can never fail the deploy gate. Run after build.py (several tests read the built pages).
# Runs every tests/*_test.mjs (node) and tests/*_test.py (python3), keeps going after a failure, exits 4 if any failed.
cd "$(dirname "$0")/.."
status=0
for t in tests/*_test.mjs; do
  echo "::group::$t"
  node "$t" || { echo "TEST FAILED: $t" >&2; status=4; }
  echo "::endgroup::"
done
for t in tests/*_test.py; do
  echo "::group::$t"
  python3 "$t" || { echo "TEST FAILED: $t" >&2; status=4; }
  echo "::endgroup::"
done
exit $status

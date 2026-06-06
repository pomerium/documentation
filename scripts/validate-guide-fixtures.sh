#!/usr/bin/env bash
# cspell:ignore selftest gdir endgroup inblk webp imgdir
# Spin up a guide's sealed validation fixture, run its headless-browser (or CLI)
# checks against the in-network Keycloak, and tear everything down.
#
# Usage:
#   scripts/validate-guide-fixtures.sh --selftest      # prove the shared harness
#   scripts/validate-guide-fixtures.sh <guide-id>      # validate one guide
#
# A guide opts in simply by having content/examples/guides/<id>/validate/
# compose.validate.yaml. Override the route under test with validate/url.txt.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
GUIDES="$ROOT/content/examples/guides"
GUIDE="${1:?usage: validate-guide-fixtures.sh <guide-id|--selftest> [--update-screenshots]}"
UPDATE_SHOTS="${2:-}"

if [ "$GUIDE" = "--selftest" ]; then
  COMPOSE="$GUIDES/_harness/selftest/compose.yaml"
  PROJECT="guides-selftest"
  POMERIUM_URL="https://verify.localhost.pomerium.io"
else
  DIR="$GUIDES/$GUIDE/validate"
  COMPOSE="$DIR/compose.validate.yaml"
  PROJECT="guide-$GUIDE"
  # Non-sealable guides (Kubernetes, hardware, cloud, managed control plane) opt out
  # by shipping validate/SKIP with a one-line reason. Report it and pass.
  if [ -f "$DIR/SKIP" ]; then
    echo ">> $GUIDE: SKIP (not sealable) - $(head -1 "$DIR/SKIP" 2>/dev/null)"
    exit 0
  fi
  if [ -f "$DIR/url.txt" ]; then
    POMERIUM_URL="$(tr -d '[:space:]' < "$DIR/url.txt")"
  else
    POMERIUM_URL="https://$GUIDE.localhost.pomerium.io"
  fi
fi

if [ ! -f "$COMPOSE" ]; then
  echo "No validation fixture for '$GUIDE' (expected $COMPOSE). Add validate/compose.validate.yaml, or validate/SKIP with a one-line reason for non-sealable guides." >&2
  exit 2
fi

# Media policy: a sealable guide must reference at least one screenshot, or record
# why not in validate/screenshots-skip. Skipped during --update-screenshots (the run
# that generates them) and for the harness self-test.
if [ "$GUIDE" != "--selftest" ] && [ "$UPDATE_SHOTS" != "--update-screenshots" ]; then
  doc=""
  for ext in md mdx; do
    [ -f "$ROOT/content/docs/guides/$GUIDE.$ext" ] && doc="$ROOT/content/docs/guides/$GUIDE.$ext"
  done
  if [ -n "$doc" ] && ! grep -qE '!\[|<img|\.(png|gif|jpe?g|webp)' "$doc" && [ ! -f "$DIR/screenshots-skip" ]; then
    echo "Media policy: $GUIDE references no screenshot in $(basename "$doc") and has no validate/screenshots-skip marker." >&2
    echo "  Generate one:  scripts/validate-guide-fixtures.sh $GUIDE --update-screenshots   then reference it in the guide." >&2
    echo "  Or record why none applies:  echo '<reason>' > $DIR/screenshots-skip" >&2
    exit 3
  fi
fi

export POMERIUM_URL
dc() { docker compose -p "$PROJECT" -f "$COMPOSE" "$@"; }

# Reader-facing *.yaml.md files are imported into the guide; their fenced contents
# must stay byte-identical to the runnable mirror users actually run.
# fence_body prints the lines inside the first fenced code block (fence-aware, so a
# guide whose .md adds surrounding prose still compares the right region).
fence_body() { awk 'inblk && /^```/{exit} inblk{print} /^```/{inblk=1}' "$1"; }
check_mirror() {
  md="$1"; plain="$2"
  [ -f "$md" ] && [ -f "$plain" ] || return 0
  if ! diff -q <(fence_body "$md") "$plain" >/dev/null; then
    echo "Mirror drift: $md differs from $plain" >&2
    diff <(fence_body "$md") "$plain" >&2 || true
    exit 1
  fi
}
if [ "$GUIDE" != "--selftest" ]; then
  gdir="$GUIDES/$GUIDE"
  check_mirror "$gdir/docker-compose.yaml.md" "$gdir/docker-compose.yaml"
  check_mirror "$gdir/config.yaml.md" "$gdir/config.yaml"
fi

cleanup() {
  status=$?
  if [ "$status" -ne 0 ]; then
    echo "::group::$PROJECT logs (failure)"; dc logs --no-color || true; echo "::endgroup::"
  fi
  dc down -v --remove-orphans >/dev/null 2>&1 || true
  exit "$status"
}
trap cleanup EXIT

echo ">> $GUIDE: building and starting stack (POMERIUM_URL=$POMERIUM_URL)"
# test-runner (the only built-from-source image) is held back by its profile and
# built on the `run` below; everything else is pulled, so no --build needed here.
dc up -d --wait

echo ">> $GUIDE: running validation checks"
# The harness owns the test-runner service; a guide never redefines it (that would
# conflict with the imported resource on stock Docker Compose). A guide-specific
# spec is injected here at `run` time instead: if validate/assert.spec.ts exists
# (or the selftest's identity spec), mount it and point Playwright at it.
run_opts=()
if [ "$GUIDE" = "--selftest" ]; then
  spec_dir="$GUIDES/_harness/selftest"
elif [ -f "$GUIDES/$GUIDE/validate/assert.spec.ts" ]; then
  spec_dir="$GUIDES/$GUIDE/validate"
else
  spec_dir=""
fi
if [ -n "$spec_dir" ]; then
  run_opts=(-v "$spec_dir:/app/guide-tests:ro" -e PW_TEST_DIR=/app/guide-tests)
fi
# --update-screenshots: mount the guide's committed image dir and let specs write
# screenshots there. Without the flag SCREENSHOT_DIR is unset and specs capture
# nothing, so CI never rewrites committed images.
if [ "$UPDATE_SHOTS" = "--update-screenshots" ] && [ "$GUIDE" != "--selftest" ]; then
  imgdir="$ROOT/content/docs/guides/img/$GUIDE"
  mkdir -p "$imgdir"
  run_opts+=(-v "$imgdir:/app/artifacts" -e SCREENSHOT_DIR=/app/artifacts)
fi
# Empty-array-safe expansion (works on macOS bash 3.2 under `set -u`).
dc run --rm --build ${run_opts[@]+"${run_opts[@]}"} test-runner

echo ">> $GUIDE: PASS"

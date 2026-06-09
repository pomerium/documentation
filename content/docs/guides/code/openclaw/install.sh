#!/usr/bin/env bash
# install.sh — one-shot installer for OpenClaw + Pomerium.
#
# Intended invocation:
#   curl -fsSL https://pomerium.com/docs/guides/code/openclaw/install.sh | bash
#
# What it does:
#   1. Sanity-checks that git is installed (docker + ssh-keygen are
#      checked by bootstrap.sh once we hand off).
#   2. Sparse-checkouts only the OpenClaw guide code from the Pomerium
#      documentation repo into the target directory. Default is ./pomclaw;
#      override by passing a path. A second positional arg overrides
#      the branch (default `main`), for testing pre-merge branches:
#          curl ... | bash -s -- /path/to/dir
#          curl ... | bash -s -- ./pomclaw my-feature-branch
#   3. Moves the files from the sparse path to the target root and
#      removes the leftover git metadata and empty directories.
#   4. cd's in and hands off to bootstrap.sh, reattaching stdin to
#      /dev/tty so bootstrap.sh's interactive prompts still work even
#      when the installer itself was piped from curl.
#
# Aborts (rather than pulling or overwriting) if the target directory
# already exists -- bootstrap.sh is idempotent on re-run, so the right
# move is for the user to `cd <dir> && ./bootstrap.sh`.

set -euo pipefail

REPO_URL="https://github.com/pomerium/documentation.git"
SPARSE_PATH="content/docs/guides/code/openclaw"
TARGET_DIR="${1:-./pomclaw}"
REPO_BRANCH="${2:-main}"

log()     { printf '\033[36m[install]\033[0m %s\n' "$*" >&2; }
log_ok()  { printf '\033[32m[install]\033[0m %s\n' "$*" >&2; }
log_err() { printf '\033[31m[install]\033[0m %s\n' "$*" >&2; }

if ! command -v git >/dev/null 2>&1; then
  log_err "git is required but not found on PATH. Install git and re-run."
  exit 1
fi

if [[ -e "$TARGET_DIR" ]]; then
  log_err "$TARGET_DIR already exists."
  log_err "If you want to (re-)run the bootstrap, do:"
  log_err "  cd $TARGET_DIR && ./bootstrap.sh"
  log_err "If you want a clean install, remove or rename it first."
  exit 1
fi

log "Cloning $REPO_URL (branch: $REPO_BRANCH) with sparse-checkout into $TARGET_DIR"
git clone --depth 1 --filter=blob:none --sparse --branch "$REPO_BRANCH" "$REPO_URL" "$TARGET_DIR"
log_ok "clone complete"

cd "$TARGET_DIR"

log "Checking out only the OpenClaw guide files"
git sparse-checkout set --no-cone "/*" "!/*/" "$SPARSE_PATH"
git checkout

log "Moving files into place"
shopt -s dotglob nullglob
files=("$SPARSE_PATH"/*)
if (( ${#files[@]} > 0 )); then
  mv "${files[@]}" .
fi
shopt -u dotglob nullglob

rm -rf .git content/

# Ensure persistent-data directories exist (git won't track empty dirs)
mkdir -p openclaw-data/config openclaw-data/workspace openclaw-data/pomerium-ssh

log_ok "OpenClaw files ready in $TARGET_DIR"

# Reattach stdin to the controlling terminal. When this script is run as
# `curl ... | bash`, stdin is the curl pipe -- not a TTY -- so bootstrap.sh's
# `read` prompts would silently get EOF. Redirecting from /dev/tty restores
# interactivity for the handoff.
if [[ ! -r /dev/tty ]]; then
  log_err "No controlling TTY available; bootstrap.sh needs to prompt for"
  log_err "configuration values. Re-run from an interactive shell, or:"
  log_err "  cd $TARGET_DIR && ./bootstrap.sh"
  exit 1
fi

log "Handing off to ./bootstrap.sh"
exec ./bootstrap.sh </dev/tty

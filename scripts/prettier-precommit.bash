#!/bin/bash
set -euo pipefail

printf "%s\n" "$@" | xargs yarn --cwd ui run prettier --write --ignore-unknown

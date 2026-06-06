#!/bin/sh
# Validation-only: configure OpenClaw to run headlessly so the sealed E2E can reach
# the gateway over HTTP without an interactive setup or a model-provider API key.
set -e

openclaw config set gateway.mode local >/dev/null 2>&1 || true
openclaw config set gateway.auth.token validation-only-token >/dev/null 2>&1 || true
openclaw config set gateway.bind 0.0.0.0 >/dev/null 2>&1 || true

exec openclaw gateway --allow-unconfigured

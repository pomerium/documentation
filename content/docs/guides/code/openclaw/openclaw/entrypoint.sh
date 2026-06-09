#!/bin/sh
set -e

# Ensure claw user owns its home directory contents
chown -R claw:claw /claw

# Configure allowed origins
if [ -z "$POMERIUM_CLUSTER_DOMAIN" ]; then
  echo "Error: POMERIUM_CLUSTER_DOMAIN environment variable is required"
  exit 1
fi

# Change the sub domain if you don't name your from route in Pomerium "openclaw.$POMERIUM_CLUSTER_DOMAIN"
NEW_ORIGIN="https://openclaw.$POMERIUM_CLUSTER_DOMAIN"
echo "Configuring allowed origins for $NEW_ORIGIN"

# Ensure gateway.mode is set (required since OpenClaw 2026.4+)
CURRENT_MODE=$(su - claw -c "openclaw config get gateway.mode" 2>/dev/null || echo "")
if [ -z "$CURRENT_MODE" ] || [ "$CURRENT_MODE" = "undefined" ]; then
  echo "Setting gateway.mode=local (required for containerized deployment)"
  su - claw -c "openclaw config set gateway.mode local" 2>/dev/null || true
fi

# On first boot with no auth configured, generate a temporary random password
# so the gateway starts reliably and remains reachable via docker compose exec.
# The bootstrap script will switch to trusted-proxy mode and unset this password.
CURRENT_PASSWORD=$(su - claw -c "openclaw config get gateway.auth.password" 2>/dev/null || echo "")
CURRENT_TOKEN=$(su - claw -c "openclaw config get gateway.auth.token" 2>/dev/null || echo "")
CURRENT_TRUSTED_PROXY=$(su - claw -c "openclaw config get gateway.auth.trustedProxy" 2>/dev/null || echo "")
if [ -z "$CURRENT_PASSWORD" ] || [ "$CURRENT_PASSWORD" = "undefined" ]; then
  if [ -z "$CURRENT_TOKEN" ] || [ "$CURRENT_TOKEN" = "undefined" ]; then
    if [ -z "$CURRENT_TRUSTED_PROXY" ] || [ "$CURRENT_TRUSTED_PROXY" = "undefined" ] || [ "$CURRENT_TRUSTED_PROXY" = "null" ] || [ "$CURRENT_TRUSTED_PROXY" = "{}" ]; then
      TEMP_PASSWORD=$(openssl rand -base64 32 2>/dev/null || head -c 32 /dev/urandom | base64 | tr -d '\n')
      echo "First boot: setting temporary gateway.auth.password so the gateway can start"
      su - claw -c "openclaw config set gateway.auth.password '$TEMP_PASSWORD'" 2>/dev/null || true
    fi
  fi
fi

# Pre-write static trusted-proxy config so the bootstrap only needs to supply
# the dynamic Pomerium IP. This avoids startup failures when the bootstrap
# attempts to reach a crash-looping container.
CURRENT_TP=$(su - claw -c "openclaw config get gateway.auth.trustedProxy" 2>/dev/null || echo "")
if [ -z "$CURRENT_TP" ] || [ "$CURRENT_TP" = "undefined" ] || [ "$CURRENT_TP" = "null" ] || [ "$CURRENT_TP" = "{}" ]; then
  echo "Pre-writing static trusted-proxy auth config"
  TP_BLOCK='{"userHeader":"x-pomerium-claim-email","requiredHeaders":["X-Pomerium-Jwt-Assertion"]}'
  su - claw -c "openclaw config set gateway.auth.trustedProxy --strict-json '$TP_BLOCK'" 2>/dev/null || true
fi

CURRENT_DISABLE_DEVICE_AUTH=$(su - claw -c "openclaw config get gateway.controlUi.dangerouslyDisableDeviceAuth" 2>/dev/null || echo "")
if [ -z "$CURRENT_DISABLE_DEVICE_AUTH" ] || [ "$CURRENT_DISABLE_DEVICE_AUTH" = "undefined" ]; then
  su - claw -c "openclaw config set gateway.controlUi.dangerouslyDisableDeviceAuth true" 2>/dev/null || true
fi

CURRENT=$(su - claw -c "openclaw config get gateway.controlUi.allowedOrigins" 2>/dev/null || echo "[]")
UPDATED=$(echo "$CURRENT" | jq -c --arg origin "$NEW_ORIGIN" 'if index($origin) then . else . + [$origin] end')

su - claw -c "openclaw config set gateway.controlUi.allowedOrigins '$UPDATED'" 2>/dev/null || {
  echo "Warning: Could not set allowedOrigins (config may not exist yet)"
}

# Start SSH daemon (must run as root)
/usr/sbin/sshd

# Run openclaw as claw user
exec su - claw -c "openclaw gateway"

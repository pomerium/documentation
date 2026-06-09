#!/usr/bin/env bash
# bootstrap.sh — Pomerium + OpenClaw deployment bootstrap.
#
# What this does:
#   Pre-bootstrap: Interactively prompts for the four required values when
#                  .env is missing or incomplete (no-op on full .env).
#   Phase 0:       Generates SSH keys and configures Pomerium Zero via the
#                  Zero API (cluster SSH config, jwtClaimsHeaders, policy,
#                  SSH route, web route).
#   Phase 1:       Brings up openclaw-gateway + pomerium, then configures
#                  the gateway for trusted-proxy auth directly
#                  (gateway.auth.trustedProxy + gateway.trustedProxies +
#                  auth.mode=trusted-proxy). Replaces the older token-mode
#                  -> WebSocket-pairing -> switch dance that broke in
#                  OpenClaw 2026.5.7.
#   Phase 2:       Brings up the rest of the docker compose stack (verify).
#
# Idempotent and resumable. Re-running picks up from the current state.
#
# Required env vars (collected interactively if missing, or set manually
# in .env):
#   POMERIUM_ZERO_TOKEN       Cluster bootstrap token
#   POMERIUM_CLUSTER_DOMAIN   e.g. fantastic-fox-1234.pomerium.app
#   POMERIUM_ZERO_API_TOKEN   API user token; generate at:
#                             https://console.pomerium.app/app/management/api-tokens
#   OPERATOR_EMAIL            Sign-in email allowed by the route policy
#
# Host prereqs: docker, docker compose, ssh-keygen, curl, jq.
#
# Usage:
#   ./bootstrap.sh                       # bootstrap (default; interactive if .env missing)
#   ./bootstrap.sh status                # print current state, no changes
#   ./bootstrap.sh reset                 # destructive: clear devices + flip back to token mode

set -euo pipefail

ZERO_API="https://console.pomerium.app/api/v0"
API_TOKENS_URL="https://console.pomerium.app/app/management/api-tokens"

banner() {
  cat <<'EOF'

  ____                  ____ _
 |  _ \ ___  _ __ ___  / ___| | __ ___      __
 | |_) / _ \| '_ ` _ \| |   | |/ _` \ \ /\ / /
 |  __/ (_) | | | | | | |___| | (_| |\ V  V /
 |_|   \___/|_| |_| |_|\____|_|\__,_| \_/\_/

 Pomerium + OpenClaw deployment bootstrap

EOF
}

# ---- pretty logs ----
log()      { printf '\033[36m[pomclaw]\033[0m %s\n' "$*" >&2; }
log_ok()   { printf '\033[32m[pomclaw]\033[0m %s\n' "$*" >&2; }
log_warn() { printf '\033[33m[pomclaw]\033[0m %s\n' "$*" >&2; }
log_err()  { printf '\033[31m[pomclaw]\033[0m %s\n' "$*" >&2; }

# ---- env loading + validation ----
load_env() {
  if [[ -f .env ]]; then
    set -a
    # shellcheck disable=SC1091
    source .env
    set +a
  fi
}

require_env() {
  local missing=()
  for var in "$@"; do
    if [[ -z "${!var:-}" ]]; then
      missing+=("$var")
    fi
  done
  if (( ${#missing[@]} > 0 )); then
    log_err "Missing required env vars in .env: ${missing[*]}"
    log_err ""
    log_err "POMERIUM_ZERO_API_TOKEN is the API user token. Generate one at:"
    log_err "  $API_TOKENS_URL"
    log_err ""
    log_err "OPERATOR_EMAIL is the email your IdP returns for your account; it"
    log_err "is used in the route policy that controls who can reach OpenClaw."
    exit 1
  fi
}

require_tools() {
  local missing=()
  for tool in "$@"; do
    if ! command -v "$tool" >/dev/null 2>&1; then
      missing+=("$tool")
    fi
  done
  if (( ${#missing[@]} > 0 )); then
    log_err "Missing required tools on the host: ${missing[*]}"
    log_err "On macOS these come with the OS or with Docker Desktop. On Linux"
    log_err "install them via your package manager."
    exit 1
  fi
}

phase_env_setup() {
  # Interactively populate .env if missing or incomplete. No-op when all four
  # required vars are already set. Non-TTY runs fall through to require_env
  # which produces the canonical "missing vars in .env" error, so CI
  # behavior is unchanged.
  #
  # Flow:
  #   1. Prompt for POMERIUM_ZERO_TOKEN (cluster bootstrap token).
  #   2. Prompt for POMERIUM_ZERO_API_TOKEN (org-scoped API user token).
  #   3. Use the API token to list clusters in the user's org. Auto-pick the
  #      most recently created one (which is almost always what a brand-new
  #      user wants); show a numbered picker if there are multiple.
  #      POMERIUM_CLUSTER_DOMAIN is derived from the selection -- no
  #      manual paste of the FQDN.
  #   4. Prompt for OPERATOR_EMAIL.
  if [[ -f .env ]]; then
    set -a
    # shellcheck disable=SC1091
    source .env 2>/dev/null || true
    set +a
  fi
  local need_zero=0 need_api=0 need_domain=0 need_email=0
  [[ -z "${POMERIUM_ZERO_TOKEN:-}"     ]] && need_zero=1
  [[ -z "${POMERIUM_ZERO_API_TOKEN:-}" ]] && need_api=1
  [[ -z "${POMERIUM_CLUSTER_DOMAIN:-}" ]] && need_domain=1
  [[ -z "${OPERATOR_EMAIL:-}"          ]] && need_email=1
  if (( need_zero == 0 && need_api == 0 && need_domain == 0 && need_email == 0 )); then
    return
  fi
  if [[ ! -t 0 ]]; then
    # Let require_env produce the canonical missing-vars error.
    return
  fi
  # curl + jq are only needed for the API-driven cluster lookup. Check here
  # rather than at script top so users with a complete .env aren't gated.
  require_tools curl jq

  log "Need: cluster bootstrap token + API user token + your sign-in email."
  log "Generate an API token at $API_TOKENS_URL if you don't have one."
  echo >&2

  if (( need_zero )); then
    printf "[pomclaw] Pomerium Zero token: "
    read -r POMERIUM_ZERO_TOKEN || POMERIUM_ZERO_TOKEN=""
    if [[ -z "$POMERIUM_ZERO_TOKEN" ]]; then
      log_err "POMERIUM_ZERO_TOKEN is required."
      exit 1
    fi
  fi

  if (( need_api )); then
    printf "[pomclaw] Pomerium Zero API token: "
    read -r POMERIUM_ZERO_API_TOKEN || POMERIUM_ZERO_API_TOKEN=""
    if [[ -z "$POMERIUM_ZERO_API_TOKEN" ]]; then
      log_err "POMERIUM_ZERO_API_TOKEN is required."
      exit 1
    fi
  fi

  if (( need_domain )); then
    local auth_resp auth_code id_token
    auth_resp=$(curl -sS -X POST "$ZERO_API/token" \
      -H "Content-Type: application/json" \
      -d "$(jq -n --arg t "$POMERIUM_ZERO_API_TOKEN" '{refreshToken: $t}')" \
      -w $'\n%{http_code}')
    auth_code=${auth_resp##*$'\n'}
    auth_resp=${auth_resp%$'\n'*}
    if [[ "$auth_code" != "200" ]]; then
      log_err "API token authentication failed (HTTP $auth_code)."
      log_err "Server response: $auth_resp"
      log_err ""
      log_err "Generate a fresh API token at $API_TOKENS_URL and re-run."
      exit 1
    fi
    id_token=$(printf '%s' "$auth_resp" | jq -r '.idToken // empty')
    if [[ -z "$id_token" ]]; then
      log_err "API token auth returned no idToken. Response: $auth_resp"
      exit 1
    fi
    local org_id
    org_id=$(curl -sS -H "Authorization: Bearer $id_token" "$ZERO_API/organizations" \
      | jq -r '.[0].id // empty')
    if [[ -z "$org_id" ]]; then
      log_err "No organizations available on this API token."
      exit 1
    fi
    local clusters_json count
    clusters_json=$(curl -sS -H "Authorization: Bearer $id_token" \
      "$ZERO_API/organizations/$org_id/clusters")
    count=$(printf '%s' "$clusters_json" | jq 'length')
    if (( count == 0 )); then
      log_err "No clusters found in your Pomerium Zero org."
      log_err "Create one at https://console.pomerium.app first, then re-run."
      exit 1
    fi
    local sorted
    sorted=$(printf '%s' "$clusters_json" \
      | jq -r 'sort_by(.createdAt) | reverse | .[] | "\(.fqdn)\t\(.name)\t\(.createdAt)"')
    local pick=1
    if (( count == 1 )); then
      local fqdn name
      fqdn=$(printf '%s' "$sorted" | head -n1 | awk -F'\t' '{print $1}')
      name=$(printf '%s' "$sorted" | head -n1 | awk -F'\t' '{print $2}')
      log_ok "Using cluster: $name ($fqdn)"
      POMERIUM_CLUSTER_DOMAIN="$fqdn"
    else
      log ""
      log "Found $count clusters. Most recent first; [1] is the default:"
      log ""
      local i=1
      while IFS=$'\t' read -r fqdn name created; do
        local mark=""
        (( i == 1 )) && mark="  <- default"
        printf "  [%d] %-30s %-40s  created %s%s\n" \
          "$i" "$name" "$fqdn" "$created" "$mark" >&2
        i=$((i+1))
      done <<< "$sorted"
      log ""
      printf "[pomclaw] Enter to accept [1], or type a number: "
      local choice
      read -r choice || choice=""
      if [[ -n "$choice" ]]; then
        if [[ ! "$choice" =~ ^[0-9]+$ ]] || (( choice < 1 || choice > count )); then
          log_err "Invalid choice: $choice"
          exit 1
        fi
        pick=$choice
      fi
      local row
      row=$(printf '%s' "$sorted" | sed -n "${pick}p")
      POMERIUM_CLUSTER_DOMAIN=$(printf '%s' "$row" | awk -F'\t' '{print $1}')
      local name
      name=$(printf '%s' "$row" | awk -F'\t' '{print $2}')
      log_ok "Using cluster: $name ($POMERIUM_CLUSTER_DOMAIN)"
    fi
  fi

  if (( need_email )); then
    printf "[pomclaw] email address you use to sign in to Pomerium: "
    read -r OPERATOR_EMAIL || OPERATOR_EMAIL=""
    if [[ -z "$OPERATOR_EMAIL" ]]; then
      log_err "OPERATOR_EMAIL is required."
      exit 1
    fi
  fi
  echo >&2

  local openclaw_version="${OPENCLAW_VERSION:-2026.6.5}"
  cat > .env.new <<EOF
# Pomerium Zero Configuration
# Get this token from https://console.pomerium.com/ when creating your cluster
POMERIUM_ZERO_TOKEN=$POMERIUM_ZERO_TOKEN

# Your Pomerium Zero cluster domain (e.g., fantastic-fox-1234.pomerium.app)
# Found in your Pomerium Zero console after cluster creation
POMERIUM_CLUSTER_DOMAIN=$POMERIUM_CLUSTER_DOMAIN

# API user token from console.pomerium.app/app/management/api-tokens
POMERIUM_ZERO_API_TOKEN=$POMERIUM_ZERO_API_TOKEN

# The IdP email allowed by the route policy
OPERATOR_EMAIL=$OPERATOR_EMAIL

# OpenClaw version to install in OpenClaw container
OPENCLAW_VERSION=$openclaw_version # defaults to latest stable release if not set
EOF
  mv .env.new .env
  chmod 600 .env
  log_ok ".env written"
  echo >&2
  # Re-source so subsequent phases see the new values in this shell.
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
}

# ---- docker compose wrappers ----
DC()     { docker compose "$@"; }
INSIDE() {
  # Run a command as the claw user inside the gateway container.
  # Optional env overrides are passed via --env=KEY=VALUE flags before the command.
  # We prepend the env assignments to the shell command itself because
  # `su - claw` starts a login shell that wipes the environment, so
  # `docker exec -e` alone won't propagate them to the inner process.
  local env_prefix=""
  while [[ $# -gt 0 && "$1" == --env=* ]]; do
    env_prefix+="${1#--env=} "
    shift
  done
  DC exec -T openclaw-gateway su - claw -c "${env_prefix}$*"
}
INSIDE_ROOT() {
  # Run as root inside the gateway container (used for jq/curl invocations
  # that don't need /claw home, just the container's installed tools).
  local env_args=()
  while [[ $# -gt 0 && "$1" == --env=* ]]; do
    env_args+=(-e "${1#--env=}")
    shift
  done
  DC exec -T "${env_args[@]}" openclaw-gateway "$@"
}

resolve_pomerium_replica_ip() {
  # Resolve the live IP of the pomerium container. We read Docker's runtime
  # state (not docker-compose.yml), so this works whether the compose file
  # pins `ipv4_address` or leaves Docker to auto-assign. Users hitting a
  # subnet collision (VPN, other stacks) can change `networks.main` in
  # docker-compose.yml without touching the script.
  #
  # Assumes:
  #   - The stack is up (run after `phase_stack_up`).
  #   - Pomerium is attached to exactly one Docker network -- the `main`
  #     network this compose stack defines. If you attach it to additional
  #     networks, this returns whichever IP Docker iterates first, which is
  #     not stable; query by network name in that case.
  local container ip
  container=$(DC ps -q pomerium 2>/dev/null | head -n1)
  if [[ -z "$container" ]]; then
    log_err "pomerium container not running (\`docker compose ps pomerium\`)"
    exit 1
  fi
  ip=$(docker inspect "$container" \
    --format '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{"\n"}}{{end}}' 2>/dev/null \
    | grep -v '^$' | head -n1 | tr -d '\r ')
  if [[ -z "$ip" ]]; then
    log_err "could not resolve pomerium IP from docker inspect (container fully up?)"
    exit 1
  fi
  printf '%s' "$ip"
}

# ---- generic helpers ----
retry() {
  # Retry a command up to N times with a fixed 1s sleep between attempts.
  # Usage: retry <label> <max-attempts> <command...>
  local label="$1" max="$2"
  shift 2
  local i=1
  while (( i <= max )); do
    if "$@"; then return 0; fi
    if (( i == max )); then break; fi
    log_warn "$label: attempt $i/$max failed, retrying in 1s"
    sleep 1
    i=$((i + 1))
  done
  return 1
}

wait_for() {
  local label="$1" total="$2" interval="$3"
  shift 3
  local elapsed=0
  while (( elapsed < total )); do
    if "$@" >/dev/null 2>&1; then return 0; fi
    sleep "$interval"
    elapsed=$((elapsed + interval))
    if (( elapsed % 10 == 0 )); then
      log "still waiting for $label... (${elapsed}/${total}s)"
    fi
  done
  log_err "timeout waiting for $label after ${total}s"
  return 1
}

gateway_listening() {
  # Two-part readiness check:
  #   1) The openclaw CLI inside the container can read the config (process
  #      is up far enough to load openclaw.json). This catches the
  #      "container started but openclaw still booting" window.
  #   2) The gateway's HTTP listener on port 18789 is accepting TCP/HTTP
  #      requests. Without this, Pomerium's reverse proxy hits a
  #      not-yet-listening upstream and serves 503 to the user. curl with
  #      no `-f` flag returns 0 on ANY HTTP response (even 4xx), which is
  #      exactly what we want -- we just need to know the listener is
  #      accepting connections, not what status it returns from localhost.
  INSIDE "openclaw config get gateway.mode" >/dev/null 2>&1 \
    && INSIDE_ROOT curl -s --max-time 5 -o /dev/null \
                   http://127.0.0.1:18789/ >/dev/null 2>&1
}

gateway_is_bootstrapped() {
  # Durable idempotency signal: both auth.mode and the trustedProxy block
  # must be present. Returns 0 when fully bootstrapped.
  local mode tp
  mode="$(INSIDE "openclaw config get gateway.auth.mode" 2>/dev/null | tr -d '"\r\n ' || true)"
  [[ "$mode" == "trusted-proxy" ]] || return 1
  tp="$(INSIDE "openclaw config get gateway.auth.trustedProxy" 2>/dev/null | tr -d '\r\n ' || true)"
  [[ -n "$tp" && "$tp" != "null" && "$tp" != "{}" ]]
}

# ---- Pomerium Zero API helpers ----

zero_curl() {
  # zero_curl <METHOD> <PATH-OR-URL> [<JSON-BODY>]
  local method="$1" path="$2" body="${3:-}"
  local url
  if [[ "$path" == http* ]]; then url="$path"; else url="$ZERO_API$path"; fi

  local args=(-s -X "$method" "$url" -H "Content-Type: application/json")
  [[ -n "${ID_TOKEN:-}" ]] && args+=(-H "Authorization: Bearer $ID_TOKEN")
  [[ -n "$body" ]] && args+=(-d "$body")

  # -w '\n%{http_code}' appends the HTTP status as the last line; we split it
  # off and surface a non-zero exit + log on >=400.
  local response status out
  response=$(curl "${args[@]}" -w $'\n%{http_code}')
  status=${response##*$'\n'}
  out=${response%$'\n'*}

  if [[ "$status" -ge 400 ]]; then
    log_err "Pomerium Zero API $method $path returned HTTP $status"
    log_err "Response: $out"
    return 1
  fi
  printf '%s' "$out"
}

zero_jq() {
  jq "$@"
}

zero_login() {
  local body
  body=$(printf '%s' "$POMERIUM_ZERO_API_TOKEN" \
    | zero_jq -Rs '{refreshToken: .}')
  local response
  response=$(zero_curl POST "/token" "$body") || exit 1
  ID_TOKEN=$(printf '%s' "$response" | zero_jq -r '.idToken // empty')
  if [[ -z "$ID_TOKEN" ]]; then
    log_err "did not receive an idToken from Pomerium Zero"
    exit 1
  fi
  export ID_TOKEN
}

zero_resolve_ids() {
  # Resolve org/cluster/namespace IDs from the cluster's FQDN. These are
  # cspell:ignore Bxrv Hfkb
  # opaque internal identifiers (e.g. `bKfXBzxQnkQcXkSBxrvHfkbVZnb`) that
  # users don't need to see -- they're only used as path components in
  # subsequent API calls. Errors that mention them are still surfaced.
  local orgs
  orgs=$(zero_curl GET "/organizations") || exit 1
  ORG_ID=$(printf '%s' "$orgs" | zero_jq -r '.[0].id // empty')
  if [[ -z "$ORG_ID" ]]; then
    log_err "no organizations available on this API token"
    exit 1
  fi

  local clusters
  clusters=$(zero_curl GET "/organizations/$ORG_ID/clusters") || exit 1
  local match
  match=$(printf '%s' "$clusters" \
    | zero_jq -r --arg fqdn "$POMERIUM_CLUSTER_DOMAIN" \
        '.[] | select(.fqdn == $fqdn) | "\(.id) \(.namespaceId)"' \
    | head -n1)

  if [[ -z "$match" ]]; then
    log_err "cluster '$POMERIUM_CLUSTER_DOMAIN' not found in this organization"
    log_err "available clusters:"
    printf '%s' "$clusters" | zero_jq -r '.[] | "  - \(.fqdn)"' >&2
    exit 1
  fi

  CLUSTER_ID=${match% *}
  NAMESPACE_ID=${match#* }
  export ORG_ID CLUSTER_ID NAMESPACE_ID
}

zero_set_cluster_settings() {
  log "Setting cluster SSH config + JWT claim header mapping + databroker storage"
  # Read the key files from the host and pass them as raw stdin to jq inside
  # the container, which builds the JSON Patch payload.
  local h_ed h_rsa h_ecdsa user_ca
  h_ed=$(<ssh_host_ed25519_key)
  h_rsa=$(<ssh_host_rsa_key)
  h_ecdsa=$(<ssh_host_ecdsa_key)
  user_ca=$(<pomerium_user_ca_key)

  # `jwtClaimsHeaders` tells Pomerium to extract the named claim from the
  # JWT it issues (hosted authenticate) and forward it as the named HTTP
  # header on requests to upstreams. OpenClaw's trusted-proxy auth keys on
  # `x-pomerium-claim-email` (see `phase_configure_trusted_proxy`), but
  # individual claim headers are *not* emitted by default on hosted
  # authenticate clusters -- you have to opt in here. Without this mapping
  # the upstream sees only `X-Pomerium-Jwt-Assertion` and the gateway
  # rejects every request with `reason=trusted_proxy_user_missing`.
  local patch
  patch=$(zero_jq -n \
    --arg ed "$h_ed" \
    --arg rsa "$h_rsa" \
    --arg ecdsa "$h_ecdsa" \
    --arg ca "$user_ca" \
    '[
      {op: "add", path: "/sshAddress",                value: "0.0.0.0:22"},
      {op: "add", path: "/sshHostKeys",               value: [$ed, $rsa, $ecdsa]},
      {op: "add", path: "/sshUserCaKey",              value: $ca},
      {op: "add", path: "/jwtClaimsHeaders",          value: {"x-pomerium-claim-email": "email"}},
      {op: "add", path: "/databrokerStorageConnection", value: "file:///var/lib/pomerium"}
    ]')

  zero_curl PATCH "/organizations/$ORG_ID/clusters/$CLUSTER_ID/settings" "$patch" >/dev/null
  log_ok "cluster settings applied (SSH config + jwtClaimsHeaders + databroker storage)"
}

zero_get_or_create_policy() {
  local name="openclaw users"
  local existing
  existing=$(zero_curl GET "/organizations/$ORG_ID/policies?namespaceId=$NAMESPACE_ID" \
    | zero_jq -r --arg n "$name" '.[]? | select(.name == $n) | .id' \
    | head -n1)
  if [[ -n "$existing" ]]; then
    POLICY_ID="$existing"
    export POLICY_ID
    log_ok "policy already exists"
    return 0
  fi

  log "Creating allow-by-email policy ($OPERATOR_EMAIL)"
  local body
  body=$(zero_jq -n \
    --arg ns "$NAMESPACE_ID" \
    --arg name "$name" \
    --arg email "$OPERATOR_EMAIL" \
    '{
      namespaceId: $ns,
      name: $name,
      description: ("Allow " + $email + " to access OpenClaw"),
      explanation: "Access denied. Only the configured operator email is permitted.",
      remediation: "Contact the OpenClaw operator to request access.",
      enforced: false,
      ppl: { allow: { or: [{ email: { is: $email } }] } }
    }')
  POLICY_ID=$(zero_curl POST "/organizations/$ORG_ID/policies" "$body" \
    | zero_jq -r '.id')
  export POLICY_ID
  log_ok "policy created"
}

zero_get_or_create_route() {
  # Args: <name> <from> <to> <kind: "web"|"ssh">
  local name="$1" from="$2" to="$3" kind="$4"
  local existing
  existing=$(zero_curl GET "/organizations/$ORG_ID/routes?namespaceId=$NAMESPACE_ID" \
    | zero_jq -r --arg from "$from" '.[]? | select(.from == $from) | .id' \
    | head -n1)
  if [[ -n "$existing" ]]; then
    log_ok "$kind route already exists"
    return 0
  fi

  log "Creating $kind route ($from -> $to)"
  local ws='false'
  [[ "$kind" == "web" ]] && ws='true'
  local body
  body=$(zero_jq -n \
    --arg ns "$NAMESPACE_ID" --arg name "$name" \
    --arg from "$from" --arg to "$to" --arg pid "$POLICY_ID" --argjson ws "$ws" \
    '{
      namespaceId: $ns, name: $name, from: $from, to: [$to],
      policyIds: [$pid], passIdentityHeaders: true,
      setRequestHeaders: {"x-openclaw-scopes": "operator.admin"},
      allowSpdy: false, enableGoogleCloudServerlessAuthentication: false,
      preserveHostHeader: false, showErrorDetails: false,
      tlsSkipVerify: false, tlsUpstreamAllowRenegotiation: false,
      allowWebsockets: $ws
    }')
  zero_curl POST "/organizations/$ORG_ID/routes" "$body" >/dev/null
  log_ok "$kind route created"
}

# ---- phases ----

phase_generate_ssh_keys() {
  log "Generating SSH keys (if missing) + installing User CA pub for the gateway container"
  if [[ ! -f pomerium_user_ca_key ]]; then
    ssh-keygen -N "" -f pomerium_user_ca_key -C "Pomerium User CA" >/dev/null
  fi
  [[ -f ssh_host_ed25519_key ]] || ssh-keygen -t ed25519 -f ssh_host_ed25519_key -N "" >/dev/null
  [[ -f ssh_host_rsa_key     ]] || ssh-keygen -t rsa -b 3072 -f ssh_host_rsa_key -N "" >/dev/null
  [[ -f ssh_host_ecdsa_key   ]] || ssh-keygen -t ecdsa -b 256 -f ssh_host_ecdsa_key -N "" >/dev/null

  mkdir -p ./openclaw-data/pomerium-ssh
  cp pomerium_user_ca_key.pub ./openclaw-data/pomerium-ssh/
  log_ok "User CA pub installed at openclaw-data/pomerium-ssh/"
}

phase_stack_up() {
  DC up -d
  if ! wait_for "gateway responding" 60 2 gateway_listening; then
    log_err "gateway did not come up. Run: docker compose logs openclaw-gateway"
    exit 1
  fi
  log_ok "stack is up"
}

phase_configure_trusted_proxy() {
  # Configure trusted-proxy auth directly. This replaces the older token-mode
  # WebSocket pairing dance (token -> trigger-pairing -> devices approve ->
  # switch-to-trusted-proxy), which broke against OpenClaw 2026.5.7+: the
  # gateway now answers the WebSocket `connect` request with a
  # `connect.challenge` (a nonce that the client must sign with a device
  # key) before any pending pairing is created. Since trusted-proxy mode
  # only needs three pieces of static config, we set them directly and skip
  # the WebSocket handshake entirely.
  #
  # The static pieces (userHeader, requiredHeaders,
  # dangerouslyDisableDeviceAuth) are pre-written by entrypoint.sh on first
  # boot so the gateway starts reliably. This phase only needs to supply the
  # dynamic Pomerium IP and flip auth.mode.
  log "Configuring trusted-proxy auth mode..."
  local pomerium_ip
  pomerium_ip=$(resolve_pomerium_replica_ip)
  local proxies
  proxies=$(zero_jq -n --arg ip "$pomerium_ip" '[$ip]')
  # Retry on ConfigMutationConflictError: rapid sequential mutations from
  # separate docker exec sessions can race with the gateway's config watcher.
  local attempt=0
  while (( attempt < 5 )); do
    if INSIDE "openclaw config set gateway.trustedProxies --strict-json '$proxies'">/dev/null 2>&1; then
      break
    fi
    attempt=$((attempt + 1))
    sleep 1
  done

  # Switch to trusted-proxy mode (failures must be visible)
  attempt=0
  while true; do
    if INSIDE "openclaw config set gateway.auth.mode trusted-proxy"; then
      break
    fi
    attempt=$((attempt + 1))
    if (( attempt >= 5 )); then
      log_err "Failed to set gateway.auth.mode after $attempt attempts (ConfigMutationConflictError)"
      exit 1
    fi
    log_warn "Config mutation conflict, retrying in 1s... (attempt $attempt/5)"
    sleep 1
  done

  # openclaw automatically removes the inactive password when switching to
  # trusted-proxy mode; the explicit unset is a harmless no-op fallback.
  INSIDE "openclaw config unset gateway.auth.password" >/dev/null 2>&1 || true

  # Verify the config actually persisted
  local verified_mode verified_proxies
  verified_mode="$(INSIDE "openclaw config get gateway.auth.mode" 2>/dev/null | tr -d '"\r\n ' || true)"
  verified_proxies="$(INSIDE "openclaw config get gateway.trustedProxies" 2>/dev/null | tr -d '\r\n ' || true)"
  if [[ "$verified_mode" != "trusted-proxy" ]]; then
    log_err "gateway.auth.mode did not persist (got: '${verified_mode:-<empty>}')."
    log_err "Check docker compose logs openclaw-gateway for startup errors."
    exit 1
  fi
  if [[ -z "$verified_proxies" || "$verified_proxies" == "null" || "$verified_proxies" == "[]" ]]; then
    log_err "gateway.trustedProxies did not persist (got: '${verified_proxies:-<empty>}')."
    log_err "Check docker compose logs openclaw-gateway for startup errors."
    exit 1
  fi

  log_ok "gateway in trusted-proxy mode"
}

phase_offer_token_revocation() {
  echo >&2
  log "The API token in .env isn't needed for normal operation. Revoke it"
  log "now and generate a fresh one only if you re-run bootstrap."
  log "You can revoke your token at: $API_TOKENS_URL"
  echo >&2
  printf "Remove API token from .env? [y/N]: "
  local answer
  read -r answer || answer=""
  if [[ "$answer" =~ ^[Yy] ]]; then
    # Strip POMERIUM_ZERO_API_TOKEN from .env so the secret doesn't linger
    # on disk after the user revokes it server-side. Re-running bootstrap
    # will then prompt for a fresh token. Idempotent: no-op if the line
    # isn't there or .env doesn't exist.
    if [[ -f .env ]] && grep -q '^POMERIUM_ZERO_API_TOKEN=' .env; then
      sed -i.bak '/^POMERIUM_ZERO_API_TOKEN=/d' .env && rm -f .env.bak
      log_ok "POMERIUM_ZERO_API_TOKEN removed from .env. Revoke the token in"
      log_ok "the page that just opened to fully invalidate it server-side."
    else
      log_warn "After revoking, remove POMERIUM_ZERO_API_TOKEN from .env."
    fi
  else
    log "skipping; the token stays active until you revoke it manually."
  fi
}

# ---- top-level commands ----

cmd_status() {
  banner
  load_env
  if ! gateway_listening; then
    log_warn "gateway is not responding (is the stack up? \`docker compose up -d\`)"
    return 1
  fi
  local mode
  mode="$(INSIDE "openclaw config get gateway.auth.mode" 2>/dev/null | tr -d '"\r\n ' || true)"
  log "auth.mode:    ${mode:-unknown}"
  if gateway_is_bootstrapped; then
    log "trustedProxy: yes"
  else
    log "trustedProxy: no"
  fi
}

cmd_reset() {
  banner
  load_env
  log_warn "RESET will: clear all paired devices, flip auth.mode back to token,"
  log_warn "set a placeholder token, and restart the gateway."
  log_warn "(Pomerium Zero routes and policies are NOT touched.)"
  printf "Type 'reset' to confirm: "
  read -r confirm
  if [[ "$confirm" != "reset" ]]; then
    log "aborted"
    exit 0
  fi
  INSIDE "openclaw devices clear --yes --pending" >/dev/null 2>&1 || true
  INSIDE "openclaw config set gateway.auth.mode token" >/dev/null 2>&1
  INSIDE "openclaw config set gateway.auth.token 'configure-gateway-token'" >/dev/null 2>&1
  INSIDE "openclaw config unset gateway.auth.password" >/dev/null 2>&1 || true
  INSIDE "openclaw config unset gateway.auth.trustedProxy" >/dev/null 2>&1 || true
  INSIDE "openclaw config unset gateway.trustedProxies"   >/dev/null 2>&1 || true
  INSIDE "openclaw config unset gateway.controlUi.dangerouslyDisableDeviceAuth" >/dev/null 2>&1 || true
  DC restart openclaw-gateway
  log_ok "reset complete; run ./bootstrap.sh to bootstrap again"
}

cmd_bootstrap() {
  banner
  phase_env_setup
  load_env
  require_env POMERIUM_ZERO_TOKEN POMERIUM_CLUSTER_DOMAIN POMERIUM_ZERO_API_TOKEN OPERATOR_EMAIL
  require_tools docker ssh-keygen curl jq

  phase_generate_ssh_keys

  log "Authenticating with Pomerium Zero API"
  zero_login
  zero_resolve_ids
  zero_set_cluster_settings
  zero_get_or_create_policy
  zero_get_or_create_route "openclaw-ssh" "ssh://openclaw" "ssh://openclaw-gateway:22" "ssh"
  zero_get_or_create_route "openclaw-web" "https://openclaw.$POMERIUM_CLUSTER_DOMAIN" "http://openclaw-gateway:18789" "web"
  log_ok "Pomerium Zero API configuration complete"

  log "Building openclaw-gateway image (cached on re-runs)"
  DC build openclaw-gateway >/dev/null
  log "Starting openclaw-gateway + pomerium"
  DC up -d openclaw-gateway pomerium
  if ! wait_for "openclaw-gateway exec ready" 60 2 \
       sh -c 'docker compose exec -T openclaw-gateway sh -c "command -v curl && command -v jq" >/dev/null 2>&1'; then
    log_err "openclaw-gateway did not become exec-ready"
    exit 1
  fi

  if gateway_is_bootstrapped; then
    log_ok "already bootstrapped"
  else
    phase_configure_trusted_proxy
  fi

  log "Bringing up remaining services"
  DC up -d
  if ! wait_for "gateway responding" 60 2 gateway_listening; then
    log_err "gateway did not come up. Run: docker compose logs openclaw-gateway"
    exit 1
  fi
  log_ok "stack is up"

  phase_offer_token_revocation

  echo >&2
  log_ok "================================================================"
  log_ok "  Setup complete"
  log_ok ""
  log_ok "  SSH into the gateway container with:"
  log_ok "    ssh claw@openclaw@$POMERIUM_CLUSTER_DOMAIN -p 2200"
  log_ok ""
  log_ok "  Access OpenClaw control plane UI at:"
  log_ok "    https://openclaw.$POMERIUM_CLUSTER_DOMAIN"
  log_ok ""
  log_ok "  Next steps:"
  log_ok "    - ssh into the openclaw gateway container:"
  log_ok "        ssh claw@openclaw@$POMERIUM_CLUSTER_DOMAIN -p 2200"
  log_ok ""
  log_ok "    - configure a model so you can start chatting:"
  log_ok "        openclaw models list"
  log_ok "        openclaw models set <provider>/<model>"
  log_ok ""
  log_ok "        https://docs.openclaw.ai/concepts/models#cli-commands"
  log_ok "    - optionally, configure channels like Discord, WhatsApp, etc."
  log_ok "      https://docs.openclaw.ai/channels"
  log_ok ""
  log_ok "  OpenClaw is pinned to $OPENCLAW_VERSION so this install is reproducible."
  log_ok ""
  log_ok "  To upgrade to a newer version:"
  log_ok "    1. Edit OPENCLAW_VERSION in .env"
  log_ok "    2. docker compose down && docker compose up -d"
  log_ok "    3. the new image will rebuild and the gateway will come back online"
  log_ok "================================================================"
}

case "${1:-bootstrap}" in
  bootstrap)     cmd_bootstrap ;;
  status)        cmd_status ;;
  reset)         cmd_reset ;;
  -h|--help|help)
    cat <<EOF
Usage: $(basename "$0") [bootstrap|status|reset]

Commands:
  bootstrap (default)  End-to-end setup: configure Pomerium Zero (SSH cluster
                       config, policy, SSH route, web route), bring up the
                       Docker stack, switch the gateway to trusted-proxy auth.
  status               Print current auth mode and device counts.
  reset                Destructive: clear OpenClaw devices, flip back to
                       token mode. Does not touch Pomerium Zero routes.

Required env vars in .env:
  POMERIUM_ZERO_TOKEN, POMERIUM_CLUSTER_DOMAIN,
  POMERIUM_ZERO_API_TOKEN ($API_TOKENS_URL),
  OPERATOR_EMAIL (your IdP email; used in the route policy).

Host prereqs: docker, docker compose, ssh-keygen, curl, jq.
EOF
    ;;
  *)
    echo "Unknown command: $1" >&2
    echo "Run: $0 --help" >&2
    exit 2
    ;;
esac

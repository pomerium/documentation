#!/usr/bin/env bash
set -euo pipefail

PORT="${PORT:-8899}"
BASE_URL="http://localhost:${PORT}"
DOC_PATH="/docs/capabilities/mcp/protect-mcp-server"
API_PATH="/docs/api"
FIXTURE_DIR="build/docs/markdown-negotiation-test"
MISSING_DOC_PATH="/docs/markdown-negotiation-test/missing"
LOG_FILE="$(mktemp -t pomerium-docs-netlify-dev.XXXXXX.log)"
NETLIFY_PID=""
NETLIFY_DIR_EXISTED=0
CREATED_FIXTURES=()

[[ -e .netlify ]] && NETLIFY_DIR_EXISTED=1

cleanup() {
  if [[ -n "${NETLIFY_PID}" ]] && kill -0 "${NETLIFY_PID}" 2>/dev/null; then
    kill "${NETLIFY_PID}" 2>/dev/null || true
    wait "${NETLIFY_PID}" 2>/dev/null || true
  fi

  for fixture in "${CREATED_FIXTURES[@]}"; do
    rm -f "${fixture}"
  done
  if [[ "${#CREATED_FIXTURES[@]}" -gt 0 ]]; then
    rmdir "${FIXTURE_DIR}" 2>/dev/null || true
  fi

  if [[ "${NETLIFY_DIR_EXISTED}" == "0" ]]; then
    rm -rf .netlify
  fi
  rm -f "${LOG_FILE}"
}
trap cleanup EXIT

fail() {
  echo "markdown negotiation test failed: $*" >&2
  if [[ -f "${LOG_FILE}" ]]; then
    echo "netlify dev log:" >&2
    sed -n '1,220p' "${LOG_FILE}" >&2
  fi
  exit 1
}

require_command() {
  command -v "$1" >/dev/null 2>&1 || fail "missing required command: $1"
}

response_headers() {
  local request_path="$1"
  shift
  curl -sS -o /dev/null -D - "$@" "${BASE_URL}${request_path}" | tr -d '\r'
}

response_body() {
  local request_path="$1"
  shift
  curl -fsS "$@" "${BASE_URL}${request_path}"
}

assert_status() {
  local expected="$1"
  local headers="$2"
  local actual
  actual="$(echo "${headers}" | sed -n '1p' | awk '{print $2}')"
  [[ "${actual}" == "${expected}" ]] ||
    fail "expected status ${expected}, got:
${headers}"
}

assert_header_contains() {
  local headers="$1"
  local header_name="$2"
  local expected="$3"

  echo "${headers}" |
    awk -v header="${header_name}" 'BEGIN {IGNORECASE=1} index($0, header ":") == 1 {print}' |
    grep -iq "${expected}" ||
    fail "expected ${header_name} header to contain ${expected}; got:
${headers}"
}

assert_header_not_contains() {
  local headers="$1"
  local header_name="$2"
  local unexpected="$3"

  if echo "${headers}" |
    awk -v header="${header_name}" 'BEGIN {IGNORECASE=1} index($0, header ":") == 1 {print}' |
    grep -iq "${unexpected}"; then
    fail "expected ${header_name} header not to contain ${unexpected}; got:
${headers}"
  fi
}

assert_response() {
  local label="$1"
  local request_path="$2"
  local expected_status="$3"
  local expected_content_type="$4"
  local expect_vary="$5"
  shift 5

  local headers
  headers="$(response_headers "${request_path}" "$@")"
  assert_status "${expected_status}" "${headers}"
  assert_header_contains "${headers}" "content-type" "${expected_content_type}"

  if [[ "${expect_vary}" == "vary" ]]; then
    assert_header_contains "${headers}" "vary" "Accept"
  fi

  echo "ok - ${label}"
}

assert_markdown_body_starts_with() {
  local request_path="$1"
  local expected="$2"
  shift 2

  local first_line
  first_line="$(response_body "${request_path}" "$@" | sed -n '1p')"
  [[ "${first_line}" == "${expected}" ]] ||
    fail "expected ${request_path} body to start with ${expected}; got: ${first_line}"

  echo "ok - ${request_path} body starts with ${expected}"
}

create_markdown_fixture() {
  local request_path="$1"
  local title="$2"
  local fixture_file="build${request_path}.md"

  if [[ -f "${fixture_file}" ]]; then
    return
  fi

  mkdir -p "$(dirname "${fixture_file}")"
  printf '# %s\n' "${title}" >"${fixture_file}"
  CREATED_FIXTURES+=("${fixture_file}")
}

wait_for_netlify() {
  for _ in {1..60}; do
    if curl -fsS -o /dev/null "${BASE_URL}${DOC_PATH}" 2>/dev/null; then
      return
    fi
    if ! kill -0 "${NETLIFY_PID}" 2>/dev/null; then
      fail "netlify dev exited before becoming ready"
    fi
    sleep 1
  done

  fail "netlify dev did not become ready on ${BASE_URL}"
}

require_command curl
require_command netlify

[[ -d build ]] || fail "build/ does not exist; run yarn build first"
[[ -f build/docs.md ]] || fail "build/docs.md does not exist; run yarn build first"
[[ -f build${DOC_PATH}.md ]] ||
  fail "build${DOC_PATH}.md does not exist; run yarn build first"

DOTTED_DOC_PATH="/docs/markdown-negotiation-test/v1.2.3"
FILE_LIKE_DOC_PATH="/docs/markdown-negotiation-test/config.json"
create_markdown_fixture "${DOTTED_DOC_PATH}" "Dotted Slug"
create_markdown_fixture "${FILE_LIKE_DOC_PATH}" "File-Like Slug"

netlify dev \
  --offline \
  --dir build \
  --port "${PORT}" \
  --no-open \
  --skip-gitignore \
  >"${LOG_FILE}" 2>&1 &
NETLIFY_PID="$!"
wait_for_netlify

assert_response "direct .md" "${DOC_PATH}.md" 200 "text/markdown" "no-vary"

for header in \
  "Accept: text/markdown" \
  "Accept: text/html;q=0.5, text/markdown" \
  "Accept: text/html, text/markdown"
do
  assert_response "markdown negotiation (${header})" "${DOC_PATH}" 200 "text/markdown" "vary" -H "${header}"
done

assert_response "HEAD markdown negotiation" "${DOC_PATH}" 200 "text/markdown" "vary" -I -H "Accept: text/markdown"
assert_markdown_body_starts_with "${DOC_PATH}" "# Protect an MCP Server" -H "Accept: text/markdown"

for header in \
  "" \
  "Accept: */*" \
  "Accept: text/markdown;q=0, text/html" \
  "Accept: text/html, text/markdown;q=0.5"
do
  if [[ -n "${header}" ]]; then
    assert_response "HTML fallback (${header})" "${DOC_PATH}" 200 "text/html" "vary" -H "${header}"
  else
    assert_response "HTML fallback (no Accept)" "${DOC_PATH}" 200 "text/html" "vary"
  fi
done

assert_response "API exclusion" "${API_PATH}" 200 "text/html" "vary" -H "Accept: text/markdown"
headers="$(response_headers "${API_PATH}" -H "Accept: text/markdown")"
assert_header_not_contains "${headers}" "content-type" "text/markdown"

for fixture_path in "${DOTTED_DOC_PATH}" "${FILE_LIKE_DOC_PATH}"; do
  assert_response "dotted/file-like slug ${fixture_path}" "${fixture_path}" 200 "text/markdown" "vary" -H "Accept: text/markdown"
done
assert_markdown_body_starts_with "${DOTTED_DOC_PATH}" "# Dotted Slug" -H "Accept: text/markdown"
assert_markdown_body_starts_with "${FILE_LIKE_DOC_PATH}" "# File-Like Slug" -H "Accept: text/markdown"

assert_response "missing markdown fallback" "${MISSING_DOC_PATH}" 404 "text/html" "vary" -H "Accept: text/markdown"
headers="$(response_headers "${MISSING_DOC_PATH}" -H "Accept: text/markdown")"
assert_header_not_contains "${headers}" "content-type" "text/markdown"

echo "markdown negotiation test passed on ${BASE_URL}"

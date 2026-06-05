#!/bin/bash
set -euo pipefail
cd "$(dirname "$0")/.."

# A valid client cert: should return 200.
curl -v \
	--cacert out/good-ca.crt \
	--key out/good-curl.key \
	--cert out/good-curl.crt \
	https://127.0.0.1:8443

# Other paths to try manually:
#
# Untrusted server CA, good client cert (rejected by curl):
#   curl -v --cacert out/bad-ca.crt \
#     --key out/good-curl.key --cert out/good-curl.crt \
#     https://127.0.0.1:8443
#
# Untrusted client cert from a CA the server doesn't trust (rejected by server):
#   curl -v --cacert out/good-ca.crt \
#     --key out/bad-curl.key --cert out/bad-curl.crt \
#     https://127.0.0.1:8443

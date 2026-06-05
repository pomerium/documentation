#!/bin/bash
# https://github.com/square/certstrap
set -euo pipefail

# Restrict permissions on every file we create from here on. certstrap and
# the .env writer both inherit this umask, so private keys land at 0600.
umask 077

cd "$(dirname "$0")/.."

# Clean any prior output so re-runs start fresh.
rm -rf -- ./out
mkdir -p out

certstrap --depot-path out init --passphrase "" --common-name good-ca
certstrap --depot-path out init --passphrase "" --common-name bad-ca

# pomerium client cert (used by Pomerium to authenticate upstream to mtls).
certstrap --depot-path out request-cert --passphrase "" --common-name pomerium
certstrap --depot-path out sign pomerium --CA good-ca

# downstream app server cert; SANs cover localhost (curl direct) and the
# Compose service name "mtls" (Pomerium → mtls upstream).
certstrap --depot-path out request-cert --passphrase "" \
	-ip 127.0.0.1 -domain web-app,localhost,mtls
certstrap --depot-path out sign web-app --CA good-ca

# good-curl: client cert signed by good-ca, accepted by the mtls server.
certstrap --depot-path out request-cert --passphrase "" --common-name good-curl
certstrap --depot-path out sign good-curl --CA good-ca

# bad-curl: client cert signed by bad-ca, rejected by the mtls server.
certstrap --depot-path out request-cert --passphrase "" --common-name bad-curl
certstrap --depot-path out sign bad-curl --CA bad-ca

# Emit a .env file consumed by docker-compose for the mtls service. Compose
# expects TLS_CERT/TLS_KEY/CLIENT_CA as base64-encoded blobs.
{
	printf 'TLS_CERT=%s\n' "$(base64 < out/web-app.crt | tr -d '\n')"
	printf 'TLS_KEY=%s\n' "$(base64 < out/web-app.key | tr -d '\n')"
	printf 'CLIENT_CA=%s\n' "$(base64 < out/good-ca.crt | tr -d '\n')"
} > .env

echo "Generated certs in ./out/ and env vars in ./.env"

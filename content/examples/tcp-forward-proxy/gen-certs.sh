#!/usr/bin/env sh
# cSpell:ignore addext
set -eu
cd "$(dirname "$0")"

mkdir -p certs
openssl req -x509 -newkey rsa:2048 -nodes -days 365 \
  -keyout certs/pomerium.key -out certs/pomerium.crt \
  -subj "/CN=*.localhost.pomerium.io" \
  -addext "subjectAltName=DNS:*.localhost.pomerium.io"

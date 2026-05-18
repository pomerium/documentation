#!/usr/bin/env sh
# cSpell:ignore CAcreateserial extfile

set -eu

cd "$(dirname "$0")"

mkdir -p certs
rm -f certs/ca.crt certs/ca.key certs/ca.srl certs/pomerium.crt certs/pomerium.csr certs/pomerium.key

openssl genrsa -out certs/ca.key 4096
openssl req -x509 -new -nodes -days 365 \
  -key certs/ca.key \
  -out certs/ca.crt \
  -subj "/CN=localhost.pomerium.io demo CA"

openssl genrsa -out certs/pomerium.key 2048
openssl req -new \
  -key certs/pomerium.key \
  -out certs/pomerium.csr \
  -config certs/openssl.cnf

openssl x509 -req -days 365 \
  -in certs/pomerium.csr \
  -CA certs/ca.crt \
  -CAkey certs/ca.key \
  -CAcreateserial \
  -out certs/pomerium.crt \
  -extensions v3_req \
  -extfile certs/openssl.cnf

rm -f certs/ca.key certs/ca.srl certs/pomerium.csr

#!/bin/sh
# Generate a local CA and a wildcard *.localhost.pomerium.io leaf certificate
# for the sealed guide-validation harness. Test-only, never used in production.
#
# A single wildcard cert covers every route host the guides use
# (authenticate.localhost.pomerium.io, verify.localhost.pomerium.io,
# grafana.localhost.pomerium.io, ...), so individual guides never touch this.

set -e

CERTS_DIR="${CERTS_DIR:-/certs}"
DOMAIN="localhost.pomerium.io"
DAYS_VALID=365

# Skip if a still-valid cert already exists (idempotent across runs).
if [ -f "$CERTS_DIR/pomerium.crt" ] && [ -f "$CERTS_DIR/pomerium.key" ]; then
    if openssl x509 -checkend 86400 -noout -in "$CERTS_DIR/pomerium.crt" 2>/dev/null; then
        echo "Certificates already exist and are valid, skipping generation"
        exit 0
    fi
fi

if ! command -v openssl >/dev/null 2>&1; then
    apk add --no-cache openssl >/dev/null 2>&1
fi

mkdir -p "$CERTS_DIR"

openssl genrsa -out "$CERTS_DIR/ca.key" 4096
openssl req -new -x509 -days $DAYS_VALID -key "$CERTS_DIR/ca.key" \
    -out "$CERTS_DIR/ca.crt" \
    -subj "/C=US/ST=Test/L=Test/O=Pomerium Guides Harness/CN=Pomerium Guides Harness CA"

cat > "$CERTS_DIR/openssl.cnf" << EOF
[req]
distinguished_name = req_distinguished_name
req_extensions = v3_req
prompt = no

[req_distinguished_name]
C = US
ST = Test
L = Test
O = Pomerium Guides Harness
CN = *.${DOMAIN}

[v3_req]
basicConstraints = CA:FALSE
keyUsage = nonRepudiation, digitalSignature, keyEncipherment
subjectAltName = @alt_names

[alt_names]
DNS.1 = *.${DOMAIN}
DNS.2 = ${DOMAIN}
DNS.3 = localhost
IP.1 = 127.0.0.1
EOF

openssl genrsa -out "$CERTS_DIR/pomerium.key" 2048
openssl req -new -key "$CERTS_DIR/pomerium.key" \
    -out "$CERTS_DIR/pomerium.csr" \
    -config "$CERTS_DIR/openssl.cnf"
openssl x509 -req -days $DAYS_VALID \
    -in "$CERTS_DIR/pomerium.csr" \
    -CA "$CERTS_DIR/ca.crt" \
    -CAkey "$CERTS_DIR/ca.key" \
    -CAcreateserial \
    -out "$CERTS_DIR/pomerium.crt" \
    -extensions v3_req \
    -extfile "$CERTS_DIR/openssl.cnf"

rm -f "$CERTS_DIR/pomerium.csr" "$CERTS_DIR/openssl.cnf"
chmod 644 "$CERTS_DIR"/*.crt "$CERTS_DIR"/*.key

echo "Certificates generated:"
openssl x509 -in "$CERTS_DIR/pomerium.crt" -noout -subject -dates -ext subjectAltName

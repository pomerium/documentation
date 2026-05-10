# Mutual Authenticated TLS Example

A tiny Go HTTP server that enforces client certificates and can be used to test
mutual TLS with Pomerium.

## What this demonstrates

Two things:

1. A standalone mTLS-protected upstream (`mtls`) that requires a client
   certificate signed by a trusted CA. You can hit it directly with `curl`.
2. A reference Pomerium configuration that proxies to that upstream while
   presenting its own client certificate (`tls_client_cert_file`) and
   verifying the upstream against a custom CA (`tls_custom_ca_file`).

The end-to-end demo path (`docker compose up mtls` + `./scripts/curl.sh`)
exercises (1) directly. (2) is a configuration reference; running Pomerium
end-to-end requires your own identity provider credentials and external TLS.

## Quick start

Prerequisites: Docker and [`certstrap`](https://github.com/square/certstrap).

```bash
./scripts/generate_certs.sh   # wipes and recreates ./out/, writes ./.env
docker compose up mtls -d     # builds the Go server and runs it on :8443
./scripts/curl.sh             # mTLS round-trip against the running server
```

`./out/` and `./.env` are generated on demand and gitignored. Re-running
`generate_certs.sh` deletes any existing `./out/` first so re-runs produce
clean state. The script runs under `umask 077`, so every file in `./out/`
(including the private keys) and `./.env` itself land with `0600`
permissions.

If you run the reference `pomerium` Compose service (`docker compose
--profile reference up`), the container reads cert/key files from
`/pomerium/out` mounted read-only from `./out`. The default Pomerium image
runs as a non-root user, so the `0600` files won't be readable; for the
reference profile you'll either need to relax the perms (`chmod -R 0644
out/*.crt && chmod 0640 out/*.key` plus a matching group), or run the
container with a UID that matches your local owner via `user:` in the
Compose service.

## Files

- `main.go` — the Go HTTP server that enforces client certs.
- `Dockerfile` — multi-stage build of the Go server into a distroless image.
- `docker-compose.yaml` — runs the `mtls` server (and optionally a reference
  Pomerium service that proxies to it).
- `example.config.yaml` — Pomerium config showing how to route through to an
  mTLS upstream using
  `tls_custom_ca_file`/`tls_client_cert_file`/`tls_client_key_file`. Replace
  the `REPLACE_ME` identity-provider values and the `corp.domain.example`
  hostnames before running Pomerium.
- `scripts/generate_certs.sh` — generates a good CA, a bad CA, a Pomerium
  client cert, a server cert (with SANs for `localhost`, `web-app`, and the
  `mtls` Compose service name), and good/bad client certs for the curl
  tests. Also writes a `.env` file the Compose `mtls` service consumes.
- `scripts/curl.sh` — exercises the running mTLS server with the good client
  cert; commented variants demonstrate the rejection paths.

## Running Pomerium against the mTLS upstream

The `pomerium` service in `docker-compose.yaml` is a reference, not a working
demo. To wire it up end-to-end you need:

- Real `CERTIFICATE` / `CERTIFICATE_KEY` env vars for Pomerium's external TLS
  (or use `autocert: true` and an externally reachable hostname).
- A `COOKIE_SECRET` (32 bytes base64).
- Working identity-provider credentials in `example.config.yaml`.
- DNS for `mtls.corp.domain.example` (or whatever you change it to) pointing
  at the host running Pomerium.

Pomerium will read its upstream client cert / key / CA from
`/pomerium/out/*.crt`, mounted from `./out` in this directory.

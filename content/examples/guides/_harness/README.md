# Guide validation harness

Shared scaffolding that proves a guide's **entire** flow — including a real SSO
login — inside a sealed Docker Compose environment. CI runs it on every change to a
guide's example; you can run it locally too.

This directory is internal tooling. It is never imported into a published guide and
is excluded from spell-check and formatting (it lives under `content/examples/`).

## Why this exists

Published guides recommend **Pomerium Zero** / the **hosted authenticate service**,
which need real cloud calls, public DNS, and an interactive browser login and so
cannot be sealed. To validate deterministically, the harness swaps that one piece
for an **in-network Keycloak** — the same self-hosted IdP the guides link as the
[Keycloak fallback](/docs/integrations/user-identity/keycloak) — and drives the
login with a headless browser. Everything else (routing, TLS, policy, identity
headers, the upstream app) is exactly what the guide ships.

## What's here

- `gen-certs.sh` — writes a CA + wildcard `*.localhost.pomerium.io` leaf into the
  shared `certs` volume. One cert covers every route host.
- `keycloak/` — realm export (`pomerium-e2e`) + users, imported at startup. Seeded
  user: `alice@company.com` / `password123` (groups `admins`, `engineering`).
- `pomerium/config.base.yaml` — template for a guide's validation-only Pomerium
  config (self-hosted authenticate + Keycloak + test secrets).
- `compose/compose.harness.yaml` — the reusable services: `certs-init`, `keycloak`,
  and the `test-runner` (headless browser). A guide `include:`s this.
- `browser/` — the Playwright runner image. `lib/authn.ts` drives the login;
  `tests/access.spec.ts` is the default check for any HTTP upstream (route requires
  auth; allowed user reaches the app). Guides whose upstream consumes identity
  (JWT/headers) add their own `assert.spec.ts` and reuse `../lib/authn`.
- `selftest/` — proves the harness itself against `pomerium/verify`.

## Run it

```bash
# Prove the harness:
scripts/validate-guide-fixtures.sh --selftest

# Validate one guide:
scripts/validate-guide-fixtures.sh grafana
```

The runner exits non-zero on any failure; the script dumps container logs on
failure and always tears the stack down (`down -v`).

## Add validation to a guide

In `content/examples/guides/<id>/validate/`:

1. `compose.validate.yaml` — `include:` `../../_harness/compose/compose.harness.yaml`,
   then define the guide's `pomerium` (mounting `pomerium.validate.yaml` + the
   `certs` volume, with `authenticate.localhost.pomerium.io` and
   `<id>.localhost.pomerium.io` network aliases) and the upstream service. Point
   `test-runner` at the route with `depends_on` and, for an app-specific check,
   mount a spec and set `PW_TEST_DIR`.
2. `pomerium.validate.yaml` — copy `_harness/pomerium/config.base.yaml`, append the
   guide's route.
3. (optional) `url.txt` — the route URL if it isn't `https://<id>.localhost.pomerium.io`.
4. (optional) `assert.spec.ts` — app-specific success check; reuse `../lib/authn`.

Guides that can't be sealed (cloud, Kubernetes, hardware) simply omit `validate/`;
add `validate/SKIP` with a one-line reason so the discovery step can report it.

Everything here is **test-only**. The Keycloak admin is open and the Pomerium
secrets are static and public. Never reuse them anywhere real.

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
[Keycloak fallback](/docs/integrations/user-identity/oidc) — and drives the
login with a headless browser. Everything else (routing, TLS, policy, identity
headers, the upstream app) is exactly what the guide ships.

## What's here

- `gen-certs.sh` — writes a CA + wildcard `*.localhost.pomerium.io` leaf into the
  shared `certs` volume. One cert covers every route host.
- `keycloak/` — realm export (`pomerium-e2e`) + users, imported at startup. Seeded
  user: `alice@company.com` / `password123` (groups `admins`, `engineering`).
- `pomerium/validation.env` — the shared validation-only Pomerium settings (IdP,
  secrets, signing key, certs, claim headers) injected into every fixture via
  `env_file:`, so each guide's config is routes-only.
- `compose/compose.harness.yaml` — the reusable services: `certs-init`, `keycloak`,
  and the `test-runner` (headless browser). A guide `include:`s this; it never
  redefines `test-runner` (the script injects each guide's spec at run time).
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
   then define the guide's `pomerium` (`env_file: ../../_harness/pomerium/validation.env`,
   mounting `routes.validate.yaml` as the config + the `certs` volume, with
   `authenticate.localhost.pomerium.io` and `<id>.localhost.pomerium.io` aliases) and
   the upstream service. Do NOT redefine `test-runner`. Use the same image refs the
   reader `docker-compose.yaml` ships (pin identical digests).
2. `routes.validate.yaml` — routes-only (plus `jwt_claims_headers:` if the app
   consumes claim headers). Everything else comes from `validation.env`.
3. (optional) `url.txt` — the route URL if it isn't `https://<id>.localhost.pomerium.io`.
4. (optional) `assert.spec.ts` — app-specific success check; `import { login } from "../lib/authn"`
   and `import { shot } from "../lib/shot"`. The script auto-mounts it when present.

Screenshots: `scripts/validate-guide-fixtures.sh <id> --update-screenshots` writes
captured images into `content/docs/guides/img/<id>/`; reference one in the guide.
Normal runs / CI never rewrite committed images. The script also enforces that a
sealable guide references a screenshot or ships `validate/screenshots-skip` with a reason.

Guides that can't be sealed (cloud, Kubernetes, hardware) ship `validate/SKIP` with a
one-line reason; the script reports it and exits 0.

Everything here is **test-only**. The Keycloak admin is open and the Pomerium
secrets are static and public. Never reuse them anywhere real.

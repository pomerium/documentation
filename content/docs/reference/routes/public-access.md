---
id: public-access
title: Public Access
keywords:
  - reference
  - Public Access
pagination_prev: null
pagination_next: null
---

# Public Access

- `yaml`/`json` setting: `allow_public_unauthenticated_access`
- Type: `bool`
- Optional
- Default: `false`

**Use with caution:** Allow all requests for a given route, bypassing authentication and authorization. Suitable for publicly exposed web services.

If this setting is enabled, no whitelists (e.g. Allowed Users) should be provided in this route.

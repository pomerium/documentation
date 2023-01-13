---
id: service-mode
title: Service Mode
description: |
  Service mode sets the pomerium service(s) to run.
keywords:
  - reference
  - Service Mode
pagination_prev: null
pagination_next: null
---

# Service Mode

- Environmental Variable: `SERVICES`
- Config File Key: `services`
- Kubernetes: not customizable
- Type: `string`
- Default: `all`
- Options: `all` `authenticate` `authorize` `databroker` or `proxy`

Service mode sets which service(s) to run. If testing, you may want to set to `all` and run pomerium in "all-in-one mode." In production, you'll likely want to spin up several instances of each service mode for high availability.

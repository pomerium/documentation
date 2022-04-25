---
id: policy
title: Policy
keywords:
- reference
- Policy
---


# Policy
- Environmental Variable: `POLICY`
- Config File Key: `policy`
- Type: [base64 encoded] `string` or inline policy structure in config file
- **Deprecated**: This key has been replaced with `route`.


::: warning
The `policy` field as a top-level configuration key has been replaced with [`routes`](/reference/readme#routes). Moving forward, define policies within each defined route.

Existing policy definitions will currently behave as expected, but are deprecated and will be removed in a future version of Pomerium.
:::

Policy contains route specific settings, and access control details. If you are configuring via POLICY environment variable, just the contents of the policy needs to be passed. If you are configuring via file, the policy should be present under the policy key. For example,

<<< @/examples/config/policy.example.yaml

Policy routes are checked in the order they appear in the policy, so more specific routes should appear before less specific routes. For example:

```yaml
policy:
  - from: http://from.example.com
    to: http://to.example.com
    prefix: /admin
    allowed_groups: ["superuser"]
  - from: http://from.example.com
    to: http://to.example.com
    allow_public_unauthenticated_access: true
```

In this example, an incoming request with a path prefix of `/admin` would be handled by the first route (which is restricted to superusers). All other requests for `from.example.com` would be handled by the second route (which is open to the public).

A list of configuration variables specific to `policy` follows Note that this also shares all configuration variables listed under [routes](/reference/readme#routes), excluding `policy` and its child variables.


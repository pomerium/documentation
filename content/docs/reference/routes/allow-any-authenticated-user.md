---
id: allow-any-authenticated-user
title: Allow Any Authenticated User
keywords:
  - reference
  - Allow Any Authenticated User
pagination_prev: null
pagination_next: null
---

# Allow Any Authenticated User

- `yaml`/`json` setting: `allow_any_authenticated_user`
- Type: `bool`
- Optional
- Default: `false`

**Use with caution:** This setting will allow all requests for any user which is able to authenticate with our given identity provider. For instance, if you are using a corporate GSuite account, an unrelated gmail user will be able to access the underlying upstream.

Use of this setting means Pomerium **will not enforce centralized authorization policy** for this route. The upstream is responsible for handling any authorization.

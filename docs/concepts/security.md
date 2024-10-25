### Authentication Cookie Handling

Pomerium automatically strips its authentication cookies (`_pomerium`) from requests before forwarding them to upstream services. This security feature:

- Prevents [credential replay attacks](https://owasp.org/www-community/attacks/Credential_Reuse_Attack)
- Ensures authentication tokens don't leak to backend services
- Requires no additional configuration

This process is handled by Pomerium's proxy and implemented in the [`clean-upstream.lua`](https://github.com/pomerium/pomerium/blob/main/config/envoyconfig/luascripts/clean-upstream.lua) script.

By removing these cookies, Pomerium maintains a clear separation between its authentication layer and your application logic, enhancing overall security. This approach addresses a common shortcoming of external authorization-style solutions like OAuth2 Proxy, which may inadvertently expose authentication tokens to backend services, increasing the risk of token theft and misuse.

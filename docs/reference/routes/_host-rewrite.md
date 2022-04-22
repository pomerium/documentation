---
id: host-rewrite
title: Host Rewrite
keywords:
- reference
- Host Rewrite
---


# Host Rewrite
- `yaml`/`json` settings: `host_rewrite`, `host_rewrite_header`, `host_path_regex_rewrite_pattern`, `host_path_regex_rewrite_substitution`
- Type: `string`
- Optional
- Example: `host_rewrite: "example.com"`

The `host` header can be preserved via the `preserve_host_header` setting or customized via three mutually exclusive options:

1. `preserve_host_header` will, when enabled, this option will pass the host header from the incoming request to the proxied host, instead of the destination hostname. It's an optional parameter of type `bool` that defaults to `false`.

    See [ProxyPreserveHost](http://httpd.apache.org/docs/2.0/mod/mod_proxy.html#proxypreservehost).
2. `host_rewrite`, which will rewrite the host to a new literal value.
3. `host_rewrite_header`, which will rewrite the host to match an incoming header value.
4. `host_path_regex_rewrite_pattern` & `host_path_regex_rewrite_substitution`, which will rewrite the host according to a regex matching the path. For example with the following config:

    ```yaml
    host_path_regex_rewrite_pattern: "^/(.+)/.+$"
    host_path_regex_rewrite_substitution: \1
    ```

    Would rewrite the host header to `example.com` given the path `/example.com/some/path`.

The 2nd, 3rd and 4th options correspond to the Envoy route action host related options, which can be found [here](https://www.envoyproxy.io/docs/envoy/latest/api-v3/config/route/v3/route_components.proto.html#config-route-v3-routeaction).


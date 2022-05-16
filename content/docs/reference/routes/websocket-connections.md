---
id: websocket-connections
title: Websocket Connections
keywords:
- reference
- Websocket Connections
pagination_prev: null
pagination_next: null
---


# Websocket Connections
- Config File Key: `allow_websockets`
- Type: `bool`
- Default: `false`

If set, enables proxying of websocket connections.

:::warning

**Use with caution:** websockets are long-lived connections, so [global timeouts](#global-timeouts) are not enforced (though the policy-specific `timeout` is enforced). Allowing websocket connections to the proxy could result in abuse via [DOS attacks](https://www.cloudflare.com/learning/ddos/ddos-attack-tools/slowloris/).

:::


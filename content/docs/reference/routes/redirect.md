---
id: redirect
title: Redirect
keywords:
- reference
- Redirect
pagination_prev: null
pagination_next: null
---


# Redirect
- `yaml`/`json` setting: 'redirect'
- Type: object
- Optional
- Example: `{ "host_redirect": "example.com" }`

`Redirect` is used to redirect incoming requests to a new URL. The `redirect` field is an object with several possible
options:

- `https_redirect` (boolean): the incoming scheme will be swapped with "https".
- `scheme_redirect` (string): the incoming scheme will be swapped with the given value.
- `host_redirect` (string): the incoming host will be swapped with the given value.
- `port_redirect` (integer): the incoming port will be swapped with the given value.
- `path_redirect` (string): the incoming path portion of the URL will be swapped with the given value.
- `prefix_rewrite` (string): the incoming matched prefix will be swapped with the given value.
- `response_code` (integer): the response code to use for the redirect. Defaults to 301.
- `strip_query` (boolean): indicates that during redirection, the query portion of the URL will be removed. Defaults to false.

Either `redirect` or `to` must be set.


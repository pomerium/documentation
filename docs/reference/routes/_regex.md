---
id: regex
title: Regex
keywords:
- reference
- Regex
---


# Regex
- `yaml`/`json` setting: `regex`
- Type: `string` (containing a regular expression)
- Optional
- Example: `^/(admin|superuser)/.*$`

If set, the route will only match incoming requests with a path that matches the specified regular expression. The supported syntax is the same as the Go [regexp package](https://golang.org/pkg/regexp/) which is based on [re2](https://github.com/google/re2/wiki/Syntax).


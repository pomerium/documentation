---
id: regex-rewrite
title: Regex Rewrite
keywords:
  - reference
  - Regex Rewrite
pagination_prev: null
pagination_next: null
---

# Regex Rewrite

- `yaml`/`json` setting: `regex_rewrite_pattern`, `regex_rewrite_substitution`
- Type: `string`
- Optional
- Example: `{ "regex_rewrite_pattern":"^/service/([^/]+)(/.*)$", "regex_rewrite_substitution": "\\2/instance/\\1" }`

If set, the URL path will be rewritten according to the pattern and substitution, similar to `prefix_rewrite`.

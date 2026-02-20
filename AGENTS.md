# AGENTS.md

Pomerium documentation site built with **Docusaurus 3.8** (React + MDX). Published at https://pomerium.com/docs. Pomerium is an identity-aware proxy for zero-trust access.

## Commands

```bash
yarn start           # Dev server on localhost:3001 (hot-reload)
yarn build           # Production build to /build/
yarn format          # Auto-fix formatting with Prettier
yarn format-check    # Check formatting (no changes)
yarn cspell "**/*"   # Spell-check all files
yarn precommit       # Runs format-check + cspell
yarn clear           # Clear Docusaurus cache (useful if build fails)
```

Pre-commit hooks run Prettier on `content/**` files and cspell on all files.

## Architecture

### Content structure

All documentation lives in `content/` (not `docs/`). The Docusaurus `routeBasePath` is `/` and the `path` is `content`, so files at `content/docs/foo.mdx` become routes at `/docs/foo`.

```
content/
  docs/
    get-started/      # Quickstart and fundamentals
    deploy/           # Deployment guides (cloud, k8s, enterprise, clients)
    capabilities/     # Core features (auth, authz, routing, MCP, SSH, etc.)
    reference/        # Configuration reference (~30 .mdx files)
    guides/           # How-to guides for integrations (~50 files)
    integrations/     # Identity provider setup (OIDC, Okta, Azure AD, etc.)
    internals/        # Architecture documentation
    admonitions/      # Reusable MDX snippet files (prefixed with _)
  examples/           # Code examples (Docker, K8s, Terraform, etc.)
```

### Three sidebars (sidebars.js)

- **documentation**: Main docs (Get Started, Deploy, Capabilities, Internals, Integrations)
- **reference**: Configuration reference (auto-generated from `docs/reference/`)
- **guides**: How-to guides (auto-generated from `docs/guides/`)

Enterprise-only sidebar items use `className: 'enterprise'`.

### Custom components

- `src/components/ReferenceTable.js` — MUI DataGridPro for config reference, reads from `content/docs/reference/reference.json`
- `src/theme/Admonition/Types.js` — Custom `:::enterprise` admonition type
- `plugins/llms-txt-plugin.js` — Generates `/llms.txt` during build for LLM consumption

### Key config files

- `docusaurus.config.js` — Site config. Broken links set to `throw` (both `onBrokenLinks` and `onBrokenMarkdownLinks`)
- `.prettierrc` — 80 chars, single quotes, trailing commas, `proseWrap: never`
- `cspell.json` — Custom dictionary (~290 words). Add new Pomerium-specific terms here when cspell fails on intentional words

## Content Authoring Conventions

### Frontmatter

```yaml
---
title: 'Page Title'
sidebar_label: 'Menu Label'
description: 'SEO description'
keywords: [pomerium, relevant, terms]
lang: en-US
---
```

### Admonitions

Standard types plus a custom `:::enterprise` for enterprise-only features:

```markdown
:::note :::tip :::info :::caution :::danger :::enterprise
```

### Tabs (Zero vs Core)

```mdx
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="zero" label="Pomerium Zero">
    ...
  </TabItem>
  <TabItem value="core" label="Pomerium Core">
    ...
  </TabItem>
</Tabs>
```

### Reusable snippets

Stored as `content/docs/admonitions/_name.mdx` (underscore prefix). Imported as:

```mdx
import SemanticVersioning from '@site/content/docs/admonitions/_semantic-versioning.mdx';

<SemanticVersioning />
```

### Diagrams

Mermaid is enabled. Use fenced code blocks with `mermaid` language.

### Syntax highlighting

Extra Prism languages available: `actionscript`, `log`, `ini`, `nginx`, `rego`, `hcl`, `shell-session`, `json`.

## Commit Messages

Follow the pattern: `docs: description of change (#PR)` or `docs(scope): description (#PR)`.

## Important Notes

- Broken links cause build failures (`onBrokenLinks: 'throw'`). Always verify internal link paths match file structure.
- Images go in `content/docs/[section]/img/` directories alongside the content.
- The `content/docs/deploy/k8s/reference.md` file is excluded from Prettier formatting (auto-generated).
- Prose wrap is set to `never` — Prettier won't reflow markdown text.
- API docs are auto-generated from an OpenAPI spec via `redocusaurus` at `/docs/api/`.

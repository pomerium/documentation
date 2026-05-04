---
name: guide-review
description: Review a Pomerium guide using the Pomerium Guides Rubric. Scores guides across 10 weighted dimensions (45-point scale), checks for publish blockers, and provides actionable feedback. Use when reviewing, creating, or improving Pomerium documentation guides.
compatibility: Requires file-read access to the guide being reviewed.
metadata:
  author: pomerium
  version: '1.0'
---

# Pomerium Guide Review

## When to use this skill

Use this skill when:

- Reviewing a Pomerium guide before publishing
- Creating a new Pomerium guide and checking it against quality standards
- Improving an existing guide based on structured feedback

## How to review a guide

1. Read the guide to be reviewed.
2. Load the full rubric from [references/rubric.md](references/rubric.md).
3. Score each of the 10 dimensions (0-3) using the rubric criteria.
4. Check for all publish blockers.
5. Check minimum evidence requirements.
6. Present the completed review worksheet as a table (format below).
7. List any publish blockers found.
8. Provide specific, actionable recommendations for improvement, ordered by impact.
9. Give the final publish recommendation.

## Scoring overview

Each dimension is scored 0 (Missing) to 3 (Excellent). Critical dimensions are weighted 2x, standard 1x. Maximum score is **45**.

**Critical dimensions (2x):** Prerequisites + Environment Assumptions, Procedural Clarity, Verification + Checkpoints, Troubleshooting + Failure Modes, Security + Risk Posture.

**Standard dimensions (1x):** Audience + Outcome, Use-Case Fit + Decision Support, Architecture + Request Flow Context, Operations + Lifecycle Management, Maintainability + Scanability.

### Score bands

- **38-45**: Publish-ready
- **29-37**: Strong draft, needs targeted edits
- **20-28**: Needs substantial revision
- **0-19**: Major rewrite recommended

A guide is **not** publish-ready if any publish blocker is present, regardless of score.

## Publish blockers

A guide is not publish-ready if any of the following are true:

- Missing prerequisites section
- Prerequisites section does not include a working Pomerium Zero cluster (with link to [Quickstart](/docs/get-started/quickstart)) or an equivalent self-hosted deploy prereq
- No verification steps or success criteria
- No troubleshooting section
- No security caveats for externally exposed services or identity-sensitive flows
- No rollback, cleanup, or teardown path where changes are made **and** where Operations + Lifecycle Management is applicable (see dimension 9 in the rubric — guides that only configure a managed control plane are exempt)
- Commands, config snippets, or manifests contain unresolved placeholders
- Steps depend on unexplained environment assumptions
- Moved or deprecated content is listed as an active guide without clear labeling
- The guide cannot be followed without guessing at key values, sequence, or expected outcomes
- Prose contains em dashes (`—`, `–`) or emojis (see **Style rules** below)
- An acronym is used before being defined (see **Style rules** below). Well-known internet-infrastructure acronyms are exempt; product-specific and guide-local acronyms are not.

## Minimum evidence requirements

Every guide should include, at minimum:

- 1 explicit "what this guide does" statement
- 1 explicit "when to use this guide" statement
- 1 prerequisites section, which must include an explicit "working Pomerium Zero cluster" prereq linking to [/docs/get-started/quickstart](/docs/get-started/quickstart) (self-hosted guides may substitute an equivalent deploy link, but a running cluster must still be stated as a prereq)
- 1 architecture or request-flow explanation
- 3 verification checkpoints
- 3 troubleshooting entries
- 2 security caveats
- 1 operations section covering rollback and cleanup — **only when Operations + Lifecycle Management is applicable** (see dimension 9 in the rubric). Guides that only configure a managed control plane (for example, Pomerium Zero route/policy/settings changes) are exempt and do not need a dedicated Operations section. Upgrade guidance within that section is itself only required when the guide installs or pins a Pomerium component whose version the reader controls.
- Copy-pasteable commands and config examples
- Consistent variable and placeholder naming
- At least one clear expected end-state or definition of done

## Review worksheet output format

| Dimension | Raw Score (0-3) | Weight | Weighted Score | Notes |
| --- | --: | --: | --: | --- |
| Audience + Outcome |  | 1 |  |  |
| Use-Case Fit + Decision Support |  | 1 |  |  |
| Prerequisites + Environment Assumptions |  | 2 |  |  |
| Architecture + Request Flow Context |  | 1 |  |  |
| Procedural Clarity |  | 2 |  |  |
| Verification + Checkpoints |  | 2 |  |  |
| Troubleshooting + Failure Modes |  | 2 |  |  |
| Security + Risk Posture |  | 2 |  |  |
| Operations + Lifecycle Management (may be N/A) |  | 1 |  |  |
| Maintainability + Scanability |  | 1 |  |  |

**Total Weighted Score:** \_\_\_\_ / 45 (or \_\_\_\_ / 42 if Operations + Lifecycle Management is N/A)

**Publish blockers present:** Yes / No **Publish recommendation:** Publish-ready / Needs edits / Major revision

## Style rules

These are hard rules. A guide that violates them is not publish-ready regardless of score.

- **No em dashes (`—`) or en dashes (`–`) in prose.** Use a period, comma, colon, parentheses, or rewrite the sentence. Em dashes are a strong LLM-output tell and read inconsistent across the guides set. This rule applies to body prose, callouts, list items, headings, and table cells. It does not apply to code, config, CLI output, or content quoted from external sources.
- **No emojis anywhere.** No decorative emojis in headings, no status emojis (✅ ❌ ⚠️ 🎉 🚀 💡 etc.) in prose or lists, no emoji bullets. Use plain Markdown and Docusaurus admonitions (`:::note`, `:::tip`, `:::warning`, `:::danger`, `:::info`) for emphasis and tone instead. Unicode symbols that are not emoji (arrows like `→`, checkmarks inside code examples, mathematical symbols) are fine when they carry meaning.
- **Expand every acronym on first use.** The first time an acronym appears in the guide, write the full term followed by the acronym in parentheses, for example `Security Information and Event Management (SIEM)`, `Client ID Metadata Document (CIMD)`, `Pomerium Policy Language (PPL)`. Subsequent uses may use the short form. This applies to the body, admonitions, tables, diagrams captions, and front-matter descriptions. Widely-understood internet-infrastructure acronyms where spelling out would read as noise (HTTP, HTTPS, HTML, URL, TLS, DNS, IP, JSON, YAML, API, SDK, CLI, UI, OS, VM, CPU, RAM, UUID, SSO, OAuth, OIDC, SAML, JWT, CSV, PDF, MIME, PKI, CA, CRL, CDN, SaaS, IaaS, PaaS, CI, CD, PR, SQL, REST, gRPC, RPC, RFC) are exempt from this rule. Product-specific or guide-local acronyms (for example TE / TI / AS / PRM / DCR / CIMD / PPL / IdP / SIEM / MCP on first use in that guide) are **not** exempt. When in doubt, expand.
- **Prefer descriptive nouns over bare acronyms in later paragraphs when the guide spans many sections.** If the guide is long enough that a reader might land on a later section without reading the definition, reintroduce the full form once per major section heading, or reword to use a descriptive noun ("the cached upstream token") instead of the bare acronym ("the cached TI"). Readability beats strict consistency.

When flagging a violation, quote the offending line and suggest a concrete rewrite.

## Scope

A guide's job is to walk a reader through a sequence of configuration actions. Background material (internals, protocol mechanics, data model descriptions, design rationale) competes with the steps for the reader's attention and makes the guide slower to execute from. Reference and internals docs exist for that material; a guide should link to them rather than inline them.

- **Link to explainers, don't inline them.** If a concept is load-bearing for a step, fold one load-bearing sentence into the step itself and link to the reference or internals doc for the full story. A useful test: if you can remove a paragraph and the reader can still complete the procedure without confusion, that paragraph belongs elsewhere. Common offenders are sections titled "How X works" or "What state lives in Y" that appear between prerequisites and the first numbered step.
- **When flagging a violation, suggest the link target along with the rewrite.** The fix is rarely "delete this paragraph"; it's "move this paragraph to `/docs/reference/X` and replace it here with a one-sentence prereq plus a link."

This is a judgment call, not a binary check. A short explainer that genuinely anchors the next step is fine; a multi-paragraph conceptual sidebar is not. When unsure, err toward linking out.

## Diagram guidelines

When a guide needs diagrams, follow these rules:

- **Swim lane charts**: Use Mermaid diagrams. Mermaid is already enabled in Docusaurus and renders natively in fenced code blocks with the `mermaid` language tag.
- **All other diagrams** (architecture, request flow, topology, sequence, etc.): Prefer the **Excalidraw MCP server**, which is available in the organization. Excalidraw produces clear, hand-drawn-style visuals that are easier to scan than dense box-and-arrow diagrams. Export the diagram as SVG or PNG and place it in the guide's `img/{guide-name}/` directory. For example, a diagram for the `grafana.mdx` guide goes in `content/docs/guides/img/grafana/` where `{guide-name}` is replaced with the actual guide name, e.g. grafana.

If Excalidraw MCP is not enabled for your account, enable it before generating non-swim-lane diagrams. Mermaid is an acceptable fallback only when Excalidraw is unavailable.

## Screenshots

When creating a guide, capture relevant screenshots of Pomerium Zero as you navigate through the steps the guide describes. Screenshots ground abstract instructions in what the user will actually see and are especially valuable for UI-heavy flows.

**How to capture screenshots:** Guide creation most commonly happens in Claude.ai or the Claude Code desktop app (Cowork), where Pomerium Zero is navigated via the Claude browser extension. Although the browser extension can take screenshots, those screenshots are confined to the browser sandbox and cannot be written to the repository. Use the **Chrome DevTools MCP** instead which you have access to — it captures screenshots outside the sandbox and allows them to be placed directly in the guide's `img/` directory.

- Place screenshots in the guide's `img/{guide-name}/` directory alongside any diagrams, for example `content/docs/guides/img/grafana/`.
- Use descriptive, lowercase, hyphenated filenames that match the step they illustrate, for example `route-config-tls-settings.png`.
- Crop screenshots to the relevant UI area. Avoid full-browser captures that bury the relevant element in surrounding UI noise.
- After placing a screenshot, reference it in the guide with a descriptive `alt` attribute.
- If the Chrome DevTools MCP is not available, note where screenshots should go and describe what each should show so they can be added in a follow-up pass.

## Pre-publish validation

After drafting or revising a guide, run these checks before marking it publish-ready:

1. **Format**: Run `yarn format` to auto-fix formatting issues (Prettier with prose wrap `never`, single quotes, trailing commas).
2. **Spell check**: Run `yarn cspell` to find unknown words. For intentional Pomerium-specific or guide-specific terms, add them to the `words` array in `cspell.json`. Do not suppress legitimate typos.
3. **Full check**: Run `yarn check` (runs both `format-check` and `cspell`) to confirm a clean pass.
4. **Build**: Run `yarn build` to verify there are no broken links. The site is configured with `onBrokenLinks: 'throw'`, so any dead internal links will fail the build.
5. **Frontmatter**: Verify the guide has all required frontmatter fields: `title`, `sidebar_label`, `description`, `keywords`, and `lang: en-US`.

Fix any issues found and re-run until all checks pass cleanly.

## Scoring guidance

When scoring, optimize for whether a reasonably skilled operator can succeed without opening three extra tabs, guessing at hidden assumptions, or discovering the security caveats by accident.

A guide with polished prose and weak execution detail should not score well.

When recommending troubleshooting improvements, suggest this table format:

| Symptom | Likely Cause | What to Check | Fix |
| ------- | ------------ | ------------- | --- |

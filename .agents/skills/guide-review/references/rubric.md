# Pomerium Guides Rubric — Full Dimension Criteria

## Required section structure

Recommended canonical structure:

1. What this guide does
2. When to use it
3. Who this is for
4. Prerequisites
5. Architecture and request flow
6. Step-by-step implementation
7. Verify the setup
8. Common failure modes
9. Security considerations
10. Operations, rollback, and cleanup (conditional — see below)
11. Next steps and related guides

Not every guide will need the same depth in every section, but the structure should remain stable unless there is a strong reason not to.

**Section 10 is conditional.** An Operations, rollback, and cleanup section is only expected when the guide installs, pins, or directly operates a Pomerium component whose version or lifecycle the reader controls, or otherwise produces long-lived artifacts (credentials, infrastructure, binaries, charts, operators) that the reader must later maintain, rotate, or remove by hand. Guides that only configure a managed control plane (for example, Pomerium Zero route/policy/settings changes) — where the control plane pushes changes automatically and a rollback is just editing the same config back — do not need a dedicated Operations section and should not be penalized for omitting it.

---

## 1. Audience + Outcome

**Weight:** 1x **Question:** Does the guide clearly state who it is for and what successful completion looks like?

### 0 - Missing

- No intended audience
- No clear end state
- Reader must infer what they are building

### 1 - Weak

- Audience is implied but not stated
- Outcome is broad or marketing-like
- Success is described vaguely

### 2 - Good

- Audience is stated explicitly
- Outcome is concrete
- Reader can tell what they will have when done

### 3 - Excellent

- Audience is explicit and bounded
- Outcome is concrete, testable, and scoped
- Reader knows what they will build, what they will not build, and how success will look

---

## 2. Use-Case Fit + Decision Support

**Weight:** 1x **Question:** Does the guide help the reader decide whether this approach is the right one?

### 0 - Missing

- No explanation of when or why to use this pattern

### 1 - Weak

- Guide implies a use case but does not compare fit, tradeoffs, or alternatives

### 2 - Good

- States when this guide is appropriate
- Notes at least one tradeoff or limitation

### 3 - Excellent

- Clearly explains when to use this approach, when not to use it, and major tradeoffs
- Helps the reader avoid choosing the wrong pattern

---

## 3. Prerequisites + Environment Assumptions

**Weight:** 2x **Question:** Does the guide state the tools, permissions, versions, dependencies, and assumptions required before starting?

**Baseline prerequisite (always required):** Every guide must list a **working Pomerium cluster in Pomerium Zero** as a prerequisite and link to the [Quickstart](/docs/get-started/quickstart) so readers without a cluster have a one-click path to get there. Phrase it as something a reviewer can grep for, for example:

> - A working Pomerium Zero cluster. If you don't have one, follow the [Quickstart](/docs/get-started/quickstart) first.

A guide that omits this baseline prereq fails this dimension and cannot score above 1 regardless of the rest of the prerequisites section. Self-hosted / Core-only guides may substitute a link to the appropriate [Deploy](/docs/deploy) page, but still must explicitly state that a running Pomerium cluster is required.

### 0 - Missing

- No prerequisites or assumptions listed
- Baseline Pomerium Zero cluster prereq missing

### 1 - Weak

- Some prerequisites mentioned
- Versions, access levels, accounts, DNS/TLS assumptions, or dependencies are incomplete
- Baseline cluster prereq implied but not explicit, or missing the Quickstart link

### 2 - Good

- Tools, accounts, permissions, and key environment assumptions are listed
- Important dependencies are stated before steps begin
- Baseline cluster prereq is present and links to the Quickstart (or an equivalent deploy page for self-hosted guides)

### 3 - Excellent

- Prerequisites are complete, specific, and ordered
- Includes versions or tested ranges where relevant
- Identifies required permissions, platform assumptions, DNS/TLS expectations, and prerequisite setup the reader must already have
- Baseline cluster prereq is present and links to the Quickstart (or an equivalent deploy page for self-hosted guides)

---

## 4. Architecture + Request Flow Context

**Weight:** 1x **Question:** Does the guide explain where Pomerium fits and how components interact?

### 0 - Missing

- No architecture explanation
- Reader cannot tell how traffic or identity flows through the setup

### 1 - Weak

- Minimal architecture description
- Components are named but relationships are unclear

### 2 - Good

- Provides a simple explanation of request flow and component relationships
- Reader can understand where Pomerium sits in the path

### 3 - Excellent

- Clearly explains request flow, trust boundaries, control points, and component roles
- Uses diagram, sequence, or precise narrative to orient the reader before implementation

---

## 5. Procedural Clarity

**Weight:** 2x **Question:** Can a reader execute the guide without guesswork?

### 0 - Missing

- Steps are missing, unordered, or not actionable

### 1 - Weak

- Steps exist but require inference
- Important values, sequence, or context are omitted
- Commands are incomplete or ambiguous

### 2 - Good

- Steps are ordered and mostly complete
- Commands and examples are usable with limited adjustment
- Reader can follow the guide with moderate confidence

### 3 - Excellent

- Steps are precise, minimal, and fully actionable
- Commands, config, and transitions are clear
- Reader can proceed from one step to the next without guessing what to do or why

---

## 6. Verification + Checkpoints

**Weight:** 2x **Question:** Can the reader tell they are on track before moving forward?

### 0 - Missing

- No validation steps

### 1 - Weak

- Validation appears only once, usually near the end
- Expected outcomes are generic

### 2 - Good

- Validation exists for major milestones
- Includes expected outcomes for key steps

### 3 - Excellent

- Validation exists at each critical checkpoint
- Includes exact expected results, UI states, responses, or logs
- Provides fast correction cues when output differs from expectation

---

## 7. Troubleshooting + Failure Modes

**Weight:** 2x **Question:** Does the guide prepare the reader for common problems?

### 0 - Missing

- No troubleshooting guidance

### 1 - Weak

- Contains generic troubleshooting advice
- Does not tie symptoms to likely causes and fixes

### 2 - Good

- Covers several realistic failure modes
- Maps common symptoms to likely causes and remediation steps

### 3 - Excellent

- Covers the most likely operational and configuration failures
- Includes symptom, probable cause, fix, and where to inspect next
- Meaningfully reduces support burden

---

## 8. Security + Risk Posture

**Weight:** 2x **Question:** Does the guide explain security implications and safe operating boundaries?

### 0 - Missing

- No security guidance

### 1 - Weak

- Mentions security in passing but does not identify risks, trust boundaries, or secret handling requirements

### 2 - Good

- Calls out key security concerns such as access scope, secret handling, exposed endpoints, or permission boundaries

### 3 - Excellent

- Explicitly documents major risks, trust boundaries, secret handling, least-privilege expectations, identity implications, and production caveats
- Helps reader avoid insecure deployment by default

---

## 9. Operations + Lifecycle Management

**Weight:** 1x **Question:** Can the reader maintain, roll back, or remove what they built?

**Applicability note:** This dimension — including upgrade, rollback, cleanup, credential rotation, and maintenance guidance — is only expected when the guide installs, pins, or directly operates a Pomerium component whose version or lifecycle the reader controls, or otherwise produces long-lived artifacts (binaries, charts, operators, credentials, infrastructure) that the reader must later maintain, rotate, or remove by hand. Guides that only configure a managed control plane (for example, Pomerium Zero route/policy/settings changes) — where the control plane pushes changes automatically and "rollback" is just editing the same config back — are **not applicable (N/A)** for this dimension and should not be penalized. Mark the dimension N/A in the review worksheet and exclude it from the total (adjust the denominator accordingly, or treat it as the maximum weighted score of 3).

### 0 - Missing

- No rollback, cleanup, or maintenance guidance where such guidance is applicable

### 1 - Weak

- Mentions one operational concern but omits rollback or cleanup
- No clear lifecycle path after initial setup

### 2 - Good

- Includes rollback or cleanup path
- Notes at least one maintenance concern (or one upgrade concern, where upgrades are applicable)

### 3 - Excellent

- Covers rollback, cleanup, credential rotation impact, and useful observability or logging checks
- Covers upgrades where applicable (see applicability note)
- Sets reader up for real operation, not just one-time setup

---

## 10. Maintainability + Scanability

**Weight:** 1x **Question:** Is the guide easy to scan, extract, update, and keep correct over time?

**Style rules (hard fail):** Prose must not contain em dashes (`—`) or en dashes (`–`), and the guide must not contain emojis (decorative, status, or bullets — ✅ ❌ ⚠️ 🎉 🚀 💡 and similar). Use plain punctuation and Docusaurus admonitions (`:::note`, `:::tip`, `:::warning`, `:::danger`, `:::info`) instead. Code, config, CLI output, and quoted external content are exempt. A guide that violates either rule is not publish-ready regardless of its score on this dimension.

**Acronym rule (hard fail):** Every acronym must be expanded on first use in the guide, formatted as full term followed by the acronym in parentheses (for example, `Pomerium Policy Language (PPL)`). Widely-understood internet-infrastructure acronyms (HTTP, HTTPS, URL, TLS, DNS, IP, JSON, YAML, API, SDK, CLI, UI, OS, SSO, OAuth, OIDC, SAML, JWT, CSV, PDF, CDN, SaaS, CI, CD, SQL, REST, RFC, and similar) are exempt. Product-specific or guide-local acronyms (for example TE, TI, AS, PRM, DCR, CIMD, PPL, IdP, SIEM, MCP) are not exempt. For long guides, reintroduce the full form at least once per major section, or substitute a descriptive noun (for example "the cached upstream token" instead of "the cached TI") so that readers who land mid-page are not forced to scroll back to the definition.

### 0 - Missing

- Hard to scan, inconsistent, outdated-looking, or structurally unstable

### 1 - Weak

- Basic headings exist but formatting, naming, or structure is inconsistent
- Machine extraction and human scanning are both harder than necessary

### 2 - Good

- Clear headings, fenced commands, consistent naming, and readable structure
- Mostly easy to scan and maintain

### 3 - Excellent

- Highly skimmable and internally consistent
- Commands, config, variables, and expected outcomes are clearly structured
- Friendly for both human readers and machine extraction or transformation workflows

---

## Standardization recommendations

To improve consistency across the full guides set, standardize these across all guide authors:

- Reusable prerequisites template
- Reusable architecture/request-flow section
- Reusable verification callout pattern
- Reusable troubleshooting table format
- Reusable security caveats section
- Reusable operations footer with rollback and cleanup (for guides where Operations + Lifecycle Management is applicable — see dimension 9)
- "Last tested with" metadata where third-party integrations are involved
- Clear moved/deprecated labeling in the guides index and page body

---

## Author checklist

Before marking a guide ready for review:

- All required sections are present
- No unresolved placeholders remain
- Commands are runnable as written
- Verification exists for critical steps
- At least 3 troubleshooting entries are included
- At least 2 security caveats are included
- Rollback or cleanup guidance exists (where applicable — see dimension 9)
- The expected end state is explicit
- The guide helps the reader decide whether to use this pattern
- The guide can be skimmed without losing the implementation flow
- No em dashes (`—`) or en dashes (`–`) in prose, and no emojis anywhere in the guide (see dimension 10 style rules)
- Every product-specific or guide-local acronym is expanded on first use (see dimension 10 acronym rule)

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
- No verification steps or success criteria
- No troubleshooting section
- No security caveats for externally exposed services or identity-sensitive flows
- No rollback, cleanup, or teardown path where changes are made
- Commands, config snippets, or manifests contain unresolved placeholders
- Steps depend on unexplained environment assumptions
- Moved or deprecated content is listed as an active guide without clear labeling
- The guide cannot be followed without guessing at key values, sequence, or expected outcomes

## Minimum evidence requirements

Every guide should include, at minimum:

- 1 explicit "what this guide does" statement
- 1 explicit "when to use this guide" statement
- 1 prerequisites section
- 1 architecture or request-flow explanation
- 3 verification checkpoints
- 3 troubleshooting entries
- 2 security caveats
- 1 operations section covering rollback and cleanup
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
| Operations + Lifecycle Management |  | 1 |  |  |
| Maintainability + Scanability |  | 1 |  |  |

**Total Weighted Score:** \_\_\_\_ / 45

**Publish blockers present:** Yes / No **Publish recommendation:** Publish-ready / Needs edits / Major revision

## Scoring guidance

When scoring, optimize for whether a reasonably skilled operator can succeed without opening three extra tabs, guessing at hidden assumptions, or discovering the security caveats by accident.

A guide with polished prose and weak execution detail should not score well.

When recommending troubleshooting improvements, suggest this table format:

| Symptom | Likely Cause | What to Check | Fix |
| ------- | ------------ | ------------- | --- |

---
name: Create Pull Request
description: This skill should be used when the user asks to "create a PR", "open a pull request", "submit a PR", "make a PR", "push and create PR", or mentions creating/opening a pull request for their changes. Handles the full workflow of committing, pushing, and opening a GitHub pull request using `gh` with the repository's PR template.
---

# Create Pull Request

Create a GitHub pull request for the current branch using `gh`, following this repository's conventions and PR template.

## Prerequisites

Before starting, verify the `gh` CLI is available and authenticated.

## Workflow

### 1. Ensure main Is Up to Date

```bash
git fetch origin main
git pull origin main
```

### 2. Assess the Current State

Run the following in parallel to understand what will go into the PR:

- `git status` — check for uncommitted changes
- `git branch --show-current` — check current branch

If there are uncommitted changes, ask the user whether to commit them first.

If on `main` or a branch needs to be created, determine the git username and create a branch:

```bash
git config user.name  # get username for branch prefix
git checkout -b {username}/{short-description}
```

Branch names must follow the format `{git-username}/{branch-slug}` (e.g., `bobby/add-mcp-guide`). The base branch is always `main`.

Then check what will be in the PR:

- `git log main..HEAD --oneline` — see all commits that will be in the PR
- `git diff main...HEAD --stat` — see all files changed vs main

### 3. Run Pre-commit Checks

Before pushing, run the checks that CI will enforce:

```bash
npm run check
```

This runs `format-check` and `cspell`. If formatting fails, run `npm run format` to fix, then re-stage and commit the fixes. If cspell fails on intentional terms, add them to `cspell.json`.

### 4. Push the Branch

```bash
git push -u origin HEAD
```

### 5. Create the Pull Request

Use `gh pr create` with the repository's PR template structure from `.github/ISSUE_TEMPLATE/PULL_REQUEST_TEMPLATE`.

The PR description template has four sections:

- **Summary** — Describe what changed and especially focus on the "why"
- **Related** — Include links to related issues or PRs (especially from the `pomerium/pomerium` repo) or leave as "N/A"
- **AI disclosure** — Disclose how this PR was generated using AI
- **Checklist** — Check off task list items completed.

Analyze all commits in `git log main..HEAD` to write the PR body description.

Create a concise PR title, under 72 characters if possible.

#### Execute

```bash
gh pr create --base main --title "<your generated PR title>" --body "<your generated PR body description>"
```

### 6. Confirm

After creation, display the PR URL to the user. If `gh pr create` fails (e.g., no upstream, auth issue), show the error and suggest remediation.

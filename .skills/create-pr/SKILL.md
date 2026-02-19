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
yarn precommit
```

This runs `format-check` and `cspell`. If formatting fails, run `yarn format` to fix, then re-stage and commit the fixes. If cspell fails on intentional terms, add them to `cspell.json`.

### 4. Push the Branch

```bash
git push -u origin HEAD
```

### 5. Create the Pull Request

Use `gh pr create` with the repository's PR template structure from `.github/ISSUE_TEMPLATE/PULL_REQUEST_TEMPLATE`.

The template has three sections:

- **Summary** — Describe what changed and why
- **Related** — Link related issues or PRs (especially from `pomerium/pomerium`)
- **Checklist** — Task list of items to verify

#### Compose the PR Body

Analyze all commits in `git log main..HEAD` to write the PR body:

- **Title**: Follow commit convention — `docs: short description` (under 72 chars). Use `docs(scope):` when changes are scoped to a specific area.
- **Summary**: 1-3 bullet points describing the changes and their purpose. Focus on "why" not "what".
- **Related**: Include links to related issues/PRs if the user mentions them or if commit messages reference them. Otherwise leave as "N/A".
- **Checklist**: Check off items that apply. For this docs repo, "updated docs" is almost always checked. UPGRADING.md and CHANGELOG.md typically don't apply unless the change is about a version release.

#### Execute

```bash
gh pr create --base main --title "docs: description" --body "$(cat <<'EOF'
## Summary

- Description of changes

## Related

N/A

## Checklist

- [ ] reference any related issues
- [x] updated docs
- [ ] updated UPGRADING.md
- [ ] updated CHANGELOG.md
EOF
)"
```

### 6. Confirm

After creation, display the PR URL to the user. If `gh pr create` fails (e.g., no upstream, auth issue), show the error and suggest remediation.

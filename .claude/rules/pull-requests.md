# Pull requests

**Always-loaded rule.** PRs squash-merge with GitHub set to *"Pull request title and
description"*: **PR title → commit subject, PR body → commit body, verbatim except HTML
comments (`<!-- … -->`) are stripped**. The PR description IS the permanent `git log`
history. Format is owned by `.claude/rules/commits.md`.

## The rule

- **Title** = a `commits.md` subject line (the squash subject comes from the title, never
  the first body line).
- **Body** = the surviving `.github/PULL_REQUEST_TEMPLATE.md` sections (Summary · What
  changed · How it works · Decisions · Refs) — a `commits.md`-shaped body.
- **Reviewer-only content lives in ONE `<!-- … -->` block.** Comments do NOT nest, and a
  literal `-->` inside closes early and leaks review chrome into history — avoid both.
- **Diagrams go in the surviving body** (inside `<details>`), never in the comment, so
  agents reading history get them.
- Repo setting (Settings → PRs → squash default = "Pull request title and description")
  is what makes this work — don't revert it.

Filled example with the exact squashed commit: `.github/PULL_REQUEST_example.md`.

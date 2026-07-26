# Commit message convention

**Always-loaded rule.** House format so any future session can `git log -p` and
reconstruct context without re-reading Notion (gitmoji + Conventional Commits +
mandatory `Decision:`).

## Format

```
<gitmoji> <type>(<scope>): <subject>

<body — what + why, wrapped 72 chars>

Decision: <non-obvious choice: trade-off / alternative rejected / downstream implication>

Refs: <Notion sub-task URL>
```

- **Subject:** ≤50 chars, Capitalised, no trailing period.
- **Scope:** tracked task `F-PLAT-001/T0N`, else area (`schemas`, `tooling`, `infra`, `ci`).
- **`type`:** `feat` · `fix` · `refactor` · `chore` · `docs` · `test` · `build` · `ci`.
- **Gitmoji:** ✨`:sparkles:` feat · 🐛`:bug:` fix · ♻️`:recycle:` refactor · 🔨`:hammer:` tooling ·
  📝`:memo:` docs · 🔧`:wrench:` config · ✅`:white_check_mark:` test · 💄`:lipstick:` UI ·
  🔒`:lock:` security · 🚧`:construction:` WIP.
- **`Decision:` is MANDATORY** whenever a choice is non-obvious (trade-off, rejected
  alternative, downstream implication); omit only on trivial/mechanical commits.

Non-trivial commit needs a model? Read `.claude/agent-patterns/commit-examples.md`.

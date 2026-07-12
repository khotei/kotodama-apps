# core — `@kotodama/core`

The web-only **domain tier**: small, composable domain-aware pieces (today the
`words` domain — the `AccentedWord` structure + the `StatusNote` / `RetryLink`
molecules) that `use-cases` composes into feature assemblies. Sits
`store ◄ core ◄ use-cases` — the home the backend mirror reserves for
cross-query domain structure (re-scaffolded per `.claude/rules/naming.md`).

- **May import:** `@kotodama/ui`, `@kotodama/store` (domain models), `react`.
  **Never** `@kotodama/use-cases`, `apps/*`, `@kotodama/repositories`,
  `@kotodama/config`, or `next` — Biome bans them.
- **Imported by:** `use-cases` (and `apps/web`, which may reach any lower tier).
- **Domain per folder** (`src/words/`), mirroring the backend's per-domain
  `core/*`. A second domain gets its own `src/<domain>/`.

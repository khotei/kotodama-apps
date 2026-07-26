# Naming conventions

**Always-loaded rule.**

- **Packages:** `@kotodama/<folder>`, nested folders dash-flatten. `core`/`platform` are single
  packages with subpath-exported layer folders; `ui` = `@kotodama/ui`; presets = `@kotodama/presets`
  (`infra/presets`); apps drop the plural (`apps/web` → `@kotodama/web`).
- **All source files are `kebab-case` whatever they export** (`word-card.tsx` → `WordCard`), plus a
  dotted **role suffix** `<name>.<role>.ts` — the index into a tier:

| Suffix | Role | Layer |
|---|---|---|
| `.repo.ts` | bare `fetchX` functions (`fetchWord`) | `core/repositories` |
| `.entity.ts` | contract types as fetched (`WordEntity`) | `core/repositories` |
| `.model.ts` | derived model + derivation (`WordStateModel`, `narrowWordState`) | `core/store` |
| `.factory.ts` | test-only faker `make*` builders | `core/factories` |
| `.loader.ts` | `server-only` `React.cache` read (`getWordState`) | `apps/web/src/server` |
| `.actions.ts` | `'use server'` mutation file | `apps/web/src/server` |
| `.view.ts` | React render shape | `ui` (`src/views/`) |
| `.client.tsx` | a `'use client'` island | `ui` · `apps/web` |
| `.stories.tsx` | Storybook story | `ui` |
| `*.gen.ts` | GENERATED, never hand-edited | `platform/api-client`, `ui` |

  Server is the default → UNmarked; only the client island is marked `.client.tsx` (not to be
  confused with api-client's transport `client.ts`). Component files take **no** suffix. Tests
  mirror the source name (suffix included) under the workspace's `test/<domain>/`.
- **Symbols:** props type `<Component>Props` (a `type`, never `interface`). fetchX verb-first taking
  `client` first (`fetchWord`); loaders `get<Domain>`; actions verb-first; model `<Domain>Model`.
  Entity types carry `*Entity`; value/enum types (`Language`, `JobStatus`) stay plain; **never suffix
  a type `<X>Schema`.**

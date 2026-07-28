---
paths:
  - "**/*.ts"
  - "**/*.tsx"
  - "**/package.json"
---

# Naming conventions

- **Packages:** `@kotodama/<folder>`, nested folders dash-flatten. `core`/`platform` are single
  packages with subpath-exported layer folders; `ui` = `@kotodama/ui`; presets = `@kotodama/presets`
  (`infra/presets`); apps drop the plural (`apps/web` → `@kotodama/web`).
- **All source files are `kebab-case` whatever they export** (`status-badge.tsx` → `StatusBadge`), plus a
  dotted **role suffix** `<name>.<role>.ts` — the index into a tier:

| Suffix | Role | Layer |
|---|---|---|
| `.repo.ts` | bare `fetchX` functions (`fetchWord`) | `core/repositories` |
| `.entity.ts` | contract types as fetched (`WordEntity`) | `core/repositories` |
| `.factory.ts` | test-only faker `make*` builders | `core/factories` |
| `.model.ts` | domain model derived off the wire (`WordListItem`) | `core/words` |
| `.loaders.ts` | `load*` reads (`loadLibraryAggregation`) | `apps/web` (`src/<domain>/server` · route `server/`) |
| `.requests.ts` | `'use server'` `request*` commands — the Server Actions | `apps/web/src/<domain>/server` |
| `.view.ts` | React render shape | `ui` (`src/views/`) |
| `.client.tsx` | a `'use client'` island | `ui` · `apps/web` |
| `.stories.tsx` | Storybook story | `ui` |
| `*.gen.ts` | GENERATED, never hand-edited | `platform/api-client`, `ui` |

  Server is the default → UNmarked; only the client island is marked `.client.tsx` (not to be
  confused with api-client's transport `client.ts`). Component files take **no** suffix; in
  `core/words` the base name is the domain noun (`word-state.model.ts`, mirroring the backend's
  `core/words/src/*` dotted roles). In `apps/web/src/<domain>/` the base name LEADS with the
  domain folder's name (`words-search.mapper.ts`, `words-hrefs.ts`) so a tab/grep hit names its
  module. Tests mirror the source name (suffix included) under
  the workspace's `test/` (per-domain subfolders where the layer has them).
- **Symbols:** props type `<Component>Props` (a `type`, never `interface`). The data tiers own
  reserved verb prefixes — `fetch*` wire call taking `client` first (`fetchWord`), `load*` read
  (`loadLibraryAggregation`), `request*` `'use server'` command (`requestWordBuild`); any other
  verb is not a data function. Domain types are bare
  nouns (`WordState`, `LibraryAggregation`) — only the boundary tiers carry a postfix: wire `*Entity`, render
  `*View`. Value/enum types (`Language`, `JobStatus`) stay plain; **never suffix a type `<X>Schema`.**

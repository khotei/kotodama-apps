# Naming conventions

**Always-loaded rule.**

## Packages / tiers

`@kotodama/<folder>`, nested folders flatten with a dash. The top-level **tiers** are single
packages named for the tier (`repositories`, `store`); the
**leaf packages** live under `packages/` (`packages/api-client` → `@kotodama/platform/api-client`,
`packages/ui` → `@kotodama/ui`); apps drop the plural (`apps/web` → `@kotodama/web`). A **domain**
is a `src/<domain>/` folder inside a tier (`store/src/words/`); split a tier into per-domain packages
only when a second domain demonstrates the need.

## Files

**All source files are `kebab-case`, whatever they export** (`word-card.tsx` exports `WordCard`).
Files carry a dotted **role suffix** — `<name>.<role>.ts` — the fast index into a tier:

| Suffix / shape | Role | Tier |
|---|---|---|
| `.repo.ts` | bare `fetchX` access functions (`fetchWord`) | `repositories` |
| `.entity.ts` | contract types as they arrive from the server (`WordEntity`, `WordStateEntity`) | `repositories` |
| `.model.ts` | a derived domain model + its derivation (`WordStateModel`, `narrowWordState`) | `store` |
| `.loader.ts` | a `server-only` `React.cache` read (`getWordState`) | `apps/web/src/server` |
| `.actions.ts` | a `'use server'` Server Action file (mutations + `revalidatePath`) | `apps/web/src/server` |
| `.view.ts` | a React presentation shape, assembled purely for rendering | `packages/ui` (`src/views/`) |
| `.client.tsx` | a `'use client'` island (poll loop, optimistic UI, form state) | `packages/ui` (client-island organisms) · `apps/web` (Next-wired islands) |
| `.stories.tsx` | a Storybook story | `packages/ui` |
| `*.gen.ts` | GENERATED, never hand-edited (`schema.gen.ts`, `tokens.gen.ts`) | `api-client`, `ui` |

The role suffix tracks the layer a shape is derived at: **`entity`** (`repositories`, as fetched) →
**`model`** (`store`, for the app) → **`view`** (`packages/ui`, for the render). Server is the default,
so it is UNmarked (`.loader.ts` earns its suffix by role, not by being server); the rare **client**
file is the one marked — `.client.tsx`, over its `'use client'` directive, surfacing the browser
bundle in the file tree. (Don't confuse it with `api-client`'s transport `client.ts` — different
tier, different extension.) Cross-query, cross-feature domain structures + molecules take **no
suffix** and live in **`packages/ui`** (`components/{molecules,organisms}/`), the web design system
holding all presentation (see `frontend-layering.md`).

A component file is a bare kebab name exporting a `PascalCase` component. Render-layer entrypoints
keep conventional names: `server.ts`, `router.tsx`, `entry-server.tsx`, `entry-client.tsx`,
`routes/*`, `features/<name>/`. Tests mirror the source they cover, suffix included
(`word.store.test.ts`), in the workspace's `test/<domain>/` folder.

## Symbols

- **Components** are `PascalCase` (`WordCard`, `UiProvider`); prop type `<Component>Props` (a `type`
  alias, never an `interface` — see `typescript.md`).
- **fetchX** functions are verb-first (`fetchWord`, `searchWords`), taking the `client` first.
- **Loaders** are `get<Domain>` (`getWordState`) — a `React.cache`-wrapped server read. **Actions**
  are verb-first (`refreshWordPage`). A **model** is a `<Domain>Model` type (`WordStateModel`) with a
  verb-first derivation (`narrowWordState`).
- **Entity types** carry an `*Entity` suffix (`WordEntity`, `WordStateEntity`) and are re-exported
  from `repositories` (`.entity.ts`). Shared **value/enum types** (`Language`, `JobStatus`) stay
  plain — they cross layers as primitives. Never suffix a type `<X>Schema`.

## Scripts

Every per-package `tsc`/`vitest` script is prefixed `bun --bun`; Storybook uses `bunx --bun
storybook …` (a bare `bun --bun storybook` collides with the script name). Playwright is the lone
inversion — `apps/e2e` runs `bunx playwright test`, **never `--bun`** (oven-sh/bun#8222). See
`tooling.md`.

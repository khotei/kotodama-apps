# Naming conventions

**Always-loaded rule.**

## Packages / tiers

`@kotodama/<folder>`, nested folders flatten with a dash. The top-level **tiers** are single
packages named for the tier (`repositories`, `store`, `use-cases`); the
**leaf packages** live under `packages/` (`packages/api-client` → `@kotodama/api-client`,
`packages/ui` → `@kotodama/ui`); apps drop the plural (`apps/web` → `@kotodama/web`). A **domain**
is a `src/<domain>/` folder inside a tier (`store/src/words/`); split a tier into per-domain packages
only when a second domain demonstrates the need.

## Files

**All source files are `kebab-case`, whatever they export** (`word-card.tsx` exports `WordCard`).
Files carry a dotted **role suffix** — `<name>.<role>.ts` — the fast index into a tier:

| Suffix / shape | Role | Tier |
|---|---|---|
| `.client.ts` | the openapi-fetch client + middleware | `packages/api-client` |
| `.repo.ts` | bare `fetchX` access functions (`fetchWord`) | `repositories` |
| `.store.ts` | `queryOptions`/`mutationOptions` factories | `store` |
| `.entity.ts` | contract types as they arrive from the server (`WordEntity`, `WordStateEntity`) | `repositories` |
| `.model.ts` | a derived domain model + its derivation (`WordStateModel`, `narrowWordState`) | `store` |
| `.view.ts` | a React presentation shape, assembled purely for rendering | `apps/web` features |
| `use-<name>.ts` | a React feature hook (`useWord`) | `use-cases` |
| `.stories.tsx` | a Storybook story | `packages/ui` |
| `*.gen.ts` | GENERATED, never hand-edited (`schema.gen.ts`, `tokens.gen.ts`) | `api-client`, `ui` |

The role suffix tracks the layer a shape is derived at: **`entity`** (`repositories`, as fetched) →
**`model`** (`store`, for the app) → **`view`** (`apps/web`, for the render). Pure cross-query
domain structures take **no suffix** and belong to a reserved `core` tier — re-scaffold it via the
`/new-package core` command when the first one appears.

A component file is a bare kebab name exporting a `PascalCase` component. Render-layer entrypoints
keep conventional names: `server.ts`, `router.tsx`, `entry-server.tsx`, `entry-client.tsx`,
`routes/*`, `features/<name>/`. Tests mirror the source they cover, suffix included
(`word.store.test.ts`), in the workspace's `test/<domain>/` folder.

## Symbols

- **Components** are `PascalCase` (`WordCard`, `UiProvider`); prop type `<Component>Props` (a `type`
  alias, never an `interface` — see `typescript.md`).
- **fetchX** functions are verb-first (`fetchWord`, `searchWords`), taking the `client` first.
- **Store factories** are `<domain>QueryOptions` (`wordQueryOptions`) — a factory, never a hook.
- **Hooks** are `use<X>` (`useWord`, `useApiClient`). A **model** is a `<Domain>Model` type
  (`WordStateModel`) with a verb-first derivation (`narrowWordState`).
- **Entity types** carry an `*Entity` suffix (`WordEntity`, `WordStateEntity`) and are re-exported
  from `repositories` (`.entity.ts`). Shared **value/enum types** (`Language`, `JobStatus`) stay
  plain — they cross layers as primitives. Never suffix a type `<X>Schema`.

## Scripts

Every per-package `tsc`/`vitest` script is prefixed `bun --bun`; Storybook uses `bunx --bun
storybook …` (a bare `bun --bun storybook` collides with the script name). Playwright is the lone
inversion — `apps/e2e` runs `bunx playwright test`, **never `--bun`** (oven-sh/bun#8222). See
`tooling.md`.

# Naming conventions

**Always-loaded rule.**

## Packages / tiers

`@kotodama/<folder>`, nested folders flatten with a dash. The top-level **tiers** are single
packages named for the tier (`core` → `@kotodama/core`, `repositories`, `store`, `use-cases`); the
**leaf packages** live under `packages/` (`packages/api-client` → `@kotodama/api-client`,
`packages/ui` → `@kotodama/ui`); apps drop the plural (`apps/web` → `@kotodama/web`). A **domain**
is a `src/<domain>/` folder inside a tier (`core/src/words/`); split a tier into per-domain packages
only when a second domain demonstrates the need.

## Files

**All source files are `kebab-case`, whatever they export** (`word-card.tsx` exports `WordCard`).
Files carry a dotted **role suffix** — `<name>.<role>.ts` — the fast index into a tier:

| Suffix / shape | Role | Tier |
|---|---|---|
| `.client.ts` | the openapi-fetch client + middleware | `packages/api-client` |
| `.repo.ts` | bare `fetchX` access functions (`fetchWord`) | `repositories` |
| `.store.ts` | `queryOptions`/`mutationOptions` factories | `store` |
| `.view.ts` / `.model.ts` | a pure view-model (`narrowWordState`) | `core` |
| `use-<name>.ts` | a React feature hook (`useWord`) | `use-cases` |
| `.stories.tsx` | a Storybook story | `packages/ui` |
| `*.gen.ts` | GENERATED, never hand-edited (`schema.gen.ts`, `tokens.gen.ts`) | `api-client`, `ui` |

A component file is a bare kebab name exporting a `PascalCase` component. Render-layer entrypoints
keep conventional names: `server.ts`, `router.tsx`, `entry-server.tsx`, `entry-client.tsx`,
`routes/*`, `features/<name>/`. Tests mirror the source they cover, suffix included
(`word.store.test.ts`), in the workspace's `test/<domain>/` folder.

## Symbols

- **Components** are `PascalCase` (`WordCard`, `UiProvider`); prop interface `<Component>Props`.
- **fetchX** functions are verb-first (`fetchWord`, `searchWords`), taking the `client` first.
- **Store factories** are `<domain>QueryOptions` (`wordQueryOptions`) — a factory, never a hook.
- **Hooks** are `use<X>` (`useWord`, `useApiClient`). **View-models** are verb-first pure functions
  (`narrowWordState`).
- **Generated contract types** are re-exported under their contract name (`Word`, `WordStateView`,
  `Language`) from `api-client`; never suffix a type `<X>Schema`.

## Scripts

Every per-package `tsc`/`vitest` script is prefixed `bun --bun`; Storybook uses `bunx --bun
storybook …` (a bare `bun --bun storybook` collides with the script name). See `tooling.md`.

# Naming conventions

**Always-loaded rule.**

## Packages

`@kotodama/<folder>`; nested folders flatten with a dash. Shared packages carry an `fe-` prefix
(`packages/fe-core` → `@kotodama/fe-core`); apps drop the plural (`apps/web` → `@kotodama/web`,
a future `apps/mobile` → `@kotodama/mobile`). The `fe-` marks the platform-agnostic-or-web split
from a hypothetical future native `ui` package.

## Files

**All source files are `kebab-case`, whatever they export** (`word-card.tsx` exports `WordCard`).
Files carry a dotted **role suffix** — `<name>.<role>.ts` — the fast index into a layer:

| Suffix | Role | Layer |
|---|---|---|
| `.client.ts` | the openapi-fetch client + middleware | `fe-api-client` |
| `.repo.ts` | bare `fetchX` access functions (`fetchWord`) | `fe-api-client/src/repositories/` |
| `.store.ts` | `queryOptions`/`mutationOptions` factories | `fe-store` |
| `.view.ts` / `.model.ts` | a pure view-model (`narrowWordState`) | `fe-core` |
| `.stories.tsx` | a Storybook story | `fe-ui` |
| `*.gen.ts` | GENERATED, never hand-edited (`schema.gen.ts`, `tokens.gen.ts`) | `fe-api-client`, `fe-tokens` |

A component file is a bare kebab name exporting a `PascalCase` component (`word-card.tsx`). Render-
layer entrypoints keep their conventional names: `server.ts`, `router.tsx`, `entry-server.tsx`,
`entry-client.tsx`, `routes/*`. A `features/<name>/` folder groups one feature. Tests mirror the
source they cover, suffix included (`word.store.test.ts`), in the workspace's `test/` folder.

## Symbols

- **Components** are `PascalCase` (`WordCard`, `UiProvider`); their prop interface is
  `<Component>Props` (`WordCardProps`).
- **fetchX** functions are verb-first (`fetchWord`, `searchWords`) — the `fetch`/`search` verb marks
  the transport-access layer; they take the `client` as their first arg.
- **Store factories** are `<domain>QueryOptions` / `<domain>MutationOptions` (`wordQueryOptions`) —
  a factory returning a plain options object, never a hook.
- **Hooks** (if any) are `use<X>`. **View-models** are verb-first pure functions (`narrowWordState`).
- **Generated types** are re-exported under their contract name (`Word`, `WordStateView`,
  `Language`) from `fe-api-client`; never suffix a type `<X>Schema`.

## Scripts

Every per-package `tsc`/`vitest` script is prefixed `bun --bun`; package names in scripts use the
`@kotodama/<name>` form. See `@.claude/rules/tooling.md`.

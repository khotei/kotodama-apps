# Naming conventions

**Always-loaded rule.**

## Packages / workspaces

`@kotodama/<folder>`, nested folders flatten with a dash. The agnostic **spine** and **base** are each
ONE package whose layers are subpath-exported folders: `core` → `@kotodama/core/{repositories,store}`,
`platform` → `@kotodama/platform/{api-client,config}`. The web design system is the `ui` leaf
(`@kotodama/ui`); shared config presets are `@kotodama/presets` at `infra/presets`; apps drop the plural
(`apps/web` → `@kotodama/web`). A **domain** is a `src/<domain>/` folder inside a layer — e.g. the
`words` domain under `core/store`; split into per-domain packages only when a second domain demonstrates the need.

## Files

**All source files are `kebab-case`, whatever they export** (`word-card.tsx` exports `WordCard`).
Files carry a dotted **role suffix** — `<name>.<role>.ts` — the fast index into a tier:

| Suffix / shape | Role | Layer |
|---|---|---|
| `.repo.ts` | bare `fetchX` access functions (`fetchWord`) | `core/repositories` |
| `.entity.ts` | contract types as they arrive from the server (`WordEntity`, `WordStateEntity`) | `core/repositories` |
| `.model.ts` | a derived domain model + its derivation (`WordStateModel`, `narrowWordState`) | `core/store` |
| `.factory.ts` | test-only faker `make*` builders of wire values (`makeWord`) | `core/factories` |
| `.loader.ts` | a `server-only` `React.cache` read (`getWordState`) | `apps/web/src/server` |
| `.actions.ts` | a `'use server'` Server Action file (mutations + `revalidatePath`) | `apps/web/src/server` |
| `.view.ts` | a React presentation shape, assembled purely for rendering | `ui` (`src/views/`) |
| `.client.tsx` | a `'use client'` island (poll loop, optimistic UI, form state) | `ui` (client-island organisms) · `apps/web` (Next-wired islands) |
| `.stories.tsx` | a Storybook story | `ui` |
| `*.gen.ts` | GENERATED, never hand-edited (`schema.gen.ts`, `tokens.gen.ts`) | `platform/api-client`, `ui` |

The role suffix tracks the layer a shape is derived at: **`entity`** (`core/repositories`, as fetched) →
**`model`** (`core/store`, for the app) → **`view`** (`ui`, for the render). Server is the default,
so it is UNmarked (`.loader.ts` earns its suffix by role, not by being server); the rare **client**
file is the one marked — `.client.tsx`, over its `'use client'` directive, surfacing the browser
bundle in the file tree. (Don't confuse it with `api-client`'s transport `client.ts` — different
layer, different extension.) Component structures take **no suffix** and live in **`ui`** — the
domain-free kit under `components/{atoms,molecules,organisms}/`, the entity-bound compositions under
`components/{core,features}/` (see `frontend-layering.md`).

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

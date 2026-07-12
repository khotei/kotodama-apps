# Frontend layering (the rule the scaffolding protects)

**Always-loaded rule.** The FE mirrors the backend's top-level tiers. Getting a new file into the
right tier is the whole point of this doc.

```
Packages (leaves — import nothing internal):
  packages/config       env: repo-root .env loader + optional Zod schema over process.env  [agnostic · base leaf, importable by ALL]
  packages/api-client   transport: openapi-fetch client + generated schema.gen   [agnostic]
  packages/ui           web design system: Tailwind v4 + shadcn primitives + @theme tokens  [web-only]

Top-level tiers (one-way linear chain, mirrors the backend):
  api-client ◄ repositories ◄ store ◄ core ◄ use-cases ◄ apps/web
```

- **Platform-agnostic spine** (reusable by any future `apps/*` — desktop/native): `api-client`,
  `repositories`, `store`. **Web-only:** `ui`, `core`, `use-cases`, `apps/web`. The web↔native line
  falls **below `core`**: `core`/`use-cases` render (DOM), so they do NOT port; a native app reuses
  only the agnostic spine and builds its own domain + feature tiers on top.
- **`core` is the web-only DOMAIN tier:** small, composable domain-aware pieces (per-domain folder
  `core/src/<domain>/`, mirroring the backend's `core/*`) over `@kotodama/ui` + `@kotodama/store`
  models, which `use-cases` composes into feature assemblies. May import `ui`/`store`; never
  `use-cases`/`apps`/`repositories`/`config`/`next`.
- **`use-cases` is the web-only FEATURE tier:** domain-aware assemblies (RSC views + `'use client'`
  islands) composed from `ui` primitives + `store` models. **Next-free + prop-driven** — it sits below
  the app, so it can't import the app's loaders/actions (upward); the app injects everything
  runtime-specific as **serializable** props (a resolved `model`, a Server Action reference, a URL
  string). A feature that would need heavier, non-serializable wiring lives in `apps/web` directly
  (the sanctioned bypass), not here.
- **`api-client` is a leaf package importable by every tier** (for the client + raw `operations` —
  "everything → packages"). **`ui` is a leaf too, but web-only:** only `use-cases` + `apps/web` may
  import it; the agnostic spine must not (it is DOM-bound and would break portability).
- **`config` is the env base leaf — the single home for env keys, importable by ALL** (mirrors the
  backend `@kotodama/config`). Its library imports nothing internal; the `api-client` leaf's
  `gen-api.ts` build script is Biome-exempted to reuse its `loadRootEnv`. The `api-client` *library*
  still reads no env — it takes `baseUrl` injected.
- **Tier direction:** `repositories` = raw fetchX + the contract entity types (`*Entity`); `store` =
  the domain model derivation (`narrowWordState` + the `*Model` types); `use-cases` = web-only feature
  assemblies (views + islands) over `ui` + `store`; `apps/web` = the Next shell (routing + the server
  data layer + wiring). Never import upward, and the agnostic spine never imports `ui`/`use-cases`/`apps`.
- **`apps/web` splits in two internally:** `src/server/**` is the RSC data layer — the ONE place in
  the app allowed to import `@kotodama/repositories` (it composes fetchX + `store` models + `config`
  into `*.loader.ts` reads and `*.actions.ts` mutations); `app/**` is the routing shell that composes
  `use-cases` components, injecting the loaders' data + the actions. `src/server` must not import `ui`
  or `use-cases` — presentation lives in `use-cases`, data in `src/server`.

## Two enforcement planes

1. **DOM-free `tsconfig.base.json` is PRIMARY.** `api-client`, `repositories`, `store` compile with
   `lib: ["esnext"]` and no `"dom"`, so any `document`/`window`/react-dom leak — or a dependency that
   pulls DOM types (e.g. a Radix primitive or `next`) — is a **`tsc` error before Biome runs**. `ui`,
   `use-cases` + `apps/web` opt into `lib:["dom",…]` + `jsx` + `@types/react`. A correct-by-construction
   guarantee an import denylist can't match.
2. **Biome `noRestrictedImports` = tier-direction bans** (`biome.base.json`, per-glob overrides): the
   leaf rules (`api-client`/`ui` import nothing internal) + the one-way tier chain + the
   agnostic-spine-never-imports-`ui`/`use-cases`/`apps` rule + the `use-cases` Next-free ban (no
   `next`/`repositories`/`config`) + the `apps/web` repositories ban (waived only for
   `apps/web/src/server/**`). Run `/scan-deps`.

**The invariant both protect: the web↔native boundary.** The agnostic spine is what a future
`apps/mobile` reuses unchanged; `ui`/`apps/web` are DOM-bound and do not port — only `ui`'s
semantic-token *contract* does. A spine tier that reaches for the DOM, `ui`, or a web-only dep must
fail.

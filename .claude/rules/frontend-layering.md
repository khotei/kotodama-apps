# Frontend layering (the rule the scaffolding protects)

**Always-loaded rule.** The FE mirrors the backend's top-level workspaces. Getting a new file into
the right layer is the whole point of this doc.

```
Agnostic base + spine (import nothing web-bound):
  platform  @kotodama/platform   two leaves as folders, subpath-exported; imports nothing internal:
    ./config      env: repo-root .env loader + Zod schema over process.env   [base leaf, importable by ALL]
    ./api-client  transport: openapi-fetch client + generated schema.gen
  core      @kotodama/core       two domain layers as folders, subpath-exported:
    ./repositories  raw fetchX + the contract *Entity types
    ./store         the domain-model derivation (narrowWordState + *Model types)

Web-only leaf:
  ui        @kotodama/ui         the ENTIRE web design system + all presentation

One-way chain (mirrors the backend):
  platform/api-client ◄ core/repositories ◄ core/store ◄ apps/web
  (platform/config a base leaf importable by ALL; ui the web-only leaf apps/web wires)
```

- **Aggregate packages, subpath entry points.** `core` and `platform` are each ONE package whose
  layers are folders exported as subpaths (`@kotodama/core/{repositories,store}`,
  `@kotodama/platform/{api-client,config}`) — NOT flat barrels. Each subpath is a separate entry
  point, so tree-shaking stays independent AND the layer direction is Biome-lintable on the
  `@kotodama/core/<layer>` specifier. **A new domain is a `src/<domain>/` folder under each layer,
  never a new package**; split into packages only when a second app demonstrates the need.
- **Platform-agnostic spine** (reusable by any future `apps/*` — desktop/native): `platform`, `core`.
  **Web-only:** `ui`, `apps/web`. The web↔native line falls **below `core`**: `ui` renders (DOM), so
  it does NOT port; a native app reuses only the agnostic spine and builds its own presentation on top.
- **`ui` holds ALL presentation**, organised by Atomic Design under
  `components/{atoms,molecules,organisms,templates,pages}/`, plus `views/` (ui-owned view types like
  `word.view.ts`), `fixtures/` (design-stage mocks, exported via the `@kotodama/ui/fixtures` subpath),
  and `lib/` (`cn`, `languageName`). Every component folder = component + story + `index.ts` barrel; the
  whole site assembles in ui's Storybook on mock data as the design source of truth.
- **`ui ⊥ core`:** ui is independent of the domain MODEL — it takes data via props. It MAY read the
  generated WIRE CONTRACT **type-only** from `@kotodama/platform/api-client` (e.g. `word.view.ts` derives
  its content type off `operations['words.buildWord']`); it must NOT import `core` (either domain layer),
  `@kotodama/platform/config`, or the app. It may self-compose via `@kotodama/ui` (a benign barrel self-import).
- **`platform/api-client` is a leaf importable by every layer** (for the client + raw `operations` —
  "everything → platform"). **`ui` is a leaf too, but web-only:** only `apps/web` may import it (plus its
  own Storybook); the agnostic spine must not (it is DOM-bound and would break portability).
- **`platform/config` is the env base leaf — the single home for env keys, importable by ALL** (mirrors
  the backend `@kotodama/platform/config`). Its library imports nothing internal; `api-client`'s
  `gen-api.ts` build script is Biome-exempted to reuse its `loadRootEnv`. The `api-client` *library*
  still reads no env — it takes `baseUrl` injected.
- **Layer direction:** `core/repositories` = raw fetchX + the contract entity types (`*Entity`);
  `core/store` = the domain model derivation (`narrowWordState` + the `*Model` types); `apps/web` = the
  Next shell (routing + the server data layer + wiring that composes `ui`). Never import upward
  (`store` may import `repositories`, never the reverse), and the agnostic spine never imports `ui`/`apps`.
- **`apps/web` splits in two internally:** `src/server/**` is the RSC data layer — the ONE place in
  the app allowed to import `@kotodama/core/repositories` (it composes fetchX + `@kotodama/core/store`
  models + `@kotodama/platform/config` into `*.loader.ts` reads and `*.actions.ts` mutations); `app/**`
  is the routing shell — plus the client-wiring chrome/islands under `src/chrome/**` + `src/words/**` —
  that composes `@kotodama/ui` components, injecting the loaders' data + the actions. `src/server` must
  not import `ui` — presentation lives in `ui`, data in `src/server`.

## Two enforcement planes

1. **DOM-free `tsconfig.base.json` is PRIMARY.** `platform` + `core` extend the DOM-free base and
   compile with `lib: ["esnext"]` and no `"dom"`, so any `document`/`window`/react-dom leak — or a
   dependency that pulls DOM types (e.g. a Radix primitive or `next`) — is a **`tsc` error before Biome
   runs**. `ui` + `apps/web` extend the DOM base (`lib:["dom",…]` + `jsx` + `@types/react`). A
   correct-by-construction guarantee an import denylist can't match.
2. **Biome `noRestrictedImports` = layer-direction bans** (`biome.base.json`, per-glob overrides): the
   leaf rules (`platform` imports nothing internal; `ui` bans `core`/`@kotodama/platform/config`/`web`
   but NOT `platform/api-client` — its wire contract is allowed type-only) + the one-way chain on the
   `@kotodama/core/<layer>` specifier + the agnostic-spine-never-imports-`ui`/`apps` rule + the
   `apps/web` `core/repositories` ban (waived only for `apps/web/src/server/**`, which also bans
   `@kotodama/ui`/`@kotodama/web`). Run `/scan-deps`.

**The invariant both protect: the web↔native boundary.** The agnostic spine is what a future
`apps/mobile` reuses unchanged; `ui`/`apps/web` are DOM-bound and do not port — only `ui`'s
semantic-token *contract* does. A spine layer that reaches for the DOM, `ui`, or a web-only dep must
fail.

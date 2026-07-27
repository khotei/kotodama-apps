---
paths:
  - "apps/**"
  - "core/**"
  - "platform/**"
  - "ui/**"
  - "infra/**"
---

# Frontend layering (the rule the scaffolding protects)

The FE mirrors the backend's top-level workspaces. Getting a new file into
the right layer is the whole point of this doc.

```
Agnostic base + spine (import nothing web-bound):
  platform  @kotodama/platform   base leaves as folders, subpath-exported; imports nothing internal:
    ./config      env: repo-root .env loader + Zod schema over process.env   [base leaf, importable by ALL]
    ./api-client  transport: openapi-fetch client + generated schema.gen
    ./dates       locale-parameterized date formatting over built-in Intl (policy-free)
    ./languages   language display names over Intl.DisplayNames (generic over the code string)
  core      @kotodama/core       two domain layers as folders, subpath-exported:
    ./repositories  raw fetchX + the contract *Entity types
    ./words         the words domain module (narrowWordState + the bare-noun domain types)

Web-only leaf:
  ui        @kotodama/ui         the ENTIRE web design system + all presentation

One-way chain (mirrors the backend):
  platform/api-client ◄ core/repositories ◄ core/words ◄ apps/web
  (platform/config a base leaf importable by ALL; ui the web-only leaf apps/web wires)
```

- **Aggregate packages, subpath entry points.** `core` and `platform` are each ONE package whose
  layers are folders exported as subpaths (`@kotodama/core/{repositories,words}`,
  `@kotodama/platform/{api-client,config}`) — NOT flat barrels. Each subpath is a separate entry
  point, so tree-shaking stays independent AND the layer direction is Biome-lintable on the
  `@kotodama/core/<layer>` specifier. **A new domain is a `src/<domain>/` folder under each layer,
  never a new package**; split into packages only when a second app demonstrates the need.
- **Platform-agnostic spine** (reusable by any future `apps/*` — desktop/native): `platform`, `core`.
  **Web-only:** `ui`, `apps/web`. The web↔native line falls **below `core`**: `ui` renders (DOM), so
  it does NOT port; a native app reuses only the agnostic spine and builds its own presentation on top.
- **`ui` holds ALL presentation.** Its internal tiers (the domain-free kit vs the Kotodama-domain
  layer, `views/`, `fixtures/`, `lib/`) are owned by `frontend-components.md` (the design policy) +
  `ui/CLAUDE.md` (the layout & mechanics) — not restated here.
- **`ui ⊥ core`:** ui is independent of the domain MODEL — it takes data via props. It MAY read the
  generated WIRE CONTRACT **type-only** from `@kotodama/platform/api-client`
  (a `views/*.view.ts` type may derive off `operations`); it must NOT import `core` (either domain layer),
  `@kotodama/platform/config`, or the app. Self-referencing `@kotodama/ui` doesn't break the leaf rule, but
  components self-compose via RELATIVE paths — the barrel is the external surface (a self-barrel import
  risks an ESM cycle); only stories/consumers use it. `ui/CLAUDE.md` is the authority on the mechanics.
- **`platform/api-client` is a leaf importable by every layer** (for the client + raw `operations` —
  "everything → platform"). **`ui` is a leaf too, but web-only:** only `apps/web` may import it (plus its
  own Storybook); the agnostic spine must not (it is DOM-bound and would break portability).
- **`platform/config` is the env base leaf — the single home for env keys, importable by ALL** (mirrors
  the backend `@kotodama/platform/config`). Its library imports nothing internal; `api-client`'s
  `gen-api.ts` build script is Biome-exempted to reuse its `loadRootEnv`. The `api-client` *library*
  still reads no env — it takes `baseUrl` injected.
- **Layer direction:** `core/repositories` = raw fetchX + the contract entity types (`*Entity`);
  `core/words` = the words domain module (`narrowWordState` + bare-noun domain types); `apps/web` = the
  Next shell (routing + the server data layer + wiring that composes `ui`). Never import upward
  (`words` may import `repositories`, never the reverse), and the agnostic spine never imports `ui`/`apps`.
- **`core/use-cases` is a reserved slot, not a license.** The backend's `use-cases` hold COMMAND
  orchestration only — its api handler composes READS at the edge (`searchWords` straight from
  repositories). Mirror that: reads compose in `apps/web/src/server` loaders; create
  `core/use-cases` only with the first multi-step mutation flow, never for a read aggregate.
- **`apps/web` splits in two internally:** `src/server/**` is the RSC data layer — the ONE place in
  the app allowed to import `@kotodama/core/repositories` (it composes fetchX + `@kotodama/core/words`
  domain types + `@kotodama/platform/config` into `*.loader.ts` reads and `*.actions.ts` mutations); `app/**`
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
   `@kotodama/ui`/`@kotodama/web`). `bun run check` runs both planes.

**The invariant both protect: the web↔native boundary.** The agnostic spine is what a future
`apps/mobile` reuses unchanged; `ui`/`apps/web` are DOM-bound and do not port — only `ui`'s
semantic-token *contract* does. A spine layer that reaches for the DOM, `ui`, or a web-only dep must
fail.

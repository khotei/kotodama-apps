# Frontend layering (the rule the scaffolding protects)

**Always-loaded rule.** The FE mirrors the backend's top-level tiers. Getting a new file into the
right tier is the whole point of this doc.

```
Packages (leaves — import nothing internal):
  packages/config       env: repo-root .env loader + optional Zod schema over process.env  [agnostic · base leaf, importable by ALL]
  packages/api-client   transport: openapi-fetch client + generated schema.gen   [agnostic]
  packages/ui           the ENTIRE web design system + all presentation   [web-only]

Top-level tiers (one-way linear chain, mirrors the backend):
  api-client ◄ repositories ◄ store ◄ apps/web
```

- **Platform-agnostic spine** (reusable by any future `apps/*` — desktop/native): `api-client`,
  `repositories`, `store`. **Web-only:** `ui`, `apps/web`. The web↔native line falls **below `store`**:
  `ui` renders (DOM), so it does NOT port; a native app reuses only the agnostic spine and builds its
  own presentation on top.
- **`ui` holds ALL presentation**, organised by Atomic Design under
  `components/{atoms,molecules,organisms,templates,pages}/`, plus `views/` (ui-owned view types like
  `word.view.ts`), `fixtures/` (design-stage mocks, exported via the `@kotodama/ui/fixtures` subpath),
  and `lib/` (`cn`, `languageName`). Every component folder = component + story + `index.ts` barrel; the
  whole site assembles in ui's Storybook on mock data as the design source of truth.
- **`ui ⊥ store`:** ui is independent of the domain MODEL — it takes data via props. It MAY read the
  generated WIRE CONTRACT **type-only** from `@kotodama/platform/api-client` (e.g. `word.view.ts` derives its
  content type off `operations['words.buildWord']`); it must NOT import `store`, `repositories`,
  `config`, or the app. It may self-compose via `@kotodama/ui` (a benign barrel self-import).
- **`api-client` is a leaf package importable by every tier** (for the client + raw `operations` —
  "everything → packages"). **`ui` is a leaf too, but web-only:** only `apps/web` may import it (plus its
  own Storybook); the agnostic spine must not (it is DOM-bound and would break portability).
- **`config` is the env base leaf — the single home for env keys, importable by ALL** (mirrors the
  backend `@kotodama/platform/config`). Its library imports nothing internal; the `api-client` leaf's
  `gen-api.ts` build script is Biome-exempted to reuse its `loadRootEnv`. The `api-client` *library*
  still reads no env — it takes `baseUrl` injected.
- **Tier direction:** `repositories` = raw fetchX + the contract entity types (`*Entity`); `store` =
  the domain model derivation (`narrowWordState` + the `*Model` types); `apps/web` = the Next shell
  (routing + the server data layer + wiring that composes `ui`). Never import upward, and the agnostic
  spine never imports `ui`/`apps`.
- **`apps/web` splits in two internally:** `src/server/**` is the RSC data layer — the ONE place in
  the app allowed to import `@kotodama/core/repositories` (it composes fetchX + `store` models + `config`
  into `*.loader.ts` reads and `*.actions.ts` mutations); `app/**` is the routing shell — plus the
  client-wiring chrome/islands under `src/chrome/**` + `src/words/**` — that composes `@kotodama/ui`
  components, injecting the loaders' data + the actions. `src/server` must not import `ui` — presentation
  lives in `ui`, data in `src/server`.

## Two enforcement planes

1. **DOM-free `tsconfig.base.json` is PRIMARY.** `api-client`, `repositories`, `store` compile with
   `lib: ["esnext"]` and no `"dom"`, so any `document`/`window`/react-dom leak — or a dependency that
   pulls DOM types (e.g. a Radix primitive or `next`) — is a **`tsc` error before Biome runs**. `ui` +
   `apps/web` opt into `lib:["dom",…]` + `jsx` + `@types/react`. A correct-by-construction
   guarantee an import denylist can't match.
2. **Biome `noRestrictedImports` = tier-direction bans** (`biome.base.json`, per-glob overrides): the
   leaf rules (`api-client` imports nothing internal; `ui` bans `store`/`repositories`/`config`/`web`
   but NOT `api-client` — its wire contract is allowed type-only) + the one-way tier chain + the
   agnostic-spine-never-imports-`ui`/`apps` rule + the `apps/web` repositories ban (waived only for
   `apps/web/src/server/**`, which also bans `@kotodama/ui`/`@kotodama/web`). Run `/scan-deps`.

**The invariant both protect: the web↔native boundary.** The agnostic spine is what a future
`apps/mobile` reuses unchanged; `ui`/`apps/web` are DOM-bound and do not port — only `ui`'s
semantic-token *contract* does. A spine tier that reaches for the DOM, `ui`, or a web-only dep must
fail.

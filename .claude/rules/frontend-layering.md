# Frontend layering (the rule the scaffolding protects)

**Always-loaded rule.** The FE mirrors the backend's top-level tiers. Getting a new file into the
right tier is the whole point of this doc.

```
Packages (leaves — import nothing internal):
  packages/config       env: repo-root .env loader + optional Zod schema over process.env  [agnostic · base leaf, importable by ALL]
  packages/api-client   transport: openapi-fetch client + generated schema.gen   [agnostic]
  packages/ui           web design system: Tailwind v4 + shadcn primitives + @theme tokens  [web-only]

Top-level tiers (one-way linear chain, mirrors the backend):
  api-client ◄ repositories ◄ store ◄ use-cases ◄ apps/web
```

- **Platform-agnostic spine** (reusable by any future `apps/*` — desktop/native): `api-client`,
  `repositories`, `store`, `use-cases`. **Web-only:** `ui`, `apps/web`.
- **`api-client` is a leaf package importable by every tier** (for the client + raw `operations` —
  "everything → packages"). **`ui` is a leaf too, but web-only:** only `apps/web` may import it; the
  agnostic tiers must not (it is DOM-bound and would break portability).
- **`config` is the env base leaf — the single home for env keys, importable by ALL** (mirrors the
  backend `@kotodama/config`). Its library imports nothing internal; the `api-client` leaf's
  `gen-api.ts` build script is Biome-exempted to reuse its `loadRootEnv`. The `api-client` *library*
  still reads no env — it takes `baseUrl` injected.
- **Tier direction:** `repositories` = raw fetchX + the contract entity types (`*Entity`); `store` =
  TanStack Query `queryOptions` + the domain model derivation (`narrowWordState`, run in `select`);
  `use-cases` = React hooks over `store`; `apps/web` = the web app (Next App Router render + feature
  components + view shapes). Never import upward, and the agnostic tiers never import `ui`/`apps`.
  `apps/web` reaches data through `use-cases` hooks (or `store` loaders), never the raw
  `repositories` fetchX.

## Two enforcement planes

1. **DOM-free `tsconfig.base.json` is PRIMARY.** `api-client`, `repositories`, `store`,
   `use-cases` compile with `lib: ["esnext"]` and no `"dom"`, so any `document`/`window`/react-dom
   leak — or a dependency that pulls DOM types (e.g. a Radix primitive or `next`) — is a **`tsc`
   error before Biome runs**. `use-cases` opts into `jsx` (for its provider) but stays DOM-free. `ui` + `apps/web` opt
   into `lib:["dom",…]` + `jsx` + `@types/react`. A correct-by-construction guarantee an import
   denylist can't match.
2. **Biome `noRestrictedImports` = tier-direction bans** (`biome.json`, per-glob overrides): the
   leaf rules (`api-client`/`ui` import nothing internal) + the one-way tier chain + the
   agnostic-tiers-never-import-`ui`/`apps` rule. Run `/scan-deps`.

**The invariant both protect: the web↔native boundary.** The agnostic spine is what a future
`apps/mobile` reuses unchanged; `ui`/`apps/web` are DOM-bound and do not port — only `ui`'s
semantic-token *contract* does. A spine tier that reaches for the DOM, `ui`, or a web-only dep must
fail.

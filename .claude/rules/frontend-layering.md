# Frontend layering (the rule the scaffolding protects)

**Always-loaded rule.** The FE mirrors the backend's top-level tiers. Getting a new file into the
right tier is the whole point of this doc.

```
Packages (leaves — import nothing internal):
  packages/api-client   transport: openapi-fetch client + generated schema.gen   [agnostic]
  packages/ui           web design system: Chakra + tokens + components           [web-only]

Top-level tiers (one-way, mirror backend apps → use-cases → core → repositories):
  api-client ◄ core ◄ store ◄ use-cases ◄ apps/web
  api-client ◄ repositories ◄ store
                (core + repositories are parallel; store composes both)
```

- **Platform-agnostic spine** (reusable by any future `apps/*` — desktop/native): `api-client`,
  `core`, `repositories`, `store`, `use-cases`. **Web-only:** `ui`, `apps/web`.
- **`api-client` is a leaf package importable by every tier** (for the client + contract types —
  "everything → packages"). **`ui` is a leaf too, but web-only:** only `apps/web` may import it; the
  agnostic tiers must not (it is DOM/Chakra-bound and would break portability).
- **Tier direction:** `core` = pure view-models; `repositories` = raw fetchX; `store` = TanStack
  Query `queryOptions` (composes repositories + core); `use-cases` = React hooks over `store`;
  `apps/web` = the web app (SSR/router/render + feature components). Never import upward, and the
  agnostic tiers never import `ui`/`apps`. `apps/web` reaches data through `use-cases` hooks (or
  `store` loaders), never the raw `repositories` fetchX.

## Two enforcement planes

1. **DOM-free `tsconfig.base.json` is PRIMARY.** `api-client`, `core`, `repositories`, `store`,
   `use-cases` compile with `lib: ["esnext"]` and no `"dom"`, so any `document`/`window`/react-dom
   leak — or a dependency that pulls DOM types (e.g. Chakra) — is a **`tsc` error before Biome
   runs**. `use-cases` opts into `jsx` (for its provider) but stays DOM-free. `ui` + `apps/web` opt
   into `lib:["dom",…]` + `jsx` + `@types/react`. A correct-by-construction guarantee an import
   denylist can't match.
2. **Biome `noRestrictedImports` = tier-direction bans** (`biome.json`, per-glob overrides): the
   leaf rules (`api-client`/`ui` import nothing internal) + the one-way tier chain + the
   agnostic-tiers-never-import-`ui`/`apps` rule. Run `/scan-deps`.

**The invariant both protect: the web↔native boundary.** The agnostic spine is what a future
`apps/mobile` reuses unchanged; `ui`/`apps/web` are DOM-bound and do not port — only `ui`'s
semantic-token *contract* does. A spine tier that reaches for the DOM, Chakra, or `ui` must fail.

# Frontend layering (the rule the scaffolding protects)

**Always-loaded rule.** Two enforced import gradients — one across packages, one inside `apps/web`.
Never the reverse. Getting a new file into the right layer is the whole point of this doc.

## Cross-package (mirrors backend `everything → packages`, `packages → nothing internal`)

```
apps/web ─► packages/{fe-ui, fe-theme} ─► packages/fe-tokens     (web design-system: ui ◄ theme ◄ tokens)
apps/web ─► packages/{fe-store, fe-core, fe-api-client}          (platform-agnostic SPINE — a future apps/mobile reuses it unchanged)
packages/fe-tokens ─► (nothing internal — a leaf)
```

- **Spine** = `fe-api-client ◄ fe-core ◄ fe-store` (a one-way chain): the client + fetchX at the
  base, pure view-models (`fe-core`) above, `queryOptions` factories (`fe-store`) on top. It is the
  cross-platform reuse unit; it must not import the web design-system or `apps/*`.
- **Web design-system** = `fe-tokens ◄ fe-theme ◄ fe-ui`: `fe-tokens` is a neutral leaf; `fe-theme`
  is Chakra `createSystem` over its **semantic tokens** (intent names like `bg.canvas`, never raw
  colours — the web↔native seam); `fe-ui` is presentational, prop-driven, and imports neither the
  spine nor `apps/*`.

## Intra-`apps/web/src` (post-S1: `repositories` folded INTO fe-api-client)

```
fe-api-client (client + fetchX) ◄ fe-core ◄ fe-store ◄ features/<name> ◄ render (routes · entry-* · server · router)
```

- `apps/web` reaches the API **only** through `fe-store`'s `queryOptions` — a component/route
  importing `@kotodama/fe-api-client` directly bypasses the store seam and fails lint (AC-2).
- The one surviving relative edge is `features → render`: a `features/*` file must not import
  routes, the router, the SSR entries, or the Bun server (render composes features, not the
  reverse). There is **no** `apps/web/src/repositories/` — the fetchX functions live in the
  `fe-api-client` package.

## Two enforcement planes

1. **DOM-free `tsconfig.base.json` is PRIMARY (S2/V2).** The spine compiles `lib: ["esnext"]` with
   no `"dom"`, so any `document`/`window`/react-dom leak — or a dependency that pulls DOM types — is
   a **`tsc` error before Biome runs**. Web workspaces opt into `lib:["dom",…]` + `jsx` +
   `@types/react` in their own tsconfig (via the `--dom` scaffold). This is a correct-by-
   construction guarantee an import denylist can't match.
2. **Biome `noRestrictedImports` = layer-DIRECTION bans only** (`biome.json`, per-glob overrides):
   the leaf/edge/chain rules above. Biome is the sole *import-direction* enforcement (transitive
   checking is out of scope). Run `/scan-deps`.

**The invariant both protect: the web↔native boundary.** `fe-api-client`/`fe-core`/`fe-store`/
`fe-tokens` are the spine a future `apps/mobile` reuses unchanged; `fe-theme`/`fe-ui` are DOM-bound
and do not port — only their semantic-token *contract* does. A spine package that reaches for the
DOM, Chakra, or React-DOM silently breaks mobile reuse and must fail review.

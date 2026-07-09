# store — `@kotodama/store`

The domain **model** tier — `narrowWordState` + the `*Model` types. Platform-agnostic spine (no
DOM, no React): it collapses the wire union (`WordStateEntity`) into the tagged `WordStateModel` the
render layer switches on. The cross-app reuse unit — the web server loader narrows here, and a
future native app would too.

- **May import:** `@kotodama/repositories` (the `*Entity` types + `Language`). Not the design
  system, not `apps/*`. No `@tanstack/*` — this tier holds no queries.
- **Imported by:** `apps/web/src/server` (loaders narrow here) + `use-cases` (the `*Model` types +
  `WordBuildStatus` for its feature components' props).
- **Owns the word-state model** (`WordStateModel` + `narrowWordState`, in `.model.ts`), mirroring the
  backend's `word-state-collapse.ts`. Exposes `WordBuildStatus` (the full wire status union) for the
  poll island. Re-exports `Language` so `apps/web` need not reach into `repositories`.
- **No queryOptions.** The TanStack `queryOptions` factory was removed with the server-first migration
  (reads are RSC now); `store` is pure model. (`use-cases` still exists but as the **web-only feature
  tier** — views/islands — not a client-query layer.) Re-introduce a `queryOptions` layer only if a
  client cache or a native app returns; this model is what it would wrap.

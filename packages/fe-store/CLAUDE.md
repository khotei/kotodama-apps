# packages/fe-store — `@kotodama/fe-store`

TanStack Query `queryOptions`/`mutationOptions` **factories** — the real cross-platform reuse unit
and `apps/web`'s gateway to the API. Spine (no DOM); a future `apps/mobile` shares it unchanged.

- **May import:** `@kotodama/fe-api-client` (fetchX + client factory), `@kotodama/fe-core` (via
  `select`), `@tanstack/react-query`. Not the web design-system, not `apps/*`.
- **Imported by:** `apps/web` (routes + features). It **re-exports** `createApiClient` + the `Language`
  type so `apps/web` never imports `fe-api-client` directly (Biome ban — AC-2).
- **Factories, not hooks (`openapi-react-query` rejected).** The hook form collapses the
  fetchX/core/store seams and can't feed a TanStack Router loader; a plain `queryOptions` lets a
  loader `ensureQueryData` and a component `useQuery` share one definition — the basis of SSR
  prefetch → hydrate. `select` is where `fe-core` runs; the `client` is passed in, never a singleton.

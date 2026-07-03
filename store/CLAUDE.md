# store — `@kotodama/store`

TanStack Query `queryOptions`/`mutationOptions` **factories** — the cross-app reuse unit. Spine (no
DOM); the one definition a route loader (`ensureQueryData`) and a use-case hook (`useQuery`) share,
which is what makes SSR prefetch → hydrate work.

- **May import:** `@kotodama/repositories` (fetchX for `queryFn`), `@kotodama/core` (via `select`),
  `@kotodama/api-client` (the `ApiClient`/`Language` types), `@tanstack/react-query`. Not `use-cases`,
  not the design system, not `apps/*`.
- **Imported by:** `use-cases` (hooks) + `apps/web` (route loaders).
- **Factories, not hooks (`openapi-react-query` rejected).** The hook form collapses the
  repositories/core/store seams and can't feed a TanStack Router loader. `select` is where `core`
  runs; the `client` is passed in, never a singleton.

# store — `@kotodama/store`

TanStack Query `queryOptions`/`mutationOptions` **factories** — the cross-app reuse unit. Spine (no
DOM); the one definition a route loader (`ensureQueryData`) and a use-case hook (`useQuery`) share,
which is what makes SSR prefetch → hydrate work.

- **May import:** `@kotodama/repositories` (fetchX + the `*Entity` types + `Language`),
  `@kotodama/api-client` (the `ApiClient` type), `@tanstack/react-query`. Not `use-cases`, not the
  design system, not `apps/*`.
- **Imported by:** `use-cases` (hooks) + `apps/web` (route loaders).
- **Owns the word-state model** (`WordStateModel` + `narrowWordState`, in `.model.ts`) — co-located
  with the query, mirroring the backend's `word-state-collapse.ts` beside its handler; `select` runs
  it. Re-exports `Language` upward so `use-cases`/`apps` need not reach into `repositories`.
- **Factories, not hooks (`openapi-react-query` rejected).** The hook form collapses the
  repositories/store seams and can't feed a TanStack Router loader. The `client` is passed in, never
  a singleton.

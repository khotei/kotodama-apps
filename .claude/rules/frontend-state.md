---
paths:
  - "apps/web/src/**"
  - "packages/fe-store/**"
  - "packages/fe-api-client/**"
---

# Frontend state — where a data concern lives

Three seams, each owning one decision. Put a new data concern in the layer that owns it; do not
collapse two.

- **fetchX (`fe-api-client/src/repositories/*`)** — bare async access functions (`fetchWord`,
  `fetchWordState`, `searchWords`) returning plain Promises of generated `schema.gen` types. The
  ONLY code that speaks path-strings + query params. No React, no caching, no domain logic. Throws
  `ApiError(status, body)` on a non-2xx (there is no typed error channel — no Effect on the FE).
- **store (`fe-store`)** — `queryOptions`/`mutationOptions` **factories** (`wordQueryOptions(client,
  language, word)`): the query key convention, `staleTime`, and a `select` that routes the fetched
  shape through `fe-core`. This is the reuse unit a route loader AND a component share, and the
  gateway `apps/web` imports (it re-exports `createApiClient` so `apps/web` needn't touch
  `fe-api-client`).
- **feature-hook (`apps/web/src/features/<name>`)** — a component calling `useQuery(store factory)`
  and mapping the narrowed domain shape onto `fe-ui` primitive props. UI concerns only.

## Discipline

- **`queryOptions` factories, NOT `openapi-react-query`.** The hook form collapses the
  fetchX/core/store seams and can't feed a TanStack Router loader (which wants a plain
  `queryOptions`). Keep the factories — a loader `ensureQueryData(factory)` and a component
  `useQuery(factory)` share one definition, which is what makes SSR prefetch → hydrate work.
- **`select` is where core runs.** Wire-shape narrowing / view-model derivation belongs in
  `fe-core`, invoked from the factory's `select` — never inline in a component. Components receive
  the tagged domain shape (`{ kind: 'ready' | 'unready' }`), never the raw `anyOf` union.
- **The client is passed in, never a singleton.** SSR server, browser entry, and tests each build
  their own `createApiClient({ baseUrl, fetch })` and thread it through context to the factory.

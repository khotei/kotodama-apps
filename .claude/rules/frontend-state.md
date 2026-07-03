---
paths:
  - "apps/web/src/**"
  - "use-cases/**"
  - "store/**"
  - "repositories/**"
---

# Frontend state — where a data concern lives

One tier owns each decision. Put a new data concern in the tier that owns it; do not collapse two.

- **transport (`packages/api-client`)** — the openapi-fetch client + generated types. No access
  logic. `createApiClient({ baseUrl, fetch })` is a factory the app constructs + injects.
- **repositories (`repositories/`)** — bare async `fetchX` functions (`fetchWord`,
  `fetchWordState`, `searchWords`) over the client; the ONLY code that speaks path-strings + query
  params. Returns generated types; throws `ApiError` on a non-2xx. No React, no caching.
- **store (`store/`)** — `queryOptions`/`mutationOptions` **factories** (`wordQueryOptions(client,
  language, word)`): key convention, `staleTime`, `queryFn` = a `repositories` fetchX, and a
  `select` that routes through `core`. The reuse unit a route loader AND a hook share.
- **use-cases (`use-cases/`)** — React **hooks** (`useWord`) that read the client from
  `ApiClientProvider` and wrap `useQuery(store factory)`. Platform-agnostic (no DOM). This is what a
  feature depends on.
- **render (`apps/web/src/features/*`)** — web feature components that call a use-case hook and map
  the narrowed domain shape onto `ui` primitive props. UI concerns only.

## Discipline

- **`queryOptions` factories, NOT `openapi-react-query`.** The hook form collapses the
  repositories/core/store seams and can't feed a TanStack Router loader; a plain `queryOptions` lets
  a loader `ensureQueryData` and a hook `useQuery` share one definition — the basis of SSR prefetch
  → hydrate.
- **`select` is where core runs.** Wire-shape narrowing / view-model derivation belongs in `core`,
  invoked from the factory's `select`. Components receive the tagged domain shape
  (`{ kind: 'ready' | 'unready' }`), never the raw `anyOf` union.
- **The client is injected, never a singleton.** The app builds one `createApiClient(...)` and
  provides it via `ApiClientProvider` (for hooks) + the router context (for loaders) — the SAME
  instance, so server and client agree.

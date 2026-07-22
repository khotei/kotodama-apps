---
paths:
  - "apps/web/**"
  - "store/**"
  - "repositories/**"
---

# Frontend state — where a data concern lives

**The default is the server.** Reads are RSC, writes are Server Actions, the client cache is gone.
One tier owns each decision; put a new data concern in the tier that owns it.

- **transport (`packages/api-client`)** — the openapi-fetch client + raw generated `operations`. No
  access logic. `createApiClient({ baseUrl, fetch })` is a factory the app constructs + injects.
- **repositories (`repositories/`)** — bare async `fetchX` functions (`fetchWord`, `fetchWordState`,
  `searchWords`) over the client; the ONLY code that speaks path-strings + query params. Owns the
  contract **entity types** (`*Entity`); takes an optional trailing `init` (fetch options — e.g.
  Next's `{ next: { tags } }`) it forwards verbatim. Throws `ApiError` on non-2xx. No React, no caching.
- **store (`store/`)** — the domain **model** tier: `narrowWordState` (the tagged `WordStateModel`)
  + the model types. Pure, DOM-free, agnostic — the reuse unit a web loader AND a future native app
  share. No queryOptions, no React.
- **server data layer (`apps/web/src/server/`)** — the app's ONLY door to `repositories`:
  - `*.loader.ts` (`import 'server-only'`) — `React.cache`-wrapped reads: `fetchX(staticClient, …,
    { next: { tags } })` → `narrowWordState`. One fetch/request, shared by the page + `generateMetadata`.
    NEVER throws (unreachable backend → `null`), so SSG builds without a live backend.
  - `*.actions.ts` (`'use server'`) — the ONE mutation/revalidation door: `fetchX(serverClient, dto)`
    then `revalidatePath`/`revalidateTag`. Verify the session here (Server Actions are reachable by
    direct POST). No `server-only` — a client island imports the action as a network reference.
- **presentation (`packages/ui`)** — all rendering (atoms→pages + view types + fixtures): prop-driven
  components that take the resolved model + injected Server Actions/URLs as **serializable** props. `ui`
  is independent of `store` (`ui ⊥ store`); the app maps domain → props by injection. Wiring lives in
  `apps/web` (`app/**` + `src/chrome/**` + `src/words/**`).

## Discipline

- **Reads flow RSC → props, not through a client cache.** The page calls a `*.loader.ts`, passes the
  model down; feature components are pure functions of props. No `HydrationBoundary`, no QueryClient.
- **One `React.cache` per request** dedupes the loader across the page, `generateMetadata`, and
  JSON-LD — never fetch the same datum twice.
- **The client is injected, never a singleton.** The loaders build `createStaticApiClient()` /
  `createServerApiClient()` (server-only). There is NO browser client and no `/api/*` rewrite — the
  browser talks only to Next (RSC + Server Actions); a client island that needs live data calls an
  injected Server Action (or, if warranted, an injected URL for a client GET).

## Client islands (`.client.tsx`) — the justified exceptions

A `'use client'` island is warranted ONLY for what the server model can't do; it lives in `apps/web`
(`.client.tsx` under `src/**`), taking its IO as **serializable** injected props:

- **Frequently polled data** — a poll island calls an injected typed **Server Action** (`poll`) each
  tick and an injected `onSettled` action once terminal (→ `revalidatePath` → RSC re-render). Both are
  serializable Server Action references (the only way to hand a client "a function" from an RSC page —
  a plain closure won't cross the boundary, and a URL string is stringly-typed); the status read uses
  `cache: 'no-store'` for freshness. Server Actions dispatch serially per client — harmless for a lone
  periodic poll; only if a page runs many competing actions, poll via a client GET (inject a URL
  string) so the poll doesn't queue behind them.
- **Client-only Web APIs** (geolocation, storage, media), **optimistic UI** (`useOptimistic` over an
  action), **form pending/validation** (`useActionState`).
- **A client data library (React Query/SWR) returns ONLY if** islands multiply into a real
  client-cache need (many polled/optimistic surfaces) or a native app arrives. Then it's a deliberate
  choice, wrapping the `store` model — not the default.

## Cache model & the cross-page staleness fix

`fetch` is uncached by default; a route's `export const revalidate` opts its reads into the Data
Cache (ISR). The client **Router Cache** holds statically-generated pages ~5 min, so A→B(mutate)→A
shows stale A. The one lever that fixes it: **`revalidatePath`/`revalidateTag` from a Server Action**
busts the Data Cache, the Full Route Cache, AND the client Router Cache in one round-trip and
re-renders. The same call from a Route Handler only marks for next-visit — so mutations go through
`*.actions.ts`, never a self-owned Route Handler. Each page re-runs its own loader on soft
navigation, so page B never depends on page A's fetch.

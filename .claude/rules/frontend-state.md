---
paths:
  - "apps/web/**"
  - "core/**"
---

# Frontend state — where a data concern lives

**Default is the server: reads are RSC loaders, writes are Server Actions, there is NO client
data cache** (no QueryClient, no `HydrationBoundary`, no `prefetchQuery`). Layer identities live
in `frontend-layering.md` + `naming.md`; this file holds only the non-derivable contracts.

- **repositories** — `fetchX` takes an optional trailing `init` and forwards it verbatim (e.g.
  Next `{ next: { tags } }`); throws `ApiError` on non-2xx.
- **`*.loader.ts`** (`server-only`, `React.cache`) — the ONLY door to `core/repositories`. **NEVER
  throws**: an unreachable backend returns `null`, so the public tree builds (SSG) without a live
  backend. One fetch/request, shared by page + `generateMetadata` + JSON-LD.
- **`*.actions.ts`** (`'use server'`) — the ONE mutation door. **Verify the session here** — Server
  Actions are reachable by direct POST. No `server-only` (a client island imports the action as a
  network reference).
- **The client is injected, never a singleton. There is NO browser client and NO `/api/*` rewrite** —
  the browser talks only to Next (RSC + Server Actions).

## Client islands (`.client.tsx`) — justified exceptions only

- Take IO as **serializable** injected props (a plain closure can't cross the RSC→client boundary).
- **Poll:** injected Server Action per tick (`cache:'no-store'`) + injected `onSettled` action.
  Actions dispatch serially per client — fine for a lone poll; if a page runs many competing
  actions, poll via an injected URL (client GET) so it doesn't queue.
- A client data library (React Query/SWR) is deliberately deferred — adopt only if islands multiply
  or a native app arrives.

## Cross-page staleness

`fetch` is uncached; `export const revalidate` opts a route into ISR. The client Router Cache holds
static pages ~5 min, so A→B(mutate)→A shows stale A. **Only `revalidatePath`/`revalidateTag` from a
Server Action** busts the Data + Full-Route + Router caches in one round-trip — the same call from a
Route Handler only marks for next-visit, so mutations go through `*.actions.ts`.

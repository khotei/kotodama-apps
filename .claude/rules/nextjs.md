---
paths:
  - "apps/web/**"
  - "core/**"
---

# Next.js — the server-first data path

**Read the bundled docs (`node_modules/next/dist/docs/`) before coding a framework API.**

Server-first: reads = RSC loaders, writes = Server Actions. NO client data cache (React Query
deliberately deferred), NO browser api-client, NO `/api/*` rewrite — the browser talks only to
Next. The client is injected, never a singleton.

## Data layer

- `fetchX(client, …, init?)` — client first, `init` forwarded verbatim; `unwrap` throws `ApiError`
  on non-2xx — the ONE typed error channel.
- `*.loaders.ts` (`load*`), two flavors: RSC = `server-only` + `React.cache`; island-callable =
  `'use server'` (imported as a network reference). **Honest:** never `try/catch` into `null`/`[]`
  — an RSC read throws to the route's `error.tsx` (the ONE degraded state; `next build` therefore
  needs a reachable backend); an island read rejects into its caller. Return the FULL wire
  payload, never a trimmed slice.
- `*.requests.ts` (`'use server'`, `request*`) — the ONE mutation door. **Verify the session
  here** — Server Actions are reachable by direct POST.

## SSG invariant (load-bearing)

`app/(public)/**` calls `createServerApiClient()` BARE and Biome-bans `next/headers`: `cookies()`
in a render **silently kills SSG** (no build error). Identity injection (`{ headers: … }`) belongs
to the authed tree only.

## Islands

- `'use client'` lives ONLY in `providers.tsx` + `app/(public)/components/**`; islands take
  serializable injected props (a bound Server Action or data — a closure can't cross).
- A mount-time action read runs in `useMount`, NEVER in render (double-trip: Router
  update-in-render + pre-mount setState).
- Poll = injected action per tick (`cache:'no-store'`); actions queue serially per client — many
  competing actions ⇒ poll via an injected URL instead.

## Staleness

Router Cache holds static pages ~5 min → A→B(mutate)→A shows stale A. **Only
`revalidatePath`/`revalidateTag` FROM a Server Action** busts all three caches in one round-trip
(from a Route Handler it only marks for next visit). `export const revalidate` = ISR.

## SEO (the word page's contract)

`generateMetadata` + page share ONE `React.cache` loader · inline JSON-LD MUST escape `<`
(`.replace(/</g, '\\u003c')` — it breaks out of `<script>`) · `metadataBase` per-env; unready word
→ `robots:{index:false}`.

## Resolution & env

Own source via `@/*`; workspace pkgs via `exports` subpaths — including CSS (`globals.css` =
`@import "@kotodama/ui/styles.css"`). Env ONLY via `@kotodama/platform/config` (`serverEnv()`);
build per environment. No committed `.mcp.json`.

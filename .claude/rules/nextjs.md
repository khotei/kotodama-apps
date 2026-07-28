---
paths:
  - "apps/web/**"
---

# Next.js (App Router) — the render-shell rules

Scoped to `apps/web/**`. **Read the bundled version-matched docs (`node_modules/next/dist/docs/`)
before coding a framework API — not training data.** This file holds only project invariants Next
won't tell you; the RSC/Actions/poll model + cache-staleness fix live in `frontend-state.md`, tier
direction in `frontend-layering.md`, Turbopack/Playwright in `tooling.md`.

## The load-bearing invariant — the public tree stays statically generable

In `app/(public)/**`, loaders call `createServerApiClient()` **bare — never injecting `headers`**, and the
tree bans `next/headers` (Biome): `cookies()` in a render makes the route **dynamic** and **silently
kills SSG** — no build error, just a lost prerender. Per-request identity is injected at the call
site (`createServerApiClient({ headers: … })`) and belongs to the authed `(app)` tree only.

## RSC / client boundaries

`'use client'` in the app lives ONLY in `providers.tsx` (theme), layout-colocated chrome under
`app/(public)/components/**` (nav/mode wiring — `usePathname` + next-themes), and feature islands
(`.client.tsx` under `src/**`).
Everything else is an RSC shell resolving data via the data-layer loaders
(`src/<domain>/server/**` or a route-colocated `server/` folder).

## SEO

- `generateMetadata` and the page share ONE `React.cache` loader — one fetch/request.
- **Inline JSON-LD MUST escape `<`** (`.replace(/</g, '\\u003c')`) — `dangerouslySetInnerHTML`
  escapes nothing, so an unescaped `<` breaks out of `<script>`.
- `metadataBase` (root layout, per-env) resolves the `opengraph-image` URL. Unready/absent word →
  `robots:{index:false}`.

## Resolution & env

- Import the app's own source via the `@/*` tsconfig path. Workspace packages resolve via their
  `package.json` `exports` subpaths, NOT the app's tsconfig paths — **including CSS**: `globals.css`
  is `@import "@kotodama/ui/styles.css"` (the ui entry `@source`s its own tree).
- **Env comes from `@kotodama/platform/config`** (`serverEnv()`/`clientEnv()`, Zod-validated) —
  never scattered `process.env.X ?? default`, never read server env in the browser bundle. **Build
  per environment.**
- Next.js MCP is user-scope only; no `.mcp.json` is committed (`sdd.md`).

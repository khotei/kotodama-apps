---
paths:
  - "apps/web/**"
---

# Next.js (App Router) — the render-shell rules

Scoped to `apps/web/**`. **Framework API facts come from the bundled docs**
(`node_modules/next/dist/docs/`, version-matched to the installed Next) — read them before coding,
not training data (`apps/web/CLAUDE.md` says the same at the top). This file holds only the project
invariants Next itself won't tell you. Tier direction (never import
`@kotodama/repositories`; reach data through `use-cases`/`store`) lives in `frontend-layering.md`.

## The load-bearing invariant — the public tree stays statically generable

- In `app/(public)/**`, fetch data **only** with `createStaticApiClient()` (anonymous, cookie-free).
  `cookies()`, `createBrowserApiClient()`, or `createServerApiClient()` there make the route
  **dynamic** and silently kill SSG — no build error, just a lost prerender.
- **No raw RSC `fetch()`.** Data flows through the spine's `queryOptions` factories:
  `prefetchQuery(wordQueryOptions(client, …))` → `dehydrate` → `<HydrationBoundary>` → a `use-cases`
  hook client-side. The transport client is **never** placed in a query key.

## RSC / client boundaries

- Default to Server Components. `'use client'` sits at the smallest leaf that needs it —
  `providers.tsx` (QueryClient / ApiClient / theme) and the feature view that reads a hook
  (`word-view.tsx`). Pages and layouts stay RSC.
- `word-view.tsx` is the ONE place domain (`WordStateModel`) → presentational props mapping happens;
  `@kotodama/ui` stays prop-driven.

## SEO

- `generateMetadata` and the page share ONE `React.cache`-wrapped loader (one fetch/request; the same
  prefetched client is dehydrated) — never fetch the word twice.
- Inline JSON-LD MUST escape `<` (`.replace(/</g, '\\u003c')`) — `dangerouslySetInnerHTML` escapes
  nothing, so an unescaped `<` in a value breaks out of `<script>`.
- `metadataBase` (root layout, per-env) resolves the `opengraph-image` URL. Unready/absent word →
  `robots:{index:false}`.

## ISR / revalidation

- `export const revalidate` (literal) is the safety net; `POST /api/revalidate` does precise
  `revalidatePath` on the **decoded** word path (matches the SSG prerender key). The secret is read
  per request and **fails closed** — a missing `REVALIDATE_SECRET` 401s every call.

## Bundler & tooling

- **Turbopack, never `--webpack`.** Tailwind is zero-runtime static CSS, so the Emotion/Turbopack
  hydration bug (vercel/next.js#75830) that forced webpack under Chakra cannot occur.
- **Playwright (`apps/e2e`) runs `bunx playwright test`, NEVER `--bun`** (oven-sh/bun#8222 —
  hangs/segfaults). The one place Node is an accepted prerequisite.
- Import the app's own source via the `@/*` tsconfig path (resolves under Turbopack). Workspace
  packages resolve via their `package.json` `exports` subpaths, NOT the consuming app's tsconfig
  paths — including CSS: `globals.css` is `@import "@kotodama/ui/styles.css"` (the ui entry
  `@source`s its own tree, so the app declares no `../` paths).
- `KOTODAMA_API_URL`, `KOTODAMA_SITE_URL`, `REVALIDATE_SECRET` are inlined at build — **build per
  environment**.

## Optional: Next.js MCP (user scope, not committed)

For live app-state introspection, add the Next.js MCP server at **user scope** (`claude mcp add
--scope user …`; see the bundled `guides/mcp` doc). Per `sdd.md` no `.mcp.json` is committed — keep
it out of the repo.

---
paths:
  - "apps/web/**"
---

# Next.js (App Router) — the render-shell rules

Scoped to `apps/web/**`. **Framework API facts come from the bundled docs**
(`node_modules/next/dist/docs/`, version-matched to the installed Next) — read them before coding,
not training data (`apps/web/CLAUDE.md` says the same at the top). This file holds only the project
invariants Next itself won't tell you. Tier direction (render code never imports
`@kotodama/core/repositories` — only `src/server` does; presentation comes from `@kotodama/ui`)
lives in `frontend-layering.md`.

## The load-bearing invariant — the public tree stays statically generable

- In `app/(public)/**`, loaders fetch **only** with `createStaticApiClient()` (anonymous, cookie-free).
  `cookies()` or `createServerApiClient()` there make the route **dynamic** and silently kill SSG —
  no build error, just a lost prerender.
- **Data flows RSC → props, never a client cache.** Reads live in `src/server/**/*.loader.ts`
  (`import 'server-only'`, `React.cache`-wrapped) and are the ONLY place `@kotodama/core/repositories` is
  touched; the page passes the resolved model into a `@kotodama/ui` component. Mutations/
  revalidation live in `src/server/**/*.actions.ts` (`'use server'`). No `prefetchQuery`/`dehydrate`/
  `HydrationBoundary`, no QueryClient, no raw RSC `fetch()` in the render tree.

## RSC / client boundaries

- **Presentation lives in `@kotodama/ui`** (atoms→pages + view types + fixtures); the page is a thin
  RSC shell that resolves data via `src/server` loaders and **injects** it — plus Server Actions +
  URLs — into those components as serializable props (see `frontend-state.md`). `'use client'` in the
  app sits in `providers.tsx` (theme), `src/chrome/*.client.tsx` (nav/mode chrome — needs
  `usePathname` + next-themes), and the feature islands (poll loops, optimistic UI, form state) as
  `.client.tsx` under `src/**` (e.g. `src/words/`).
- The app maps domain (`WordStateModel`) → props by injection; `@kotodama/ui` stays prop-driven and
  reads the wire contract type-only.

## SEO

- `generateMetadata` and the page share ONE `React.cache`-wrapped loader (`getWordState`) — one
  fetch/request, never fetch the word twice.
- Inline JSON-LD MUST escape `<` (`.replace(/</g, '\\u003c')`) — `dangerouslySetInnerHTML` escapes
  nothing, so an unescaped `<` in a value breaks out of `<script>`.
- `metadataBase` (root layout, per-env) resolves the `opengraph-image` URL. Unready/absent word →
  `robots:{index:false}`.

## ISR / revalidation

- `export const revalidate` (literal, on the word page) is the time-based mechanism: a succeeded word
  refreshes on the next request after the window elapses. On-demand invalidation is
  `revalidatePath`/`revalidateTag` **from a Server Action** (`*.actions.ts`) — the only call that also
  purges the client Router Cache and re-renders in one round-trip; never from a Route Handler (marks
  for next-visit only). No backend webhook.
- **Polling** (a word still building) is an `apps/web/src/words/*.client.tsx` island calling an
  **injected** typed Server Action (`poll`, `cache: 'no-store'`) each tick + an injected refresh action
  once terminal. Both are serializable Server Action references (a plain fetcher closure can't cross
  the RSC→client boundary). Serial dispatch is harmless for a lone poll; there is **no `/api/*`
  rewrite** — the browser talks only to Next, never the backend directly.

## Bundler & tooling

- **Turbopack, never `--webpack`.** Tailwind is zero-runtime static CSS, so the Emotion/Turbopack
  hydration bug (vercel/next.js#75830) that forced webpack under Chakra cannot occur.
- **Playwright (`apps/e2e`) runs `bunx playwright test`, NEVER `--bun`** (oven-sh/bun#8222 —
  hangs/segfaults). The one place Node is an accepted prerequisite.
- Import the app's own source via the `@/*` tsconfig path (resolves under Turbopack). Workspace
  packages resolve via their `package.json` `exports` subpaths, NOT the consuming app's tsconfig
  paths — including CSS: `globals.css` is `@import "@kotodama/ui/styles.css"` (the ui entry
  `@source`s its own tree, so the app declares no `../` paths).
- **Env comes from `@kotodama/platform/config`** (`serverEnv()` — Zod-validated, memoized over the repo-root
  `.env` that `loadRootEnv()` loads once at the top of `next.config.ts`); never scattered
  `process.env.X ?? default`. `serverSchema` validates on first access, so a missing required var
  throws once (SSG/metadata fail the build) — consumers use `serverEnv().X` directly, never
  a silent localhost. Read server-side only — never the browser bundle (the browser client is
  same-origin, `baseUrl: ''`); a public var crosses via `env: clientEnv()` + `clientSchema`. **Build
  per environment.**

## Optional: Next.js MCP (user scope, not committed)

For live app-state introspection, add the Next.js MCP server at **user scope** (`claude mcp add
--scope user …`; see the bundled `guides/mcp` doc). Per `sdd.md` no `.mcp.json` is committed — keep
it out of the repo.

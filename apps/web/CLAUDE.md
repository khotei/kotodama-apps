# apps/web — `@kotodama/web`

> **Before any Next.js work, read the relevant doc under `node_modules/next/dist/docs/`** — Next
> bundles its docs there, version-matched to the installed 16.2.10; your training data lags the
> framework, so the bundled docs are the source of truth. Project invariants (RSC/SSG boundaries,
> the data path, SEO, Playwright-never-`--bun`) are in `.claude/rules/nextjs.md`.

The web app: the render layer + the walking-skeleton word slice, on **Next 16 (App Router,
Turbopack)**. Zero-runtime Tailwind — so no Emotion/CSS-in-JS hydration bug (why Turbopack, not
`--webpack`; see the feature Change log).

- **May import:** `@kotodama/use-cases` (feature hooks), `@kotodama/store` (loaders/prefetch),
  `@kotodama/ui`, `@kotodama/api-client` (the client factories), TanStack Query, React/Next.
  **Never `@kotodama/repositories`** (raw fetchX — go through use-cases/store).
- **`app/`** is the App Router tree: `layout.tsx` (RSC root, imports `globals.css`) → `providers.tsx`
  (`'use client'`: QueryClient + ApiClient (browser) + next-themes) → `(public)/words/[language]/[word]/`
  `page.tsx` (RSC, SSG via `generateStaticParams` + `revalidate`; non-ASCII params decoded at the
  boundary).
- **Data path (RSC → client):** the page prefetches `wordQueryOptions` with the STATIC client into a
  per-request `getQueryClient()`, `dehydrate`s it under a `HydrationBoundary`; the `'use client'`
  `word-view.tsx` reads `useWord` and is the ONE place domain (`WordStateModel`) → WordCard props
  mapping lives. `prefetchQuery` never throws, so a backend-less build hydrates nothing and WordView
  renders the loading/error arm. Import the app's own source via `@/*` (tsconfig path).
- **SEO (same route):** `generateMetadata` + the page share one `React.cache`-wrapped `loadWord`
  (one fetch/request, same prefetched client dehydrated). An inline JSON-LD `DefinedTerm` renders
  only when the word is ready; its `JSON.stringify` MUST `<`→`<`-escape (dangerouslySetInnerHTML
  does not) or a value breaks out of `<script>`. `metadataBase` (root layout, per-env) resolves the
  `opengraph-image.tsx` URL. Unready/absent word → `robots:{index:false}`.
- **`globals.css`** is one line — `@import "@kotodama/ui/styles.css"` (by package name, via the ui
  `exports`). The ui entry `@source`s its own tree, so the app declares no paths; PostCSS via
  `@tailwindcss/postcss`.
- **`src/env.ts` is the ONE place `process.env` is read** — a Zod-validated, memoized `env()`; no
  scattered `process.env.X ?? default`. A missing/invalid var throws at build (SSG, metadata,
  rewrites all touch it), never a silent localhost. Server-only: the browser client is same-origin
  so it never calls `env()`. `.env.example` lists the vars; copy to `.env` for dev. The
  `typecheck` script feeds `next typegen` throwaway URLs (types don't depend on the value).
- **Client config is `src/api-client.ts`:** `createBrowserApiClient` (same-origin `baseUrl: ''`, no
  env, providers only), `createStaticApiClient` / `createServerApiClient` (backend URL from
  `env().KOTODAMA_API_URL`; static is the ONLY client legal in the public tree — cookies would kill
  SSG; server is async + cookie-forwarding, design-bound, no backend auth yet).
- **`next.config.ts`:** absolute Turbopack root, `reactCompiler`, `/api/:path*` rewrite →
  `env().KOTODAMA_API_URL` (baked into the route manifest at build — build per env), `typedRoutes`.
  No `transpilePackages` — Turbopack auto-transpiles the workspace `@kotodama/*` packages.
- **Run:** `bun run --filter '@kotodama/web' {dev,build,start}`. **Dev runs on port 3001** (`next
  dev -p 3001`) — the core backend (`KOTODAMA_API_URL`) owns 3000, so 3001 is this app's origin
  (`KOTODAMA_SITE_URL`). Never `next build` to typecheck — `next typegen && tsc --noEmit`.

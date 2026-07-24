# apps/web — `@kotodama/web`

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
- **`globals.css`** imports `@kotodama/ui/styles.css` and `@source`s the ui package so Tailwind
  detects its classes; PostCSS via `@tailwindcss/postcss`.
- **Client config is one file — `src/api-client.ts`:** three factories — `createBrowserApiClient`
  (same-origin, providers only), `createStaticApiClient` (anon backend URL — the ONLY client legal in
  the public tree; cookies would kill SSG), `createServerApiClient` (async, authed tree; cookie
  forwarding is design-bound — no backend auth yet).
- **`next.config.ts`:** absolute Turbopack root, `transpilePackages` (the five `@kotodama/*`),
  `/api/:path*` rewrite → `KOTODAMA_API_URL` (inlined at BUILD time — build per env), `typedRoutes`.
- **Run:** `bun run --filter '@kotodama/web' {dev,build,start}`. Never `next build` to typecheck —
  `next typegen && tsc --noEmit`.

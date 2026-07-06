# apps/web — `@kotodama/web`

The web app: the render layer + the walking-skeleton word slice, on **Next 16 (App Router,
Turbopack)**. Zero-runtime Tailwind — so no Emotion/CSS-in-JS hydration bug (why Turbopack, not
`--webpack`; see the feature Change log).

- **May import:** `@kotodama/use-cases` (feature hooks), `@kotodama/store` (loaders/prefetch),
  `@kotodama/ui`, `@kotodama/api-client` (the client factories), TanStack Query, React/Next.
  **Never `@kotodama/repositories`** (raw fetchX — go through use-cases/store).
- **`app/`** is the App Router tree: `layout.tsx` (RSC root, imports `globals.css`) → `providers.tsx`
  (`'use client'`, next-themes) → `(public)/words/[language]/[word]/page.tsx` (RSC, SSG via
  `generateStaticParams` + `revalidate`; non-ASCII params decoded at the boundary).
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
- **NOTE (skeleton):** the word route renders a placeholder `WordCard`; the real data path (RSC
  prefetch → dehydrate → `useWord`) is the next task.

# apps/web — `@kotodama/web`

The web app: the render layer + the walking-skeleton word slice, on **hand-rolled Bun SSR over raw
TanStack Router** (no TanStack Start — D2). Vite is never the app bundler; `Bun.build` is.

- **May import:** `@kotodama/use-cases` (feature hooks), `@kotodama/store` (route loaders),
  `@kotodama/ui`, `@kotodama/api-client` (`createApiClient`, to construct + inject the client),
  TanStack Router/Query, React. **Never `@kotodama/repositories`** (raw fetchX — go through
  use-cases/store).
- **Intra-app edge:** `features/*` must not import the render layer (routes/router/entries/server).
- **SSR flow (owned code):** `server.ts` (`Bun.serve` + builds the client bundle on startup) →
  `entry-server.tsx` (per-request QueryClient + ApiClient + router over memory history →
  `router.load()` prefetches via `@kotodama/store` → `renderToReadableStream` → `dehydrate`) →
  `html-template.ts` inlines the dehydrated cache → `entry-client.tsx` (hydrate cache →
  `router.load()` from it → `hydrateRoot`). `App` provides the QueryClient + `ApiClientProvider`
  (same client the loader uses) + `UiProvider`. `scripts/prerender.ts` emits SSG artifacts.
- **Data source:** `KOTODAMA_API_URL` + global fetch against the real backend; otherwise the
  self-contained `data/demo-fetch` fixture (so `bun run dev` + tests work offline) — the ONLY
  non-real seam; the spine above it is real and typed.
- **Run:** `bun run --filter '@kotodama/web' {dev,build,prerender}`.

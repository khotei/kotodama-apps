# apps/web — `@kotodama/web`

The web app: the render layer + the walking-skeleton word slice, on **hand-rolled Bun SSR over raw
TanStack Router** (no TanStack Start — D2). Vite is never the app bundler; `Bun.build` is.

- **May import:** `@kotodama/fe-store`, `@kotodama/fe-ui`, TanStack Router/Query, React. **Never
  `@kotodama/fe-api-client` directly** (Biome ban — go through `fe-store`, AC-2).
- **Intra-app edge:** `features/*` must not import the render layer (routes/router/entries/server) —
  render composes features, not the reverse. There is no `src/repositories/` (folded into
  fe-api-client, S1).
- **SSR flow (owned code):** `server.ts` (`Bun.serve` + builds the client bundle on startup) →
  `entry-server.tsx` (per-request QueryClient + router over memory history → `router.load()`
  prefetches via the store → `renderToReadableStream` → `dehydrate`) → `html-template.ts` inlines
  the dehydrated cache → `entry-client.tsx` (hydrate cache → `router.load()` from it → `hydrateRoot`).
  The router loader prefetches so server and client hydrate the SAME cache — no waterfall, no
  mismatch. `scripts/prerender.ts` emits SSG artifacts.
- **Data source:** `KOTODAMA_API_URL` + global fetch against the real backend; otherwise the
  self-contained `data/demo-fetch` fixture (so `bun run dev` + tests work offline). The fixture is
  the ONLY non-real seam — the spine wiring above it is real and typed by the generated client.
- **Run:** `bun run --filter '@kotodama/web' {dev,build,prerender}`.

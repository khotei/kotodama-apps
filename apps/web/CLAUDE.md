# apps/web — `@kotodama/web`

> **Before any Next.js work, read the relevant doc under `node_modules/next/dist/docs/`** — Next
> bundles its docs there, version-matched to the installed 16.2.10; your training data lags the
> framework, so the bundled docs are the source of truth. Project invariants (RSC/SSG boundaries,
> the data path, SEO, Playwright-never-`--bun`) are in `.claude/rules/nextjs.md`.

The Next 16 render shell (App Router, Turbopack). On the `library-only-ui` branch the app is a
**single public library page on mock fixtures** — the design showcase, not a live-data wiring; the
word-slice route/loaders/poller are pruned. Zero-runtime Tailwind — so no Emotion/Turbopack
hydration bug (why Turbopack, not `--webpack`).

- **May import:** `@kotodama/ui` (all presentation) + `@kotodama/ui/fixtures` (design mocks),
  `@kotodama/platform/api-client`, React/Next. `@kotodama/core/{store,repositories}` are permitted but
  currently unused; `core/repositories` only ever under `src/server/**`.
- **`app/`** — App Router tree: `layout.tsx` (RSC root, imports `globals.css`) → `providers.tsx`
  (`'use client'`: next-themes) → `(public)/page.tsx` renders `<LibraryScreen>` from `@kotodama/ui`
  on `LIBRARY_VIEW_MOCK`. `robots.ts` + `sitemap.ts` at the root.
- **The one live wire:** `(public)/page.tsx` injects a Server Action — `requestWordBuild`
  (`src/server/words/word.actions.ts`, `'use server'`), bound and passed as `onRetry`. No loaders on
  this branch; reads would live in `src/server/**/*.loader.ts` (see `frontend-state.md`).
- **Client config `src/server/api-client.ts`** (`server-only`): `createStaticApiClient` /
  `createServerApiClient` (backend URL from `serverEnv().KOTODAMA_API_URL`; static is the ONLY client
  legal in the public tree — cookies kill SSG). No browser client, no `/api/*` rewrite.
- **Chrome:** `src/chrome/site-chrome.client.tsx` (`'use client'` nav/mode — `usePathname` + next-themes).
- **`globals.css`** = one line `@import "@kotodama/ui/styles.css"` (by package name via the ui
  `exports`); the ui entry `@source`s its own tree, so the app declares no paths. PostCSS via
  `@tailwindcss/postcss`.
- **Env comes from `@kotodama/platform/config`** (`serverEnv()`), never scattered `process.env.X ?? default`;
  server-side only. Repo-root `.env` (copy `.env.example`) loaded by `loadRootEnv()` in `next.config.ts`.
- **Run:** `bun run --filter '@kotodama/web' {dev,build,start}`. **Dev on port 4000** (the core backend
  owns 3000). Never `next build` to typecheck — `next typegen && tsc --noEmit`.

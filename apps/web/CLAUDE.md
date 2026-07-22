# apps/web — `@kotodama/web`

> **Before any Next.js work, read the relevant doc under `node_modules/next/dist/docs/`** — Next
> bundles its docs there, version-matched to the installed 16.2.10; your training data lags the
> framework, so the bundled docs are the source of truth. Project invariants (RSC/SSG boundaries,
> the data path, SEO, Playwright-never-`--bun`) are in `.claude/rules/nextjs.md`.

The web app: the render layer + the walking-skeleton word slice, on **Next 16 (App Router,
Turbopack)**. Zero-runtime Tailwind — so no Emotion/CSS-in-JS hydration bug (why Turbopack, not
`--webpack`; see the feature Change log).

- **May import:** `@kotodama/ui` (all presentation), `@kotodama/core/store` (the domain model),
  `@kotodama/platform/api-client` (the client factories), React/Next. **`@kotodama/core/repositories`**
  (raw fetchX) is allowed ONLY under `src/server/**` (the RSC data layer); render code goes through the
  `src/server` loaders.
- **`app/`** is the App Router tree: `layout.tsx` (RSC root, imports `globals.css`) → `providers.tsx`
  (`'use client'`: next-themes only) → `(public)/words/[language]/[word]/` `page.tsx` (RSC, SSG via
  `generateStaticParams` + `revalidate`; non-ASCII params decoded at the boundary) + `loading.tsx`
  (renders `WordLoadingView` from `@kotodama/ui`).
- **Data path (RSC → props → ui):** `page.tsx` calls `getWordState` (`src/server/words/word.loader.ts`
  — `server-only`, `React.cache`, STATIC client, `next.tags`) and passes the `WordStateModel | null`
  into `<WordScreen>` from `@kotodama/ui` (its `WordScreenView` mirrors the model, so tsc accepts the
  model directly — no runtime mapper). The loader NEVER throws (unreachable backend → `null`),
  so a backend-less `next build` prerenders the "not built yet" card. Mutations/revalidation live in
  `word.actions.ts` (`'use server'`). Import the app's own source via `@/*` (tsconfig path).
- **Polling:** the page mounts `<WordStatusPoller>` (a LOCAL `src/words/word-status-poller.client.tsx`
  island) while a word builds, **injecting** two bound Server Actions — `getWordStatus` (`poll`,
  `cache: 'no-store'`) + `refreshWordPage` (`onSettled`). The island calls `poll` each tick; on
  terminal, `onSettled` `revalidatePath`s so the RSC page re-renders the finished card. Both are
  serializable references — the browser never fetches the backend directly (no `/api` rewrite).
  `react-use` lives in `apps/web` — see `.claude/rules/react-use.md`.
- **SEO (same route):** `generateMetadata` + the page share the one `React.cache`-wrapped
  `getWordState` (one fetch/request). An inline JSON-LD `DefinedTerm` renders only when the word is
  ready; its `JSON.stringify` MUST `<`→`<`-escape (dangerouslySetInnerHTML does not) or a value
  breaks out of `<script>`. `metadataBase` (root layout, per-env) resolves the `opengraph-image.tsx`
  URL. Unready/absent word → `robots:{index:false}`.
- **`globals.css`** is one line — `@import "@kotodama/ui/styles.css"` (by package name, via the ui
  `exports`). The ui entry `@source`s its own tree, so the app declares no paths; PostCSS via
  `@tailwindcss/postcss`.
- **Env comes from `@kotodama/platform/config`** (`serverEnv()`), never scattered `process.env.X ?? default`.
  `serverSchema` validates on first access, so a missing required var throws once (SSG, metadata,
  metadata fail the build) — consumers use `serverEnv().X` directly, never a silent localhost.
  Read server-side only (loaders/actions/config); there is no browser client. The repo-root `.env`
  (copy `.env.example`) is loaded by `loadRootEnv()` in `next.config.ts`. The `typecheck` script
  feeds `next typegen` throwaway URLs (types don't depend on the value).
- **Client config is `src/server/api-client.ts`** (`server-only`): `createStaticApiClient` /
  `createServerApiClient` (backend URL from `serverEnv().KOTODAMA_API_URL`; static is the ONLY client
  legal in the public tree — cookies would kill SSG; server is async + cookie-forwarding,
  design-bound, no backend auth yet). No browser client — the browser never talks to the backend
  (reads are RSC loaders, polling is a Server Action), so there is no same-origin proxy.
- **`next.config.ts`:** `loadRootEnv()` at the top, absolute Turbopack root, `reactCompiler`,
  `env: clientEnv()` (the server→client bridge, empty today), `typedRoutes`. **No `/api/*` rewrite** —
  the browser never fetches the backend. No `transpilePackages` — Turbopack auto-transpiles the
  workspace `@kotodama/*` packages.
- **Run:** `bun run --filter '@kotodama/web' {dev,build,start}`. **Dev runs on port 4000** (`next
  dev -p 4000`) — the core backend (`KOTODAMA_API_URL`) owns 3000, so 4000 is this app's origin
  (`KOTODAMA_SITE_URL`). Never `next build` to typecheck — `next typegen && tsc --noEmit`.

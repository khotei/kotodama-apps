# apps/e2e — `@kotodama/e2e`

Playwright end-to-end tests for `@kotodama/web`. A **standalone workspace with no
Vitest** — a documented exception to the ≥1-test rule; its gate is `test:e2e`, not `test`.

- **Run:** `bun run --filter '@kotodama/e2e' test:e2e` → `bunx playwright test`. **NEVER `--bun`**
  (upstream closed Bun support — `--bun` hangs/segfaults, oven-sh/bun#8222). This is the one place
  Node is an accepted local/CI prerequisite.
- **`playwright.config.ts`** starts two `webServer`s: `fake-backend.ts` (Bun.serve, one succeeded
  word, typed off `schema.gen.ts`) and `e2e-app.ts` (polls the backend → `next build` → `next
  start`, so SSG prefetch sees the seeded word). `KOTODAMA_API_URL` feeds both build-time SSG and
  the app's `/api` rewrite. `workers:1`.
- **First spec** (`word-page.spec.ts`) uses the JS-free `request` fixture to assert the word content
  + JSON-LD `DefinedTerm` live in the raw SSR HTML (AC-9) — what a crawler with JS disabled sees.
- **Not in the Biome/tsc spine bans** — this is web-side test tooling, DOM-free at the type level
  (Playwright + Bun are node/bun-side), so it extends the base tsconfig with `node`/`bun-types`.

# apps/e2e — `@kotodama/e2e`

Playwright end-to-end tests for `@kotodama/web`. A **standalone workspace with no
Vitest** — a documented exception to the ≥1-test rule; its gate is `test:e2e`, not `test`.

- **Run:** `bun run --filter '@kotodama/e2e' test:e2e` → `bunx playwright test`. **NEVER `--bun`**
  (upstream closed Bun support — `--bun` hangs/segfaults, oven-sh/bun#8222). This is the one place
  Node is an accepted local/CI prerequisite.
- **No `webServer`.** You start the app + a real backend yourself (Next in dev/prod on any port,
  pointed at a live backend, with whatever env), THEN run the suite against it — `E2E_BASE_URL`
  points Playwright at the app (defaults to the dev port 4000). Nothing is faked or auto-launched;
  if the stack isn't up the run fails, which is the signal. `workers:1`.
- **Requires a real backend with the asserted word seeded + succeeded** (`言葉`). Because the
  definition is backend-generated (not fixed), the spec asserts STRUCTURE only.
- **First spec** (`word-page.spec.ts`) uses the JS-free `request` fixture to assert the word + a
  JSON-LD `DefinedTerm` live in the raw SSR HTML (AC-9) — what a crawler with JS disabled sees.
- **Not in the Biome/tsc spine bans** — this is web-side test tooling, DOM-free at the type level
  (Playwright + Bun are node/bun-side), so it extends the base tsconfig with `node`/`bun-types`.

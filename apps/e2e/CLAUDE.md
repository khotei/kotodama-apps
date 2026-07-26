# apps/e2e — `@kotodama/e2e`

Playwright e2e for `@kotodama/web`. A standalone workspace with **no Vitest** — a documented
exception to the ≥1-test rule; its gate is `test:e2e`, not `test`.

- **No `webServer`** — nothing is faked or auto-launched. You start the app + a **real backend**
  yourself, point `E2E_BASE_URL` at the app, then run the suite; a down stack fails the run, which
  is the signal.
- **Needs the asserted word (`言葉`) seeded + succeeded in that backend.** The definition is
  backend-generated, so the spec asserts STRUCTURE only.

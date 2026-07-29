---
paths:
  - "**/test/**"
  - "**/*.test.ts"
  - "**/*.test.tsx"
  - "**/*.stories.tsx"
  - "**/vitest.*.ts"
---

# Testing

Vitest + jsdom + `@testing-library/react`; matchers/auto-cleanup register in
`@kotodama/presets/vitest.setup.ts` (jest-dom types via each `--dom` tsconfig `types`). Run
commands: `tooling.md`.

- **Vitest 4 exits 0 on zero test files (verified)** — every workspace keeps ≥1 test; the gate
  won't tell you one is missing. Sanctioned exceptions: `apps/e2e` (gate `test:e2e`),
  `@kotodama/presets` (no `test` script).
- A trailing `(AC-n)` when a test maps to a feature AC — the one allowed provenance tag.
- Wire values from `@kotodama/core/factories` (`make*` — a schema regen breaks a factory at
  compile time, not a test at runtime); curated story content from `@kotodama/ui/fixtures`.

## Per layer (cover only the decisions the layer owns; fake the layer below)

- **repositories** — one success decode + one typed error via `vi.fn<typeof fetch>()` +
  `Response.json(...)`. No nock/msw.
- **platform leaves** — pin real `Intl` output (`en-GB`/`ru`).
- **core/words** — pure type derivation: nothing to unit-test until real logic lands
  (exhaustiveness = `satisfies Record<…>` at consumers).
- **apps/web mappers** — the unit-test locus, but only where the derivation EARNS one: a pure
  `<section>.mapper.ts` (time + locale injected) is split out and tested when the mapping is
  non-trivial (`word-of-the-day.mapper.ts` — frequency series + axis ticks). A trivial
  branch/delegate map (href + status note) stays inline in the container and skips the test —
  exhaustiveness is already a `satisfies Record<…>` canary at the copy site, not a runtime assert.
  The server data layer (loaders + containers) is NOT jsdom-tested — its proof is `next build` + e2e.
- **ui** — a Story IS the render test + a testing-library mount; ui owns the view-branch tests.
- **e2e** — Playwright vs a REAL backend you start yourself (`E2E_BASE_URL`); asserts JSON-LD
  STRUCTURE in raw SSR HTML, JS disabled (AC-9).

Deliberately untested: config scaffolding + the `@theme` token layer. Stopping short on purpose ⇒
one-line owner pointer at the site.

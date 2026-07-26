---
paths:
  - "**/test/**"
  - "**/*.test.ts"
  - "**/*.test.tsx"
  - "**/*.stories.tsx"
  - "**/vitest.*.ts"
---

# Testing

Vitest + jsdom + `@testing-library/react`. Matchers + auto-cleanup register in
`@kotodama/presets/vitest.setup.ts`; `tsc` sees them via the `@testing-library/jest-dom/vitest`
entry in each `--dom` tsconfig `types` (no ambient `.d.ts`). Run commands + the `--bun` /
no-aggregate-`vitest run` rules are in `tooling.md`.

- **Every workspace keeps ≥1 test** — `vitest run` exits 1 on zero files and fails the gate. The
  only exemptions: `apps/e2e` (Playwright, gate `test:e2e`) and `@kotodama/presets` (no `test`
  script; `--filter '*'` skips it).
- **Naming:** keep a trailing `(AC-n)` when a test maps to a feature AC `/sdd:verify` checks — the
  one allowed provenance tag.
- **Wire values come from `@kotodama/core/factories`** (`make*` + overrides, typed off the contract
  → a schema regen breaks a factory at compile time, not a test at runtime); curated story content
  from `@kotodama/ui/fixtures`.

## What each layer tests (each covers only the decisions it owns; higher layers fake the layer below)

- **store model** — the real logic: fully unit-tested, happy + each failure branch.
- **repositories** — one success decode + one typed error against `vi.fn<typeof fetch>()` resolving
  a `Response.json(...)`. No nock/msw; the generated types already prove the shape compiles.
- **apps/web slice** — one render through the package boundary as the app wires it (proves
  consumption; branch coverage lives in `ui`). The `server-only` loader and `.client.tsx` poll are
  NOT jsdom-tested — loader SSG resilience is proven by `next build` going green, the slice by e2e.
- **ui component** — a Story IS the render test (`@storybook/react-vite`) + a testing-library mount;
  **`ui` owns the view-branch tests** (render each view branch, assert the right card).
- **e2e** — Playwright vs a REAL backend you start yourself (no stub, no auto-launch; `E2E_BASE_URL`
  points at the app). First spec asserts the JSON-LD STRUCTURE in raw SSR HTML with JS disabled (AC-9).

**Deliberately untested:** config scaffolding (proven by CI green) + the `@theme` token layer (static
CSS, no logic). When you stop short on purpose, leave a one-line owner pointer at the site.

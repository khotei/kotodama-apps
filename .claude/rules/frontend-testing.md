---
paths:
  - "**/test/**"
  - "**/*.test.ts"
  - "**/*.test.tsx"
  - "**/*.stories.tsx"
  - "**/vitest.*.ts"
---

# Testing

- **Runner:** Vitest under `jsdom` + `@testing-library/react`. Import test helpers from `vitest`.
  Matchers (`toBeInTheDocument`, …) + auto-cleanup are registered once in
  `@kotodama/tooling/vitest.setup.ts`; `tsc` sees them via the `@testing-library/jest-dom/vitest`
  entry in each `--dom` workspace's tsconfig `types` (no ambient `.d.ts`).
- **Run:** `bun run test` (never `bun test`); per package `bun run --filter '@kotodama/<name>' test`.
  The `--bun` flag and the ban on aggregate multi-project `vitest run` are in
  `.claude/rules/tooling.md` — don't restructure the scripts without reading it.
- **Files:** `*.test.ts(x)` in each workspace's `test/` folder (sibling of `src/`), imported via
  `../src/…`; the folder is in tsconfig `include` so `tsc` checks tests. **Every workspace keeps
  ≥1 test** — `vitest run` exits 1 on zero test files, which would fail the gate. **The exceptions
  are `apps/e2e`** (Playwright — its gate is `test:e2e`) **and the config-only `@kotodama/tooling`**,
  which defines no `test` script at all; `bun run test` skips both because `--filter '*'` only
  targets packages that define a `test` script.
- **Playwright (`apps/e2e`) runs `bunx playwright test`, NEVER `--bun`** (oven-sh/bun#8222 —
  hangs/segfaults); Node is an accepted prerequisite there only. See `.claude/rules/tooling.md`.
- **Naming:** `describe` names the seam; `it` is a behaviour sentence; keep a trailing `(AC-n)` when
  a test maps to a feature AC `/sdd:verify` checks (the one allowed provenance tag).

## What each layer tests (DAMP over DRY; keep Arrange visible)

A test covers the decisions **its own layer owns**; a higher layer fakes the layer below and asserts
only what it *adds* — never re-asserting the lower layer's branch logic.

- **store model** (`narrowWordState`) — the real logic: fully unit-tested, happy + each failure
  branch.
- **store factory** — asserts the key + `staleTime` + that `select` routes through
  `narrowWordState` (fake the fetchX). One representative test; don't re-assert the model's branches.
- **repositories fetchX** — one success decode + one typed error shape against a Vitest-mocked
  `fetch` (`vi.fn<typeof fetch>()` resolving a `Response.json(...)`; no hand-rolled fake, no nock).
  The generated types already prove the response shape compiles — the type system is the test.
- **use-cases hook** — one integration test: render `useWord` under jsdom with a client whose
  `fetch` is a `vi.fn` (same mocking approach), assert it returns the narrowed state (exercises
  client → repositories → store `select` → `narrowWordState`).
- **the slice (`apps/web`)** — the load-bearing integration test: render the feature (`word-view`)
  under jsdom with a seeded query cache, assert the presentational component (Tailwind/shadcn,
  prop-driven) shows the word content typed by the generated client (no `any`).
- **e2e (`apps/e2e`)** — Playwright over `next build && next start` against a fake backend: the first
  spec asserts word content + JSON-LD in the raw SSR HTML with JS disabled (AC-9). Turbopack
  hydration cleanliness is a manual harness check (see the feature Change log), not a committed test.
- **ui component** — a Story IS the component's render test (`@storybook/react-vite`), plus a
  testing-library mount for assertions.

**Deliberately untested:** the config scaffolding (proven transitively by CI going green), the
`@theme` token layer (static CSS variables, no logic). When you stop short on purpose, leave a
one-line owner pointer at the site.

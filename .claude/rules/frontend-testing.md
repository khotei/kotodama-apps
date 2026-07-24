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

- **store model** (`@kotodama/core/store` — `narrowWordState`) — the real logic: fully unit-tested,
  happy + each failure branch.
- **repositories fetchX** (`@kotodama/core/repositories`) — one success decode + one typed error shape against a Vitest-mocked
  `fetch` (`vi.fn<typeof fetch>()` resolving a `Response.json(...)`; no hand-rolled fake, no nock).
  The generated types already prove the response shape compiles — the type system is the test.
- **the slice (`apps/web`)** — the app-consumption integration: render a `@kotodama/ui`
  component through the package boundary as the app wires it (one assertion — the package resolves +
  renders). Branch coverage lives in `ui`; the app just proves consumption. The `server-only`
  loader and the `.client.tsx` poll island aren't jsdom-unit-tested (server-only throws under jsdom;
  the poll is a browser side-effect + injected props) — the loader's SSG resilience is proven by
  `next build` going green, the slice by e2e.
- **e2e (`apps/e2e`)** — Playwright against a running app + a REAL backend (you start both; no stub,
  no auto-launch — `E2E_BASE_URL` points at the app): the first spec asserts the word + JSON-LD
  STRUCTURE in the raw SSR HTML with JS disabled (AC-9), not the backend-generated definition text.
  Turbopack hydration cleanliness is a manual harness check (see the feature Change log), not a
  committed test.
- **ui component** — a Story IS the component's render test (`@storybook/react-vite`), plus a
  testing-library mount for assertions. `ui` owns the view-branch tests: render a component like
  `WordScreen` under jsdom with its view prop (no query cache — data is RSC-resolved) and assert each
  branch maps to the right card.

**Deliberately untested:** the config scaffolding (proven transitively by CI going green), the
`@theme` token layer (static CSS variables, no logic). When you stop short on purpose, leave a
one-line owner pointer at the site.

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
  Matchers (`toBeInTheDocument`, …) + auto-cleanup are registered once in the root `vitest.setup.ts`;
  `tsc` sees them via `testing-matchers.d.ts` (included by every `--dom` workspace).
- **Run:** `bun run test` (never `bun test`); per package `bun run --filter '@kotodama/<name>' test`.
  The `--bun` flag and the ban on aggregate multi-project `vitest run` are in
  `@.claude/rules/tooling.md` — don't restructure the scripts without reading it.
- **Files:** `*.test.ts(x)` in each workspace's `test/` folder (sibling of `src/`), imported via
  `../src/…`; the folder is in tsconfig `include` so `tsc` checks tests. **Every workspace keeps
  ≥1 test** — `vitest run` exits 1 on zero test files, which would fail the gate.
- **Naming:** `describe` names the seam; `it` is a behaviour sentence; keep a trailing `(AC-n)` when
  a test maps to a feature AC `/sdd:verify` checks (the one allowed provenance tag).

## What each layer tests (DAMP over DRY; keep Arrange visible)

A test covers the decisions **its own layer owns**; a higher layer fakes the layer below and asserts
only what it *adds* — never re-asserting the lower layer's branch logic.

- **fe-core** — the real logic (`narrowWordState`): fully unit-tested, happy + each failure branch.
- **fe-store factory** — asserts the key + `staleTime` + that `select` routes through `fe-core`
  (fake the fetchX). One representative test; don't re-assert core's branches.
- **fe-api-client fetchX** — one success decode + one typed error shape against a fake `fetch`
  (the generated types already prove the response shape compiles — the type system is the test).
- **the slice (`apps/web`)** — the load-bearing integration test: render the feature under jsdom
  with a faked store, assert the Chakra component shows the word content typed by the generated
  client (no `any`). SSR/hydration is verified by its own harness (render → put in a jsdom
  container → `hydrateRoot`, assert zero recoverable mismatch).
- **fe-ui component** — a Story IS the component's render test (`@storybook/react-vite`), plus a
  testing-library mount for assertions.

**Deliberately untested:** the config scaffolding (proven transitively by CI going green),
`fe-tokens` build output (Style Dictionary is trusted), `fe-theme` (a Chakra config object). When
you stop short on purpose, leave a one-line owner pointer at the site.

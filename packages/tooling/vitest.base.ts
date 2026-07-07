import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineProject } from 'vitest/config'

// Shared Vitest project settings. Every workspace's one-line vitest.config.ts
// re-exports this, so test settings live in ONE place without a central package
// list — the project set is still implied by package.json#workspaces, and each
// workspace is run independently (see root `test` script + .claude/rules/tooling.md).
//
// Why per-package configs at all: a single `vitest run` over many `projects`
// was unreliable on Bun 1.3 + Vitest 3.2.x — it ran only ~9/16 and exited 0
// even on failure. Kept on Vitest 4 (not re-verified against that bug); running
// each workspace as its own `vitest run` (via `bun run --filter '*' test`)
// yields correct per-package exit codes, mirroring the `tsc` typecheck design.
export default defineProject({
  // The React plugin owns the JSX transform (automatic runtime), so tests use the
  // SAME transformer as dev — the canonical Vitest+React setup. Without it, the
  // bundler reads each workspace's tsconfig `jsx`, and apps/web sets `preserve`
  // (Next owns the transform), so JSX falls back to classic `React.createElement`
  // and renders die with "React is not defined".
  plugins: [react()],
  test: {
    // jsdom: the FE tiers + components are tested against a DOM. The agnostic
    // spine (api-client/core/repositories/store/use-cases) is DOM-free at TYPE
    // level (tsconfig.base.json has no "dom" lib — S2/V2), but its *tests* still
    // run under jsdom uniformly so a hook/feature test can render with
    // testing-library without a per-package environment override.
    environment: 'jsdom',
    // Tests live in each workspace's `test/` folder (mirroring `src/`), separate
    // from source. See `@.claude/rules/testing.md`.
    include: ['test/**/*.test.ts', 'test/**/*.test.tsx'],
    // `@testing-library/jest-dom` matchers (toBeInTheDocument, …) + automatic
    // cleanup between tests, registered once for every workspace. Resolved as an
    // absolute path off THIS file so it works no matter how deep the including
    // workspace sits (packages/* or apps/*).
    setupFiles: [fileURLToPath(new URL('./vitest.setup.ts', import.meta.url))],
  },
})

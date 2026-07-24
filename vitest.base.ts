import { fileURLToPath } from 'node:url'
import { defineProject } from 'vitest/config'

// Shared Vitest project settings. Every workspace's one-line vitest.config.ts
// re-exports this, so test settings live in ONE place without a central package
// list — the project set is still implied by package.json#workspaces, and each
// workspace is run independently (see root `test` script + .claude/rules/tooling.md).
//
// Why per-package configs at all: on Bun 1.3.10 + Vitest 3.2.x a single
// `vitest run` over many `projects` is unreliable — it runs only ~9/16 and
// exits 0 even on failure. Running each workspace as its own `vitest run` (via
// `bun run --filter '*' test`) sidesteps that and yields correct per-package
// exit codes, mirroring the `tsc` typecheck design.
export default defineProject({
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
    // A cold first SSR render / hydrate round-trip in the walking-skeleton slice
    // can exceed Vitest's 5s default on slower CI runners — raise the per-test
    // ceiling in one place.
    testTimeout: 30_000,
  },
})

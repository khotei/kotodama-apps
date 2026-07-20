import { defineConfig } from '@playwright/test'

// The e2e workspace has NO Vitest (a documented exception to the ≥1-test rule);
// Playwright is driven via `bunx playwright test` — NEVER `--bun` (upstream
// closed Bun support; `--bun` hangs/segfaults, oven-sh/bun#8222).
//
// No `webServer`: the app + a real backend are started by whoever runs the suite
// (Next in dev/prod on whatever port, pointed at a live backend, with whatever
// env). Playwright only drives the run against the already-running app — point it
// there via E2E_BASE_URL (defaults to the dev port). If nothing is up, the run
// fails, which is the intended signal.
const BASE_URL = process.env.E2E_BASE_URL ?? 'http://localhost:4000'

export default defineConfig({
  testDir: './e2e',
  testMatch: '**/*.spec.ts',
  fullyParallel: false,
  workers: 1,
  // HTML report (uploaded as a CI artifact); plain list locally.
  reporter: process.env.CI ? [['html', { open: 'never' }]] : 'list',
  use: { baseURL: BASE_URL },
})

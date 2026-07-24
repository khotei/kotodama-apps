import { defineConfig } from '@playwright/test'

// The e2e workspace has NO Vitest (a documented exception to the ≥1-test rule);
// Playwright is driven via `bunx playwright test` — NEVER `--bun` (upstream
// closed Bun support; `--bun` hangs/segfaults, oven-sh/bun#8222).
const FAKE_PORT = 4599
const APP_URL = 'http://localhost:3000'
const WORD_URL = `${APP_URL}/words/ja/${encodeURIComponent('言葉')}`

export default defineConfig({
  testDir: './e2e',
  testMatch: '**/*.spec.ts',
  fullyParallel: false,
  // CI serializes so the single Next server isn't contended.
  workers: 1,
  use: { baseURL: APP_URL },
  webServer: [
    {
      command: 'bun --bun e2e/fake-backend.ts',
      url: `http://127.0.0.1:${FAKE_PORT}/health`,
      reuseExistingServer: !process.env.CI,
      stdout: 'ignore',
    },
    {
      command: 'bun --bun e2e/e2e-app.ts',
      url: WORD_URL,
      reuseExistingServer: !process.env.CI,
      // build + start is slow — give it room on cold CI runners.
      timeout: 120_000,
      env: { KOTODAMA_API_URL: `http://127.0.0.1:${FAKE_PORT}` },
    },
  ],
})

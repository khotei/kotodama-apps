import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { config as loadDotenv } from 'dotenv'

// Repo root by a fixed offset from this file, so loading is cwd-independent (a
// filtered `bun run` starts in the package dir, not the repo root).
const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..')

/**
 * Loads the repo-root `.env` into `process.env` as a FALLBACK: a value already
 * present — a real exported var, or one injected by the deploy — always wins
 * (dotenv's default is no-override). A missing file (server, CI, container) is
 * not an error; dotenv is a no-op and we run on whatever the process provides.
 * Call this at an entrypoint (e.g. next.config) before any config is read.
 */
export function loadRootEnv(): void {
  loadDotenv({ path: join(repoRoot, '.env'), quiet: true })
}

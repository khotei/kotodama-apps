import { spawn } from 'node:child_process'
import { resolve } from 'node:path'

// The app webServer entry: wait for the fake backend, THEN `next build` (so SSG
// prefetch captures the seeded word) and `next start` in the foreground (so
// Playwright's webServer keeps the process alive). Kept separate from the fake
// backend so the ordering is explicit — a plain parallel webServer array can
// race the build ahead of the backend and prerender empty pages.
const FAKE = process.env.KOTODAMA_API_URL ?? 'http://127.0.0.1:4599'
const APP_DIR = resolve(import.meta.dirname, '../../web')

async function waitFor(url: string, timeoutMs = 30_000) {
  const deadline = Date.now() + timeoutMs
  while (Date.now() < deadline) {
    try {
      if ((await fetch(url)).ok) return
    } catch {
      // backend not up yet — keep polling
    }
    await new Promise((r) => setTimeout(r, 250))
  }
  throw new Error(`e2e-app: timed out waiting for ${url}`)
}

function run(args: string[]) {
  const child = spawn('bun', args, { cwd: APP_DIR, stdio: 'inherit', env: process.env })
  return new Promise<void>((res, rej) => {
    child.on('exit', (code) =>
      code === 0 ? res() : rej(new Error(`bun ${args.join(' ')} → ${code}`)),
    )
  })
}

await waitFor(`${FAKE}/health`)
await run(['--bun', 'next', 'build'])
// Foreground: this never resolves, so e2e-app.ts stays alive as the webServer.
await run(['--bun', 'next', 'start'])

import { fileURLToPath } from 'node:url'

// Bundle the client entry for the browser with Bun's bundler (`bun build`,
// production path — Vite is NOT the app bundler, D2). React + all deps are
// bundled to a single ESM file the SSR server / prerendered pages load for
// hydration.
export async function buildClient(outdir: string): Promise<string> {
  const result = await Bun.build({
    entrypoints: [fileURLToPath(new URL('./entry-client.tsx', import.meta.url))],
    outdir,
    target: 'browser',
    minify: true,
    naming: '[dir]/entry-client.[ext]',
  })
  if (!result.success) {
    for (const log of result.logs) console.error(log)
    throw new Error('client bundle failed')
  }
  return `${outdir}/entry-client.js`
}

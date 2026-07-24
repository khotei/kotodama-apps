import { fileURLToPath } from 'node:url'
import { buildClient } from './build-client'
import { demoFetch } from './data/demo-fetch'
import { renderPage } from './entry-server'
import { renderDocument } from './html-template'

// The hand-rolled Bun SSR server (D2): `Bun.serve()` renders every navigation
// through the TanStack Router tree and streams back a hydratable document. It
// also serves the client bundle it builds on startup (Bun's fullstack HMR is
// SPA-only, so SSR dev owns its own build step).
//
// Data source: with KOTODAMA_API_URL set, the real backend over global fetch;
// otherwise the self-contained demo fixture, so `bun run dev` works offline.

const OUTDIR = fileURLToPath(new URL('../dist/client', import.meta.url))
const clientJsPath = await buildClient(OUTDIR)

const backendUrl = process.env.KOTODAMA_API_URL
const port = Number(process.env.PORT ?? 3000)

const server = Bun.serve({
  port,
  async fetch(req) {
    const url = new URL(req.url)

    if (url.pathname === '/entry-client.js') {
      return new Response(Bun.file(clientJsPath), {
        headers: { 'content-type': 'text/javascript; charset=utf-8' },
      })
    }
    if (url.pathname === '/favicon.ico') return new Response(null, { status: 204 })

    const { html, dehydratedState } = await renderPage(
      url.pathname,
      backendUrl ? { baseUrl: backendUrl, fetch: globalThis.fetch } : { fetch: demoFetch },
    )
    const doc = renderDocument({ appHtml: html, dehydratedState, clientScript: '/entry-client.js' })
    return new Response(doc, { headers: { 'content-type': 'text/html; charset=utf-8' } })
  },
})

console.log(
  `kotodama web SSR on http://localhost:${server.port}` +
    (backendUrl ? ` (backend: ${backendUrl})` : ' (demo fixture)'),
)

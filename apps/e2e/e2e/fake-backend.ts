import type { operations } from '@kotodama/api-client'

// A minimal stand-in for the kotodama words API — just enough for the SSR spec:
// one succeeded word so the page renders real content + JSON-LD. Typed against
// the generated contract so a wire-shape drift surfaces at tsc; the `word` body
// carries only the fields the render layer reads (the full DefinedTerm content
// is irrelevant to the assertion), so it's cast through `unknown`.
type WordState = NonNullable<
  operations['words.getWordState']['responses'][200]['content']['application/json']
>

const READY = {
  status: 'succeeded',
  word: {
    word: '言葉',
    language: 'ja',
    status: 'succeeded',
    coreDefinition: 'Language as living speech.',
  },
} as unknown as WordState

const PORT = Number(process.env.FAKE_BACKEND_PORT ?? 4599)

Bun.serve({
  port: PORT,
  fetch(req) {
    const { pathname } = new URL(req.url)
    if (pathname === '/health') return new Response('ok')
    if (pathname.endsWith('/state')) return Response.json(READY)
    return Response.json(null)
  },
})

console.log(`fake backend listening on :${PORT}`)

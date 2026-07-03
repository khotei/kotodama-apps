// A self-contained data source for the walking skeleton: a fake `fetch` that
// answers the word-state endpoint with a typed fixture, so the foundation
// proves the full spine (createApiClient → fetchWordState → narrowWordState →
// store → feature → render) WITHOUT a running backend. In a real deployment
// this is swapped for the global fetch against KOTODAMA_API_URL — the only
// change is which fetch the client is built with (server.ts).

function fixtureBody(url: string): unknown {
  // Path shape: /api/words/{language}/{word}/state — echo the requested word so
  // the rendered page reflects the URL.
  const match = url.match(/\/api\/words\/([^/]+)\/([^/]+)\/state/)
  const language = match?.[1] ?? 'en'
  const word = decodeURIComponent(match?.[2] ?? 'lumen')
  return {
    status: 'succeeded',
    word: {
      word,
      language,
      status: 'succeeded',
      coreDefinition: `A demo definition for “${word}”, served by the skeleton fixture.`,
    },
  }
}

export const demoFetch: typeof fetch = (async (input: Request | string | URL) => {
  const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url
  const body = url.includes('/state') ? fixtureBody(url) : null
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  })
}) as unknown as typeof fetch

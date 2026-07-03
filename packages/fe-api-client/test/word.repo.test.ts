import { describe, expect, it } from 'vitest'
import { ApiError, createApiClient, fetchWord, searchWords } from '../src/index'

// A fake fetch lets the fetchX functions be exercised without a backend. The
// generated types already prove the response SHAPE compiles (the type system is
// the test), so these stay thin: one success decode + one error surface.
// Bun's `typeof fetch` carries extra members (`.preconnect`) a plain function
// lacks, so the fake is cast through `unknown` — the client only ever calls it.
function fakeFetch(status: number, body: unknown): typeof fetch {
  const fn = async () =>
    new Response(JSON.stringify(body), {
      status,
      headers: { 'content-type': 'application/json' },
    })
  return fn as unknown as typeof fetch
}

describe('fetchWord', () => {
  it('returns the decoded word body on a 2xx, typed by the generated client', async () => {
    const client = createApiClient({
      baseUrl: 'http://test',
      // Only the fields the assertion reads — the runtime does not validate the
      // full entity, and the generated type guards the compile-time shape.
      fetch: fakeFetch(200, { word: 'lumen', language: 'en', status: 'succeeded' }),
    })

    const word = await fetchWord(client, 'en', 'lumen')

    expect(word?.word).toBe('lumen')
    expect(word?.language).toBe('en')
  })

  it('throws an ApiError carrying the status + body on a non-2xx (409)', async () => {
    const client = createApiClient({
      baseUrl: 'http://test',
      fetch: fakeFetch(409, { _tag: 'WordNotReadyError' }),
    })

    const err = await fetchWord(client, 'en', 'lumen').catch((e) => e)

    expect(err).toBeInstanceOf(ApiError)
    expect(err.status).toBe(409)
    expect(err.body).toEqual({ _tag: 'WordNotReadyError' })
  })
})

describe('searchWords', () => {
  it('sends page + limit and returns the paginated envelope (AC-5 contract)', async () => {
    let sentUrl = ''
    // openapi-fetch calls fetch with a Request object — read its `.url`.
    const capturingFetch = (async (input: Request) => {
      sentUrl = input.url
      return new Response(
        JSON.stringify({ items: [], pagination: { page: 1, limit: 20, total: 0 } }),
        { status: 200, headers: { 'content-type': 'application/json' } },
      )
    }) as unknown as typeof fetch
    const client = createApiClient({ baseUrl: 'http://test', fetch: capturingFetch })

    const result = await searchWords(client, 'en', { page: 1, limit: 20 })

    expect(sentUrl).toContain('page=1')
    expect(sentUrl).toContain('limit=20')
    expect(result.items).toEqual([])
  })
})

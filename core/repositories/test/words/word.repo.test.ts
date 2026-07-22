import { ApiError, createApiClient } from '@kotodama/platform/api-client'
import { describe, expect, it, vi } from 'vitest'
import { fetchWord, searchWords } from '../../src/index'

// A mocked fetch (vi.fn<typeof fetch>()) exercises the fetchX functions without a
// backend; the generated types already prove the response SHAPE compiles (the type
// system is the test), so these stay thin: one success decode + one error surface.

describe('fetchWord', () => {
  it('returns the decoded word body on a 2xx, typed by the generated client', async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValue(Response.json({ word: 'lumen', language: 'en', status: 'succeeded' }))
    const client = createApiClient({ baseUrl: 'http://test', fetch: fetchMock })

    const word = await fetchWord(client, 'en', 'lumen')

    expect(word?.word).toBe('lumen')
    expect(word?.language).toBe('en')
  })

  it('throws an ApiError carrying the status + body on a non-2xx (409)', async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValue(Response.json({ _tag: 'WordNotReadyError' }, { status: 409 }))
    const client = createApiClient({ baseUrl: 'http://test', fetch: fetchMock })

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
    const fetchMock = vi.fn<typeof fetch>().mockImplementation(async (input) => {
      sentUrl = (input as Request).url
      return Response.json({ items: [], pagination: { page: 1, limit: 20, total: 0 } })
    })
    const client = createApiClient({ baseUrl: 'http://test', fetch: fetchMock })

    const result = await searchWords(client, 'en', { page: 1, limit: 20 })

    expect(sentUrl).toContain('page=1')
    expect(sentUrl).toContain('limit=20')
    expect(result.items).toEqual([])
  })
})

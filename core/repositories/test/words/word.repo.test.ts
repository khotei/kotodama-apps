import { makeWord } from '@kotodama/core/factories'
import { ApiError, createApiClient } from '@kotodama/platform/api-client'
import { describe, expect, it, vi } from 'vitest'
import {
  fetchMostLookedUp,
  fetchWord,
  fetchWordCounts,
  fetchWordsOfTheDay,
  searchWords,
} from '../../src/index'

// A mocked fetch (vi.fn<typeof fetch>()) exercises the fetchX functions without a
// backend; the factory-built payload is a fully-typed wire value, so a contract
// change breaks this test at compile time. These stay thin: one success decode +
// one error surface.

describe('fetchWord', () => {
  it('returns the decoded word body on a 2xx, typed by the generated client', async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValue(Response.json(makeWord({ word: 'lumen', language: 'en' })))
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

describe('fetchWordCounts', () => {
  it('returns the decoded counts body on a 2xx, forwarding the status filter (AC-6)', async () => {
    let sentUrl = ''
    const fetchMock = vi.fn<typeof fetch>().mockImplementation(async (input) => {
      sentUrl = (input as Request).url
      return Response.json({ total: 3, pending: 1, running: 0, succeeded: 2, failed: 0 })
    })
    const client = createApiClient({ baseUrl: 'http://test', fetch: fetchMock })

    const counts = await fetchWordCounts(client, 'en', { status: 'succeeded' })

    expect(sentUrl).toContain('/api/words/en/counts')
    expect(sentUrl).toContain('status=succeeded')
    expect(counts.total).toBe(3)
    expect(counts.succeeded).toBe(2)
  })

  it('throws an ApiError carrying the status + body on a non-2xx (500)', async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValue(Response.json({ message: 'boom' }, { status: 500 }))
    const client = createApiClient({ baseUrl: 'http://test', fetch: fetchMock })

    const err = await fetchWordCounts(client, 'en').catch((e) => e)

    expect(err).toBeInstanceOf(ApiError)
    expect(err.status).toBe(500)
  })
})

describe('fetchMostLookedUp / fetchWordsOfTheDay', () => {
  it('reads recent succeeded words: status=succeeded + page/limit on the URL (AC-10)', async () => {
    const urls: string[] = []
    const fetchMock = vi.fn<typeof fetch>().mockImplementation(async (input) => {
      urls.push((input as Request).url)
      return Response.json({ items: [], pagination: { page: 1, limit: 4, total: 0, pageCount: 0 } })
    })
    const client = createApiClient({ baseUrl: 'http://test', fetch: fetchMock })

    await fetchMostLookedUp(client, 'en', { page: 1, limit: 4 })
    await fetchWordsOfTheDay(client, 'en', { page: 1, limit: 4 })

    expect(urls).toHaveLength(2)
    for (const url of urls) {
      expect(url).toContain('/api/words/en/search')
      expect(url).toContain('status=succeeded')
      expect(url).toContain('page=1')
      expect(url).toContain('limit=4')
    }
  })
})

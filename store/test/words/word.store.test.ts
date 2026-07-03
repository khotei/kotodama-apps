import type { ApiClient, WordStateView } from '@kotodama/api-client'
import { describe, expect, it } from 'vitest'
import { wordQueryOptions } from '../../src/index'

// The store test asserts only what the factory ADDS — the key, the staleTime,
// and that `select` routes through core. fetchWordState's behaviour and
// narrowWordState's branch logic are covered in their own packages; we do not
// re-assert them here. The client is a stub — `select` never touches it.
const stubClient = {} as ApiClient

describe('wordQueryOptions', () => {
  it('builds a stable query key + staleTime for a word', () => {
    const options = wordQueryOptions(stubClient, 'en', 'lumen')

    expect(options.queryKey).toEqual(['words', 'en', 'lumen', 'state'])
    expect(options.staleTime).toBe(5 * 60 * 1000)
  })

  it('routes a fetched state through core.narrowWordState via select', () => {
    const options = wordQueryOptions(stubClient, 'en', 'lumen')
    const succeeded = {
      status: 'succeeded',
      word: { word: 'lumen', language: 'en', status: 'succeeded' },
    } as unknown as WordStateView

    const selected = options.select?.(succeeded)

    expect(selected).toEqual({
      kind: 'ready',
      word: { word: 'lumen', language: 'en', status: 'succeeded' },
    })
  })

  it('maps an absent word (null) to null through select', () => {
    const options = wordQueryOptions(stubClient, 'en', 'lumen')

    expect(options.select?.(null)).toBeNull()
  })
})

import { createApiClient } from '@kotodama/api-client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it } from 'vitest'
import { ApiClientProvider, useWord } from '../../src/index'

// A fixture fetch answers the state endpoint, so the hook is exercised through
// the real spine (client → repositories.fetchWordState → store.select →
// core.narrowWordState) without a backend.
function fixtureFetch(): typeof fetch {
  const fn = async () =>
    new Response(
      JSON.stringify({
        status: 'succeeded',
        word: { word: 'lumen', language: 'en', status: 'succeeded', coreDefinition: 'light' },
      }),
      { status: 200, headers: { 'content-type': 'application/json' } },
    )
  return fn as unknown as typeof fetch
}

describe('useWord', () => {
  it('fetches through the spine and returns the narrowed ready state', async () => {
    const client = createApiClient({ baseUrl: 'http://test', fetch: fixtureFetch() })
    const queryClient = new QueryClient()
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>
        <ApiClientProvider client={client}>{children}</ApiClientProvider>
      </QueryClientProvider>
    )

    const { result } = renderHook(() => useWord('en', 'lumen'), { wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual({
      kind: 'ready',
      word: { word: 'lumen', language: 'en', status: 'succeeded', coreDefinition: 'light' },
    })
  })
})

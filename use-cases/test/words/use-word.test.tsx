import { createApiClient } from '@kotodama/api-client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { ApiClientProvider, useWord } from '../../src/index'

describe('useWord', () => {
  it('fetches through the spine and returns the narrowed ready state', async () => {
    // A mocked fetch answers the state endpoint, so the hook runs through the real
    // spine (client → repositories.fetchWordState → store.select → core.narrowWordState)
    // without a backend.
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      Response.json({
        status: 'succeeded',
        word: { word: 'lumen', language: 'en', status: 'succeeded', coreDefinition: 'light' },
      }),
    )
    const client = createApiClient({ baseUrl: 'http://test', fetch: fetchMock })
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

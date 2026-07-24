import { createApiClient } from '@kotodama/api-client'
import { wordQueryOptions } from '@kotodama/store'
import { UiProvider } from '@kotodama/ui'
import { ApiClientProvider } from '@kotodama/use-cases'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { demoFetch } from '../src/data/demo-fetch'
import { WordPage } from '../src/features/word/word-page'

// The load-bearing integration test (AC-5, AC-7): exercises the full composition
// `api-client → repositories → store → use-cases(useWord) → render` under jsdom.
// The client is real (createApiClient) over the demo fixture; data is typed by
// the generated client end to end — no `any`.
describe('WordPage (walking-skeleton slice)', () => {
  it('renders the word content fetched through the spine', async () => {
    const queryClient = new QueryClient()
    const apiClient = createApiClient({ fetch: demoFetch, baseUrl: 'http://demo' })
    // Prefetch so the query resolves synchronously (mirrors the SSR loader).
    await queryClient.prefetchQuery(wordQueryOptions(apiClient, 'en', 'lumen'))

    render(
      <QueryClientProvider client={queryClient}>
        <ApiClientProvider client={apiClient}>
          <UiProvider>
            <WordPage language="en" word="lumen" />
          </UiProvider>
        </ApiClientProvider>
      </QueryClientProvider>,
    )

    expect(await screen.findByRole('heading', { name: 'lumen' })).toBeInTheDocument()
    expect(screen.getByText(/demo definition for “lumen”/)).toBeInTheDocument()
  })
})

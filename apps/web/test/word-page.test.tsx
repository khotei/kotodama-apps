import { createApiClient, wordQueryOptions } from '@kotodama/fe-store'
import { UiProvider } from '@kotodama/fe-ui'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { demoFetch } from '../src/data/demo-fetch'
import { WordPage } from '../src/features/word/word-page'

// The load-bearing integration test (AC-5, AC-7): exercises the full composition
// `store → feature → render` under jsdom. The client is real (createApiClient),
// its transport is the demo fixture, and the data is typed by the generated
// client end to end — no `any`, no hand-written response shape.
describe('WordPage (walking-skeleton slice)', () => {
  it('renders the word content fetched through the store + narrowed by fe-core', async () => {
    const queryClient = new QueryClient()
    const apiClient = createApiClient({ fetch: demoFetch, baseUrl: 'http://demo' })
    // Prefetch so useQuery resolves synchronously (mirrors the SSR loader).
    await queryClient.prefetchQuery(wordQueryOptions(apiClient, 'en', 'lumen'))

    render(
      <QueryClientProvider client={queryClient}>
        <UiProvider>
          <WordPage apiClient={apiClient} language="en" word="lumen" />
        </UiProvider>
      </QueryClientProvider>,
    )

    expect(await screen.findByRole('heading', { name: 'lumen' })).toBeInTheDocument()
    expect(screen.getByText(/demo definition for “lumen”/)).toBeInTheDocument()
  })
})

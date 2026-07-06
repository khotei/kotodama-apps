import { createApiClient } from '@kotodama/api-client'
import { ApiClientProvider } from '@kotodama/use-cases'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it } from 'vitest'
import { WordView } from '../app/(public)/words/[language]/[word]/word-view'

// Seed the RAW wire entity under the same key `wordQueryOptions` builds; the
// hook's `select` (narrowWordState) runs on read, so this exercises the whole
// client seam store→use-case→view without a backend. staleTime Infinity keeps
// the seeded data fresh so no background fetch fires during the assertion.
function wrap(queryClient: QueryClient) {
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <ApiClientProvider client={createApiClient({ baseUrl: '' })}>{children}</ApiClientProvider>
    </QueryClientProvider>
  )
}

function seededClient() {
  return new QueryClient({
    defaultOptions: { queries: { staleTime: Number.POSITIVE_INFINITY } },
  })
}

describe('WordView', () => {
  it('maps an unready state to a building status', () => {
    const queryClient = seededClient()
    queryClient.setQueryData(['words', 'ja', '言葉', 'state'], { status: 'running', stages: [] })

    render(<WordView language="ja" word="言葉" />, { wrapper: wrap(queryClient) })

    expect(screen.getByText('Building…')).toBeInTheDocument()
  })

  it('shows a not-built message when the word is absent (null)', () => {
    const queryClient = seededClient()
    queryClient.setQueryData(['words', 'ja', 'missing', 'state'], null)

    render(<WordView language="ja" word="missing" />, { wrapper: wrap(queryClient) })

    expect(screen.getByText('This word has not been built yet.')).toBeInTheDocument()
  })
})

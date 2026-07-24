'use client'

import { ApiClientProvider } from '@kotodama/use-cases'
import { QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'next-themes'
import { type ReactNode, useState } from 'react'
import { createBrowserApiClient } from '@/src/api-client'
import { getQueryClient } from './get-query-client'

export function Providers({ children }: { children: ReactNode }) {
  // Browser singleton here (getQueryClient's isServer branch never runs client-
  // side); stable across renders so the cache survives.
  const queryClient = getQueryClient()
  // Same-origin transport (Next rewrites proxy /api/* to the backend). Built
  // once via useState so a re-render never swaps the client under the hooks.
  const [apiClient] = useState(createBrowserApiClient)

  return (
    <QueryClientProvider client={queryClient}>
      <ApiClientProvider client={apiClient}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          {children}
        </ThemeProvider>
      </ApiClientProvider>
    </QueryClientProvider>
  )
}

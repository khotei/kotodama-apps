import { defaultShouldDehydrateQuery, environmentManager, QueryClient } from '@tanstack/react-query'

// A fresh QueryClient PER REQUEST on the server (a shared one leaks one user's
// cache into another's SSR) and a lazily-created singleton in the browser (a new
// one on every render would drop the cache on each Suspense-driven remount). The
// App Router guidance (bare `isServer` is deprecated → `environmentManager.isServer()`).
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { staleTime: 60 * 1000 },
      // Also dehydrate still-pending queries so a future streamed (un-awaited)
      // prefetch hydrates; our awaited prefetch dehydrates as `success` anyway.
      dehydrate: {
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) || query.state.status === 'pending',
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined

export function getQueryClient() {
  if (environmentManager.isServer()) return makeQueryClient()
  browserQueryClient ??= makeQueryClient()
  return browserQueryClient
}

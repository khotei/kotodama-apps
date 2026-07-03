import type { ApiClient } from '@kotodama/api-client'
import { UiProvider } from '@kotodama/ui'
import { ApiClientProvider } from '@kotodama/use-cases'
import { type QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from '@tanstack/react-router'
import type { AppRouter } from './router'

// The shared provider shell rendered identically on server and client (a
// divergence here is the classic hydration-mismatch source). The QueryClient
// cache is populated out of band — the SSR entry via router loaders, the client
// entry via imperative hydration. ApiClientProvider injects the transport client
// the use-case hooks read.
export function App({
  router,
  queryClient,
  apiClient,
}: {
  router: AppRouter
  queryClient: QueryClient
  apiClient: ApiClient
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <ApiClientProvider client={apiClient}>
        <UiProvider>
          <RouterProvider router={router} />
        </UiProvider>
      </ApiClientProvider>
    </QueryClientProvider>
  )
}

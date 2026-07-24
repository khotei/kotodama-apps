import { UiProvider } from '@kotodama/fe-ui'
import { type QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from '@tanstack/react-router'
import type { AppRouter } from './router'

// The shared provider shell rendered identically on server and client (a
// divergence here is the classic hydration-mismatch source). The QueryClient
// cache is populated out of band — the SSR entry via router loaders, the client
// entry via imperative hydration — so no HydrationBoundary is needed inside.
export function App({ router, queryClient }: { router: AppRouter; queryClient: QueryClient }) {
  return (
    <QueryClientProvider client={queryClient}>
      <UiProvider>
        <RouterProvider router={router} />
      </UiProvider>
    </QueryClientProvider>
  )
}

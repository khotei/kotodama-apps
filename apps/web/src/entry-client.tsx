import { createApiClient } from '@kotodama/fe-store'
import { type DehydratedState, hydrate, QueryClient } from '@tanstack/react-query'
import { createBrowserHistory } from '@tanstack/react-router'
import { hydrateRoot } from 'react-dom/client'
import { App } from './app'
import { demoFetch } from './data/demo-fetch'
import { createAppRouter } from './router'

// The client entry: rehydrate the query cache the server serialized, resolve the
// router's loaders FROM that cache (so the first client render matches the
// server HTML — no hydration mismatch, AC-13), then hydrateRoot.
declare global {
  interface Window {
    __DEHYDRATED__?: DehydratedState
  }
}

async function main() {
  const root = document.getElementById('root')
  if (!root) throw new Error('#root not found')

  const queryClient = new QueryClient()
  if (window.__DEHYDRATED__) hydrate(queryClient, window.__DEHYDRATED__)

  // demoFetch keeps the skeleton self-contained; staleTime means the hydrated
  // data is fresh, so no refetch fires on load anyway.
  const apiClient = createApiClient({ fetch: demoFetch, baseUrl: 'http://demo' })
  const router = createAppRouter({
    history: createBrowserHistory(),
    context: { queryClient, apiClient },
  })

  // Resolve loaders from the hydrated cache before the first render.
  await router.load()

  hydrateRoot(root, <App router={router} queryClient={queryClient} />)
}

void main()

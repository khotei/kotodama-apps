import { createApiClient } from '@kotodama/api-client'
import { type DehydratedState, dehydrate, QueryClient } from '@tanstack/react-query'
import { createMemoryHistory } from '@tanstack/react-router'
import { renderToReadableStream } from 'react-dom/server'
import { App } from './app'
import { demoFetch } from './data/demo-fetch'
import { createAppRouter } from './router'

// The hand-rolled SSR core (D2): build a per-request QueryClient + ApiClient +
// router over a memory history, resolve loaders (`router.load()` → the store
// prefetch populates the cache), render the tree with
// `renderToReadableStream`, then dehydrate the cache so the client hydrates the
// exact same data. No TanStack Start; this is owned code.

export interface RenderResult {
  html: string
  dehydratedState: DehydratedState
}

export async function renderPage(
  url: string,
  options: { fetch?: typeof fetch; baseUrl?: string } = {},
): Promise<RenderResult> {
  const queryClient = new QueryClient()
  const apiClient = createApiClient({
    fetch: options.fetch ?? demoFetch,
    baseUrl: options.baseUrl ?? 'http://demo',
  })
  const router = createAppRouter({
    history: createMemoryHistory({ initialEntries: [url] }),
    context: { queryClient, apiClient },
  })

  await router.load()

  const stream = await renderToReadableStream(
    <App router={router} queryClient={queryClient} apiClient={apiClient} />,
  )
  await stream.allReady
  const html = await new Response(stream).text()

  return { html, dehydratedState: dehydrate(queryClient) }
}

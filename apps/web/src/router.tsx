import type { ApiClient } from '@kotodama/api-client'
import { type Language, wordQueryOptions } from '@kotodama/store'
import type { QueryClient } from '@tanstack/react-query'
import {
  createRootRouteWithContext,
  createRoute,
  createRouter,
  Outlet,
  type RouterHistory,
} from '@tanstack/react-router'
import { WordPage } from './features/word/word-page'

// The render layer: raw TanStack Router (no TanStack Start — D2). One route tree
// shared by the SSR entry and the client entry; each supplies its own history +
// context (a QueryClient + an ApiClient). The word route's loader PREFETCHES via
// the store's queryOptions so the server render finds data in cache and the
// client hydrates from the same cache — no waterfall, no mismatch.

export interface RouterContext {
  queryClient: QueryClient
  apiClient: ApiClient
}

const rootRoute = createRootRouteWithContext<RouterContext>()({
  component: () => <Outlet />,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => (
    <main>
      <h1>Kotodama</h1>
      <p>
        Walking-skeleton foundation. Try <a href="/words/en/lumen">/words/en/lumen</a>.
      </p>
    </main>
  ),
})

const wordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/words/$language/$word',
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(
      // params come from the URL as `string`; the backend rejects an unknown
      // language at decode, so the cast is the boundary trust point.
      wordQueryOptions(context.apiClient, params.language as Language, params.word),
    ),
  component: WordRouteComponent,
})

function WordRouteComponent() {
  const { language, word } = wordRoute.useParams()
  // The client is injected app-wide via ApiClientProvider (entry-*), so the
  // feature reads it from context rather than a prop.
  return <WordPage language={language as Language} word={word} />
}

const routeTree = rootRoute.addChildren([indexRoute, wordRoute])

export function createAppRouter(options: { history: RouterHistory; context: RouterContext }) {
  return createRouter({
    routeTree,
    history: options.history,
    context: options.context,
  })
}

export type AppRouter = ReturnType<typeof createAppRouter>

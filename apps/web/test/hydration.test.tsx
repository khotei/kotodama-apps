import { createApiClient } from '@kotodama/fe-store'
import { hydrate, QueryClient } from '@tanstack/react-query'
import { createBrowserHistory } from '@tanstack/react-router'
import { act } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { App } from '../src/app'
import { demoFetch } from '../src/data/demo-fetch'
import { renderPage } from '../src/entry-server'
import { createAppRouter } from '../src/router'

// AC-13: the server-rendered word page hydrates in a browser without a mismatch.
// Renders on the "server" (renderPage), drops the markup into jsdom, then
// hydrates the SAME tree from the dehydrated cache and asserts React reported no
// recoverable (hydration-mismatch) error and the content survived.
describe('SSR hydration', () => {
  beforeEach(() => {
    window.history.pushState({}, '', '/words/en/lumen')
  })
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('hydrates the SSR word page with no mismatch (AC-13)', async () => {
    const { html, dehydratedState } = await renderPage('/words/en/lumen')

    const container = document.createElement('div')
    container.innerHTML = html
    document.body.appendChild(container)

    const queryClient = new QueryClient()
    hydrate(queryClient, dehydratedState)
    const apiClient = createApiClient({ fetch: demoFetch, baseUrl: 'http://demo' })
    const router = createAppRouter({
      history: createBrowserHistory(),
      context: { queryClient, apiClient },
    })
    await router.load()

    const recoverableErrors: unknown[] = []
    await act(async () => {
      hydrateRoot(container, <App router={router} queryClient={queryClient} />, {
        onRecoverableError: (error) => recoverableErrors.push(error),
      })
    })

    const hydrationMismatches = recoverableErrors.filter((e) =>
      String((e as Error)?.message ?? e).match(/hydrat|did not match/i),
    )
    expect(hydrationMismatches).toEqual([])
    expect(container.textContent).toContain('lumen')
  })
})

import { createApiClient } from '@kotodama/api-client'

// THE single place that answers "how is the transport client configured per
// environment." Three factories for three trees; nothing else in apps/web calls
// createApiClient directly.

const BACKEND_URL = process.env.KOTODAMA_API_URL ?? 'http://localhost:3000'

/** Browser client: same-origin (`/api/*` is proxied to the backend by Next
 *  rewrites). Cookies ride along automatically; only used in client providers. */
export function createBrowserApiClient() {
  return createApiClient({ baseUrl: '' })
}

/** Static client: the anonymous backend URL. The ONLY client legal in the public
 *  tree — it reads no cookies, so it never makes a route dynamic (which would
 *  silently kill SSG). */
export function createStaticApiClient() {
  return createApiClient({ baseUrl: BACKEND_URL })
}

/** Server client for the authed `(app)` tree — built per request so it can
 *  forward the caller's cookies once auth lands. Async to mirror `await
 *  cookies()`; the cookie-forwarding middleware is design-bound (no backend auth
 *  yet), so this is minimal for now. */
export async function createServerApiClient() {
  return createApiClient({ baseUrl: BACKEND_URL })
}

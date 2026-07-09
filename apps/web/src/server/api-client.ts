import 'server-only'
import { createApiClient } from '@kotodama/api-client'
import { serverEnv } from '@kotodama/config'

// THE server data-layer's transport factories. `server-only` makes a client-bundle
// import a BUILD error, so the browser can never reach these (or the backend URL).
// Two clients, not three: the anonymous static client for the public tree and the
// per-request cookie-forwarding client for the authed tree. There is no browser
// factory — the browser never talks to the backend at all; all backend access is
// server-side (loaders + actions), so there is no same-origin proxy to configure.

/** Static client: the anonymous backend URL. The ONLY client legal in the public
 *  tree — it reads no cookies, so it never makes a route dynamic (which would kill SSG). */
export function createStaticApiClient() {
  return createApiClient({ baseUrl: serverEnv().KOTODAMA_API_URL })
}

/** Per-request client for the authed `(app)` tree — async to mirror `await cookies()`
 *  once cookie-forwarding lands (design-bound: no backend auth yet). */
export async function createServerApiClient() {
  return createApiClient({ baseUrl: serverEnv().KOTODAMA_API_URL })
}

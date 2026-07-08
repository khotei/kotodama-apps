import createClient, { type Client, type Middleware } from 'openapi-fetch'
import type { paths } from './schema.gen'

// The transport half of the package: a configured openapi-fetch instance over
// the generated `paths`. Platform-agnostic (plain fetch — bun-types supplies
// fetch/Request/Response, so this compiles with a DOM-free tsconfig and a
// future apps/mobile reuses it unchanged). No Effect on the frontend (§8): the
// client is Promise-based and surfaces no typed error channel.

export type ApiClientOptions = {
  /** Backend origin, e.g. `http://localhost:3000` or a deployed URL. */
  baseUrl?: string
  /** Injectable fetch — the SSR server and tests pass their own. */
  fetch?: typeof fetch
}

// The single middleware seam: where auth headers, tracing, and error
// normalization will attach. Minimal for the foundation — it only pins the
// Accept header so every call negotiates JSON.
const jsonMiddleware: Middleware = {
  onRequest({ request }) {
    request.headers.set('accept', 'application/json')
    return request
  },
}

/**
 * Build a typed API client bound to a base URL. Prefer this factory over a
 * module-level singleton so the SSR server, the browser entry, and tests each
 * supply their own base URL / fetch without shared mutable state.
 */
export function createApiClient(options: ApiClientOptions = {}): Client<paths> {
  const client = createClient<paths>({
    baseUrl: options.baseUrl ?? process.env.KOTODAMA_API_URL ?? 'http://localhost:3000',
    fetch: options.fetch,
  })
  client.use(jsonMiddleware)
  return client
}

export type ApiClient = Client<paths>

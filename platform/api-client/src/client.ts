import createClient, { type Client, type ClientOptions, type Middleware } from 'openapi-fetch'
import type { paths } from './schema.gen'

// The transport half of the package: a configured openapi-fetch instance over
// the generated `paths`. Platform-agnostic (plain fetch — bun-types supplies
// fetch/Request/Response, so this compiles with a DOM-free tsconfig and a
// future apps/mobile reuses it unchanged). No Effect on the frontend (§8): the
// client is Promise-based and surfaces no typed error channel.

export type ApiClientOptions = {
  /** Backend origin, injected by the caller — `''` for the same-origin browser
   *  client, the resolved backend URL for the server clients. Required: this leaf
   *  reads no env, so a forgotten origin is a compile error, not a silent default. */
  baseUrl: string
  /** Injectable fetch — the SSR server and tests pass their own. */
  fetch?: typeof fetch
  /** Default headers attached to every request — the per-request identity seam:
   *  each runtime injects its own way (the server forwards a Cookie, a native
   *  app a bearer token). Omitted = anonymous. openapi-fetch's own type, not
   *  `HeadersInit` — the DOM-free tsconfig has no DOM lib. */
  headers?: ClientOptions['headers']
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
export function createApiClient({ baseUrl, fetch, headers }: ApiClientOptions) {
  const client = createClient<paths>({ baseUrl, fetch, headers })
  client.use(jsonMiddleware)
  return client
}

export type ApiClient = Client<paths>

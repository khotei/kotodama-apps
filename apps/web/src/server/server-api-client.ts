import 'server-only'
import { type ApiClientOptions, createApiClient } from '@kotodama/platform/api-client'
import { serverEnv } from '@kotodama/platform/config'

/**
 * The ONE server transport factory — anonymous by default, so a bare call is
 * safe anywhere in the statically generated public tree. A per-request caller
 * injects its own identity at the call site
 * (`createServerApiClient({ headers: { cookie: (await cookies()).toString() } })`),
 * so the render-dynamifying act — `cookies()` — sits visibly in the caller,
 * where the public tree bans `next/headers` outright (Biome).
 *
 * `server-only` makes a client-bundle import a BUILD error: the browser never
 * talks to the backend (no browser factory, no same-origin proxy — by design).
 */
export function createServerApiClient(init?: Pick<ApiClientOptions, 'headers'>) {
  return createApiClient({ baseUrl: serverEnv().KOTODAMA_API_URL, ...init })
}

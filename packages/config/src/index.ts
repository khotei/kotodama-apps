import * as z from 'zod'

export { loadRootEnv } from './load-root-env'

// The env the app needs, validated in ONE place. Requiredness is declared per
// field (required by default; mark a genuinely optional var `.optional()` and
// handle the undefined at its use site). serverEnv() validates the whole schema
// on first access — a missing or invalid required var throws HERE, once, not a
// silent undefined surfacing at some call site downstream.
const serverSchema = z.object({
  KOTODAMA_API_URL: z.url(),
  KOTODAMA_SITE_URL: z.url(),
})

// NEXT_PUBLIC_* only — the vars safe to inline into the browser bundle. Empty
// today: the browser API client is same-origin, so nothing is exposed. To add a
// public var, declare it here AND forward it through `env` in next.config.ts —
// that `env` key is the single server -> client bridge (it inlines the literal
// value at build; a runtime read never reaches the browser bundle).
const clientSchema = z.object({})

let serverCache: z.infer<typeof serverSchema> | undefined
let clientCache: z.infer<typeof clientSchema> | undefined

/** Server env, validated once against serverSchema and memoized. A missing or
 *  invalid required var throws (ZodError) on first access. */
export function serverEnv() {
  serverCache ??= serverSchema.parse(process.env)
  return serverCache
}

/** Browser-safe env (NEXT_PUBLIC_*), validated and memoized. */
export function clientEnv() {
  clientCache ??= clientSchema.parse(process.env)
  return clientCache
}

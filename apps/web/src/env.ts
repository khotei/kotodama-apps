import * as z from 'zod'

// The ONE place the web app reads process.env. Everything else imports `env()` —
// no scattered `process.env.X ?? default`. Validated + memoized on first call; a
// missing or non-URL value throws HERE, at build (SSG, metadata, and the rewrites
// proxy all touch it), never a silent localhost default that surfaces in prod.
//
// Server-only by construction: the browser client is same-origin (`baseUrl: ''`)
// and never calls env(), so process.env being empty in the browser is never hit.
// Keep it lazy (a function, not a top-level `const env = schema.parse(...)`) so
// importing this module in a file that also holds the browser factory stays safe.
const schema = z.object({
  KOTODAMA_API_URL: z.url(),
  KOTODAMA_SITE_URL: z.url(),
})

let cached: z.infer<typeof schema> | undefined

export function env() {
  cached ??= schema.parse(process.env)
  return cached
}

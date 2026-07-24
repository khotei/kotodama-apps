# packages/config — `@kotodama/config`

The single home for environment variables: one optional Zod schema over `process.env`,
plus the repo-root `.env` loader. Mirrors kotodama-core's `@kotodama/config`.

- **May import:** externals only (`zod`, `dotenv`) + Node builtins. It is an agnostic
  **base leaf importable by any tier** (like `api-client`) — the one place env keys live.
  It imports nothing internal and pulls no DOM.
- **`serverEnv()` / `clientEnv()`** — validated, memoized reads. `serverSchema` declares
  each var's requiredness (required by default; `.optional()` for a genuinely optional one).
  `serverEnv()` validates the WHOLE schema on first access, so a missing required var throws
  once — consumers use the validated value directly, no per-site checks. `clientEnv()` covers
  `NEXT_PUBLIC_*` only (empty today — the browser client is same-origin); a new public var is
  auto-forwarded to the bundle via `env: clientEnv()` in `next.config.ts`.
- **`loadRootEnv()`** — loads the repo-root `.env` as a **fallback** under `process.env`
  (real/exported/deploy-injected vars win; no file is not an error). Call it once at an
  entrypoint (`next.config.ts`) before config is read. There is no `--env-file` flag.

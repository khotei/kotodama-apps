# use-cases — `@kotodama/use-cases`

Platform-agnostic React feature hooks (mirrors the backend `use-cases/`) + the transport-client
context. **No DOM, no Chakra** (tsc-enforced: jsx is on for the context provider, but the base lib
has no `"dom"`, so a `document`/`window` use fails `tsc`). Reused by any React app; the web
rendering that consumes these lives in `apps/web`.

- **May import:** `@kotodama/store` (queryOptions), `@kotodama/core`, `@kotodama/api-client` (types),
  `@tanstack/react-query`, `react`. **Not** `repositories`/the client transport directly, not the
  design system, not `apps/*`.
- **Imported by:** `apps/web` (its feature components call these hooks).
- **`useWord(language, word)`** reads the client from `ApiClientProvider` and returns the
  TanStack Query result (data already narrowed by the store's select → core).

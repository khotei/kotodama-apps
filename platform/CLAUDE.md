# platform — `@kotodama/platform`

The agnostic **base** in one package (no DOM): the two leaves every tier stands on, subpath-exported
so each is a distinct entry point (importing one never pulls the other). Imports nothing internal.

- **`./api-client`** (`@kotodama/platform/api-client`) — transport: the `openapi-fetch` client
  (`createApiClient({ baseUrl, fetch })`, injected — reads no env) + the generated `schema.gen`
  (raw `operations`/`paths`) + `ApiError`/`unwrap`. `gen-api.ts` (the `gen:api` script,
  Biome-exempt) live-fetches the backend's OpenAPI and reuses `../config`'s `loadRootEnv`; it is a
  build script, not part of the typecheck.
- **`./config`** (`@kotodama/platform/config`) — env: `serverEnv()`/`clientEnv()` (Zod-validated,
  memoized reads; `serverSchema` validates the whole schema on first access, so a missing required
  var throws once) + `loadRootEnv()` (loads the repo-root `.env` as a fallback under `process.env`;
  real/exported vars win). `clientEnv()` covers `NEXT_PUBLIC_*` only. Reads env server-side only.

- **Imported by:** every tier — `core` (the client + `operations`), `apps/web` (client factories +
  `serverEnv`), and `ui` reads `./api-client` **type-only** (the wire contract). Never imports
  `core`/`ui`/`apps` (Biome-enforced leaf).

# packages/fe-api-client — `@kotodama/fe-api-client`

The base of the platform-agnostic spine: **transport + access**, one package split
as *files, not layers* (S1 folded the former `repositories` layer in here). A future
`apps/mobile` reuses it unchanged — it is DOM-free (plain `fetch`, no React, no Chakra),
enforced by `tsconfig.base.json` having no `"dom"` lib.

- **May import:** `openapi-fetch` + its own generated `schema.gen.ts`. **Nothing internal** —
  it is the spine base (Biome-enforced).
- **Imported by:** `fe-core` (types only), `fe-store` (the fetchX functions). **Never** by
  `apps/web` directly — components/routes reach the API only through `fe-store` (AC-2).
- **`schema.gen.ts` is GENERATED, never hand-edited** — `bun run gen:api` live-fetches the
  backend's `GET {KOTODAMA_API_URL}/api/openapi.json` and runs `openapi-typescript` (D4/AC-4).
  CI fails the drift gate on a dirty diff. It is excluded from Biome so formatting can't perturb it.
- **`createApiClient({ baseUrl, fetch })`** — an openapi-fetch instance + JSON middleware. A
  factory, not a singleton: the SSR server, the browser entry, and tests each pass their own
  base URL / fetch.
- **`fetchWord` / `fetchWordState` / `searchWords`** (`src/repositories/word.repo.ts`) — bare
  async access functions returning plain Promises of generated types; the ONLY code that speaks
  path-strings. They throw `ApiError(status, body)` on a non-2xx (no Effect, no typed error
  channel — §8). `searchWords` sends `page`/`limit` as required wire strings.

# packages/api-client — `@kotodama/api-client`

Pure transport: the openapi-fetch client factory + the generated contract types. The base of the
platform-agnostic spine; a future desktop/native app reuses it unchanged. DOM-free (plain `fetch`,
no React) — enforced by the base tsconfig having no `"dom"` lib.

- **May import:** `openapi-fetch` + its own generated `schema.gen.ts`. **Nothing internal** (leaf).
- **Imported by:** `core` + `repositories` (types), `repositories` (the client type), `apps/web`
  (`createApiClient`, to construct + inject the client). The fetchX access functions are NOT here —
  they live in `@kotodama/repositories`.
- **`schema.gen.ts` is GENERATED, never hand-edited** — `bun run gen:api` live-fetches
  `{KOTODAMA_API_URL}/api/openapi.json` and runs `openapi-typescript` (D4/AC-4). CI fails the drift
  gate on a dirty diff; it is Biome-excluded so formatting can't perturb it.
- **`createApiClient({ baseUrl, fetch })`** — an openapi-fetch instance + JSON middleware. A factory,
  not a singleton: the SSR server, the browser entry, and tests each pass their own base URL / fetch.

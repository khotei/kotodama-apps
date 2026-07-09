# packages/api-client — `@kotodama/api-client`

Pure transport: the openapi-fetch client factory, the raw generated `operations`/`paths`, and the
`ApiError` + `unwrap` result helper. The base of the platform-agnostic spine; a future
desktop/native app reuses it unchanged. DOM-free (plain `fetch`, no React) — enforced by the base
tsconfig having no `"dom"` lib.

- **May import:** `openapi-fetch` + its own generated `schema.gen.ts`. **Nothing internal** (leaf).
- **Imported by:** `repositories` (the `ApiClient` type + raw `operations`, which it projects into
  the `*Entity` contract types), `store` (the `ApiClient` type), `apps/web` (`createApiClient`, to
  construct + inject the client). The fetchX functions + the contract types are NOT here — they live
  in `@kotodama/repositories`.
- **`ApiError` + `unwrap` live here** (the result→throw seam is transport-level); every tier catches
  `ApiError` from `@kotodama/api-client`, not from `repositories`.
- **`schema.gen.ts` is GENERATED, never hand-edited** — the generator `gen-api.ts` lives HERE
  (co-located with its output); it live-fetches `{KOTODAMA_API_URL}/api/openapi.json` and runs
  `openapi-typescript` (D4/AC-4). Run it via `bun run gen:api` (root delegates to this package's
  script). CI fails the drift gate on a dirty diff; it is Biome-excluded so formatting can't perturb it.
  The build script is the ONE exception to the leaf rule below — it reuses `@kotodama/config`'s
  `loadRootEnv` (Biome-exempted for `gen-api.ts` only) so it targets the same backend as the app.
- **`createApiClient({ baseUrl, fetch })`** — an openapi-fetch instance + JSON middleware. A factory,
  not a singleton: the SSR server, the browser entry, and tests each pass their own base URL / fetch.
  **`baseUrl` is required and this leaf's LIBRARY reads NO env** — the app resolves the origin from
  its own validated `serverEnv()` and injects it (`''` for the same-origin browser client); a future
  `apps/mobile` has no `KOTODAMA_API_URL`, so a default here would couple the leaf to Next.

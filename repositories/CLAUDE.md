# repositories — `@kotodama/repositories`

The data-access tier (mirrors the backend `repositories/`): bare `fetchX` functions over the
transport client, returning plain Promises of generated types. The ONLY code that speaks
path-strings. Platform-agnostic (no DOM, no React) — reused by any app.

- **May import:** `@kotodama/api-client` (the client type + contract types). Nothing else internal.
- **Imported by:** `store` (its `queryOptions` `queryFn` calls these). Never by components directly.
- **`fetchWord` / `fetchWordState` / `searchWords`** take the `client` as first arg; throw
  `ApiError(status, body)` on a non-2xx (no typed error channel). `searchWords` sends `page`/`limit`
  as required wire strings.

# repositories — `@kotodama/repositories`

The data-access tier (mirrors the backend `repositories/`): bare `fetchX` functions over the
transport client + the contract **entity types** (`*Entity`, in `.entity.ts`) projected off the
generated `operations`. The ONLY code that speaks path-strings; owns the wire vocabulary.
Platform-agnostic (no DOM, no React) — reused by any app.

- **May import:** `@kotodama/api-client` (the `ApiClient` type + raw `operations`). Nothing else internal.
- **Imported by:** `store` (fetchX for `queryFn` + the `*Entity` types + `Language`). Never by
  components directly.
- **Owns the entity types** (`WordEntity`, `WordStateEntity`, …) under the `*Entity` suffix; shared
  value types (`Language`, `JobStatus`) stay plain. See `.claude/rules/naming.md`.
- **`fetchWord` / `fetchWordState` / `searchWords`** take the `client` as first arg; throw
  `ApiError` (defined in `@kotodama/api-client`) on a non-2xx (no typed error channel). `searchWords`
  sends `page`/`limit` as required wire strings.

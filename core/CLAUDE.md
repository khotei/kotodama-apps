# core — `@kotodama/core`

The agnostic **domain spine** in one package (no DOM, no React-render) — the reuse unit a future
native app shares. Two layers as folders, subpath-exported so the entity→model boundary stays
greppable AND Biome-enforceable; a new domain slots in as a `src/<domain>/` folder, never a new
package.

- **`./repositories`** (`@kotodama/core/repositories`) — bare `fetchX` functions over the transport
  client + the contract **entity types** (`*Entity`, `.entity.ts`) projected off the generated
  `operations`. The ONLY code that speaks path-strings; owns the wire vocabulary. `fetchWord` /
  `fetchWordState` / `searchWords` take the `client` first and throw `ApiError` on non-2xx (no typed
  error channel). Shared value types (`Language`, `JobStatus`) stay plain.
- **`./store`** (`@kotodama/core/store`) — the domain **model**: `narrowWordState` collapses the wire
  union (`WordStateEntity`) into the tagged `WordStateModel` the render layer switches on; exposes
  `WordBuildStatus` for the poll island; re-exports `Language` so consumers need not reach into
  `/repositories`. No queries — reads are RSC, this tier is pure model.

- **May import:** `@kotodama/platform/api-client` (the `ApiClient` type + raw `operations`). Direction is
  Biome-enforced: `store` may import `repositories`, never the reverse; neither imports `ui`/`apps`.
- **Imported by:** `apps/web/src/server` (loaders narrow here). Never by components — `ui` is
  prop-driven and reads the wire contract type-only.

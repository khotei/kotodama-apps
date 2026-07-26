# core — `@kotodama/core`

The agnostic domain spine (`@kotodama/core/{repositories,store}`). Layer roles + import direction
live in `frontend-layering.md`, `frontend-state.md`, `naming.md` — not restated.

- **`./factories` is a separate subpath on purpose:** it isolates faker (a devDependency Biome bans
  everywhere else) so no shipped-code graph can import it. These are **test-only** wire builders —
  curated Storybook/design content lives in `@kotodama/ui/fixtures` instead.

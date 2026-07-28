# core — `@kotodama/core`

The agnostic domain spine (`@kotodama/core/{repositories,words}`). Layer roles + import direction
live in `frontend-architecture.md`, `nextjs.md`, `naming.md` — not restated.

- **The wire union IS the model.** `core/words` `.model.ts` files derive domain types off the
  contract with `Extract`/`Exclude` over the `status` literal (`ReadyListWord`, `UnreadyStages`);
  **never reintroduce a re-tagging narrow layer** (`kind: 'ready' | 'unready'` wrappers) —
  consumers branch on `status === 'succeeded'`, with exhaustiveness pinned by
  `satisfies Record<…>` canaries at the consumer.
- **`./factories` is a separate subpath on purpose:** it isolates faker (a devDependency Biome bans
  everywhere else) so no shipped-code graph can import it. These are **test-only** wire builders —
  curated Storybook/design content lives in `@kotodama/ui/fixtures` instead.

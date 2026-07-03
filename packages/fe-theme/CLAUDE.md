# packages/fe-theme — `@kotodama/fe-theme`

The Chakra `createSystem` config over `fe-tokens`' semantic tokens. Web-only (Chakra is DOM-bound),
but consumes ONLY the neutral semantic contract, so a native `ui` can re-implement the same intents.

- **May import:** `@kotodama/fe-tokens` + `@chakra-ui/react`. Not the spine, not `fe-ui`, not `apps/*`.
- **Imported by:** `fe-ui` (+ Storybook, `apps/web` via `fe-ui`'s provider).
- **Why a separate package** (not folded into `fe-ui`): the semantic-token contract IS the web↔native
  seam, and both `fe-ui` and Storybook consume it. Keep it a config object with no logic — visual
  coverage is the Storybook story, not a unit test.

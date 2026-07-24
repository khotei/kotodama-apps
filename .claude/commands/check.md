---
description: Run lint + typecheck + tests and report failures
---

Run the full local quality gate and report results concisely.

1. `bun run lint` (Biome)
2. `bun run tsc` (`bun run --filter '*' typecheck`)
3. `bun run test` (`bun run --filter '*' test` — per-workspace `bun --bun vitest run`, NOT `bun test`)

For each step report PASS/FAIL. If any fail, show the specific errors (file:line + message) and stop — do not attempt fixes unless asked. If all pass, say so in one line.

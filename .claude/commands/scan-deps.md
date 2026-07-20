---
description: Verify no forbidden cross-layer imports exist
---

Verify the tier gradients (see `@.claude/rules/frontend-layering.md`) are intact.

1. Run `bun run lint` — Biome's `style/noRestrictedImports` per-glob overrides fail on any
   forbidden import: `api-client` or `ui` importing anything internal (leaves); an agnostic tier
   (`core`/`repositories`/`store`) importing `ui`/`use-cases`/`apps/*`; a tier importing upward (e.g.
   `core` → `store`); `use-cases` importing `next`/`repositories`/`config` (it must stay Next-free);
   or `apps/web` render code importing `@kotodama/repositories` directly (allowed only under
   `apps/web/src/server/**`, the RSC data layer).
2. Run `bun run tsc` — the DOM-free `tsconfig.base.json` is the *primary* web↔native enforcer: any
   `document`/`window`/react-dom/Chakra leak into an agnostic tier is a compile error before Biome runs.

Report any violation with file:line and which rule it breaks. If clean, confirm both gradients hold.

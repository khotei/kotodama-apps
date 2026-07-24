---
description: Verify no forbidden cross-layer imports exist
---

Verify the tier gradients (see `@.claude/rules/frontend-layering.md`) are intact.

1. Run `bun run lint` — Biome's `style/noRestrictedImports` per-glob overrides fail on any
   forbidden import: `platform` importing anything internal (base leaf); the agnostic spine
   (`platform`/`core`) importing `ui`/`apps/*`; `core/repositories` importing `core/store` (the
   `@kotodama/core/<layer>` chain is one-way — `store` may import `repositories`, never the reverse);
   `ui` importing `@kotodama/core` or `@kotodama/platform/config` (it takes data via props, reading only
   `platform/api-client` type-only); or `apps/web` render code importing `@kotodama/core/repositories`
   directly (allowed only under `apps/web/src/server/**`, the RSC data layer, which also bans `ui`).
2. Run `bun run tsc` — the DOM-free `tsconfig.base.json` is the *primary* web↔native enforcer: any
   `document`/`window`/react-dom leak into the agnostic spine (`platform`/`core`) is a compile error
   before Biome runs.

Report any violation with file:line and which rule it breaks. If clean, confirm both gradients hold.

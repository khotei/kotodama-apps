---
description: Verify no forbidden cross-layer imports exist
---

Verify the two import gradients (see `@.claude/rules/frontend-layering.md`) are intact.

1. Run `bun run lint` — Biome's `style/noRestrictedImports` per-glob overrides fail on any
   forbidden import: `fe-tokens` importing anything internal; a spine package (`fe-api-client`,
   `fe-core`, `fe-store`) importing the web design-system (`fe-theme`/`fe-ui`) or `apps/*`;
   `apps/web` importing `@kotodama/fe-api-client` directly (bypassing `fe-store`); or a
   `features/*` file importing the render layer (routes/router/entries/server).
2. Run `bun run tsc` — the DOM-free `tsconfig.base.json` is the *primary* web↔native enforcer: any
   `document`/`window`/react-dom leak into a spine package is a compile error before Biome runs.

Report any violation with file:line and which rule it breaks. If clean, confirm both gradients hold.

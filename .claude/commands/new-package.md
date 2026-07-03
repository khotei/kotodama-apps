---
description: Scaffold a new @kotodama/<name> workspace in the correct layer
argument-hint: <layer>/<name> [--dom]  e.g. packages/fe-metrics or apps/mobile --dom
---

Scaffold a new workspace at `$ARGUMENTS`, following the existing conventions.

The mechanical scaffolder is `scripts/new-package.ts` — run it, then adjust deps:

1. **Validate the layer + platform.** The target must be under `apps/`, a top-level tier
   (`core`/`repositories`/`store`/`use-cases`), or `packages/`. Confirm the intended dependencies
   respect `@.claude/rules/frontend-layering.md`. Decide `--dom`: pass it ONLY for a web workspace
   that renders (apps/web, packages/ui). OMIT it for the platform-agnostic tiers
   (core / repositories / store / packages/api-client) so a stray `document`/`window`/react-dom
   import is a `tsc` error (S2/V2 — the DOM-free tsconfig is the primary web↔native enforcer).
   `use-cases` is DOM-free but hand-authored with `jsx` for its provider (scaffold, then add jsx).
2. **Run the scaffolder:** `bun --bun scripts/new-package.ts <layer>/<name> [--dom]`. It emits
   `package.json` (`@kotodama/<flattened-name>`, `private`, `exports → ./src/index.ts`, and the
   REQUIRED `bun --bun`-prefixed `typecheck`/`test` scripts the root aggregators enumerate),
   `tsconfig.json` (DOM-free by default, or DOM+jsx+@types/react under `--dom`), a one-line
   `vitest.config.ts` re-exporting the root base, `src/index.ts`, `test/smoke.test.ts`, and a
   `CLAUDE.md` stub.
3. **Add dependencies** via `catalog:<group>` (externals) and `workspace:*` (internal), only those
   the layer is allowed to use per the layering rule. A `--dom` package that uses React needs
   `@types/react` in its devDependencies (its tsconfig lists it in `types`).
4. **No root-config edit needed** — the single source of truth is `package.json#workspaces`
   (`apps/*`, `packages/*`); `bun run tsc`/`test` enumerate via `--filter '*'`, so a folder matching
   the glob is picked up automatically. Just confirm it matches.
5. **Replace the smoke test + fill the CLAUDE.md** (role + who may import it + import boundaries).
6. Run `bun install`, then `bun run check` and `bun run --filter '@kotodama/<name>' test`. Report results.

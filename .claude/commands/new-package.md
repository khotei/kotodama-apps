---
description: Scaffold a new @kotodama/<name> workspace in the correct layer
argument-hint: <path> [--dom]  e.g. apps/mobile --dom or infra/metrics
---

Scaffold a new workspace at `$ARGUMENTS`, writing the files directly (no scaffolder script), following
the existing conventions.

Steps:
1. **Validate the target.** A new WORKSPACE is a folder matching a `package.json#workspaces` glob:
   under `apps/`, `infra/`, or a new leaf beside `core`/`platform`/`ui`. **A new domain is NOT a new
   workspace** — it is a `src/<domain>/` folder under a `core` layer (or a new subpath on `core`/
   `platform`); use this command only for a genuinely new package. Confirm the intended dependencies
   respect `@.claude/rules/frontend-architecture.md` (one-way chain; `platform`/`ui` are leaves). Decide
   `--dom`: pass it for a web workspace that renders (apps/web, ui). OMIT it for the platform-agnostic
   packages (`core`, `platform`) so a stray `document`/`window`/react-dom import is a `tsc` error —
   the DOM-free base tsconfig is the primary web↔native enforcer.
2. **package.json** — `"name": "@kotodama/<flattened-name>"` (nested folders flatten with a dash, see
   `@.claude/rules/naming.md`), `"version": "0.0.0"`, `"private": true`, `"type": "module"`,
   `main`/`types`/`exports` → `./src/index.ts`. **Always add `"@kotodama/presets": "workspace:*"` to
   `devDependencies`** — it supplies the shared tsconfig/vitest presets consumed by specifier. Add other
   deps via `catalog:<group>` (externals) + `workspace:*` (internal), only those the layer may use.
   **Scripts must include `"typecheck": "bun --bun tsc --noEmit"` and `"test": "bun --bun vitest run"`** —
   the root aggregators (`bun run tsc`/`test` = `--filter '*'`) enumerate workspaces, so a missing script
   silently drops the package from that gate. The **`bun --bun` prefix is required** (the tsc/vitest bins
   carry a node shebang; see `.claude/rules/tooling.md`). A `--dom` package that renders also needs
   `@types/react` (+ `@types/react-dom`) in devDependencies.
3. **tsconfig.json** — `extends` the shared preset by specifier (depth-independent, no `../` juggling):
   `"@kotodama/presets/tsconfig.base.json"` for the agnostic default, or
   `"@kotodama/presets/tsconfig.dom.json"` for `--dom` (it adds `lib:["dom",…]`). Set
   `compilerOptions.outDir: "dist"`; for `--dom` also `"jsx": "react-jsx"` +
   `"types": ["bun-types", "@types/react", "@testing-library/jest-dom/vitest"]` — the jest-dom entry
   makes its matchers visible to `tsc` (there is NO ambient `.d.ts`). `include: ["src/**/*", "test/**/*",
   "*.config.ts"]`. **No `references`** — packages resolve each other's source via `workspace:*` +
   `moduleResolution: bundler`.
4. **vitest.config.ts** — one line: `export { default } from '@kotodama/presets/vitest.base'`. This runs
   the package as its own Vitest process under `bun run --filter '*' test` (a single aggregate
   `vitest run` drops projects on this toolchain).
5. **src/index.ts** — `export {}` placeholder.
6. **test/smoke.test.ts** — `import { expect, it } from 'vitest'` + a trivial passing test (tests live in
   `test/`, not `src/` — see `@.claude/rules/frontend-testing.md`). Every workspace needs ≥1 test or
   `vitest run` fails the gate.
7. **CLAUDE.md** — one short paragraph: role + who may import it + import boundaries.
8. **No root-config edit needed** — do NOT hand-list the package anywhere. The single source of truth is
   `package.json#workspaces` (`apps/*`, `core`, `platform`, `ui`, `infra/presets`); the aggregators
   enumerate via `--filter '*'`, so a folder matching an existing glob is picked up. A new top-level
   package (not under an existing glob) needs the glob added — the ONE sanctioned `package.json` edit.
9. Run `bun install` (creates the workspace symlink), then `bun run check` and
   `bun run --filter '@kotodama/<name>' test`. Report results.

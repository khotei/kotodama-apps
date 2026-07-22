# Tooling

**Always-loaded rule.**

| Command | Runs | Gates |
|---|---|---|
| `bun run bootstrap` | `bun install` | — |
| `bun run format` | `biome format --write .` | local only |
| `bun run lint` | `biome lint .` | pre-commit + CI |
| `bun run tsc` | `bun run --filter '*' typecheck` (each workspace's `bun --bun tsc --noEmit`) | pre-commit + CI |
| `bun run test` | `bun run --filter '*' test` (each workspace's `bun --bun vitest run`) | CI only |
| `bun run check` | `lint` + `tsc` | manual / `/check` |
| `bun run gen:api` | regenerate `platform/api-client/src/schema.gen.ts` from the live backend | CI drift gate |

**Bun 1.3 + `bunfig.toml` `linker = "hoisted"`.** Hoisted is **non-negotiable**: React must resolve
to a single instance across every workspace or hooks/context break. Bun 1.3's default isolated
linker + catalogs has an open dedupe bug (oven-sh/bun#23615) yielding multiple React copies.
Re-evaluate once it closes. Versions are pinned via **catalogs**
(`runtime`/`react`/`next`/`tanstack`/`style`/`ui`/`api`/`test`) — add an external dep as
`catalog:<group>`, internal as `workspace:*`.

**Biome:** no root config — the single config is `infra/tooling/biome.base.json`, threaded
through every invocation via `--config-path` (the `lint`/`format` scripts + husky), mirroring
kotodama-core. 2-space, single quotes, semicolons as-needed, width 100 + the `react` domain. Encodes
the layer gradients via `style/noRestrictedImports` per-glob overrides — see
`.claude/rules/frontend-layering.md`. Generated files (`schema.gen.ts`, `tokens.gen.ts`,
`tokens.css`) are Biome-excluded so formatting can't perturb them.

**Husky pre-commit:** `biome check --staged` + `bun run tsc`. Tests are CI-only. `--no-verify`
bypasses — emergencies only, never on `main`.

**OpenAPI codegen (D4):** `bun run gen:api` live-fetches `{KOTODAMA_API_URL}/api/openapi.json`
(default `http://localhost:3000`) and runs `openapi-typescript`. There is no committed
`openapi.json`; the CI drift gate regenerates and fails on a dirty diff, so it needs a reachable
backend. `schema.gen.ts` is committed + never hand-edited.

## Single source of truth: `package.json#workspaces`

No root `tsconfig.json`, no root `vitest.config.ts` — never reintroduce one to hand-list packages.
Shared presets live in the config-only **`@kotodama/tooling`** workspace (at `infra/tooling`):
`tsconfig.base.json` (DOM-free agnostic, extended by `platform` + `core`) + `tsconfig.dom.json`
(adds `lib:["dom",…]`, extended by `apps/web` + `ui`) +
`vitest.base.ts`/`vitest.setup.ts` + `biome.base.json`. Each workspace `tsconfig.json` extends
`@kotodama/tooling/tsconfig.{base,dom}.json` and owns a one-line `vitest.config.ts` re-exporting
`@kotodama/tooling/vitest.base` — both by package specifier (a `workspace:*` dep, resolved via the
`hoisted` linker). Packages resolve each other's **source** via `workspace:*` + `moduleResolution:
bundler`, so per-workspace `tsc --noEmit` is correct without project references.
**Aggregate multi-project `vitest run` is banned** — on Bun 1.3 + Vitest 3.2.x it silently ran a
subset and exited 0 on failure (kept on Vitest 4, not re-verified); per-workspace runs are correct.

## Every script runs under Bun (`--bun`), never node

`node` is not a dependency. The bins these scripts call (`tsc`, `vitest`, `storybook`) ship a
`#!/usr/bin/env node` shebang and die on a node-less machine, so **every per-package script prefixes
the bin with `bun --bun`**. Storybook is the exception: `bunx --bun storybook <cmd>` — a bare
`bun --bun storybook` collides with the `storybook` script name and recurses. `bun test` invokes
Bun's built-in runner and ignores the `test` script — always `bun run test`. **Playwright is the
opposite exception: `apps/e2e` runs `bunx playwright test` — plain, NEVER `--bun`** (upstream closed
Bun support; `--bun` hangs/segfaults, oven-sh/bun#8222). Node is an accepted prerequisite there only.
**The app is Next 16 (App Router, Turbopack — never `--webpack`; Tailwind is zero-runtime so
Emotion's Turbopack hydration bug can't occur); Vite lives only inside Storybook.**

# Tooling

**Always-loaded rule.** Commands: see `.claude/CLAUDE.md` Root scripts. Biome config lives ONLY at
`infra/presets/src/biome.base.json`, threaded via `--config-path` (no root config).

- **`bunfig.toml` `linker = "hoisted"` is non-negotiable** — React must resolve to a single instance
  or hooks/context break. Bun 1.3's isolated linker + catalogs has a dedupe bug (oven-sh/bun#23615)
  yielding multiple React copies. Re-evaluate when it closes.
- **Versions pinned via catalogs:** add an external dep as `catalog:<group>`, internal as
  `workspace:*`. Packages resolve each other's SOURCE (`moduleResolution: bundler`), so per-workspace
  `tsc --noEmit` is correct without project references.
- **No root `tsconfig.json` / `vitest.config.ts`** — never reintroduce one to hand-list packages;
  `package.json#workspaces` is the source of truth. Shared bases live in `@kotodama/presets`.
- **Aggregate multi-project `vitest run` is banned** — on Bun 1.3 it silently ran a subset and
  exited 0 on failure. Per-workspace runs only.
- **Every per-package bin is prefixed `bun --bun`** (node is not a dependency). Exceptions:
  Storybook = `bunx --bun storybook` (a bare `bun --bun storybook` recurses into the script name);
  `bun test` invokes Bun's own runner and ignores the `test` script — always `bun run test`;
  **Playwright (`apps/e2e`) = `bunx playwright test`, NEVER `--bun`** (hangs/segfaults,
  oven-sh/bun#8222). Next is Turbopack — never `--webpack`.
- **`bun run gen:api`** live-fetches `{KOTODAMA_API_URL}/api/openapi.json` (default localhost:3000);
  there is no committed `openapi.json`, so the CI drift gate needs a reachable backend.
  `schema.gen.ts` is committed + never hand-edited.

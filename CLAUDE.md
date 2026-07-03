# Kotodama Frontend — Claude Code project context

The standalone Bun **frontend** monorepo for Kotodama (a language-learning platform). **This repo
is the foundational scaffolding** (F-PLAT-014) — strict layering + a proven walking-skeleton so
every later frontend feature ships cheaply onto an enforced spine. It is a pure consumer of the
backend's `words` HTTP API; the ONLY bridge is a typed client generated from
`/api/openapi.json`. This file + the `.claude/rules/` Claude Code auto-loads are the working context.

## Runtime

**Bun 1.3** (pinned via `packageManager`, runs `.ts` directly, `linker="hoisted"`) · **TypeScript
strict, DOM-free base** · **React 19** · **TanStack Router (raw) + Query + Form** · **Chakra v3 +
Ark** · **openapi-fetch / openapi-typescript** · **Zod**. Versions pinned via Bun catalogs. No
Effect on the frontend. Details: `.claude/rules/tooling.md`.

## The two import gradients (the rule the scaffolding protects)

```
apps/web ─► packages/{fe-ui, fe-theme} ─► packages/fe-tokens     (web design-system)
apps/web ─► packages/{fe-store, fe-core, fe-api-client}          (platform-agnostic SPINE → future apps/mobile)
packages/fe-tokens ─► nothing internal (leaf)

intra apps/web/src:  fe-api-client (client+fetchX) ◄ fe-core ◄ fe-store ◄ features ◄ render
```

Enforced by (1) a **DOM-free `tsconfig.base.json`** — a `document`/`window`/react-dom leak into the
spine is a `tsc` error (the primary web↔native enforcer); and (2) **Biome `noRestrictedImports`** —
layer-direction bans. Full rule + rationale: `.claude/rules/frontend-layering.md`. Run `/scan-deps`.

## Root scripts

| Script | Does |
|---|---|
| `bun run bootstrap` | `bun install` |
| `bun run format` / `lint` | Biome format-autofix / lint |
| `bun run tsc` | typecheck all workspaces (`bun run --filter '*' typecheck`) |
| `bun run test` | Vitest per workspace (`bun run --filter '*' test`). NOT `bun test`. |
| `bun run check` | `lint` + `tsc` |
| `bun run gen:api` | regenerate `fe-api-client/src/schema.gen.ts` from the live backend (D4) |
| `bun --bun scripts/new-package.ts <layer>/<name> [--dom]` | scaffold a workspace |
| `bun run --filter '@kotodama/web' {dev,build,prerender}` | run the hand-rolled Bun SSR app |

## Commits & the pre-commit gate

Every commit follows `.claude/rules/commits.md` (gitmoji + Conventional Commits + decision-rich body
+ `Refs:` footer). Husky runs `biome check --staged` + `bun run tsc`; `--no-verify` bypasses —
emergencies only, never on `main`. PRs squash-merge (`.claude/rules/pull-requests.md`).

## Rules (`.claude/rules/`)

Claude Code auto-discovers every `.claude/rules/*.md`. Cross-cutting load **always**; the rest are
**path-scoped** via `paths:` frontmatter.

- **Always:** `frontend-layering` · `tooling` · `naming` · `comments` · `commits` · `pull-requests`
  · `claude-md`.
- **Path-scoped:** `frontend-state` → `apps/web/src/**`, `packages/fe-{store,api-client}/**` ·
  `frontend-testing` → `**/test/**`, `**/*.test.*`, `**/*.stories.tsx` · `sdd` →
  `.claude/{commands,agents,sdd}/**` · `human-docs` → `readme.md`, `docs/**`.
- **On-demand reference (pointer-loaded):** `.claude/agent-patterns/*` — design-principles,
  modern-typescript, type-fest, commit-examples.

## Per-layer context

`apps/web/CLAUDE.md` + one `CLAUDE.md` per `packages/fe-*`. Ancestor `CLAUDE.md` (this file) always
loads; a package's loads when you touch its subtree. Content rule (why-not-what):
`.claude/rules/claude-md.md`. **Don't churn these on exploratory edits** — refresh only when a real
change is about to land, as part of the commit.

## Slash commands

`/check` · `/scan-deps` · `/new-package` · `/sweep`. **SDD toolkit** —
`/sdd:{research,specify,clarify,plan,tasks,implement,verify}` drive the spec-driven loop against
the live feature in Notion. Quickstart: `.claude/commands/README.md`. Conventions:
`.claude/rules/sdd.md`.

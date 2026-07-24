# Kotodama Frontend — Claude Code project context

The standalone Bun **frontend** monorepo for Kotodama (a language-learning platform). **This repo
is the foundational scaffolding** (F-PLAT-014) — strict layering + a proven walking-skeleton so
every later frontend feature ships cheaply onto an enforced spine. It is a pure consumer of the
backend's `words` HTTP API; the ONLY bridge is a typed client generated from
`/api/openapi.json`. This file + the `.claude/rules/` Claude Code auto-loads are the working context.

## Runtime

**Bun 1.3** (pinned via `packageManager`, runs `.ts` directly, `linker="hoisted"`) · **TypeScript
strict, DOM-free base** · **React 19** · **Next 16 (App Router, Turbopack)** · **TanStack Query +
Form** · **Tailwind v4 + shadcn/ui** · **openapi-fetch / openapi-typescript** · **Zod**. Versions
pinned via Bun catalogs. No Effect on the frontend. Details: `.claude/rules/tooling.md`.

## Structure — top-level tiers (mirror the backend)

```
packages/api-client   transport (openapi-fetch + schema.gen)   [leaf · agnostic · importable by all]
packages/ui           web design system (Tailwind v4 + shadcn primitives + @theme tokens)  [leaf · web-only]

api-client ◄ repositories ◄ store ◄ use-cases ◄ apps/web   (repositories = fetchX + entity types,
                                                           store = queryOptions + model,
                                                           use-cases = React hooks, apps/web = render)
```

Agnostic spine (reused by any future `apps/*`): `api-client`, `repositories`, `store`,
`use-cases`. Web-only: `ui`, `apps/web`. A domain is a `src/<domain>/` folder inside a tier.
Enforced by (1) a **DOM-free `tsconfig.base.json`** — a DOM leak (or a DOM-bound dep) into an
agnostic tier is a `tsc` error (the primary web↔native enforcer); and (2) **Biome
`noRestrictedImports`** — tier-direction bans. Full rule: `.claude/rules/frontend-layering.md`. Run
`/scan-deps`.

## Root scripts

| Script | Does |
|---|---|
| `bun run bootstrap` | `bun install` |
| `bun run format` / `lint` | Biome format-autofix / lint |
| `bun run tsc` | typecheck all workspaces (`bun run --filter '*' typecheck`) |
| `bun run test` | Vitest per workspace (`bun run --filter '*' test`). NOT `bun test`. |
| `bun run check` | `lint` + `tsc` |
| `bun run gen:api` | regenerate `packages/api-client/src/schema.gen.ts` from the live backend (D4) |
| `bun --bun scripts/new-package.ts <layer>/<name> [--dom]` | scaffold a workspace |
| `bun run --filter '@kotodama/web' {dev,build,start}` | run the Next app (Turbopack) |

## Commits & the pre-commit gate

Every commit follows `.claude/rules/commits.md` (gitmoji + Conventional Commits + decision-rich body
+ `Refs:` footer). Husky runs `biome check --staged` + `bun run tsc`; `--no-verify` bypasses —
emergencies only, never on `main`. PRs squash-merge (`.claude/rules/pull-requests.md`).

## Rules (`.claude/rules/`)

Claude Code **auto-discovers** every `.claude/rules/*.md` — no `@`-import needed (an `@`-import would
re-load the file on top of discovery and force-load it every session, defeating path-scoping).
Cross-cutting rules load **always**; the rest are **path-scoped** via `paths:` frontmatter and load
only when you touch a matching file, keeping the always-on context lean (Claude Code guidance: target
< 200 lines of always-loaded context per file; bloat reduces adherence).

- **Always:** `frontend-layering` · `tooling` · `naming` · `comments` · `commits` · `pull-requests`
  · `claude-md`.
- **Path-scoped:** `frontend-state` → `apps/web/src/**`, `store/**`, `repositories/**`, `use-cases/**` ·
  `nextjs` → `apps/web/**` · `frontend-testing` → `**/test/**`, `**/*.test.*`, `**/*.stories.tsx` ·
  `sdd` → `.claude/{commands,agents,sdd}/**` · `human-docs` → `readme.md`, `docs/**`.
- **On-demand reference (pointer-loaded):** `.claude/agent-patterns/*` — design-principles,
  modern-typescript, type-fest, commit-examples, tailwind-shadcn.

## Per-layer context

`apps/web/CLAUDE.md` + one `CLAUDE.md` per tier (`repositories`, `store`, `use-cases`) and per leaf package (`packages/api-client`, `packages/ui`). Ancestor `CLAUDE.md` (this file) always
loads; a package's loads when you touch its subtree. Content rule (why-not-what):
`.claude/rules/claude-md.md`. **Don't churn these on exploratory edits** — refresh only when a real
change is about to land, as part of the commit.

## Slash commands

`/check` · `/scan-deps` · `/new-package` · `/sweep`. **SDD toolkit** —
`/sdd:{research,specify,clarify,plan,tasks,implement,verify}` drive the spec-driven loop against
the live feature in Notion. Quickstart: `.claude/commands/README.md`. Conventions:
`.claude/rules/sdd.md`.

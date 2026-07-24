# Kotodama Frontend — Claude Code project context

The standalone Bun **frontend** monorepo for Kotodama (a language-learning platform). **This repo
is the foundational scaffolding** (F-PLAT-014) — strict layering + a proven walking-skeleton so
every later frontend feature ships cheaply onto an enforced spine. It is a pure consumer of the
backend's `words` HTTP API; the ONLY bridge is a typed client generated from
`/api/openapi.json`. This file + the `.claude/rules/` Claude Code auto-loads are the working context.

## Runtime

**Bun 1.3** (pinned via `packageManager`, runs `.ts` directly, `linker="hoisted"`) · **TypeScript
strict, DOM-free base** · **React 19** · **Next 16 (App Router, Turbopack — RSC + Server Actions,
server-first)** · **TanStack Form** · **Tailwind v4 + shadcn/ui** · **openapi-fetch /
openapi-typescript** · **Zod**. Versions pinned via Bun catalogs. No Effect on the frontend. Details:
`.claude/rules/tooling.md`.

## Structure — top-level workspaces (mirror the backend)

```
apps/web · apps/e2e   the Next shell (App Router) + the Playwright crawlability proof   [web-only]
core          @kotodama/core       agnostic domain spine (DOM-free); two layers as folders,
                                   subpath-exported: @kotodama/core/repositories (fetchX + *Entity)
                                   ◄ @kotodama/core/store (domain model)
platform      @kotodama/platform   agnostic base leaf; two leaves as folders, subpath-exported:
                                   @kotodama/platform/api-client (transport) + @kotodama/platform/config (env)
ui            @kotodama/ui         the ENTIRE web design system + all presentation   [web-only leaf]
infra/presets @kotodama/presets    write-once config presets (tsconfig/biome/vitest bases)

platform/api-client ◄ core/repositories ◄ core/store ◄ apps/web   (platform/config a base leaf
                                                                   importable by all; ui the web-only
                                                                   design-system leaf apps/web wires)
```

Agnostic spine (reused by any future `apps/*`): `platform`, `core`. Web-only: `ui`, `apps/web` (the
web↔native line is below `core`). **Server-first:** `apps/web` reads via RSC loaders
(`src/server/*.loader.ts`) + writes via Server Actions (`src/server/*.actions.ts`) — no client data
cache — and injects data/actions/URLs (serializable) into the prop-driven `@kotodama/ui` components.
A new domain is a `src/<domain>/` folder under each `core` layer, never a new package. Enforced by (1)
a **DOM-free `tsconfig.base.json`** — a DOM leak (or a DOM-bound dep) into an agnostic tier is a `tsc`
error (the primary web↔native enforcer); and (2) **Biome `noRestrictedImports`** — tier-direction
bans. Full rule: `.claude/rules/frontend-layering.md`. Run `/scan-deps`.

## Root scripts

| Script | Does |
|---|---|
| `bun run bootstrap` | `bun install` |
| `bun run format` / `lint` | Biome format-autofix / lint |
| `bun run tsc` | typecheck all workspaces (`bun run --filter '*' typecheck`) |
| `bun run test` | Vitest per workspace (`bun run --filter '*' test`). NOT `bun test`. |
| `bun run check` | `lint` + `tsc` |
| `bun run gen:api` | regenerate `platform/api-client/src/schema.gen.ts` from the live backend (D4) |
| `bun run --filter '@kotodama/web' {dev,build,start}` | run the Next app (Turbopack) |

Scaffolding a new workspace is the `/new-package` slash command (it writes the files directly — no
script), mirroring kotodama-core.

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

- **Always:** `frontend-layering` · `tooling` · `naming` · `typescript` · `comments` · `commits` ·
  `pull-requests` · `claude-md`.
- **Path-scoped:** `frontend-state` → `apps/web/**`, `core/**` ·
  `frontend-components` → `ui/**`, `apps/web/**` (policy-free frames, shaped from above) ·
  `nextjs` → `apps/web/**` · `react-use` → `apps/web/**`, `ui/**` (check before hand-rolling a
  client hook) · `frontend-testing` → `**/test/**`, `**/*.test.*`, `**/*.stories.tsx` ·
  `sdd` → `.claude/{commands,agents,sdd}/**` · `human-docs` → `readme.md`, `docs/**`.
- **On-demand reference (pointer-loaded):** `.claude/agent-patterns/*` — design-principles,
  component-design, modern-typescript, type-fest, commit-examples, tailwind-shadcn.

## Per-layer context

`apps/web/CLAUDE.md` + one `CLAUDE.md` per package (`core`, `platform`, `ui`). Ancestor `CLAUDE.md`
(this file) always loads; a package's loads when you touch its subtree. Content rule (why-not-what):
`.claude/rules/claude-md.md`. **Don't churn these on exploratory edits** — refresh only when a real
change is about to land, as part of the commit.

## Slash commands

`/check` · `/scan-deps` · `/new-package` · `/sweep`. **SDD toolkit** —
`/sdd:{research,specify,clarify,plan,tasks,implement,verify}` drive the spec-driven loop against
the live feature in Notion. Quickstart: `.claude/commands/README.md`. Conventions:
`.claude/rules/sdd.md`.

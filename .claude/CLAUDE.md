# Kotodama Frontend — Claude Code project context

The standalone Bun **frontend** monorepo for Kotodama (a language-learning platform). **This
repo is the foundational scaffolding** (F-PLAT-014): strict layering + a walking-skeleton so
later features ship cheaply onto an enforced spine. It is a pure consumer of the backend's
`words` HTTP API; the ONLY bridge is a typed client generated from `/api/openapi.json`.

## Runtime

**Bun 1.3** (`packageManager`-pinned, runs `.ts`, `linker="hoisted"`) · **TypeScript strict,
DOM-free base** · **React 19** · **Next 16 (App Router, Turbopack, RSC + Server Actions,
server-first)** · **TanStack Form** · **Tailwind v4 + shadcn/ui** · **openapi-fetch /
openapi-typescript** · **Zod**. Versions pinned via Bun catalogs. **No Effect on the FE.**
Details: `.claude/rules/tooling.md`.

## Structure — top-level workspaces (mirror the backend)

```
apps/web · apps/e2e   Next shell (App Router) + Playwright crawlability proof   [web-only]
core          @kotodama/core       agnostic domain spine (DOM-free): subpath folders
                                   @kotodama/core/repositories (fetchX + *Entity) ◄ /store (model)
platform      @kotodama/platform   agnostic base leaf: /api-client (transport) + /config (env)
ui            @kotodama/ui         the ENTIRE web design system + all presentation   [web-only leaf]
infra/presets @kotodama/presets    write-once config presets (tsconfig/biome/vitest bases)

platform/api-client ◄ core/repositories ◄ core/store ◄ apps/web
(platform/config a base leaf importable by ALL; ui the web-only leaf apps/web wires)
```

Full layering rule + the two enforcement planes (DOM-free `tsconfig.base` + Biome
`noRestrictedImports`): `.claude/rules/frontend-layering.md`. A new domain
is a `src/<domain>/` folder under each layer, never a new package.

## Root scripts

| Script | Does |
|---|---|
| `bun run bootstrap` | `bun install` |
| `bun run format` / `lint` | Biome format-autofix / lint |
| `bun run tsc` | typecheck all workspaces (`bun run --filter '*' typecheck`) |
| `bun run test` | Vitest per workspace (`bun run --filter '*' test`). NOT `bun test`. |
| `bun run check` | `lint` + `tsc` |
| `bun run gen:api` | regenerate `platform/api-client/src/schema.gen.ts` from the live backend |
| `bun run --filter '@kotodama/web' {dev,build,start}` | run the Next app |

Scaffold a new workspace with `/new-package` (writes files directly, no script).

## Commits & gate

Follow `.claude/rules/commits.md`; husky runs `biome check --staged` + `bun run tsc`
(`--no-verify` = emergencies only, never on `main`). PRs squash-merge (`pull-requests.md`).

## Rules (`.claude/rules/`)

Auto-discovered — no `@`-import. Cross-cutting rules load **always**; the rest are
**path-scoped** via `paths:` frontmatter and load only on a matching file.

- **Always:** `frontend-layering` · `tooling` · `naming` · `typescript` · `comments` ·
  `commits` · `pull-requests` · `claude-md`.
- **Path-scoped:** `frontend-state` → `apps/web/**`,`core/**` · `frontend-components` →
  `ui/**`,`apps/web/**` · `nextjs` → `apps/web/**` · `react-use` → `apps/web/**`,`ui/**` ·
  `frontend-testing` → `**/test/**`,`**/*.test.*`,`**/*.stories.tsx` · `sdd` →
  `.claude/{commands,agents,sdd}/**` · `human-docs` → `readme.md`,`docs/**`.
- **On-demand (pointer-loaded):** `.claude/agent-patterns/*` — component-design,
  commit-examples.

## Per-layer context

One `CLAUDE.md` per package (`core`,`platform`,`ui`) + `apps/web/CLAUDE.md`; this ancestor
always loads, a package's loads when you touch its subtree. Content rule: `claude-md.md`.

## Slash commands

`/new-package` · `/sweep`. **SDD toolkit:**
`/sdd:{research,specify,clarify,plan,tasks,implement,verify}` (Notion-driven). Quickstart:
`.claude/commands/README.md`. Conventions: `.claude/rules/sdd.md`.

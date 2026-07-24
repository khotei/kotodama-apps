<div align="center">

# 言霊 · Kotodama — Web

**The soul of words, in the browser** — crawlable, statically-generated word pages and the review
UI, on a framework-agnostic spine a future native app reuses unchanged.

[![CI](https://github.com/khotei/kotodama-apps/actions/workflows/ci.yml/badge.svg)](https://github.com/khotei/kotodama-apps/actions/workflows/ci.yml)
![Bun](https://img.shields.io/badge/Bun-1.3-000?logo=bun&logoColor=fbf0df)
![Next.js](https://img.shields.io/badge/Next.js-16_App_Router-000?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-087ea4?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6?logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-v4-38bdf8?logo=tailwindcss&logoColor=white)

</div>

> *Kotodama* (言霊) — the old belief that words carry a living power that shapes reality. This is
> **the frontend**: the web client that turns the backend's word entries into crawlable pages and a
> review UI. A Bun monorepo whose framework-agnostic spine (transport → data → model) is walled off
> from the web render layer at lint time, so a future native app reuses it unchanged. It is a **pure
> consumer** of [kotodama-core](https://github.com/khotei/kotodama-core); the only bridge is a typed
> client generated from that backend's OpenAPI document.

> The **why / what** is the [Frontend Foundation Architecture](https://www.notion.so/38efb28bd5f181d794c3d9b1fd5629ba)
> + the [Tech spec](https://www.notion.so/36dfb28bd5f181988f16de6ab423eb3e) (authoritative). This
> README is the **front door** — what this is and how to run it. Depth is linked, never restated:
> conventions in `.claude/rules/*` + per-layer `CLAUDE.md` (auto-loaded in Claude Code); the
> component standard in [`.claude/agent-patterns/tailwind-shadcn.md`](.claude/agent-patterns/tailwind-shadcn.md).

## How it works

```
/words/ja/言葉                              Next App Router · subset-SSG + ISR
      │
      ▼
  RSC page ──► getWordState()  (src/server · server-only · React.cache)
      │              │ createStaticApiClient() — anonymous, keeps SSG
      │              ▼
      │        fetchWordState ─► GET /api/words/ja/言葉/state ─► kotodama-core   @kotodama/core/repositories
      │              (via the typed client generated from the backend's OpenAPI)  @kotodama/platform/api-client
      ▼              │ narrowWordState                                            @kotodama/core/store
  WordStateModel ──► WordScreen (RSC, prop-driven) ──► WordCard   @kotodama/ui
      │
      ▼
  Server-rendered HTML: <title> · OpenGraph · JSON-LD DefinedTerm   (crawlable, JavaScript off)
```

A component never touches a raw `fetch` — reads flow through a `server-only` `React.cache` loader in
`src/server` and pass down as props; writes are Server Actions that `revalidatePath`. No client cache.
The public word tree stays statically generable (only the anonymous client is legal there). Full
topology: [`.claude/rules/frontend-layering.md`](.claude/rules/frontend-layering.md) ·
[`apps/web/CLAUDE.md`](apps/web/CLAUDE.md).

## The stack

Identity only — exact versions are pinned centrally in Bun **catalogs**
([`package.json`](package.json)), the single source, so they aren't restated here.

| Tool | Why it's here |
|---|---|
| **Bun** | Runtime + package manager; runs `.ts` directly, no build step for the spine |
| **TypeScript (strict, DOM-free base)** | One typed language; a DOM leak into the agnostic spine is a `tsc` error |
| **React 19** | The component runtime |
| **Next 16 (App Router, Turbopack)** | The render / routing / SEO shell — RSC + Server Actions, SSG + ISR for public word pages |
| **TanStack Form** | Typed form state for client-side mutations (server-first: reads are RSC, no query cache) |
| **Tailwind v4 + shadcn/ui** | Zero-runtime design system — own-your-code primitives + `@theme` semantic tokens |
| **openapi-fetch / openapi-typescript** | The typed API client, generated from the backend's OpenAPI (`bun run gen:api`) |
| **Zod** | Runtime validation at the untyped edges |
| **Biome + Husky** | Lint/format + the pre-commit gate; encodes the layer rule |
| **Vitest** | Unit tests (jsdom), one per workspace |
| **Playwright** | End-to-end in `apps/e2e`; `bunx playwright test`, never `--bun` |
| **Storybook** | The component workshop — the only place Vite runs |

## Repository layers

Responsibilities, not a file tree (a tree drifts) — each folder carries its own `CLAUDE.md` for
detail.

| Layer | Owns | Why it's here |
|---|---|---|
| `platform` (`./api-client` · `./config`) | the openapi-fetch client + generated `schema.gen`; the Zod-validated env | the agnostic base leaf — transport + env, imported by all |
| `core` (`./repositories` · `./store`) | bare `fetchX` + contract `*Entity` types ◄ the domain-model derivation (`narrowWordState` + `*Model` types) | the agnostic domain spine a future native app reuses |
| `ui` | the web design system + ALL presentation: Tailwind v4 + shadcn primitives + `@theme` tokens, atoms→pages | web-only, prop-driven leaf |
| `apps/web` | the Next shell: routing + the `src/server` data layer (loaders + actions) + wiring + SEO | the web process boundary |
| `apps/e2e` | Playwright against a running app + real backend | the crawlability proof (JS off) |
| `infra/tooling` | the `@kotodama/tooling` config presets (tsconfig/biome/vitest bases) | write-once shared config, referenced by specifier |

`platform` and `core` are each ONE package whose layers are subpath-exported folders
(`@kotodama/platform/{api-client,config}`, `@kotodama/core/{repositories,store}`) — a new domain is a
folder under a `core` layer, never a new package.

**Dependency direction** (enforced by Biome + a DOM-free `tsconfig`):
`platform/api-client ◄ core/repositories ◄ core/store ◄ apps/web`, and everything → `platform`. The
agnostic spine (`platform` + `core`) is what a future native app reuses; `ui`/`apps/web` are web-bound
and don't port (the web↔native line is below `core`, since `ui` renders). Within `apps/web`, only
`src/server/**` may reach `core/repositories`; `ui` stays prop-driven. Full rule + enforcement:
[`.claude/rules/frontend-layering.md`](.claude/rules/frontend-layering.md).

## Requirements

- **[Bun](https://bun.com/) 1.3.x** — `curl -fsSL https://bun.com/install | bash`
- **Node** — for the Playwright e2e only (upstream closed Bun support); any recent Node via `fnm` or system.
- **A running [kotodama-core](https://github.com/khotei/kotodama-core) backend** for real data — and
  for the e2e suite, which now runs against a live backend (no in-repo stub). Without one the loader
  degrades to a "not built yet" card (it never throws), so `next build` still prerenders; the
  committed typed client (`schema.gen.ts`) means typecheck + unit tests run offline.

## Run it

```bash
# 1. Dependencies.
bun install

# 2. Health — lint + typecheck + unit tests across every workspace.
bun run check && bun run test

# 3. The web app (Next App Router, Turbopack) — dev serves on :4000. Copy .env.example to .env first
#    (KOTODAMA_API_URL → the core backend on :3000; KOTODAMA_SITE_URL → this app). Backend access is
#    server-side only (RSC loaders + Server Actions). No silent defaults — a missing var fails the build.
bun run --filter '@kotodama/web' dev

# 4. The design system in isolation (Storybook — the only place Vite runs).
bun run --filter '@kotodama/ui' storybook:dev

# 5. End-to-end (crawlability proof, JS off) against the app + real backend from step 3, already
#    running. Point Playwright at it with E2E_BASE_URL if the app isn't on :4000.
bun run --filter '@kotodama/e2e' test:e2e
```

Regenerate the typed client when the backend contract moves: `bun run gen:api` (live-fetches
`{KOTODAMA_API_URL}/api/openapi.json`; `schema.gen.ts` is committed and a CI drift gate keeps it
honest). Every script runs under Bun — the sole exception is Playwright, above
([`.claude/rules/tooling.md`](.claude/rules/tooling.md)).

## Contributing

Conventions live in [`.claude/rules/`](.claude/rules/) (commit/PR shape, the pre-commit gate, the
layer rule), auto-loaded in Claude Code and plain markdown for humans; `/new-package` scaffolds a
workspace with zero root-config edits. One piece of tooling stays out of the repo by design:

- **MCP servers (optional, deliberately not in the repo)** — personal tooling, so each developer
  installs their own into Claude Code's **local scope** (stored per project in `~/.claude.json`,
  never committed), baking this project's env at add time. The recommended pair:

  ```bash
  claude mcp add shadcn -- npx shadcn@latest mcp
  claude mcp add next-devtools -- npx -y next-devtools-mcp@latest
  ```

## Docs & conventions

- **[`apps/web/CLAUDE.md`](apps/web/CLAUDE.md)** + **[`.claude/rules/nextjs.md`](.claude/rules/nextjs.md)** — the render shell (RSC/SSG boundaries, the data path, SEO)
- **[`.claude/rules/frontend-layering.md`](.claude/rules/frontend-layering.md)** — the spine + the web↔native boundary
- **[`.claude/agent-patterns/tailwind-shadcn.md`](.claude/agent-patterns/tailwind-shadcn.md)** — the component standard (`cva`, `cn`, semantic tokens)
- **[`.claude/rules/tooling.md`](.claude/rules/tooling.md)** · **[`commits.md`](.claude/rules/commits.md)** · **[`pull-requests.md`](.claude/rules/pull-requests.md)** — scripts, the pre-commit gate, commit/PR shape
- **[Frontend Foundation Architecture](https://www.notion.so/38efb28bd5f181d794c3d9b1fd5629ba)** · **[Tech spec](https://www.notion.so/36dfb28bd5f181988f16de6ab423eb3e)** — the authoritative why / what
- **`.claude/`** — AI-agent context (root [`.claude/CLAUDE.md`](.claude/CLAUDE.md) + `.claude/rules/*` + per-layer `CLAUDE.md`), loaded automatically in Claude Code
</content>

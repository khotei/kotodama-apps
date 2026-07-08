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
> review UI. A Bun monorepo whose framework-agnostic spine (transport → data → hooks) is walled off
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
  RSC page ──► prefetchQuery( wordQueryOptions )                        @kotodama/store
      │              │ createStaticApiClient() — anonymous, keeps SSG
      │              ▼
      │        fetchWordState ─► GET /api/words/ja/言葉/state ─► kotodama-core   @kotodama/repositories
      │              (via the typed client generated from the backend's OpenAPI)  @kotodama/api-client
      ▼              │
  dehydrate ──► <HydrationBoundary> ──► WordView ──► useWord ──► WordCard  @kotodama/{use-cases,ui}
      │
      ▼
  Server-rendered HTML: <title> · OpenGraph · JSON-LD DefinedTerm   (crawlable, JavaScript off)
```

A component never touches a raw `fetch` — data flows down the spine's `queryOptions` factories,
is prefetched on the server, dehydrated into the page, and hydrated on the client with no refetch.
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
| **Next 16 (App Router, Turbopack)** | The render / routing / SEO shell — SSG + ISR for public word pages |
| **TanStack Query (+ Form)** | Server-state cache; its `queryOptions` factories are the cross-platform data unit |
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
| `packages/api-client` | the openapi-fetch client + generated `schema.gen` | transport, the leaf everything imports |
| `repositories/` | bare `fetchX` access functions + contract entity types | the only code that speaks path-strings |
| `store/` | TanStack Query `queryOptions` factories + the domain-model derivation | the shared data unit (loader ⇔ hook) |
| `use-cases/` | React feature hooks over `store` (`useWord`) | one place a data concern is composed |
| `packages/ui` | the web design system: Tailwind v4 + shadcn primitives + `@theme` tokens | web-only, prop-driven leaf |
| `apps/web` | the Next App Router render layer + feature components + SEO | the web process boundary |
| `apps/e2e` | Playwright against a running app + real backend | the crawlability proof (JS off) |

**Dependency direction** (enforced by Biome + a DOM-free `tsconfig`):
`api-client ◄ repositories ◄ store ◄ use-cases ◄ apps/web`, and everything → `packages`. The
agnostic spine (`api-client` … `use-cases`) is what a future native app reuses; `ui`/`apps/web` are
web-bound and don't port. Full rule + enforcement:
[`.claude/rules/frontend-layering.md`](.claude/rules/frontend-layering.md).

## Requirements

- **[Bun](https://bun.com/) 1.3.x** — `curl -fsSL https://bun.com/install | bash`
- **Node** — for the Playwright e2e only (upstream closed Bun support); any recent Node via `fnm` or system.
- **A running [kotodama-core](https://github.com/khotei/kotodama-core) backend** for real data — and
  for the e2e suite, which now runs against a live backend (no in-repo stub). The app renders a
  loading state without one; the committed typed client (`schema.gen.ts`) means typecheck + unit
  tests still run offline.

## Run it

```bash
# 1. Dependencies.
bun install

# 2. Health — lint + typecheck + unit tests across every workspace.
bun run check && bun run test

# 3. The web app (Next App Router, Turbopack) — dev serves on :4000. Copy apps/web/.env.example to
#    apps/web/.env first (KOTODAMA_API_URL → the core backend on :3000; KOTODAMA_SITE_URL → this app).
#    /api/* is proxied to the backend. No silent defaults — a missing var fails the build.
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

## Docs & conventions

- **[`apps/web/CLAUDE.md`](apps/web/CLAUDE.md)** + **[`.claude/rules/nextjs.md`](.claude/rules/nextjs.md)** — the render shell (RSC/SSG boundaries, the data path, SEO)
- **[`.claude/rules/frontend-layering.md`](.claude/rules/frontend-layering.md)** — the spine + the web↔native boundary
- **[`.claude/agent-patterns/tailwind-shadcn.md`](.claude/agent-patterns/tailwind-shadcn.md)** — the component standard (`cva`, `cn`, semantic tokens)
- **[`.claude/rules/tooling.md`](.claude/rules/tooling.md)** · **[`commits.md`](.claude/rules/commits.md)** · **[`pull-requests.md`](.claude/rules/pull-requests.md)** — scripts, the pre-commit gate, commit/PR shape
- **[Frontend Foundation Architecture](https://www.notion.so/38efb28bd5f181d794c3d9b1fd5629ba)** · **[Tech spec](https://www.notion.so/36dfb28bd5f181988f16de6ab423eb3e)** — the authoritative why / what
- **`.claude/`** — AI-agent context (root [`CLAUDE.md`](CLAUDE.md) + `.claude/rules/*` + per-layer `CLAUDE.md`), loaded automatically in Claude Code
</content>

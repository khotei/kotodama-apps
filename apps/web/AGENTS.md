<!-- BEGIN:nextjs-agent-rules -->

# Next.js: ALWAYS read docs before coding

Before any Next.js work, find and read the relevant doc in `node_modules/next/dist/docs/`. Your training data is outdated — the docs are the source of truth.

<!-- END:nextjs-agent-rules -->

# @kotodama/web — project rules

The block above is **machine-managed** by Next.js (`create-next-app`/codemod regenerate
it) — never hand-edit inside the `nextjs-agent-rules` markers. Anything below the markers
is ours.

Project-specific Next constraints (RSC/SSG boundaries, the SSG public-tree invariant, the
prefetch→dehydrate→hydrate data path, the SEO/JSON-LD rules, Playwright-never-`--bun`) live
in `.claude/rules/nextjs.md` (auto-loaded for `apps/web/**`). The web design-system standard
(Tailwind v4 + shadcn/ui) is `.claude/agent-patterns/tailwind-shadcn.md`. This app's
`CLAUDE.md` imports this file via `@AGENTS.md`.

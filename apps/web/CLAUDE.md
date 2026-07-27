# apps/web — `@kotodama/web`

The Next 16 render shell (App Router, Turbopack). The framework invariants (SSG/RSC boundaries,
the data path, SEO, the read-the-bundled-docs-first directive) live in `.claude/rules/nextjs.md` +
`frontend-state.md`; this file keeps only the package's own facts.

- **Currently a single public library page** rendering `@kotodama/ui` on mock fixtures — the word
  slice (routes, loaders, poller, tests) is not wired. Reads would live in
  `src/server/**/*.loader.ts`; the one live wire is the `requestWordBuild` Server Action
  (`src/server/words/word.actions.ts`) injected into the page as a prop.
- **`src/server/api-client.ts`** (`server-only`) builds `createStaticApiClient` /
  `createServerApiClient` off `serverEnv().KOTODAMA_API_URL` — static (anonymous, cookie-free) is
  the ONLY client legal in the public tree (`nextjs.md`).
- **Dev runs on port 4000** — the core backend owns 3000.
- **Never `next build` to typecheck** — `next typegen && tsc --noEmit` (the `typecheck` script).

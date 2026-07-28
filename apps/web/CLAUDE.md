# apps/web — `@kotodama/web`

The Next 16 render shell (App Router, Turbopack). The framework invariants (SSG/RSC boundaries,
the data path, SEO, the read-the-bundled-docs-first directive) live in `.claude/rules/nextjs.md`;
this file keeps only the package's own facts.

- **`src/server/server-api-client.ts`** (`server-only`) builds the ONE `createServerApiClient` off
  `serverEnv().KOTODAMA_API_URL` — anonymous by default; a per-request caller injects identity
  via `{ headers }` at the call site (public tree: bare calls only, `nextjs.md`).
- **Dev runs on port 4000** — the core backend owns 3000.
- **Never `next build` to typecheck** — `next typegen && tsc --noEmit` (the `typecheck` script).

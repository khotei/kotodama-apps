# packages/ui — `@kotodama/ui`

The web design system in ONE package: Tailwind v4 + shadcn/ui primitives (cva variants + `cn`), the
semantic `@theme` token layer (`styles.css`), and the presentational components built on top.
Web-only (DOM-bound); does not port to native. Storybook consumes it directly.

- **Layout:** `components/ui/*` = shadcn registry primitives (`card`, `badge`, `button`);
  `components/<feature>/` = our compositions (folder + story + barrel, e.g. `word-card/`); shared
  helpers in `lib/` (`utils.ts` → `cn`); `styles.css` = the Tailwind entry. `src/index.ts` re-exports
  the public surface.
- **Add a registry component:** `bunx shadcn@latest add <name>` (run in `packages/ui`).
  `components.json` wires aliases to `@kotodama/ui/…`, so it writes to `components/ui/`, imports `cn`
  from `@kotodama/ui/lib/utils`, and resolves under Turbopack via the package.json `exports` subpaths.
  Then re-export it from `src/index.ts`. shadcn's **official MCP + Skills**
  (`ui.shadcn.com/docs/{mcp,skills}`) can drive adds from the agent (opt-in, user-scope MCP — no
  committed `.mcp.json`, per `sdd.md`); `.claude/agent-patterns/tailwind-shadcn.md` already encodes
  the same Skills rules (semantic tokens, `cva` variants, `asChild`, full `Card` composition).
- **May import:** `class-variance-authority`, `clsx`, `tailwind-merge`, `@radix-ui/react-slot`,
  `lucide-react`, `react`. **Imports nothing internal** (leaf). Never the spine or `apps/*` —
  components take data via props.
- **Imported by:** `apps/web` (feature components) + Storybook.
- **`styles.css` is the Tailwind entry** (exported as `./styles.css`): `@import "tailwindcss"` + the
  `dark` variant + the **standard shadcn token set** (`:root`/`.dark` CSS vars — so registry
  components drop in already styled; `--primary` is the Kotodama purple) + the `@theme inline`
  mapping + a base layer. It also `@source`s its own tree (relative to the file), so consumers just
  `@import "@kotodama/ui/styles.css"` by package name — no path escape into this package. Consumers
  speak only semantic utilities (`bg-card`, `text-muted-foreground`) — never raw hex — the stable
  web↔native seam.
- **`cn` = `twMerge(clsx(...))`** — every component wraps its final className in it so a consumer's
  `className` (passed last) predictably overrides the defaults. Skipping it is a bug.
- **Variants via `cva`** (`Badge`): a typed, prop-based API (`variant` + `defaultVariants`). Not
  `tailwind-variants` — cva is the shadcn default; reach for TV only for multi-part `slots`.
- **Props are primitives, never domain types.** `WordCard` takes `word`/`status`/…, not the store's
  `WordStateModel`; the app maps domain → props.
- **Correct-usage standard:** `.claude/agent-patterns/tailwind-shadcn.md`.

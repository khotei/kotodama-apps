# packages/ui — `@kotodama/ui`

The web design system in ONE package: Tailwind v4 + shadcn/ui primitives (cva variants + `cn`), the
semantic `@theme` token layer (`styles.css`), and ALL presentation built on top. Web-only (DOM-bound);
does not port to native. `ui ⊥ store` — takes data via props (see the import rule below). Storybook
consumes it directly as the design source of truth.

- **Layout:** `components/ui/*` = shadcn registry primitives (`card`, `badge`, `button`);
  `components/{atoms,molecules,organisms,templates,pages}/` = our compositions by Atomic Design (each
  a folder + story + `index.ts` barrel, e.g. `molecules/word-card/`); `views/` = ui-owned view types
  (`word.view.ts`, may mirror the wire contract); `fixtures/` = design-stage mocks (via the
  `@kotodama/ui/fixtures` subpath); `lib/` = helpers (`cn`, `languageName`); `styles.css` = the
  Tailwind entry. `src/index.ts` re-exports the public surface.
- **Add a registry component:** `bunx shadcn@latest add <name>` (run in `packages/ui`).
  `components.json` wires aliases to `@kotodama/ui/…`, so it writes to `components/ui/`, imports `cn`
  from `@kotodama/ui/lib/utils`, and resolves under Turbopack via the package.json `exports` subpaths.
  Then re-export it from `src/index.ts`. shadcn's **official MCP + Skills**
  (`ui.shadcn.com/docs/{mcp,skills}`) can drive adds from the agent (opt-in, user-scope MCP — no
  committed `.mcp.json`, per `sdd.md`); `.claude/agent-patterns/tailwind-shadcn.md` already encodes
  the same Skills rules (semantic tokens, `cva` variants, `asChild`, full `Card` composition).
- **May import:** `class-variance-authority`, `clsx`, `tailwind-merge`, `@radix-ui/react-slot`,
  `lucide-react`, `react`, and `@kotodama/platform/api-client` **types only** (the wire contract). Never
  `store`/`repositories`/`config` or `apps/*` — components take data via props. It may self-compose via
  the `@kotodama/ui` barrel.
- **Imported by:** `apps/web` + Storybook.
- **`styles.css` is the Tailwind entry** (exported as `./styles.css`): `@import "tailwindcss"` + the
  `dark` variant + the **standard shadcn token set** (`:root`/`.dark` CSS vars — so registry
  components drop in already styled; values carry the original Kotodama paper palette — parchment
  canvas, indigo `--primary`, warm ink dark) + the `@theme inline`
  mapping + a base layer. It also `@source`s its own tree (relative to the file), so consumers just
  `@import "@kotodama/ui/styles.css"` by package name — no path escape into this package. Consumers
  speak only semantic utilities (`bg-card`, `text-muted-foreground`) — never raw hex — the stable
  web↔native seam.
- **`cn` = `twMerge(clsx(...))`** — every component wraps its final className in it so a consumer's
  `className` (passed last) predictably overrides the defaults. Skipping it is a bug.
- **Variants via `cva`** (`Badge`): a typed, prop-based API (`variant` + `defaultVariants`). Not
  `tailwind-variants` — cva is the shadcn default; reach for TV only for multi-part `slots`.
- **Props are view types ui owns (may mirror the wire contract), never the store `WordStateModel`.**
  `WordScreen` takes its own `WordScreenView`; the app injects the model as props.
- **Correct-usage standard:** `.claude/agent-patterns/tailwind-shadcn.md`.

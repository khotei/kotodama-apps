# packages/ui — `@kotodama/ui`

The web design system in ONE package: Tailwind v4 + shadcn/ui primitives (cva variants + `cn`), the
semantic `@theme` token layer (`styles.css`), and the presentational components built on top.
Web-only (DOM-bound); does not port to native. Storybook consumes it directly.

- **Layout:** one folder per component — `components/<name>/` (component + story + `index.ts`
  barrel); shared helpers in `lib/`; `styles.css` at the root is the Tailwind entry. `src/index.ts`
  re-exports the public surface.
- **May import:** `class-variance-authority`, `clsx`, `tailwind-merge`, `@radix-ui/react-slot`,
  `lucide-react`, `react`. **Imports nothing internal** (leaf). Never the spine or `apps/*` —
  components take data via props.
- **Imported by:** `apps/web` (feature components) + Storybook.
- **`styles.css` is the Tailwind entry** (exported as `./styles.css`): `@import "tailwindcss"` + the
  `dark` variant + the semantic token layer (`:root`/`.dark` CSS vars) + the `@theme inline` mapping
  that emits the utilities. apps/web imports it. Consumers speak only semantic utilities
  (`bg-surface`, `text-foreground`) — never raw hex — the stable web↔native seam.
- **`cn` = `twMerge(clsx(...))`** — every component wraps its final className in it so a consumer's
  `className` (passed last) predictably overrides the defaults. Skipping it is a bug.
- **Variants via `cva`** (`Badge`): a typed, prop-based API (`variant` + `defaultVariants`). Not
  `tailwind-variants` — cva is the shadcn default; reach for TV only for multi-part `slots`.
- **Props are primitives, never domain types.** `WordCard` takes `word`/`status`/…, not the store's
  `WordStateModel`; the app maps domain → props.
- **Correct-usage standard:** `.claude/agent-patterns/tailwind-shadcn.md`.

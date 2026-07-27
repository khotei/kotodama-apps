# ui — `@kotodama/ui`

The web design system in ONE package: Tailwind v4 + shadcn/ui primitives (cva variants + `cn`), the
semantic `@theme` token layer, and ALL presentation built on top. Web-only (DOM-bound); does not port
to native. `ui ⊥ core` — takes data via props (see the import rule). Storybook is its design source of
truth.

- **Layout:** `components/ui/*` = shadcn registry primitives (`card`, `badge`, `button`); then two
  tiers of our own (each a folder + story + `index.ts` barrel): the **domain-free kit**
  `{atoms,molecules,organisms}/` (generic, portable — Storybook sections `Atoms/Molecules/Organisms`)
  and the **domain layer** `{core,features}/` (`core/` = entity blocks, `features/` = big entity
  compositions with namespaced props — sections `Core/Features`); `{templates,pages}/` assemble.
  `views/` = ui-owned view types; `fixtures/` = design mocks (via `@kotodama/ui/fixtures`); `lib/` =
  helpers (`cn`, `languageName`). `src/index.ts` = the public barrel.
- **Tokens:** `styles.css` is the Tailwind entry — `@import "tailwindcss"` + the `dark` variant + the
  shadcn token set hand-written in `:root`/`.dark` (hex; the Kotodama paper palette) + the `@theme
  inline` colour mapping + the non-colour theme (radius, shadows, type, motion, fonts). It `@source`s
  its own tree, so consumers just `@import "@kotodama/ui/styles.css"`. Consumers speak only semantic
  utilities (`bg-card`) — never raw hex — the web↔native seam.
- **Add a registry component:** `bunx shadcn@latest add <name>` in `ui` — **primitives ONLY**. One
  `components.json`, none in `apps/web` (by design: `ui` is the only design leaf), so the CLI can't
  route a composed *block* to an app target — assemble organisms by hand; don't add
  `apps/web/components.json` to "fix" it. A primitive bundling a hook (`use-mobile`) has no `hooks`
  alias here — place it by hand (client hooks come from `react-use`). Re-export the add
  from `src/index.ts`.
- **Storybook MCP** (`@storybook/addon-mcp`): exposes this package's stories/props to the agent; served
  over `storybook:dev` (:6006) — dead unless that dev server is up. Global `autodocs` + `addon-a11y` on.
- **May import:** `class-variance-authority`, `clsx`, `tailwind-merge`, `radix-ui`, `lucide-react`,
  `react`, `react-use` (per-hook, in `.client.tsx` — `see react-use.md`),
  `@kotodama/platform/api-client` **types only**. Never `@kotodama/core`,
  `@kotodama/platform/config`, or `apps/*` — data comes via props. Self-compose via RELATIVE paths, not
  the `@kotodama/ui` barrel (it's the external surface; a self-barrel import risks an ESM cycle). The
  barrel is for consumers — **only `.stories.tsx` may import `@kotodama/ui`** (stories aren't re-exported, so no cycle).
- **`cn` = `twMerge(clsx(...))`** — wrap the final className so a consumer's `className` (passed last) wins.
- **Variants via `cva`** — a typed prop API (`variant` + `defaultVariants`); reach for
  `tailwind-variants` only for a heavily multi-part/slotted component where you'd hand-roll several
  coordinated `cva` calls (its `slots` API) — never mix both without a reason.
- **Props are ui-owned view types**, never `core`'s model; the app injects the model as props.

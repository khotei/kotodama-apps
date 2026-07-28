# ui — `@kotodama/ui`

The web design system in ONE package: Tailwind v4 + shadcn/ui + all presentation. Storybook is its
design source of truth. Tier policy: `frontend-components.md`.

- **Layout:** `components/ui/*` = shadcn registry primitives (flat files, untouchable); own tiers =
  folder + story + `index.ts` barrel: kit `{atoms,molecules,organisms}/`, domain `{core,features}/`,
  `{templates,pages}/` assemble. `views/` = ui-owned view types (never core's model — the app maps
  into them); `fixtures/` = design mocks; `lib/` = helpers.
- **Tokens:** `styles.css` is the Tailwind entry — token values hand-written hex in `:root`/`.dark`
  (mirrored VERBATIM from the design source; no OKLCH re-encoding) + `@theme inline` mapping +
  named scales (radius knob, type, tracking, leading, t-shirt spacing). Consumers speak only
  semantic utilities (`bg-card`), never raw hex — the web↔native seam.
- **shadcn:** `bunx shadcn@latest add <name>` in `ui` — **primitives ONLY**; one `components.json`,
  never one in `apps/web`; assemble organisms by hand; re-export from `src/index.ts`.
- **Storybook:** framework `@storybook/nextjs-vite` (mocks `next/*`; a story sets the route via
  `parameters.nextjs.navigation.pathname`); global `autodocs` + `addon-a11y` + `addon-mcp`
  (served over `storybook:dev` :6006).
- **May import:** cva/clsx/tailwind-merge, `radix-ui`, `lucide-react`, `react`, `react-use`
  (per-hook ESM, `.client.tsx` only), `next` **presentational modules only** (`next/link`,
  `next/navigation` — never `next/headers`/data APIs), `@kotodama/platform/api-client` **types
  only**, `@kotodama/platform/languages`. Never `@kotodama/core`, `platform/config`, `apps/*`.
- **Self-compose via RELATIVE paths** — the `@kotodama/ui` barrel is the external surface (ESM
  cycle risk); only `.stories.tsx` may import it.
- **`cn` = `twMerge(clsx(...))`** — wrap the final className so a consumer's `className` wins.
  Variants via `cva`; `tailwind-variants` only for a heavily slotted component.

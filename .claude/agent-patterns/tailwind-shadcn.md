# Tailwind v4 + shadcn/ui — correct-usage standard

**Purpose.** The operating rules for building *high-quality, maintainable, elegant, extensible*
React components with **Tailwind CSS v4 + shadcn/ui** on **Next.js 16 App Router + React 19**.
Written for both a senior engineer and an AI implementer. Opinionated, not a tutorial. Every rule
below rests on a primary-source claim verified 3-0 in the 2026 research pass (sources at the end);
confidence tiers and the one genuinely-contested choice are flagged inline.

> **The one-line mental model.** shadcn/ui is *not a library you install* — it is a way to **own**
> your component library. Utility soup lives **inside a small set of owned primitives**, authored
> once with a typed variant API; feature code consumes a clean, prop-based surface. "Too many
> classes" is a symptom of *skipping the primitive layer*, never a property of Tailwind.

---

## 1. Architecture — own-your-code, two tiers of components

- **shadcn components are copied into your repo, not an npm dependency** (`ui.shadcn.com/docs`,
  verbatim: *"This is not a component library. It is how you build your component library"*). There
  is no `shadcn-ui` in `package.json`. You customise by **editing the copied source directly** — not
  by wrapper hacks or style overrides.
- **Two distinct tiers — keep them apart:**
  - **primitives** (`Button`, `Input`, `Card`, `Dialog`…) — the copied-in shadcn surface. In a
    monorepo they live in a shared **`packages/ui`** (imported as `@workspace/ui`). Treat as
    *near-vendored*: edit deliberately, keep close to upstream so `shadcn diff` stays usable.
    Large-scale variant: keep base primitives in `ui/` and product-specific wrappers in a separate
    `design-system/` folder so upstream code never mixes with product logic.
  - **composed / feature components** — app-specific assemblies (a `LoginForm`, a `WordCard`) built
    *from* primitives. Live in the app (`apps/web/components`), never in the shared primitives package.
- **CLI routes correctly on its own** (`ui.shadcn.com/docs/monorepo`): `npx shadcn add login-01`
  installs `button/input/card` into `packages/ui` but the composed `login-form` into
  `apps/web/components`, wiring deps + imports. Driven by each workspace's `components.json` aliases
  — a convention, not a mechanically-enforced constraint (so lint/layering rules still earn their keep).
- **Wrap vs. fork** (⚠ *partly under-evidenced — treat as reasoned default, not doctrine*):
  **wrap** when you only add composition/props around unchanged behaviour; **fork (edit the source)**
  when you need to change the primitive's own markup/variants. Heavy forks make `shadcn diff`
  upgrades noisier — the cost you accept for full ownership.

## 2. Variant API — `cva` is the standard; make it feel prop-based

`class-variance-authority` (`cva.style`) is the settled default. It turns utility strings into a
**typed, prop-shaped API** — the thing that makes a shadcn `<Button variant size>` feel like a
Chakra component prop, while compiling to *static* classes.

```tsx
// packages/ui/button.tsx
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from './cn'

const button = cva(
  // base — always applied
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50',
  {
    variants: {
      variant: {
        solid: 'bg-primary text-primary-foreground hover:bg-primary/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
      },
      size: { sm: 'h-8 px-3', md: 'h-9 px-4', lg: 'h-10 px-6' },
    },
    // applied only when BOTH conditions hold (array = multiple targets)
    compoundVariants: [{ variant: ['solid', 'outline'], size: 'lg', class: 'text-base' }],
    // fallbacks when a prop is omitted → the "it just works" default
    defaultVariants: { variant: 'solid', size: 'md' },
  },
)

export type ButtonProps = React.ComponentProps<'button'> & VariantProps<typeof button>

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(button({ variant, size }), className)} {...props} />
}
```

Rules: `base` first; one axis = one `variants` key; use `defaultVariants` so the common case needs
no props; `compoundVariants` for cross-axis rules (never duplicate a class across single variants);
export `VariantProps<typeof …>` so consumers get autocomplete + type-safety.

**⚠ The one genuinely-contested choice — `cva` vs `tailwind-variants`.** Confirmed by cva's *own*
docs (not just the competitor's matrix): `cva` **lacks built-in Tailwind conflict resolution**
(needs external `tailwind-merge`) and **has no `slots`** for multi-part components. `tailwind-variants`
bundles both. Guidance:
- **Default to `cva`** — it is what shadcn ships, simpler, and matches every copied-in component.
- **Reach for `tailwind-variants`** only for heavily **multi-part** components where you'd otherwise
  hand-roll several coordinated `cva` calls (its `slots` API is the real differentiator).
- Don't mix both in one package without a reason; consistency beats marginal ergonomics.

## 3. `cn()` — non-negotiable, `twMerge(clsx(...))`

```ts
// packages/ui/cn.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))
```

- `clsx` handles conditional/array class inputs; **`tailwind-merge` resolves conflicts last-wins**.
  Without it, `px-2` and `px-4` both survive and *CSS source order* (not your intent) decides —
  cva's own Tailwind guide admits this margin of error and recommends wrapping output in `twMerge`.
- **Always** wrap final class output in `cn(...)`, and put the consumer's `className` **last** so it
  can override the component's defaults predictably. **Skipping `cn` is a named anti-pattern.**

## 4. Composition & polymorphism — Radix `asChild` / `Slot`

- `asChild` (`radix-ui .../guides/composition`, verbatim): *"When `asChild` is set to `true`, Radix
  will not render a default DOM element, instead cloning the part's child and passing it the props
  and behavior required to make it functional."* It merges `className`/handlers/`aria-*`/`ref` onto
  the child. **Prefer this over an `as` prop** for polymorphism (no prop-drilling a tag type).

```tsx
// A Button that renders as a Next <Link>, keeping button styling + behaviour
<Button asChild>
  <Link href="/words/ja/言葉">言葉</Link>
</Button>
```

- **Nuance:** in the merge the **child's own props win** over the Slot's — so a child's `onClick`
  overrides, it doesn't stack. To support `asChild` in your own primitive, render `Slot` instead of
  the default element when `asChild` is true.
- **Compound components** (`Card` + `Card.Header`…): the 2026-current shadcn approach is plain
  sub-components sharing styling via **`data-slot` attributes** (added to every primitive in the v4
  update) + `cn`, rather than context-heavy machinery. `tailwind-variants` `slots` is the alternative
  when the parts need coordinated variants (see §2). *(Which is "the" standard for multi-part is an
  open question — the capability gap is settled, the single recommendation is not.)*

## 5. Design tokens & theming — Tailwind v4 `@theme`, semantic layer

Tailwind v4 tokens are **CSS-first** and dual-purpose (`tailwindcss.com/docs/theme`): a variable in
`@theme` both **emits a real CSS custom property** (your semantic-token layer, usable in
`var(--…)`/arbitrary values) **and** generates the matching utility class. This is how you get
Chakra-style *structured semantic theming* instead of magic hex values.

shadcn's v4 pattern (`ui.shadcn.com/docs/tailwind-v4`): raw values as CSS variables in `:root`/`.dark`
(moved **out** of `@layer base`), surfaced to utilities via **`@theme inline`** mapping. Dark mode =
remap the same variable names under `.dark`; components never change.

```css
/* app/globals.css */
@import 'tailwindcss';

:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.15 0 0);
  --primary: oklch(0.55 0.2 260);
  --primary-foreground: oklch(0.98 0 0);
  --ring: oklch(0.55 0.2 260);
}
.dark {
  --background: oklch(0.15 0 0);
  --foreground: oklch(0.98 0 0);
  /* … same names, remapped values */
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-ring: var(--ring);
}
```

- **Speak semantic intents** (`bg-background`, `text-foreground`, `bg-primary`) in components —
  **never raw hex/oklch** at the call site. This is the drift-proof seam.
- **⚠ Two qualifications (the only 2-1 votes in the research):** by default Tailwind v4 **prunes
  unused `@theme` tokens** from output — opt into `@theme static` if you need them all emitted. And
  `@theme inline` **bakes resolved values**, which can break dark mode — that's exactly why shadcn
  maps variables *without* an `hsl()` wrapper. So "all tokens at `:root` automatically" is true only
  for *used* tokens by default.

## 6. Tailwind v4 config — what changed from v3

- **No `tailwind.config.js`** — configure in CSS via `@theme` (JS config survives only as a
  back-compat escape hatch behind `@config`).
- **One import** — `@import "tailwindcss"` replaces the three v3 `@tailwind base/components/utilities`
  directives.
- **shadcn is fully updated for v4** and its CLI initialises new projects on v4. Two v4-era shadcn
  changes to know: **`forwardRef` removed** from all primitives (React 19 makes `ref` a normal prop)
  and a **`data-slot` attribute added to every primitive** (styling/targeting hook). Non-breaking:
  existing v3/React-18 apps keep working.

## 7. RSC / App Router boundaries — precise discipline

From Next 16 docs (`nextjs.org/.../server-and-client-components`, stamped v16.2.10):

- **Server Components by default.** Layouts and pages are SC unless a boundary says otherwise.
- **`'use client'` is a *module-graph boundary*, not a per-file tax.** Placed at the top of a file, it
  pulls that file's imports and the components it *directly renders* into the client bundle — **you
  do not repeat it on children.**
- **SC can be passed *through* a CC as `children`/props and stay server-rendered** — they are not
  imported into the client module graph; they arrive as already-rendered output. This is what lets a
  server layout wrap a client island without dragging server code client-side.
- **Push `'use client'` down to the interactive leaf.** Mark the small `Search` island, not the whole
  layout — minimises client JS. A styled primitive with no interactivity (`Card`, `Badge`) can stay a
  Server Component; only genuinely interactive ones (`Dialog`, `Popover`, anything with hooks/handlers)
  need `'use client'`.

## 8. Zero-runtime, hydration & a11y

- **Zero runtime** *(medium confidence — inferred from confirmed claims)*: Tailwind emits static
  utility CSS and `cva` composes strings — **there is no runtime style engine to serialise and
  hydrate**. That is precisely the mechanism absent from Emotion/runtime-CSS-in-JS, so this stack
  **sidesteps the Chakra/Emotion + Turbopack hydration-mismatch class of bugs** by construction.
- **Accessibility is inherited from Radix primitives** (focus management, ARIA, keyboard) — shadcn
  composes over them. Don't reimplement a11y you get for free; when you `asChild`, preserve the
  merged `aria-*`/handlers.
- **Testing** *(open question — no primary source survived verification)*: the community norm is
  React Testing Library for behaviour + `jest-axe`/`axe-core` for a11y assertions; verify current
  guidance before standardising.

## 9. Anti-patterns → the discipline that avoids "class soup"

*(Synthesised as the inverse of the confirmed correct-usage patterns — medium confidence, but each
maps to a verified rule above.)*

| Anti-pattern | Why it rots | Correct move |
|---|---|---|
| Utility strings inlined in **feature code** | scatters style logic, no reuse, unreadable JSX | extract a primitive; centralise classes in `cva` (§1–2) |
| Skipping **`tailwind-merge`** | conflicting utilities both survive → source-order wins, overrides unpredictable | always `cn(...)`, consumer `className` last (§3) |
| Overusing **`@apply`** | breaks utility-first, inflexible, grows CSS bundle; "variants don't work as expected in v4" | compose via components + `cva`, not `@apply` |
| **Magic hex/oklch** at call sites | theme drift, no dark mode | reference `@theme` semantic tokens (§5) |
| `'use client'` on **large subtrees** | bloats client bundle | push the directive to interactive leaves (§7) |
| Ad-hoc one-off variants sprinkled per usage | untyped, undiscoverable | add a typed `variants` entry so it's a prop (§2) |

## 10. DX vs Chakra — honest parity map

*(Medium confidence — synthesised against general Chakra knowledge; no Chakra primary source survived.)*

| What you value in Chakra | shadcn + Tailwind v4 |
|---|---|
| Prop-based composition (`<Button variant>`) | ✅ via `cva` typed variants — same *feel*, static output |
| Structured semantic theming | ✅ `@theme` CSS-var tokens (arguably cleaner: one token layer, no runtime) |
| Composition / polymorphism (`as`/`asChild`) | ✅ Radix `asChild`/`Slot` |
| Accessible primitives out of the box | ✅ Radix |
| Rich **hooks utilities** (`useDisclosure`, `useColorMode`, style props `mt={4}`) | ❌ **no equivalent** — no batteries-included hooks lib, no runtime style props; you add libs or write them |
| Great docs | ≈ good, but "own the code" means less "look up the prop", more "read your source" |

**Migration reality (Chakra → shadcn):** design **tokens map over conceptually** (Chakra theme scale
→ `@theme` variables); Radix + shadcn cover the accessible primitives; but **component-level logic,
any `mt={4}`-style prop usage, and every Chakra hook (`useDisclosure`, `useColorMode`, …) must be
rebuilt**. It is not a codemod — it's a re-authoring of the design-system leaf. *(Effort estimate is
an open question — directionally clear, no concrete primary-source figure.)*

---

## Kotodama fit (project-specific)

This maps cleanly onto the existing FE layering (`frontend-layering.md`): a Chakra→shadcn move
**swaps the styling engine *inside* `packages/ui`** while the tier contract is unchanged —
`packages/ui` stays the web-only leaf, components still take **primitive props** (`WordCard(word,
status)`, never a domain model), and the **semantic-token contract** (`bg.canvas`/`fg.default`) is
exactly what `@theme` tokens formalise. The agnostic spine (`api-client ◄ repositories ◄ store`) is
untouched. Net: the blast radius is `packages/ui` + `apps/web` render layer, not the
spine — the same boundary F-PLAT-014 was built to protect. Zero-runtime also **retires the
`--webpack` constraint** from F-PLAT-016 (no Emotion → Turbopack is back on the table).

## Confidence & open questions

- **HIGH (settled, 3-0 vs primary docs):** own-your-code model, monorepo/CLI routing, `cva` variant
  API, `cn` necessity, Radix `asChild`, `@theme` tokens, v4 config changes, official stack support,
  RSC boundary rules.
- **The one live debate:** `cva` vs `tailwind-variants` (incumbent simplicity vs native slots +
  conflict resolution).
- **MEDIUM / inferred:** the zero-runtime→no-hydration-bug causality, the anti-pattern enumeration,
  the Chakra comparison — well-reasoned, not independently source-verified.
- **Open (under-evidenced):** concrete testing conventions; the precise wrap-vs-fork boundary; the
  single standard for multi-part compound components; real Chakra→shadcn migration cost.

## Sources (primary unless noted)

- shadcn/ui — https://ui.shadcn.com/docs · /monorepo · /tailwind-v4 · /react-19
- Tailwind v4 — https://tailwindcss.com/docs/theme · /blog/tailwindcss-v4 · /docs/upgrade-guide
- cva — https://cva.style/docs · /getting-started/variants/
- tailwind-variants — https://www.tailwind-variants.org/docs/comparison
- Radix — https://www.radix-ui.com/primitives/docs/guides/composition
- Next.js — https://nextjs.org/docs/app/getting-started/server-and-client-components
- Practitioner (blog, corroborating): joshwcomeau.com/react/css-in-rsc · webdong.dev tailwind-merge & anti-patterns · makersden.io react-ui-libs-2025

# Tailwind v4 + shadcn/ui — correct-usage standard

**Purpose.** Project-specific rules for building components with **Tailwind CSS v4 + shadcn/ui** on
**Next.js 16 App Router + React 19**. The standard shadcn/cva/`cn`/Radix/`@theme`/RSC mechanics are
assumed known — only what's specific to Kotodama survives here.

## Package naming & CLI routing

- In this monorepo the shared UI package is **`ui/` (`@kotodama/ui`)** — **NOT** shadcn's default
  `@workspace/ui`. The CLI routes primitives (`button`/`input`/`card`) into `ui/`.
- There is **no `apps/web/components.json`** — composed blocks (e.g. a `login-form`) are assembled
  by hand rather than dropped in by the CLI.

## The one live decision

**Default to `cva`** — it is what shadcn ships, simpler, and matches every copied-in component.
**Reach for `tailwind-variants`** only for heavily **multi-part / slotted** components where you'd
otherwise hand-roll several coordinated `cva` calls (its `slots` API is the real differentiator).
Don't mix both in one package without a reason.

## Kotodama fit (project-specific)

This maps cleanly onto the existing FE layering (`frontend-layering.md`): a Chakra→shadcn move
**swaps the styling engine *inside* `ui`** while the layer contract is unchanged —
`ui` stays the web-only leaf, components still take **primitive props** (`WordCard(word,
status)`, never a domain model), and the **semantic-token contract** (`bg.canvas`/`fg.default`) is
exactly what `@theme` tokens formalise. The agnostic spine (`platform/api-client ◄ core/repositories ◄
core/store`) is untouched. Net: the blast radius is `ui` + `apps/web` render layer, not the
spine — the same boundary F-PLAT-014 was built to protect. Zero-runtime also **retires the
`--webpack` constraint** from F-PLAT-016 (no Emotion → Turbopack is back on the table).

---
paths:
  - "ui/**"
  - "apps/web/**"
---

# Component design — policy-free frames, shaped from above

Applies to **every** React component. If React ever lands in a new tier (headless hooks in an
agnostic layer, or `apps/mobile`), extend `paths:` above.

> **A component owns only its look and its own advertised capability. Every other decision —
> behaviour, data, arrangement — it pushes UP to the composer.** Leaf frames stay policy-free; you
> build concrete, opinionated components ON TOP (`SearchCommandPalette` over `CommandPalette`).

Quality here is **reuse surface** — inverse to decisions baked in (deep module in JSX). A component
that renders can still be low-quality if a second caller must fight a baked-in default.

## Project-specific moves

- **Report, don't decide** — an event handler hands back *what happened* (`onSelect(item)`); the
  caller owns close/clear/navigate.
- **The composer owns OUTER spacing.** A frame sets margin/padding ONLY for its own internal
  correctness; any gap that changes per page/context (between siblings, page insets) is the
  parent's, applied by stacking slots. Same frame reuses at any rhythm. *(A recurring failure mode —
  do not bake `mt-16`/`pb-20` into a frame's root.)*
- **Inject data, never hard-code a domain list/current value** — required `current`/`items` props;
  curated stand-ins live in `fixtures/`.
- **Own what you advertise** — the listener for a shortcut lives in the component showing the badge.
- **Frame + composition** — a primitive slots `children`; concrete rows/organisms compose above.
- **Extract on drift, not on sight** — a recipe earns a primitive when duplicated AND diverging.
- **Name for what mounts in prod**; keep a test-only harness unexported.

## Two tiers

- **kit** (`components/{atoms,molecules,organisms}/`) — domain-FREE, **abstract names** (`Chip`,
  `ListRow`, `CommandPalette`); never names a Kotodama entity.
- **domain** (`components/{core,features}/`) — wraps the kit around entities, **concrete names**
  (`WordCard`, `WordEntry`). **A name that lies about its tier is a bug.**
- **`features/` is the assembly point, configured by semantic namespaced props** (`word={{…}}`,
  `search={{…}}`). Assembly lives ONCE in `ui` + Storybook — the app resolves data + injects
  Actions but NEVER re-assembles, so a design change never touches `apps/web`.

Worked bad→good examples: `.claude/agent-patterns/component-design.md` (on-demand).

---
paths:
  - "ui/**"
  - "apps/web/**"
---

# Component design — policy-free frames, shaped from above

**Path-scoped rule (`ui/**`, `apps/web/**`).** One principle governs **every React component,
wherever it lives.** Today React is confined to `ui` + `apps/web` (the DOM-free spine forbids it
below — `core/store` is React-free, `frontend-state.md`), hence the paths. **Maintenance:** if
React ever spreads to a new tier — headless hooks/`Provider`s in an agnostic layer, or a native
presentation tier (`apps/mobile`) — this principle applies there too; **extend `paths:` above.**

The principle:

> **A component owns only its look and its own advertised capability. Every decision —
> behaviour, data, arrangement — it pushes UP to the composer.** Leaf frames stay
> policy-free; you build progressively more concrete, opinionated components ON TOP of them
> that give them shape (`SearchCommandPalette` over `CommandPalette`, `WordCommandItem` over
> `CommandPaletteItem`, `CommandFab` over `Button`).

Quality here is **reuse surface**, and it is inverse to the number of decisions baked in. A
component that renders correctly can still be low-quality: if a *second* caller would have to
fight a baked-in default, sync two parallel channels, or fork to feed other data, it decided too
much. This is `ui ⊥ core` (`frontend-layering.md`) taken to its end and Ousterhout's deep
module (`design-principles.md`) in JSX form: a small, unopinionated interface over a component
that absorbs its own mess.

## The recurring smell → the move

| Smell (a decision baked into the component) | The move |
|---|---|
| A helper runs a fixed behaviour on an event (`run` closes+clears on pick) | **Report, don't decide** — `onSelect(item)` hands back what happened; the caller owns close/clear/navigate |
| Internal `useState` for a value a caller must observe (`query`) | **Controlled prop** — lift it; the component reads/writes, the caller owns it |
| Two parallel arrays + two callbacks (`actions`+`words`, `onSelect`+`onGenerate`) | **One discriminated union** — tag by `entity`; the same type is the `onSelect` payload |
| The primitive renders concrete rows itself; a new group means widening it | **Frame + composition** — the frame slots `children`; concrete rows/organisms compose above |
| A hard-coded domain list / current value inside presentation (`DEFAULT_LANGUAGES`) | **Inject data** — required `current`/`items` props; curated stand-ins live in `fixtures/` |
| A capability wired in the shell but advertised by the component (⌘K badge vs listener) | **Own what you advertise** — the listener lives in the component showing the shortcut |
| An organism reaching into specific molecules to self-fill (`variant="controls"`) | **Slot host** — the frame owns none of the molecules; the composer fills the slots |
| A visual/layout recipe copy-pasted across call sites, starting to drift | **Extract a primitive** — component for *structure* (`SiteContainer`), utility for a pure visual recipe |
| Raw markup reinventing an existing variant (a `<button>` re-doing `Button accent`) | **Extract a molecule** on the primitive — inherit its focus ring, press, a11y |
| A test-only harness exported / named as if it were the prod piece | **Name for what mounts in prod**; keep the harness unexported |

## The taste gate (both directions)

- **Slot granularity is exactly what the composer's arrangement needs — no more.** Keep named
  slots when positions carry distinct meaning a single `children` can't place; collapse to one
  opaque slot the moment the composer can arrange them itself (e.g. via `<Show>`). Don't
  pre-split, don't over-merge.
- **Extract on drift, not on sight.** A recipe earns a primitive when it is duplicated AND has
  begun to diverge — not the first time it appears twice.
- **YAGNI on the API shape.** Model the axis that exists (`<Show on>` is binary — one `md`
  line), not the one that might.

## The two tiers: domain-free kit → domain compositions

The policy-free principle has a home in the folder tree (`frontend-layering.md`). The **kit**
(`components/{atoms,molecules,organisms}/`) is domain-FREE and portable — generic props, **abstract
names** (`Chip`, `ListRow`, `CommandPalette`); it never names a Kotodama entity. The **domain layer**
(`components/{core,features}/`) wraps the kit around business entities with **concrete names**
(`WordCard`, `TierChip`, `WordEntry`) — `core/` = entity blocks, `features/` = large compositions.

- **A name that lies about its tier is a bug.** An abstract name (`ResultRow`) on an entity-bound
  piece hides the domain; a concrete name (`WordChip`) on a generic frame blocks reuse. Kit → abstract,
  domain → the entity.
- **`features/` = the assembly point, configured by semantic namespaced props.** A big feature node
  groups its props by domain concern — `word={{ value, onSave }}`, `search={{ query, onChange }}` —
  each namespace named for the entity it carries, so a caller reads *what* to pass at a glance. The
  node owns the whole composition; **the app only resolves data + injects Server Actions** (the
  Container/Presentational seam). Assembly lives ONCE in `ui` + Storybook — the app never re-assembles,
  so a design change never touches `apps/web`.

## Canonical names (shared vocabulary)

Several moves are named React patterns ([patterns.dev/react](https://www.patterns.dev/react/)) —
use the names in review:

- **Container / Presentational** — the whole `ui ⊥ core` split: `apps/web` (container) resolves
  data + owns policy, `ui` (presentational) is pure props. Our end-state of every move.
- **Compound components** — the frame + slotted children move (`CommandPalette` +
  `CommandPaletteGroup`/`CommandPaletteItem`): parts composed as `children`, the frame coordinates.
- **Controlled props** — lifting `query`/`open` so the caller owns them.
- **Provider / Context** — for a genuinely cross-cutting concern (theme, a live client), NOT
  prop-drilled. This is also the shape agnostic React logic takes if it ever lands below `ui`
  (headless hooks + a `Provider`) — still policy-free, still shaped from above.
- **Slots (`ReactNode`) over render props** — prefer a `ReactNode` slot (`controls`, `trailing`,
  `children`) for arrangement; reach for a render prop only when the frame must hand the child its
  own internal state. Prefer **custom hooks / compound** over **HOCs** (legacy — hooks supersede).

Worked bad→good examples from real commits: **`.claude/agent-patterns/component-design.md`**
(on-demand — read it when reshaping a component or auditing one for these smells).

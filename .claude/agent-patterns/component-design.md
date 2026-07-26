# Component design — worked bad→good (policy-free frames)

**On-demand reference** (pointer-loaded from `.claude/rules/frontend-components.md`; NOT
auto-loaded). Nine moves, each a real `@kotodama/ui` refactor (F-PLAT-017). The rule states the
principle; this file is the *before/after* so the pattern is recognisable in new code and in an
audit. Snippets are trimmed (`…`) to the load-bearing lines.

> **The through-line:** every move *removes a decision from the component and hands it to the
> composer*. Then a more concrete component is built ON TOP to give the frame its shape. A `ui`
> component that renders correctly but decides for its caller is "good but not excellent" — the
> second caller pays for the first caller's convenience.

---

## Stratified design — build by composing the tier below

The design system is a stack of vocabularies, each composed by the tier above (Abelson–Sussman;
SICP §2.2.4): shadcn primitives ◄ the domain-free **kit** (`atoms/molecules/organisms`) ◄ the
**domain** tier (`core/features`) ◄ `templates/pages`; the app injects data (RSC loaders) + actions,
never re-assembling. Build a screen as a **composition of the tier below** — the nine moves are all
"peel the concrete out, compose it back on top" — so the further up you build the less markup you add.

- **Reuse first.** Reach for an existing kit atom/molecule (and `react-use` for a client hook) before
  hand-rolling; a raw `<button>` re-doing `Button` drops its a11y (move 9). Library primitives are
  tested + documented — prefer them.
- **Compose your own on top, kept small.** New components sit over the kit as single-purpose frames
  that slot `children`; a concrete organism composes them (move 4).
- **Extract late.** Name what a recipe becomes for the next composition, but **extract on drift, not
  on sight** (`frontend-components.md`) — duplication is cheaper than the wrong frame; one caller ⇒ inline.

---

## 1. Report, don't decide — no baked-in behaviour

The palette baked in a `run` helper that closed + cleared on every pick. A caller wanting a
non-closing row had to fight it.

```tsx
// ✗ BEFORE — the component decides what a pick means
const close = () => { onOpenChange(false); setQuery('') }
<CommandItem onSelect={() => { close(); onSelect(row.href) }}>
```
```tsx
// ✓ AFTER — the component reports WHICH item; the caller decides
<CommandPaletteItem onSelect={() => onSelect(item)}>
// caller (site-chrome): owns the policy
const handleSelect = (item: PaletteItem) => {
  setPaletteOpen(false); setPaletteQuery('')
  if (item.entity === 'word') { router.push(item.word.href); return }
  switch (item.action.id) { /* navigate / dispatch */ }
}
```

**Lesson:** a leaf reports an event; it does not enact a workflow. Close, clear, navigate, and
dispatch are the composer's — so the same frame serves a closing palette and a non-closing one.

---

## 2. Controlled prop over internal state a caller must observe

`query` lived in the palette's `useState`, so nothing above could drive a backend word search
off it.

```tsx
// ✗ BEFORE
const [query, setQuery] = useState('')
```
```tsx
// ✓ AFTER — lifted; the component reads/writes, the caller owns it
query: string
onQueryChange: (query: string) => void
```

**Lesson:** if a value must be *observable or drivable from above*, it is a controlled prop, not
internal state. (Uncontrolled is fine only when no one above ever needs to see it.)

---

## 3. One discriminated union over parallel channels

Two lists + two callbacks forced the caller to keep two selection channels in sync.

```tsx
// ✗ BEFORE — actions and words are separate; only a word's href comes back
words: readonly SearchWordView[]
onSelect: (href: string) => void
onGenerate: (query: string) => void
```
```tsx
// ✓ AFTER — one tagged list; the SAME type is the onSelect payload
export type PaletteItem =
  | { entity: 'action'; action: CommandAction }
  | { entity: 'word'; word: SearchWordView }
items: readonly PaletteItem[]
onSelect: (item: PaletteItem) => void   // hands back the whole item, not a bare href
```

**Lesson:** when a caller builds "an X or a Y" and reads back "which one", make it *one*
discriminated type, reused verbatim as the payload. Parallel arrays/callbacks are a sync bug
waiting to happen (make illegal states unrepresentable).

---

## 4. Frame + composition — peel the concrete out of the primitive

`CommandPalette` rendered the ⌘K rows itself, so any new group (a CTA, a domain filter) meant
widening the primitive (the OCP smell).

```tsx
// ✗ BEFORE — the primitive knows about words + generate rows
export function CommandPalette({ words, onSelect, onGenerate }) {
  return <CommandDialog>…{words.map(…)}…{trimmed && <GenerateRow/>}…</CommandDialog>
}
```
```tsx
// ✓ AFTER — an agnostic frame that slots children…
export function CommandPalette({ query, onQueryChange, shouldFilter, children }) {
  return <CommandDialog>…<CommandList>{children}</CommandList>…</CommandDialog>
}
// …with composable rows (CommandPaletteItem / CommandPaletteGroup)…
// …and a concrete organism built ON TOP that gives it shape:
export function SearchCommandPalette({ items, onSelect }) {
  const actions = items.filter(i => i.entity === 'action')
  const words   = items.filter(i => i.entity === 'word')
  return <CommandPalette …>{/* Actions group + Words group */}</CommandPalette>
}
```

**This is the layering in one file:** `CommandPalette` (frame, zero policy) ◄ `CommandPaletteItem`
(row look) ◄ `WordCommandItem` (word specialisation) ◄ `SearchCommandPalette` (app shape). Each
tier adds exactly one opinion. The bare frame stays available for a bespoke composition.

**Lesson:** when "a new variant" means editing the primitive, you have a frame pretending to be a
concrete component. Split: a `children`-slotting frame + concrete compositions above it.

---

## 5. Inject data — presentation never owns a domain list

`LanguageMenu` hard-coded `DEFAULT_LANGUAGES` and "Spanish"/"ES", so it couldn't track app state.

```tsx
// ✗ BEFORE — the list + current value live inside the component
const DEFAULT_LANGUAGES = [{ label: 'Spanish', available: true }, …]
export function LanguageMenu({ languages = DEFAULT_LANGUAGES }) {
  return …<span>Spanish</span>… // current is hard-coded
}
```
```tsx
// ✓ AFTER — required props; no default; the checked row matches `current`
export function LanguageMenu({ current, languages, onSelect, compact }) { … }
// curated stand-in moves to fixtures/ (design-stage, until a backend source lands)
export const LANGUAGE_OPTIONS_MOCK = [{ code: 'ES', label: 'Spanish' }, …]
```

**Lesson:** presentation must not decide *what is offered*. Make data a required prop; put the
design-stage stand-in in `fixtures/` (stories and the app feed it identically). Note the bonus
cut: `available` + its "not available yet" toast were **dropped** — the composer filters the list,
so the menu is a pure switcher (define errors out of existence).

---

## 6. Own what you advertise

`CommandTrigger` shows the ⌘K badge, but the key listener was duplicated in two shells.

```tsx
// ✗ BEFORE — the badge is here, the listener is (twice) in the shells
// site-chrome.client.tsx AND story-shell: useKey(… 'k' … , toggle)
export function CommandTrigger({ onOpen }) { return …<Kbd>⌘K</Kbd>… }
```
```tsx
// ✓ AFTER — the component that shows the shortcut owns it; generalised
export function CommandTrigger({ label, shortcut, onTrigger }) {
  useKey(e => (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === shortcut.toLowerCase(),
         e => { e.preventDefault(); onTrigger?.() })
  return …<Kbd>⌘{shortcut.toUpperCase()}</Kbd>…
}
```

**Lesson:** the source of truth for a capability lives where the capability is *advertised* — one
listener, no shell re-implements it. Generalising (`'k'` → any `shortcut`) fell out for free once
it stopped being hard-wired.

---

## 7. Slot host, at the right granularity

`SiteHeader` had `variant="controls"` that reached into three specific molecules — an organism
coupling to molecules, existing only for the Storybook shell's convenience.

```tsx
// ✗ BEFORE — the header self-fills by importing molecules
const commandSlot = commandTrigger ?? (filled ? <CommandTrigger …/> : null)
const languageSlot = languageMenu ?? (filled ? <LanguageMenu/> : null) // + ModeMenu…
```
```tsx
// ✓ STEP 1 — pure slot host: named ReactNode slots, header owns no molecule
commandTrigger?: ReactNode; languageMenu?: ReactNode; languageBadge?: ReactNode; themeMenu?: ReactNode
// ✓ STEP 2 — once <Show> lets the composer place things, collapse to one opaque slot
controls?: ReactNode   // composer gates each control with <Show on="desktop|mobile">
```

**Lesson — the taste gate cuts both ways.** Named slots were *kept* while positions carried
distinct meaning (desktop cluster vs compact mobile badge), then *collapsed* to one `controls`
once the composer could arrange them itself. Slot granularity = exactly what the arrangement
needs. Don't pre-split; don't over-merge.

---

## 8. Extract a primitive on drift — and pick the right kind

The site width recipe (`mx-auto max-w-[1160px] px-5 md:px-10`) was copy-pasted across five sites
and had **already drifted** (header switched gutter at `lg`, `<main>` at `md`).

```tsx
// ✗ BEFORE — the recipe, five times, diverging
<div className="mx-auto max-w-[1160px] px-5 lg:px-10">   // header
<main className="mx-auto max-w-[1160px] px-5 md:px-10">  // page — different breakpoint!
```
```tsx
// ✓ AFTER — one owner; each site adds only its own extras
export function SiteContainer({ as, className, ...props }) {
  const C = as ?? 'div'
  return <C className={cn('mx-auto max-w-[1160px] px-5 md:px-10', className)} {...props} />
}
<SiteContainer className="flex h-14 md:h-[76px]">…</SiteContainer>
<SiteContainer as="main" className="pb-…">…</SiteContainer>
```

Companion move — `<Show>` replaced `md:hidden` / `hidden md:…` sprinkled at call sites, toggling
`display: contents` so the wrapper adds **no layout box**.

**Lesson:** extract when duplication has begun to *drift*, not on first repeat. Choose the kind:
a **React component** for a structural composition primitive (one place in the tree to find,
change, delete), a **Tailwind `@utility`** only for a purely visual recipe (like `.kdm-grain`).

---

## 9. Extract a molecule over raw markup that reinvents a variant

The mobile FAB was a raw `<button>` copy-pasted into two shells, re-doing `Button accent` and
dropping its focus-visible ring and active-press feedback.

```tsx
// ✗ BEFORE — raw button, loses the design-system affordances
<button className="… rounded-full bg-seal text-seal-foreground shadow-hero md:hidden">
  <PlusIcon/></button>
```
```tsx
// ✓ AFTER — a molecule on the primitive; owns its viewport-pinned identity
export function CommandFab({ onOpen }) {
  return <Button variant="accent" size="icon-lg" onClick={onOpen}
    className="fixed right-[18px] bottom-[76px] z-50 … md:hidden"><PlusIcon/></Button>
}
```

**Lesson:** never hand-roll markup that an existing variant already gives — you silently drop its
a11y and interaction states. Extract a molecule on the primitive. Note it *owns* its fixed
positioning + `md:hidden` (being viewport-pinned is its identity), while `CommandTrigger` is laid
out by the header — each owns what is intrinsic to it.

---

## Bonus — name for what mounts in production

`SiteShell` named a Storybook-only assembly while the real outer scaffold was copy-pasted into the
app layout. Fixed: the **scaffold** (the piece the app mounts) takes the `SiteShell` name; the
Storybook harness is renamed `StoryShell` and left **unexported** from the barrel, so app code
can't reach the stubbed-navigation shell by accident. Same commit's sibling: `ModeMenu` →
`ThemeMenu` ("mode of what?" — the code symbol was the smell; the visible "Color mode" copy, being
accurate end-user text, stayed).

**Lesson:** the production-mounted piece earns the canonical name; test-only harnesses are named
as such and kept off the public surface. Rename the ambiguous *symbol*, not the correct *copy*.

---

## The moves as named React patterns

Named in review the intent carries — but only the repo-anchored mappings earn a line:

- **Container / Presentational** is the end-state of every move and IS `ui ⊥ core`: `apps/web`
  resolves data + owns policy; `ui` is a pure function of props.
- **Compound components** — move 4 (`CommandPalette` + `CommandPaletteGroup`/`Item`): the canonical
  name for "frame + composition."
- **Slots over render props** — moves 1/7: arrange with `ReactNode` slots, not render props; prefer
  hooks/compound over HOCs. Reach for a render prop only when the frame must hand the child its own
  internal state. The reusable client-hook default is `react-use` (`react-use.md`).

**Provider / Context — not used yet** (YAGNI; `theme` rides one prop). Reach for it only for a
genuinely cross-cutting concern (theme, a live client, an auth session), never to dodge one level of
props; it stays policy-free and shaped from above. It is also the shape agnostic React logic would
take if React ever lands *below* `ui` (a headless tier a future `apps/mobile` shares) — then extend
`frontend-components.md`'s `paths:` to that tier.

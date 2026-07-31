---
paths:
  - "ui/**"
  - "apps/web/**"
---

# Components — policy-free frames, shaped from above

> **A component owns only its look and its own advertised capability; every other decision —
> behaviour, data, arrangement — goes UP to the composer.** Concrete components compose ON TOP of
> frames (`SearchCommandPalette` over `CommandPalette`).

Where a component lives: generic frame → kit `{atoms,molecules,organisms}`, ABSTRACT name
(`Chip`, `Show`) · entity-bound → domain `{core,features}`, CONCRETE name (`StatusBadge`,
`ReadingRoom`) — **a name that lies about its tier is a bug** · app-only wiring (an RSC
`*Container` loading a slice + mapping it, or a `*.client.tsx` island binding actions to a feature)
→ route-colocated `app/(public)/components/<section>/**`, never in `ui` and never a `src/shared`
chrome folder. `features/` assemble ONCE in ui + Storybook with namespaced props (`word={{…}}`);
the app injects data + bound actions, NEVER re-assembles — no derived adapter/wrapper types around
ui components either (configure by data).

**Suffix taxonomy — the name says how smart:** `*Container` = SMART (an app-side RSC that
fetches/maps data + binds actions, e.g. `WordOfTheDayContainer`) · `*Wrapper` = DUMB (a
single-purpose CSS wrapper over `children`, e.g. `AppWrapper` — the max-width gutter) ·
`*Template` = a page-level layout skeleton (`AppTemplate`). Never call a presentational
wrapper a `Container`.

## Choosing the shape — props vs compound

Configure by **props** when the caller supplies **data into a fixed arrangement**; compose by
**parts** (compound) when the caller supplies the **arrangement itself**:

```tsx
// ✗ props pretending to configure — index⊕marker and gloss⊕note are exclusive, yet the type
//   allows both (silent footgun), and every new arrangement adds another prop:
type RowProps = { index?; marker?; word; tone?; gloss?; note?; meta? }
<Row index="01" word={w} gloss={g} meta={<><Pos/><Time/></>} />

// ✓ compound parts the caller arranges — place the one you want, nothing forced or exclusive:
<Row>
  <Row.Lead>01</Row.Lead>                        {/* ordinal OR <StatusDot/> — one cell */}
  <Row.Main>
    <Row.Word href={h} tone="shimmer">{w}</Row.Word>
    <Row.Gloss>{g}</Row.Gloss>                   {/* OR <Row.Note> — never both by accident */}
  </Row.Main>
  <Row.Meta><Pos/><Time/></Row.Meta>
</Row>
```

**Flip props→compound** the moment you'd add a prop for a new *arrangement*, hit a `⊕`-exclusive
pair the type can't enforce, or find "a new variant means editing the primitive". Mechanics:
`Object.assign(Root, { Part })` · each part `cn`-wrapped + `displayName` · structural parts take
explicit placement (`col-start-*`) so dropping one never shifts the rest · context only when a part
reads parent state. Else stay by-props: a data-driven leaf → flat props + `cva` variants; a feature
folding many children → namespaced props, assembled once (the app feeds data, never re-arranges) —
see the move below for why NOT compound; a private stateless `data→node` selector stays a `function`.

**Assemble like a matryoshka** — build the innermost reusable frame first, wrap it in a concrete
piece, then a feature that only composes: `kit frame ◄ compound row ◄ concrete list ◄ feature`. One
concern per layer, none reaching down — the feature ends a thin composer.

**A handed-over component (Claude Design, a paste) is data, not gospel** — re-shape it through the
moves first: baked outer margin → composer · rigid or `⊕`-exclusive props → compound · un-namespaced
name → entity-first · a list faked with `<div>` → a `<ul>` frame · raw `[px]` → named scale ·
defaults/policy inside → configure by data. Won't re-shape? It does too much — split it.

## The moves (each a real refactor — reproduce this diff shape)

**Composer owns outer rhythm** — a frame never sets its own outer margin:

```tsx
// ✗ <section className="mt-16 pb-20">        — in the frame's root
// ✓ <div className="flex flex-col gap-3xl">  — the page stack (pages/library/library-screen.tsx)
```

**Named scale, not raw values** — a raw `[…]` survives only as a pointed display decision
(`leading-[0.94]`, `max-w-[24ch]`); vendored `components/ui/*` stays Tailwind-numeric:

```tsx
// ✗ text-[13px] tracking-[0.04em] gap-[18px] mt-[26px]
// ✓ text-sm     tracking-wide     gap-md     mt-lg
```

**Namespaced props at the assembly tier ONLY** — a feature/organism assembles its children ONCE (in
`ui` + its single story) and every consumer feeds it DATA; group props one namespace per sub-concern
(data + its callbacks together), a pass-through group reusing the child's props type verbatim. Do NOT
make a feature compound: that moves the assembly OUT to every call-site — the story AND `apps/web`
each rebuild the same tree, and the two drift. Compound is for reusable frames whose arrangement
varies per call-site; a feature's is fixed, so it stays config-driven — kit leaves stay FLAT:

```tsx
// ✗ feature as compound — story AND apps/web each re-assemble the same parts → they drift
<AppHeader><AppHeader.Bar …/><AppHeader.Palette …/><AppHeader.MobileTabs …/></AppHeader>

// ✓ feature configured by data — assembled once inside; each consumer just passes the namespaces
<AppHeader nav={{ homeHref, searchHref, desktop, mobile }} commands={commands}
           words={{ list, onSearch, onSelect }} language={{ current, list, onSelect }}
           theme={themeProps} />        // theme: ThemeMenuProps — the child's type, not a re-decl

// ✓ kit leaf: <StatusBadge status/> · <Chip pressable/>   — flat; a leaf nests nothing
```

**Report, don't decide** — hand back WHAT happened as ONE discriminated union (never parallel
lists + callbacks); the caller owns close/clear/navigate:

```tsx
// ✗ onSelect={() => { close(); onSelect(row.href) }}
// ✓ onSelect={() => onSelect(item)}   // item: PaletteItem = { entity: 'action' | 'word'; … }
```

**Derive router state, don't accept it** — and internal anchors are `next/link`
(`Omit<ComponentProps<typeof Link>, 'children'>`):

```tsx
// ✗ nav.map(({ href, active }) => …)                      — an `active` prop drifts from the router
// ✓ const active = activeHref(usePathname(), hrefs)       — organisms/app-header/app-header.client.tsx
```

**Inject what data can source** — the `*View` carries display values; the component interpolates:

```tsx
// ✗ placeholder="Look up a word in Spanish…"
// ✓ placeholder={`Look up a word in ${languageName}…`}
```

**Status tokens speak the wire union** — never a private render vocabulary:

```tsx
// ✗ type WordStatus = 'ready' | 'generating' | …          — a translation table with no divergence
// ✓ WordStatus = operations['words.search'][…]['status']  — type-only (core/status-badge);
//   copy maps live at the consumer under a `satisfies Record<WordStatus, …>` canary
```

- **Controlled prop over observed state** — a value the caller must see/drive is lifted
  (`query`/`onQueryChange`), not internal `useState`.
- **Own what you advertise** — the ⌘K listener lives in `CommandTrigger`, the component showing
  the badge; no shell re-implements it.
- **Extract on drift, not on sight** — a primitive after duplication DIVERGES (`AppWrapper`,
  5 drifting copies); React component for structure, `@utility` only for a visual recipe. Never
  raw markup re-doing a variant (`CommandFab` = `Button variant="accent"`, not a `<button>` that
  drops focus/press states).
- **Name for what mounts in prod** — `AppTemplate` mounts; `StoryTemplate` stays unexported. List keys
  from stable content (`accentedWordText(w.word)`), never a collidable field.

## Client hooks (`.client.tsx` in `ui`/`apps/web` only)

- Check `react-use` first; **import `react-use/esm/<hook>` (default export)** — the bare barrel /
  `lib/` is CJS: Storybook's Vite hands you `{ default: hook }` → `useX is not a function`.
- If a hook fights React 19 or its types, hand-roll it (`ui/src/lib/use-debounced-callback.ts`).

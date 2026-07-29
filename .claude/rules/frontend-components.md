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

**Namespaced props at the assembly tier ONLY** — when a feature/organism folds many components,
group props one namespace per sub-concern, data + its callbacks travelling together; a pass-through
group reuses the child's props type verbatim; kit leaves stay FLAT:

```tsx
// ✓ feature (AppChrome): nav: { homeHref, desktop, mobile } · words: { list, onSearch?, onSelect }
//                         · theme: ThemeMenuProps            — the child's type, not a re-declaration
// ✓ kit leaf (RankRow):   { index, word, gloss, meta }       — flat; no nesting a leaf never needs
```

**Report, don't decide** — hand back WHAT happened as ONE discriminated union (never parallel
lists + callbacks); the caller owns close/clear/navigate:

```tsx
// ✗ onSelect={() => { close(); onSelect(row.href) }}
// ✓ onSelect={() => onSelect(item)}   // item: PaletteItem = { entity: 'action' | 'word'; … }
```

**Derive router state, don't accept it** — and internal anchors are `next/link`
(`Omit<ComponentProps<typeof Link>, 'children'>`, see `core/rank-row`):

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
- **Frame + composition** — when "a new variant" means editing the primitive, split into a
  `children`-slotting frame + concrete pieces above (`CommandPalette ◄ CommandPaletteItem ◄
  WordCommandItem ◄ SearchCommandPalette`). Slot granularity = what the arrangement needs
  (`AppHeader` has ONE `controls` slot; the composer gates with `<Show>`).
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

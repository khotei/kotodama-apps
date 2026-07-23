---
paths:
  - "apps/web/**"
  - "ui/**"
---

# react-use — reach for it before hand-rolling a client hook

**Path-scoped rule (`apps/web/**`, `ui/**`).** The default is **use the library, not a bespoke
effect**: before writing ANY client-side React hook by hand — an interval, timeout,
debounce/throttle, event/key listener, media query, mounted-state guard, clipboard, `localStorage`,
geolocation, resize/intersection observer — check whether
[`react-use`](https://github.com/streamich/react-use) already provides it. It usually does, and a
maintained hook beats a hand-rolled `useEffect` you have to get right (subscribe once, latest
handler, teardown). When planning or writing any `.client.tsx`, sweep react-use first; hand-roll
only for the caveats below.

## Where it may live — any web-only (DOM-bound) package

- **The web-only leaves: `ui` and `apps/web`, in `.client.tsx` code only.** react-use is a
  convenience for the browser; both `ui` (the design system) and `apps/web` (the Next shell) are
  DOM-bound, so either may depend on it — declare `react-use` in that package's `package.json`
  (`catalog:react`) and import it in a client component.
- **NEVER the agnostic spine (`platform`/`core`) nor `server-only` code** (`src/server/**`
  loaders/actions). The spine is DOM-free — its `tsconfig.base.json` rejects react-use with a `tsc`
  error anyway; server code runs without a DOM. This is the one hard boundary.
- This does not change the seam: a client island still takes server-resolved data + injected Server
  Actions as props and reaches live data only through those (see `frontend-state.md`). react-use
  supplies the *mechanism* (the interval, the listener), never the data path.

## Import discipline — per-hook, not the barrel

- **Import `react-use/lib/<hook>` (default export), not `{ x } from 'react-use'`.** The package pulls
  ~13 transitive deps (`nano-css`, `screenfull`, `resize-observer-polyfill`, `copy-to-clipboard`,
  `js-cookie`, …); the per-hook path bundles only the one hook you use. Examples — the word poller:
  `import useInterval from 'react-use/lib/useInterval'` (`delay: null` pauses it); the ⌘K trigger:
  `import useKey from 'react-use/lib/useKey'` (predicate form for a modifier combo).
- **Look at the transitive weight before reaching for a heavy hook** (`useFullscreen` → `screenfull`,
  `useCss` → `nano-css`, `useMeasure` → `resize-observer-polyfill`). If a hook drags a big dep for a
  small need, hand-roll instead.

## Caveats — when to hand-roll anyway

- react-use is **semi-maintained** (community advises alternatives for greenfield) and **loosely
  typed** in places (`useInterval`'s callback is `Function`). If a hook misbehaves under React 19
  concurrent rendering, or its types fight you, write the effect by hand — don't wrestle the library.
- **Server-first means the client surface stays small** (`frontend-state.md`): most concerns are RSC
  or Server Actions, so a client hook is warranted only when the concern is *genuinely* client-side.
  react-use is a convenience for those few islands, not a reason to move logic to the client.

---
paths:
  - "apps/web/**"
---

# react-use — check before you hand-roll a client hook

**Path-scoped rule (`apps/web/**`).** The habit this enforces: **before writing a
client-side React hook by hand — an interval, timeout, debounce/throttle, event listener, media query,
mounted-state guard, clipboard, `localStorage`, geolocation, resize/intersection observer — check
whether [`react-use`](https://github.com/streamich/react-use) already provides it.** When planning or
writing any `.client.tsx`, sweep react-use first; hand-roll only when it genuinely lacks the hook or
its version is heavier/buggier than a three-line effect.

## Where it may live — web-only, client-only

- **`apps/web` `.client.tsx` islands ONLY** (where the Next-wired islands live). react-use is
  DOM-bound. It must NEVER enter the agnostic spine (`repositories`/`store`) — the DOM-free
  `tsconfig.base.json` rejects it with a `tsc` error anyway — nor a `src/server/**` loader/action
  (those are `server-only`). Don't add it to any other workspace's `package.json`.
- This does not change the seam: the island still takes server-resolved data + injected Server Actions
  as props and reaches live data only through those (see `frontend-state.md`). react-use supplies the
  *mechanism* (the interval, the listener), never the data path.

## Import discipline — per-hook, not the barrel

- **Import `react-use/lib/<hook>` (default export), not `{ x } from 'react-use'`.** The package pulls
  ~13 transitive deps (`nano-css`, `screenfull`, `resize-observer-polyfill`, `copy-to-clipboard`,
  `js-cookie`, …); the per-hook path bundles only the one hook you use. Example — the word poller:
  `import useInterval from 'react-use/lib/useInterval'` (`delay: null` pauses it).
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

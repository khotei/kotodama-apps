---
paths:
  - "apps/web/**"
  - "ui/**"
---

# react-use — reach for it before hand-rolling a client hook

Before writing ANY client-side hook by hand (interval, debounce, key/event listener, media query,
clipboard, storage, observers), check whether [`react-use`](https://github.com/streamich/react-use)
already has it. Allowed **only** in `ui`/`apps/web` `.client.tsx` — never the agnostic spine or
`server-only` code.

- **Import `react-use/esm/<hook>` (default export)** — NOT `{ x } from 'react-use'`, NOT
  `react-use/lib/<hook>`. `react-use` ships no `exports` map, so `lib/` resolves to the CJS build;
  Storybook's Vite dep-optimizer then hands you `{ default: hook }` → `useX is not a function` in the
  canvas (Next/SWC hide it). The `esm/` build's real `export default` works under both, same
  per-hook tree-shaking. Check a hook's transitive weight first (`useFullscreen`→`screenfull`) — if
  it drags a big dep for a small need, hand-roll.
- react-use is semi-maintained + loosely typed; if a hook fights React 19 concurrent rendering or
  its types, hand-roll the effect instead of wrestling it.

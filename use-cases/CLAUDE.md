# use-cases — `@kotodama/use-cases`

The **web-only feature tier**: domain-aware assemblies (RSC views + `'use client'` islands) for a
concrete task, composed from `@kotodama/ui` primitives + `@kotodama/store` models. It sits between
the dumb design system and the app: `ui` takes primitives, use-cases takes the domain model, the app
wires it. Web-only (DOM `tsconfig`) — it does NOT port to native; the agnostic spine
(`api-client`/`repositories`/`store`) is what a native app reuses.

- **May import:** `@kotodama/ui`, `@kotodama/store` (models + `Language`/`WordBuildStatus`), `react`,
  `react-use` (islands). **Never** `@kotodama/repositories`, `@kotodama/config`, `apps/*`, or **`next`**
  — Biome bans them. Next-free is the invariant that keeps the tier reusable by another web module
  (which wires its own Next).
- **Imported by:** `apps/web` (which injects data + Server Actions + URLs and composes these).
- **Prop-driven + INJECTED IO — the load-bearing rule.** use-cases sits below the app, so it can't
  import the app's loaders/actions (upward). Components take everything runtime-specific as
  **serializable** props: the resolved `model`, a Server Action reference (`onSettled`), a URL string
  (`statusUrl`) — never a client closure or a `next/*` import. That is what RSC allows across the
  server→client boundary, and what makes a component reusable. A feature that would need heavy
  non-serializable wiring should live in `apps/web` directly (the sanctioned bypass), not here.
- **`WordScreen`** is the one domain → view switch for the word route (null → not-found, unready →
  generating/failed, ready → the full entry; RSC). **`WordStatusPoller`** calls an injected
  `poll` Server Action each tick and fires an injected `onSettled` when the build is terminal
  (`react-use` `useInterval`) — both props are Server Action references, not URLs/closures.

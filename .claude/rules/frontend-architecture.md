---
paths:
  - "apps/**"
  - "core/**"
  - "platform/**"
  - "ui/**"
  - "infra/**"
---

# Frontend architecture — modules, boundaries, the compose path

```
platform/api-client ◄ core/repositories ◄ core/words ◄ apps/web
(platform/config a base leaf importable by ALL; ui the web-only leaf apps/web wires)
```

**The compose path — every read renders as a per-section vertical slice, one role each:**

```
word.repo.ts               fetchX(client, …) → unwrap → *Entity       core/repositories
word.model.ts              bare-noun types derived off the wire union  core/words
<section>.loaders.ts       load* (server-only + React.cache)           apps/web route components/<section>/
<section>.mapper.ts        pure wire→View — ONLY when non-trivial       └ else map inline in the container
<section>-container.tsx    RSC: load* → map → <Feature …/> + bound request* actions
page.tsx                   composes the section *Container elements (no page-wide loader/aggregate)
```

Each section owns its own read: the container (RSC) calls its colocated loader and maps the result
— a pure `*.mapper.ts` split out ONLY where the derivation is non-trivial (else inline), never a
page-wide aggregate mapper. Mutations mirror it: `word.requests.ts` → `revalidatePath`.

- **Aggregate packages, subpath entry points** (`@kotodama/core/{repositories,words,factories}`,
  `@kotodama/platform/{api-client,config,dates,languages}`) — direction stays Biome-lintable on
  the specifier. **A new domain = a `src/<domain>/` folder under each layer, never a new package.**
- **The web↔native line falls below `core`:** `platform`+`core` port to a future native app;
  `ui`+`apps/web` do not — only ui's semantic-token contract does. `ui` holds ALL presentation
  (tiers: `frontend-components.md` · mechanics: `ui/CLAUDE.md`).
- **`ui ⊥ core`:** data via props; MAY read the wire contract TYPE-ONLY from
  `@kotodama/platform/api-client`; never `core`, `platform/config`, or the app.
- **Platform is policy-free; the app owns policy** — `dates`/`languages` are locale-parameterized
  `Intl` toolkits; the one project default is the app's `DEFAULT_LANGUAGE`. `platform/config` =
  the one env home; the api-client LIBRARY reads no env (`baseUrl` injected).
- **`core/use-cases` is a reserved slot** — create only for the first multi-step MUTATION flow;
  reads compose in the app's loaders, never in core.
- **`apps/web` = data layer + render shell.** The data layer (`src/<domain>/server/**`,
  `src/server/**`, any `app/(public)/**/*.loaders.ts` — including the per-section loaders colocated
  under `components/<section>/`) is the ONE stratum importing `core/repositories` and never imports
  `ui`; the shell (`app/**` — the RSC `*-container.tsx` slices + chrome islands under
  `app/(public)/components/**`) composes `ui` with loader data + bound actions.

## Two enforcement planes (`bun run check`)

1. **DOM-free `tsconfig.base` is PRIMARY:** `platform`+`core` compile without `"dom"` — any
   DOM/Radix/`next` leak fails `tsc` before Biome runs.
2. **Biome `noRestrictedImports`** per-glob = the direction bans; the `core/repositories` waiver =
   `apps/web/src/{server,*/server}/**` + `app/(public)/**/*.loaders.ts` (both ban `ui`). **An
   override REPLACES `noRestrictedImports` for its glob — restate every ban you still want.**

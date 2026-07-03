# packages/fe-core — `@kotodama/fe-core`

Pure domain view-models for the spine — no React, no transport, no DOM (tsc-enforced by the DOM-free
base tsconfig). Platform-agnostic: a future `apps/mobile` reuses it unchanged.

- **May import:** `@kotodama/fe-api-client` (generated TYPES only). Nothing else internal.
- **Imported by:** `fe-store` (via its `select`). Never by the web design-system.
- **`narrowWordState`** — the load-bearing view-model (the FE analogue of the backend
  `collapseWordState`). The backend emits `WordStateView` as a bare `anyOf` through
  `OpenApi.fromApi` (no discriminator), so the generated type is a plain `status`-keyed union; this
  narrows it into a tagged `{ kind: 'ready' | 'unready' }`. The union is closed, so a new backend
  status stops it compiling — a build error, never a silent relabel.

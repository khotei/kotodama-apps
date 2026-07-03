# core — `@kotodama/core`

Pure domain view-models (mirrors the backend `core/`) — no React, no transport, no DOM
(tsc-enforced by the DOM-free base). Platform-agnostic: reused by any app.

- **May import:** `@kotodama/api-client` (contract TYPES only). Nothing else internal.
- **Imported by:** `store` (via its `select`) and `use-cases`. Never the design system.
- **`narrowWordState`** — the load-bearing view-model (the FE analogue of the backend
  `collapseWordState`): narrows the bare `anyOf` `WordStateView` into a tagged
  `{ kind: 'ready' | 'unready' }`. The union is closed, so a new backend status stops it
  compiling — a build error, never a silent relabel.

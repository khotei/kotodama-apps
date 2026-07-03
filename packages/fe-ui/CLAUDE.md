# packages/fe-ui — `@kotodama/fe-ui`

Presentational Chakra v3 + Ark components + the Chakra provider. Web-only (DOM-bound); does not port
to native. First-class package from day one (D3) — Storybook consumes it directly.

- **May import:** `@kotodama/fe-theme`, `@kotodama/fe-tokens`, `@chakra-ui/react`, `@ark-ui/react`.
  **Never the spine (`fe-api-client`/`fe-core`/`fe-store`) or `apps/*`** — it takes data via props.
- **Imported by:** `apps/web` (features) + Storybook.
- **Props are primitives, never domain types.** A component takes `word`/`status`/… (not
  `fe-core`'s `NarrowedWordState`); the feature layer maps domain → props. Colours come from
  fe-theme's **semantic tokens** (`bg.surface`, `fg.default`), never raw values.
- **`UiProvider`** binds the fe-theme system; `apps/web` wraps both its SSR entry and client entry
  with it so server + client render against the same system (else hydration drifts).
- **Storybook:** `bunx --bun storybook build` / `…dev`. A story is the component's render test.

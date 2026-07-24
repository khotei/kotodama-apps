# packages/ui — `@kotodama/ui`

The web design system in ONE package: the DTCG token contract, the Chakra `createSystem` over it,
the `UiProvider`, and the presentational components we build on top of Chakra. Web-only (DOM-bound);
does not port to native. Storybook consumes it directly.

- **May import:** `@chakra-ui/react`, `@ark-ui/react`, `react`. **Imports nothing internal** (leaf —
  tokens + theme live inside it). Never the spine (`api-client`/`repositories`/`store`/
  `use-cases`) or `apps/*` — components take data via props.
- **Imported by:** `apps/web` (feature components) + Storybook.
- **Tokens:** DTCG source in `tokens/`; `bun run build` (Style Dictionary) regenerates the committed,
  Biome-excluded `src/tokens.gen.ts` (the nested value map `src/tokens.ts` re-exports) + `src/tokens.css`.
  Edit `tokens/`, never the generated files. Consumers speak only the `semantic` intents
  (`bg.canvas`, `fg.default`) — the stable web↔native seam.
- **Props are primitives, never domain types.** `WordCard` takes `word`/`status`/…, not the store's
  `WordStateModel`; the app maps domain → props.
- **`UiProvider`** binds the Chakra `system`; `apps/web` wraps both its SSR + client entries with it
  so server + client render against the same system (else hydration drifts).
- **Storybook:** `bun run build-storybook` (`bunx --bun storybook build`). A story is the component's
  render test.

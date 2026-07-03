# packages/fe-tokens — `@kotodama/fe-tokens`

The design-system **leaf**: platform-neutral tokens (plain strings — no Chakra, no CSS engine), so a
future native `ui` re-maps the SAME semantic contract.

- **May import:** nothing internal (Biome-enforced leaf).
- **Imported by:** `fe-theme` (and, for CSS vars, `apps/web`).
- **Source of truth:** the W3C DTCG files in `tokens/`. `bun run build` (Style Dictionary)
  regenerates two committed, Biome-excluded artifacts: `src/tokens.gen.ts` (the nested typed value
  map `src/index.ts` re-exports) and `src/tokens.css` (CSS custom properties). Edit `tokens/`, never
  the `.gen`/`.css` — then rebuild.
- **`primitive` vs `semantic`.** Consumers speak only the `semantic` intent names (`bg.canvas`,
  `fg.default`) — the stable web↔native seam; never reference a primitive across the boundary.

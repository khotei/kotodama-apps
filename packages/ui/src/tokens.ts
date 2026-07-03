// @kotodama/tokens — the design-system LEAF. Imports nothing internal
// (Biome-enforced). Platform-neutral values (plain strings — no Chakra, no CSS
// engine), so a future RN `tokens` re-maps the SAME semantic contract.
//
// SOURCE OF TRUTH: the W3C DTCG files in `tokens/`. `bun run build` (Style
// Dictionary) generates `src/tokens.gen.ts` (this nested value map) and
// `src/tokens.css` (CSS custom properties for the app to load). Both are
// committed + Biome-excluded; regenerate after editing tokens/.
//
// Two layers: `primitive` (raw scale — `color`/`space`/`radius`, referenced by
// nobody outside this file) and `semantic` (intent names — `bg.canvas`,
// `fg.default` — the STABLE contract every consumer speaks). Never reference a
// primitive across the boundary; that is what makes the web↔native seam liftable.
import { tokens } from './tokens.gen'

/** The semantic token contract — intent → resolved value. The ported seam. */
export const semantic = {
  bg: tokens.bg,
  fg: tokens.fg,
  border: tokens.border,
  accent: tokens.accent,
} as const

export const space = tokens.space
export const radius = tokens.radius

export type SemanticTokens = typeof semantic

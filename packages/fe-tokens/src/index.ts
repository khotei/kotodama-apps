// @kotodama/fe-tokens — the design-system LEAF. Imports nothing internal
// (Biome-enforced). Platform-neutral values (plain strings/numbers — no Chakra,
// no CSS engine), so a future RN `tokens` re-maps the SAME semantic contract.
//
// Two layers: `primitive` (raw scale values, referenced by nobody outside this
// file) and `semantic` (intent names — `bg.canvas`, `fg.default` — the STABLE
// contract every consumer speaks). Never reference a primitive across the
// boundary; that is what makes the web↔native seam liftable (§5).
//
// The full W3C DTCG source → Style Dictionary → CSS-vars build lands in T05;
// this minimal neutral module is what the walking skeleton binds against.

const primitive = {
  brand: { 500: '#6d28d9', 600: '#5b21b6', 700: '#4c1d95' },
  gray: { 50: '#f9fafb', 200: '#e5e7eb', 500: '#6b7280', 800: '#1f2937', 900: '#111827' },
  white: '#ffffff',
} as const

/** The semantic token contract — intent → value. This is the ported seam. */
export const semantic = {
  bg: { canvas: primitive.gray[50], surface: primitive.white },
  fg: { default: primitive.gray[900], muted: primitive.gray[500] },
  border: { subtle: primitive.gray[200] },
  accent: { default: primitive.brand[600], emphasis: primitive.brand[700] },
} as const

export const space = { xs: '0.25rem', sm: '0.5rem', md: '1rem', lg: '1.5rem', xl: '2rem' } as const

export const radius = { sm: '0.25rem', md: '0.5rem', lg: '0.75rem' } as const

export type SemanticTokens = typeof semantic

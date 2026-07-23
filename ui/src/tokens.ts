// The design system's colour source of truth. Values are the Kotodama design
// palette (kdm-tokens.css) VERBATIM in hex/rgba — zero conversion drift at the
// source. `scripts/gen-tokens.ts` converts these to OKLCH and emits
// `src/tokens.css` (the `:root`/`.dark`/`@theme inline` blocks Tailwind reads).
// Editing a colour = edit here + `bun run gen:tokens`; never hand-edit tokens.css.
//
// shadcn mapping decisions: `--primary` = the ink/inverse ground (the solid
// button), `--accent` = the cinnabar WASH (ghost hovers, menu highlights,
// selection); the solid cinnabar 朱 lives in the `--seal` family.

export type ThemeToken = {
  /** CSS custom-property name, without the leading `--`. Mapped to `--color-<name>`. */
  name: string
  /** Light-theme value — `#rrggbb`, or `rgba(r,g,b,a)` for a wash (see {@link washTokens}). */
  light: string
  /** Dark-theme value. */
  dark: string
}

/**
 * Solid colours. Alpha is applied at the call site (`bg-primary/10`) — Tailwind's
 * `/NN` compiles to `color-mix(in oklab, …)`, format-agnostic, so it works on the
 * generated OKLCH just as it did on hex.
 */
export const solidTokens: readonly ThemeToken[] = [
  // shadcn core set — background/foreground pairs.
  { name: 'background', light: '#f2ecde', dark: '#151318' },
  { name: 'foreground', light: '#18151a', dark: '#ede7da' },
  { name: 'card', light: '#f8f3e7', dark: '#1d1b22' },
  { name: 'card-foreground', light: '#18151a', dark: '#ede7da' },
  { name: 'popover', light: '#fcfaf1', dark: '#25222b' },
  { name: 'popover-foreground', light: '#18151a', dark: '#ede7da' },
  { name: 'primary', light: '#161318', dark: '#f2ecde' },
  { name: 'primary-foreground', light: '#f2ecde', dark: '#18151a' },
  { name: 'secondary', light: '#e9e1cf', dark: '#100e13' },
  { name: 'secondary-foreground', light: '#18151a', dark: '#ede7da' },
  { name: 'muted', light: '#e9e1cf', dark: '#100e13' },
  { name: 'muted-foreground', light: '#6b6356', dark: '#a39c8e' },
  { name: 'accent-foreground', light: '#18151a', dark: '#ede7da' },
  { name: 'destructive', light: '#a6371f', dark: '#ed7e60' },
  { name: 'destructive-foreground', light: '#fbf5ec', dark: '#fbf5ec' },
  { name: 'border', light: '#dcd2bd', dark: '#2d2a35' },
  { name: 'input', light: '#dcd2bd', dark: '#2d2a35' },
  { name: 'ring', light: '#c1452e', dark: '#e26a4c' },

  // Extension families (kdm-tokens.css): the cinnabar seal 朱 (brand mark + accent
  // action hue), indigo 藍 brand-secondary, gold, the statuses the core set lacks,
  // fg/border depth steps, and the 4-way register scale.
  { name: 'seal', light: '#c1452e', dark: '#e26a4c' },
  { name: 'seal-foreground', light: '#fbf5ec', dark: '#fbf5ec' },
  { name: 'seal-emphasis', light: '#a6371f', dark: '#ed7e60' },
  { name: 'seal-soft', light: '#d46a4f', dark: '#c1452e' },
  { name: 'brand', light: '#2e3491', dark: '#8e94ec' },
  { name: 'brand-soft', light: '#5a60be', dark: '#6c72d6' },
  { name: 'gold', light: '#b0863a', dark: '#d2a559' },
  { name: 'success', light: '#2c7a53', dark: '#45b07e' },
  { name: 'success-foreground', light: '#fbf5ec', dark: '#151318' },
  { name: 'warning', light: '#b07a1b', dark: '#dda646' },
  { name: 'warning-foreground', light: '#fbf5ec', dark: '#151318' },
  { name: 'subtle-foreground', light: '#8a8170', dark: '#847c70' },
  { name: 'faint-foreground', light: '#b4ab95', dark: '#5b5550' },
  { name: 'border-subtle', light: '#e7dfcd', dark: '#242230' },
  { name: 'border-strong', light: '#c5baa0', dark: '#3d3947' },
  { name: 'tier-everyday', light: '#3f8466', dark: '#5bb58c' },
  { name: 'tier-cultural', light: '#6b4fae', dark: '#a593e0' },
  { name: 'tier-formal', light: '#2e3491', dark: '#8e94ec' },
  { name: 'tier-rare', light: '#b0863a', dark: '#d2a559' },
]

/**
 * Washes — colours that carry their own alpha as part of the design (translucent
 * grounds: hovers, highlights, selection, subtle status fills). They compile to
 * `oklch(L C H / A)`.
 *
 * INVARIANT: never apply a `/NN` opacity modifier to a wash utility
 * (`bg-accent/50`) — the alpha is pre-baked, so `/NN` double-composites. Reach for
 * the solid sibling (`bg-seal/50`) when you need a variable opacity.
 */
export const washTokens: readonly ThemeToken[] = [
  { name: 'accent', light: 'rgba(193, 69, 46, 0.1)', dark: 'rgba(226, 106, 76, 0.14)' },
  { name: 'seal-line', light: 'rgba(193, 69, 46, 0.28)', dark: 'rgba(226, 106, 76, 0.34)' },
  { name: 'brand-subtle', light: 'rgba(46, 52, 145, 0.09)', dark: 'rgba(142, 148, 236, 0.14)' },
  { name: 'success-subtle', light: 'rgba(44, 122, 83, 0.11)', dark: 'rgba(69, 176, 126, 0.14)' },
  { name: 'warning-subtle', light: 'rgba(176, 122, 27, 0.12)', dark: 'rgba(221, 166, 70, 0.14)' },
  {
    name: 'destructive-subtle',
    light: 'rgba(166, 55, 31, 0.09)',
    dark: 'rgba(237, 126, 96, 0.14)',
  },
]

/** Every colour token, in emit order. */
export const colorTokens: readonly ThemeToken[] = [...solidTokens, ...washTokens]

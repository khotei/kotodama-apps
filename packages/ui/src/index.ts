// @kotodama/ui — the web design system in ONE package: the Tailwind v4 + shadcn
// primitives (cva variants + `cn`), the semantic `@theme` token layer
// (`styles.css`), and the presentational components built on top. Web-only
// (DOM-bound); imports nothing internal (leaf). Storybook consumes it directly.
//
// Layout: one folder per component under `components/<name>/` (component +
// story + barrel); shared helpers in `lib/`.

export { Badge, type BadgeProps } from './components/badge'
export { Card, CardContent, CardHeader, CardTitle } from './components/card'
export { WordCard, type WordCardProps } from './components/word-card'
export { cn } from './lib/cn'

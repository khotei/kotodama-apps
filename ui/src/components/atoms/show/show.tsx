import type { ReactNode } from 'react'
import { cn } from '../../../lib/utils'

/** The site's single mobile↔desktop line is Tailwind `md` (768px). */
export type ShowOn = 'mobile' | 'desktop'

export type ShowProps = {
  on: ShowOn
  className?: string
  children: ReactNode
}

// `display: contents` when visible, so the wrapper adds no layout box — children
// participate in the parent's flex/grid directly, as if `<Show>` weren't there.
const MODE: Record<ShowOn, string> = {
  mobile: 'contents md:hidden',
  desktop: 'hidden md:contents',
}

/**
 * Renders its children only at one side of the `md` breakpoint — `on="mobile"`
 * below it, `on="desktop"` at and above it — replacing ad-hoc `md:hidden` /
 * `hidden md:…` classes when a composer gates an injected slot by viewport.
 */
export function Show({ on, className, children }: ShowProps) {
  return <div className={cn(MODE[on], className)}>{children}</div>
}

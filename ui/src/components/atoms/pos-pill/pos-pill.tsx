import type { ComponentProps } from 'react'
import { cn } from '../../../lib/utils'

/** A small mono chip for a part-of-speech tag (`n.`, `v.`, `adj.`). */
export function PosPill({ className, ...props }: ComponentProps<'span'>) {
  return (
    <span
      className={cn(
        'inline-grid h-6 min-w-9 place-items-center rounded-sm border bg-secondary px-xs font-mono text-xs text-muted-foreground tracking-wide',
        className,
      )}
      {...props}
    />
  )
}

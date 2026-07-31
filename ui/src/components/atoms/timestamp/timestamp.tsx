import type { ComponentProps } from 'react'
import { cn } from '../../../lib/utils'

/** A quiet mono relative-time label (`2 min ago`, `just now`) for a list row's meta. */
export function Timestamp({ className, ...props }: ComponentProps<'span'>) {
  return (
    <span
      className={cn('font-mono text-xs text-faint-foreground tracking-wide', className)}
      {...props}
    />
  )
}

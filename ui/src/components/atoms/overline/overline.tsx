import type { ComponentProps } from 'react'
import { cn } from '../../../lib/utils'

export type OverlineProps = ComponentProps<'h3'>

/** The mono-uppercase seal-toned kicker heading every section and card opens with. */
export function Overline({ className, ...props }: OverlineProps) {
  return (
    <h3
      className={cn(
        'font-mono text-2xs font-medium text-seal uppercase tracking-[0.18em]',
        className,
      )}
      {...props}
    />
  )
}

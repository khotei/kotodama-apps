import type { ComponentProps, ReactNode } from 'react'
import { cn } from '../../../lib/utils'
import { Toggle } from '../../ui/toggle'

export type FilterChipProps = ComponentProps<typeof Toggle> & {
  icon?: ReactNode
}

/**
 * A pressable filter pill: the Radix Toggle (real `aria-pressed` semantics,
 * `pressed` + `onPressedChange`) restyled as a chip.
 */
export function FilterChip({ icon, className, children, ...props }: FilterChipProps) {
  return (
    <Toggle
      className={cn(
        'h-auto min-w-0 gap-1.5 rounded-full border border-current px-[9px] py-[3px] font-sans text-2xs font-semibold text-subtle-foreground uppercase tracking-[0.12em] hover:text-foreground data-[state=on]:bg-transparent data-[state=on]:text-tier-formal data-[state=on]:shadow-none [&_svg]:size-3.5 data-[state=on]:[&_svg]:fill-current',
        className,
      )}
      {...props}
    >
      {icon}
      {children}
    </Toggle>
  )
}

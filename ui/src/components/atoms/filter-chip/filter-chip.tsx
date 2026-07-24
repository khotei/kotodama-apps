import type { ComponentProps, ReactNode } from 'react'
import { cn } from '../../../lib/utils'
import { Chip } from '../chip'

type PressableChipProps = Extract<ComponentProps<typeof Chip>, { pressable: true }>

export type FilterChipProps = Omit<PressableChipProps, 'pressable' | 'leading'> & {
  icon?: ReactNode
}

/**
 * A pressable filter pill: {@link Chip} in its Toggle form, pre-toned as a
 * filter (muted at rest, tier-formal accent when on) with the icon in the
 * leading slot.
 */
export function FilterChip({ icon, className, ...props }: FilterChipProps) {
  return (
    <Chip
      pressable
      leading={icon}
      className={cn(
        'text-subtle-foreground hover:text-foreground data-[state=on]:text-tier-formal',
        className,
      )}
      {...props}
    />
  )
}

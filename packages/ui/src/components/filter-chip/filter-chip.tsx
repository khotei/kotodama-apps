import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '../../lib/utils'

const filterChipVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full border border-current px-[9px] py-[3px] font-sans text-2xs font-semibold uppercase tracking-[0.12em] transition-colors [&_svg]:size-3.5',
  {
    variants: {
      pressed: {
        true: '[&_svg]:fill-current',
        false: 'text-subtle-foreground hover:text-foreground',
      },
      tone: {
        formal: '',
        seal: '',
      },
    },
    compoundVariants: [
      { pressed: true, tone: 'formal', class: 'text-tier-formal' },
      { pressed: true, tone: 'seal', class: 'text-seal' },
    ],
    defaultVariants: { pressed: false, tone: 'formal' },
  },
)

export type FilterChipProps = ComponentProps<'button'> &
  Omit<VariantProps<typeof filterChipVariants>, 'pressed'> & {
    pressed?: boolean
    onPressedChange?: (pressed: boolean) => void
    icon?: ReactNode
  }

/**
 * A pressable filter pill: button semantics (`aria-pressed`) with a chip look.
 * Controlled via `pressed` + `onPressedChange` (fires the toggled value).
 */
export function FilterChip({
  pressed = false,
  onPressedChange,
  tone,
  icon,
  className,
  onClick,
  children,
  ...props
}: FilterChipProps) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      className={cn(filterChipVariants({ pressed, tone }), className)}
      onClick={(event) => {
        onClick?.(event)
        onPressedChange?.(!pressed)
      }}
      {...props}
    >
      {icon}
      {children}
    </button>
  )
}

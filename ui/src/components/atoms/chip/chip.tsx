'use client'

import { cva } from 'class-variance-authority'
import { Toggle as TogglePrimitive } from 'radix-ui'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '../../../lib/utils'

const chipVariants = cva(
  'inline-flex items-center gap-2 rounded-full border border-current px-2 py-0.5 font-sans text-2xs font-semibold text-current uppercase tracking-widest [&_svg]:size-3.5',
  {
    variants: {
      pressable: {
        true: 'cursor-pointer outline-none transition-colors focus-visible:ring-[3px] focus-visible:ring-ring/50 data-[state=on]:bg-transparent data-[state=on]:shadow-none data-[state=on]:[&_svg]:fill-current',
        false: '',
      },
    },
    defaultVariants: { pressable: false },
  },
)

type ChipOwnProps = { leading?: ReactNode }

/**
 * The neutral pill frame: an uppercase outline chip that colours from
 * `text-current`, so a composer sets the hue with a `text-*` class. Policy-free —
 * it owns its look and nothing else; the tier vocabulary and filter semantics
 * live in wrappers above ({@link TierChip}).
 *
 * `pressable` swaps the rendered element: a static `span` by default, a Radix
 * `Toggle` (real `aria-pressed` + `pressed`/`onPressedChange`) when set — the one
 * reason this atom is `'use client'`.
 */
export type ChipProps =
  | (ChipOwnProps & ComponentProps<'span'> & { pressable?: false })
  | (ChipOwnProps & ComponentProps<typeof TogglePrimitive.Root> & { pressable: true })

export function Chip(props: ChipProps) {
  const className = cn(chipVariants({ pressable: props.pressable }), props.className)
  if (props.pressable) {
    const { pressable: _p, leading, className: _c, children, ...toggleProps } = props
    return (
      <TogglePrimitive.Root className={className} {...toggleProps}>
        {leading}
        {children}
      </TogglePrimitive.Root>
    )
  }
  const { pressable: _p, leading, className: _c, children, ...spanProps } = props
  return (
    <span className={className} {...spanProps}>
      {leading}
      {children}
    </span>
  )
}

export { chipVariants }

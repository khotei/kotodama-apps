import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import { cn } from './cn'

const badge = cva(
  'inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium uppercase tracking-wide',
  {
    variants: {
      variant: {
        solid: 'border-transparent bg-primary text-primary-foreground',
        outline: 'border-border text-foreground',
        muted: 'border-transparent bg-border/40 text-muted-foreground',
      },
    },
    defaultVariants: { variant: 'solid' },
  },
)

export interface BadgeProps extends ComponentProps<'span'>, VariantProps<typeof badge> {
  asChild?: boolean
}

export function Badge({ className, variant, asChild = false, ...props }: BadgeProps) {
  const Comp = asChild ? Slot : 'span'
  return <Comp data-slot="badge" className={cn(badge({ variant }), className)} {...props} />
}

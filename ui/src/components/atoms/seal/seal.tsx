import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import { cn } from '../../../lib/utils'

const sealVariants = cva(
  'relative inline-grid shrink-0 select-none place-items-center bg-seal font-serif font-semibold text-seal-foreground after:absolute after:inset-[3px] after:rounded-xs after:border after:border-seal-foreground/45 after:content-[""]',
  {
    variants: {
      size: {
        default: 'size-8 rounded-sm text-lg',
        sm: 'size-6 rounded-sm text-sm',
      },
    },
    defaultVariants: { size: 'default' },
  },
)

export type SealProps = ComponentProps<'span'> & VariantProps<typeof sealVariants>

/** The cinnabar brand mark 印 — the only surface that may use `--seal`. */
export function Seal({ className, size, children = '言', ...props }: SealProps) {
  return (
    <span aria-hidden="true" className={cn(sealVariants({ size }), className)} {...props}>
      {children}
    </span>
  )
}

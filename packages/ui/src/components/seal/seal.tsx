import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import { cn } from '../../lib/utils'

const sealVariants = cva(
  'inline-grid shrink-0 select-none place-items-center bg-seal font-serif font-medium text-seal-foreground',
  {
    variants: {
      size: {
        default: 'size-8 rounded-md text-[17px]',
        sm: 'size-6 rounded-sm text-[13px]',
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

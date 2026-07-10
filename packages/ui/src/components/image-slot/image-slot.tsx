import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '../../lib/utils'

const imageSlotVariants = cva(
  'relative grid place-items-center border border-border bg-secondary',
  {
    variants: {
      shape: {
        rect: 'min-h-[120px] rounded-lg p-4',
        circle: 'aspect-square overflow-hidden rounded-full',
      },
    },
    defaultVariants: { shape: 'rect' },
  },
)

export type ImageSlotProps = ComponentProps<'div'> &
  VariantProps<typeof imageSlotVariants> & {
    label?: ReactNode
  }

/** Placeholder marking where user/product imagery drops in — sunken ground, dashed inner frame, mono note. */
export function ImageSlot({ shape, label, className, ...props }: ImageSlotProps) {
  return (
    <div className={cn(imageSlotVariants({ shape }), className)} {...props}>
      {shape !== 'circle' && (
        <span className="pointer-events-none absolute inset-3 rounded-[5px] border border-border-strong border-dashed" />
      )}
      {label != null && (
        <span className="relative max-w-[85%] text-center font-mono text-[11px] leading-relaxed text-faint-foreground tracking-[0.04em]">
          {label}
        </span>
      )}
    </div>
  )
}

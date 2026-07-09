import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '../../lib/utils'

const imageSlotVariants = cva(
  'grid place-items-center border border-dashed border-border bg-[repeating-linear-gradient(45deg,var(--muted),var(--muted)_10px,transparent_10px,transparent_20px)]',
  {
    variants: {
      shape: {
        rect: 'min-h-[120px] rounded-lg p-4',
        circle: 'aspect-square rounded-full',
      },
    },
    defaultVariants: { shape: 'rect' },
  },
)

export type ImageSlotProps = ComponentProps<'div'> &
  VariantProps<typeof imageSlotVariants> & {
    label?: ReactNode
  }

/** Striped placeholder marking where user/product imagery drops in. */
export function ImageSlot({ shape, label, className, ...props }: ImageSlotProps) {
  return (
    <div className={cn(imageSlotVariants({ shape }), className)} {...props}>
      {label != null && (
        <span className="max-w-[85%] text-center font-mono text-[11px] leading-relaxed text-muted-foreground">
          {label}
        </span>
      )}
    </div>
  )
}

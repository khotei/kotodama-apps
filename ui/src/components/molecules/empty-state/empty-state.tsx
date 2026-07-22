import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '../../../lib/utils'

const emptyStateIconVariants = cva(
  'grid size-14 place-items-center rounded-full border [&_svg]:size-5',
  {
    variants: {
      tone: {
        default: 'border-border bg-card text-muted-foreground',
        destructive: 'border-destructive-subtle bg-destructive-subtle text-destructive',
      },
    },
    defaultVariants: { tone: 'default' },
  },
)

export type EmptyStateProps = ComponentProps<'div'> &
  VariantProps<typeof emptyStateIconVariants> & {
    icon?: ReactNode
    eyebrow?: ReactNode
    title: ReactNode
    description?: ReactNode
    /** Mono footnote under the actions — `Spanish · resquemor`. */
    hint?: ReactNode
  }

/**
 * The centered terminal state (no-results, saved-empty, not-found, failed);
 * children are the action row.
 */
export function EmptyState({
  icon,
  eyebrow,
  title,
  description,
  hint,
  tone,
  className,
  children,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'mx-auto flex max-w-md flex-col items-center gap-1.5 px-6 py-14 text-center',
        className,
      )}
      {...props}
    >
      {icon != null && <span className={emptyStateIconVariants({ tone })}>{icon}</span>}
      <div className="flex flex-col gap-2">
        {eyebrow != null && (
          <span className="font-mono text-2xs text-subtle-foreground uppercase tracking-[0.18em]">
            {eyebrow}
          </span>
        )}
        <h2 className="font-serif text-[26px] font-medium leading-tight tracking-[-0.015em]">
          {title}
        </h2>
        {description != null && (
          <p className="mx-auto max-w-[420px] font-serif text-[16px] text-muted-foreground leading-normal">
            {description}
          </p>
        )}
      </div>
      {children != null && (
        <div className="mt-2 flex flex-wrap items-center justify-center gap-2.5">{children}</div>
      )}
      {hint != null && <span className="font-mono text-2xs text-subtle-foreground">{hint}</span>}
    </div>
  )
}

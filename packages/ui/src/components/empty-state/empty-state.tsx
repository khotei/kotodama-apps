import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '../../lib/utils'

const emptyStateIconVariants = cva('grid size-12 place-items-center rounded-full [&_svg]:size-5', {
  variants: {
    tone: {
      default: 'bg-muted text-muted-foreground',
      destructive: 'bg-destructive/10 text-destructive',
    },
  },
  defaultVariants: { tone: 'default' },
})

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
        'mx-auto flex max-w-md flex-col items-center gap-4 py-14 text-center',
        className,
      )}
      {...props}
    >
      {icon != null && <span className={emptyStateIconVariants({ tone })}>{icon}</span>}
      <div className="flex flex-col gap-2">
        {eyebrow != null && (
          <span className="font-mono text-[11px] text-muted-foreground uppercase tracking-[0.12em]">
            {eyebrow}
          </span>
        )}
        <h2 className="font-serif text-3xl font-light leading-tight">{title}</h2>
        {description != null && (
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        )}
      </div>
      {children != null && (
        <div className="flex flex-wrap items-center justify-center gap-2.5">{children}</div>
      )}
      {hint != null && <span className="font-mono text-[11px] text-muted-foreground">{hint}</span>}
    </div>
  )
}

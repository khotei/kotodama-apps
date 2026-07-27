import type { operations } from '@kotodama/platform/api-client'
import { cva } from 'class-variance-authority'
import { TriangleAlertIcon } from 'lucide-react'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '../../../lib/utils'
import { Spinner } from '../../atoms/spinner'
import { Badge, type BadgeProps } from '../../ui/badge'

/** The one word-lifecycle status vocabulary — the wire's own union, read
 *  type-only off the contract so a backend status change breaks these Records
 *  at compile time. Display copy stays this component's ({@link StatusBadge}
 *  renders `running` as “Generating…”). */
export type WordStatus = NonNullable<
  NonNullable<operations['words.search']['parameters']['query']>['status']
>

const statusBadgeVariants = cva('', {
  variants: {
    status: {
      succeeded: 'bg-success-subtle text-success',
      running: 'bg-warning-subtle text-warning',
      pending: 'bg-secondary text-muted-foreground',
      failed: 'bg-destructive-subtle text-destructive',
    },
  },
})

const STATUS_LABEL: Record<WordStatus, string> = {
  succeeded: 'Ready',
  running: 'Generating…',
  pending: 'Queued',
  failed: 'Failed',
}

const STATUS_GLYPH: Record<WordStatus, ReactNode> = {
  succeeded: <span className="size-1.5 rounded-full bg-current" />,
  running: <Spinner className="size-3" />,
  pending: <span className="size-1.5 rounded-full shadow-[inset_0_0_0_1.5px_currentColor]" />,
  failed: <TriangleAlertIcon className="size-3" />,
}

export type StatusBadgeProps = Omit<BadgeProps, 'variant'> & {
  status: WordStatus
}

export function StatusBadge({ status, className, children, ...props }: StatusBadgeProps) {
  return (
    <Badge className={cn(statusBadgeVariants({ status }), className)} {...props}>
      {STATUS_GLYPH[status]}
      {children ?? STATUS_LABEL[status]}
    </Badge>
  )
}

const statusDotVariants = cva('size-2 shrink-0 rounded-full', {
  variants: {
    status: {
      succeeded: 'bg-border-strong',
      running: 'bg-seal',
      pending: 'bg-transparent shadow-[inset_0_0_0_1.5px_var(--border-strong)]',
      failed: 'bg-transparent shadow-[inset_0_0_0_1.5px_var(--destructive)]',
    },
  },
})

export type StatusDotProps = Omit<ComponentProps<'span'>, 'children'> & {
  status: WordStatus
}

/** The dot form of the status vocabulary — a bare glyph for dense list rows. */
export function StatusDot({ status, className, ...props }: StatusDotProps) {
  return <span className={cn(statusDotVariants({ status }), className)} {...props} />
}

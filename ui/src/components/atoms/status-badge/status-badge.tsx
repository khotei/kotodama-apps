import { cva } from 'class-variance-authority'
import { TriangleAlertIcon } from 'lucide-react'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '../../../lib/utils'
import { Badge, type BadgeProps } from '../../ui/badge'
import { Spinner } from '../spinner'

/** The one word-lifecycle status vocabulary — every surface consumes this. */
export type WordStatus = 'ready' | 'generating' | 'pending' | 'failed'

const statusBadgeVariants = cva('', {
  variants: {
    status: {
      ready: 'bg-success-subtle text-success',
      generating: 'bg-warning-subtle text-warning',
      pending: 'bg-secondary text-muted-foreground',
      failed: 'bg-destructive-subtle text-destructive',
    },
  },
})

const STATUS_LABEL: Record<WordStatus, string> = {
  ready: 'Ready',
  generating: 'Generating…',
  pending: 'Queued',
  failed: 'Failed',
}

const STATUS_GLYPH: Record<WordStatus, ReactNode> = {
  ready: <span className="size-1.5 rounded-full bg-current" />,
  generating: <Spinner className="size-3" />,
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

const statusDotVariants = cva('size-[7px] shrink-0 rounded-full', {
  variants: {
    status: {
      ready: 'bg-border-strong',
      generating: 'bg-seal',
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

import { cva } from 'class-variance-authority'
import { TriangleAlertIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '../../lib/utils'
import { Badge, type BadgeProps } from '../ui/badge'
import { Spinner } from '../ui/spinner'

/** The one word-lifecycle status vocabulary — every surface consumes this. */
export type WordStatus = 'ready' | 'generating' | 'pending' | 'failed'

const statusBadgeVariants = cva('border bg-transparent font-sans', {
  variants: {
    status: {
      ready: 'border-success/35 text-success',
      generating: 'border-primary/35 text-primary',
      pending: 'border-border text-muted-foreground',
      failed: 'border-destructive/35 text-destructive',
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
    <Badge variant="outline" className={cn(statusBadgeVariants({ status }), className)} {...props}>
      {STATUS_GLYPH[status]}
      {children ?? STATUS_LABEL[status]}
    </Badge>
  )
}

import type { ComponentProps, ReactNode } from 'react'
import { cn } from '../../../lib/utils'

export type SectionRuleProps = ComponentProps<'div'> & {
  label: ReactNode
  meta?: ReactNode
}

/**
 * Section opener: mono uppercase label · hairline · optional right-side meta
 * (a mono caption or a control cluster like prev/next buttons).
 */
export function SectionRule({ label, meta, className, ...props }: SectionRuleProps) {
  return (
    <div className={cn('flex items-center gap-md', className)} {...props}>
      <span className="whitespace-nowrap font-mono text-2xs font-medium uppercase leading-none tracking-caps text-seal">
        {label}
      </span>
      <span className="h-px flex-1 bg-border-strong" />
      {meta != null && (
        <span className="flex min-w-0 items-center gap-xs font-sans text-xs leading-tight text-subtle-foreground">
          {meta}
        </span>
      )}
    </div>
  )
}

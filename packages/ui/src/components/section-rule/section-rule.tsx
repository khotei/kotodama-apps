import type { ComponentProps, ReactNode } from 'react'
import { cn } from '../../lib/utils'

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
    <div className={cn('flex items-center gap-3.5', className)} {...props}>
      <span className="whitespace-nowrap font-mono text-[11px] font-medium uppercase leading-none tracking-[0.12em] text-muted-foreground">
        {label}
      </span>
      <span className="h-px flex-1 bg-border" />
      {meta != null && (
        <span className="flex items-center gap-2 whitespace-nowrap font-mono text-[11px] leading-none text-muted-foreground">
          {meta}
        </span>
      )}
    </div>
  )
}

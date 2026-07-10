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
    <div className={cn('flex items-center gap-4', className)} {...props}>
      <span className="whitespace-nowrap font-mono text-2xs font-medium uppercase leading-none tracking-[0.22em] text-seal">
        {label}
      </span>
      <span className="h-px flex-1 bg-border-strong" />
      {meta != null && (
        <span className="flex items-center gap-2 whitespace-nowrap font-sans text-[12px] leading-none text-subtle-foreground">
          {meta}
        </span>
      )}
    </div>
  )
}

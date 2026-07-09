import type { ComponentProps, ReactNode } from 'react'
import { cn } from '../../lib/utils'

export type EtymologyStep = {
  /** Mono overline: century or year — `s. XIII`, `1490`. */
  when: ReactNode
  /** The historical form, set in serif — `mariposa`. */
  form: ReactNode
  note?: ReactNode
}

export type EtymologyTimelineProps = Omit<ComponentProps<'ol'>, 'children'> & {
  steps: readonly EtymologyStep[]
}

/**
 * Historical steps over a hairline with `--primary` ring dots — horizontal on
 * desktop, vertical with a left hairline under `md`.
 */
export function EtymologyTimeline({ steps, className, ...props }: EtymologyTimelineProps) {
  return (
    <ol
      className={cn(
        'flex flex-col border-border border-l md:flex-row md:border-t md:border-l-0',
        className,
      )}
      {...props}
    >
      {steps.map((step, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: steps are a static ordered sequence
        <li key={index} className="relative flex-1 py-3 pl-5 md:pt-4 md:pr-5 md:pb-0 md:pl-0">
          <span className="-left-[5px] absolute top-4 size-[9px] rounded-full bg-background shadow-[inset_0_0_0_2px_var(--primary)] md:-top-[5px] md:left-0" />
          <div className="font-mono text-[10.5px] text-muted-foreground uppercase tracking-[0.12em]">
            {step.when}
          </div>
          <div className="mt-1 font-serif text-[17px] leading-snug">{step.form}</div>
          {step.note != null && (
            <div className="mt-0.5 text-[12.5px] text-muted-foreground leading-snug">
              {step.note}
            </div>
          )}
        </li>
      ))}
    </ol>
  )
}

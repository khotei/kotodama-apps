import type { ComponentProps, ReactNode } from 'react'
import { cn } from '../../lib/utils'

export type EtymologyStep = {
  /** Mono overline: century or year — `s. XIII`, `1490`. */
  when: ReactNode
  /** The historical form, set in serif — `mariposa`. Absent on a prose-only step. */
  form?: ReactNode
  note?: ReactNode
}

export type EtymologyTimelineProps = Omit<ComponentProps<'ol'>, 'children'> & {
  steps: readonly EtymologyStep[]
}

/**
 * Historical steps as a vertical ledger: a right-aligned mono `when` column
 * beside a left-hairline body carrying a ring dot per step; the final dot fills
 * cinnabar to mark the living present.
 */
export function EtymologyTimeline({ steps, className, ...props }: EtymologyTimelineProps) {
  return (
    <ol className={cn('flex flex-col', className)} {...props}>
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1
        return (
          // biome-ignore lint/suspicious/noArrayIndexKey: steps are a static ordered sequence
          <li key={index} className="grid grid-cols-[110px_1fr] gap-5 py-1">
            <div className="pt-[9px] text-right font-mono text-[12px] text-subtle-foreground tracking-[0.04em]">
              {step.when}
            </div>
            <div
              className={cn(
                'relative border-border-strong border-l pt-1.5 pl-6',
                isLast ? 'pb-1' : 'pb-6',
              )}
            >
              <span
                className={cn(
                  '-left-[4.5px] absolute top-[11px] size-2 rounded-full border-[1.5px]',
                  isLast ? 'border-seal bg-seal' : 'border-border-strong bg-background',
                )}
              />
              {step.form != null && (
                <div className="font-serif text-[22px] leading-snug tracking-[-0.01em]">
                  {step.form}
                </div>
              )}
              {step.note != null && (
                <div className="mt-[3px] font-sans text-[13.5px] text-muted-foreground leading-snug">
                  {step.note}
                </div>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}

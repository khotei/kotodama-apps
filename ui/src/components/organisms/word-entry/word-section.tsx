import { SectionRule } from '@kotodama/ui'
import type { ReactNode } from 'react'

export type WordSectionProps = {
  id: string
  label: string
  meta?: ReactNode
  children: ReactNode
}

/** The shared shell every word-entry section renders inside: anchor target + rule. */
export function WordSection({ id, label, meta, children }: WordSectionProps) {
  return (
    <section id={id} className="mt-[52px] scroll-mt-24">
      <SectionRule label={label} meta={meta} className="mb-[22px]" />
      {children}
    </section>
  )
}

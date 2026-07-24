import type { ReactNode } from 'react'
import type { WordEntryContent } from '../../../views/word.view'
import { Overline } from '../../atoms/overline'
import { Sparkline } from '../../atoms/sparkline'
import type { WordTier } from '../../core/tier-chip'

const KNOWN_TIERS: readonly WordTier[] = ['everyday', 'cultural', 'formal', 'rare']

function GlanceRow({ dt, dd }: { dt: string; dd: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-[14px] border-border-subtle border-b py-[9px] last:border-b-0">
      <dt className="font-sans text-[12px] text-subtle-foreground">{dt}</dt>
      <dd className="text-right font-mono text-[12.5px]">{dd}</dd>
    </div>
  )
}

export type EntryAsideProps = {
  word: WordEntryContent
  /** `[anchorId, label]` pairs for the On-this-page nav — pre-filtered to the
   *  sections that actually rendered, so no anchor points nowhere. */
  nav: readonly (readonly [string, string])[]
}

/** The sticky sidebar: the At-a-glance card + the On-this-page section nav. */
export function EntryAside({ word, nav }: EntryAsideProps) {
  const registerTier = word.lexical.register.find((r): r is WordTier =>
    (KNOWN_TIERS as readonly string[]).includes(r),
  )
  const registerLabel =
    registerTier != null
      ? `${registerTier.charAt(0).toUpperCase()}${registerTier.slice(1)}`
      : word.lexical.register.join(' · ')
  const frequency = word.frequency
  const frequencySeries = frequency?.series.map((p) => Number(p.value) || 0) ?? []
  const firstYear = frequency?.series.at(0)?.year
  const lastYear = frequency?.series.at(-1)?.year
  const createdAt = new Date(word.createdAt)
  const added = Number.isNaN(createdAt.getTime())
    ? word.createdAt
    : new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        timeZone: 'UTC',
      }).format(createdAt)

  return (
    <aside className="lg:sticky lg:top-24 lg:self-start">
      <div className="flex flex-col gap-6">
        <div className="rounded-sm border border-border bg-card px-5 py-[18px]">
          <Overline className="mb-3 tracking-[0.2em]">At a glance</Overline>
          <dl className="flex flex-col">
            <GlanceRow dt="Part of speech" dd={word.lexical.partOfSpeech} />
            <GlanceRow dt="Pronunciation" dd={word.pronunciation.ipa} />
            {word.pronunciation.respelling && (
              <GlanceRow dt="Respelling" dd={word.pronunciation.respelling} />
            )}
            <GlanceRow dt="Register" dd={registerLabel} />
            {frequency != null && <GlanceRow dt="Frequency" dd={frequency.band} />}
            <GlanceRow dt="Added" dd={added} />
          </dl>
          {frequencySeries.length > 1 && (
            <div className="mt-[14px] border-border-subtle border-t pt-4">
              <div className="font-mono text-2xs text-subtle-foreground uppercase tracking-[0.1em]">
                Frequency{firstYear != null ? ` · ${firstYear}–${lastYear}` : ''}
              </div>
              <Sparkline
                className="mt-2.5"
                values={frequencySeries}
                startLabel={firstYear ?? undefined}
                endLabel={lastYear ?? undefined}
              />
              {frequency?.trendNote != null && (
                <p className="mt-2.5 font-sans text-[12px] text-muted-foreground leading-[1.5]">
                  {frequency.trendNote}
                </p>
              )}
            </div>
          )}
        </div>
        <div className="rounded-sm border border-border bg-card px-5 py-[18px]">
          <Overline className="mb-3 tracking-[0.2em]">On this page</Overline>
          <ul className="flex list-none flex-col gap-px p-0">
            {nav.map(([id, label]) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className="-mx-3 block rounded-[5px] border-transparent border-l-2 px-3 py-[7px] font-sans text-[13.5px] text-muted-foreground no-underline transition-colors hover:border-seal hover:bg-accent hover:text-seal"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  )
}

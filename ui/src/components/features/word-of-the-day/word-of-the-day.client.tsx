'use client'

import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react'
import { useState } from 'react'
import { pad2 } from '../../../lib/pad2'
import { cn } from '../../../lib/utils'
import type { GlanceText, WotdView } from '../../../views/library.view'
import { AccentedWordMark, accentedWordText } from '../../atoms/accented-word'
import { ListenButton } from '../../atoms/listen-button'
import { Overline } from '../../atoms/overline'
import { SectionRule } from '../../atoms/section-rule'
import { Sparkline } from '../../atoms/sparkline'
import { SaveWordButton } from '../../core/save-word-button'
import { TierDot } from '../../core/tier-chip'
import { Button } from '../../ui/button'

function Glance({ value }: { value: GlanceText }) {
  if (typeof value === 'string') return value
  let offset = 0
  return value.map((span) => {
    const key = `${offset}:${span.text}`
    offset += span.text.length
    return span.accent ? (
      <em key={key} className="text-seal italic">
        {span.text}
      </em>
    ) : (
      <span key={key}>{span.text}</span>
    )
  })
}

export type WordOfTheDayProps = {
  /** The rotation, newest first; prev/next wrap around it. */
  wotds: readonly WotdView[]
}

export function WordOfTheDay({ wotds }: WordOfTheDayProps) {
  const [rawIndex, setIndex] = useState(0)
  const count = wotds.length
  // Clamp instead of trusting state: a revalidation may shrink the rotation
  // below a previously-reached index — show the newest item, never blank out.
  const index = Math.min(rawIndex, count - 1)
  const wotd = wotds[index]
  if (wotd == null) return null
  const step = (delta: number) => setIndex((i) => (Math.min(i, count - 1) + delta + count) % count)

  return (
    <section className="flex flex-col gap-6">
      <SectionRule
        label="Word of the day"
        meta={
          <span className="flex shrink-0 items-center gap-4">
            <span className="whitespace-nowrap font-mono text-2xs text-faint-foreground tracking-widest">
              {pad2(index + 1)} / {pad2(count)}
            </span>
            <span className="flex items-center gap-2" role="tablist" aria-label="Words of the day">
              {wotds.map((w, i) => (
                <button
                  key={w.dateTag}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={accentedWordText(w.word)}
                  onClick={() => setIndex(i)}
                  className={cn(
                    'size-2 rounded-full transition-transform',
                    i === index ? 'scale-[1.15] bg-seal' : 'bg-border-strong hover:scale-125',
                  )}
                />
              ))}
            </span>
            <Button
              variant="outline"
              size="icon-sm"
              className="rounded-full"
              aria-label="Previous"
              disabled={count < 2}
              onClick={() => step(-1)}
            >
              <ArrowLeftIcon />
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              className="rounded-full"
              aria-label="Next"
              disabled={count < 2}
              onClick={() => step(1)}
            >
              <ArrowRightIcon />
            </Button>
          </span>
        }
      />

      <article className="grid grid-cols-1 overflow-hidden rounded-lg border bg-card shadow-soft lg:grid-cols-[1.18fr_1fr]">
        <div className="flex flex-col px-12 pt-8 pb-8 lg:border-border-subtle lg:border-r">
          <div className="mb-6 flex items-center gap-2 font-mono text-2xs text-faint-foreground uppercase tracking-caps">
            <span className="size-1.5 rounded-full bg-seal" />
            {wotd.dateTag}
          </div>
          <div className="flex flex-wrap items-baseline gap-4">
            <h3 className="font-serif font-medium text-3xl leading-[0.94] tracking-tightest lg:text-4xl">
              <AccentedWordMark word={wotd.word} />
            </h3>
            <span className="font-mono text-sm text-faint-foreground tracking-wide">
              / {wotd.pos} /
            </span>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-4 font-mono text-sm text-muted-foreground">
            <ListenButton text={accentedWordText(wotd.word)} lang={wotd.speechLang} />
            <span>
              {wotd.ipa} · plural <em className="text-seal">{wotd.plural}</em>
            </span>
          </div>
          <div className="mt-4 font-serif text-xl text-seal italic">“{wotd.gloss}”</div>
          <p className="mt-3 max-w-[46ch] font-serif text-base text-muted-foreground leading-body line-clamp-4">
            {wotd.definition}
          </p>
          <div className="mt-auto flex flex-wrap items-center gap-4 pt-6">
            <Button asChild>
              <a href={wotd.entryHref}>
                Read the full entry <ArrowRightIcon />
              </a>
            </Button>
            <SaveWordButton
              word={accentedWordText(wotd.word)}
              initialSaved={wotd.saved}
              look="wotd"
            />
          </div>
        </div>

        <aside className="flex flex-col bg-secondary p-8">
          <Overline className="mb-6 text-faint-foreground tracking-caps">
            Entry at a glance
          </Overline>
          <dl className="m-0 grid grid-cols-[auto_1fr] items-baseline gap-x-6 gap-y-4">
            <dt className="font-sans text-sm text-faint-foreground">Etymology</dt>
            <dd className="m-0 font-serif text-base leading-body-tight">
              <Glance value={wotd.glance.etymology} />
            </dd>
            <dt className="font-sans text-sm text-faint-foreground">First attested</dt>
            <dd className="m-0 font-serif text-base leading-body-tight">
              <Glance value={wotd.glance.firstAttested} />
            </dd>
            <dt className="font-sans text-sm text-faint-foreground">Tier coverage</dt>
            <dd className="m-0 flex items-center gap-2">
              {wotd.glance.tiers.map((tier) => (
                <TierDot key={tier} tier={tier} />
              ))}
              <span className="ml-1 text-xs text-muted-foreground">{wotd.glance.tiersLabel}</span>
            </dd>
            <dt className="font-sans text-sm text-faint-foreground">Languages</dt>
            <dd className="m-0 font-serif text-base leading-body-tight">
              <Glance value={wotd.glance.languages} />
            </dd>
            <dt className="font-sans text-sm text-faint-foreground">Frequency</dt>
            <dd className="m-0 font-serif text-base leading-body-tight">
              <Glance value={wotd.glance.frequency} />
            </dd>
          </dl>
          <div className="mt-auto pt-6">
            <Sparkline values={wotd.frequencySeries} axisLabels={wotd.axisLabels} />
          </div>
        </aside>
      </article>
    </section>
  )
}

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
    <section className="mt-16">
      <SectionRule
        label="Word of the day"
        meta={
          <span className="flex shrink-0 items-center gap-[14px]">
            <span className="whitespace-nowrap font-mono text-2xs text-faint-foreground tracking-[0.14em]">
              {pad2(index + 1)} / {pad2(count)}
            </span>
            <span
              className="flex items-center gap-[7px]"
              role="tablist"
              aria-label="Words of the day"
            >
              {wotds.map((w, i) => (
                <button
                  key={w.dateTag}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={accentedWordText(w.word)}
                  onClick={() => setIndex(i)}
                  className={cn(
                    'size-[7px] rounded-full transition-transform',
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

      <article className="mt-[22px] grid grid-cols-1 overflow-hidden rounded-lg border bg-card shadow-soft lg:grid-cols-[1.18fr_1fr]">
        <div className="flex flex-col px-10 pt-[38px] pb-[34px] lg:border-border-subtle lg:border-r">
          <div className="mb-5 flex items-center gap-[9px] font-mono text-2xs text-faint-foreground uppercase tracking-[0.16em]">
            <span className="size-1.5 rounded-full bg-seal" />
            {wotd.dateTag}
          </div>
          <div className="flex flex-wrap items-baseline gap-[14px]">
            <h3 className="font-serif font-medium text-[40px] leading-[0.94] tracking-[-0.03em] md:text-[44px] lg:text-[50px]">
              <AccentedWordMark word={wotd.word} />
            </h3>
            <span className="font-mono text-sm text-faint-foreground tracking-[0.02em]">
              / {wotd.pos} /
            </span>
          </div>
          <div className="mt-[14px] flex flex-wrap items-center gap-[14px] font-mono text-[13px] text-muted-foreground">
            <ListenButton text={accentedWordText(wotd.word)} lang={wotd.speechLang} />
            <span>
              {wotd.ipa} · plural <em className="text-seal">{wotd.plural}</em>
            </span>
          </div>
          <div className="mt-4 font-serif text-xl text-seal italic">“{wotd.gloss}”</div>
          <p className="mt-3 max-w-[46ch] font-serif text-base text-muted-foreground leading-[1.62] line-clamp-4">
            {wotd.definition}
          </p>
          <div className="mt-auto flex flex-wrap items-center gap-[18px] pt-[26px]">
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

        <aside className="flex flex-col bg-secondary p-9">
          <Overline className="mb-[22px] text-faint-foreground tracking-[0.2em]">
            Entry at a glance
          </Overline>
          <dl className="m-0 grid grid-cols-[auto_1fr] items-baseline gap-x-[22px] gap-y-4">
            <dt className="font-sans text-[13px] text-faint-foreground">Etymology</dt>
            <dd className="m-0 font-serif text-[15px] leading-[1.45]">
              <Glance value={wotd.glance.etymology} />
            </dd>
            <dt className="font-sans text-[13px] text-faint-foreground">First attested</dt>
            <dd className="m-0 font-serif text-[15px] leading-[1.45]">
              <Glance value={wotd.glance.firstAttested} />
            </dd>
            <dt className="font-sans text-[13px] text-faint-foreground">Tier coverage</dt>
            <dd className="m-0 flex items-center gap-1.5">
              {wotd.glance.tiers.map((tier) => (
                <TierDot key={tier} tier={tier} />
              ))}
              <span className="ml-1 text-[12px] text-muted-foreground">
                {wotd.glance.tiersLabel}
              </span>
            </dd>
            <dt className="font-sans text-[13px] text-faint-foreground">Languages</dt>
            <dd className="m-0 font-serif text-[15px] leading-[1.45]">
              <Glance value={wotd.glance.languages} />
            </dd>
            <dt className="font-sans text-[13px] text-faint-foreground">Frequency</dt>
            <dd className="m-0 font-serif text-[15px] leading-[1.45]">
              <Glance value={wotd.glance.frequency} />
            </dd>
          </dl>
          <div className="mt-auto pt-[26px]">
            <Sparkline values={wotd.frequencySeries} axisLabels={wotd.axisLabels} />
          </div>
        </aside>
      </article>
    </section>
  )
}

'use client'

import { Badge, Button, Card, CardContent, SectionRule, Sparkline } from '@kotodama/ui'
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react'
import { useState } from 'react'
import { SaveWordButton } from '../words/save-word-button.client'
import { AccentedWordMark } from './accented-word'
import { accentedWordText, type WotdView } from './library.view'
import { ListenButton } from './listen-button.client'

const TIER_DOT: Record<string, string> = {
  everyday: 'bg-tier-everyday',
  cultural: 'bg-tier-cultural',
  formal: 'bg-tier-formal',
  rare: 'bg-tier-rare',
}

const pad = (n: number) => String(n).padStart(2, '0')

export type WordOfTheDayProps = {
  /** The rotation, newest first; prev/next wrap around it. */
  wotds: readonly WotdView[]
}

export function WordOfTheDay({ wotds }: WordOfTheDayProps) {
  const [index, setIndex] = useState(0)
  const count = wotds.length
  const wotd = wotds[index]
  if (wotd == null) return null
  const step = (delta: number) => setIndex((i) => (i + delta + count) % count)

  return (
    <section className="mt-16">
      <SectionRule
        label="Word of the day"
        meta={
          <>
            <span>
              {pad(index + 1)} / {pad(count)}
            </span>
            <Button
              variant="outline"
              size="icon-sm"
              aria-label="Previous"
              disabled={count < 2}
              onClick={() => step(-1)}
            >
              <ArrowLeftIcon />
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              aria-label="Next"
              disabled={count < 2}
              onClick={() => step(1)}
            >
              <ArrowRightIcon />
            </Button>
          </>
        }
      />
      <Card className="mt-5">
        <CardContent className="grid gap-10 p-7 lg:grid-cols-[1fr_300px]">
          <div>
            <Badge variant="outline" className="font-mono text-[10.5px]">
              {wotd.dateTag}
            </Badge>
            <h3 className="mt-3 font-serif font-light text-[46px] leading-none">
              <AccentedWordMark word={wotd.word} />
            </h3>
            <div className="mt-1.5 font-mono text-[12px] text-muted-foreground">/ {wotd.pos} /</div>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-[13px] text-muted-foreground">
              <ListenButton text={accentedWordText(wotd.word)} lang={wotd.speechLang} />
              <span>
                {wotd.ipa} · plural <em>{wotd.plural}</em>
              </span>
            </div>
            <div className="mt-4 font-serif text-[20px] italic">“{wotd.gloss}”</div>
            <p className="mt-3 max-w-[560px] text-[14px] text-muted-foreground leading-relaxed">
              {wotd.definition}
            </p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              <Button asChild>
                <a href={wotd.entryHref}>
                  Read the full entry <ArrowRightIcon />
                </a>
              </Button>
              <SaveWordButton
                word={accentedWordText(wotd.word)}
                initialSaved={wotd.saved}
                look="ghost"
              />
            </div>
          </div>

          <aside className="border-border lg:border-l lg:pl-7">
            <h4 className="font-mono text-[11px] text-muted-foreground uppercase tracking-[0.12em]">
              Entry at a glance
            </h4>
            <dl className="mt-3 flex flex-col">
              {(
                [
                  ['Etymology', wotd.glance.etymology],
                  ['First attested', wotd.glance.firstAttested],
                ] as const
              ).map(([dt, dd]) => (
                <div key={dt} className="border-border border-b py-2.5">
                  <dt className="font-mono text-[10.5px] text-muted-foreground uppercase tracking-[0.12em]">
                    {dt}
                  </dt>
                  <dd className="mt-1 text-[13px] leading-snug">{dd}</dd>
                </div>
              ))}
              <div className="border-border border-b py-2.5">
                <dt className="font-mono text-[10.5px] text-muted-foreground uppercase tracking-[0.12em]">
                  Tier coverage
                </dt>
                <dd className="mt-1.5 flex items-center gap-1.5">
                  {wotd.glance.tiers.map((tier) => (
                    <span key={tier} className={`size-[9px] rounded-xs ${TIER_DOT[tier]}`} />
                  ))}
                  <span className="ml-1 text-[13px]">{wotd.glance.tiersLabel}</span>
                </dd>
              </div>
              {(
                [
                  ['Languages', wotd.glance.languages],
                  ['Frequency', wotd.glance.frequency],
                ] as const
              ).map(([dt, dd]) => (
                <div key={dt} className="border-border border-b py-2.5">
                  <dt className="font-mono text-[10.5px] text-muted-foreground uppercase tracking-[0.12em]">
                    {dt}
                  </dt>
                  <dd className="mt-1 text-[13px] leading-snug">{dd}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-4">
              <Sparkline
                values={wotd.frequencySeries}
                startLabel={wotd.axisStart}
                endLabel={wotd.axisEnd}
              />
            </div>
          </aside>
        </CardContent>
      </Card>
    </section>
  )
}

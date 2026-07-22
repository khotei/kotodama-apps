import {
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  cn,
  DepthTabs,
  DepthTabsContent,
  DepthTabsList,
  DepthTabsTrigger,
  EtymologyTimeline,
  ImageSlot,
  ListenButton,
  SaveWordButton,
  SectionRule,
  Sparkline,
  StatusBadge,
  type WordTier,
} from '@kotodama/ui'
import { ArrowLeftIcon, ArrowRightIcon, EllipsisIcon, PenLineIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { languageName } from '../../../lib/language-name'
import { speechLang } from '../../../lib/speech-lang'
import type { WordEntryContent } from '../../../views/word.view'

const DEPTHS = [
  { id: 'quick', numeral: 'i', name: 'Quick', sublabel: 'one glance' },
  { id: 'everyday', numeral: 'ii', name: 'Everyday', sublabel: 'how it’s used' },
  { id: 'deep', numeral: 'iii', name: 'Deep', sublabel: 'the nuance' },
  { id: 'cultural', numeral: 'iv', name: 'Cultural', sublabel: 'its weight' },
] as const

const SECTIONS = [
  ['sec-meaning', 'Meaning'],
  ['sec-pictures', 'In pictures'],
  ['sec-origins', 'Origins & currents'],
  ['sec-voices', 'Writers'],
  ['sec-connections', 'Connections'],
  ['sec-sources', 'Sources'],
] as const

const KNOWN_TIERS: readonly WordTier[] = ['everyday', 'cultural', 'formal', 'rare']

function Overline({ children }: { children: ReactNode }) {
  return (
    <h3 className="font-mono text-2xs font-medium text-seal uppercase tracking-[0.18em]">
      {children}
    </h3>
  )
}

function Shot({
  prompt,
  kind,
  caption,
  figureClass,
  imageClass = 'flex-1 min-h-[260px]',
}: {
  prompt: string
  kind: string
  caption?: string
  figureClass?: string
  imageClass?: string
}) {
  return (
    <figure className={cn('m-0 flex flex-col', figureClass)}>
      <ImageSlot label={prompt} className={imageClass} />
      <figcaption className="mt-[11px] font-sans text-[13px] text-muted-foreground leading-[1.5]">
        <span className="mb-[5px] block font-mono text-[10px] text-seal uppercase tracking-[0.1em]">
          {kind}
        </span>
        {caption}
      </figcaption>
    </figure>
  )
}

function WordSection({
  id,
  label,
  meta,
  children,
}: {
  id: string
  label: string
  meta?: ReactNode
  children: ReactNode
}) {
  return (
    <section id={id} className="mt-[52px] scroll-mt-24">
      <SectionRule label={label} meta={meta} className="mb-[22px]" />
      {children}
    </section>
  )
}

function GlanceRow({ dt, dd }: { dt: string; dd: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-[14px] border-border-subtle border-b py-[9px] last:border-b-0">
      <dt className="font-sans text-[12px] text-subtle-foreground">{dt}</dt>
      <dd className="text-right font-mono text-[12.5px]">{dd}</dd>
    </div>
  )
}

export type WordEntryViewProps = {
  word: WordEntryContent
  language: string
  libraryHref: string
  searchHref: string
}

/** The full ready entry — every section derives from the real `WordEntryContent`. */
export function WordEntryView({ word, language, libraryHref, searchHref }: WordEntryViewProps) {
  const languageLabel = languageName(language)
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

  const hasVoices = word.authorExamples.length > 0
  // The nav lists only sections that actually render — `sec-voices` is conditional,
  // so an empty `authorExamples` must drop it or the anchor points nowhere.
  const navSections = SECTIONS.filter(([id]) => id !== 'sec-voices' || hasVoices)

  const etymologySteps = [
    { when: 'origin', form: word.etymology.origin.from, note: word.etymology.origin.gloss },
    ...word.etymology.descent.map((step) => ({
      when: step.when,
      form: step.form,
      note: `${step.languageName} · ${step.gloss}`,
    })),
  ]

  return (
    <div className="pt-8 pb-20">
      <Breadcrumb>
        <BreadcrumbList className="font-mono text-xs tracking-[0.06em]">
          <BreadcrumbItem>
            <BreadcrumbLink href={libraryHref}>Library</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={searchHref}>{languageLabel}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{word.word}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mt-9 grid grid-cols-1 gap-9 lg:grid-cols-[1fr_300px] lg:gap-14">
        <div className="min-w-0">
          <header>
            <div className="flex flex-wrap items-center gap-3">
              <Badge className="font-mono uppercase">{language}</Badge>
              <Badge className="font-mono">{word.lexical.partOfSpeech}</Badge>
              <StatusBadge status="ready" />
            </div>
            <h1 className="mt-[22px] font-serif font-medium text-[64px] leading-[0.9] tracking-[-0.04em] md:text-[80px] lg:text-5xl">
              {word.word}
            </h1>
            <div className="mt-[22px] flex flex-wrap items-baseline gap-[22px]">
              <span className="font-mono text-[19px] text-muted-foreground tracking-[0.01em]">
                {word.pronunciation.ipa}
              </span>
              <span className="font-sans text-[13px] text-subtle-foreground uppercase tracking-[0.06em]">
                {word.pronunciation.respelling}
              </span>
              <ListenButton text={word.word} lang={speechLang(language)} />
            </div>
            <p className="mt-[26px] max-w-[640px] font-serif text-2xl text-seal italic leading-[1.2] tracking-[-0.01em] before:content-['“'] after:content-['”']">
              {word.coreDefinition}
            </p>
            <div className="mt-[30px] flex flex-wrap items-center gap-2.5">
              <SaveWordButton word={word.word} />
              <Button variant="outline" size="icon" aria-label="Add a note">
                <PenLineIcon />
              </Button>
              <Button variant="outline" size="icon" aria-label="More">
                <EllipsisIcon />
              </Button>
            </div>
          </header>

          <WordSection id="sec-meaning" label="Meaning · four depths" meta="quick → cultural">
            <DepthTabs defaultValue="quick" className="mt-5">
              <DepthTabsList>
                {DEPTHS.map(({ id, numeral, name, sublabel }) => (
                  <DepthTabsTrigger
                    key={id}
                    value={id}
                    numeral={numeral}
                    name={name}
                    sublabel={sublabel}
                  />
                ))}
              </DepthTabsList>
              {DEPTHS.map(({ id }) => {
                const tier = word.tiers[id]
                return (
                  <DepthTabsContent key={id} value={id} className="pt-6">
                    <h3 className="font-serif font-medium text-[28px] leading-snug tracking-[-0.02em]">
                      {tier.title}
                    </h3>
                    <p className="mt-3 font-serif text-lg leading-[1.72]">{tier.body}</p>
                    <ul className="mt-[22px] flex list-none flex-col gap-3 border-border-subtle border-t p-0 pt-[18px]">
                      {tier.examples.map((example) => (
                        <li key={example.text} className="flex items-baseline gap-3">
                          <span className="font-serif text-lg italic leading-[1.45] before:mr-1.5 before:text-seal before:not-italic before:content-['—']">
                            {example.text}
                          </span>
                          <span className="ml-auto shrink-0 rounded-full border border-border px-[7px] py-0.5 font-mono text-[9.5px] text-subtle-foreground uppercase tracking-[0.1em]">
                            {example.register}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </DepthTabsContent>
                )
              })}
            </DepthTabs>
          </WordSection>

          <WordSection id="sec-pictures" label="In pictures" meta="drop your own">
            <div className="mt-5 grid grid-cols-1 gap-[22px] md:grid-cols-[1.5fr_1fr]">
              <Shot
                prompt={word.visuals.hero.prompt}
                kind="Hero"
                caption={word.visuals.hero.caption ?? word.visuals.hero.concept}
                imageClass="flex-1 min-h-[320px]"
              />
              <Shot
                prompt={word.visuals.infographic.prompt}
                kind="Infographic"
                caption={word.visuals.infographic.caption ?? word.visuals.infographic.concept}
                imageClass="flex-1 min-h-[280px]"
              />
            </div>
            {word.visuals.memes.length > 0 && (
              <div className="mt-[30px]">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-2xs font-medium text-seal uppercase tracking-[0.18em]">
                    Memes · {word.visuals.memes.length}
                  </span>
                  <span className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon-sm"
                      aria-label="Previous memes"
                      className="size-[34px] rounded-sm"
                      disabled
                    >
                      <ArrowLeftIcon />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon-sm"
                      aria-label="Next memes"
                      className="size-[34px] rounded-sm"
                      disabled
                    >
                      <ArrowRightIcon />
                    </Button>
                  </span>
                </div>
                <div className="mt-[14px] flex snap-x snap-mandatory gap-[18px] overflow-x-auto pb-2.5">
                  {word.visuals.memes.map((meme) => (
                    <Shot
                      key={meme.imageKey}
                      prompt={meme.prompt}
                      kind="Meme"
                      caption={meme.caption ?? meme.concept}
                      figureClass="flex-[0_0_296px] snap-start"
                      imageClass="aspect-[4/3] w-full"
                    />
                  ))}
                </div>
              </div>
            )}
          </WordSection>

          <WordSection
            id="sec-origins"
            label="Origins & currents"
            meta="where it comes from · where it’s going"
          >
            <div className="mt-5">
              <Overline>Etymology</Overline>
              <p className="mt-4 max-w-[640px] font-serif text-lg leading-[1.72]">
                {word.etymology.summary}
              </p>
              <EtymologyTimeline steps={etymologySteps} className="mt-6" />
            </div>
            {word.culturalGuide.timeline.length > 0 && (
              <div className="mt-10 border-border-subtle border-t pt-8">
                <Overline>Cultural currents</Overline>
                <EtymologyTimeline
                  steps={word.culturalGuide.timeline.map((step) => ({
                    when: step.date,
                    note: step.text,
                  }))}
                  className="mt-5"
                />
                {word.culturalGuide.notes.length > 0 && (
                  <ul className="mt-6 flex list-none flex-col gap-[11px] p-0">
                    {word.culturalGuide.notes.map((note) => (
                      <li
                        key={note}
                        className="relative pl-[22px] font-serif text-[16.5px] text-muted-foreground leading-[1.55] before:absolute before:top-[-2px] before:left-[6px] before:text-seal before:content-['·']"
                      >
                        {note}
                      </li>
                    ))}
                  </ul>
                )}
                {word.culturalGuide.forecast2030 != null && (
                  <div className="mt-6 rounded-r-lg border border-seal-line border-l-[3px] border-l-seal bg-seal/[0.06] px-5 py-[18px]">
                    <Overline>Forecast · where it’s heading</Overline>
                    <p className="mt-3 font-serif text-[16.5px] leading-[1.6]">
                      {word.culturalGuide.forecast2030}
                    </p>
                  </div>
                )}
              </div>
            )}
          </WordSection>

          {hasVoices && (
            <WordSection
              id="sec-voices"
              label="In the words of writers"
              meta={`${word.authorExamples.length} passages`}
            >
              <div className="mt-5 grid grid-cols-1 gap-[18px] md:grid-cols-2">
                {word.authorExamples.map((voice) => (
                  <div
                    key={`${voice.author}-${voice.quote.slice(0, 16)}`}
                    className="relative flex flex-col rounded-sm border border-border bg-card px-6 pt-[22px] pb-5"
                  >
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-border-subtle border-b pb-4">
                      <ImageSlot shape="circle" className="size-11" />
                      <span className="mr-auto min-w-0 flex-1 basis-[90px]">
                        <span className="block truncate font-sans font-semibold text-[13px]">
                          {voice.author}
                        </span>
                        <span className="block truncate font-mono text-[10px] text-subtle-foreground tracking-[0.04em]">
                          {voice.isGenerated ? 'AI · written in the style of' : voice.work}
                        </span>
                      </span>
                      {voice.isGenerated ? (
                        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-tier-cultural/10 px-2 py-[3px] font-mono text-[9.5px] text-tier-cultural uppercase leading-none tracking-[0.12em]">
                          <span className="size-[5px] rounded-full bg-current" /> AI · in style
                        </span>
                      ) : (
                        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-success-subtle px-2 py-[3px] font-mono text-[9.5px] text-success uppercase leading-none tracking-[0.12em]">
                          <span className="size-[5px] rounded-full bg-current" /> quote
                        </span>
                      )}
                    </div>
                    <blockquote className="mt-4 border-none p-0 font-serif text-[20px] italic leading-[1.5]">
                      {voice.quote}
                    </blockquote>
                  </div>
                ))}
              </div>
            </WordSection>
          )}

          <WordSection
            id="sec-connections"
            label="Connections"
            meta="related words · across languages"
          >
            <div className="mt-5 grid grid-cols-1 gap-x-12 gap-y-7 md:grid-cols-2">
              {(
                [
                  ['Near in meaning', word.relations.synonyms],
                  ['Word family', word.relations.family.map((term) => ({ term }))],
                ] as const
              ).map(([heading, items]) => (
                <div key={heading}>
                  <Overline>{heading}</Overline>
                  <div className="mt-3">
                    {items.map((item) => (
                      <span
                        key={item.term}
                        className="flex items-baseline gap-4 border-border-subtle border-b py-[14px]"
                      >
                        <span className="min-w-[170px] font-serif text-[21px] tracking-[-0.01em]">
                          {item.term}
                        </span>
                        {'note' in item && item.note != null && (
                          <span className="min-w-0 flex-1 truncate font-serif text-[16px] text-muted-foreground italic">
                            {item.note}
                          </span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {word.translations.length > 0 && (
              <div className="mt-10">
                <Overline>Across languages</Overline>
                <div className="mt-3 grid md:grid-cols-2 md:gap-x-10">
                  {word.translations.map((translation) => (
                    <span
                      key={translation.language}
                      className="flex items-baseline gap-[18px] border-border-subtle border-b py-[13px]"
                    >
                      <span className="w-[130px] shrink-0 font-sans font-semibold text-[12.5px] text-subtle-foreground tracking-[0.04em]">
                        {languageName(translation.language)}
                      </span>
                      <span className="font-serif text-[19px]">{translation.term}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </WordSection>

          <WordSection id="sec-sources" label="Sources" meta="grounded · cited">
            <p className="mt-4 mb-[18px] max-w-[64ch] font-serif font-light text-[16px] text-muted-foreground leading-[1.6]">
              Every fact here is grounded in a source below. Kotodama writes the tone and the
              examples — never the facts.
            </p>
            <ol className="list-none p-0">
              {word.sources.map((source) => (
                <li
                  key={`${source.index}`}
                  className="grid grid-cols-[36px_1fr_auto] items-baseline gap-[14px] border-border border-b border-dotted py-3"
                >
                  <span className="font-mono text-[12px] text-seal">
                    [{String(source.index).padStart(2, '0')}]
                  </span>
                  <span className="font-serif text-[16px] leading-[1.4]">{source.title}</span>
                  <span className="whitespace-nowrap font-mono text-[10.5px] text-subtle-foreground tracking-[0.04em]">
                    {source.type}
                  </span>
                </li>
              ))}
            </ol>
          </WordSection>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="flex flex-col gap-6">
            <div className="rounded-sm border border-border bg-card px-5 py-[18px]">
              <div className="mb-3 font-mono text-2xs font-medium text-seal uppercase tracking-[0.2em]">
                At a glance
              </div>
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
              <div className="mb-3 font-mono text-2xs font-medium text-seal uppercase tracking-[0.2em]">
                On this page
              </div>
              <ul className="flex list-none flex-col gap-px p-0">
                {navSections.map(([id, label]) => (
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
      </div>
    </div>
  )
}

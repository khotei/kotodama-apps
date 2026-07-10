import type { Language, ReadyWord } from '@kotodama/store'
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DepthTabs,
  DepthTabsContent,
  DepthTabsList,
  DepthTabsTrigger,
  EtymologyTimeline,
  ImageSlot,
  SectionRule,
  Sparkline,
  StatusBadge,
  TierChip,
  type WordTier,
} from '@kotodama/ui'
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  EllipsisIcon,
  PenLineIcon,
  SparklesIcon,
  TrendingUpIcon,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { ListenButton } from '../library/listen-button.client'
import { SaveWordButton } from './save-word-button.client'

const LANGUAGE_NAME: Record<Language, string> = {
  ru: 'Russian',
  en: 'English',
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  zh: 'Chinese',
  ja: 'Japanese',
  hi: 'Hindi',
  ar: 'Arabic',
  uk: 'Ukrainian',
}

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

function Shot({ prompt, kind, caption }: { prompt: string; kind: string; caption?: string }) {
  return (
    <figure className="m-0">
      <ImageSlot label={prompt} className="h-[260px]" />
      <figcaption className="mt-2 text-[12.5px] text-muted-foreground">
        <span className="mr-2 font-mono text-[10.5px] uppercase tracking-[0.12em]">{kind}</span>
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
    <section id={id} className="mt-[60px] scroll-mt-24">
      <SectionRule label={label} meta={meta} />
      {children}
    </section>
  )
}

function GlanceRow({ dt, dd }: { dt: string; dd: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 border-border border-b py-2">
      <dt className="text-[12.5px] text-muted-foreground">{dt}</dt>
      <dd className="text-right text-[13px]">{dd}</dd>
    </div>
  )
}

export type WordEntryViewProps = {
  word: ReadyWord
  language: Language
  libraryHref: string
  searchHref: string
}

/** The full ready entry — every section derives from the real `ReadyWord`. */
export function WordEntryView({ word, language, libraryHref, searchHref }: WordEntryViewProps) {
  const languageName = LANGUAGE_NAME[language]
  const registerTier = word.lexical.register.find((r): r is WordTier =>
    (KNOWN_TIERS as readonly string[]).includes(r),
  )
  const frequency = word.frequency
  const frequencySeries = frequency?.series.map((p) => Number(p.value) || 0) ?? []
  const firstYear = frequency?.series.at(0)?.year
  const lastYear = frequency?.series.at(-1)?.year

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
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={libraryHref}>Library</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={searchHref}>{languageName}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{word.word}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mt-8 grid gap-12 lg:grid-cols-[1fr_300px] lg:gap-[72px]">
        <div className="min-w-0">
          <header>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="uppercase">
                {language}
              </Badge>
              <Badge variant="outline">{word.lexical.partOfSpeech}</Badge>
              <StatusBadge status="ready" />
            </div>
            <h1 className="mt-4 font-serif font-light text-[52px] leading-[1.02] md:text-[94px]">
              {word.word}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <span className="font-mono text-[15px]">{word.pronunciation.ipa}</span>
              <span className="text-[14px] text-muted-foreground italic">
                {word.pronunciation.respelling}
              </span>
              <ListenButton text={word.word} lang={language} />
            </div>
            <p className="mt-4 max-w-[640px] font-serif text-2xl italic leading-snug">
              {word.coreDefinition}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-2.5">
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
                    <h3 className="font-serif text-[22px] leading-snug">{tier.title}</h3>
                    <p className="mt-3 font-serif text-[17px] leading-[1.7]">{tier.body}</p>
                    <ul className="mt-5 list-none p-0">
                      {tier.examples.map((example) => (
                        <li
                          key={example.text}
                          className="flex items-baseline justify-between gap-4 border-border border-b py-2.5"
                        >
                          <span className="font-serif text-[15.5px]">{example.text}</span>
                          <Badge variant="outline" className="shrink-0 font-mono text-[10.5px]">
                            {example.register}
                          </Badge>
                        </li>
                      ))}
                    </ul>
                  </DepthTabsContent>
                )
              })}
            </DepthTabs>
          </WordSection>

          <WordSection id="sec-pictures" label="In pictures" meta="drop your own">
            <div className="mt-5 grid gap-5 md:grid-cols-[1.4fr_1fr]">
              <Shot
                prompt={word.visuals.hero.prompt}
                kind="Hero"
                caption={word.visuals.hero.caption ?? word.visuals.hero.concept}
              />
              <Shot
                prompt={word.visuals.infographic.prompt}
                kind="Infographic"
                caption={word.visuals.infographic.caption ?? word.visuals.infographic.concept}
              />
            </div>
            {word.visuals.memes.length > 0 && (
              <div className="mt-7">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] text-muted-foreground uppercase tracking-[0.12em]">
                    Memes · {word.visuals.memes.length}
                  </span>
                  <span className="flex gap-1.5">
                    <Button variant="outline" size="icon-sm" aria-label="Previous memes" disabled>
                      <ArrowLeftIcon />
                    </Button>
                    <Button variant="outline" size="icon-sm" aria-label="Next memes" disabled>
                      <ArrowRightIcon />
                    </Button>
                  </span>
                </div>
                <div className="mt-3 grid gap-4 md:grid-cols-3">
                  {word.visuals.memes.map((meme) => (
                    <figure key={meme.imageKey} className="m-0">
                      <ImageSlot label={meme.prompt} className="h-[150px]" />
                      <figcaption className="mt-2 text-[12.5px] text-muted-foreground">
                        <span className="mr-2 font-mono text-[10.5px] uppercase tracking-[0.12em]">
                          Meme
                        </span>
                        {meme.caption ?? meme.concept}
                      </figcaption>
                    </figure>
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
              <h3 className="font-medium text-[15px]">Etymology</h3>
              <p className="mt-2 max-w-[640px] font-serif text-[17px] leading-[1.7]">
                {word.etymology.summary}
              </p>
              <EtymologyTimeline steps={etymologySteps} className="mt-6" />
            </div>
            {word.culturalGuide.timeline.length > 0 && (
              <div className="mt-10">
                <h3 className="font-medium text-[15px]">Cultural currents</h3>
                <EtymologyTimeline
                  steps={word.culturalGuide.timeline.map((step) => ({
                    when: step.date,
                    note: step.text,
                  }))}
                  className="mt-5"
                />
                {word.culturalGuide.notes.length > 0 && (
                  <ul className="mt-5 flex list-disc flex-col gap-1.5 pl-5 text-[13.5px] text-muted-foreground">
                    {word.culturalGuide.notes.map((note) => (
                      <li key={note}>{note}</li>
                    ))}
                  </ul>
                )}
                {word.culturalGuide.forecast2030 != null && (
                  <Alert className="mt-6">
                    <TrendingUpIcon />
                    <AlertTitle>Forecast · where it’s heading</AlertTitle>
                    <AlertDescription>{word.culturalGuide.forecast2030}</AlertDescription>
                  </Alert>
                )}
              </div>
            )}
          </WordSection>

          {word.authorExamples.length > 0 && (
            <WordSection
              id="sec-voices"
              label="In the words of writers"
              meta={`${word.authorExamples.length} passages`}
            >
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {word.authorExamples.map((voice) => (
                  <Card key={`${voice.author}-${voice.quote.slice(0, 16)}`}>
                    <CardContent className="p-5">
                      <div className="flex items-center gap-3">
                        <ImageSlot shape="circle" className="size-9" />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-medium text-[14px]">
                            {voice.author}
                          </span>
                          <span className="block truncate text-[12px] text-muted-foreground">
                            {voice.isGenerated ? 'AI · written in the style of' : voice.work}
                          </span>
                        </span>
                        {voice.isGenerated ? (
                          <Badge variant="outline">
                            <SparklesIcon /> AI · in style
                          </Badge>
                        ) : (
                          <Badge variant="secondary">quote</Badge>
                        )}
                      </div>
                      <blockquote className="mt-4 border-none p-0 font-serif text-[16.5px] leading-relaxed">
                        {voice.quote}
                      </blockquote>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </WordSection>
          )}

          <WordSection
            id="sec-connections"
            label="Connections"
            meta="related words · across languages"
          >
            <div className="mt-5 grid gap-10 md:grid-cols-2">
              {(
                [
                  ['Near in meaning', word.relations.synonyms],
                  ['Word family', word.relations.family.map((term) => ({ term }))],
                ] as const
              ).map(([heading, items]) => (
                <div key={heading}>
                  <h3 className="font-medium text-[15px]">{heading}</h3>
                  <div className="mt-3 border-border border-t">
                    {items.map((item) => (
                      <span
                        key={item.term}
                        className="flex items-baseline gap-3 border-border border-b py-2.5"
                      >
                        <span className="font-serif text-[16px]">{item.term}</span>
                        {'note' in item && item.note != null && (
                          <span className="min-w-0 flex-1 truncate font-serif text-[13.5px] text-muted-foreground italic">
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
                <h3 className="font-medium text-[15px]">Across languages</h3>
                <div className="mt-3 grid border-border border-t md:grid-cols-2 md:gap-x-10">
                  {word.translations.map((translation) => (
                    <span
                      key={translation.language}
                      className="flex items-baseline gap-4 border-border border-b py-2.5"
                    >
                      <span className="w-[88px] shrink-0 font-mono text-[10.5px] text-muted-foreground uppercase tracking-[0.12em]">
                        {LANGUAGE_NAME[translation.language]}
                      </span>
                      <span className="font-serif text-[15px]">{translation.term}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </WordSection>

          <WordSection id="sec-sources" label="Sources" meta="grounded · cited">
            <p className="mt-4 max-w-[560px] text-[13.5px] text-muted-foreground">
              Every fact here is grounded in a source below. Kotodama writes the tone and the
              examples — never the facts.
            </p>
            <ol className="mt-4 list-none border-border border-t p-0">
              {word.sources.map((source) => (
                <li
                  key={`${source.index}`}
                  className="flex items-baseline gap-4 border-border border-b py-2.5"
                >
                  <span className="font-mono text-[11px] text-muted-foreground">
                    [{String(source.index).padStart(2, '0')}]
                  </span>
                  <span className="min-w-0 flex-1 text-[13.5px]">{source.title}</span>
                  <span className="font-mono text-[10.5px] text-muted-foreground uppercase">
                    {source.type}
                  </span>
                </li>
              ))}
            </ol>
          </WordSection>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="flex flex-col gap-5">
            <Card>
              <CardHeader>
                <CardTitle>At a glance</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="flex flex-col">
                  <GlanceRow dt="Part of speech" dd={word.lexical.partOfSpeech} />
                  <GlanceRow
                    dt="Pronunciation"
                    dd={<span className="font-mono">{word.pronunciation.ipa}</span>}
                  />
                  <GlanceRow dt="Respelling" dd={word.pronunciation.respelling} />
                  <GlanceRow
                    dt="Register"
                    dd={
                      registerTier != null ? (
                        <TierChip tier={registerTier} />
                      ) : (
                        word.lexical.register.join(' · ')
                      )
                    }
                  />
                  {frequency != null && <GlanceRow dt="Frequency" dd={frequency.band} />}
                </dl>
                {frequencySeries.length > 1 && (
                  <div className="mt-5">
                    <div className="font-mono text-[10.5px] text-muted-foreground uppercase tracking-[0.12em]">
                      Frequency{firstYear != null ? ` · ${firstYear}–${lastYear}` : ''}
                    </div>
                    <Sparkline
                      className="mt-2"
                      values={frequencySeries}
                      startLabel={firstYear ?? undefined}
                      endLabel={lastYear ?? undefined}
                    />
                    {frequency?.trendNote != null && (
                      <p className="mt-2 text-[12px] text-muted-foreground leading-snug">
                        {frequency.trendNote}
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>On this page</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="flex list-none flex-col gap-2 p-0">
                  {SECTIONS.map(([id, label]) => (
                    <li key={id}>
                      <a
                        href={`#${id}`}
                        className="text-[13.5px] text-muted-foreground no-underline transition-colors hover:text-foreground"
                      >
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </aside>
      </div>
    </div>
  )
}

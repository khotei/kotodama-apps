import { EllipsisIcon, PenLineIcon } from 'lucide-react'
import { languageName } from '../../../lib/language-name'
import { speechLang } from '../../../lib/speech-lang'
import type { WordEntryContent } from '../../../views/word.view'
import { ListenButton } from '../../atoms/listen-button'
import { SaveWordButton } from '../../core/save-word-button'
import { StatusBadge } from '../../core/status-badge'
import { Badge } from '../../ui/badge'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../../ui/breadcrumb'
import { Button } from '../../ui/button'
import { ConnectionsSection } from './connections-section'
import { EntryAside } from './entry-aside'
import { MeaningSection } from './meaning-section'
import { OriginsSection } from './origins-section'
import { PicturesSection } from './pictures-section'
import { SourcesSection } from './sources-section'
import { VoicesSection } from './voices-section'

const SECTIONS = [
  ['sec-meaning', 'Meaning'],
  ['sec-pictures', 'In pictures'],
  ['sec-origins', 'Origins & currents'],
  ['sec-voices', 'Writers'],
  ['sec-connections', 'Connections'],
  ['sec-sources', 'Sources'],
] as const

export type WordEntryViewProps = {
  word: WordEntryContent
  language: string
  libraryHref: string
  searchHref: string
}

/** The full ready entry: header + the six section organisms + the sticky aside. */
export function WordEntryView({ word, language, libraryHref, searchHref }: WordEntryViewProps) {
  const languageLabel = languageName(language)
  // The nav lists only sections that actually render — `sec-voices` is conditional,
  // so an empty `authorExamples` must drop it or the anchor points nowhere.
  const navSections = SECTIONS.filter(
    ([id]) => id !== 'sec-voices' || word.authorExamples.length > 0,
  )

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

          <MeaningSection tiers={word.tiers} />
          <PicturesSection visuals={word.visuals} />
          <OriginsSection etymology={word.etymology} culturalGuide={word.culturalGuide} />
          <VoicesSection voices={word.authorExamples} />
          <ConnectionsSection relations={word.relations} translations={word.translations} />
          <SourcesSection sources={word.sources} />
        </div>

        <EntryAside word={word} nav={navSections} />
      </div>
    </div>
  )
}

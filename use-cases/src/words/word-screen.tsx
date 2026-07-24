import type { Language, WordStateModel } from '@kotodama/store'
import { WordFailedView, WordGeneratingView, WordNotFoundView } from './word-build-view'
import { WordEntryView } from './word-entry-view'

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

export type WordScreenProps = {
  model: WordStateModel | null
  language: Language
  word: string
  libraryHref: string
  searchHref: string
  /** Injected Server Action (bound) for the Create / Try-again CTAs. */
  buildAction?: (formData: FormData) => Promise<void>
}

/**
 * The ONE domain → view switch for the word route: `null` → not-found,
 * `unready` → generating or failed, `ready` → the full entry. A Server
 * Component — the app resolves the model and injects it.
 */
export function WordScreen({
  model,
  language,
  word,
  libraryHref,
  searchHref,
  buildAction,
}: WordScreenProps) {
  if (model === null) {
    return (
      <WordNotFoundView
        word={word}
        languageName={LANGUAGE_NAME[language]}
        backHref={libraryHref}
        searchHref={searchHref}
        buildAction={buildAction}
      />
    )
  }
  if (model.kind === 'unready') {
    if (model.status === 'failed') {
      return (
        <WordFailedView
          word={word}
          stages={model.stages}
          backHref={libraryHref}
          buildAction={buildAction}
        />
      )
    }
    return <WordGeneratingView word={word} stages={model.stages} backHref={libraryHref} />
  }
  return (
    <WordEntryView
      word={model.word}
      language={language}
      libraryHref={libraryHref}
      searchHref={searchHref}
    />
  )
}

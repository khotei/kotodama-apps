import { languageName } from '../../../lib/language-name'
import type { WordScreenView } from '../../../views/word.view'
import {
  WordFailedView,
  WordGeneratingView,
  WordNotFoundView,
} from '../../organisms/word-build/word-build-view'
import { WordEntryView } from '../../organisms/word-entry/word-entry-view'

export type WordScreenProps = {
  model: WordScreenView | null
  language: string
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
        languageName={languageName(language)}
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
    return (
      <WordGeneratingView
        word={word}
        stages={model.stages}
        backHref={libraryHref}
        status={model.status === 'pending' ? 'pending' : 'generating'}
      />
    )
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

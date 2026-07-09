import type { Language, WordStateModel } from '@kotodama/store'
import { WordCard } from '@kotodama/ui'

// The domain-aware feature view (mirrors a use-case): map the `WordStateModel` onto
// WordCard's PRIMITIVE props. The ONE place domain → view mapping happens — ui stays
// prop-driven, use-cases stays Next-free. A Server Component: data is resolved by the
// app and passed as a prop, so there is no fetch, no loading/error arm — `null` means
// the word does not exist yet, every other state is a concrete card.
export function WordView({
  model,
  language,
  word,
}: {
  model: WordStateModel | null
  language: Language
  word: string
}) {
  if (model === null) {
    return (
      <WordCard
        word={word}
        language={language}
        status="failed"
        coreDefinition="This word has not been built yet."
      />
    )
  }
  if (model.kind === 'ready') {
    return (
      <WordCard
        word={word}
        language={language}
        status="succeeded"
        coreDefinition={model.word.coreDefinition}
      />
    )
  }
  return <WordCard word={word} language={language} status={model.status} />
}

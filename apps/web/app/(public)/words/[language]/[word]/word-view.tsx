'use client'

import { WordCard } from '@kotodama/ui'
import { type Language, useWord } from '@kotodama/use-cases'

// The feature seam: subscribe to the platform-agnostic `useWord` and map its
// domain model (`WordStateModel | null`) onto WordCard's PRIMITIVE props. The
// only place domain → view mapping happens — ui stays prop-driven, the spine
// stays DOM-free. Data arrives hydrated from the RSC prefetch (see page.tsx), so
// on a warm cache this renders the ready card on first paint, no client fetch.
export function WordView({ language, word }: { language: Language; word: string }) {
  const { data, isPending, isError } = useWord(language, word)

  if (isPending) {
    return <WordCard word={word} language={language} status="running" />
  }
  if (isError) {
    return <WordCard word={word} language={language} status="failed" />
  }
  if (data === null) {
    return (
      <WordCard
        word={word}
        language={language}
        status="failed"
        coreDefinition="This word has not been built yet."
      />
    )
  }
  if (data.kind === 'ready') {
    return (
      <WordCard
        word={word}
        language={language}
        status="succeeded"
        coreDefinition={data.word.coreDefinition}
      />
    )
  }
  return <WordCard word={word} language={language} status={data.status} />
}

import type { Language } from '@kotodama/api-client'
import { WordCard } from '@kotodama/ui'
import { useWord } from '@kotodama/use-cases'

// The web feature glue: call the platform-agnostic `useWord` hook (use-cases)
// and map the narrowed domain shape onto `ui`'s primitive props. All Chakra
// rendering lives on the web side; the hook (data) is reusable in any app.
export interface WordPageProps {
  language: Language
  word: string
}

export function WordPage({ language, word }: WordPageProps) {
  const { data, isPending, isError } = useWord(language, word)

  if (isPending) return <p>Loading…</p>
  if (isError) return <p role="alert">Failed to load word.</p>
  if (!data) return <p>Word “{word}” not found.</p>

  if (data.kind === 'ready') {
    const w = data.word
    return (
      <WordCard
        word={w.word}
        language={w.language}
        status={w.status}
        coreDefinition={w.coreDefinition}
      />
    )
  }

  return <WordCard word={word} language={language} status={data.status} />
}

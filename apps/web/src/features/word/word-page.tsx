import { type ApiClient, type Language, wordQueryOptions } from '@kotodama/fe-store'
import { WordCard } from '@kotodama/fe-ui'
import { useQuery } from '@tanstack/react-query'

// The word FEATURE — the composition seam `store → feature → render`. Pure and
// prop-driven: it takes the client + params as props (never reads the route),
// so it can't import the render layer (Biome ban) and is trivially testable
// (T07 renders it with a fake client + a QueryClientProvider).
//
// Data flows store → fe-core: `wordQueryOptions.select` already narrowed the
// wire union to `{ kind: 'ready' | 'unready' }`, so this component only maps the
// narrowed domain shape onto fe-ui primitive props — no wire types leak in.

export interface WordPageProps {
  apiClient: ApiClient
  language: Language
  word: string
}

export function WordPage({ apiClient, language, word }: WordPageProps) {
  const { data, isPending, isError } = useQuery(wordQueryOptions(apiClient, language, word))

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

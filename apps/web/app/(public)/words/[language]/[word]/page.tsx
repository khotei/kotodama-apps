import { type Language, type ReadyWord, wordQueryOptions } from '@kotodama/store'
import { Button } from '@kotodama/ui'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import type { Metadata } from 'next'
import { cache } from 'react'
import { createStaticApiClient } from '@/src/api-client'
import { getQueryClient } from '../../../../get-query-client'
import { WordView } from './word-view'

export const revalidate = 10
export const dynamicParams = true

export function generateStaticParams() {
  // Decoded, NOT percent-encoded — Next matches the decoded segment (gate f).
  return [{ language: 'ja', word: '言葉' }]
}

// ONE fetch per request shared by generateMetadata and the page: React.cache
// dedupes the call, and the SAME prefetched QueryClient is dehydrated for the
// client — so metadata, JSON-LD, and the hydrated cache all read one network
// round-trip. getQueryClient() is per-request on the server, so this cache is
// per-request too (React.cache is request-scoped).
const loadWord = cache(async (language: Language, word: string) => {
  const queryClient = getQueryClient()
  const options = wordQueryOptions(createStaticApiClient(), language, word)
  // prefetchQuery never throws — a backend-less build/request leaves the cache
  // empty and the readers below fall back to the not-ready path.
  await queryClient.prefetchQuery(options)
  const state = queryClient.getQueryData(options.queryKey)
  const ready = state?.status === 'succeeded' ? state.word : null
  return { queryClient, ready }
})

export async function generateMetadata({
  params,
}: {
  params: Promise<{ language: string; word: string }>
}): Promise<Metadata> {
  const { language, word } = await params
  const decodedWord = decodeURIComponent(word)
  const { ready } = await loadWord(language as Language, decodedWord)

  const title = ready?.word ?? decodedWord
  const description = ready?.coreDefinition ?? 'This word is still being generated.'
  return {
    title,
    description,
    openGraph: { title, description },
    // Don't index a word that isn't built yet (AC-5).
    ...(ready ? {} : { robots: { index: false } }),
  }
}

// The DefinedTerm document, serialized with `<` escaped to `<` so a value
// can never break out of the <script> element (the standard JSON-LD injection
// guard) — dangerouslySetInnerHTML does no escaping of its own.
function DefinedTermJsonLd({ word, language }: { word: ReadyWord; language: string }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: word.word,
    description: word.coreDefinition,
    inLanguage: language,
  }
  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD must be inline; `<` is escaped above.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
    />
  )
}

export default async function WordPage({
  params,
}: {
  params: Promise<{ language: string; word: string }>
}) {
  const { language, word } = await params
  const decodedWord = decodeURIComponent(word)
  // Same cached call as generateMetadata — one fetch, one prefetched client.
  const { queryClient, ready } = await loadWord(language as Language, decodedWord)

  return (
    <main className="min-h-dvh space-y-4 p-8">
      {ready ? <DefinedTermJsonLd word={ready} language={language} /> : null}
      <HydrationBoundary state={dehydrate(queryClient)}>
        <WordView language={language as Language} word={decodedWord} />
      </HydrationBoundary>
      <Button variant="outline" size="sm">
        Regenerate
      </Button>
    </main>
  )
}

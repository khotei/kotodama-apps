import { type Language, wordQueryOptions } from '@kotodama/store'
import { Button } from '@kotodama/ui'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { createStaticApiClient } from '@/src/api-client'
import { getQueryClient } from '../../../../get-query-client'
import { WordView } from './word-view'

export const revalidate = 10
export const dynamicParams = true

export function generateStaticParams() {
  // Decoded, NOT percent-encoded — Next matches the decoded segment (gate f).
  return [{ language: 'ja', word: '言葉' }]
}

export default async function WordPage({
  params,
}: {
  params: Promise<{ language: string; word: string }>
}) {
  const { language, word } = await params
  const decodedWord = decodeURIComponent(word)

  // Public tree → the STATIC client (no cookies, so the route stays SSG-able).
  // The route segment is a bare string; the backend rejects an unknown language
  // at decode, so the cast is the honest seam, not a validation hole.
  const queryClient = getQueryClient()
  await queryClient.prefetchQuery(
    wordQueryOptions(createStaticApiClient(), language as Language, decodedWord),
  )

  return (
    <main className="min-h-dvh space-y-4 p-8">
      {/* prefetchQuery never throws — a backend-less build dehydrates nothing
          and WordView renders the loading/error arm. */}
      <HydrationBoundary state={dehydrate(queryClient)}>
        <WordView language={language as Language} word={decodedWord} />
      </HydrationBoundary>
      <Button variant="outline" size="sm">
        Regenerate
      </Button>
    </main>
  )
}

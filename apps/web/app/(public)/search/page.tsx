import { SearchPage } from '@kotodama/use-cases'
import { SEARCH_WORDS_MOCK } from '@kotodama/use-cases/fixtures'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Search',
  description: 'Search your Kotodama library, or type a new word to generate its entry.',
}

export default async function SearchRoute({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; saved?: string }>
}) {
  const { q, saved } = await searchParams
  return (
    <SearchPage
      words={SEARCH_WORDS_MOCK}
      initialQuery={q ?? ''}
      initialSavedOnly={saved === '1'}
      generatePathPrefix="/words/es/"
    />
  )
}

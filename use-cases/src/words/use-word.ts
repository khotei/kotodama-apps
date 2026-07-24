import { type Language, wordQueryOptions } from '@kotodama/store'
import { useQuery } from '@tanstack/react-query'
import { useApiClient } from '../api-client-context'

// The word FEATURE hook — the platform-agnostic composition seam
// `store → use-case`. Returns TanStack Query's result over the store's
// queryOptions (data already narrowed to `{ kind: 'ready' | 'unready' } | null`
// by the store's select → core). A React hook, so it ports to any React runtime
// (web, native); the web rendering that consumes it lives in apps/web.
export function useWord(language: Language, word: string) {
  const client = useApiClient()
  return useQuery(wordQueryOptions(client, language, word))
}

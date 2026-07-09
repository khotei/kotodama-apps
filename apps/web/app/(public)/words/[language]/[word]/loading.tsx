import { WordLoadingView } from '@kotodama/use-cases'

// Streaming fallback for the word route: shown while the RSC page resolves on
// an uncached (soft) navigation. Fetching an existing entry — distinct from
// the generating state (a build in progress).
export default function Loading() {
  return <WordLoadingView backHref="/" />
}

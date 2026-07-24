import { serverEnv } from '@kotodama/config'
import type { MetadataRoute } from 'next'
import { WORD_SEED } from '@/src/word-seed'

// A single sitemap.xml over the seed words. Per-language chunking via
// generateSitemaps (feature §7) and `lastModified` from each word's `updatedAt`
// arrive together with the real top-N word list — today only the single seed word
// exists, so there is nothing large enough to chunk.
export default function sitemap(): MetadataRoute.Sitemap {
  const base = serverEnv().KOTODAMA_SITE_URL
  return WORD_SEED.map((w) => ({
    url: `${base}/words/${w.language}/${encodeURIComponent(w.word)}`,
  }))
}

import type { MetadataRoute } from 'next'
import { WORD_SEED } from '@/src/word-seed'

const BASE = process.env.KOTODAMA_SITE_URL ?? 'http://localhost:3000'

// A single sitemap.xml over the seed words. Per-language chunking via
// generateSitemaps (feature §7) and `lastModified` from each word's `updatedAt`
// arrive together with the real top-N word list — today the store exposes only
// the single-word wordQueryOptions, so there is nothing large enough to chunk.
export default function sitemap(): MetadataRoute.Sitemap {
  return WORD_SEED.map((w) => ({
    url: `${BASE}/words/${w.language}/${encodeURIComponent(w.word)}`,
  }))
}

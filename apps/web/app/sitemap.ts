import { serverEnv } from '@kotodama/platform/config'
import type { MetadataRoute } from 'next'

// The public words currently listed — grows to the backend's top-N once a
// words-search loader feeds this (today only a single seed word). If
// generateStaticParams ever consumes the same list, re-extract it to ONE source.
const WORD_SEED: ReadonlyArray<{ language: string; word: string }> = [
  { language: 'ja', word: '言葉' },
]

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

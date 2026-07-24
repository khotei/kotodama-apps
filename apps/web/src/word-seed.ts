// The public words currently prerendered (SSG) and listed in the sitemap — ONE
// source so generateStaticParams and app/sitemap.ts never drift. It grows to the
// backend's top-N once a words-search store factory exists (today the spine's
// store exposes only the single-word wordQueryOptions).
export const WORD_SEED: ReadonlyArray<{ language: string; word: string }> = [
  { language: 'ja', word: '言葉' },
]

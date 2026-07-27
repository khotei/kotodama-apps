// The public words currently prerendered (SSG) and listed in the sitemap — ONE
// source so generateStaticParams and app/sitemap.ts never drift. It grows to the
// backend's top-N once a words-search loader exists (today only a single seed word).
export const WORD_SEED: ReadonlyArray<{ language: string; word: string }> = [
  { language: 'ja', word: '言葉' },
]

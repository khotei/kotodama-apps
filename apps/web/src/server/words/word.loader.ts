import 'server-only'
import { fetchWordState, type Language } from '@kotodama/repositories'
import { narrowWordState, type WordStateModel } from '@kotodama/store'
import { WORD_STATE_MOCKS_ALL } from '@kotodama/ui/fixtures'
import { cache } from 'react'
import { createStaticApiClient } from '../api-client'

/** The cache tag a word's Data-Cache entry carries, so a Server Action can bust
 *  exactly this word from anywhere (e.g. a future list page) with `revalidateTag`. */
export function wordTag(language: Language, word: string) {
  return `word:${language}:${word}`
}

/**
 * The public word page's data. ONE `React.cache`-wrapped read per request, shared by
 * the page, `generateMetadata`, and the JSON-LD — one network round-trip, no double
 * fetch. Returns the narrowed {@link WordStateModel}, or `null` when the word does not
 * exist.
 *
 * NEVER throws: an absent or unreachable backend surfaces as `null` (the "not built
 * yet" card), so `next build` prerenders the SSG shell without a live backend and a
 * transient request error degrades gracefully — ISR retries on the next `revalidate`
 * window. `next.tags` names the Data-Cache entry (busted by {@link wordTag} +
 * `revalidateTag`); the route's `export const revalidate` is what makes it cached.
 */
export const getWordState = cache(
  async (language: Language, word: string): Promise<WordStateModel | null> => {
    try {
      const state = await fetchWordState(createStaticApiClient(), language, word, {
        next: { tags: [wordTag(language, word)] },
      })
      if (state) return narrowWordState(state)
    } catch {}
    // Design-stage fallback: with no backend the fixture words keep every
    // screen state reachable; anything the fixtures don't know stays null.
    return (language === 'es' && WORD_STATE_MOCKS_ALL[word]) || null
  },
)

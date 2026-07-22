import type { Language, WordStateModel } from '@kotodama/core/store'
import { WORD_STATE_MOCKS_ALL } from '@kotodama/ui/fixtures'
import { getWordState } from '@/src/server/words/word.loader'

/**
 * The word page's single read: the loader's model, with the design-stage curated
 * fixture applied as a fallback. Render-side on purpose — the page may import
 * `@kotodama/ui`, the `src/server` data layer must not (`frontend-layering.md`),
 * so the loader stays an honest `null`. Every consumer of the word route goes
 * through this one function so page and metadata can never disagree; once the
 * live backend serves real words, delete this file and call `getWordState`.
 */
export async function getWordScreenModel(
  language: Language,
  word: string,
): Promise<WordStateModel | null> {
  const model = await getWordState(language, word)
  if (model) return model
  // Object.hasOwn — a URL word must only reach the fixtures' own entries, never
  // inherited Object.prototype keys ('constructor' is a real Spanish word).
  return language === 'es' && Object.hasOwn(WORD_STATE_MOCKS_ALL, word)
    ? (WORD_STATE_MOCKS_ALL[word] ?? null)
    : null
}

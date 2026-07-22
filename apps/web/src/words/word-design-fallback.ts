import type { Language, WordStateModel } from '@kotodama/core/store'
import { WORD_STATE_MOCKS_ALL } from '@kotodama/ui/fixtures'

/**
 * Design-stage fallback: when the loader found nothing (no backend / unknown word),
 * the curated fixture words keep every screen state reachable for review.
 *
 * Render-layer on purpose — the page may import `@kotodama/ui`, the `src/server`
 * data layer must not (`frontend-layering.md`); the loader stays an honest `null`.
 * Delete this file wholesale once the live backend serves real words.
 */
export function withDesignFallback(
  model: WordStateModel | null,
  language: Language,
  word: string,
): WordStateModel | null {
  if (model) return model
  return (language === 'es' && WORD_STATE_MOCKS_ALL[word]) || null
}

import type { Language } from '@kotodama/core/words'

/** The word entry route — the ONE place its shape is spelled. */
export function wordHref(language: Language, word: string) {
  return `/words/${language}/${word}`
}

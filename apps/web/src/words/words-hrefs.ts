import type { Language } from '@kotodama/core/words'

/** The word entry route — the ONE place its shape is spelled. */
export const wordHref = (language: Language, word: string) => `/words/${language}/${word}`

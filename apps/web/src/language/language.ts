import type { Language } from '@kotodama/core/words'

/**
 * The project's ONE language default — the catalogue being browsed AND the
 * Intl locale for ui copy (a bare catalogue code is a valid BCP-47 tag).
 * Placeholder until the language becomes route state (`/[language]`).
 */
export const DEFAULT_LANGUAGE: Language = 'en'

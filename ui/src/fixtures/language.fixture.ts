import type { Language } from '../views/language.view'

// Design-stage language codes — the standing set the chrome offers until a
// backend/config source lands. Spanish is the only built language, so it is
// current; display labels derive inside LanguageMenu (autonyms).
export const LANGUAGE_OPTIONS_MOCK: readonly Language[] = ['es', 'fr', 'de']

export const CURRENT_LANGUAGE_MOCK: Language = 'es'

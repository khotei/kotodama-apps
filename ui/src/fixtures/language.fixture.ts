import type { LanguageOption } from '../components/molecules/language-menu'

// Design-stage language options — the standing set the chrome offers until a
// backend/config source lands. Spanish is the only built language, so it is current.
export const LANGUAGE_OPTIONS_MOCK = [
  { code: 'ES', label: 'Spanish' },
  { code: 'FR', label: 'French' },
  { code: 'DE', label: 'German' },
] as const satisfies readonly LanguageOption[]

export const CURRENT_LANGUAGE_MOCK: LanguageOption = LANGUAGE_OPTIONS_MOCK[0]

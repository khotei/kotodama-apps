import type { Language } from '@kotodama/ui'
import { DEFAULT_LANGUAGE } from '@/src/language/language'

// A one-entry menu until the language becomes route state (`/[language]`).
export const LANGUAGES: readonly Language[] = [DEFAULT_LANGUAGE]

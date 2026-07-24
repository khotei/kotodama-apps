import type { Language } from '@kotodama/store'

const languageDisplay = new Intl.DisplayNames(['en'], { type: 'language' })

/** English name of a supported language code — `es` → `Spanish`. Reads CLDR via
 *  `Intl.DisplayNames`, so the 10-language table can't drift out of the code. */
export function languageName(language: Language): string {
  return languageDisplay.of(language) ?? language
}

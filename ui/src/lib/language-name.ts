const languageDisplay = new Intl.DisplayNames(['en'], { type: 'language' })

/** English name of a language code — `es` → `Spanish`. Reads CLDR via
 *  `Intl.DisplayNames`, so the table can't drift out of the code. Takes a bare
 *  `string` (a BCP-47/ISO code) — no domain type, keeping ui store-free. */
export function languageName(language: string): string {
  return languageDisplay.of(language) ?? language
}

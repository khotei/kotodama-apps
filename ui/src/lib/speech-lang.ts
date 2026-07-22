const SPEECH_TAG: Record<string, string> = {
  ru: 'ru-RU',
  en: 'en-US',
  es: 'es-ES',
  fr: 'fr-FR',
  de: 'de-DE',
  zh: 'zh-CN',
  ja: 'ja-JP',
  hi: 'hi-IN',
  ar: 'ar-SA',
  uk: 'uk-UA',
}

/** Region-qualified BCP-47 speech tag for a bare language code — `es` → `es-ES`.
 *  Speech synthesis voice inventories are keyed by full tags; a bare code makes
 *  browsers (notably desktop Chrome) fall back to the default — often English —
 *  voice. Unknown codes pass through unchanged. */
export function speechLang(language: string): string {
  return SPEECH_TAG[language] ?? language
}

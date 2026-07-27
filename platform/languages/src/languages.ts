/** A BCP-47 locale tag (`'en-GB'`, `'ru'`) — the TS lib's own Intl alias. */
export type Locale = Intl.UnicodeBCP47LocaleIdentifier

/**
 * The project's standard ui-copy locale — language names and dates must match
 * the surrounding English strings. When i18n lands, callers switch from this
 * constant to an injected viewer locale (every function here already takes
 * one) — never a header read in render: Accept-Language would dynamify a
 * static route.
 */
export const DEFAULT_LOCALE: Locale = 'en-GB'

/**
 * A language's display name via the built-in Intl.DisplayNames, exactly as
 * CLDR spells it (`'es'` → `'Español'`, `('es', 'en-GB')` → `'Spanish'`) —
 * casing follows the locale's CLDR data, so a caller wanting a guaranteed
 * leading capital applies its own copy convention on top. `code` is the
 * language being named; `locale` is the language the name is spoken in —
 * omitted, the language names itself. Falls back to the code when Intl has
 * no name for it.
 */
export function languageName(code: Locale, locale: Locale = code) {
  return new Intl.DisplayNames([locale], { type: 'language' }).of(code) ?? code
}

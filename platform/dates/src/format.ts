// Locale-parameterized date formatting over the built-in Intl. Policy-free:
// the caller injects the locale, nothing here reads env or hardcodes one.

/** A BCP-47 locale tag (`'en-GB'`, `'ru'`) — the TS lib's own Intl alias. */
export type Locale = Intl.UnicodeBCP47LocaleIdentifier

/** `'2026-05-27T…'` → `'27 May'` (in the given locale). */
export function formatDayMonth(iso: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short' }).format(new Date(iso))
}

// Intl.RelativeTimeFormat localizes a GIVEN unit but does not pick one — the
// largest-fitting unit comes from this table (the one piece Temporal will own
// once V8/Bun ship it).
const RELATIVE_UNITS = [
  ['year', 31_536_000],
  ['month', 2_592_000],
  ['week', 604_800],
  ['day', 86_400],
  ['hour', 3_600],
  ['minute', 60],
] as const satisfies readonly (readonly [Intl.RelativeTimeFormatUnit, number])[]

/**
 * Relative past label — `'2 minutes ago'`, `'yesterday'` (grammar and words
 * from the locale's CLDR data); anything under a minute, or future-dated,
 * reads as the freshest bucket: `rtf.format(0, 'second')` → `'now'`.
 */
export function formatRelative(iso: string, now: Date, locale: Locale) {
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })
  const seconds = (now.getTime() - new Date(iso).getTime()) / 1000
  const fit = RELATIVE_UNITS.find(([, size]) => seconds >= size)
  if (!fit) return rtf.format(0, 'second')
  return rtf.format(-Math.floor(seconds / fit[1]), fit[0])
}

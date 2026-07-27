/** Uppercase the first character — the ui-copy convention for standalone labels
 *  (`'español'` → `'Español'`); CLDR spells names in sentence-internal casing.
 *  Spread iterates code points, so astral-plane initials survive intact. */
export const capitalize = (s: string) => {
  const [first = '', ...rest] = s
  return first.toLocaleUpperCase() + rest.join('')
}

/**
 * The nav href a pathname reads as active: the longest candidate equal to the
 * pathname or prefixing it on a segment boundary. `/` matches every pathname,
 * so a root link stays active on detail pages until a longer sibling wins.
 */
export function activeHref(pathname: string, hrefs: readonly string[]) {
  return hrefs
    .filter((href) => pathname === href || pathname.startsWith(href === '/' ? '/' : `${href}/`))
    .reduce<string | undefined>(
      (best, href) => (best == null || href.length > best.length ? href : best),
      undefined,
    )
}

import { Button, cn, Seal } from '@kotodama/ui'
import { SearchIcon } from 'lucide-react'
import type { ReactNode } from 'react'

export type SiteNavLink = {
  label: string
  href: string
  active?: boolean
}

export type SiteHeaderProps = {
  homeHref: string
  searchHref: string
  nav: readonly SiteNavLink[]
  /** App-wired slots: the ⌘K trigger, the language menu, the color-mode menu. */
  commandTrigger?: ReactNode
  languageMenu?: ReactNode
  modeMenu?: ReactNode
  /** Compact mobile stand-in for the language menu — the `ES` button. */
  languageBadge?: ReactNode
}

function Wordmark({ href }: { href: string }) {
  return (
    <a href={href} className="flex items-center gap-[11px] text-foreground no-underline">
      <Seal />
      <span className="hidden font-serif font-semibold text-[21px] leading-none tracking-[-0.02em] md:inline">
        Kotodama
      </span>
      <span className="hidden font-serif text-[15px] text-muted-foreground leading-none tracking-[0.04em] md:inline">
        言霊
      </span>
    </a>
  )
}

export function SiteHeader({
  homeHref,
  searchHref,
  nav,
  commandTrigger,
  languageMenu,
  modeMenu,
  languageBadge,
}: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-border-subtle border-b bg-background/80 backdrop-blur-[8px]">
      <div className="mx-auto hidden h-[76px] max-w-[1160px] items-center justify-between px-10 md:flex">
        <div className="flex items-center gap-10">
          <Wordmark href={homeHref} />
          <nav className="flex items-center gap-[30px]">
            {nav.map(({ label, href, active }) => (
              <a
                key={href}
                href={href}
                className={cn(
                  'relative py-1.5 font-medium text-[14px] text-muted-foreground no-underline tracking-[0.01em] transition-colors hover:text-foreground',
                  active &&
                    'text-foreground after:absolute after:right-0 after:-bottom-[2px] after:left-0 after:h-[1.5px] after:bg-seal after:content-[""]',
                )}
              >
                {label}
              </a>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-[14px]">
          {commandTrigger}
          {languageMenu}
          {modeMenu}
        </div>
      </div>

      <div className="flex h-14 items-center justify-between px-5 md:hidden">
        <Wordmark href={homeHref} />
        <div className="flex items-center gap-1.5">
          <Button asChild variant="ghost" size="icon-sm" aria-label="Search">
            <a href={searchHref}>
              <SearchIcon />
            </a>
          </Button>
          {languageBadge}
          {modeMenu}
        </div>
      </div>
    </header>
  )
}

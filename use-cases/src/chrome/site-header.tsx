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
    <a href={href} className="flex items-center gap-2.5 no-underline">
      <Seal size="sm" />
      <span className="font-serif text-[17px] text-foreground">Kotodama</span>
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
    <header className="sticky top-0 z-40 border-border border-b bg-background/95 backdrop-blur">
      <div className="mx-auto hidden h-16 max-w-[1160px] items-center justify-between px-10 md:flex">
        <div className="flex items-center gap-7">
          <Wordmark href={homeHref} />
          <nav className="flex items-center gap-1">
            {nav.map(({ label, href, active }) => (
              <Button
                key={href}
                asChild
                variant="ghost"
                size="sm"
                className={cn(active && 'bg-secondary')}
              >
                <a href={href}>{label}</a>
              </Button>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
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

import { SearchIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '../../../lib/utils'
import { Seal } from '../../atoms/seal'
import { CommandTrigger } from '../../molecules/command-trigger'
import { LanguageMenu } from '../../molecules/language-menu'
import { ModeMenu } from '../../molecules/mode-menu'
import { Button } from '../../ui/button'

export type SiteNavLink = {
  label: string
  href: string
  active?: boolean
}

export type SiteHeaderVariant = 'controls'

export type SiteHeaderProps = {
  homeHref: string
  searchHref: string
  nav: readonly SiteNavLink[]
  /**
   * `'controls'` pre-fills the right-hand slots with the stock molecules
   * (⌘K trigger + language menu + mode menu); an explicitly passed slot
   * still wins over the variant's fill. Omit for the bare nav-only header.
   */
  variant?: SiteHeaderVariant
  /** Opens the command palette — consumed by the variant-filled ⌘K trigger. */
  onCommandOpen?: () => void
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
  variant,
  onCommandOpen,
  commandTrigger,
  languageMenu,
  modeMenu,
  languageBadge,
}: SiteHeaderProps) {
  const filled = variant === 'controls'
  const commandSlot = commandTrigger ?? (filled ? <CommandTrigger onOpen={onCommandOpen} /> : null)
  const languageSlot = languageMenu ?? (filled ? <LanguageMenu /> : null)
  const languageBadgeSlot = languageBadge ?? (filled ? <LanguageMenu compact /> : null)
  const modeSlot = modeMenu ?? (filled ? <ModeMenu /> : null)

  return (
    <header className="sticky top-0 z-40 border-border-subtle border-b bg-background/80 backdrop-blur-[8px]">
      <div className="mx-auto hidden h-[76px] max-w-[1160px] items-center justify-between px-5 md:flex lg:px-10">
        <div className="flex items-center gap-6 lg:gap-10">
          <Wordmark href={homeHref} />
          <nav className="flex items-center gap-5 lg:gap-[30px]">
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
          {commandSlot}
          {languageSlot}
          {modeSlot}
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
          {languageBadgeSlot}
          {modeSlot}
        </div>
      </div>
    </header>
  )
}

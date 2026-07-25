import type { ReactNode } from 'react'
import { cn } from '../../../lib/utils'
import { Seal } from '../../atoms/seal'
import { Show } from '../../atoms/show'
import { SiteContainer } from '../../atoms/site-container'

export type SiteNavLink = {
  label: string
  href: string
  active?: boolean
}

export type SiteHeaderProps = {
  homeHref: string
  nav: readonly SiteNavLink[]
  /** Right-hand control cluster; the composer gates each control by viewport with `<Show>`. */
  controls?: ReactNode
}

function Wordmark({ href }: { href: string }) {
  return (
    <a href={href} className="flex items-center gap-3 text-foreground no-underline">
      <Seal />
      <span className="hidden font-serif font-semibold text-xl leading-none tracking-tighter md:inline">
        Kotodama
      </span>
      <span className="hidden font-serif text-base text-muted-foreground leading-none tracking-wide md:inline">
        言霊
      </span>
    </a>
  )
}

export function SiteHeader({ homeHref, nav, controls }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-border-subtle border-b bg-background/80 backdrop-blur-[8px]">
      <SiteContainer className="flex h-14 items-center justify-between md:h-[76px]">
        <div className="flex items-center gap-6 lg:gap-12">
          <Wordmark href={homeHref} />
          <Show on="desktop">
            <nav className="flex items-center gap-6 lg:gap-8">
              {nav.map(({ label, href, active }) => (
                <a
                  key={href}
                  href={href}
                  className={cn(
                    'relative py-2 font-medium text-sm text-muted-foreground no-underline tracking-wide transition-colors hover:text-foreground',
                    active &&
                      'text-foreground after:absolute after:right-0 after:-bottom-[2px] after:left-0 after:h-[1.5px] after:bg-seal after:content-[""]',
                  )}
                >
                  {label}
                </a>
              ))}
            </nav>
          </Show>
        </div>
        <div className="flex items-center gap-2 md:gap-4">{controls}</div>
      </SiteContainer>
    </header>
  )
}

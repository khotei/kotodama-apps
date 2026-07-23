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

export function SiteHeader({ homeHref, nav, controls }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-border-subtle border-b bg-background/80 backdrop-blur-[8px]">
      <SiteContainer className="flex h-14 items-center justify-between md:h-[76px]">
        <div className="flex items-center gap-6 lg:gap-10">
          <Wordmark href={homeHref} />
          <Show on="desktop">
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
          </Show>
        </div>
        <div className="flex items-center gap-1.5 md:gap-[14px]">{controls}</div>
      </SiteContainer>
    </header>
  )
}

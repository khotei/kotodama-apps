'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import { activeHref } from '../../../lib/active-href'
import { cn } from '../../../lib/utils'

export type MobileTab = {
  /** The tab glyph — any icon element (`<HouseIcon />`); the bar stays open-ended. */
  icon: ReactNode
  label: string
  /** Omit for an action tab (the Jump palette) — supply `onSelect` instead. */
  href?: string
  onSelect?: () => void
}

export type MobileTabBarProps = {
  tabs: readonly MobileTab[]
}

export function MobileTabBar({ tabs }: MobileTabBarProps) {
  const active = activeHref(
    usePathname(),
    tabs.flatMap(({ href }) => (href != null ? [href] : [])),
  )
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 grid auto-cols-fr grid-flow-col border-border border-t bg-background/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-[8px] md:hidden">
      {tabs.map(({ icon, label, href, onSelect }) => {
        const className = cn(
          'flex min-h-11 flex-col items-center justify-center gap-2xs py-xs font-semibold text-2xs no-underline tracking-wide [&_svg]:size-5',
          href != null && href === active ? 'text-seal' : 'text-subtle-foreground',
        )
        const body = (
          <>
            {icon}
            <span>{label}</span>
          </>
        )
        return href != null ? (
          <Link key={label} href={href} className={className}>
            {body}
          </Link>
        ) : (
          <button key={label} type="button" onClick={onSelect} className={className}>
            {body}
          </button>
        )
      })}
    </nav>
  )
}

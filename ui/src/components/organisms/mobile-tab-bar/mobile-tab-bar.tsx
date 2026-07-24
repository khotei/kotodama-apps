import { cn } from '@kotodama/ui'
import type { ReactNode } from 'react'

export type MobileTab = {
  /** The tab glyph — any icon element (`<HouseIcon />`); the bar stays open-ended. */
  icon: ReactNode
  label: string
  /** Omit for an action tab (the Jump palette) — supply `onSelect` instead. */
  href?: string
  onSelect?: () => void
  active?: boolean
}

export type MobileTabBarProps = {
  tabs: readonly MobileTab[]
}

export function MobileTabBar({ tabs }: MobileTabBarProps) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 grid auto-cols-fr grid-flow-col border-border border-t bg-background/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-[8px] md:hidden">
      {tabs.map(({ icon, label, href, onSelect, active }) => {
        const className = cn(
          'flex min-h-11 flex-col items-center justify-center gap-1 py-2 font-semibold text-[10.5px] no-underline tracking-[0.04em] [&_svg]:size-5',
          active ? 'text-seal' : 'text-subtle-foreground',
        )
        const body = (
          <>
            {icon}
            <span>{label}</span>
          </>
        )
        return href != null ? (
          <a key={label} href={href} className={className}>
            {body}
          </a>
        ) : (
          <button key={label} type="button" onClick={onSelect} className={className}>
            {body}
          </button>
        )
      })}
    </nav>
  )
}

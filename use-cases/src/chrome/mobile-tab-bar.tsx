import { cn } from '@kotodama/ui'
import { BookmarkIcon, HouseIcon, SearchIcon, SparklesIcon } from 'lucide-react'

const TAB_ICON = {
  library: HouseIcon,
  search: SearchIcon,
  jump: SparklesIcon,
  saved: BookmarkIcon,
} as const

export type MobileTab = {
  icon: keyof typeof TAB_ICON
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
    <nav className="fixed inset-x-0 bottom-0 z-40 grid auto-cols-fr grid-flow-col border-border border-t bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
      {tabs.map(({ icon, label, href, onSelect, active }) => {
        const Icon = TAB_ICON[icon]
        const className = cn(
          'flex min-h-11 flex-col items-center justify-center gap-0.5 py-2 text-[10.5px] no-underline',
          active ? 'text-primary' : 'text-muted-foreground',
        )
        const body = (
          <>
            <Icon className="size-[18px]" />
            <span>{label}</span>
          </>
        )
        return href != null ? (
          <a key={icon} href={href} className={className}>
            {body}
          </a>
        ) : (
          <button key={icon} type="button" onClick={onSelect} className={className}>
            {body}
          </button>
        )
      })}
    </nav>
  )
}

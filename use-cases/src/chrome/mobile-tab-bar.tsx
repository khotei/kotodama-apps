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
  href: string
  active?: boolean
}

export type MobileTabBarProps = {
  tabs: readonly MobileTab[]
}

export function MobileTabBar({ tabs }: MobileTabBarProps) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 grid auto-cols-fr grid-flow-col border-border border-t bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
      {tabs.map(({ icon, label, href, active }) => {
        const Icon = TAB_ICON[icon]
        return (
          <a
            key={icon}
            href={href}
            className={cn(
              'flex min-h-11 flex-col items-center justify-center gap-0.5 py-2 text-[10.5px] no-underline',
              active ? 'text-primary' : 'text-muted-foreground',
            )}
          >
            <Icon className="size-[18px]" />
            <span>{label}</span>
          </a>
        )
      })}
    </nav>
  )
}

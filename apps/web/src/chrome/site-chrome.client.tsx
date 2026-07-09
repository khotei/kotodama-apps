'use client'

import { Button, Kbd } from '@kotodama/ui'
import { MobileTabBar, SiteHeader } from '@kotodama/use-cases'
import { ChevronDownIcon, GlobeIcon, SearchIcon } from 'lucide-react'
import { usePathname } from 'next/navigation'

// Active-state needs usePathname and the mode menu needs next-themes, so the
// chrome is wired here (the sanctioned apps/web bypass), not in use-cases.
import { ModeMenu } from './mode-menu.client'

export function SiteChrome() {
  const pathname = usePathname()
  const isSearch = pathname.startsWith('/search')
  const isLibrary = !isSearch

  return (
    <SiteHeader
      homeHref="/"
      searchHref="/search"
      nav={[
        { label: 'Library', href: '/', active: isLibrary },
        { label: 'Search', href: '/search', active: isSearch },
      ]}
      commandTrigger={
        <Button variant="outline" size="sm" className="text-muted-foreground">
          <SearchIcon />
          <span>Search or jump…</span>
          <Kbd>⌘K</Kbd>
        </Button>
      }
      languageMenu={
        <Button variant="outline" size="sm">
          <GlobeIcon /> Spanish <ChevronDownIcon />
        </Button>
      }
      languageBadge={
        <Button variant="outline" size="sm">
          ES
        </Button>
      }
      modeMenu={<ModeMenu />}
    />
  )
}

export function SiteTabBar() {
  const pathname = usePathname()
  return (
    <MobileTabBar
      tabs={[
        { icon: 'library', label: 'Library', href: '/', active: pathname === '/' },
        {
          icon: 'search',
          label: 'Search',
          href: '/search',
          active: pathname.startsWith('/search'),
        },
        { icon: 'jump', label: 'Jump', href: '/search', active: false },
        { icon: 'saved', label: 'Saved', href: '/search?saved=1', active: false },
      ]}
    />
  )
}

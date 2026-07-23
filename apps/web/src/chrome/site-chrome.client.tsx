'use client'

import type { SearchWordView } from '@kotodama/ui'
import {
  CommandFab,
  CommandPalette,
  CommandTrigger,
  LanguageMenu,
  MobileTabBar,
  SiteHeader,
  ThemeMenu,
} from '@kotodama/ui'
import { BookmarkIcon, HouseIcon, SearchIcon, SparklesIcon } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { useState } from 'react'

// Active-state needs usePathname, the palette needs router.push, and the theme
// menu needs next-themes, so this Next wiring lives in apps/web; the presentational
// pieces are prop-driven @kotodama/ui components. One component owns header +
// tab bar + palette — the Jump tab and the ⌘K trigger share the palette's open state.

export type SiteChromeProps = {
  paletteWords: readonly SearchWordView[]
}

export function SiteChrome({ paletteWords }: SiteChromeProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [paletteOpen, setPaletteOpen] = useState(false)

  const isSearch = pathname.startsWith('/search')

  return (
    <>
      <SiteHeader
        homeHref="/"
        searchHref="/search"
        nav={[
          { label: 'Library', href: '/', active: !isSearch },
          { label: 'Search', href: '/search', active: isSearch },
        ]}
        commandTrigger={
          <CommandTrigger
            label="Search or jump…"
            shortcut="k"
            onTrigger={() => setPaletteOpen((open) => !open)}
          />
        }
        languageMenu={<LanguageMenu />}
        languageBadge={<LanguageMenu compact />}
        themeMenu={<ThemeMenu theme={theme} onThemeChange={setTheme} />}
      />
      <CommandPalette
        open={paletteOpen}
        onOpenChange={setPaletteOpen}
        words={paletteWords}
        onSelect={(href) => router.push(href)}
        onGenerate={(query) => router.push(`/words/es/${encodeURIComponent(query)}`)}
      />
      <MobileTabBar
        tabs={[
          { icon: <HouseIcon />, label: 'Library', href: '/', active: pathname === '/' },
          {
            icon: <SearchIcon />,
            label: 'Search',
            href: '/search',
            active: pathname.startsWith('/search'),
          },
          { icon: <SparklesIcon />, label: 'Jump', onSelect: () => setPaletteOpen(true) },
          {
            icon: <BookmarkIcon />,
            label: 'Saved',
            onSelect: () => router.push('/search?saved=1'),
          },
        ]}
      />
      <CommandFab onOpen={() => setPaletteOpen(true)} />
    </>
  )
}

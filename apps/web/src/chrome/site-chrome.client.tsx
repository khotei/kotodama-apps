'use client'

import type { SearchWordView } from '@kotodama/ui'
import {
  Button,
  type CommandAction,
  CommandFab,
  CommandTrigger,
  LanguageMenu,
  MobileTabBar,
  SearchCommandPalette,
  Show,
  SiteHeader,
  ThemeMenu,
} from '@kotodama/ui'
import { CURRENT_LANGUAGE_MOCK, LANGUAGE_OPTIONS_MOCK } from '@kotodama/ui/fixtures'
import { BookmarkIcon, HouseIcon, PlusIcon, SearchIcon, SparklesIcon } from 'lucide-react'
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
  const [paletteQuery, setPaletteQuery] = useState('')

  const isSearch = pathname.startsWith('/search')
  const typed = paletteQuery.trim()

  const actions: CommandAction[] = [
    {
      id: 'library',
      label: 'Go to Library',
      description: 'Home',
      icon: <HouseIcon />,
      keywords: ['home'],
      onSelect: () => router.push('/'),
    },
    {
      id: 'search',
      label: 'Search words',
      description: 'Open search',
      icon: <SearchIcon />,
      onSelect: () => router.push('/search'),
    },
    {
      id: 'generate',
      label: typed ? `Add “${typed}”` : 'Add a new word',
      description: 'Generate an entry',
      icon: <PlusIcon />,
      keywords: ['create', 'new', 'generate', 'add'],
      forceMount: true,
      onSelect: () => router.push(typed ? `/words/es/${encodeURIComponent(typed)}` : '/search'),
    },
    {
      id: 'saved',
      label: 'Saved words',
      description: 'Your bookmarks',
      icon: <BookmarkIcon />,
      onSelect: () => router.push('/search?saved=1'),
    },
  ]

  return (
    <>
      <SiteHeader
        homeHref="/"
        nav={[
          { label: 'Library', href: '/', active: !isSearch },
          { label: 'Search', href: '/search', active: isSearch },
        ]}
        controls={
          <>
            <Show on="desktop">
              <CommandTrigger
                label="Search or jump…"
                shortcut="k"
                onTrigger={() => setPaletteOpen((open) => !open)}
              />
            </Show>
            <Show on="mobile">
              <Button asChild variant="ghost" size="icon-sm" aria-label="Search">
                <a href="/search">
                  <SearchIcon />
                </a>
              </Button>
            </Show>
            <Show on="desktop">
              <LanguageMenu current={CURRENT_LANGUAGE_MOCK} languages={LANGUAGE_OPTIONS_MOCK} />
            </Show>
            <Show on="mobile">
              <LanguageMenu
                compact
                current={CURRENT_LANGUAGE_MOCK}
                languages={LANGUAGE_OPTIONS_MOCK}
              />
            </Show>
            <ThemeMenu theme={theme} onThemeChange={setTheme} />
          </>
        }
      />
      <SearchCommandPalette
        open={paletteOpen}
        onOpenChange={setPaletteOpen}
        query={paletteQuery}
        onQueryChange={setPaletteQuery}
        actions={actions}
        words={paletteWords}
        onSelectWord={(href) => router.push(href)}
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

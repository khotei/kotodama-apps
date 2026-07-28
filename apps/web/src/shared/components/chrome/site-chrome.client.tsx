'use client'

import { languageName } from '@kotodama/platform/languages'
import type { SearchWordView } from '@kotodama/ui'
import {
  Button,
  CommandFab,
  CommandTrigger,
  LanguageMenu,
  type LanguageOption,
  MobileTabBar,
  type PaletteItem,
  SearchCommandPalette,
  Show,
  SiteHeader,
  ThemeMenu,
} from '@kotodama/ui'
import { BookmarkIcon, HouseIcon, PlusIcon, SearchIcon, SparklesIcon } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { useState } from 'react'
import { DEFAULT_LANGUAGE } from '@/src/language/language'
import { capitalize } from '@/src/utils/text'
import { wordHref } from '@/src/words/hrefs'

// Active-state needs usePathname, the palette needs router.push, and the theme
// menu needs next-themes, so this Next wiring lives in apps/web; the presentational
// pieces are prop-driven @kotodama/ui components. One component owns header +
// tab bar + palette — the Jump tab and the ⌘K trigger share the palette's open state.

export type SiteChromeProps = {
  paletteWords: readonly SearchWordView[]
}

// A one-entry menu until the language becomes route state (`/[language]`).
const CURRENT_LANGUAGE: LanguageOption = {
  code: DEFAULT_LANGUAGE.toUpperCase(),
  label: capitalize(languageName(DEFAULT_LANGUAGE)),
}
const LANGUAGE_OPTIONS: readonly LanguageOption[] = [CURRENT_LANGUAGE]

export function SiteChrome({ paletteWords }: SiteChromeProps) {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [paletteQuery, setPaletteQuery] = useState('')

  const typed = paletteQuery.trim()

  const items: readonly PaletteItem[] = [
    {
      entity: 'action',
      action: {
        id: 'library',
        label: 'Go to Library',
        description: 'Home',
        icon: <HouseIcon />,
        keywords: ['home'],
      },
    },
    {
      entity: 'action',
      action: {
        id: 'search',
        label: 'Search words',
        description: 'Open search',
        icon: <SearchIcon />,
      },
    },
    {
      entity: 'action',
      action: {
        id: 'generate',
        label: typed ? `Add “${typed}”` : 'Add a new word',
        description: 'Generate an entry',
        icon: <PlusIcon />,
        keywords: ['create', 'new', 'generate', 'add'],
        forceMount: true,
      },
    },
    {
      entity: 'action',
      action: {
        id: 'saved',
        label: 'Saved words',
        description: 'Your bookmarks',
        icon: <BookmarkIcon />,
      },
    },
    ...paletteWords.map((word): PaletteItem => ({ entity: 'word', word })),
  ]

  const handleSelect = (item: PaletteItem) => {
    setPaletteOpen(false)
    setPaletteQuery('')
    if (item.entity === 'word') {
      router.push(item.word.href)
      return
    }
    switch (item.action.id) {
      case 'library':
        router.push('/')
        break
      case 'search':
        router.push('/search')
        break
      case 'generate':
        router.push(typed ? wordHref(DEFAULT_LANGUAGE, encodeURIComponent(typed)) : '/search')
        break
      case 'saved':
        router.push('/search?saved=1')
        break
    }
  }

  return (
    <>
      <SiteHeader
        homeHref="/"
        nav={[
          { label: 'Library', href: '/' },
          { label: 'Search', href: '/search' },
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
                <Link href="/search">
                  <SearchIcon />
                </Link>
              </Button>
            </Show>
            <Show on="desktop">
              <LanguageMenu current={CURRENT_LANGUAGE} languages={LANGUAGE_OPTIONS} />
            </Show>
            <Show on="mobile">
              <LanguageMenu compact current={CURRENT_LANGUAGE} languages={LANGUAGE_OPTIONS} />
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
        items={items}
        onSelect={handleSelect}
      />
      <MobileTabBar
        tabs={[
          { icon: <HouseIcon />, label: 'Library', href: '/' },
          { icon: <SearchIcon />, label: 'Search', href: '/search' },
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

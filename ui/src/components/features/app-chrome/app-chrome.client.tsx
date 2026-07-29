'use client'

import { SparklesIcon } from 'lucide-react'
import { useState } from 'react'
import { useDebouncedCallback } from '../../../lib/use-debounced-callback'
import type { Language } from '../../../views/language.view'
import type { SearchWordView } from '../../../views/search.view'
import { CommandFab } from '../../molecules/command-fab'
import type { ThemeMenuProps } from '../../molecules/theme-menu'
import { AppControls } from '../../organisms/app-controls'
import { AppHeader, type AppNavLink } from '../../organisms/app-header'
import { type MobileTab, MobileTabBar } from '../../organisms/mobile-tab-bar'
import {
  type CommandAction,
  type PaletteItem,
  SearchCommandPalette,
} from '../search-command-palette'

const SEARCH_DEBOUNCE_MS = 1_000

export type AppChromeProps = {
  nav: {
    homeHref: string
    searchHref: string
    desktop: readonly AppNavLink[]
    mobile: readonly MobileTab[]
  }
  commands: readonly CommandAction[]
  words: {
    list: readonly SearchWordView[]
    onSearch?: (query: string) => void
    onSelect: (word: SearchWordView) => void
  }
  language: {
    current: Language
    list: readonly Language[]
    onSelect?: (code: Language) => void
  }
  theme: ThemeMenuProps
}

/**
 * The site's full public chrome: header + ⌘K palette + mobile tab bar + FAB,
 * configured by data alone — nav targets, palette commands, searched words.
 * Owns the palette state (every affordance that opens it lives here); every
 * pick is reported to the composer's `onSelect`, never acted on.
 */
export function AppChrome({ nav, commands, words, language, theme }: AppChromeProps) {
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [paletteQuery, setPaletteQuery] = useState('')

  const handleWordSearch = useDebouncedCallback((query: string) => {
    words.onSearch?.(query)
  }, SEARCH_DEBOUNCE_MS)

  const handleQueryChange = (query: string) => {
    setPaletteQuery(query)
    handleWordSearch(query)
  }

  const items: readonly PaletteItem[] = [
    ...commands.map((action): PaletteItem => ({ entity: 'action', action })),
    ...words.list.map((word): PaletteItem => ({ entity: 'word', word })),
  ]

  const handleSelect = (item: PaletteItem) => {
    setPaletteOpen(false)
    handleQueryChange('')

    if (item.entity === 'word') {
      words.onSelect(item.word)
    }
  }

  return (
    <>
      <AppHeader
        homeHref={nav.homeHref}
        nav={nav.desktop}
        controls={
          <AppControls
            search={{
              label: 'Search or jump…',
              shortcut: 'k',
              onTrigger: () => setPaletteOpen((open) => !open),
              mobileHref: nav.searchHref,
            }}
            language={language}
            theme={theme}
          />
        }
      />
      <SearchCommandPalette
        open={paletteOpen}
        onOpenChange={setPaletteOpen}
        query={paletteQuery}
        onQueryChange={handleQueryChange}
        items={items}
        onSelect={handleSelect}
      />
      <MobileTabBar
        tabs={[
          ...nav.mobile,
          { icon: <SparklesIcon />, label: 'Jump', onSelect: () => setPaletteOpen(true) },
        ]}
      />
      <CommandFab onOpen={() => setPaletteOpen(true)} />
    </>
  )
}

'use client'

import { SparklesIcon } from 'lucide-react'
import { useState } from 'react'
import type { Language } from '../../../views/language.view'
import type { SearchWordView } from '../../../views/search.view'
import { CommandFab } from '../../molecules/command-fab'
import type { ThemeMenuProps } from '../../molecules/theme-menu'
import { AppControls } from '../../organisms/app-controls'
import { type MobileTab, MobileTabBar } from '../../organisms/mobile-tab-bar'
import {
  type CommandAction,
  type PaletteItem,
  SearchCommandPalette,
} from '../search-command-palette'
import { AppBar, type AppNavLink } from './app-bar'

export type { AppNavLink } from './app-bar'

export type AppHeaderProps = {
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
 * The app's public header: the top bar + ⌘K palette + mobile tab bar + FAB,
 * configured by data alone — nav targets, palette commands, searched words.
 * Owns the palette state (every affordance that opens it lives here); every
 * pick is reported to the composer's `onSelect`, never acted on.
 */
export function AppHeader(props: AppHeaderProps) {
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [paletteQuery, setPaletteQuery] = useState('')

  const handleQueryChange = (query: string) => {
    setPaletteQuery(query)
    props.words.onSearch?.(query)
  }

  const items: readonly PaletteItem[] = [
    ...props.commands.map((action): PaletteItem => ({ entity: 'action', action })),
    ...props.words.list.map((word): PaletteItem => ({ entity: 'word', word })),
  ]

  const handleSelect = (item: PaletteItem) => {
    setPaletteOpen(false)
    handleQueryChange('')

    if (item.entity === 'word') {
      props.words.onSelect(item.word)
    }
  }

  return (
    <>
      <AppBar
        homeHref={props.nav.homeHref}
        nav={props.nav.desktop}
        controls={
          <AppControls
            search={{
              label: 'Search or jump…',
              shortcut: 'k',
              onTrigger: () => setPaletteOpen((open) => !open),
              mobileHref: props.nav.searchHref,
            }}
            language={props.language}
            theme={props.theme}
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
          ...props.nav.mobile,
          { icon: <SparklesIcon />, label: 'Jump', onSelect: () => setPaletteOpen(true) },
        ]}
      />
      <CommandFab onOpen={() => setPaletteOpen(true)} />
    </>
  )
}

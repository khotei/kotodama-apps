'use client'

import type { SearchWordView } from '@kotodama/ui'
import {
  CommandPalette,
  CommandTrigger,
  LanguageMenu,
  MobileTabBar,
  ModeMenu,
  SiteHeader,
} from '@kotodama/ui'
import { BookmarkIcon, HouseIcon, PlusIcon, SearchIcon, SparklesIcon } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { useState } from 'react'
import useKey from 'react-use/lib/useKey'

// Active-state needs usePathname, the palette needs router.push, and the mode
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

  useKey(
    (event) => event.key === 'k' && (event.metaKey || event.ctrlKey),
    (event) => {
      event.preventDefault()
      setPaletteOpen((open) => !open)
    },
  )

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
        commandTrigger={<CommandTrigger onOpen={() => setPaletteOpen(true)} />}
        languageMenu={<LanguageMenu />}
        languageBadge={<LanguageMenu compact />}
        modeMenu={<ModeMenu mode={theme} onModeChange={setTheme} />}
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
      <button
        type="button"
        aria-label="Add or jump"
        onClick={() => setPaletteOpen(true)}
        className="fixed right-[18px] bottom-[76px] z-50 grid size-[54px] place-items-center rounded-full bg-seal text-seal-foreground shadow-hero md:hidden"
      >
        <PlusIcon className="size-6" />
      </button>
    </>
  )
}

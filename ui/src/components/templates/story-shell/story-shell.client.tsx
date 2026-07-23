'use client'

import { BookmarkIcon, HouseIcon, SearchIcon, SparklesIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import type { SearchWordView } from '../../../views/search.view'
import { SiteContainer } from '../../atoms/site-container'
import { CommandFab } from '../../molecules/command-fab'
import { CommandTrigger } from '../../molecules/command-trigger'
import { LanguageMenu } from '../../molecules/language-menu'
import { ThemeMenu } from '../../molecules/theme-menu'
import { CommandPalette } from '../../organisms/command-palette'
import { MobileTabBar } from '../../organisms/mobile-tab-bar'
import { SiteHeader } from '../../organisms/site-header'
import { Toaster } from '../../ui/sonner'
import { SiteShell } from '../site-shell'

export type StoryShellProps = {
  /** Which nav tab reads active — mirrors the app's pathname derivation. */
  active?: 'library' | 'search'
  paletteWords?: readonly SearchWordView[]
  children: ReactNode
}

/**
 * Storybook-only harness: assembles the full public chrome — the controls-filled
 * {@link SiteHeader}, the ⌘K palette, the mobile tab bar + FAB — inside the
 * {@link SiteShell} backdrop, so a page story renders exactly as the app mounts
 * it. Not for app code: the app wires real navigation in
 * `apps/web/src/chrome/site-chrome.client.tsx` + `app/(public)/layout.tsx` — keep
 * the composition in step when the app chrome changes. Navigation is stubbed here
 * (`#`-local hrefs, palette selections toast) so a story never escapes its iframe.
 */
export function StoryShell({ active = 'library', paletteWords = [], children }: StoryShellProps) {
  const [paletteOpen, setPaletteOpen] = useState(false)

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setPaletteOpen((open) => !open)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <SiteShell>
      <SiteHeader
        homeHref="#"
        searchHref="#"
        nav={[
          { label: 'Library', href: '#', active: active === 'library' },
          { label: 'Search', href: '#', active: active === 'search' },
        ]}
        commandTrigger={<CommandTrigger onOpen={() => setPaletteOpen(true)} />}
        languageMenu={<LanguageMenu />}
        languageBadge={<LanguageMenu compact />}
        themeMenu={<ThemeMenu />}
      />
      <CommandPalette
        open={paletteOpen}
        onOpenChange={setPaletteOpen}
        words={paletteWords}
        onSelect={(href) => toast(`Would navigate to ${href}`)}
        onGenerate={(query) => toast(`Would generate “${query}”`)}
      />
      <MobileTabBar
        tabs={[
          { icon: <HouseIcon />, label: 'Library', href: '#', active: active === 'library' },
          { icon: <SearchIcon />, label: 'Search', href: '#', active: active === 'search' },
          { icon: <SparklesIcon />, label: 'Jump', onSelect: () => setPaletteOpen(true) },
          {
            icon: <BookmarkIcon />,
            label: 'Saved',
            onSelect: () => toast('Would open /search?saved=1'),
          },
        ]}
      />
      <CommandFab onOpen={() => setPaletteOpen(true)} />
      <SiteContainer as="main" className="pb-24 md:pb-10">
        {children}
      </SiteContainer>
      <Toaster position="bottom-right" />
    </SiteShell>
  )
}

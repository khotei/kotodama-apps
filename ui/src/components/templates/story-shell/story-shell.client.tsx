'use client'

import { BookmarkIcon, HouseIcon, PlusIcon, SearchIcon, SparklesIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { useState } from 'react'
import { toast } from 'sonner'
import { CURRENT_LANGUAGE_MOCK, LANGUAGE_OPTIONS_MOCK } from '../../../fixtures/language.fixture'
import type { SearchWordView } from '../../../views/search.view'
import { Show } from '../../atoms/show'
import { SiteContainer } from '../../atoms/site-container'
import { CommandFab } from '../../molecules/command-fab'
import { CommandTrigger } from '../../molecules/command-trigger'
import { LanguageMenu } from '../../molecules/language-menu'
import { ThemeMenu } from '../../molecules/theme-menu'
import { MobileTabBar } from '../../organisms/mobile-tab-bar'
import { type CommandAction, SearchCommandPalette } from '../../organisms/search-command-palette'
import { SiteHeader } from '../../organisms/site-header'
import { Button } from '../../ui/button'
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
  const [paletteQuery, setPaletteQuery] = useState('')
  const typed = paletteQuery.trim()

  const actions: CommandAction[] = [
    {
      id: 'library',
      label: 'Go to Library',
      description: 'Home',
      icon: <HouseIcon />,
      keywords: ['home'],
      onSelect: () => toast('Would go to Library'),
    },
    {
      id: 'search',
      label: 'Search words',
      description: 'Open search',
      icon: <SearchIcon />,
      onSelect: () => toast('Would open search'),
    },
    {
      id: 'generate',
      label: typed ? `Add “${typed}”` : 'Add a new word',
      description: 'Generate an entry',
      icon: <PlusIcon />,
      keywords: ['create', 'new', 'generate', 'add'],
      forceMount: true,
      onSelect: () => toast(typed ? `Would generate “${typed}”` : 'Would add a new word'),
    },
    {
      id: 'saved',
      label: 'Saved words',
      description: 'Your bookmarks',
      icon: <BookmarkIcon />,
      onSelect: () => toast('Would open /search?saved=1'),
    },
  ]

  return (
    <SiteShell>
      <SiteHeader
        homeHref="#"
        nav={[
          { label: 'Library', href: '#', active: active === 'library' },
          { label: 'Search', href: '#', active: active === 'search' },
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
              <Button variant="ghost" size="icon-sm" aria-label="Search">
                <SearchIcon />
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
            <ThemeMenu />
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
        onSelectWord={(href) => toast(`Would navigate to ${href}`)}
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

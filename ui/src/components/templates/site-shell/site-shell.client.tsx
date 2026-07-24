'use client'

import {
  CommandPalette,
  MobileTabBar,
  type SearchWordView,
  SiteHeader,
  Toaster,
} from '@kotodama/ui'
import { BookmarkIcon, HouseIcon, PlusIcon, SearchIcon, SparklesIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export type SiteShellProps = {
  /** Which nav tab reads active — mirrors the app's pathname derivation. */
  active?: 'library' | 'search'
  paletteWords?: readonly SearchWordView[]
  children: ReactNode
}

/**
 * The assembled public shell around a page: the controls-filled {@link SiteHeader},
 * the ⌘K palette, the mobile tab bar + FAB, the paper grain, and the page `<main>`.
 * Wrap a page story in it and the page renders exactly as the app mounts it.
 *
 * Mirrors `apps/web/src/chrome/site-chrome.client.tsx` + `app/(public)/layout.tsx` —
 * keep the composition in step when the app chrome changes. Navigation is stubbed:
 * hrefs stay `#`-local and palette selections toast instead of routing, so a story
 * never escapes its iframe.
 */
export function SiteShell({ active = 'library', paletteWords = [], children }: SiteShellProps) {
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
    <div className="relative isolate min-h-screen">
      <div aria-hidden className="kdm-grain pointer-events-none fixed inset-0 z-0" />
      <div className="relative z-[1]">
        <SiteHeader
          variant="controls"
          homeHref="#"
          searchHref="#"
          nav={[
            { label: 'Library', href: '#', active: active === 'library' },
            { label: 'Search', href: '#', active: active === 'search' },
          ]}
          onCommandOpen={() => setPaletteOpen(true)}
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
        <button
          type="button"
          aria-label="Add or jump"
          onClick={() => setPaletteOpen(true)}
          className="fixed right-[18px] bottom-[76px] z-50 grid size-[54px] place-items-center rounded-full bg-seal text-seal-foreground shadow-hero md:hidden"
        >
          <PlusIcon className="size-6" />
        </button>
        <main className="mx-auto max-w-[1160px] px-5 pb-24 md:px-10 md:pb-10">{children}</main>
        <Toaster position="bottom-right" />
      </div>
    </div>
  )
}

'use client'

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Kbd,
} from '@kotodama/ui'
import { CommandPalette, MobileTabBar, type SearchWordView, SiteHeader } from '@kotodama/use-cases'
import { CheckIcon, ChevronDownIcon, GlobeIcon, SearchIcon } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import useKey from 'react-use/lib/useKey'
import { toast } from 'sonner'

// Active-state needs usePathname, the palette needs router.push, and the mode
// menu needs next-themes, so the chrome is wired here (the sanctioned apps/web
// bypass), not in use-cases. One component owns header + tab bar + palette —
// the Jump tab and the ⌘K trigger share the palette's open state.
import { ModeMenu } from './mode-menu.client'

const LANGUAGES = [
  { label: 'Spanish', available: true },
  { label: 'French', available: false },
  { label: 'German', available: false },
] as const

function LanguageMenu({ compact = false }: { compact?: boolean }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          {compact ? (
            'ES'
          ) : (
            <>
              <GlobeIcon /> Spanish <ChevronDownIcon />
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {LANGUAGES.map(({ label, available }) => (
          <DropdownMenuItem
            key={label}
            onSelect={() => {
              if (!available) {
                toast(`${label} isn’t available yet — staying on Spanish`)
              }
            }}
          >
            {label}
            {available && <CheckIcon className="ml-auto" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export type SiteChromeProps = {
  paletteWords: readonly SearchWordView[]
}

export function SiteChrome({ paletteWords }: SiteChromeProps) {
  const pathname = usePathname()
  const router = useRouter()
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
        commandTrigger={
          <Button
            variant="outline"
            size="sm"
            className="text-muted-foreground"
            onClick={() => setPaletteOpen(true)}
          >
            <SearchIcon />
            <span>Search or jump…</span>
            <Kbd>⌘K</Kbd>
          </Button>
        }
        languageMenu={<LanguageMenu />}
        languageBadge={<LanguageMenu compact />}
        modeMenu={<ModeMenu />}
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
          { icon: 'library', label: 'Library', href: '/', active: pathname === '/' },
          {
            icon: 'search',
            label: 'Search',
            href: '/search',
            active: pathname.startsWith('/search'),
          },
          { icon: 'jump', label: 'Jump', onSelect: () => setPaletteOpen(true) },
          { icon: 'saved', label: 'Saved', onSelect: () => router.push('/search?saved=1') },
        ]}
      />
    </>
  )
}

import { BookmarkIcon, HouseIcon, PlusIcon, SearchIcon } from 'lucide-react'
import { toast } from 'sonner'
import type { CommandAction } from '../components/features/search-command-palette'
import type { MobileTab } from '../components/organisms/mobile-tab-bar'
import type { SiteNavLink } from '../components/organisms/site-header'

export const CHROME_DESKTOP_NAV_MOCK: readonly SiteNavLink[] = [
  { label: 'Library', href: '/' },
  { label: 'Search', href: '/search' },
]

export const CHROME_MOBILE_NAV_MOCK: readonly MobileTab[] = [
  { icon: <HouseIcon />, label: 'Library', href: '/' },
  { icon: <SearchIcon />, label: 'Search', href: '/search' },
  { icon: <BookmarkIcon />, label: 'Saved', href: '/search?saved=1' },
]

/** Palette commands that toast instead of acting — the app injects router pushes. */
export const CHROME_COMMANDS_MOCK: readonly CommandAction[] = [
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
    label: (typed) => (typed ? `Add “${typed}”` : 'Add a new word'),
    description: 'Generate an entry',
    icon: <PlusIcon />,
    keywords: ['create', 'new', 'generate', 'add'],
    forceMount: true,
    onSelect: (typed) => toast(typed ? `Would generate “${typed}”` : 'Would add a new word'),
  },
  {
    id: 'saved',
    label: 'Saved words',
    description: 'Your bookmarks',
    icon: <BookmarkIcon />,
    onSelect: () => toast('Would open /search?saved=1'),
  },
]

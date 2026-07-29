import type { AppNavLink, MobileTab } from '@kotodama/ui'
import { BookmarkIcon, HouseIcon, SearchIcon } from 'lucide-react'

export const DESKTOP_NAV: readonly AppNavLink[] = [
  { label: 'Library', href: '/' },
  { label: 'Search', href: '/search' },
]

export const MOBILE_NAV: readonly MobileTab[] = [
  { icon: <HouseIcon />, label: 'Library', href: '/' },
  { icon: <SearchIcon />, label: 'Search', href: '/search' },
  { icon: <BookmarkIcon />, label: 'Saved', href: '/search?saved=1' },
]

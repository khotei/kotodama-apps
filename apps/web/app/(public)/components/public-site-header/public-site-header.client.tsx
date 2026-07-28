'use client'

import type { WordListItem } from '@kotodama/core/words'
import { type CommandAction, SiteChrome } from '@kotodama/ui'
import { BookmarkIcon, HouseIcon, PlusIcon, SearchIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { useState } from 'react'
import useMount from 'react-use/esm/useMount'
import { DEFAULT_LANGUAGE } from '@/src/language/language'
import { searchLibraryWords } from '@/src/server/words/word.actions'
import { wordHref } from '@/src/words/hrefs'
import { mapSearchWord } from '@/src/words/search.mapper'
import { LANGUAGES } from './languages'
import { DESKTOP_NAV, MOBILE_NAV } from './nav'

export function PublicSiteHeader() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [words, setWords] = useState<readonly WordListItem[]>([])

  const handleSearch = async (query: string) => {
    setWords(await searchLibraryWords(DEFAULT_LANGUAGE, query.trim()))
  }

  useMount(() => {
    void handleSearch('')
  })

  const searched = words.map((item) => mapSearchWord(item, DEFAULT_LANGUAGE))

  const commands: readonly CommandAction[] = [
    {
      id: 'library',
      label: 'Go to Library',
      description: 'Home',
      icon: <HouseIcon />,
      keywords: ['home'],
      onSelect: () => router.push('/'),
    },
    {
      id: 'search',
      label: 'Search words',
      description: 'Open search',
      icon: <SearchIcon />,
      onSelect: () => router.push('/search'),
    },
    {
      id: 'generate',
      label: (typed) => (typed ? `Add “${typed}”` : 'Add a new word'),
      description: 'Generate an entry',
      icon: <PlusIcon />,
      keywords: ['create', 'new', 'generate', 'add'],
      forceMount: true,
      onSelect: (typed) =>
        router.push(typed ? wordHref(DEFAULT_LANGUAGE, encodeURIComponent(typed)) : '/search'),
    },
    {
      id: 'saved',
      label: 'Saved words',
      description: 'Your bookmarks',
      icon: <BookmarkIcon />,
      onSelect: () => router.push('/search?saved=1'),
    },
  ]

  return (
    <SiteChrome
      nav={{ homeHref: '/', searchHref: '/search', desktop: DESKTOP_NAV, mobile: MOBILE_NAV }}
      commands={commands}
      words={{
        list: searched,
        onSearch: handleSearch,
        onSelect: (word) => router.push(word.href),
      }}
      language={{ current: DEFAULT_LANGUAGE, list: LANGUAGES }}
      theme={{ theme, onThemeChange: setTheme }}
    />
  )
}

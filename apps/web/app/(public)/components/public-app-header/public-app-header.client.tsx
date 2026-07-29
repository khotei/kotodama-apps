'use client'

import type { WordListItem } from '@kotodama/core/words'
import { AppHeader, type CommandAction, useDebouncedCallback } from '@kotodama/ui'
import { BookmarkIcon, HouseIcon, PlusIcon, SearchIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { useRef, useState } from 'react'
import useMount from 'react-use/esm/useMount'
import { DEFAULT_LANGUAGE } from '@/src/language/language'
import { loadWordSearch } from '@/src/words/server/word.loaders'
import { wordHref } from '@/src/words/words-hrefs'
import { mapSearchWord } from '@/src/words/words-search.mapper'
import { LANGUAGES } from './languages'
import { DESKTOP_NAV, MOBILE_NAV } from './nav'

const SEARCH_DEBOUNCE_MS = 1_000

export function PublicAppHeader() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [words, setWords] = useState<readonly WordListItem[]>([])

  const requestToken = useRef('')

  function searchWords(query: string) {
    const token = crypto.randomUUID()
    requestToken.current = token

    loadWordSearch(DEFAULT_LANGUAGE, query.trim()).then((r) => {
      // race condition fix
      const isFresh = token === requestToken.current
      if (isFresh) setWords(r.items)
    })
  }

  const handleSearch = useDebouncedCallback(searchWords, SEARCH_DEBOUNCE_MS)

  useMount(() => searchWords(''))

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
    <AppHeader
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

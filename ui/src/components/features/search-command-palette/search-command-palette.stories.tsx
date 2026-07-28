import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { CompassIcon, HouseIcon, LayersIcon, PlusIcon, SearchIcon } from 'lucide-react'
import { useState } from 'react'
import { SEARCH_WORDS_MOCK } from '../../../fixtures/search.fixture'
import type { PaletteItem } from './search-command-palette.client'
import { SearchCommandPalette } from './search-command-palette.client'

const meta: Meta<typeof SearchCommandPalette> = {
  title: 'Features/SearchCommandPalette',
  component: SearchCommandPalette,
}

export default meta
type Story = StoryObj<typeof SearchCommandPalette>

const ACTION_ITEMS: PaletteItem[] = [
  {
    entity: 'action',
    action: { id: 'library', label: 'Go to Library', description: 'Home', icon: <HouseIcon /> },
  },
  {
    entity: 'action',
    action: {
      id: 'search',
      label: 'Search words',
      description: 'Open search',
      icon: <SearchIcon />,
    },
  },
  {
    entity: 'action',
    action: {
      id: 'generate',
      label: 'Add a new word',
      description: 'Generate an entry',
      icon: <PlusIcon />,
      keywords: ['create', 'new', 'generate'],
      forceMount: true,
    },
  },
  {
    entity: 'action',
    action: {
      id: 'foundations',
      label: 'Design foundations',
      description: 'Tokens & components',
      icon: <LayersIcon />,
    },
  },
  {
    entity: 'action',
    action: {
      id: 'states',
      label: 'States gallery',
      description: 'See every screen state',
      icon: <CompassIcon />,
    },
  },
]

function OpenPalette() {
  const [open, setOpen] = useState(true)
  const [query, setQuery] = useState('')
  const items: PaletteItem[] = [
    ...ACTION_ITEMS,
    ...SEARCH_WORDS_MOCK.map((word): PaletteItem => ({ entity: 'word', word })),
  ]
  return (
    <>
      <button type="button" className="font-mono text-sm" onClick={() => setOpen(true)}>
        ⌘K open palette
      </button>
      <SearchCommandPalette
        open={open}
        onOpenChange={setOpen}
        query={query}
        onQueryChange={setQuery}
        items={items}
        onSelect={() => setOpen(false)}
      />
    </>
  )
}

export const Open: Story = { render: () => <OpenPalette /> }

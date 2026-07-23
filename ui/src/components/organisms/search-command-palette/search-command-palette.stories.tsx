import type { Meta, StoryObj } from '@storybook/react-vite'
import { CompassIcon, HouseIcon, LayersIcon, PlusIcon, SearchIcon } from 'lucide-react'
import { useState } from 'react'
import { SEARCH_WORDS_MOCK } from '../../../fixtures/search.fixture'
import type { CommandAction } from './search-command-palette.client'
import { SearchCommandPalette } from './search-command-palette.client'

const meta: Meta<typeof SearchCommandPalette> = {
  title: 'Organisms/SearchCommandPalette',
  component: SearchCommandPalette,
}

export default meta
type Story = StoryObj<typeof SearchCommandPalette>

const ACTIONS: CommandAction[] = [
  {
    id: 'library',
    label: 'Go to Library',
    description: 'Home',
    icon: <HouseIcon />,
    onSelect: () => {},
  },
  {
    id: 'search',
    label: 'Search words',
    description: 'Open search',
    icon: <SearchIcon />,
    onSelect: () => {},
  },
  {
    id: 'generate',
    label: 'Add a new word',
    description: 'Generate an entry',
    icon: <PlusIcon />,
    keywords: ['create', 'new', 'generate'],
    forceMount: true,
    onSelect: () => {},
  },
  {
    id: 'foundations',
    label: 'Design foundations',
    description: 'Tokens & components',
    icon: <LayersIcon />,
    onSelect: () => {},
  },
  {
    id: 'states',
    label: 'States gallery',
    description: 'See every screen state',
    icon: <CompassIcon />,
    onSelect: () => {},
  },
]

function OpenPalette() {
  const [open, setOpen] = useState(true)
  const [query, setQuery] = useState('')
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
        actions={ACTIONS}
        words={SEARCH_WORDS_MOCK}
        onSelectWord={() => setOpen(false)}
      />
    </>
  )
}

export const Open: Story = { render: () => <OpenPalette /> }

import type { Meta, StoryObj } from '@storybook/react-vite'
import { FileTextIcon, PaletteIcon, PlusIcon, RocketIcon, SettingsIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { useState } from 'react'
import { CommandPalette } from './command-palette.client'
import { CommandPaletteGroup, CommandPaletteItem } from './command-palette-item.client'

const meta: Meta<typeof CommandPalette> = {
  title: 'Organisms/CommandPalette',
  component: CommandPalette,
}

export default meta
type Story = StoryObj<typeof CommandPalette>

type Page = { id: string; label: string; description: string; icon: ReactNode; hint: string }

const PAGES: Page[] = [
  {
    id: 'getting-started',
    label: 'Getting started',
    description: 'Install & run',
    icon: <RocketIcon />,
    hint: 'Docs',
  },
  {
    id: 'components',
    label: 'Components',
    description: 'Every primitive',
    icon: <FileTextIcon />,
    hint: 'Docs',
  },
  {
    id: 'theming',
    label: 'Theming',
    description: 'Tokens & colour',
    icon: <PaletteIcon />,
    hint: 'Docs',
  },
  {
    id: 'settings',
    label: 'Settings',
    description: 'Preferences',
    icon: <SettingsIcon />,
    hint: '⌘,',
  },
  {
    id: 'new-file',
    label: 'New file',
    description: 'Blank document',
    icon: <PlusIcon />,
    hint: '⌘N',
  },
]

// The caller owns the search: it filters the list off `query` and renders only
// the matches, so `shouldFilter={false}` lets the palette show exactly that set.
function Demo() {
  const [open, setOpen] = useState(true)
  const [query, setQuery] = useState('')
  const q = query.trim().toLowerCase()
  const results = q === '' ? PAGES : PAGES.filter((page) => page.label.toLowerCase().includes(q))

  return (
    <>
      <button type="button" className="font-mono text-sm" onClick={() => setOpen(true)}>
        ⌘K open palette
      </button>
      <CommandPalette
        open={open}
        onOpenChange={setOpen}
        query={query}
        onQueryChange={setQuery}
        placeholder="Search pages…"
        shouldFilter={false}
      >
        <CommandPaletteGroup heading="Pages">
          {results.map((page) => (
            <CommandPaletteItem
              key={page.id}
              value={page.id}
              icon={page.icon}
              description={page.description}
              trailing={<span className="text-sm text-muted-foreground">{page.hint}</span>}
              onSelect={() => setOpen(false)}
            >
              {page.label}
            </CommandPaletteItem>
          ))}
        </CommandPaletteGroup>
      </CommandPalette>
    </>
  )
}

export const Default: Story = { render: () => <Demo /> }

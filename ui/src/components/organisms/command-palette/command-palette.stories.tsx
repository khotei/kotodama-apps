import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { SEARCH_WORDS_MOCK } from '../../../fixtures/search.fixture'
import { CommandPalette } from './command-palette.client'

const meta: Meta<typeof CommandPalette> = {
  title: 'Organisms/CommandPalette',
  component: CommandPalette,
}

export default meta
type Story = StoryObj<typeof CommandPalette>

function OpenPalette() {
  const [open, setOpen] = useState(true)
  return (
    <>
      <button type="button" className="font-mono text-sm" onClick={() => setOpen(true)}>
        ⌘K open palette
      </button>
      <CommandPalette
        open={open}
        onOpenChange={setOpen}
        words={SEARCH_WORDS_MOCK}
        onSelect={() => setOpen(false)}
        onGenerate={() => setOpen(false)}
      />
    </>
  )
}

export const Open: Story = { render: () => <OpenPalette /> }

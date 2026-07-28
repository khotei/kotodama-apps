import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { XIcon } from 'lucide-react'
import { Button } from '../../ui/button'
import { SearchBox } from './search-box'

const meta: Meta<typeof SearchBox> = {
  title: 'Molecules/SearchBox',
  component: SearchBox,
  parameters: { layout: 'padded' },
}

export default meta

type Story = StoryObj<typeof SearchBox>

export const Library: Story = {
  render: () => (
    <SearchBox
      placeholder="Look up a word in Spanish…"
      className="max-w-xl"
      actions={<Button>Look up →</Button>}
    />
  ),
}

export const WithClear: Story = {
  render: () => (
    <SearchBox
      defaultValue="mar"
      className="max-w-xl"
      actions={
        <>
          <Button variant="ghost" size="icon-sm" aria-label="Clear search">
            <XIcon />
          </Button>
          <Button>+ Add</Button>
        </>
      }
    />
  ),
}

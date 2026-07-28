import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { SEARCH_WORDS_MOCK } from '../../../fixtures/search.fixture'
import { StoryShell } from './story-shell.client'

const meta: Meta<typeof StoryShell> = {
  title: 'Templates/StoryShell',
  component: StoryShell,
  parameters: { layout: 'fullscreen' },
  args: { paletteWords: SEARCH_WORDS_MOCK },
}

export default meta
type Story = StoryObj<typeof StoryShell>

const placeholder = (
  <div className="grid min-h-[60vh] place-items-center text-muted-foreground">
    Page content renders here
  </div>
)

export const Library: Story = {
  args: { children: placeholder },
}

export const Search: Story = {
  args: { children: placeholder },
  parameters: { nextjs: { navigation: { pathname: '/search' } } },
}

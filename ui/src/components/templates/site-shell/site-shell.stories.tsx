import type { Meta, StoryObj } from '@storybook/react-vite'
import { SEARCH_WORDS_MOCK } from '../../../fixtures/search.fixture'
import { SiteShell } from './site-shell.client'

const meta: Meta<typeof SiteShell> = {
  title: 'Templates/SiteShell',
  component: SiteShell,
  parameters: { layout: 'fullscreen' },
  args: { paletteWords: SEARCH_WORDS_MOCK },
}

export default meta
type Story = StoryObj<typeof SiteShell>

export const Default: Story = {
  args: {
    children: (
      <div className="grid min-h-[60vh] place-items-center text-muted-foreground">
        Page content renders here
      </div>
    ),
  },
}

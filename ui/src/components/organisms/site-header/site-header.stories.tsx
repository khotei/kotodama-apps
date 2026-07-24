import type { Meta, StoryObj } from '@storybook/react-vite'
import { SiteHeader } from './site-header'

// Organisms/SiteHeader · the two shapes: bare nav-only, and the controls
// variant that self-fills the right-hand slots with the stock molecules.
const meta: Meta<typeof SiteHeader> = {
  title: 'Organisms/SiteHeader',
  component: SiteHeader,
  parameters: { layout: 'fullscreen' },
  args: {
    homeHref: '#',
    searchHref: '#',
    nav: [
      { label: 'Library', href: '#', active: true },
      { label: 'Search', href: '#' },
    ],
  },
}

export default meta
type Story = StoryObj<typeof SiteHeader>

export const Default: Story = {}

export const Controls: Story = {
  args: { variant: 'controls' },
}

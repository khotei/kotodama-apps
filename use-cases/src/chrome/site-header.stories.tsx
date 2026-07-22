import type { Meta, StoryObj } from '@storybook/react-vite'
import { SiteHeader } from './site-header'

const meta: Meta<typeof SiteHeader> = {
  title: 'Organisms/SiteHeader',
  component: SiteHeader,
  parameters: { layout: 'fullscreen' },
}

export default meta
type Story = StoryObj<typeof SiteHeader>

export const Default: Story = {
  args: {
    homeHref: '/',
    searchHref: '/search',
    nav: [
      { label: 'Library', href: '/', active: true },
      { label: 'Search', href: '/search' },
    ],
  },
}

import type { Meta, StoryObj } from '@storybook/react-vite'
import { MobileTabBar } from './mobile-tab-bar'

// Fixed bottom bar, `md:hidden` — view under a mobile viewport to see it.
const meta: Meta<typeof MobileTabBar> = {
  title: 'Organisms/MobileTabBar',
  component: MobileTabBar,
  parameters: { layout: 'fullscreen' },
}

export default meta
type Story = StoryObj<typeof MobileTabBar>

export const Default: Story = {
  args: {
    tabs: [
      { icon: 'library', label: 'Library', href: '/', active: true },
      { icon: 'search', label: 'Search', href: '/search' },
      { icon: 'jump', label: 'Jump' },
      { icon: 'saved', label: 'Saved', href: '/search?saved=1' },
    ],
  },
}

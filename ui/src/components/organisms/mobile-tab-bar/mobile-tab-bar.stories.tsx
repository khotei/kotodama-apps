import type { Meta, StoryObj } from '@storybook/react-vite'
import { BookmarkIcon, HouseIcon, SearchIcon, SparklesIcon } from 'lucide-react'
import { MobileTabBar } from './mobile-tab-bar'

// Fixed bottom bar, `md:hidden` — the story opens in a phone viewport so it shows.
const meta: Meta<typeof MobileTabBar> = {
  title: 'Organisms/MobileTabBar',
  component: MobileTabBar,
  parameters: { layout: 'fullscreen' },
  globals: { viewport: { value: 'iphonex' } },
}

export default meta
type Story = StoryObj<typeof MobileTabBar>

export const Default: Story = {
  args: {
    tabs: [
      { icon: <HouseIcon />, label: 'Library', href: '/', active: true },
      { icon: <SearchIcon />, label: 'Search', href: '/search' },
      { icon: <SparklesIcon />, label: 'Jump' },
      { icon: <BookmarkIcon />, label: 'Saved', href: '/search?saved=1' },
    ],
  },
}

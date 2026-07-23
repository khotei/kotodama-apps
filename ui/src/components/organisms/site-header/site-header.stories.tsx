import type { Meta, StoryObj } from '@storybook/react-vite'
import { CommandTrigger } from '../../molecules/command-trigger'
import { LanguageMenu } from '../../molecules/language-menu'
import { ThemeMenu } from '../../molecules/theme-menu'
import { SiteHeader } from './site-header'

// Organisms/SiteHeader · the two shapes: bare nav-only, and the filled header
// whose right-hand control slots the composer wires (here: the stock molecules).
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
  args: {
    commandTrigger: <CommandTrigger onOpen={() => {}} />,
    languageMenu: <LanguageMenu />,
    languageBadge: <LanguageMenu compact />,
    themeMenu: <ThemeMenu />,
  },
}

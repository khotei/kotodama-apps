import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { CURRENT_LANGUAGE_MOCK, LANGUAGE_OPTIONS_MOCK } from '../../../fixtures/language.fixture'
import { AppControls } from '../app-controls'
import { AppHeader } from './app-header.client'

// Organisms/AppHeader · the two shapes: bare nav-only, and the filled header
// whose `controls` slot the composer wires (here: the stock AppControls
// cluster). The active link derives from the mocked pathname
// (`parameters.nextjs.navigation`), never from a prop.
const meta: Meta<typeof AppHeader> = {
  title: 'Organisms/AppHeader',
  component: AppHeader,
  parameters: { layout: 'fullscreen' },
  args: {
    homeHref: '/',
    nav: [
      { label: 'Library', href: '/' },
      { label: 'Search', href: '/search' },
    ],
  },
}

export default meta
type Story = StoryObj<typeof AppHeader>

export const Default: Story = {}

export const OnSearch: Story = {
  parameters: { nextjs: { navigation: { pathname: '/search' } } },
}

export const Controls: Story = {
  args: {
    controls: (
      <AppControls
        search={{
          label: 'Search or jump…',
          shortcut: 'k',
          onTrigger: () => {},
          mobileHref: '/search',
        }}
        language={{ current: CURRENT_LANGUAGE_MOCK, list: LANGUAGE_OPTIONS_MOCK }}
        theme={{}}
      />
    ),
  },
}

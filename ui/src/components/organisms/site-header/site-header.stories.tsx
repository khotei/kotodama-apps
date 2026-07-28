import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { SearchIcon } from 'lucide-react'
import { CURRENT_LANGUAGE_MOCK, LANGUAGE_OPTIONS_MOCK } from '../../../fixtures/language.fixture'
import { Show } from '../../atoms/show'
import { CommandTrigger } from '../../molecules/command-trigger'
import { LanguageMenu } from '../../molecules/language-menu'
import { ThemeMenu } from '../../molecules/theme-menu'
import { Button } from '../../ui/button'
import { SiteHeader } from './site-header.client'

// Organisms/SiteHeader · the two shapes: bare nav-only, and the filled header
// whose `controls` slot the composer wires (here: the stock molecules), each
// gated by viewport with <Show>. The active link derives from the mocked
// pathname (`parameters.nextjs.navigation`), never from a prop.
const meta: Meta<typeof SiteHeader> = {
  title: 'Organisms/SiteHeader',
  component: SiteHeader,
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
type Story = StoryObj<typeof SiteHeader>

export const Default: Story = {}

export const OnSearch: Story = {
  parameters: { nextjs: { navigation: { pathname: '/search' } } },
}

export const Controls: Story = {
  args: {
    controls: (
      <>
        <Show on="desktop">
          <CommandTrigger label="Search or jump…" shortcut="k" onTrigger={() => {}} />
        </Show>
        <Show on="mobile">
          <Button variant="ghost" size="icon-sm" aria-label="Search">
            <SearchIcon />
          </Button>
        </Show>
        <Show on="desktop">
          <LanguageMenu current={CURRENT_LANGUAGE_MOCK} languages={LANGUAGE_OPTIONS_MOCK} />
        </Show>
        <Show on="mobile">
          <LanguageMenu compact current={CURRENT_LANGUAGE_MOCK} languages={LANGUAGE_OPTIONS_MOCK} />
        </Show>
        <ThemeMenu />
      </>
    ),
  },
}

import type { Meta, StoryObj } from '@storybook/react-vite'
import { SiteContainer } from '../../atoms/site-container'
import { WordLoadingView } from './word-loading-view'

const meta: Meta<typeof WordLoadingView> = {
  title: 'Features/WordLoadingView',
  component: WordLoadingView,
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <SiteContainer>
        <Story />
      </SiteContainer>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof WordLoadingView>

export const Loading: Story = { args: { backHref: '/' } }

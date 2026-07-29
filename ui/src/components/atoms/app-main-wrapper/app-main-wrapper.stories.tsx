import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { AppMainWrapper } from './app-main-wrapper'

const meta: Meta<typeof AppMainWrapper> = {
  title: 'Atoms/AppMainWrapper',
  component: AppMainWrapper,
  parameters: { layout: 'fullscreen' },
}

export default meta

type Story = StoryObj<typeof AppMainWrapper>

export const Default: Story = {
  render: () => (
    <AppMainWrapper>
      <div className="grid h-40 place-items-center rounded-lg border border-border-strong border-dashed bg-card text-center text-muted-foreground">
        The page main region — site gutter + standard bottom rhythm
      </div>
    </AppMainWrapper>
  ),
}

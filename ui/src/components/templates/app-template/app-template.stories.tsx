import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { AppTemplate } from './app-template'

const meta: Meta<typeof AppTemplate> = {
  title: 'Templates/AppTemplate',
  component: AppTemplate,
  parameters: { layout: 'fullscreen' },
}

export default meta
type Story = StoryObj<typeof AppTemplate>

export const Default: Story = {
  render: () => (
    <AppTemplate>
      <div className="grid min-h-screen place-items-center text-muted-foreground">
        App content sits on the paper-grain backdrop
      </div>
    </AppTemplate>
  ),
}

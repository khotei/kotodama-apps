import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { AppShell } from './app-shell'

const meta: Meta<typeof AppShell> = {
  title: 'Templates/AppShell',
  component: AppShell,
  parameters: { layout: 'fullscreen' },
}

export default meta
type Story = StoryObj<typeof AppShell>

export const Default: Story = {
  render: () => (
    <AppShell>
      <div className="grid min-h-screen place-items-center text-muted-foreground">
        App content sits on the paper-grain backdrop
      </div>
    </AppShell>
  ),
}
